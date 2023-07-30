if (!cc) {
    var cc = require("../test/testBattle");
    var utils = require("../util/utils");
    var itemConfig = require("../data/itemConfig");
    var monsterConfig = require("../data/monsterConfig");
    var testBattleConfig;
}

var BattleConfig = {
    LINE_LENGTH: 6,
    //现实距离,m
    MAX_REAL_DISTANCE: 1000,
    REAL_DISTANCE_PER_LINE: 100,
    //逃生时间
    ESCAPE_TIME: 1.5,
    BULLET_ID: 1305011
}

var Battle = cc.Class.extend({
    ctor: function (battleInfo, isDodge, difficulty) {
        this.battleInfo = battleInfo;
        this.isDodge = isDodge;
        this.difficulty = difficulty;
        var monsterList = this.battleInfo.monsterList;

        this.indicateLines = [];
        for (var i = 0; i < 6; i++) {
            this.indicateLines.push({
                index: i,
                monster: null
            });
        }

        var self = this;
        this.monsters = monsterList.map(function (monId) {
            return new Monster(self, monId);
        });
        this.updateTargetMonster();
        this.monsters[0].moveToLine(this.getLastLine());
        this.processLog(stringUtil.getString(1045, this.monsters.length));

        cc.director.getScheduler().scheduleCallbackForTarget(this, this.updateMonster, 1, cc.REPEAT_FOREVER);
        cc.director.getScheduler().scheduleCallbackForTarget(this, this.updatePlayer, 0.1, cc.REPEAT_FOREVER);
        if (this.isDodge) {
            this.dodgeTime = 5;
            this.dodgePassTime = 0;
            cc.director.getScheduler().scheduleCallbackForTarget(this, this.dodgeEnd, 0.1, cc.REPEAT_FOREVER);
        }

        var playerObj;
        if (testBattleConfig) {
            var pobj = testBattleConfig.player;
            playerObj = {
                bulletNum: Number(pobj["weapon1_num"]),
                toolNum: Number(pobj["tool_num"]),
                hp: pobj["hp"],
                virus: pobj["virus"],
                virusMax: pobj["virusMax"],
                def: pobj["def"] || 0,
                weapon1: pobj["weapon1"],
                weapon2: pobj["weapon2"],
                equip: pobj["tool"]
            };
        } else {
            playerObj = {
                bulletNum: player.bag.getNumByItemId(BattleConfig.BULLET_ID),
                toolNum: player.bag.getNumByItemId(player.equip.getEquip(EquipmentPos.TOOL)),
                hp: player.hp,
                virus: player.virus,
                virusMax: player.virusMax,
                injury: player.injury,
                weapon1: player.equip.getEquip(EquipmentPos.GUN),
                weapon2: player.equip.getEquip(EquipmentPos.WEAPON),
                equip: player.equip.getEquip(EquipmentPos.TOOL)
            };
            playerObj.def = player.equip.getEquip(EquipmentPos.EQUIP) ? itemConfig[player.equip.getEquip(EquipmentPos.EQUIP)].effect_arm.def : 0;
        }

        this.player = new BattlePlayer(this, playerObj);

        this.isMonsterStop = false;

        this.sumRes = {
            id: this.battleInfo.id,
            underAtk: 0,
            totalVirus: 0,
            totalHarm: 0,
            weapon1: 0,
            weapon2: 0,
            bulletNum: 0,
            tools: 0,
            win: false,
            isDodge: this.isDodge,
            monsterKilledNum: 0
        };

        cc.timer.pause();
        audioManager.insertMusic(audioManager.music.BATTLE);

        this.isBattleEnd = false;
    },
    dodgeEnd: function (dt) {
        this.dodgePassTime += dt;
        utils.emitter.emit("battleDodgePercentage", this.dodgePassTime / this.dodgeTime * 100);
        if (this.dodgePassTime >= this.dodgeTime) {

            this.gameEnd(true);
        }
    },
    updatePlayer: function (dt) {
        if (!this.isDodge) {
            this.player.action();
        }
    },
    updateMonster: function (dt) {
        if (!this.isMonsterStop) {
            this.monsters.forEach(function (mon) {
                mon.move();
            });
        }
    },
    removeMonster: function (monster) {
        var targetIndex = -1;
        this.monsters.forEach(function (mon, index) {
            if (mon == monster) {
                targetIndex = index;
            }
        });

        if (targetIndex != -1) {
            this.monsters.splice(targetIndex, 1);
        }

        utils.emitter.emit("battleMonsterLength", this.monsters.length);
        this.updateTargetMonster();
    },

    checkGameEnd: function () {
        if (this.monsters.length === 0) {
            this.gameEnd(true);
            return true;
        } else {
            return false;
        }
    },

    gameEnd: function (isWin) {
        this.isBattleEnd = true;

        this.sumRes.win = isWin;
        this.isMonsterStop = true;
        cc.director.getScheduler().unscheduleCallbackForTarget(this, this.updateMonster);
        cc.director.getScheduler().unscheduleCallbackForTarget(this, this.updatePlayer);
        if (this.isDodge) {
            cc.director.getScheduler().unscheduleCallbackForTarget(this, this.dodgeEnd);
        }
        monsterId = 0;

        //结算
        if (!testBattleConfig) {
            player.bag.setItem(BattleConfig.BULLET_ID, this.player.bulletNum);
            if (this.player.equip) {
                this.sumRes.toolItemId = player.equip.getEquip(EquipmentPos.TOOL);
                player.bag.setItem(this.sumRes.toolItemId, this.player.toolNum);
                if (this.player.toolNum == 0) {
                    player.equip.unequip(EquipmentPos.TOOL);
                }
            }
        }

        if (isWin) {
            if (!this.isDodge) {
                player.log.addMsg(1118);
            }

            var brokenWeapon = [];
            var gunItemId = player.equip.getEquip(EquipmentPos.GUN);
            if (gunItemId && this.sumRes.weapon1 > 0 && player.bag.testWeaponBroken(gunItemId, 0)) {
                brokenWeapon.push(gunItemId);
            }
            var weaponItemId = player.equip.getEquip(EquipmentPos.WEAPON);
            if (weaponItemId && weaponItemId != Equipment.HAND && this.sumRes.weapon2 > 0 && player.bag.testWeaponBroken(weaponItemId, 0)) {
                brokenWeapon.push(weaponItemId);
            }
            if (this.sumRes.totalHarm > 0) {
                var armItemId = player.equip.getEquip(EquipmentPos.EQUIP);
                if (armItemId && player.bag.testWeaponBroken(armItemId, 1)){
                    brokenWeapon.push(armItemId);
                }
            }
            this.sumRes.brokenWeapon = brokenWeapon;
        }

        if (this.gameEndListener) {
            this.gameEndListener.call(this, this.sumRes);
        }
        cc.timer.resume();
        audioManager.resumeMusic();
    },

    getLastLine: function () {
        return this.indicateLines[this.indicateLines.length - 1];
    },

    updateTargetMonster: function () {
        this.targetMon = this.monsters[0];
    },

    setGameEndListener: function (listener) {
        this.gameEndListener = listener;
    },

    processLog: function (log, color, bigger) {
        utils.emitter.emit("battleProcessLog", {
            log: log,
            color: color,
            bigger: bigger
        });
    }
});

