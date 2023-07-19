cc.game.onStart = function () {
    if (!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));
    cc.view.enableRetina(true);
    cc.view.adjustViewPort(true);
    if (Number(cc.sys.localStorage.getItem("screenfix")) == 2) {
        cc.view.setDesignResolutionSize(640, 1136, 2);
    } else {
        cc.view.setDesignResolutionSize(640, 1136, cc.ResolutionPolicy.FIXED_HEIGHT);
    }
    cc.view.resizeWithBrowserSize(true);
    beginGame();
};
cc.game.run();