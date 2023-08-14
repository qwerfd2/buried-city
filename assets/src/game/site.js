var BaseSite = cc.Class.extend({
    ctor: function () {
        this.pos = cc.p(utils.getRandomInt(5, 25), utils.getRandomInt(5, 50));
    }
});

var WorkRoomTypeLen = 3;
var SecretWorkRoomTypeLen = 3;
var HOME_SITE = 100;
var AD_SITE = 202;
var BOSS_SITE = 61;
var WORK_SITE = 204;
var GAS_SITE = 201;
var BAZAAR_SITE = 400;

var Site = BaseSite.extend({
    ctor: function (siteId) {
        this._super();

        this.id = siteId;
        this.config = utils.clone(siteConfig[this.id]);
        this.pos = this.config.coordinate;
        this.storage = new Storage();
        this.step = 0;
        this.rooms = [];

        if (this.config.secretRoomsId) {
            this.secretRoomsConfig = utils.clone(secretRooms[this.config.secretRoomsId]);
            this.secretRoomType = utils.getRandomInt(0, SecretWorkRoomTypeLen - 1);
        }
        this.secretRoomsShowedCount = 0;
        this.isSecretRoomsEntryShowed = false;
        this.isInSecretRooms = false;
        this.secretRooms = [];
        this.secretRoomsStep = 0;

        this.isUnderAttacked = false;
        this.haveNewItems = false;
        this.isActive = false;
        this.fixedTime = 0;
    },
    testSecretRoomsBegin: function () {
        if (this.secretRoomsConfig) {
            //密室收到道具影响
            var maxCount = Number.parseInt(this.secretRoomsConfig.maxCount);
            if (player.equip.isEquiped(1305064)) {
                maxCount += 1;
            }
            if (this.secretRoomsShowedCount < maxCount) {
                var probability = Number.parseFloat(this.secretRoomsConfig.probability);

                if (player.equip.isEquiped(1305064)) {
                    probability += 0.16;
                }
                var rand = Math.random();
                if (probability >= rand) {
                    this.isSecretRoomsEntryShowed = true;
                    this.secretRoomsShowedCount++;
                    this.secretRooms = [];
                    this.secretRoomsStep = 0;
                    this.genSecretRooms();
                }
            }
        }
    },
    enterSecretRooms: function () {
        this.isInSecretRooms = true;
        this.isSecretRoomsEntryShowed = false;
    },
    secretRoomBegin: function () {
        return this.secretRooms[this.secretRoomsStep];
    },
    secretRoomEnd: function () {
        this.secretRoomsStep++;
        if (this.isSecretRoomsEnd()) {
            this.secretRoomsEnd();
        }
    },
    secretRoomsEnd: function () {
        this.isInSecretRooms = false;
        Medal.checkSecretRoomEnd(1);
    },
    isSecretRoomsEnd: function () {
        return this.secretRoomsStep >= this.secretRooms.length;
    },
    genSecretRooms: function () {
        var secretRoomsLength = utils.getRandomInt(this.secretRoomsConfig.minRooms, this.secretRoomsConfig.maxRooms);
        for (var i = 0; i < secretRoomsLength - 1; i++) {
            var diff = utils.getRandomInt(this.config.difficulty[0] + this.secretRoomsConfig.minDifficultyOffset, this.config.difficulty[1] + this.secretRoomsConfig.maxDifficultyOffset);
            diff = cc.clampf(diff, 1, 12);
            var list = utils.getMonsterListByDifficulty(diff)
            this.secretRooms.push({
                list: list,
                difficulty: diff,
                type: "battle"
            });
        }
        var produceValue = this.secretRoomsConfig.produceValue;
        produceValue = IAPPackage.getDropEffect(produceValue);
        var itemIds = utils.getFixedValueItemIds(produceValue, this.secretRoomsConfig.produceList);
        var workRoom = utils.convertItemIds2Item(itemIds);
        this.secretRooms.push({
            list: workRoom,
            workType: utils.getRandomInt(0, WorkRoomTypeLen - 1),
            type: "work"
        });
    },
    save: function () {
        return {
            pos: this.pos,
            step: this.step,
            rooms: this.rooms,
            storage: this.storage.save(),

            secretRoomsShowedCount: this.secretRoomsShowedCount,
            isSecretRoomsEntryShowed: this.isSecretRoomsEntryShowed,
            isInSecretRooms: this.isInSecretRooms,
            secretRooms: this.secretRooms,
            secretRoomsStep: this.secretRoomsStep,
            secretRoomType: this.secretRoomType,
            closed: this.closed,
            isUnderAttacked: this.isUnderAttacked,
            haveNewItems: this.haveNewItems,
            isActive: this.isActive,
            fixedTime: this.fixedTime
        };
    },
    restore: function (saveObj) {
        if (saveObj) {
            this.pos = saveObj.pos;
            this.step = saveObj.step;
            this.rooms = saveObj.rooms;
            this.storage.restore(saveObj.storage);
            this.secretRoomsShowedCount = saveObj.secretRoomsShowedCount;
            this.isSecretRoomsEntryShowed = saveObj.isSecretRoomsEntryShowed;
            this.isInSecretRooms = saveObj.isInSecretRooms;
            this.secretRooms = saveObj.secretRooms;
            this.secretRoomsStep = saveObj.secretRoomsStep;
            this.secretRoomType = saveObj.secretRoomType;
            this.closed = saveObj.closed;
            this.isUnderAttacked = saveObj.isUnderAttacked;
            this.haveNewItems = saveObj.haveNewItems;
            this.isActive = saveObj.isActive;
            this.fixedTime = saveObj.fixedTime;
        } else {
            this.init();
        }
    },
    init: function () {
        //家不生成副本
        if (this.id !== HOME_SITE) {
            this.genRooms();
        }
    },
    
    getName: function () {
        return stringUtil.getString("site_" + this.id).name;
    },
    getDes: function () {
        return stringUtil.getString("site_" + this.id).des;
    },
    genRooms: function () {
        var battleRooms = this.genBattleRoom();
        var workRooms = this.genWorkRoom();
        var roomLen = this.config.battleRoom + this.config.workRoom;
        var rooms = [];
        //如果有工作间,先放一个在末尾
        if (workRooms.length > 0) {
            var room = {};
            var endWorkRoomIndex = utils.getRandomInt(0, workRooms.length - 1);
            var workRoom = workRooms.splice(endWorkRoomIndex, 1)[0];
            room.list = workRoom;
            room.type = "work";
            room.workType = utils.getRandomInt(0, WorkRoomTypeLen - 1);
            rooms.unshift(room);
            roomLen--;
        }

        while (roomLen-- > 0) {
            var index = utils.getRandomInt(0, roomLen);
            var room = {};
            if (index > battleRooms.length - 1) {
                index -= battleRooms.length;
                var workRoom = workRooms.splice(index, 1)[0];
                room.list = workRoom;
                room.type = "work";
                room.workType = utils.getRandomInt(0, WorkRoomTypeLen - 1);
            } else {
                var battleRoom = battleRooms.splice(index, 1)[0];
                room.list = battleRoom.list;
                room.type = "battle";
                room.difficulty = battleRoom.difficulty;
            }
            rooms.unshift(room);
        }
        this.rooms = rooms;
    },
    genBattleRoom: function () {
        var res = [];
        for (var i = 0; i < this.config.battleRoom; i++) {
            var diff = utils.getRandomInt(this.config.difficulty[0], this.config.difficulty[1]);
            var list = utils.getMonsterListByDifficulty(diff)
            res.push({list: list, difficulty: diff});
        }
        return res;
    },
    genWorkRoom: function () {
        var workRooms = [];
        if (this.config.workRoom > 0) {
            var produceValue = this.config.produceValue;
            produceValue = IAPPackage.getDropEffect(produceValue);
            var itemIds = utils.getFixedValueItemIds(produceValue, this.config.produceList);
            var fixedProduceList = this.config.fixedProduceList;
            fixedProduceList.forEach(function (item) {
                for (var i = 0; i < item.num; i++) {
                    itemIds.push(item.itemId);
                }
            });
            for (var i = 0; i < this.config.workRoom; i++) {
                workRooms.push([]);
            }
            itemIds.forEach(function (itemId) {
                var index = utils.getRandomInt(0, workRooms.length - 1);
                var wr = workRooms[index];
                wr.push(itemId);
            });
            workRooms = workRooms.map(function (workRoom) {
                return utils.convertItemIds2Item(workRoom);
            });
        }
        return workRooms;
    },

    roomBegin: function () {
        return this.rooms[this.step];
    },
    roomEnd: function (isWin) {
        if (isWin) {
            var doneRoom = this.roomBegin();
            if (doneRoom.type === "battle") {
            } else {
                player.log.addMsg(1117, stringUtil.getString(3007)[doneRoom.workType]);
            }
            this.step++;
            if (this.step >= this.rooms.length) {
                this.siteEnd();
            }
        }
    },
    siteEnd: function () {
        player.log.addMsg(1119, this.getName());
        var unlockValue = this.config.unlockValue;
        if (unlockValue.site) {
            unlockValue.site.forEach(function (siteId) {
                player.map.unlockSite(siteId);
            });
        }
        if (unlockValue.npc) {
            unlockValue.npc.forEach(function (npcId) {
                player.npcManager.unlockNpc(npcId);
            });
        }
    },
    isSiteEnd: function () {
        return this.step >= this.rooms.length;
    },
    //进度
    getProgressStr: function (val, id) {
        if (val == 1 && this.step >= this.rooms.length && IAPPackage.isAllItemUnlocked()) {
            this.step = 0;
        } else if (val == 0 && this.step >= this.rooms.length && IAPPackage.isAllItemUnlocked() && id > 300){
            this.step = 0;
        }
        return this.step + "/" + this.rooms.length;
    },
    //当前room的指示
    getCurrentProgressStr: function () {
        return (this.step + 1) + "/" + this.rooms.length;
    },
    canClose: function () {
        if (IAPPackage.isAllItemUnlocked()){
          return false;
        }
        return this.isSiteEnd() && this.storage.isEmpty();
    },
    increaseItem: function (itemId, num) {
        this.storage.increaseItem(itemId, num, false);
        this.haveNewItems = true;
    },
    getAllItemNum: function () {
        return this.storage.getAllItemNum();
    }
});

