var lanSupports = [];
var stringName = {
    "zh": "简体中文",
    "en": "English",
    "zh-Hant": "繁體中文"
}
var AssetsManagerLoaderScene = cc.Scene.extend({
    run: function () {
        var self = this;
        oldSearchPath = [];
        jsb.fileUtils.setSearchPaths(oldSearchPath);
        jsb.fileUtils.setSearchPaths([""]);
        this.loadGame();
    },
    
    loadGame: function () {
        var self = this;
        cc.director.getScheduler().scheduleCallbackForTarget(this, function () {
            lanSupports.push(cc.sys.LANGUAGE_ENGLISH);
            lanSupports.push(cc.sys.LANGUAGE_CHINESE);
         
            cc.loader.loadJs(["src/jsList.js"], function (err) {
                var storagePaths = jsb.fileUtils.getSearchPaths();
                for (var key1 in jsList) {
                    for (var key in storagePaths) {
                        var jsFilename = jsList[key1];
                        if (jsFilename.indexOf("string.js") !== -1) {
                            var lan = cc.sys.localStorage.getItem("language");
                            if (!lan)
                                lan = cc.sys.language;
                            if (lanSupports.indexOf(lan) !== -1) {
                                if (lan === cc.sys.LANGUAGE_CHINESE) {
                                    var fullLan = self.getLocaleLanguage();
                                    var lanFlag = fullLan.split('-')[1];
                                    if (lanFlag === 'Hant' || lanFlag === 'TW' || lanFlag === 'HK') {
                                        lan = "zh-Hant";
                                        jsFilename = jsFilename.substring(0, jsFilename.lastIndexOf('.')) + "_zh-Hant" + ".js";
                                        cc.sys.LANGUAGE_CHINESE_HANT = true;
                                    } else {
                                        jsFilename = jsFilename.substring(0, jsFilename.lastIndexOf('.')) + "_" + lan + ".js";
                                    }
                                } else {
                                    jsFilename = jsFilename.substring(0, jsFilename.lastIndexOf('.')) + "_" + lan + ".js";
                                }
                                cc.sys.localStorage.setItem("language", lan);
                            } else if (lan == "zh-Hant") {
                                jsFilename = jsFilename.substring(0, jsFilename.lastIndexOf('.')) + "_zh-Hant" + ".js";
                                cc.sys.LANGUAGE_CHINESE_HANT = true;
                            } else {
                                jsFilename = jsFilename.substring(0, jsFilename.lastIndexOf('.')) + "_en.js";
                                cc.sys.localStorage.setItem("language", "en");
                            }
                        }
                        var filename = jsFilename.substring(0, jsFilename.lastIndexOf('.'));
                        if (jsb.fileUtils.isFileExist(storagePaths[key] + jsFilename)) {
                            require(storagePaths[key] + jsFilename);
                            break;
                        }
                    }
                }
                cc.director.runScene(new MenuScene(false, true));
            });
            var searchPaths = jsb.fileUtils.getSearchPaths();
            searchPaths.pop();
            cc.sys.localStorage.setItem("assetPath", JSON.stringify(searchPaths));
        }, 1, 0);
    },

    getLocaleLanguage: function () {
        if (cc.sys.isNative) {
            return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/CommonUtil", "getLocaleLanguage", "()Ljava/lang/String;");
        } else {
            return 'zh';
        }
    },

    onExit: function () {
        this._super();
    }
});