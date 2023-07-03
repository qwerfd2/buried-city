/**
 * Created by lancelot on 15/3/12.
 */
var CommonUtil = {
    _callbackList: {},
    _dialog: null,

    share: function (msg, url, title) {
        if (PurchaseAndroid.payType == PurchaseAndroid.PAY_TYPE_GOOGLE_PLAY)
            url = "https://play.google.com/store/apps/details?id=com.locojoy.buriedtown";
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "openShare", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", msg, url, title);
    },

    getLocaleCountryCode: function () {
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/CommonUtil", "getLocaleCountryCode", "()Ljava/lang/String;");
    },
    getLocaleLanguage: function () {
            return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/CommonUtil", "getLocaleLanguage", "()Ljava/lang/String;");
    },

    gotoAppstore: function () {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/CommonUtil", "gotoMarketDetail", "()V");
    },
    gotoUrl: function (url) {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/CommonUtil", "gotoUrl", "(Ljava/lang/String;)V", url);
    },
    showDialog: function (msg) {
        return jsb.reflection.callStaticMethod("CommonUtil", "showDialog:", msg);
    },

    dismissDialog: function () {
        return jsb.reflection.callStaticMethod("CommonUtil", "dismissDialog");
    },

    getUUID: function () {
        var uuid = this.macAddress();
        if (!uuid) {
            uuid = this.getIMEI();
        }
        return uuid;
    },

    getIMEI: function () {
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/CommonUtil", "getIMEI", "()Ljava/lang/String;");
    },

    macAddress: function () {
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/CommonUtil", "getMacAddress", "()Ljava/lang/String;");
    },

    md5HexDigest: function (srcStr) {
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/CommonUtil", "md5", "(Ljava/lang/String;)Ljava/lang/String;", srcStr);
    },

    getMetaData: function (key) {
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/CommonUtil", "getMetaData", "(Ljava/lang/String;)Ljava/lang/String;", key);
    },

    getMetaDataInt: function (key) {
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/CommonUtil", "getMetaDataInt", "(Ljava/lang/String;)I", key);
    },

    sendEmail: function (email) {
        CommonUtil.gotoUrl("mailto:" + email);
    },
    adStatus: true
};