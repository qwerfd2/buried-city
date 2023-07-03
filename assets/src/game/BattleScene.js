var BattleLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        this.controlNode = new ControlNode();
        this.addChild(this.controlNode);

        this.battleNode = new BattleNode();
        this.battleNode.setPosition(0, this.controlNode.getContentSize().height);
        this.addChild(this.battleNode);

        return true;
    },

    onExit: function () {
        this._super();
    },

    onEnter: function () {
        this._super();
    },
});

var BattleConfig = {
    LINE_LENGTH: 6,
    //现实距离,m
    MAX_REAL_DISTANCE: 1000,
    REAL_DISTANCE_PER_LINE: 100,
    //逃生时间
    ESCAPE_TIME: 1.5
}

var BattleNode = cc.Node.extend({
    ctor: function () {
        this._super();

        this.setContentSize(cc.winSize.width, 823);

        var bg = new cc.Sprite("res/bg.png");
        bg.setAnchorPoint(0.5, 0);
        bg.setPosition(cc.winSize.width / 2, 0);
        this.addChild(bg);

        this.scratch = autoSpriteFrameController.getSpriteFromSpriteName("#scratch/1.png");
        this.scratch.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        this.addChild(this.scratch, 1000);
        this.scratch.setVisible(false);

        this.initArea();
        //for test
        var drawNode = new cc.DrawNode();
        this.addChild(drawNode);

        this.indicateLines = [];
        for (var i = 0; i < 6; i++) {
            var info = this.getPosInfo(i * BattleConfig.REAL_DISTANCE_PER_LINE);
            var w = cc.winSize.width * info.scaleFactor;
            var startP = cc.p(cc.winSize.width / 2 - w / 2, info.y);
            var endP = cc.p(cc.winSize.width / 2 + w / 2, info.y);
            drawNode.drawLine(startP, endP, cc.color.GREEN)

            this.indicateLines.push({
                index: i,
                startP: startP,
                endP: endP,
                width: w,
                scaleFactor: info.scaleFactor,
                y: info.y,
                monster: null
            });
        }
        this.monsters = [];
        cc.director.getScheduler().scheduleCallbackForTarget(this, this.createMonster, 0.5, cc.REPEAT_FOREVER);
        cc.director.getScheduler().scheduleCallbackForTarget(this, this.updateMonster, 2, cc.REPEAT_FOREVER);

        this.player = new Player(this);

        this.isMonsterStop = false;
    },
    updateAimMonster: function () {
        this.targetMon = this.monsters[0];
        if (this.targetMon) {
            this.updateAimCircle(this.targetMon);
        }
    },
    updateAimCircle: function (targetMon) {
        var aimCircle = this.getChildByTag(100);
        if (aimCircle) {
            //初始进入
            if (!aimCircle.isVisible()) {
                aimCircle.setVisible(true);
                aimCircle.setPosition(targetMon.getCenterInParent());
            } else {
                aimCircle.setPosition(targetMon.getCenterInParent());
            }
        }
    },
    updateMonster: function (dt) {
        if (!this.isMonsterStop) {
            var self = this;
            this.monsters.forEach(function (mon) {
                mon.move();
                self.reorderChild(mon, BattleConfig.LINE_LENGTH - mon.line.index);
            });
        }
        this.updateAimMonster();
    },
    createMonster: function () {
        var endLine = this.indicateLines[this.indicateLines.length - 1];
        if (endLine.monster)
            return;
        var mon = new Monster(this, endLine, cc.getRandomInt(1, 3));
        this.addChild(mon);
        this.monsters.push(mon);

        if (this.monsters.length == 1) {
            this.updateAimMonster();
        }
        //for test
        if (this.monsters.length >= 3) {
            cc.director.getScheduler().unscheduleCallbackForTarget(this, this.createMonster);
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
            cc.e("remove mon");
        }

        this.updateAimMonster();
    },
    initArea: function () {
        this.angle = 15 / 2 * Math.PI / 180;
        //平面区域的矩形
        this.areaRect = cc.size(cc.winSize.width, 1000);
        //延伸的总长
        this.areaLength = 20000;
        //前半段长
        this.firstLength = this.areaRect.height / 2 / Math.tan(this.angle);

        this.tanAngle = Math.tan(this.angle);
        //图形和现实距离的比例
        this.factor = BattleConfig.MAX_REAL_DISTANCE / (this.areaLength - this.firstLength);
    },

    getPosInfo: function (realDistance) {
        var d = realDistance / this.factor;
        d += this.firstLength;
        var h = this.tanAngle * d;
        //缩小因子
        var scaleFactor = (this.areaRect.height / 2 ) / h;
        //投影的高
        var y = this.areaRect.height * (1 - scaleFactor) / 2;
        return {y: y, scaleFactor: scaleFactor};
    },

    gameEnd: function (isWin) {
        cc.e("gameEnd " + isWin);
        this.isMonsterStop = true;
    }
});

