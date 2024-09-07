var beginGame = function () {
    if (cc.sys.isNative) {
        var scene = new AssetsManagerLoaderScene();
        cc.director.runScene(scene);
        scene.loadGame();
    }
};

cc.loader.loadJs(["src/util/AssetsManager.js"]);