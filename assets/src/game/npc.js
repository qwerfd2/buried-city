/**
 * Created by lancelot on 15/7/7.
 */
var NPC = BaseSite.extend({
    ctor: function (npcId) {
        this._super();
        this.id = npcId;
        this.config = utils.clone(npcConfig[this.id]);
        this.pos = this.config.coordinate;

        this.reputation = 0;
        this.reputation = memoryUtil.encode(this.reputation);
        this.reputationMax = 10;
        this.reputationMax = memoryUtil.encode(this.reputationMax);
        //交易次数
        this.tradingCount = 0;

        this.storage = new Storage();

        this.dialogs = stringUtil.getString("npc_" + this.id).dialogs;
        //曾经到达过的最大声望
        this.maxRep = -1;
        this.tradingInfo = this.config.trading;
        this.needItemInfo = this.config.needItem;
        this.favoriteList = this.config.favorite;
        this.giftInfo = this.config.gift;
        this.giftExtraInfo = this.config.gift_extra;
        this.needSendGiftList = {};

        this.isUnlocked = false;
        this.isSteal = true;
        this.Alert = 0;
        this.log = [];
        this.changeReputation(0);
    },
    save: function () {
        return {
            pos: this.pos,
            reputation: memoryUtil.decode(this.reputation),
            maxRep: memoryUtil.decode(this.maxRep),
            storage: this.storage.save(),
            needSendGiftList: this.needSendGiftList,
            isUnlocked: this.isUnlocked,
            tradingCount: this.tradingCount,
            isSteal: this.isSteal,
            Alert: this.Alert,
            log: this.log
        };
    },
    restore: function (saveObj) {
        if (saveObj) {
            this.pos = saveObj.pos;
            this.reputation = memoryUtil.encode(saveObj.reputation);
            this.maxRep = memoryUtil.encode(saveObj.maxRep);
            this.storage.restore(saveObj.storage);
            this.needSendGiftList = saveObj.needSendGiftList;
            this.isUnlocked = saveObj.isUnlocked;
            this.tradingCount = saveObj.tradingCount;
            this.isSteal = saveObj.isSteal;
            this.Alert = saveObj.Alert;
            this.log = saveObj.log;
        } else {
            this.init();
        }
    },
    init: function () {
        this.changeReputation(0);
    },
    
    changeAlert: function (value) {
        if (this.Alert == 30 && value > 0) {
            return false;
        } else if (this.Alert <= 0 && value < 0) {
            return false;
        }
        this.Alert += value;
        utils.emitter.emit("Alert");
    },
    changeReputation: function (value) { 
    
        if (this.reputation == this.reputationMax && value > 0) {
            return false;
        } else if (memoryUtil.decode(this.reputation) == 0 && value < 0) {
            return false;
        }

        if (value > 0) {
            player.log.addMsg(1105, this.getName());
            audioManager.playEffect(audioManager.sound.GOOD_EFFECT);
        } else if (value < 0) {
            player.log.addMsg(1106, this.getName());
            audioManager.playEffect(audioManager.sound.BAD_EFFECT);
        }

        this.reputation += memoryUtil.changeEncode(value);
        this.reputation = memoryUtil.encode(cc.clampf(memoryUtil.decode(this.reputation), 0, memoryUtil.decode(this.reputationMax)));
        cc.i("reputation " + this.reputation);
        if (this.isReputationMax()) {
            Achievement.checkNpcReputation(this.id);
        }
        this.unlockByReputation();
        return true;
    },
    unlockByReputation: function () {
        if (this.reputation > this.maxRep) {
            for (var start = memoryUtil.decode(this.maxRep) + 1, end = memoryUtil.decode(this.reputation); start <= end; start++) {
                this.unlockTrading(start, true);
                this.unlockGift(start);
            }
            this.maxRep = this.reputation;
        }
    },

    unlockGift: function (index) {
        var gift = this.giftInfo[index];
        if (gift) {
            if (gift.hasOwnProperty("itemId")) {
                this.needSendGiftList["item"] = this.needSendGiftList["item"] || [];
                this.needSendGiftList["item"].push(gift);
            } else {
                this.needSendGiftList["site"] = this.needSendGiftList["site"] || [];
                this.needSendGiftList["site"].push(gift);
            }
        }
        if (IAPPackage.isSocialEffectUnlocked()) {

            var giftExtra = this.giftExtraInfo[index];
            if (giftExtra) {
                if (giftExtra.hasOwnProperty("itemId")) {
                    this.needSendGiftList["item"] = this.needSendGiftList["item"] || [];
                    this.needSendGiftList["item"].push(giftExtra);
                } else {
                    this.needSendGiftList["site"] = this.needSendGiftList["site"] || [];
                    this.needSendGiftList["site"].push(giftExtra);
                }
            }
        };
    },

    unlockTrading: function (index, isUnlock) {
        var tradingList = this.tradingInfo[index];
        if (tradingList) {
            //当index=0时为初始化数据,不产生日志.当解锁时产生日志,刷新时不产生日志
            if (index && isUnlock) {
                player.log.addMsg(1120);
            }
            for (var i = 0; i < tradingList.length; i++) {
                var itemInfo = tradingList[i];
                if (itemInfo) {
                    this.storage.increaseItem(itemInfo.itemId, itemInfo.num);
                }
            }
        }
    },
    updateTradingItem: function () {
        this.storage = new Storage();
        for (var start = 0, end = memoryUtil.decode(this.reputation); start <= end; start++) {
            this.unlockTrading(start);
        }
    },
    getNeedItem: function () {
        var itemInfo;
        for (var i = memoryUtil.decode(this.reputation); i >= 0; i--) {
            itemInfo = this.needItemInfo[i];
            if (itemInfo != null) {
                break;
            }
        }
        return itemInfo;
    },
    takeNeedItem: function () {
        var itemInfo = this.getNeedItem();
        if (player.bag.validateItem(itemInfo.itemId, itemInfo.num)) {
            player.bag.decreaseItem(itemInfo.itemId, itemInfo.num);
            this.changeReputation(1);
        }
    },
    getDialog: function () {
        var rand = utils.getRandomInt(0, this.dialogs.length - 1);
        return this.dialogs[rand];
    },
    //获得交易比例
    getTradeRate: function (storage) {
        var favorite = this.favoriteList[memoryUtil.decode(this.reputation)];
        var npcOriginTotalPrice = 0;
        this.storage.forEach(function (item, num) {
            var deltaPrice = 1;
            favorite.forEach(function (itemInfo) {
                if (itemInfo.itemId == item.id) {
                    cc.i("high price itemId=" + itemInfo.itemId)
                    deltaPrice = itemInfo.price;
                }
            });
            npcOriginTotalPrice += (item.getPrice() * deltaPrice * num);
        });

        var npcCurrentTotalPrice = 0;
        storage.forEach(function (item, num) {
            var deltaPrice = 1;
            favorite.forEach(function (itemInfo) {
                if (itemInfo.itemId == item.id) {
                    cc.i("high price itemId=" + itemInfo.itemId)
                    deltaPrice = itemInfo.price;
                }
            });
            npcCurrentTotalPrice += (item.getPrice() * deltaPrice * num);
        });
        return npcCurrentTotalPrice / npcOriginTotalPrice;
    },

    needSendGift: function () {
        return Object.keys(this.needSendGiftList).length > 0;
    },
    sendGift: function () {
        cc.i("sendGift");
        uiUtil.showNpcSendGiftDialog(this);
    },
    needHelp: function () {
        cc.i("needHelp");
        var self = this;
        cc.timer.pause();
        var needRestore = false;
        if (!IAPPackage.isSocialEffectUnlocked() && !IAPPackage.isAllItemUnlocked()) {
            //如果扣减成功,需要在yes的时候回复
            needRestore = this.changeReputation(-1);
        }
        Record.saveAll();

        uiUtil.showNpcNeedHelpDialog(this,
            //no
            function () {
                player.log.addMsg(1102, self.getName());
                cc.timer.resume();
                Record.saveAll();
            },
            //yes
            function () {
                player.cost(this.needHelpItems);
                var itemInfo = this.needHelpItems[0];
                player.log.addMsg(1101, self.getName(), itemInfo.num, stringUtil.getString(itemInfo.itemId).title, player.storage.getNumByItemId(itemInfo.itemId));
                if (needRestore) {
                    this.changeReputation(1);
                }
                this.changeReputation(1);
                cc.timer.resume();
                Record.saveAll();
            }, needRestore
        );
    },
    getNeedHelpItems: function () {
        this.needHelpItems = utils.convertItemIds2Item(utils.getFixedValueItemIds(npcGiftConfig.produceValue, npcGiftConfig.produceList));
        return this.needHelpItems;
    },
    getName: function () {
        return stringUtil.getString("npc_" + this.id).name;
    },
    getDes: function () {
        return stringUtil.getString("npc_" + this.id).des;
    },
    isReputationMax: function () {
        return this.reputation === this.reputationMax;
    }
});

