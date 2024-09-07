var CommonUtil = {
    _callbackList: {},
    _dialog: null,

    gotoUrl: function (url) {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/CommonUtil", "gotoUrl", "(Ljava/lang/String;)V", url);
    },

    md5HexDigest: function (str) {
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/CommonUtil", "md5", "(Ljava/lang/String;)Ljava/lang/String;", str);
    },

    getMetaData: function (key) {
        return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/CommonUtil", "getMetaData", "(Ljava/lang/String;)Ljava/lang/String;", key);
    }
};