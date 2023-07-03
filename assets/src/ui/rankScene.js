/**
 * User: Alex
 * Date: 15/1/5
 * Time: 下午4:07
 */
var RankLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        this.lineWidth = 540;
        this.lineHeight = 60;
        this.initView();
        return true;
    },

    onExit: function () {
        this._super();
    },

    onEnter: function () {
        this._super();
    },

    initView: function () {
        var bg = autoSpriteFrameController.getSpriteFromSpriteName("#rank_bg.png");
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        this.addChild(bg);
        var btn = uiUtil.createCommonBtnBlack(stringUtil.getString(1193), this, function () {
            cc.director.runScene(new MenuScene());
        });
        btn.setPosition(bg.width / 4, bg.height / 2 - 500);
        bg.addChild(btn);
        btn.setName("btn");
    }
});

var RankScene = BaseScene.extend({
    ctor: function () {
        this._super(APP_NAVIGATION.MENU_SUB);
        autoSpriteFrameController.addSpriteFrames("res/rank.plist");
    },
    onEnter: function () {
        this._super();
        var layer = new RankLayer();
        this.addChild(layer);
    },
    onExit: function () {
        this._super();
    }
});