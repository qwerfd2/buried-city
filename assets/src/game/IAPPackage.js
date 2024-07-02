var PurchaseList = {
    201: {
        effect: [
            {itemId: 1103011, num: 10},
            {itemId: 1103041, num: 10},
            {itemId: 1103083, num: 5}
        ]
    },
    202: {
        effect: [
            {itemId: 1105011, num: 20},
            {itemId: 1105022, num: 5}
        ]
    },
    203: {
        effect: [
            {itemId: 1106054, num: 1}
        ]
    },
    204: {
        effect: [
            {itemId: 1104011, num: 3},
            {itemId: 1104021, num: 3}
        ]
    },
    205: {
        effect: [
            {itemId: 1301033, num: 1},
            {itemId: 1305011, num: 50}
        ]
    },
    206: {
        effect: [
            {itemId: 1301052, num: 1},
            {itemId: 1302021, num: 2},
            {itemId: 1305011, num: 100},
            {itemId: 1302011, num: 2},
            {itemId: 1301011, num: 2}
        ]
    },
    207: {
        effect: [
            {itemId: 1103083, num: 10},
            {itemId: 1105011, num: 40},
            {itemId: 1103041, num: 20},
            {itemId: 1103011, num: 20},
            {itemId: 1101011, num: 30}
        ]
    }
};

var IAPPackage = {
    _map: {},
    _record: {},

    init: function (player) {
        if (this.getChosenTalentPurchaseId(102)){
            player.hp += 60;
            player.hpMaxOrigin += 60;
            player.hpMax = player.hpMaxOrigin;
        }
    },

    getPreciseEffect: function (precise) {
        if (this.getChosenTalentPurchaseId(101)){
            return precise + (1 - precise) * 0.3;
        } else {
            return precise;
        }
    },

    getDropEffect: function (produceValue) {
        if (this.getChosenTalentPurchaseId(103)){
            return produceValue * (1 + 0.25);
        } else {
            return produceValue;
        }
            
    },

    isSocialEffectUnlocked: function () {
        return this.getChosenTalentPurchaseId(104);
    },
    
    isWeaponEffectUnlocked: function() {
        return this.getChosenTalentPurchaseId(0);
    },

    isHoarderUnlocked: function () {
        return this.getChosenTalentPurchaseId(105);
    },

    isHandyworkerUnlocked: function () {
        return this.getChosenTalentPurchaseId(106);
    },

    isStealthUnlocked: function () {
        return this.getChosenTalentPurchaseId(107);
    },
    
    isBigBagUnlocked: function () {
        return this.getChosenTalentPurchaseId(108);
    },
    
    isAllIAPUnlocked: function () {
        return this.getChosenTalentPurchaseId(109);
    },
    
    isAllItemUnlocked: function () {
        return this.getChosenTalentPurchaseId(110);
    },

    chooseTalent: function (id) {
        var purchaseId = JSON.parse(cc.sys.localStorage.getItem("chosenTalent" + utils.SAVE_SLOT));
        var index = -1;
        for (var i = 0; i < purchaseId.length; i++){
            if (purchaseId[i] == id){
                index = i;
            }
        }
        if (index == -1) {
            purchaseId.push(id);
        }else{
            purchaseId.splice(index, 1);
        }
        cc.sys.localStorage.setItem("chosenTalent" + utils.SAVE_SLOT, JSON.stringify(purchaseId));
    },

    getChosenTalentPurchaseId: function (id) {
        var purchaseId = JSON.parse(cc.sys.localStorage.getItem("chosenTalent" + utils.SAVE_SLOT));
        for (var i = 0; i < purchaseId.length; i++){
            if (purchaseId[i] == id){
                return true;
            }
        }
        return false;
    },

    payConsumeIAP: function (purchaseId) {
        if (!this.isAllIAPUnlocked()) {
            player.log.addMsg(1245);
        } else {
            player.log.addMsg(1214, stringUtil.getString("p_" + purchaseId).name);
            var effect = PurchaseList[purchaseId].effect;
            effect.forEach(function (obj) {
                player.storage.increaseItem(obj.itemId, obj.num, true);
            });
            Record.saveAll();
        }
    },
    
    getPurchaseConfig: function (purchaseId) {
        var purchaseInfo = PurchaseList[purchaseId];
        var config = {};
        config.multiPrice = false;
        if (purchaseInfo.effect) {
            config.effect = purchaseInfo.effect;
            config.multiPrice = true;
        }
        return config;
    },
    getPriceOff: function (purchaseId) {
        for (var i = 0; i < player.shopList.length; i++) {
            if (player.shopList[i].discount > 0 && player.shopList[i].itemId == purchaseId) {
                return player.shopList[i].discount;
            }
        }
        return 0;
    }
};