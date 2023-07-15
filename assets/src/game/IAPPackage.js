var IAPPackage = {
    _map: {},
    _record: {},

    init: function (player) {
        if (this.isIAPUnlocked(102) && this.getChosenTalentPurchaseId(102)){
            player.hp += 60;
            player.hpMaxOrigin += 60;
            player.hpMax = player.hpMaxOrigin;
        }
    },

    getPreciseEffect: function (precise) {
        if (this.isIAPUnlocked(101) && this.getChosenTalentPurchaseId(101)){
            return precise + (1 - precise) * 0.3;
        }else{
            return precise;
        }
    },

    getDropEffect: function (produceValue) {
        if (this.isIAPUnlocked(103) && this.getChosenTalentPurchaseId(103)){
            return produceValue * (1 + 0.1);
        }else{
            return produceValue;
        }
            
    },

    isSocialEffectUnlocked: function () {
        return this.isIAPUnlocked(104) && this.getChosenTalentPurchaseId(104);
    },
    
    isWeaponEffectUnlocked: function() {
        return this.getChosenTalentPurchaseId(0);
    },

    isHoarderUnlocked: function () {
        return this.isIAPUnlocked(105) && this.getChosenTalentPurchaseId(105);
    },

    isHandyworkerUnlocked: function () {
        return this.isIAPUnlocked(106) && this.getChosenTalentPurchaseId(106);
    },

    isStealthUnlocked: function () {
        return this.isIAPUnlocked(107) && this.getChosenTalentPurchaseId(107);
    },
    
    isAllIAPUnlocked: function () {
        return this.isIAPUnlocked(108) && this.getChosenTalentPurchaseId(108);
    },
    
    isAllItemUnlocked: function () {
        return this.isIAPUnlocked(109) && this.getChosenTalentPurchaseId(109);
    },

    chooseTalent: function (id) {
        var purchaseId = JSON.parse(cc.sys.localStorage.getItem("chosenTalent"));
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
        cc.sys.localStorage.setItem("chosenTalent", JSON.stringify(purchaseId));
    },

    getChosenTalentPurchaseId: function (id) {
        var purchaseId = JSON.parse(cc.sys.localStorage.getItem("chosenTalent"));
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
                player.storage.increaseItem(obj.itemId, obj.num);
            });
            Record.saveAll();
        }
    },
    isIAPUnlocked: function (purchaseId) {
        if (purchaseId == 0) {
            return true;
        } else {
            if (PurchaseList[purchaseId].multiPrice) {
                return false;
            } else {
                return true;
            }
        }
    },
    getPurchaseConfig: function (purchaseId) {
        var purchaseInfo = PurchaseList[purchaseId];
        var priceInfoIndex = 0;
        if (purchaseInfo.multiPrice) {
            priceInfoIndex = 0;
            priceInfoIndex = Math.min(priceInfoIndex, purchaseInfo.priceList.length - 1);
        }
        var config = utils.clone(purchaseInfo.priceList[priceInfoIndex]);
        config.multiPrice = purchaseInfo.multiPrice;
        if (purchaseInfo.effect) {
            config.effect = purchaseInfo.effect;
        }
        config.priceIndex = priceInfoIndex;
        return config;
    },
    getPriceOff: function (purchaseId) {
        var purchaseInfo = PurchaseList[purchaseId];
        if (purchaseInfo.multiPrice) {
            var priceList = purchaseInfo.priceList;
            var priceInfoIndex = 0;
            priceInfoIndex = Math.min(priceInfoIndex, priceList.length - 1);
            var off = Math.floor((priceList[priceList.length - 1].price - priceList[priceInfoIndex].price) / priceList[priceList.length - 1].price * 100);
            return off;
        } else {
            if (purchaseId == 206 || purchaseId == 207) {
                return 50;
            } else {
                return 0;
            }
        }
    }
};