var AdSite = Site.extend({
    ctor: function (siteId) {
        this.id = siteId;
        this.config = utils.clone(siteConfig[this.id]);
        this.pos = this.config.coordinate;
        this.storage = new Storage();
        this.isActive = false;
    },
    save: function () {
        return {
            pos: this.pos,
            step: this.step,
            storage: this.storage.save(),
            isActive: this.isActive,
            haveNewItems: this.haveNewItems
        };
    },
    restore: function (saveObj) {
        if (saveObj) {
            this.pos = saveObj.pos;
            this.step = saveObj.step;
            this.storage.restore(saveObj.storage);
            this.isActive = saveObj.isActive;
            this.haveNewItems = saveObj.haveNewItems;
        } else {
            this.init();
        }
    },
    init: function () {
    },
    isSiteEnd: function () {
        return false;
    },
    //进度
    getProgressStr: function () {
        return "???";
    },
    //当前room的指示
    getCurrentProgressStr: function () {
        return "";
    }
});

var BazaarSite = Site.extend({
    ctor: function (siteId) {
        this.id = siteId;
        this.config = utils.clone(siteConfig[this.id]);
        this.pos = this.config.coordinate;
        this.storage = new Storage();
        this.isActive = false;
    },
    save: function () {
        return {
            pos: this.pos,
            step: this.step,
            storage: this.storage.save(),
            isActive: this.isActive,
            haveNewItems: this.haveNewItems
        };
    },
    restore: function (saveObj) {
        if (saveObj) {
            this.pos = saveObj.pos;
            this.step = saveObj.step;
            this.storage.restore(saveObj.storage);
            this.isActive = saveObj.isActive;
            this.haveNewItems = saveObj.haveNewItems;
        } else {
            this.init();
        }
    },
    init: function () {
    },
    isSiteEnd: function () {
        return false;
    },
    //进度
    getProgressStr: function () {
        return "???";
    },
    //当前room的指示
    getCurrentProgressStr: function () {
        return "";
    }
});