var MonsterConfig = {
    1: {
        hp: 100,
        speed: 2,
        attackSpeed: 1,
        attack: 10
    },
    2: {
        hp: 150,
        speed: 1,
        attackSpeed: 1,
        attack: 20
    },
    3: {
        hp: 50,
        speed: 3,
        attackSpeed: 2,
        attack: 8
    }
}
var Monster = cc.Node.extend({
    ctor: function (battleNode, line, type) {
        this._super();

        this.sprite = autoSpriteFrameController.getSpriteFromSpriteName("#walk/1.png");
        this.sprite.setPosition(this.sprite.getContentSize().width / 2, 0);
        this.sprite.setAnchorPoint(0.5, 0);
        this.addChild(this.sprite);

        var array = [];
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("walk/1.png"))
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("walk/2.png"))
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("walk/3.png"))
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("walk/4.png"))
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("walk/5.png"))
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("walk/6.png"))
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("walk/7.png"))
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("walk/8.png"))
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("walk/9.png"))
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("walk/10.png"))
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("walk/11.png"))
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("walk/12.png"))
        var animation = new cc.Animation(array, 0.3);
        var anim = cc.animate(animation);
        cc.animationCache.addAnimation(cc.repeatForever(anim), "walk");

        array = [];
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("attack/1.png"))
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("attack/2.png"))
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("attack/3.png"))
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("attack/4.png"))
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("attack/5.png"))
        animation = new cc.Animation(array, 0.1);
        anim = cc.animate(animation);
        cc.animationCache.addAnimation(anim, "attack");

        array = [];
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("scratch/1.png"))
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("scratch/2.png"))
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("scratch/3.png"))
        animation = new cc.Animation(array, 0.05);
        anim = cc.animate(animation);
        cc.animationCache.addAnimation(anim, "scratch");

        this.sprite.runAction(cc.animationCache.getAnimation("walk"));

        this.setContentSize(this.sprite.getContentSize());
        this.setAnchorPoint(0.5, 0);

        this.line = line;
        this.battleNode = battleNode;
        this.attr = utils.clone(MonsterConfig[type]);

        this.normalX = Math.random() * (cc.winSize.width - 100);
        this.updateByLine();
    },
    setupDebug: function () {
        var drawNode = new cc.DrawNode();
        this.addChild(drawNode);
        drawNode.drawRect(cc.p(0, 0), cc.p(this.getContentSize().width, this.getContentSize().height), null, 1, cc.color.RED);
    },
    updateByLine: function (withAnim) {
        var x = this.normalX * this.line.scaleFactor + this.line.startP.x;
        var y = this.line.y;
        var self = this;
        if (withAnim) {
            this.sprite.runAction(cc.sequence(cc.fadeOut(0.5), cc.callFunc(function () {
                self.sprite.setOpacity(100);
                self.x = x;
                self.y = y;
                self.setScale(self.line.scaleFactor);
            }), cc.fadeIn(0.5), cc.callFunc(function () {
                self.sprite.setOpacity(255);
            })));
        } else {
            this.x = x;
            this.y = y;
            this.setScale(self.line.scaleFactor);
        }
    },
    move: function () {
        var targetIndex = this.line.index - this.attr.speed;
        targetIndex = Math.max(0, targetIndex);
        var targetLine;
        for (var startIndex = this.line.index - 1, endIndex = targetIndex, i = startIndex; i >= endIndex; i--) {
            var l = this.battleNode.indicateLines[i];
            if (!l.monster) {
                targetLine = l;
            } else {
                break;
            }
        }
        if (targetLine) {
            this.line.monster = null;
            targetLine.monster = this;
            this.line = targetLine;
            this.updateByLine(true);
        }
        if (this.isInRange()) {
            cc.director.getScheduler().scheduleCallbackForTarget(this, this.atk, this.attr.attackSpeed);
        }
    },
    atk: function () {
        this.sprite.stopAllActions();
        var self = this;
        this.sprite.runAction(cc.sequence(cc.animationCache.getAnimation("attack"), cc.callFunc(function () {
            self.battleNode.scratch.runAction(cc.sequence(cc.callFunc(function () {
                self.battleNode.scratch.setVisible(true);
            }), cc.animationCache.getAnimation("scratch"), cc.callFunc(function () {
                self.battleNode.scratch.setVisible(false);
            })));
        }), cc.delayTime(0.15), cc.callFunc(function () {
            self.sprite.runAction(cc.animationCache.getAnimation("walk"));
        })));
        var player = this.battleNode.player;
        player.underAtk(this);
        if (player.isDie()) {
            cc.director.getScheduler().unscheduleCallbackForTarget(this, this.atk);
        }
    },
    underAtk: function (obj) {
        var harm = 0;
        if (obj instanceof Weapon) {
            harm = obj.getHarm(this);
        } else {
            harm = obj;
        }
        cc.d("harm:" + harm)

        var emitter = new cc.ParticleSystem("res/blood.plist");
        emitter.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        this.sprite.addChild(emitter, 10);

        if (harm == Number.MAX_VALUE) {
            emitter.setPosition(this.getContentSize().width / 2, this.getContentSize().height - 30);
        }
        this.attr.hp -= harm;
        this.attr.hp = Math.max(0, this.attr.hp);

        emitter.runAction(cc.sequence(cc.delayTime(1), cc.removeSelf()));

        if (this.attr.hp == 0) {
            this.die();
        }
    },
    die: function () {
        cc.e("die");
        this.battleNode.removeMonster(this);
        this.line.monster = null;
        this.removeFromParent();
    },
    getCenterInParent: function () {
        var v = cc.pSub(cc.p(0.5, 0.5), this.getAnchorPoint());
        return cc.p(this.getPosition().x + this.getContentSize().width * v.x * this.getScale(), this.getPosition().y + this.getContentSize().height * v.y * this.getScale());
    },
    isInRange: function () {
        return this.line.index == 0;
    }
});

