/**
 * User: Alex
 * Date: 15/1/5
 * Time: 下午4:07
 */
var MainLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        this.topFrame = new TopFrameNode();
        this.addChild(this.topFrame, 1);

        this.bottomFrame = Navigation.current();
        this.addChild(this.bottomFrame, 0);
        return true;
    },

    onExit: function () {
        this._super();
    },

    onEnter: function () {
        this._super();
    }
});

var MainScene = BaseScene.extend({
    ctor: function () {
        this._super(APP_NAVIGATION.GAME);

        cc.spriteFrameCache.removeSpriteFramesFromFile("res/menu.plist");

        autoSpriteFrameController.addSpriteFrames("res/dig_item.plist");
        autoSpriteFrameController.addSpriteFrames("res/dig_monster.plist");
        autoSpriteFrameController.addSpriteFrames("res/ui.plist");
        autoSpriteFrameController.addSpriteFrames("res/home.plist");
        autoSpriteFrameController.addSpriteFrames("res/build.plist");
        autoSpriteFrameController.addSpriteFrames("res/dig_build.plist");
        autoSpriteFrameController.addSpriteFrames("res/site.plist");
        autoSpriteFrameController.addSpriteFrames("res/dig_work.plist");
        autoSpriteFrameController.addSpriteFrames("res/gate.plist");
        autoSpriteFrameController.addSpriteFrames("res/map.plist");
        autoSpriteFrameController.addSpriteFrames("res/site.plist");
        autoSpriteFrameController.addSpriteFrames("res/end.plist");
        autoSpriteFrameController.addSpriteFrames("res/day.plist");
        autoSpriteFrameController.addSpriteFrames("res/day2.plist");
        autoSpriteFrameController.addSpriteFrames("res/weather.plist");
        autoSpriteFrameController.addSpriteFrames("res/guide.plist");
        autoSpriteFrameController.addSpriteFrames("res/new_site.plist");

        var layer = new MainLayer();
        layer.setName("main");
        this.addChild(layer);
    },
    onEnter: function () {
        this._super();
    },
    onExit: function () {
        this._super();
        Navigation.stopMusic();
    }
});