var monsterId = 0;
var Monster = cc.Class.extend({
    ctor: function (battle, type) {
        this.id = monsterId++;
        this.battle = battle;
        this.attr = utils.clone(monsterConfig[type]);
        this.dead = false;
        this.line = null;
    },
    playEffect: function (soundName) {
        if (this.effectId) {
            audioManager.stopEffect(this.effectId);
        }
        this.effectId = audioManager.playEffect(soundName);
    },
    move: function () {
        var targetLine;
        if (this.line) {
            var monsterSpeed = this.attr.speed + player.weather.getValue("monster_speed");
            monsterSpeed = Math.max(monsterSpeed, 1);
            var targetIndex = this.line.index - monsterSpeed;
            targetIndex = Math.max(0, targetIndex);
            for (var startIndex = this.line.index - 1, endIndex = targetIndex, i = startIndex; i >= endIndex; i--) {
                var l = this.battle.indicateLines[i];
                if (!l.monster) {
                    targetLine = l;
                } else {
                    break;
                }
            }
        } else {
            //首先选择最后一条线
            targetLine = this.battle.getLastLine();
        }
        if (targetLine && !targetLine.monster) {
            this.moveToLine(targetLine);
        }

        if (this.line && this.isInRange()) {
            cc.director.getScheduler().scheduleCallbackForTarget(this, this.atk, this.attr.attackSpeed, 1);
        }
    },

    moveToLine: function (l) {
        if (l === this.line)
            return;

        if (this.line) {
            this.line.monster = null;
        }
        l.monster = this;
        this.line = l;
        if (this.id == this.battle.targetMon.id) {
            this.battle.processLog(stringUtil.getString(1046, stringUtil.getString("monsterType_" + this.attr.prefixType), l.index));
        }
    },
    atk: function () {
        if (this.battle.isBattleEnd || this.dead){
            return;
        }
        this.playEffect(audioManager.sound.MONSTER_ATTACK);
        var player = this.battle.player;
        player.underAtk(this);
        if (player.isDie()) {
            cc.director.getScheduler().unscheduleCallbackForTarget(this, this.atk);
        }
    },
    underAtk: function (obj) {
        var harm = 0;
        if (obj instanceof Weapon) {
            harm = obj.getHarm(this);

            if (obj instanceof Gun) {
                this.battle.processLog(stringUtil.getString(1048, obj.itemConfig.name, stringUtil.getString("monsterType_" + this.attr.prefixType)));
            } else {
                if (obj.id === Equipment.HAND) {
                    this.battle.processLog(stringUtil.getString(1165, stringUtil.getString("monsterType_" + this.attr.prefixType)));
                } else {
                    this.battle.processLog(stringUtil.getString(1049, obj.itemConfig.name, stringUtil.getString("monsterType_" + this.attr.prefixType)));
                }
            }

            if (harm === Number.MAX_VALUE) {
                this.battle.processLog(stringUtil.getString(1051, stringUtil.getString("monsterType_" + this.attr.prefixType)));
            } else if (harm === 0) {
                this.battle.processLog(stringUtil.getString(1054));
            } else {
                this.battle.processLog(stringUtil.getString(1052, stringUtil.getString("monsterType_" + this.attr.prefixType), harm));
            }

        } else if (obj instanceof Bomb) {
            harm = obj.attr.atk;
        }

        this.attr.hp -= harm;
        this.attr.hp = Math.max(0, this.attr.hp);

        if (this.attr.hp == 0) {
            this.die(obj);
        }
    },
    die: function (obj) {
        this.battle.sumRes.monsterKilledNum++;
        this.dead = true;
        this.battle.removeMonster(this);
        if (obj instanceof Bomb) {
            obj.deadMonsterNum++;
        } else {
            var logStr = stringUtil.getString(1056, 1, stringUtil.getString("monsterType_" + this.attr.prefixType));
            if (cc.sys.localStorage.getItem("language") === cc.sys.LANGUAGE_ENGLISH) {
                logStr = logStr.replace('zombies', 'zombie');
            }
            this.battle.processLog(logStr);
            this.battle.checkGameEnd();
        }
        if (this.line) {
            this.line.monster = null;
        }
        audioManager.playEffect(audioManager.sound.MONSTER_DIE);
    },
    isInRange: function () {
        return this.line.index == 0;
    },
    isDie: function () {
        return this.dead;
    }
});

