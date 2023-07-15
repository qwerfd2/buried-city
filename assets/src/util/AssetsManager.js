var UPDATE_PATH = "update/";
var lanSupports = [];
var stringName = {
    "fr": "français",
    "zh": "简体中文",
    "ar": "عربي",
    "es": "El español",
    "ja": "日本語",
    "ko": "한국어",
    "pt": "Português",
    "ru": "русский",
    "tr": "Türk",
    "vi": "Vietnam",
    "de": "Deutsch",
    "en": "English",
    "zh-Hant": "繁體中文"
}
var AssetsManagerLoaderScene = cc.Scene.extend({
    run: function () {
        var self = this;

        var oldSearchPath = cc.sys.localStorage.getItem("assetPath");
        if (!oldSearchPath) {
            oldSearchPath = [];
        } else {
            oldSearchPath = JSON.parse(oldSearchPath);
        }
        jsb.fileUtils.setSearchPaths(oldSearchPath);

        var manifestPath = "res/project.manifest";
        var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() + UPDATE_PATH : UPDATE_PATH);

        var currentVersion = "0.0.1";
        if (jsb.fileUtils.isFileExist(storagePath + "version.manifest")) {
            var versionManifest = JSON.parse(jsb.fileUtils.getStringFromFile(storagePath + "version.manifest"));
            if (versionManifest) {
                var groupVersions = versionManifest["groupVersions"];
                if (groupVersions) {
                    var versionIndexArray = Object.keys(groupVersions);
                    var tmpVersion = groupVersions[versionIndexArray[versionIndexArray.length - 1]];
                    if (tmpVersion) {
                        currentVersion = tmpVersion;
                    }
                }
            }
        }
        var layer = new cc.Layer();
        this.addChild(layer);

        var newVersionLabel = new cc.LabelTTF("最新版本:" + currentVersion, "", 20);
        newVersionLabel.setPosition(cc.winSize.width - 9, 40);
        newVersionLabel.setAnchorPoint(1, 0);
        layer.addChild(newVersionLabel, 0);

        var currentVersionLabel = new cc.LabelTTF("当前版本:" + currentVersion, "", 20)
        currentVersionLabel.setPosition(cc.winSize.width - 9, 10);
        currentVersionLabel.setAnchorPoint(1, 0);
        layer.addChild(currentVersionLabel, 0);

        var percentageLabel = new cc.LabelTTF("", "", 20)
        percentageLabel.setPosition(9, 10);
        percentageLabel.setAnchorPoint(0, 0);
        layer.addChild(percentageLabel, 0);

        jsb.fileUtils.setSearchPaths([""]);
        this.am = new jsb.AssetsManager(manifestPath, storagePath);
        this.am.retain();
        this.failTimes = 0;

        if (!this.am.getLocalManifest().isLoaded()) {
            this.loadGame();
        } else {
            var listener = new jsb.EventListenerAssetsManager(this.am, function (event) {
                switch (event.getEventCode()) {
                    case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                        self.loadGame();
                        break;
                    case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                        percentageLabel.setString(event.getPercent() + "%");
                        break;
                    case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                    case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                        self.loadGame();
                        break;
                    case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                        var newVersion = "";
                        var versionManifest = JSON.parse(jsb.fileUtils.getStringFromFile(storagePath + "version.manifest"));

                        if (versionManifest) {
                            var groupVersions = versionManifest["groupVersions"];
                            var versionIndexArray = Object.keys(groupVersions);
                            var tmpVersion = groupVersions[versionIndexArray[versionIndexArray.length - 1]];
                            if (tmpVersion) {
                                newVersion = tmpVersion;
                            }
                        }
                        newVersionLabel.setString("最新版本:" + newVersion);
                        break;
                    case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                    case jsb.EventAssetsManager.UPDATE_FINISHED:
                        self.loadGame();
                        break;
                    case jsb.EventAssetsManager.UPDATE_FAILED:
                        self.failTimes++;
                        if (self.failTimes < 1) {
                            self.am.downloadFailedAssets();
                        } else {
                            self.failTimes = 0;
                            self.loadGame();
                        }
                        break;
                    case jsb.EventAssetsManager.ERROR_UPDATING:
                        break;
                    case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                        break;
                    default:
                        break;
                }
            });
            cc.eventManager.addListener(listener, 1);
            this.am.update();
        }
    },
    loadGame: function () {
        var self = this;
        cc.director.getScheduler().scheduleCallbackForTarget(this, function () {
            lanSupports.push(cc.sys.LANGUAGE_CHINESE);
            lanSupports.push(cc.sys.LANGUAGE_ENGLISH);
            lanSupports.push(cc.sys.LANGUAGE_ARABIC);
            lanSupports.push(cc.sys.LANGUAGE_SPANISH);
            lanSupports.push(cc.sys.LANGUAGE_FRENCH);
            lanSupports.push(cc.sys.LANGUAGE_JAPANESE);
            lanSupports.push(cc.sys.LANGUAGE_KOREAN);
            lanSupports.push(cc.sys.LANGUAGE_PORTUGUESE);
            lanSupports.push(cc.sys.LANGUAGE_RUSSIAN);
            lanSupports.push(cc.sys.LANGUAGE_TURKISH);
            lanSupports.push(cc.sys.LANGUAGE_VIETNAMESE);
            lanSupports.push(cc.sys.LANGUAGE_GERMAN);

            cc.loader.loadJs(["src/jsList.js"], function (err) {
                var storagePaths = jsb.fileUtils.getSearchPaths();
                for (var key1 in jsList) {
                    for (var key in storagePaths) {
                        var jsFilename = jsList[key1];
                        if (jsFilename.indexOf("string.js") !== -1) {
                            var lan = cc.sys.localStorage.getItem("language");
                            if (!lan)
                                lan = cc.sys.language;
                            cc.RTL = false;
                            if (lanSupports.indexOf(lan) !== -1) {
                                if (lan === cc.sys.LANGUAGE_ARABIC)
                                    cc.RTL = true;
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
                        var jscFilename = filename + ".jsc";
                        if (jsb.fileUtils.isFileExist(storagePaths[key] + jscFilename) || (cc.debug && jsb.fileUtils.isFileExist(storagePaths[key] + jsFilename))) {
                            require(storagePaths[key] + jsFilename);
                            break;
                        }
                    }
                }
                cc.director.runScene(new MenuScene());
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
        if (this.am) {
            this.am.release();
        }
        this._super();
    }
});