var Player = cc.Class.extend({
    ctor: function (battleNode) {
        this.battleNode = battleNode;

        this.hp = 100;
        this.maxHp = this.hp;

        this.weapon1 = new Gun(1);
        this.weapon2 = new Weapon(101);

        this.weapon1.createAimCircle(this.battleNode);

        //this.equip = new Bomb(this.battleNode);
        this.equip = new Bait(this.battleNode);
    },
    underAtk: function (monster) {
        this.hp -= monster.attr.attack;
        cc.e("player underAtk hp=" + this.hp);
        this.hp = Math.max(0, this.hp);
        if (this.hp == 0) {
            this.die();
        }
    },
    die: function () {
        cc.e("player die");
        this.battleNode.gameEnd(false);
    },
    isDie: function () {
        return this.hp <= 0;
    },
    useWeapon1: function () {
        var targetMon = this.battleNode.targetMon;
        if (targetMon && this.weapon1.isInRange(targetMon)) {
            this.weapon1.atk(targetMon);
        }
        this.interruptEscape();
    },
    useWeapon2: function () {
        var targetMon = this.battleNode.targetMon;
        if (targetMon && this.weapon2.isInRange(targetMon)) {
            this.weapon2.atk(targetMon);
        }
        this.interruptEscape();
    },
    useEquip: function () {
        this.equip.action();
        this.interruptEscape();
    },
    escape: function () {
        cc.director.getScheduler().scheduleCallbackForTarget(this, this.escapeAction, BattleConfig.ESCAPE_TIME);
    },
    escapeAction: function () {
        this.battleNode.gameEnd(false);
    },
    interruptEscape: function () {
        cc.director.getScheduler().unscheduleCallbackForTarget(this, this.escapeAction);
    }
});

