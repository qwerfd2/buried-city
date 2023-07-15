var Player = cc.Class.extend({
    ctor: function () {
        this.config = utils.clone(playerConfig);

        this.hp = 240;
        this.hp = this.hp;
        this.hpMaxOrigin = 240;
        this.hpMaxOrigin = this.hpMaxOrigin;
        this.hpMax = this.hpMaxOrigin;
        //心情
        this.spirit = 100;
        this.spirit = this.spirit;
        this.spiritMax = 100;
        this.spiritMax = this.spiritMax;
        //饥饿
        this.starve = 50;
        this.starve = this.starve;
        this.starveMax = 100;
        this.starveMax = this.starveMax;
        //精力
        this.vigour = 100;
        this.vigour = this.vigour;
        this.vigourMax = 100;
        this.vigourMax = this.vigourMax;
        //外伤
        this.injury = 0;
        this.injury = this.injury;
        this.injuryMax = 100;
        this.injuryMax = this.injuryMax;
        //感染
        this.infect = 0;
        this.infect = this.infect;
        this.infectMax = 100;
        this.infectMax = this.infectMax;
        //温度
        this.temperature = this.initTemperature();
        this.temperature = this.temperature;
        this.temperatureMax = 100;
        this.temperatureMax = this.temperatureMax;
        //睡眠状态
        this.isInSleep = false;
        //服药状态
        this.cured = false;
        //包扎状态
        this.binded = false;
        //是否在家
        this.isAtHome = true;
        //是否在副本
        this.isAtSite = false;
        this.nowSiteId = null;
        //是否因为感染死亡
        this.deathCausedInfect = false;
        //战斗前状态记录
        this.battleRecord = null;

        this.bag = new Bag('player');
        this.storage = new Storage('player');
        this.room = new Room();
        this.equip = new Equipment();
        this.npcManager = new NPCManager();
        this.map = new Map();
        this.log = new Log();
        this.weather = new WeatherSystem();
        this.buffManager = new BuffManager();

        this.setting = {};
        this.roleType = 0;
        this.isBombActive = false;
        this.Steal = 50;
        this.totalDistance = 0;
        this.currency = 50;
        this.leftHomeTime = 0;
        this.shopList = [{"itemId": 1103011, "amount": 10}, {"itemId": 1105042, "amount": 10}, {"itemId": 1105051, "amount": 10}, {"itemId": 1301011, "amount": 10}, {"itemId": 1103033, "amount": 10}, {"itemId": 1105011, "amount": 10}];
    },

    save: function () {
        var opt = {
            hp: this.hp,
            hpMaxOrigin: this.hpMaxOrigin,
            hpMax: this.hpMax,
            spirit: this.spirit,
            starve: this.starve,
            vigour: this.vigour,
            injury: this.injury,
            infect: this.infect,
            temperature: this.temperature,
            cured: this.cured,
            cureTime: this.cureTime,
            binded: this.binded,
            bindTime: this.bindTime,
            isAtHome: this.isAtHome,
            isAtSite: this.isAtSite,
            nowSiteId: this.nowSiteId,
            deathCausedInfect: this.deathCausedInfect,

            setting: this.setting,

            bag: this.bag.save(),
            storage: this.storage.save(),
            room: this.room.save(),
            equip: this.equip.save(),
            map: this.map.save(),
            npcManager: this.npcManager.save(),
            weather: this.weather.save(),
            buffManager: this.buffManager.save(),
            isBombActive: this.isBombActive,
            Steal: this.Steal,
            totalDistance: this.totalDistance,
            currency: this.currency,
            shopList: this.shopList,
            leftHomeTime: this.leftHomeTime
        };
        return opt;
    },

    restore: function () {
        var opt = Record.restore("player");
        if (opt) {
            this.hp = opt.hp;
            this.hpMaxOrigin = opt.hpMaxOrigin;
            this.hpMax = opt.hpMax;
            this.spirit = opt.spirit;
            this.starve = opt.starve;
            this.vigour = opt.vigour;
            this.injury = opt.injury;
            this.infect = opt.infect;
            this.temperature = opt.temperature;
            this.cured = opt.cured;
            this.cureTime = opt.cureTime;
            this.binded = opt.binded;
            this.bindTime = opt.bindTime;
            this.isAtHome = opt.isAtHome;
            this.isAtSite = opt.isAtSite;
            this.nowSiteId = opt.nowSiteId;
            this.deathCausedInfect = opt.deathCausedInfect;
            this.setting = opt.setting;
            this.bag.restore(opt.bag);
            this.storage.restore(opt.storage);
            this.equip.restore(opt.equip);
            this.weather.restore(opt.weather);
            this.buffManager.restore(opt.buffManager);
            this.isBombActive = opt.isBombActive;
            this.Steal = opt.Steal;
            this.totalDistance = opt.totalDistance;
            this.currency = opt.currency;
            this.shopList = opt.shopList;
            this.leftHomeTime = opt.leftHomeTime;
        } else {
            IAPPackage.init(this);
            Medal.improve(this);
            if (IAPPackage.isHoarderUnlocked()) {
            this.currency += 50;
                var itemList = [1101011,1101021,1101031,1101041,1101051,1101061,1101071,1101073,1103011,1103041,1103083,1104011,1104021,1104043,1105011,1105022,1105033,1105042,1105051,1301011,1301022,1301033,1301041,1301052,1302011,1302021,1303012,1304012,1304024,1305011,1305023,1106054];
                var amountList = [180,180,100,100,80,80,80,60,20,20,10,10,10,5,40,30,20,60,60,3,2,2,3,2,5,5,10,2,2,500,2,1];
                for (var itemId in itemConfig) {
                    itemId = Number(itemId);
                    var index = itemList.indexOf(itemId);
                    if (index != -1) {
                        this.storage.increaseItem(itemId, amountList[index]);
                    }
                }
            }
        }
        this.room.restore(opt ? opt.room : null);
        this.npcManager.restore(opt ? opt.npcManager : null);
        this.map.restore(opt ? opt.map : null);
        if (!player.room.isBuildExist(12, 0)) {
            this.room.createBuild(12, 0);
        }
    },
    onCurrencyChange: function(value) {
        if (typeof value == "number") {
            player.currency += value;
            if (player.currency >= 99999) {
                player.currency = 99999;
            }
        utils.emitter.emit("onCurrencyChange", player.currency);
        }
    },
    trySteal: function() {
        var TheftConfig = [[0.0, 0.01, 0.02, 0.03, 0.04],[0.01, 0.02, 0.04, 0.06, 0.08],[0.02, 0.04, 0.06, 0.08, 0.1],[0.04, 0.06, 0.08, 0.1, 0.12],[0.06, 0.08, 0.1, 0.14, 0.18],[0.08, 0.1, 0.14, 0.18, 0.25]]; 
        var dtTime = Math.round(cc.timer.time - this.leftHomeTime);
        var weight = this.storage.getAllItemNum();
        var timeIndex = -1;
        var weightIndex = -1;
        var timeGrade = [28800, 57600, 86400, 115200, 144400];
        var weightGrade = [200, 600, 1200, 2000, 3000, 4200];
        for (var i = 0; i < timeGrade.length; i++) {
            if (dtTime >= timeGrade[i]) {
                timeIndex++;
            } else {
                break;
            }
        }
        for (var i = 0; i < weightGrade.length; i++) {
            if (weight >= weightGrade[i]) {
                weightIndex++;
            } else {
                break;
            }
        }

        if (timeIndex < 0 || weightIndex < 0) {
            return;
        }
        var probability = TheftConfig[weightIndex][timeIndex];
        var def = this._getHomeDeter();

        probability = probability * def;
        var rand = Math.random();

        if (rand < probability) {
            var res = this._getAttackResult(90, 0, this.storage);
            res = res.items;
            Record.saveAll();
            var self = this;
            uiUtil.showStolenDialog(stringUtil.getString(9032), "#stealPrompt.png", self, res);
        }
    },
    
    getPrice: function(item) {
        var item = Number(item);
        var items = formulaConfig[item + 100000];
        var price = 0;
        if (items) //如果是可制作物品
        {
            var a = items.produce[0].num; //每次制作数量
            var b = items.makeTime * (1 / 60) / a; //每个的每分钟1元时间成本
            var c = (items.placedTime || 0) * (0.1 / 60) / a; //每个每分钟0.1元时间成本
            items.cost.forEach(function(e) {
                price += (new Item(e.itemId).getPrice() * e.num);
            })
            price = price / a + b + c; //制作总价%每次制作数量+时间成本=单个制作价格
        } else {//非可制作物品按原价格
            price = new Item(item).getPrice();
        }
        return Number(price);
    },
    //包扎
    bindUp: function () {
        this.binded = true;
        this.bindTime = cc.timer.now();
    },
    //包扎状态不可以再包扎
    isInBind: function () {
        return this.binded;
    },

    //服药
    cure: function () {
        this.cured = true;
        this.cureTime = cc.timer.now();
    },

    //服药状态可以再服药
    isInCure: function () {
        return this.cured;
    },

    goHome: function () {
        this.isAtHome = true;
    },

    out: function () {
        this.isAtHome = false;
        this.leftHomeTime = cc.timer.time;
    },

    enterSite: function (siteId) {
        this.isAtSite = true;
        this.nowSiteId = siteId;
    },
    outSite: function () {
        this.isAtSite = false;
        this.nowSiteId = 0;
    },

    sleep: function () {
        this.isInSleep = true;
    },
    wakeUp: function () {
        this.isInSleep = false;
    },

    isAttrChangeGood: function (key, value) {
        switch (key) {
            case "hp":
                return value >= 0;
            case "spirit":
                return value >= 0;
            case "starve":
                return value >= 0;
            case "vigour":
                return value >= 0;
            case "injury":
                return value < 0;
            case "infect":
                return value < 0;
            case "temperature":
                return value >= 0;
        }
    },

    getAttr: function (key) {
        return this[key];
    },
    
    getAttrMax: function (key) {
        return this[key + "Max"];
    },

    isAttrMax: function (key) {
        return this[key] == this[key + "Max"];
    },

    getAttrPercentage: function (key) {
        return this[key] / this[key + "Max"];
    },

    changeAttr: function (key, value) {
        if (!this.isAttrChangeGood(key, value)) {
            if (key === 'infect' && this.buffManager.isBuffEffect(BuffItemEffectType.ITEM_1107022)) {
                cc.d('ITEM_1107022 effect infect');
                return;
            }
            if (key === 'starve' && this.buffManager.isBuffEffect(BuffItemEffectType.ITEM_1107042)) {
                cc.d('ITEM_1107042 effect starve');
                return;
            }
            if (key === 'vigour' && this.buffManager.isBuffEffect(BuffItemEffectType.ITEM_1107032)) {
                cc.d('ITEM_1107032 effect vigour');
                return;
            }
        }
        var beforeRangeInfo = this.getAttrRangeInfo(key, this[key]);
        if (key == "vigour" && player.isInSleep && this[key] == 100) {
            if (this.hp != this.hpMax) {
                this.changeAttr("spirit", -1);
            } else {
                this.changeAttr("spirit", -2);    
            }

        }
        this[key] += value;
        this[key] = cc.clampf(this[key], 0, this[key + "Max"]);
        var afterRangeInfo = this.getAttrRangeInfo(key, this[key]);

        cc.i("changeAttr " + key + " value:" + value + " after:" + this[key]);
        if (this === player) {
            utils.emitter.emit(key + "_change", value);
        }
        if (beforeRangeInfo && afterRangeInfo) {
            var suffix;
            if (afterRangeInfo.id - beforeRangeInfo.id > 0) {
                suffix = "_up";
                cc.e(key + suffix + " " + (afterRangeInfo.id - 1));
                this.log.addMsg(stringUtil.getString(key + suffix)[afterRangeInfo.id - 1]);
                if (key === "infect" || key === "injury") {
                    audioManager.playEffect(audioManager.sound.BAD_EFFECT);
                } else {
                    audioManager.playEffect(audioManager.sound.GOOD_EFFECT);
                }
            } else if (afterRangeInfo.id - beforeRangeInfo.id < 0) {
                suffix = "_down";
                cc.e(key + suffix + " " + (afterRangeInfo.id - 1));
                this.log.addMsg(stringUtil.getString(key + suffix)[afterRangeInfo.id - 1]);
                if (key === "infect" || key === "injury") {
                    audioManager.playEffect(audioManager.sound.GOOD_EFFECT);
                } else {
                    audioManager.playEffect(audioManager.sound.BAD_EFFECT);
                }
            }
        } else {
            cc.e(key + " is not in range " + this[key]);
        }

        if (key === "injury") {
            this.updateHpMax();
        }

        if (key === "hp") {
            if (this.hp == 0 && this === player) {
                //die
                this.die();
            }
        }
    },
    changeHp: function (value) {
        this.changeAttr("hp", value);
    },

    changeStarve: function (value) {
        this.changeAttr("starve", value);
    },

    changeSpirit: function (value) {
        this.changeAttr("spirit", value);
    },

    changeVigour: function (value) {
        this.changeAttr("vigour", value);
    },

    changeInjury: function (value) {
        this.changeAttr("injury", value);
    },

    changeInfect: function (value) {
        this.changeAttr("infect", value);
    },

    changeTemperature: function (value) {
        this.changeAttr("temperature", value);
    },

    updateHpMax: function () {
        var hpBuffEffect = 0;
        if (this.buffManager.isBuffEffect(BuffItemEffectType.ITEM_1107012)) {
            hpBuffEffect = this.buffManager.getBuffValue();
        }
        this.hpMax = this.hpMaxOrigin + hpBuffEffect - this.injury;
        this.hp = Math.min(this.hp, this.hpMax);
    },

    updateByTime: function () {

        var c = this.config["changeByTime"];
        //Credit: Miao version: if in extreme starve, reduce HP.
        if (!this.buffManager.isBuffEffect(BuffItemEffectType.ITEM_1107042) && this.starve < 10) {
            this.changeHp(-2);
        }

        //扣减饥饿度
        this.changeStarve(c[0][0]);

        /*
         白天家中，精力值	-1
         白天野外，精力值	-2
         夜晚家中，精力值	-3
         夜晚野外，精力值	-4
         */
        if (cc.timer.getStage() === "day") {
            if (this.isAtHome) {
                this.changeVigour(c[2][0]);
            } else {
                this.changeVigour(c[3][0]);
            }
        } else {
            if (this.isAtHome) {
                this.changeVigour(c[4][0]);
            } else {
                this.changeVigour(c[5][0]);
            }
        }

        //在睡眠状态下的影响
        if (this.isInSleep) {
            var vigour = this.getVigourChange();
            this.changeVigour(vigour);
            //生命值
            //每小时回血=睡眠等级*20
            var bedLevel = player.room.getBuildLevel(9);
            var bedRate = buildActionConfig[9][bedLevel].rate;
            var hp = bedRate * 20;
            hp = Math.ceil(hp);
            this.changeHp(hp)
        }
        //天气影响
        this.changeVigour(this.weather.getValue("vigour"));
        this.changeSpirit(this.weather.getValue("spirit"));
    },

    getVigourChange: function () {
        var bedLevel = player.room.getBuildLevel(9);
        var bedRate = buildActionConfig[9][bedLevel].rate;
        //睡眠等级=床等级值*0.5+饱食度/100*0.2+心情值/100*0.3
        bedRate = bedRate * 0.5 + this.starve / this.starveMax * 0.2 + this.spirit / this.spiritMax * 0.3;
        //精力值
        //每小时回复精力值=睡眠等级*10
        var vigour = bedRate * 15;
        vigour = Math.ceil(vigour);
        return vigour;
    },

    updateStarve: function () {
        if (this.buffManager.isBuffEffect(BuffItemEffectType.ITEM_1107042)) {
            cc.d('ITEM_1107042 updateStarve');
            return;
        }

        var attrRangeInfo = this.getAttrRangeInfo("starve", this.starve);
        if (attrRangeInfo) {
            var effect = attrRangeInfo.effect;
            for (var attr in effect) {
                if (this.hasOwnProperty(attr)) {
                    this.changeAttr(attr, effect[attr]);
                }
            }
        }
    },

    updateInfect: function () {

        if (this.buffManager.isBuffEffect(BuffItemEffectType.ITEM_1107022)) {
            cc.d('ITEM_1107022 updateInfect');
            return;
        }

        var attrRangeInfo = this.getAttrRangeInfo("infect", this.infect);
        if (attrRangeInfo) {
            var effect = attrRangeInfo.effect;
            for (var attr in effect) {
                if (this.hasOwnProperty(attr)) {
                    var value = effect[attr];
                    //感染属性影响中有公式
                    //对血的影响为公式
                    if (attr === 'hp') {
                        value *= this.infect / 100;
                        value = Math.ceil(value);
                        this.deathCausedInfect = true;
                    }
                    if (attr === 'infect' || attr === 'spirit') {
                        //非服药状态才能影响这两个属性
                        if (!this.isInCure()) {
                            this.changeAttr(attr, value);
                        }
                    } else {
                        this.changeAttr(attr, value);
                    }
                }
            }
        }

        if (this.hp === 0) {
            this.log.addMsg(1108);
        } else {
            this.deathCausedInfect = false;
        }
    },

    updateVigour: function () {
        if (this.buffManager.isBuffEffect(BuffItemEffectType.ITEM_1107032)) {
            cc.d('ITEM_1107032 updateVigour ');
            return;
        }

        var attrRangeInfo = this.getAttrRangeInfo("vigour", this.vigour);
        if (attrRangeInfo) {
            var effect = attrRangeInfo.effect;
            for (var attr in effect) {
                if (this.hasOwnProperty(attr)) {
                    this.changeAttr(attr, effect[attr]);
                }
            }
        }
    },

    updateInjure: function () {
        var attrRangeInfo = this.getAttrRangeInfo("injury", this.injury);
        if (attrRangeInfo) {
            var effect = attrRangeInfo.effect;
            for (var attr in effect) {
                if (this.hasOwnProperty(attr)) {
                    if (attr === 'infect' || attr === 'spirit') {
                        //非服药状态才能影响这两个属性
                        if (!this.isInBind()) {
                            this.changeAttr(attr, effect[attr]);
                        }
                    } else {
                        this.changeAttr(attr, effect[attr]);
                    }
                }
            }
        }
    },

    updateTemperature: function () {
        var c = this.config["temperature"];
        var temperature = this.initTemperature();
        if (this.room.getBuild(18).isActive()) {
            temperature += c[4][0];
            if (this.room.getBuild(5).isActive()) {
                temperature += Math.floor(c[4][0] / 2);
            }
        }
        //火炉
        else if (this.room.getBuild(5).isActive()) {
            temperature += c[4][0];
        }
        //天气
        temperature += this.weather.getValue("temperature");
        this.changeTemperature(temperature - this.temperature);
    },

    updateTemperatureEffect: function () {
        var attrRangeInfo = this.getAttrRangeInfo("temperature", this.temperature);
        if (attrRangeInfo) {
            var effect = attrRangeInfo.effect;
            for (var attr in effect) {
                if (this.hasOwnProperty(attr)) {
                    this.changeAttr(attr, effect[attr]);
                }
            }
        }
    },

    initTemperature: function () {
        var c = this.config["temperature"];
        //季节因素
        var configBySeason = c[cc.timer.getSeason()];
        var temperature = configBySeason[0];
        //日夜因素
        if (cc.timer.getStage() === "day") {
            temperature += configBySeason[1];
        } else {
            temperature += configBySeason[2];
        }
        return temperature;
    },

    cost: function (list) {
        var self = this;
        list.forEach(function (itemInfo) {
            self.storage.decreaseItem(itemInfo.itemId, itemInfo.num);
        });
    },

    getAttrRangeInfo: function (attr, value) {
        var res;
        var config = playerAttrEffect[attr];
        if (config) {
            value = value;
            for (var rangeId in config) {
                var range = new Range(config[rangeId].range);
                if (range.isInRange(value)) {
                    res = config[rangeId];
                    break;
                }
            }
        }
        return res;
    },

    getAttrStr: function (attr, value) {
        var value = value === undefined ? this[attr] : value;
        var attrRangeInfo = this.getAttrRangeInfo(attr, value);
        if (attrRangeInfo) {
            var res = stringUtil.getString(attr + "_name")[Number(attrRangeInfo.id) - 1];
            return res ? res : "";
        } else {
            return "";
        }
    },

    gainItems: function (items) {
        var self = this;
        items.forEach(function (item) {
            self.storage.increaseItem(item.itemId, item.num);
        });
    },

    gainItemsInBag: function (items) {
        var self = this;
        items.forEach(function (item) {
            self.bag.increaseItem(item.itemId, item.num);
        });
    },

    costItems: function (items) {
        var self = this;
        items.forEach(function (item) {
            self.storage.decreaseItem(item.itemId, item.num);
        });
    },

    validateItems: function (items) {
        var self = this;
        var res = true;
        items.forEach(function (item) {
            item.haveNum = self.storage.getNumByItemId(item.itemId);
            if (!self.storage.validateItem(item.itemId, item.num)) {
                res = false;
            }
        });
        return res;
    },

    costItemsInBag: function (items) {
        var self = this;
        items.forEach(function (item) {
            self.bag.decreaseItem(item.itemId, item.num);
        });
    },

    validateItemsInBag: function (items) {
        var self = this;
        var res = true;
        items.forEach(function (item) {
            item.haveNum = self.bag.getNumByItemId(item.itemId);
            if (!self.bag.validateItem(item.itemId, item.num)) {
                res = false;
            }
        });
        return res;
    },

    useItem: function (storage, itemId) {
        cc.e("useItem " + itemId);
        if (storage.validateItem(itemId, 1)) {
            cc.timer.updateTime(600);
            
            var item = storage.getItem(itemId);
            var itemName = stringUtil.getString(itemId).title;
            if (item.isType(ItemType.TOOL, ItemType.FOOD)) {
                if (!uiUtil.checkStarve())
                    return {result: false};
                storage.decreaseItem(itemId, 1);
                this.log.addMsg(1093, itemName, storage.getNumByItemId(itemId));
                this.itemEffect(item, item.getFoodEffect());
                return {result: true};
            } else if (item.isType(ItemType.TOOL, ItemType.MEDICINE)) {
                if (itemId == 1104011) {
                    storage.decreaseItem(itemId, 1);
                    this.log.addMsg(1094, itemName, storage.getNumByItemId(itemId));
                    this.itemEffect(item, item.getMedicineEffect());
                    this.bindUp();
                } else {
                    storage.decreaseItem(itemId, 1);
                    this.log.addMsg(1095, itemName, storage.getNumByItemId(itemId));
                    if (itemId == 1104032) {
                        var res = this.item1104032Effect(item, item.getMedicineEffect());
                        if (res) {
                            this.cure();
                        }
                    } else {
                        this.itemEffect(item, item.getMedicineEffect());
                        this.cure();
                    }
                }
                return {result: true};
            } else if (item.isType(ItemType.TOOL, ItemType.BUFF)) {
                storage.decreaseItem(itemId, 1);
                this.log.addMsg(1095, itemName, storage.getNumByItemId(itemId));
                this.buffManager.applyBuff(itemId);
                return {result: true};
            } else {
                return {result: false, type: 2, msg: "this type can't use"};
            }
        } else {
            return {result: false, type: 1, msg: "not enough"};
        }
    },
    //自制青霉素的使用,如果扣血成功,则不发生治疗效果
    item1104032Effect: function (item, obj) {
        var hpChance = obj.hp_chance;
        var rand = Math.random();
        cc.log(" hpChance=" + hpChance + " rand=" + rand)
        if (rand <= hpChance) {
            cc.log("1104032 worked");
            this.changeHp(obj.hp);
            return false;
        } else {
            var newObj = {};
            for (var key in obj) {
                if (key.indexOf("hp") == -1) {
                    newObj[key] = obj[key];
                }
            }
            this.itemEffect(item, newObj);
            return true;
        }
    },
    applyEffect: function (obj) {
        var badEffect = [];
        for (var key in obj) {
            if (this.hasOwnProperty(key)) {
                var chance = obj[key + "_chance"];
                var rand = Math.random();
                cc.log(key + " chance=" + chance + " rand=" + rand)
                if (rand <= chance) {
                    cc.log("worked");
                    var funName = cc.formatStr("change%s%s", key.substr(0, 1).toUpperCase(), key.substr(1));
                    cc.log(funName);
                    var changeValue = obj[key];
                    this[funName](changeValue);
                    if (!this.isAttrChangeGood(key, changeValue)) {
                        badEffect.push({
                            attrName: key,
                            changeValue: changeValue
                        });
                    }
                }
            }
        }
        return badEffect;
    },

    itemEffect: function (item, obj) {
        var badEffect = this.applyEffect(obj);

        if (badEffect.length > 0) {
            var str = "";
            badEffect.forEach(function (obj) {
                str += stringUtil.getString(obj.attrName) + ":" + obj.changeValue + " ";
            });
            this.log.addMsg(1107, stringUtil.getString(item.id).title, str);
        }
    },

    _getAttackInNightStrength: function () {
        var timeObj = cc.timer.formatTime();
        var strength = 0;
        for (var i = 0; i < MoonlightingConfig.strength.length; i++) {
            var strengthObj = MoonlightingConfig.strength[i];
            if (timeObj.d >= strengthObj.day[0] && timeObj.d <= (strengthObj.day[1] ? strengthObj.day[1] : Number.MAX_VALUE)) {
                strength = utils.getRandomInt(strengthObj.strength[0], strengthObj.strength[1]);
                break;
            }
        }
        return strength;
    },
    _getHomeDef: function () {
        //家的防御 = 栅栏等级*n + 狗(活跃+10)
        var homeDef = 0;
        var level = this.room.getBuildLevel(11);
        if (level >= 0) {
            homeDef += (level + 1) * 10;
        }
        if (this.room.getBuild(12).isActive()) {
            homeDef += 10;
        }
        var electricFenceBuild = this.room.getBuild(19);
        //雷区抵御僵尸夜袭
        if (electricFenceBuild && electricFenceBuild.isActive()) {  //电网抵御僵尸
            homeDef += 40;
        }
        return homeDef;
    },
    
    _getHomeDeter: function () {
        //家的防御 = 栅栏等级*n + 狗(活跃+10)
        var homeDef = 0;
        var level = this.room.getBuildLevel(11);
        if (level >= 0) {
            homeDef += (level + 1) * 10;
        }
        if (this.room.getBuild(12).isActive()) {
            homeDef += 10;
        }
        var electricFenceBuild = this.room.getBuild(19);
        //雷区抵御僵尸夜袭
        if (electricFenceBuild && electricFenceBuild.isActive()) {  //电网抵御僵尸
            homeDef += 30;
        }
        if (this.isBombActive) {
            homeDef += 30;
        }
        return 1.0 - (homeDef / 100);
    },
    
    _getOrigDef: function () {
        //家的防御 = 栅栏等级*n + 狗(活跃+10)
        var homeDef = 0;
        var level = this.room.getBuildLevel(11);
        if (level >= 0) {
            homeDef += (level + 1) * 10;
        }
        if (this.room.getBuild(12).isActive()) {
            homeDef += 10;
        }
        return homeDef;
    },

    _getAttackResult: function (attackStrength, def, causeStorage) {
        var res = {};
        cc.d("monster strength=" + attackStrength + " def=" + def);
        if (attackStrength > def) {
            var produceValue = attackStrength / 5 - 1 + 3;
            cc.i("moonlighting defeat value=" + produceValue);
            var tmpStorage = new Storage();
            var tmpBlackList = blackList.storageLost.concat();
            while (produceValue > 0 && !causeStorage.isEmpty()) {

                var ids = Object.keys(causeStorage.map);
                var haveIds = Object.keys(tmpStorage.map);

                haveIds.forEach(function (id) {
                    var num = tmpStorage.getNumByItemId(id);
                    if (num >= 5 && tmpBlackList.indexOf(Number(id)) === -1) {
                        tmpBlackList.push(Number(id));
                    }
                });

                ids = ids.filter(function (id) {
                    return tmpBlackList.indexOf(Number(id)) === -1
                });

                if (haveIds.length >= 6) {
                    ids = ids.filter(function (id) {
                        return haveIds.indexOf(Number(id)) !== -1
                    });
                }

                if (ids.length > 0) {
                    var itemId = ids[utils.getRandomInt(0, ids.length - 1)];
                    if (causeStorage.validateItem(itemId, 1)) {
                        causeStorage.decreaseItem(itemId, 1);
                        tmpStorage.increaseItem(itemId, 1);
                        var value = itemConfig[itemId].value;
                        produceValue -= value;
                    }
                } else {
                    break;
                }
            }
            res.win = false;
            res.items = [];
            tmpStorage.forEach(function (item, num) {
                res.items.push({itemId: item.id, num: num});
            });
        } else {
            res.win = true;
        }
        return res;
    },
    updateBazaarList: function () {
        function selectFrom(min, max) {
            var sum = max - min + 1;
            return Math.floor(Math.random() * sum + min);
        }

        function myNum(n, min, max) {
            var a = [];
            for (i = 0; i < n; i++) {
                a[i] = selectFrom(min, max);
                for (z = 0; z < i; z++) {
                    if (a[i] == a[z]) {
                        i--;
                        break;
                    }
                }
            }
            return a;
        }
        var rray = [];
        var copyItem = utils.clone(itemConfig);
        var deleteItem = [1106013, 1305064, 1305053, 1305044, 1305034, 1305024, 1305023];
        for (var a in deleteItem) {
            delete copyItem[deleteItem[a]];
        }
        var le = Object.keys(copyItem).length;
        var result = myNum(6, 0, le - 1);
        
        result.forEach(function(k) {
            var itemId = Number(Object.keys(copyItem)[k]);
            var amount = 10;
            if (itemId == 1305011) {
                amount = 30;
            }
            var twentyList = [1101011, 1101021, 1101031, 1101041, 1101051, 1103011, 1105042];
            var fifteenList = [1101061, 1101071, 1101073];
            var fiveList = [1102011, 1102022, 1102033, 1102042, 1103074, 1104032, 1301011, 1301022, 1301033, 1301041, 1301052, 1301063, 1301071, 1301082, 1302043, 1303033, 1303044]
            var twoList = [1102053, 1102063, 1104043, 1106054, 1107012, 1107022, 1107032, 1107042];
            
            if (fiveList.indexOf(itemId) !== -1) {
                amount = 5;
            } else if (twoList.indexOf(itemId) !== -1) {
                amount = 2;
            } else if (twentyList.indexOf(itemId) !== -1) {
                amount = 20;
            } else if (fifteenList.indexOf(itemId) !== -1) {
                amount = 15;
            } if (itemId == 1106054) {
                amount = 1;
            }
            rray.push({"itemId": itemId, "amount": amount});
        })
        player.shopList = rray;
        
    },
    underAttackInNight: function () {
        var homeRes = {};
        var rand = Math.random();
        if (cc.timer.formatTime().d < 2) {
            rand = 1;
        } else {
            rand = Math.random();
        }
        cc.i("moonlighting..." + rand);
        var timeObj = cc.timer.formatTime();
        var probability = 0;
        for (var i = 0; i < MoonlightingConfig.strength.length; i++) {
            var strengthObj = MoonlightingConfig.strength[i];
            if (timeObj.d >= strengthObj.day[0] && timeObj.d <= (strengthObj.day[1] ? strengthObj.day[1] : Number.MAX_VALUE)) {
                probability = strengthObj.probability;
                break;
            }
        }
        var homeDef = this._getHomeDef();
        if (homeDef >= 80 && this.isBombActive) {
            Achievement.checkSpecial("bt_special_2");
        }
        if (IAPPackage.isStealthUnlocked()) {
            probability -= probability * 0.25;
        }
        if (rand <= probability) {

            player.log.addMsg(1099);
            var attackStrength = this._getAttackInNightStrength();
            //This value = normal + dog + electic (if active) (30 + 10 + 30)
            var origDef = this._getOrigDef();
            //If ATK > homeDef
            for (var siteId in this.map.siteMap) {
                var site = this.map.siteMap[siteId];
                if (!site.closed && !site.storage.isEmpty()) {
                    var res = this._getAttackResult(attackStrength, site.config.def, site.storage);
                    if (res.items) {
                        if (res.items.length > 0) {
                            site.isUnderAttacked = true;
                        }
                    }
                }
            }
            if (attackStrength > homeDef){
                if (this.isBombActive) {
                    //If bomb active, disable bomb, process per usual.
                    this.isBombActive = false;
                    homeDef += 40;
                    homeRes = this._getAttackResult(attackStrength, homeDef, this.storage);
                    homeRes.isBomb = true;
                    homeRes.happened = true;
                } else {
                    //If bomb not active & loss, process per usual.
                    homeRes = this._getAttackResult(attackStrength, homeDef, this.storage);
                    homeRes.happened = true;
                }
            } else {
                //ATK <= DEF, no lost.
                if (attackStrength > origDef){
                    //Victory happened due to electric fense. view electric fense success.
                    
                    homeRes = this._getAttackResult(attackStrength, homeDef, this.storage);
                    homeRes.isFence = true;
                    homeRes.happened = true;
                } else {
                    //Victory happened due to orig defense. view original success.                 
                    homeRes = this._getAttackResult(attackStrength, homeDef, this.storage);
                    homeRes.isOrig = true;
                    homeRes.happened = true;
                }
            }
        } else {
            homeRes.happened = false;
        }

        Record.saveAll();
        cc.timer.pause();
        new DayLayer(homeRes).show();
    },

    randomAttack: function (cb) {
        var stage = cc.timer.getStage();
        var config = RandomBattleConfig[stage];
        var rand = Math.random();
        cc.d(rand);
        var probability = config.probability;
        if (IAPPackage.isStealthUnlocked()) {
            probability -= probability * 0.25;
        }
        if (rand <= probability) {
            player.log.addMsg(1113);

            var diff = utils.getRandomInt(config.difficulty[0], config.difficulty[1]);
            var list = utils.getMonsterListByDifficulty(diff)
            cc.e("action")
            uiUtil.showRandomBattleDialog({
                difficulty: diff,
                list: list
            }, cb);
            return true;
        }
        return false;
    },
    start: function () {
        cc.i("player start...");
        var self = this;
        cc.timer.addTimerCallbackDayAndNight(null, function (flag) {
            if (flag === 'day') {
                self.npcManager.visitPlayer();
                self.npcManager.updateTradingItem();
                self.log.addMsg(1122);
                self.weather.checkWeather();
                Medal.checkDay(1);
                Record.saveAll();
            } else {
                self.log.addMsg(1121);
            }
        });
        cc.timer.addTimerCallbackDayByDay(this, function () {
            for (var npcId in npcConfig) {
                var npc = player.npcManager.getNPC(npcId);
                if (npc.isUnlocked) {
                    if (npc.isSteal) {
                        npc.changeAlert(-1);
                    }
                    npc.isSteal = true;
                }
            }
            self.Steal = utils.getRandomInt(35, 65);
            utils.emitter.emit("Steal");
            self.updateBazaarList();
            self.underAttackInNight();
            self.room.getBuild(9).sleeped = false;
            cc.timer.checkSeason();
            cc.sys.localStorage.setItem("ad", "1");
        });
        cc.timer.addTimerCallbackHourByHour(this, function () {
            self.updateByTime();
            self.updateTemperature();
            self.updateTemperatureEffect();
            self.updateStarve();
            self.updateInjure();
            self.updateInfect();
            self.updateVigour();

            var workSite = self.map.getSite(WORK_SITE);
            if (workSite) {
                workSite.checkActive();
            }

            var now = cc.timer.now();
            if (self.bindTime) {
                if (now - self.bindTime >= 24 * 60 * 60) {
                    self.binded = false;
                    cc.i("binded false");
                }
            }
            if (self.cureTime) {
                if (now - self.cureTime >= 24 * 60 * 60) {
                    self.cured = false;
                    cc.i("cured false");
                }
            }
        });
        cc.timer.addTimerCallbackByMinute(this.buffManager);
    },
    //背包+仓库的物品数量
    getItemNumInPlayer: function (itemId) {
        var num = 0;
        num += this.bag.getNumByItemId(itemId);
        num += this.storage.getNumByItemId(itemId);
        return num;
    },
    die: function () {
        this.buffManager.abortBuff();

        game.stop();
        this.map.resetPos();
        Navigation.gotoDeathNode();
    },
    //重生
    relive: function () {
        this.changeSpirit(this.spiritMax - this.spirit);
        this.changeStarve(this.starveMax - this.starve);
        this.changeVigour(this.vigourMax - this.vigour);
        this.changeInjury(0 - this.injury);
        this.changeInfect(0 - this.infect);
        this.changeAttr("hp", this.hpMax);
        this.isInSleep = false;
        this.cured = false;
        this.binded = false;
        //所有建筑需要复原
        this.room.forEach(function (build) {
            build.resetActiveBtnIndex();
        });
        Record.saveAll();
    },

    isLowVigour: function () {
        if (this.buffManager.isBuffEffect(BuffItemEffectType.ITEM_1107032)) {
            return false;
        } else {
            var attrRangeInfo = this.getAttrRangeInfo("vigour", this.vigour);
            if (attrRangeInfo) {
                return attrRangeInfo.id === 1;
            } else {
                return false;
            }
        }
    },
    vigourEffect: function () {
        return this.isLowVigour() ? 2 : 1;
    },

    setSetting: function (key, value) {
        this.setting[key] = value;
        Record.saveAll();
    },
    getSetting: function (key, defaultValue) {
        if (this.setting.hasOwnProperty(key)) {
            return this.setting[key];
        } else {
            return defaultValue;
        }
    },
    getStep: function () {
        return this.getSetting("step", 0);
    },
    step: function () {
        var step = this.getStep();
        step++;
        this.setSetting("step", step);
    }
});