var BattlePlayer = cc.Class.extend({
    ctor: function (battle, playerObj) {
        this.battle = battle;

        this.hp = playerObj.hp;
        this.virus = playerObj.virus;
        this.maxHp = this.hp;
        this.injury = playerObj.injury;
        this.def = playerObj.def;

        this.bulletNum = playerObj.bulletNum;
        this.toolNum = playerObj.toolNum;

        this.weapon1 = createEquipment(playerObj.weapon1, this);
        this.weapon2 = createEquipment(playerObj.weapon2, this);
        this.equip = createEquipment(playerObj.equip, this);
    },
    action: function (dt) {
        this.useWeapon1();
        this.useWeapon2();
        this.useEquip();
    },
    underAtk: function (monster) {
        var harm = monster.attr.attack - this.def;
        harm = Math.max(1, harm);
        this.hp -= harm;

        this.battle.processLog(stringUtil.getString(1047, stringUtil.getString("monsterType_" + monster.attr.prefixType), "-" + harm), cc.color.RED);
        this.battle.sumRes.totalHarm += harm;
        this.battle.sumRes.underAtk++;
        this.hp = Math.max(0, this.hp);
        if (this.hp == 0) {
            this.die();
        }
        //每次收到攻击,外伤等级+1
        if (harm > 0) {
            player.changeAttr("hp", -harm);
            player.changeAttr("injury", 1);
            var rand = Math.random();
            var threshold = 0.9;
            if (player.equip.isEquiped(1304023)) {
                threshold = 0.5;
            } else if (player.equip.isEquiped(1304012)) {
                threshold = 0.7;
            }
            if (rand <= threshold && this.battle.difficulty > 2 && !player.buffManager.isBuffEffect(BuffItemEffectType.ITEM_1107052)) {
                this.battle.sumRes.totalVirus += 1;
            }
        }
        player.changeAttr("injury", 1);
    },
    die: function () {
        player.log.addMsg(1109);
        this.battle.processLog(stringUtil.getString(1057));
        this.battle.gameEnd(false);
    },
    isDie: function () {
        return this.hp <= 0;
    },
    useWeapon1: function () {
        if (!this.weapon1) {
            return;
        }
        this.weapon1.action();
        this.interruptEscape();
    },
    useWeapon2: function () {
        if (!this.weapon2) {
            return;
        }
        this.weapon2.action();
        this.interruptEscape();
    },
    useEquip: function () {
        if (!this.equip) {
            return;
        }
        this.equip.action();
        this.interruptEscape();
    },
    escape: function () {
        cc.director.getScheduler().scheduleCallbackForTarget(this, this.escapeAction, BattleConfig.ESCAPE_TIME, 1);
    },
    escapeAction: function () {
        this.battle.gameEnd(false);
    },
    interruptEscape: function () {
        cc.director.getScheduler().unscheduleCallbackForTarget(this, this.escapeAction);
    }
});