var EquipmentConfig = {
    1: {
        cd: 3,
        effect: 3
    },
    2: {
        cd: 5,
        effect: 50
    }
}

var Equipment = cc.Class.extend({
    ctor: function (id, battleNode) {
        this.attr = EquipmentConfig[id];
        this.battleNode = battleNode;

        this.isInAtkCD = false;
    },
    action: function () {
        cc.d("action : " + this.isInAtkCD);
        if (this.isInAtkCD)
            return;
        this.isInAtkCD = true;
        var func = function () {
            this.isInAtkCD = false;
            cc.director.getScheduler().unscheduleCallbackForTarget(this, func);
            this.afterCd();
        };
        cc.director.getScheduler().scheduleCallbackForTarget(this, func, this.attr.cd, 1);
    },
    afterCd: function () {
    }
});

var Bomb = Equipment.extend({
    ctor: function (battleNode) {
        this._super(2, battleNode);
    },
    action: function () {
        if (this.isInAtkCD)
            return;
        var monsters = this.battleNode.monsters;
        var harm = this.attr.effect;
        monsters.forEach(function (mon) {
            mon.underAtk(harm);
        });
        this._super();
    }
});

var Bait = Equipment.extend({
    ctor: function (battleNode) {
        this._super(1, battleNode);
    },
    action: function () {
        if (this.isInAtkCD)
            return;
        this.battleNode.isMonsterStop = true;
        this._super();
    },
    afterCd: function () {
        this.battleNode.isMonsterStop = false;
    }
});

var WeaponConfig = {
    1: {
        range: 10,
        atkCD: 0.1,
        reloadCD: 1,
        bulletNum: 10,
        atk: 50,
        precise: 0.2,
        dtPrecise: 0.1,
        deathHit: 0.02,
        dtDeathHit: 0.01
    },
    2: {
        range: 10,
        atkCD: 0.1,
        reloadCD: 1.5,
        bulletNum: 10,
        atk: 50,
        precise: 0.5,
        dtPrecise: 0.05,
        deathHit: 0.05,
        dtDeathHit: 0.025
    },
    3: {
        range: 10,
        atkCD: 0.1,
        reloadCD: 1.5,
        bulletNum: 30,
        atk: 50,
        precise: 0.5,
        dtPrecise: 0.05,
        deathHit: 0.05,
        dtDeathHit: 0.025
    },

    101: {
        range: 0,
        atkCD: 0.3,
        atk: 10
    }
}
var Weapon = cc.Class.extend({
    ctor: function (id) {
        this.id = id;
        this.attr = utils.clone(WeaponConfig[id]);

        this.isInAtkCD = false;
    },

    atk: function (monster) {
        cc.d("atk");
        if (this.isInAtkCD)
            return;
        monster.underAtk(this);
        this.isInAtkCD = true;
        var func = function () {
            this.isInAtkCD = false;
            cc.director.getScheduler().unscheduleCallbackForTarget(this, func);
        };
        cc.director.getScheduler().scheduleCallbackForTarget(this, func, this.attr.atkCD, 1);
    },

    getHarm: function (monster) {
        return this.attr.atk;
    },
    isInRange: function (monster) {
        return this.attr.range >= monster.line.index;
    }
});

