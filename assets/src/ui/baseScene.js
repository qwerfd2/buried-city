var APP_NAVIGATION = {
    NONE: 1,
    MENU: 2,
    MENU_SUB: 3,
    GAME: 4,
    MENU_THIRD: 5,
};

var BaseLayer = cc.Layer.extend({
    ctor: function (navigationType) {
        this._super();
        this.navigationType = navigationType || APP_NAVIGATION.NONE;
        var self = this;
        var keyboardListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function (keyCode, event) {
                cc.log("pressed Keycode = " + keyCode);
                if (keyCode == cc.KEY.back) {
                    switch (self.navigationType) {
                        case APP_NAVIGATION.MENU:
                            PurchaseAndroid.exitGame({});
                            break;
                        case APP_NAVIGATION.MENU_SUB:
                            cc.director.runScene(new MenuScene());
                            break;
                        case APP_NAVIGATION.MENU_THIRD:
                            cc.director.popScene();
                            break;
                        case APP_NAVIGATION.GAME:
                            var layer = cc.director.getRunningScene().getChildByName("main");
                            if (layer) {
                                var node = layer.getChildByName("bottom");
                                if (node && node instanceof BottomFrameNode && node.uiConfig.leftBtn) {
                                    if (node.leftBtn.isEnabled())
                                        node.onClickLeftBtn();
                                    break;
                                }
                                if (node && node instanceof BossSiteNode) {
                                    node.onClickLeftBtn();
                                    break;
                                }
                            }
                            uiUtil.showBackMenuDialog(function () {
                                game.stop();
                                cc.director.runScene(new MenuScene());
                            });
                            break;
                        case APP_NAVIGATION.NONE:
                            break;
                    }
                }
            }
        });
        cc.eventManager.addListener(keyboardListener, this);
        return true;
    }
});

var BaseScene = cc.Scene.extend({
    ctor: function (navigationType) {
        this._super();
        var layer = new BaseLayer(navigationType);
        layer.setName("keyEventLayer");
        this.addChild(layer);
        return true;
    }
});