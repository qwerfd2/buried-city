var PurchaseTaskManager = {
    _activeTask: null,
    newTask: function (purchaseId) {
        this._activeTask = new PurchaseTaskAndroid(purchaseId);
        return this._activeTask;
    },
    getActiveTask: function () {
        return this._activeTask;
    }
};

var PurchaseTaskState = {
    NONE: 0,
    SDK_PAY_SUCCESS: 1,
    NETWORK_VALIDATE: 2,
    NETWORK_VALIDATE_CALLBACK: 3
};

var PurchaseTask = cc.Class.extend({
    ctor: function (purchaseId, step) {
        this.purchaseId = purchaseId;
        this.step = step || PurchaseTaskState.NONE;
        this.purchaseConfig = IAPPackage.getPurchaseConfig(purchaseId);
        this.reConnectTimes = 0;
    },
    changeStep: function (step) {
        this.step = step;
    },
    onPurchaseResult: function (result) {
            IAPPackage.payConsumeIAP(this.purchaseId);
    }
});

var PurchaseTaskAndroid = PurchaseTask.extend({
    ctor: function (purchaseId, step) {
        this._super(purchaseId, step);
    },
    pay: function () {
        IAPPackage.payConsumeIAP(this.purchaseId);
    },
    createAppOrderId: function () {
        var orderid = "" + new Date().getTime();
        for (var i = 0; i < 5; i++) {
            orderid += utils.getRandomInt(0, 9);
        }
        return orderid;
    },
    onPayResult: function (result, data) {
        cc.v("onPayResult " + result);
        cc.v("onPayResult " + JSON.stringify(data));
        if (result == 1) {
            cc.v("purchaseTask  success");
            this.onPurchaseResult(1)
            this.payLog(result, this.createAppOrderId(), data.productId);
            if (this.afterPay) {
                this.afterPay(this.purchaseId, 1);
            }
        } else {
            cc.v("purchaseTask  failed");
            this.payLog(result, null, null, data.errorCode);
            if (this.afterPay) {
                this.afterPay(this.purchaseId, 0);
            }
        }
    }
});