var createEquipment = function (id, bPlayer) {
    if (!id)
        return null;
    switch (Number(id)) {
        case 1303012:
        case 1303033:
        case 1303044:
            return new Bomb(id, bPlayer);
        case 1303022:
            return new Trap(id, bPlayer);
        case 1302011:
        case 1302021:
        case 1302032:
        case 1302043:
        case Equipment.HAND:
            return new Weapon(id, bPlayer);
        case 1301071:
        case 1301082:
            return new ElectricGun(id, bPlayer);
        default:
            return new Gun(id, bPlayer);
    }
}

var BattleEquipment = cc.Class.extend({
    ctor: function (id, bPlayer) {
        this.id = id;
        this.bPlayer = bPlayer;

        if (this.id === Equipment.HAND) {
            this.itemConfig = utils.clone(itemConfig[1302011]);
            this.itemConfig.name = stringUtil.getString(1063);
            this.itemConfig.effect_weapon.atk = 20;
            this.itemConfig.effect_weapon.atkCD = 1;
        } else {
            this.itemConfig = utils.clone(itemConfig[this.id]);
            this.itemConfig.name = stringUtil.getString(this.id).title;
        }
        this.attr = this.itemConfig["effect_weapon"];
        this.isInAtkCD = false;
    },
    action: function () {
        if (this.isInAtkCD)
            return;
        this.beforeCd();
        this.isInAtkCD = true;
        var func = function () {
            this.isInAtkCD = false;
            cc.director.getScheduler().unscheduleCallbackForTarget(this, func);
            if (!this.bPlayer.battle.isBattleEnd) {
                this.afterCd();
            }
        };
        cc.director.getScheduler().scheduleCallbackForTarget(this, func, this.attr.atkCD * player.vigourEffect(), 1);
    },
    _action: function () {
    },
    beforeCd: function () {
    },
    afterCd: function () {
    },
    cost: function () {
        this.bPlayer.toolNum--;
    },
    isEnough: function () {
        return this.bPlayer.toolNum > 0;
    }
});

