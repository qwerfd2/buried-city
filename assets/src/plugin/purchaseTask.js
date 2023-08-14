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
        return "1";
    },
    onPayResult: function (result, data) {
        if (result == 1) {
            this.onPurchaseResult(1)
            if (this.afterPay) {
                this.afterPay(this.purchaseId, 1);
            }
        } else {
            if (this.afterPay) {
                this.afterPay(this.purchaseId, 0);
            }
        }
    }
});