var NPCManager = cc.Class.extend({
    ctor: function () {
        this.npcList = {};
    },
    save: function () {
        var npcSaveObj = {};
        for (var npcId in this.npcList) {
            npcSaveObj[npcId] = this.npcList[npcId].save();
        }
        return {
            npcList: npcSaveObj
        };
    },
    restore: function (saveObj) {
        if (saveObj) {
            for (var npcId in saveObj.npcList) {
                var npc = new NPC(npcId);
                npc.restore(saveObj.npcList[npcId]);
                this.npcList[npcId] = npc;
            }
        } else {
            this.init();
        }
    },
    init: function () {
        //初始化所有NPC
        for (var npcId in npcConfig) {
            this.npcList[npcId] = new NPC(npcId);
        }
    },
    visitPlayer: function () { 
        if (IAPPackage.isAllItemUnlocked()) {
            this.unlockNpc(1);this.unlockNpc(2);this.unlockNpc(3);this.unlockNpc(4);this.unlockNpc(5);this.unlockNpc(6);
        }
        if (cc.timer.formatTime().d < 2) {
            return;
        }
       
        var rand = utils.getRandomInt(0, 100);
        cc.i("visitPlayer " + rand);
        var criteria = 10;
        var chatlog = JSON.parse(cc.sys.localStorage.getItem("radio") || "[]");
        if (chatlog.length > 0) {
            var addtime = cc.timer.time - 60*60*36;
            if (chatlog[0].time > addtime) {
                criteria += 15;
            }
        }
        if (rand <= criteria) {
            player.log.addMsg(1100);
            var npcPool = [1,2,3,4,5,6];
            var npcId = npcPool[utils.getRandomInt(0, npcPool.length - 1)];
            this.unlockNpc(npcId);
            var npc = this.npcList[npcId];
            if (npc.needSendGift()) {
                npc.sendGift();
            } else {
                npc.needHelp();
            }
        }
    },
    unlockNpc: function (npcId) {
        var npc = this.npcList[npcId];
        if (!npc.isUnlocked) {
            npc.isUnlocked = true;
            player.map.unlockNpc(npcId);
            Achievement.checkNpcUnlock(npcId);
            if (IAPPackage.isAllItemUnlocked()) {
                npc.reputation = 10;
            }
        }
    },
    updateTradingItem: function () {
        for (var npcId in this.npcList) {
            var npc = this.npcList[npcId];
            npc.updateTradingItem();
        }
    },
    getNPC: function (npcId) {
        return this.npcList[npcId]
    }
});