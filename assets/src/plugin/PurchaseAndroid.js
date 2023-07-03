/**
 * Created by lancelot on 15/9/21.
 */
var PurchaseAndroid = {

    PAY_TYPE_GOOGLE_PLAY: "googleplay",

    init: function (payType, obj) {
        this.payType = payType;
        jsb.reflection.callStaticMethod("net/dice7/pay/PayHelper", "init", "(Ljava/lang/String;)V", JSON.stringify(obj));
    },

    exitGame: function (obj) {
        jsb.reflection.callStaticMethod("net/dice7/pay/PayHelper", "exitGame", "()V");
    },

    onGameExit: function (result) {
        cc.e(JSON.stringify(result));
        var obj = JSON.parse(result);
        this.showExitDialog(function () {
            cc.director.end();
        });
    },

    moreGame: function (obj) {
        jsb.reflection.callStaticMethod("net/dice7/pay/PayHelper", "moreGame", "()V");
    },

    getPurchaseList: function (purchaseIdList, cb) {
        this.getPurchaseListCb = cb;
        if (!this.payType && this.payType === this.PAY_TYPE_GOOGLE_PLAY) {
            this.onPurchaseInfo(null)
        }
    },
    onPurchaseInfo: function (result) {
        if (result) {
            cc.e(JSON.stringify(result));
            var obj = JSON.parse(result);
            if (obj.statusCode == 1) {
                this.getPurchaseListCb(null, obj);
            } else {
                this.getPurchaseListCb(obj);
            }
        } else {
            this.getPurchaseListCb({errorCode: 1, msg: 'not google play'});
        }
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