var Bomb = BattleEquipment.extend({
    ctor: function (id, bPlayer) {
        this._super(id, bPlayer);
        this.deadMonsterNum = 0;
    },
    _action: function () {
        if (!this.isEnough()) {
            console.log(this.id + " not enough");
            return;
        }
        audioManager.playEffect(audioManager.sound.BOMB);
        this.bPlayer.battle.sumRes.tools++;
        var monsters = this.bPlayer.battle.monsters.concat();
        var harm = this.attr.atk;
        var self = this;
        monsters.forEach(function (mon) {
            mon.underAtk(self);
        });
        this.cost();
        this.bPlayer.battle.processLog(stringUtil.getString(1050, this.itemConfig.name), cc.color(255, 128, 0));
        this.bPlayer.battle.processLog(stringUtil.getString(1053, harm), cc.color(255, 128, 0));

        if (this.deadMonsterNum > 0) {
            var logStr = stringUtil.getString(stringUtil.getString(1056, this.deadMonsterNum, ""));
            if (cc.sys.localStorage.getItem("language") === cc.sys.LANGUAGE_ENGLISH) {
                if (this.deadMonsterNum == 1) {
                    logStr = logStr.replace('zombies', 'zombie');
                }
            }
            this.bPlayer.battle.processLog(logStr);
            this.deadMonsterNum = 0;
            this.bPlayer.battle.checkGameEnd();
        }
    },
    afterCd: function () {
        this._action();
    }
});

var Trap = BattleEquipment.extend({
    ctor: function (id, bPlayer) {
        this._super(id, bPlayer);
    },
    _action: function () {
        if (!this.isEnough()) {
            console.log(this.id + " not enough");
            return;
        }
        audioManager.playEffect(audioManager.sound.TRAP);
        this.bPlayer.battle.sumRes.tools++;
        this.bPlayer.battle.isMonsterStop = true;
        this.cost();
        this.bPlayer.battle.processLog(stringUtil.getString(1050, this.itemConfig.name));
        this.bPlayer.battle.processLog(stringUtil.getString(1055));
    },
    afterCd: function () {
        this._action();
        this.bPlayer.battle.isMonsterStop = false;
    }
});

var Weapon = BattleEquipment.extend({
    ctor: function (id, bPlayer) {
        this._super(id, bPlayer);
    },
    playEffect: function (soundName) {
        if (this.effectId) {
            audioManager.stopEffect(this.effectId);
        }
        this.effectId = audioManager.playEffect(soundName);
    },
    _action: function () {
        var monster = this.getTarget();
        if (monster && this.isInRange(monster) && !monster.isDie()) {
            this.bPlayer.battle.sumRes.weapon2++;
            monster.underAtk(this);

            var soundName;
            if (this.id == 1302043) {
                soundName = audioManager.sound.ATTACK_1;
            } else if (this.id == 1302011) {
                soundName = audioManager.sound.ATTACK_2;
            } else if (this.id == Equipment.HAND) {
                soundName = audioManager.sound.PUNCH;
            } else {
                soundName = audioManager.sound.ATTACK_6;
            }
            this.playEffect(soundName);
        }
    },
    beforeCd: function () {
        this._action();
    },
    getTarget: function () {
        return this.bPlayer.battle.targetMon;
    },

    getHarm: function (monster) {
        return this.attr.atk;
    },
    isInRange: function (monster) {
        if (monster.line) {
            return this.attr.range >= monster.line.index;
        } else {
            return false;
        }
    }
});

