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

var PurchaseTask = cc.Class.extend({
    ctor: function (purchaseId, step) {
        this.purchaseId = purchaseId;
        this.step = step || 0;
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

var PurchaseAndroid = {
    init: function (payType, obj) {
        jsb.reflection.callStaticMethod("net/dice7/pay/PayHelper", "init", "(Ljava/lang/String;)V", JSON.stringify(obj));
    },

    exitGame: function (obj) {
        jsb.reflection.callStaticMethod("net/dice7/pay/PayHelper", "exitGame", "()V");
    },

    onGameExit: function (result) {
        var obj = JSON.parse(result);
        this.showExitDialog(function () {
            cc.director.end();
        });
    },

    showExitDialog: function (cb) {
        var config = {
            title: {},
            content: {},
            action: {btn_1: {}, btn_2: {}}
        };
        config.content.des = stringUtil.getString(1259);
        config.action.btn_2.txt = stringUtil.getString(1030);
        config.action.btn_2.target = null;
        config.action.btn_2.cb = cb;

        config.action.btn_1.txt = stringUtil.getString(1031);
        config.action.btn_1.cb = null;

        var dialog = new DialogTiny(config);
        dialog.show();
    }
};