var WorkSite = Site.extend({
    canClose: function () {
        return false;
    },
    fix: function () {
        this.isActive = true;
        this.fixedTime = cc.timer.time;
        if (this.id == 204) {
            utils.emitter.emit('onWorkSiteChange', this.isActive);
        } else {
            utils.emitter.emit('onGasSiteChange', this.isActive);
        }
    },
    checkActive: function () {
        if (this.isActive) {
            var intervalTime = cc.timer.time - this.fixedTime;
            var criteria;
            var probability;
            if (this.id == 204) {
                criteria = workSiteConfig.lastTime;
                probability = workSiteConfig.brokenProbability;
            } else {
                criteria = gasSiteConfig.lastTime;
                probability = gasSiteConfig.brokenProbability;
            }
            if (intervalTime > criteria * 60) {
                var rand = Math.random();
                if (rand < probability) {
                    this.isActive = false;
                    Record.saveAll();
                    if (this.id == 204) {
                        utils.emitter.emit('onWorkSiteChange', this.isActive);
                    } else {
                        utils.emitter.emit('onGasSiteChange', this.isActive);
                    }
                }
            }
        }
    }
});

var BossSite = Site.extend({
    ctor: function (siteId) {
        this.id = siteId;
        this.config = utils.clone(siteConfig[this.id]);
        this.pos = this.config.coordinate;
        this.storage = new Storage();
        this.bossSubSiteIds = [301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312];
    },
    save: function () {
        return {
            pos: this.pos,
            step: this.step,
            storage: this.storage.save(),
        };
    },
    restore: function (saveObj) {
        if (saveObj) {
            this.pos = saveObj.pos;
            this.step = saveObj.step;
            this.storage.restore(saveObj.storage);
        } else {
            this.init();
        }
    },
    init: function () {
    },
    isSiteEnd: function () {
        return false;
    },
    //进度
    getProgressStr: function () {
        var doneNum = 0;
        this.bossSubSiteIds.forEach(function (siteId) {
            var site = player.map.getSite(siteId);
            if (site) {
                doneNum++;
            }
        });
        return doneNum + "/" + this.bossSubSiteIds.length;
    },
    //当前room的指示
    getCurrentProgressStr: function () {
        return "";
    },
    getAllItemNum: function () {
        var num = 0;
        this.bossSubSiteIds.forEach(function (siteId) {
            var site = player.map.getSite(siteId);
            if (site) {
                num += site.getAllItemNum();
            }
        });
        return num;
    }
});