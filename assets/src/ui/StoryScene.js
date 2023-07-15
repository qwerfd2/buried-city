var StoryLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        return true;
    },

    onExit: function () {
        this._super();
    },

    onEnter: function () {
        this._super();
        var bg = new Button(cc.winSize);
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        this.addChild(bg);
        bg.setClickListener(this, function () {
            game.init();
            game.start();
            cc.director.runScene(new MainScene());
            bg.setEnabled(false);
        });
        bg.setEnabled(false);

        var img = autoSpriteFrameController.getSpriteFromSpriteName("dig_start.png");
        img.x = cc.winSize.width / 2;
        img.y = cc.winSize.height - 322;
        img.setAnchorPoint(0.5, 0.5);
        bg.addChild(img);

        var txtNode = new cc.Node();
        var lan = cc.sys.localStorage.getItem("language");
        if (lan === 'zh' || lan === 'zh-Hant') {
            txtNode.setContentSize(300, 350);
        } else {
            txtNode.setContentSize(450, 350);
        }
        txtNode.setAnchorPoint(0.5, 1);
        txtNode.x = cc.winSize.width / 2;
        txtNode.y = cc.winSize.height - 550;
        this.addChild(txtNode);

        var txt1 = new cc.LabelTTF(stringUtil.getString(1195), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(txtNode.width, 0));
        txt1.setAnchorPoint(0, 1);
        txt1.setPosition(0, txtNode.height);
        txt1.setColor(cc.color.WHITE);
        txtNode.addChild(txt1);
        var txt2 = new cc.LabelTTF(stringUtil.getString(1196), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(txtNode.width, 0));
        txt2.setAnchorPoint(0, 1);
        txt2.setPosition(0, txt1.y - txt1.height - 5);
        txt2.setColor(cc.color.WHITE);
        txtNode.addChild(txt2);

        var txt3 = new cc.LabelTTF(stringUtil.getString(1197), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(txtNode.width, 0));
        txt3.setAnchorPoint(0, 1);
        txt3.setPosition(0, txt2.y - txt2.height - 20);
        txt3.setColor(cc.color.WHITE);
        txtNode.addChild(txt3);
        var txt4 = new cc.LabelTTF(stringUtil.getString(1198), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(txtNode.width, 0));
        txt4.setAnchorPoint(0, 1);
        txt4.setPosition(0, txt3.y - txt3.height - 5);
        txt4.setColor(cc.color.WHITE);
        txtNode.addChild(txt4);

        var txt5 = new cc.LabelTTF(stringUtil.getString(1199), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(txtNode.width, 0));
        txt5.setAnchorPoint(0, 1);
        txt5.setPosition(0, txt4.y - txt4.height - 20);
        txt5.setColor(cc.color.WHITE);
        txtNode.addChild(txt5);
        var txt6 = new cc.LabelTTF(stringUtil.getString(1200), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(txtNode.width, 0));
        txt6.setAnchorPoint(0, 1);
        txt6.setPosition(0, txt5.y - txt5.height - 5);
        txt6.setColor(cc.color.WHITE);
        txtNode.addChild(txt6);

        var txt7 = new cc.LabelTTF(stringUtil.getString(1201), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        txt7.setAnchorPoint(1, 1);
        txt7.setPosition(txtNode.width, txt6.y - txt6.height - 5);
        txt7.setColor(cc.color.WHITE);
        txtNode.addChild(txt7);

        txt1.setOpacity(0);
        txt1.runAction(cc.sequence(cc.fadeIn(1), cc.callFunc(function () {
            bg.setEnabled(true);
        })));
        txt2.setOpacity(0);
        txt2.runAction(cc.fadeIn(1));
        txt3.setOpacity(0);
        txt3.runAction(cc.fadeIn(1));
        txt4.setOpacity(0);
        txt4.runAction(cc.fadeIn(1));
        txt5.setOpacity(0);
        txt5.runAction(cc.fadeIn(1));
        txt6.setOpacity(0);
        txt6.runAction(cc.fadeIn(1));
        txt7.setOpacity(0);
        txt7.runAction(cc.fadeIn(1));
        return true;
    }
});

var StoryScene = BaseScene.extend({
    ctor: function () {
        this._super(APP_NAVIGATION.GAME);
    },
    onEnter: function () {
        this._super();
        var layer = new StoryLayer();
        this.addChild(layer);
    },
    onExit: function () {
        this._super();
    }
});