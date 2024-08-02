var Player = cc.Class.extend({
    ctor: function () {
        this.config = utils.clone(playerConfig);

        this.saveName = stringUtil.getString(6007);
        this.hp = 240;
        this.hp = this.hp;
        this.hpMaxOrigin = 240;
        this.hpMaxOrigin = this.hpMaxOrigin;
        this.hpMax = this.hpMaxOrigin;
        //心情
        this.spirit = 100;
        this.spiritMax = 100;
        //饥饿
        this.starve = 50;
        this.starveMax = 100;
        //精力
        this.vigour = 100;
        this.vigourMax = 100;
        //外伤
        this.injury = 0;
        this.injuryMax = 100;
        //感染
        this.infect = 0;
        this.infectMax = 100;
        //
        this.water = 100;
        this.waterMax = 100;
        this.lastWaterTime = -999999;
        //
        this.virus = 0;
        this.virusMax = 90;
        //温度
        this.temperature = this.initTemperature();
        this.temperature = this.temperature;
        this.temperatureMax = 100;
        //睡眠状态
        this.isInSleep = false;
        //服药状态
        this.cured = false;
        //包扎状态
        this.binded = false;
        //是否在家
        this.isAtHome = true;
        this.isAtBazaar = false;
        //是否在副本
        this.isAtSite = false;
        this.nowSiteId = null;
        //是否因为感染死亡
        this.deathCausedInfect = false;
        //战斗前状态记录
        this.battleRecord = null;
        this.bag = new Bag('player');
        this.safe = new Safe('player');
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
        this.currency = 10;
        this.leftHomeTime = 0;
        this.lastCoffeeTime = -999999;
        this.lastAlcoholTime = -999999;
        this.mapBattle = {};
        this.fuel = 0;
        this.shoeTime = 0;
        this.useMoto = true;
        this.useGoodBullet = true;
        this.alcoholPrice = 1;
        this.dogState = 0;
        this.dogMood = 60;
        this.dogInjury = 0;
        this.dogFood = 240;
        this.dogMoodMax = 60;
        this.dogInjuryMax = 60;
        this.dogFoodMax = 240;
        this.dogName = "";
        this.dogDistance = 0;
        this.hasDogPlay = false;
        this.isDead = false;
        this.trapTime = -1;
        this.lastBanditCaveIn = 10;
        this.cloned = false;
        this.shopList = [{"itemId": 1103011, "amount": 10, "discount": 0}, {"itemId": 1105042, "amount": 10, "discount": 0}, {"itemId": 1105051, "amount": 10, "discount": 0}, {"itemId": 1301011, "amount": 5, "discount": 0}, {"itemId": 1103033, "amount": 5, "discount": 0}];
        this.weaponRound = {"1301011": 0,"1301022": 0,"1301033": 0,"1301041": 0,"1301052": 0,"1301063": 0,"1301071": 0,"1301082": 0,"1301091": 0,"1302011": 0,"1302021": 0,"1302032": 0,"1302043": 0,"1304012": 0,"1304023": 0};
    },
    
    save: function () {
        var opt = {
            saveName: this.saveName,
            hp: this.hp,
            hpMaxOrigin: this.hpMaxOrigin,
            hpMax: this.hpMax,
            spirit: this.spirit,
            spiritMax: this.spiritMax,
            starve: this.starve,
            starveMax: this.starveMax,
            vigour: this.vigour,
            vigourMax: this.vigourMax,
            injury: this.injury,
            injuryMax: this.injuryMax,
            infect: this.infect,
            infectMax: this.infectMax,
            temperature: this.temperature,
            cured: this.cured,
            cureTime: this.cureTime,
            binded: this.binded,
            bindTime: this.bindTime,
            isAtHome: this.isAtHome,
            isAtBazaar: this.isAtBazaar,
            isAtSite: this.isAtSite,
            nowSiteId: this.nowSiteId,
            deathCausedInfect: this.deathCausedInfect,

            setting: this.setting,

            bag: this.bag.save(),
            safe: this.safe.save(),
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
            leftHomeTime: this.leftHomeTime,
            lastCoffeeTime: this.lastCoffeeTime,
            lastAlcoholTime: this.lastAlcoholTime,
            water: this.water,
            waterMax: this.waterMax,
            virus: this.virus,
            virusMax: this.virusMax,
            lastWaterTime: this.lastWaterTime,
            weaponRound: this.weaponRound,
            mapBattle: this.mapBattle,
            fuel: this.fuel,
            shoeTime: this.shoeTime,
            useMoto: this.useMoto,
            useGoodBullet: this.useGoodBullet,
            alcoholPrice: this.alcoholPrice,
            dogState: this.dogState,
            dogMood: this.dogMood,
            dogInjury: this.dogInjury,
            dogFood: this.dogFood,
            dogMoodMax: this.dogMoodMax,
            dogInjuryMax: this.dogInjuryMax,
            dogFoodMax: this.dogFoodMax,
            hasDogPlay: this.hasDogPlay,
            dogName: this.dogName,
            dogDistance: this.dogDistance,
            isDead: this.isDead,
            trapTime: this.trapTime,
            lastBanditCaveIn: this.lastBanditCaveIn,
            cloned: this.cloned,
        };
        return opt;
    },

    restore: function () {
        var opt = Record.restore("player" + utils.SAVE_SLOT) || {};
        if (opt.hpMax) {
            this.saveName = opt.saveName;
            this.hp = opt.hp;
            this.hpMaxOrigin = opt.hpMaxOrigin;
            this.hpMax = opt.hpMax;
            this.spirit = opt.spirit;
            this.spiritMax = opt.spiritMax;
            this.starve = opt.starve;
            this.vigour = opt.vigour;
            this.injury = opt.injury;
            this.infect = opt.infect;
            this.starveMax = opt.starveMax;
            this.vigourMax = opt.vigourMax;
            this.injuryMax = opt.injuryMax;
            this.infectMax = opt.infectMax;
            this.temperature = opt.temperature;
            this.cured = opt.cured;
            this.cureTime = opt.cureTime;
            this.binded = opt.binded;
            this.bindTime = opt.bindTime;
            this.isAtHome = opt.isAtHome;
            this.isAtBazaar = opt.isAtBazaar;
            this.isAtSite = opt.isAtSite;
            this.nowSiteId = opt.nowSiteId;
            this.deathCausedInfect = opt.deathCausedInfect;
            this.setting = opt.setting;
            this.bag.restore(opt.bag);
            this.safe.restore(opt.safe);
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
            this.lastCoffeeTime = opt.lastCoffeeTime;
            this.lastAlcoholTime = opt.lastAlcoholTime;
            this.water = opt.water;
            this.waterMax = opt.waterMax;
            this.virus = opt.virus;
            this.virusMax = opt.virusMax;
            this.lastWaterTime = opt.lastWaterTime;
            this.weaponRound = opt.weaponRound;
            this.mapBattle = opt.mapBattle;
            this.fuel = opt.fuel;
            this.shoeTime = opt.shoeTime;
            this.useMoto = opt.useMoto;
            this.useGoodBullet = opt.useGoodBullet;
            this.alcoholPrice = opt.alcoholPrice;
            this.dogState = opt.dogState || 0;
            this.dogMoodMax = opt.dogMoodMax || 60;
            this.dogFood = (opt.dogFood !== undefined) ? opt.dogFood : 60;
            this.dogInjury = (opt.dogInjury !== undefined) ? opt.dogInjury : 0;
            this.dogMood = (opt.dogMood !== undefined) ? opt.dogMood : 60;
            this.dogInjuryMax = opt.dogInjuryMax || 60;
            this.dogFoodMax = opt.dogFoodMax || 240;
            this.hasDogPlay = opt.hasDogPlay || false;
            this.dogName = opt.dogName || "";
            this.dogDistance = opt.dogDistance || 0;
            this.isDead = opt.isDead || false;
            this.trapTime = opt.trapTime || -1;
            this.lastBanditCaveIn = opt.lastBanditCaveIn || 10;
            this.cloned = opt.cloned || false;
        } else {
            IAPPackage.init(this);
            Medal.improve(this);
            if (IAPPackage.isHoarderUnlocked()) {
                this.currency += 10;
                var itemList = [1101011,1101021,1101031,1101041,1101051,1101061,1101071,1101073,1103011,1103041,1103083,1104011,1104021,1104043,1105011,1105022,1105033,1105042,1105051,1301011,1301022,1301033,1301041,1301052,1302011,1302021,1303012,1304012,1306001,1305011,1305023,1106054];
                var amountList = [90,90,80,75,60,60,50,40,15,15,5,5,5,4,30,20,10,40,40,3,2,2,3,2,4,4,8,2,2,160,2,1];
                for (var i = 0; i < itemList.length; i++) {
                    this.storage.increaseItem(itemList[i], amountList[i], false);
                }
            }
        }
        this.room.restore(opt ? opt.room : null);
        this.npcManager.restore(opt ? opt.npcManager : null);
        this.map.restore(opt ? opt.map : null);
        if (!player.room.isBuildExist(12, -1) && !player.room.isBuildExist(12, 0)) {
            this.room.createBuild(12, -1);
        }
    },
    
    getDogName: function () {
        var dogName =this.dogName;
        if (dogName == "") {
            dogName = stringUtil.getString(1106013).title;
        }
        return dogName;
    },
    
    updateDogFood: function () {
        if (this.room.getBuildLevel(12) >= 0) {
            this.changeAttr("dogFood", -5);
        }
    },
 
    getStatStr: function () {
        var dogStatusStr = stringUtil.getString(7004, player.getDogName());
        if (!this.dogFood) {
            dogStatusStr = stringUtil.getString(7005, player.getDogName());
        } else if (!this.dogMood) {
            dogStatusStr = stringUtil.getString(7006, player.getDogName());
        } else if (this.dogInjury >= 60) {
            dogStatusStr = stringUtil.getString(7007, player.getDogName());
        }
        return dogStatusStr;
    },
     
    redeemPlay: function () {
        this.changeAttr("spirit", 5);
        this.changeAttr("dogMood", 20);
        cc.timer.updateTime(600);
        this.hasDogPlay = false;
        Record.saveAll();
        this.log.addMsg(7014, player.getDogName());
        utils.emitter.emit("entered_alter_node");
    },
    calculateExpired: function (foodItem) {
        var item = foodItem.item.id;
        var numbers = foodItem.num;
        var expire = ExpireRate[item];
        var amount = expire * numbers;
        var floorValue = Math.floor(amount);
        var ceilValue = Math.ceil(amount);
        var probDown = 1 - (amount - floorValue);
        var probUp = 1 - probDown;
        var random = Math.random();
        if (random <= probDown) {
            amount = floorValue;
        } else {
            amount = ceilValue;
        }
        return amount;
    },

    expireFoodCraft: function (homePower) {
        var tmpStorage = new Storage();
        var fertilizerSite = 0;
        var fertilizerHome = 0;
        for (var siteId in this.map.siteMap) {
            var site = this.map.siteMap[siteId];
            if (!site.closed && !site.storage.isEmpty()) {
                var foodStorage = site.storage.getItemsByType("1103");
                for (var i = 0; i < foodStorage.length; i++) {
                    var amount = this.calculateExpired(foodStorage[i]);
                    if (amount) {
                        if (site.storage.validateItem(foodStorage[i].item.id, amount)) {
                            site.storage.decreaseItem(foodStorage[i].item.id, amount);
                            tmpStorage.increaseItem(foodStorage[i].item.id, amount, false);
                            var fertilizerAmount = FertilizerRate[foodStorage[i].item.id] * amount;
                            fertilizerSite += fertilizerAmount;
                            site.storage.increaseItem("1101081", fertilizerAmount);
                        }
                    }
                }    
            }
        }
        //also expire safe and bag
        var foodStorage = this.safe.getItemsByType("1103");
        for (var i = 0; i < foodStorage.length; i++) {
            var amount = this.calculateExpired(foodStorage[i]);
            if (amount) {
                if (this.safe.validateItem(foodStorage[i].item.id, amount)) {
                    this.safe.decreaseItem(foodStorage[i].item.id, amount);
                    tmpStorage.increaseItem(foodStorage[i].item.id, amount, false);
                    var fertilizerAmount = FertilizerRate[foodStorage[i].item.id] * amount;
                    fertilizerHome += fertilizerAmount;
                    this.safe.increaseItem("1101081", fertilizerAmount);
                }
            }
        }
        var foodStorage = this.bag.getItemsByType("1103");
        for (var i = 0; i < foodStorage.length; i++) {
            var amount = this.calculateExpired(foodStorage[i]);
            if (amount) {
                if (this.bag.validateItem(foodStorage[i].item.id, amount)) {
                    this.bag.decreaseItem(foodStorage[i].item.id, amount);
                    tmpStorage.increaseItem(foodStorage[i].item.id, amount, false);
                    var fertilizerAmount = FertilizerRate[foodStorage[i].item.id] * amount;
                    fertilizerHome += fertilizerAmount;
                    this.bag.increaseItem("1101081", fertilizerAmount);
                }
            }
        }
        if (!homePower) {
            var foodStorage = this.storage.getItemsByType("1103");
            for (var i = 0; i < foodStorage.length; i++) {
                var amount = this.calculateExpired(foodStorage[i]);
                if (amount) {
                    if (this.storage.validateItem(foodStorage[i].item.id, amount)) {
                        this.storage.decreaseItem(foodStorage[i].item.id, amount);
                        tmpStorage.increaseItem(foodStorage[i].item.id, amount, false);
                        var fertilizerAmount = FertilizerRate[foodStorage[i].item.id] * amount;
                        fertilizerHome += fertilizerAmount;
                        this.storage.increaseItem("1101081", fertilizerAmount);
                    }
                }
            }    
        }
        if (fertilizerSite || fertilizerHome) {
            Record.saveAll();
            var lostItems = [];
            tmpStorage.forEach(function (item, num) {
                lostItems.push({itemId: item.id, num: num, color: cc.color.BLACK});
            });
            
            if (lostItems.length) {
                cc.timer.pause();
                var d = new FoodExpireDialog(lostItems, fertilizerSite, fertilizerHome);
                d.show();
            }
        }
    },
    
    isDogActive: function () {
        if (!this.dogFood || !this.dogMood || this.dogInjury == this.dogInjuryMax) {
            return false;
        }
        return true;
    },
    
    onCurrencyChange: function(value) {
        if (typeof value == "number") {
            player.currency += value;
            player.currency = round(player.currency);
            if (player.currency >= 99999) {
                player.currency = 99999;
            }
        utils.emitter.emit("onCurrencyChange", player.currency);
        audioManager.playEffect(audioManager.sound.GOLD);
        }
    },
    onFuelChange: function(value) {
        if (typeof value == "number") {
            var upperbound = 0;
            if (this.hasMotocycle()) {
                upperbound = 99;
            }
            player.fuel += value;
            if (player.fuel >= upperbound) {
                player.fuel = upperbound;
            } else if (player.fuel < 0) {
                player.fuel = 0;
            }
            utils.emitter.emit("onFuelChange", player.fuel);
        }
    },
    hasMotocycle: function () {
        return (player.bag.validateItem(1305034, 1) || player.storage.validateItem(1305034, 1) || player.safe.validateItem(1305034, 1));
    },

    testSteal: function () {
        var def = this._getHomeDef();
        if (this.isBombActive) {
            def += 30;
        }
        def =  1.0 - (def / 100);
        player.log.addMsg("def: " + def);
    },

    trySteal: function (bypass) {
        var saveFlag = false;
        if (this.shoeTime > 22500) {
            //break a shoe from storage
            if (this.storage.validateItem(1306001, 1)) {
                this.storage.decreaseItem(1306001, 1);
                this.log.addMsg(stringUtil.getString(1341));
                this.shoeTime = 0;
                saveFlag = true;
            } else if (this.bag.validateItem(1306001, 1)) {
                this.bag.decreaseItem(1306001, 1);
                this.log.addMsg(stringUtil.getString(1341));
                this.shoeTime = 0;
                saveFlag = true;
            }
        }
        var TheftConfig = 
        [[0.02, 0.05, 0.09, 0.14, 0.2 ],
        [ 0.05, 0.11, 0.18, 0.26, 0.35],
        [ 0.09, 0.19, 0.3,  0.42, 0.55],
        [ 0.14, 0.29, 0.45, 0.62, 0.8 ],
        [ 0.2,  0.41, 0.63, 0.86, 1.1 ],
        [ 0.26, 0.53, 0.81, 1.1,  1.4 ]];

        var dtTime = Math.round(cc.timer.time - this.leftHomeTime);
        var weight = this.storage.getAllItemNum();
        var timeIndex = -1;
        var weightIndex = -1;
        var timeGrade = [28800, 57600, 86400, 115200, 144400];
        var weightGrade = [300, 800, 1500, 2400, 3500, 4800];
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
        var probability = 2;
        if (!bypass) {
            if (timeIndex < 0 || weightIndex < 0) {
                return;
            }
            probability = TheftConfig[weightIndex][timeIndex];
            if (IAPPackage.isSocialEffectUnlocked()) {
                probability = probability * 1.1;
            }
        }

        var def = this._getHomeDef();
        if (this.isBombActive) {
            def += 30;
        }
        def =  1.0 - (def / 100);
        probability = probability * def;
        var rand = Math.random();

        if (rand <= probability) {
            if (IAPPackage.isStealthUnlocked()) {
                var rand = Math.random();
                if (rand >= 0.25) {
                    saveFlag = true;
                }
            } else { 
                saveFlag = true;
            }
        }
        if (saveFlag) {
            var res = this._getAttackResult(90, 0, this.storage);
            res = res.items;
            var self = this;
            uiUtil.showStolenDialog(stringUtil.getString(9032), "res/new/stealPrompt.png", self, res, true);
            Record.saveAll();
        }
    },
    checkBreakdown: function (source) {
        //Newbie protection - won't break down on the first 5 days.
        var day = cc.timer.formatTime().d;
        if (day < 6 && this.spirit < 20) {
            day = 20 - this.spirit;
            this.changeSpirit(day);
        }
        if (this.spirit < 5) {
            var prob = [0.6, 0.45, 0.32, 0.21, 0.12]
            var rand = Math.random();
            if (rand == prob[this.spirit]) {
                var str = stringUtil.getString(source) + " " + stringUtil.getString(8113) + " ";
                if (source == 8111) {
                    str += stringUtil.getString(8115);
                } else {
                    str += stringUtil.getString(8114);
                }
                this.log.addMsg(str);
                this.die();
            }
        }
    },
    getRandomOwnedItem: function () {
        return this.storage.getRandomItem();
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
        this.fixWater();
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
        Record.saveAll();
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
            case "water":
                return value >= 0;
            case "virus":
                return value < 0;
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
                return;
            }
            if (key === 'starve' && this.buffManager.isBuffEffect(BuffItemEffectType.ITEM_1107042)) {
                return;
            }
            if (key === 'vigour' && this.buffManager.isBuffEffect(BuffItemEffectType.ITEM_1107032)) {
                return;
            }
            if (key === 'virus' && this.buffManager.isBuffEffect(BuffItemEffectType.ITEM_1107052)) {
                return;
            }
        }
        if (key == "vigour" && this.isInSleep && this[key] >= this[key + "Max"]) {
            if (this.hp >= this.hpMax) {
                this.changeSpirit(-1);
            }
        }
        var beforeRangeInfo = this.getAttrRangeInfo(key, this[key]);
        this[key] += value;
        this[key] = Math.round(this[key]);
        if (key == "temperature") {
            this[key] = cc.clampf(this[key], -2, this[key + "Max"]);
        } else {
            this[key] = cc.clampf(this[key], 0, this[key + "Max"]);
        }

        var afterRangeInfo = this.getAttrRangeInfo(key, this[key]);

        if (this === player) {
            utils.emitter.emit(key + "_change", value);
        }
        if (beforeRangeInfo && afterRangeInfo) {
            var suffix;
            var currentTime = Number(cc.timer.time);
            currentTime -= this.lastCoffeeTime;
            if (afterRangeInfo.id - beforeRangeInfo.id > 0) {
                suffix = "_up";
                if (key === "vigour" && currentTime <= 21600) {
                } else {
                    this.log.addMsg(stringUtil.getString(key + suffix)[afterRangeInfo.id - 1]);
                }
                if (key === "infect" || key === "injury") {
                    audioManager.playEffect(audioManager.sound.BAD_EFFECT);
                } else {
                    audioManager.playEffect(audioManager.sound.GOOD_EFFECT);
                }
            } else if (afterRangeInfo.id - beforeRangeInfo.id < 0) {
                suffix = "_down";
                if (key === "vigour" && currentTime <= 21600) {
                } else {
                    this.log.addMsg(stringUtil.getString(key + suffix)[afterRangeInfo.id - 1]);
                }
                if (key === "infect" || key === "injury") {
                    audioManager.playEffect(audioManager.sound.GOOD_EFFECT);
                } else {
                    audioManager.playEffect(audioManager.sound.BAD_EFFECT);
                }
            }
        }
        if (key === "injury") {
            this.updateHpMax();
        }
        if (key === "hp") {
            if (this.hp == 0 && this === player) {
                this.die();
            }
        }
        if (key == "virus") {
            if (this.virus >= this.virusMax && this === player) {
                this.log.addMsg(stringUtil.getString(6671));
                this.changeAttr("hp", -this["hp"]);
            }
        }
        if (key.substring(0, 3) === "dog") {
            utils.emitter.emit("dogStateChange");
        }
    },

    changeHp: function (value) {
        this.changeAttr("hp", value);
    },

    changeStarve: function (value) {
        this.changeAttr("starve", value);
    },

    changeSpirit: function (value) {
        if (value < 0) {
            //Apply safety filter
            var tempSpirit = this.spirit;
            var modifier = 1;
            if (tempSpirit < 30) {
                modifier = 0.85;
                if (tempSpirit < 20) {
                    modifier = 0.7;
                    if (tempSpirit < 10) {
                        modifier = 0.55;
                    }
                }
            }
            var rand = Math.random();
            if (rand < modifier) {
                this.changeAttr("spirit", value);
            }
        } else {
            this.changeAttr("spirit", value);
        }
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
    
    changeWater: function (value) {
        this.changeAttr("water", value);
    },
    
    changeVirus: function (value) {
        this.changeAttr("virus", value);
    },

    updateHpMax: function () {
        var hpBuffEffect = 0;
        if (this.buffManager.isBuffEffect(BuffItemEffectType.ITEM_1107012)) {
            hpBuffEffect = this.buffManager.getBuffValue();
        }
        this.hpMax = this.hpMaxOrigin + hpBuffEffect - this.injury;
        this.hp = Math.min(this.hp, this.hpMax);
    },
    incrementWater: function() {
        var diff = this.waterMax - this.water;
        var season = 0;
        if (cc.timer) {
            season = cc.timer.getSeason()
        }
        if (diff > 18) {
            this.changeWater(18);
        } else {
            var waterUpper = 21600;
            if (season == 3) {
                waterUpper = 14400;
            }
            this.changeWater(diff);
            var given = (18 - diff) / 3 * 3600;
            var temp = Number(cc.timer.time) - waterUpper + given;
            if (temp > this.lastWaterTime) {
                this.lastWaterTime = temp;
            }
        }
    },
    fixWater: function () {
        var amount = Math.ceil((this.waterMax - this.water) / 18);
        var total = 0;
        for (var i = 0; i < amount; i++) {
            if (this.storage.validateItem(1101061, 1)) {
                this.storage.decreaseItem(1101061, 1);
                this.incrementWater();
                total += 1;
            }
        }
        if (total > 0) {
           this.log.addMsg(stringUtil.getString(1330, total));
           Record.saveAll();
        }
    },
    updateByTime: function () {
        var c = this.config["changeByTime"];
        //扣减饥饿度
        this.changeStarve(c[0][0]);
        var curTime = Number(cc.timer.time);
        var season = 0;
        if (cc.timer) {
            season = cc.timer.getSeason()
        }
        //First fix any water deficiency issues.
        var storageAmount = 0;
        var bagAmount = 0;
        if (this.water < this.waterMax) {
            if (!this.isAtHome && this.bag.validateItem(1101061, 1)) {
                this.bag.decreaseItem(1101061, 1);
                this.incrementWater();
                bagAmount += 1;
            } else if (this.isAtHome && this.storage.validateItem(1101061, 1)) {
                this.storage.decreaseItem(1101061, 1);
                this.incrementWater();
                storageAmount += 1;
            }
            if (bagAmount) {
                this.log.addMsg(stringUtil.getString(1329, bagAmount));
            } else if (storageAmount) {
                this.log.addMsg(stringUtil.getString(1330, storageAmount));
            }
        }
        //Add fuel if site is active, then test whether it is still active
        if (this.map.getSite(GAS_SITE).isActive) {
            this.map.getSite(GAS_SITE).checkActive();
            this.onFuelChange(1);
        }
        //Deduct water. If buff is in effect, don't deduct.
        var waterUpper = 21600;
        if (season == 3) {
            waterUpper = 14400;
        }
        if (curTime - this.lastWaterTime >= waterUpper) {
            //Deduct water from either the bag or storage
            if (!this.isAtHome && this.bag.validateItem(1101061, 1)) {
                this.bag.decreaseItem(1101061, 1);
                this.lastWaterTime = curTime;
                this.log.addMsg(stringUtil.getString(1331));
            } else if (this.isAtHome && this.storage.validateItem(1101061, 1)) {
                this.storage.decreaseItem(1101061, 1);
                this.lastWaterTime = curTime;
                this.log.addMsg(stringUtil.getString(1332));
            } else {
                //No water deducted, reduce water status.
                if (season != 3) {
                    this.changeWater(-3);
                } else {
                    this.changeWater(-6);
                }
            }
        }
        if (this.water < 25) {
            this.changeHp(-20);
        }
         //白天家中，精力值	-1    白天野外，精力值	-2    夜晚家中，精力值	-3    夜晚野外，精力值	-4
        if (cc.timer.getStage() === "day") {
            if (this.isAtHome || this.isAtBazaar) {
                this.changeVigour(c[2][0]);
            } else {
                this.changeVigour(c[3][0]);
            }
        } else {
            if (this.isAtHome || this.isAtBazaar) {
                this.changeVigour(c[4][0]);
            } else {
                this.changeVigour(c[5][0]);
            }
        }
        if (!this.buffManager.isBuffEffect(BuffItemEffectType.ITEM_1107042) && this.starve < 10) {
            this.changeHp(-8);
        }
        //在睡眠状态下的影响
        if (this.isInSleep) {
            var bedLevel = player.room.getBuildLevel(9);
            if (this.isInSleepHotel) {
                bedLevel = 2;
            }
            var bedRate = buildActionConfig[9][bedLevel].rate;

            //睡眠等级=床等级值*0.5+饱食度/100*0.2+心情值/100*0.3
            bedRate = bedRate * 0.5 + this.starve / this.starveMax * 0.2 + this.spirit / this.spiritMax * 0.3;

            //精力值
            //每小时回复精力值=睡眠等级*10
            var vigour = bedRate * 15;
            vigour = Math.ceil(vigour);
      
            //生命值
            //每小时回血=睡眠等级*20
            var hp = bedRate * 20;
            hp = Math.ceil(hp);
            
            var currentTime = Number(cc.timer.time);
            currentTime -= this.lastCoffeeTime;     
            if (currentTime <= 21600) {
                vigour = Number(0.2 * vigour);
                hp = Number(0.2 * hp);
            }
            
            this.changeVigour(vigour);
            this.changeHp(hp);
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
        //每小时回复精力值=睡眠等级*10
        var vigour = bedRate * 12;
        vigour = Math.ceil(vigour);
        return vigour;
    },

    updateStarve: function () {
        if (this.buffManager.isBuffEffect(BuffItemEffectType.ITEM_1107042)) {
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
            return;
        }

        var attrRangeInfo = this.getAttrRangeInfo("infect", this.infect);
        if (attrRangeInfo) {
            var effect = attrRangeInfo.effect;
            for (var attr in effect) {
                if (this.hasOwnProperty(attr)) {
                    var value = effect[attr];
                    //感染属性影响中有公式 对血的影响为公式
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
        } else if (this.room.getBuild(5).isActive()) {
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
            value = Number(this[attr] / this[attr + "Max"] * 100);
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
            self.storage.increaseItem(item.itemId, item.num, true);
        });
    },

    gainItemsInBag: function (items) {
        var self = this;
        items.forEach(function (item) {
            self.bag.increaseItem(item.itemId, item.num, true);
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
    
    useItemForDog: function (storage, itemId) {
        if (storage.validateItem(itemId, 1)) {
            var item = storage.getItem(itemId);
            var itemName = stringUtil.getString(itemId).title;
            if (itemId == 1103041) {
                //Meat
                if (!uiUtil.checkDogStarve())
                    return {result: false};
                cc.timer.updateTime(600);
                storage.decreaseItem(itemId, 1);
                this.log.addMsg(1171);
                this.changeAttr("dogFood", 60);
                return {result: true};
            } else if (itemId == 1104011) {
                //Bandage
                cc.timer.updateTime(600);
                storage.decreaseItem(itemId, 1);
                this.log.addMsg(7012, this.getDogName());
                this.changeAttr("dogInjury", 0 - this.dogInjury);
                return {result: true};
            } else if (itemId == 1106014) {
                //dog toy
                cc.timer.updateTime(600);
                storage.decreaseItem(itemId, 1);
                this.log.addMsg(7013, this.getDogName());
                this.changeAttr("dogMood", 60);
                return {result: true};
            } else {
                return {result: false, type: 2, msg: "this type can't use"};
            }
        } else {
            return {result: false, type: 1, msg: "not enough"};
        }
    },
    
    useItem: function (storage, itemId) {
        if (storage.validateItem(itemId, 1)) {
            var item = storage.getItem(itemId);
            var itemName = stringUtil.getString(itemId).title;
            if (item.isType(ItemType.TOOL, ItemType.FOOD)) {
                if (!uiUtil.checkStarve())
                    return {result: false};
                cc.timer.updateTime(600);
                storage.decreaseItem(itemId, 1);
                this.log.addMsg(1093, itemName, storage.getNumByItemId(itemId));
                this.itemEffect(item, item.getFoodEffect());
                return {result: true};
            } else if (item.isType(ItemType.TOOL, ItemType.MEDICINE)) {
                cc.timer.updateTime(600);
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
                cc.timer.updateTime(600);
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
        if (rand <= hpChance) {
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
                if (rand <= chance) {
                    var funName = cc.formatStr("change%s%s", key.substr(0, 1).toUpperCase(), key.substr(1));
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
        if (this.room.isBuildExist(19, 0)) {  //电网抵御僵尸
            if (electricFenceBuild.isActive()) {
                homeDef += 30;
            }
        }
        return homeDef;
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
        if (attackStrength > def) {
            var produceValue = attackStrength / 5 - 1 + 3;
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
                        tmpStorage.increaseItem(itemId, 1, false);
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
        var deleteItem = [1305064, 1305053, 1305034, 1305024, 1305023, 1102073, 1301091, 1305075];
        for (var a in deleteItem) {
            delete copyItem[deleteItem[a]];
        }
        var le = Object.keys(copyItem).length;
        var dailyAmount = utils.getRandomInt(4, 6);
        var result = myNum(dailyAmount, 0, le - 1);
        
        result.forEach(function(k) {
            var itemId = Number(Object.keys(copyItem)[k]);
            var amount = 8;
            if (itemId == 1305011 || itemId == 1305012) {
                amount = 32;
            }
            var twentyList = [1101011, 1101021, 1101031, 1101041, 1101051, 1103011, 1105042];
            var fifteenList = [1101061, 1101071, 1101073];
            var fiveList = [1102011, 1102022, 1102033, 1102042, 1103074, 1104032, 1301011, 1301022, 1301033, 1301041, 1301052, 1301063, 1301071, 1301082, 1302043, 1303033, 1303044, 1103094]
            var twoList = [1102053, 1102063, 1104043, 1106054, 1107012, 1107022, 1107032, 1107042, 1107052, 1106013, 1306001, 1305023, 1305024];
            
            if (fiveList.indexOf(itemId) !== -1) {
                amount = 4;
            } else if (twoList.indexOf(itemId) !== -1) {
                amount = 2;
            } else if (twentyList.indexOf(itemId) !== -1) {
                amount = 16;
            } else if (fifteenList.indexOf(itemId) !== -1) {
                amount = 12;
            } if (itemId == 1106054) {
                amount = 1;
            }
            var discountRand = Math.random();
            if (discountRand < 0.05) {
                discountRand = 15;
            } else if (discountRand < 0.15) {
                discountRand = 10;
            } else if (discountRand < 0.3) {
                discountRand = 5;
            } else {
                discountRand = 0;
            }
            rray.push({"itemId": itemId, "amount": amount, "discount": discountRand});
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

            this.log.addMsg(1099);
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
                    homeDef += 30;
                    homeRes = this._getAttackResult(attackStrength, homeDef, this.storage);
                    homeRes.isBomb = true;
                    homeRes.happened = true;
                    utils.emitter.emit("bombUsed");
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

    randomAttack: function (cb, override) {
        var stage = cc.timer.getStage();
        var timeObj = cc.timer.formatTime();
        var config;
        for (var i = 0; i < RandomBattleConfig.strength.length; i++) {
            var strengthObj = RandomBattleConfig.strength[i];
            if (timeObj.d >= strengthObj.time[0] && timeObj.d <= (strengthObj.time[1] ? strengthObj.time[1] : Number.MAX_VALUE)) {
                config = strengthObj[stage];
                break;
            }
        }
        var rand = Math.random();
        var probability = config.probability;

        if (IAPPackage.isStealthUnlocked()) {
            probability -= probability * 0.25;
        }
        if (player.equip.isEquiped(1305053)) {
            probability -= probability * 0.25;
        }
        var specialTheft = false;
        if (IAPPackage.isSocialEffectUnlocked()) {
            var randTheft = Math.random();
            if (randTheft < 0.1) {
                specialTheft = true;
            }
        }
        
        if (rand <= probability || override || specialTheft) {
            var diff;
            var list;
            var type = 0;
            var banditList = null;
            if (!override) {
                //no saved battle. Start new one. First, determine if this should be a bandit battle.
                var banditRand = Math.random();
                if (banditRand <= 0.25 || specialTheft) {
                    //bandit battle. check if day is immune
                    if (this.lastBanditCaveIn >= cc.timer.getTimeNum()) {
                        return false;
                    }
                    diff = utils.getRandomInt(1, 2);
                    list = utils.getMonsterListByDifficulty(diff);
                    banditList = this.bag.getRobItem();
                    type = 1;
                    this.mapBattle = {"a": diff, "b": list, "c": 1, "d": banditList};
                } else {
                    //zombie battle per usual.
                    diff = utils.getRandomInt(config.difficulty[0], config.difficulty[1]);
                    list = utils.getMonsterListByDifficulty(diff);
                    this.mapBattle = {"a": diff, "b": list, "c": 0, "d": null};
                }
                Record.saveAll();
            } else {
                //We have saved battle. Process it first.
                diff = this.mapBattle.a;
                //Compatibility check - if user is from previous versions assume is zombie battle once.
                if (this.mapBattle.hasOwnProperty('c')) {
                    type = this.mapBattle.c;
                    banditList = this.mapBattle.d;
                }
                list = utils.getMonsterListByDifficulty(diff);
            }
            if (type) {
                this.log.addMsg(9113);
            } else {
                this.log.addMsg(1113);
            }

            uiUtil.showRandomBattleDialog({
                difficulty: diff,
                list: list,
                type: type,
                banditList: banditList
            }, cb);
            return true;
        }
        return false;
    },
    start: function () {
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
                self.npcManager.visitSale();
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
            self.Steal = utils.getRandomInt(35, 60);
            self.hasDogPlay = true;
            utils.emitter.emit("Steal");
            self.updateBazaarList();
            self.underAttackInNight();
            self.room.getBuild(9).sleeped = false;
            cc.timer.checkSeason();
            cc.sys.localStorage.setItem("ad" + utils.SAVE_SLOT, "1");
        });
        cc.timer.addTimerCallbackDayByDayOneAM(this, function () {
            var fridgeBuild = self.room.getBuildLevel(21);
            if (fridgeBuild < 0 || !this.map.getSite(WORK_SITE).isActive) {
                self.expireFoodCraft(false);
            } else {
                self.expireFoodCraft(true);
            }
        });

        cc.timer.addTimerCallbackHourByHour(this, function () {
            self.updateByTime();
            self.updateTemperature();
            self.updateTemperatureEffect();
            self.updateStarve();
            self.updateInjure();
            self.updateInfect();
            self.updateVigour();
            self.updateDogFood();

            var workSite = self.map.getSite(WORK_SITE);
            //we don't check worksite broken between 10pm and 1am for player protection
            var h = cc.timer.formatTime().h;
            if (workSite && h < 22 && h > 1) {
                workSite.checkActive();
            }

            var now = cc.timer.now();
            if (self.bindTime) {
                if (now - self.bindTime >= 24 * 60 * 60) {
                    self.binded = false;
                }
            }
            if (self.cureTime) {
                if (now - self.cureTime >= 24 * 60 * 60) {
                    self.cured = false;
                }
            }
        });
        cc.timer.addTimerCallbackByMinute(this.buffManager);
    },

    die: function () {
        this.buffManager.abortBuff();
        this.isDead = true;
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
        this.changeWater(this.waterMax - this.water);
        this.changeVirus(0 - Math.ceil(this.virus / 2));
        this.changeAttr("hp", this.hpMax);
        this.isInSleep = false;
        this.cured = false;
        this.binded = false;
        //所有建筑需要复原
        this.room.forEach(function (build) {
            build.resetActiveBtnIndex();
        });
        this.isDead = false;
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