var Gun = Weapon.extend({
    ctor: function (id, bPlayer) {
        this._super(id, bPlayer);
        //初始化子弹
        this.bulletConfig = utils.clone(itemConfig[BattleConfig.BULLET_ID]["effect_weapon"]);
    },
    _action: function () {
        var monster = this.getTarget();
        if (monster && this.isInRange(monster)) {
            if (this.isEnough()) {
                this.bPlayer.battle.sumRes.weapon1++;

                var soundName;
                if (this.id == 1301022 || this.id == 1301052) {
                    soundName = audioManager.sound.ATTACK_3;
                } else if (this.id == 1301011 || this.id == 1301041) {
                    soundName = audioManager.sound.ATTACK_4;
                } else if (this.id == 1301033 || this.id == 1301063) {
                    soundName = audioManager.sound.ATTACK_5;
                } else {
                    soundName = audioManager.sound.ATTACK_4;
                }
                this.playEffect(soundName);

            }
            this.atkTimes = 0;
            for (var i = 0; i < this.attr.bulletMax; i++) {
                if (this.isEnough() && !monster.isDie()) {
                    this.atkTimes++;
                    monster.underAtk(this);
                    this.cost();
                } else {
                    break;
                }
            }
        }
    },
    getHarm: function (monster) {
        var dtLineIndex = BattleConfig.LINE_LENGTH - 1 - monster.line.index;
        var precise = this.attr.precise + this.attr.dtPrecise * dtLineIndex;
        var deathHit = this.attr.deathHit + this.attr.dtDeathHit * dtLineIndex;
        var scale = 1;
        precise = scale * precise;
        deathHit = scale * deathHit;
        precise = IAPPackage.getPreciseEffect(precise);
        precise += player.weather.getValue("gun_precise");

        var decPrecise = (100 - player.spirit) * 0.0035;
        precise -= decPrecise;
        
        var currentTime = Number(cc.timer.time);
        currentTime -= player.lastAlcoholTime;
        if (currentTime <= 43200) {
            currentTime = 43200 - currentTime;
            currentTime = Math.ceil(currentTime / 3600);
            precise -= 0.2 * currentTime;
        }

        var rand = Math.random();
        if (rand <= deathHit) {
            return Number.MAX_VALUE;
        }

        rand = Math.random();
        if (rand <= precise) {
            return this.getBulletHarm();
        }
        return 0;
    },
    cost: function () {
        this.bPlayer.bulletNum--;
        this.bPlayer.battle.sumRes.bulletNum++;

        if (this.bPlayer.bulletNum === 0) {
            this.bPlayer.battle.processLog(stringUtil.getString(1164));
        }
    },
    isEnough: function () {
        return this.bPlayer.bulletNum > 0;
    },
    getBulletHarm: function () {
        return this.bulletConfig.atk;
    }
});

var ElectricGun = Gun.extend({
    ctor: function (id, bPlayer) {
        this._super(id, bPlayer);
    },
    _action: function () {
        var monster = this.getTarget();
        if (monster && this.isInRange(monster)) {
            if (this.isEnough()) {
                this.bPlayer.battle.sumRes.weapon1++;
                var soundName;
                if (this.id == 1301071) {
                    soundName = audioManager.sound.ATTACK_7;
                } else if (this.id == 1301082) {
                    soundName = audioManager.sound.ATTACK_8;
                }
                this.playEffect(soundName);
            }
            this.atkTimes = 0;
            for (var i = 0; i < this.attr.bulletMax; i++) {
                if (this.isEnough() && !monster.isDie()) {
                    this.atkTimes++;
                    monster.underAtk(this);
                    this.cost();
                } else {
                    break;
                }
            }
        }
    },
    cost: function () {
    },
    isEnough: function () {
        return player.map.getSite(WORK_SITE).isActive;
    },
    getBulletHarm: function () {
        return this.attr.atk;
    }
});

var B = module.exports;
B.Battle = Battle;
B.config = function (c) {
    testBattleConfig = c;
}