var Gun = Weapon.extend({
    ctor: function (id) {
        this._super(id);
        this.aimCircle = null;
    },
    getHarm: function (monster) {
        var dtLineIndex = BattleConfig.LINE_LENGTH - 1 - monster.line.index;
        var precise = this.attr.precise + this.attr.dtPrecise * dtLineIndex;
        var deathHit = this.attr.deathHit + this.attr.dtDeathHit * dtLineIndex;
        cc.e("dtLineIndex: " + dtLineIndex);
        cc.e("dtDeathHit: " + this.attr.dtDeathHit);
        //根据准星校准精准度
        var scale = this.aimCircle.getScale();
        precise = utils.map(scale, 0.5, 1, precise * 0.5, precise);

        var rand = Math.random();
        cc.e("rand:" + rand);
        cc.e("deathHit: " + deathHit);
        if (rand <= deathHit) {
            return Number.MAX_VALUE;
        }

        rand = Math.random();
        if (rand <= precise) {
            return this.attr.atk;
        }
        return 0;
    },
    createAimCircle: function (battleNode) {
        if (!this.aimCircle) {
            this.aimCircle = new AimCircle();
            battleNode.addChild(this.aimCircle, 1000, 100);
        }
    },
    atk: function (monster) {
        this._super(monster);
        if (this.aimCircle) {
            this.aimCircle.attack();
        }
    }
});

var AimCircle = cc.Node.extend({
    ctor: function () {
        this._super();
        this.setContentSize(100, 100);
        this.setAnchorPoint(0.5, 0.5);
        this.setVisible(false);
        this.setScale(0.5);

        this.restoreTime = 1;

        this.setupDebug();
    },
    attack: function () {
        cc.d("aimcircle attack")
        this.setScale(1);
        this.runAction(cc.sequence(cc.scaleTo(this.restoreTime, 0.5)));
    },
    setupDebug: function () {
        var drawNode = new cc.DrawNode();
        this.addChild(drawNode);
        drawNode.drawRect(cc.p(0, 0), cc.p(this.getContentSize().width, this.getContentSize().height), null, 1, cc.color.BLUE);
    },
});

var ControlNode = cc.Node.extend({
    ctor: function () {
        this._super();

        this.setContentSize(cc.winSize.width, cc.winSize.height - 823);

        var self = this;
        var btn1 = uiUtil.createBtn2("枪", this, function () {
            self.getParent().battleNode.player.useWeapon1();
        });
        btn1.setPosition(cc.winSize.width / 4 * 3, 150);
        this.addChild(btn1);

        var btn2 = uiUtil.createBtn2("刀", this, function () {
            self.getParent().battleNode.player.useWeapon2();
        });
        btn2.setPosition(cc.winSize.width / 4 * 3, 50);
        this.addChild(btn2);

        var btn3 = uiUtil.createBtn2("诱饵 ", this, function () {
            self.getParent().battleNode.player.useEquip();
        });
        btn3.setPosition(cc.winSize.width / 4, 50);
        this.addChild(btn3);

        var btn4 = uiUtil.createBtn2("逃跑", this, function () {
            self.getParent().battleNode.player.escape();
        });
        btn4.setPosition(cc.winSize.width / 4, 150);
        this.addChild(btn4);

        var btn5 = uiUtil.createBtn2("2X", this, function () {
            var timeScale = cc.director.getScheduler().getTimeScale();
            if (timeScale == 1) {
                cc.director.getScheduler().setTimeScale(2);
            } else {
                cc.director.getScheduler().setTimeScale(1);
            }
        });
        btn5.setPosition(cc.winSize.width / 2, 150);
        this.addChild(btn5);
    }
});

var BattleScene = cc.Scene.extend({
    onEnter: function () {
        this._super();
        cc.spriteFrameCache.addSpriteFrames("res/walker.plist");
        var layer = new BattleLayer();
        this.addChild(layer);
    },
    onExit: function () {
        this._super();
        cc.spriteFrameCache.removeSpriteFramesFromFile("res/walker.plist");
    }
});