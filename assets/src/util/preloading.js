/**
 * Created by lancelot on 15/6/24.
 */
var loadJSForH5 = function () {
    cc.loader.loadJs(["src/jsList.js"], function (err) {
        var fileList = [];
        for (var key in jsList) {
            var jsFilename = jsList[key];
            if (jsFilename.indexOf("string.js") !== -1) {
                var lan = cc.sys.language;
                if (lan === cc.sys.LANGUAGE_CHINESE) {
                    jsFilename = jsFilename.substring(0, jsFilename.lastIndexOf('.')) + "_" + lan + ".js";
                } else {
                    //todo 暂时屏蔽英文
                    jsFilename = jsFilename.substring(0, jsFilename.lastIndexOf('.')) + "_zh.js";
                    //jsFilename = jsFilename.substring(0, jsFilename.lastIndexOf('.')) + "_en.js";
                }
            }
            fileList.push(jsFilename);
        }
        cc.loader.loadJs(fileList);

        var removeChildByName = function (name) {
            var child = this.getChildByName(name);
            if (child) {
                this.removeChild(child);
            }
        };
        cc.Node.prototype.removeChildByName = removeChildByName;

    });
};

var loadJSForNative = function () {
    cc.loader.loadJs(["src/util/AssetsManager.js"]);
};

var beginGame = function () {
    if (cc.sys.isNative) {
        var scene = new AssetsManagerLoaderScene();
        cc.director.runScene(scene);
        scene.loadGame();
    } else {
        var resources = [];
        resources.push("res/build.plist");
        resources.push("res/dig_build.plist");
        resources.push("res/dig_item.plist");
        resources.push("res/dig_monster.plist");
        resources.push("res/dig_work.plist");
        resources.push("res/end.plist");
        resources.push("res/gate.plist");
        resources.push("res/home.plist");
        resources.push("res/icon.plist");
        resources.push("res/map.plist");
        resources.push("res/menu.plist");
        resources.push("res/rank.plist");
        resources.push("res/site.plist");
        resources.push("res/ui.plist");
        resources.push("res/guide.plist");
        resources.push("res/medal.plist");
        cc.LoaderScene.preload(resources, function () {
            cc.director.runScene(new MenuScene());
        }, this);
    }
};

if (cc.sys.isNative) {
    loadJSForNative();
} else {
    loadJSForH5();
}