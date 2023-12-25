var ChooseLayer = cc.Layer.extend({
    ctor: function (mode) {
        this.mode = mode;
        this._super();
        if (Record.getScreenFix() == 1) {
            this.setScale(0.83);
        }
        var str = 1217;
        if (this.mode) {
            str = 8109;
        }
        var title = new cc.LabelTTF(stringUtil.getString(str), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_1);
        title.x = cc.winSize.width / 2;
        title.y = cc.visibleRect.height - 50;
        this.addChild(title);

        var NODE_WIDTH = 181;
        var NODE_HEIGHT = 196;
        var widthPadding = (cc.winSize.width - 3 * NODE_WIDTH ) / 4;
        var heightPadding = 30;
        var data;
        if (this.mode) {
            data = JSON.parse(cc.sys.localStorage.getItem("chosenTalent") || []);
            data.sort((a, b) => a - b);
        } else {
            data = [0, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110];
        }
        var self = this;
        this.btnList = [];
        data.forEach(function (purchaseId, index) {
            var btn = new ButtonAtChooseScene(purchaseId, self.mode);
            btn.anchorX = 0;
            btn.anchorY = 1;
            btn.x = widthPadding + (index % 3) * (widthPadding + NODE_WIDTH);
            btn.y = title.y - 80 - (10 + Math.floor(index / 3) * (heightPadding + NODE_HEIGHT) );
            self.addChild(btn);
            btn.purchaseId = purchaseId;
            btn.index = index;
            self.btnList.push(btn);
            if (!self.mode) {
                btn.setClickListener(self, function (sender) {
                    var i = sender.index;
                    sender.alternateChecked();
                    IAPPackage.chooseTalent(sender.purchaseId);
                });
            } else {
                btn.setClickListener(self, function (sender) {
                    uiUtil.showChooseInfoDialog(sender.purchaseId);
                });
            }
            btn.setChecked(false);

            var strConfig = stringUtil.getString("p_" + purchaseId);

            var name = new cc.LabelTTF(strConfig.name, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
            name.anchorY = 0;
            name.x = btn.width / 2;
            name.y = btn.height + 5;
            btn.addChild(name);
        });
        if (!this.mode) {
            cc.sys.localStorage.setItem("chosenTalent", "[]");
            this.btnList.forEach(function (btn) {
                btn.setEnabled(true);
            });

            var btn1 = uiUtil.createCommonBtnWhite(stringUtil.getString(1193), this, function () {
                cc.director.runScene(new MenuScene());
            });
            btn1.setPosition(cc.winSize.width / 4, 60);
            this.addChild(btn1);
            btn1.setName("btn_1");

            var btn2 = uiUtil.createCommonBtnWhite(stringUtil.getString(1030), this, function () {
                var purchaseId = JSON.parse(cc.sys.localStorage.getItem("chosenTalent"));
                if (purchaseId.length == 0) {
                    var config = {
                        title: {},
                        content: {},
                        action: {
                            btn_1: {},
                            btn_2: {}
                        }
                    };
                    config.title.title = stringUtil.getString(1351);
                    config.content.des = stringUtil.getString(1350);
                    config.action.btn_1.txt = stringUtil.getString(1193);
                    config.action.btn_2.txt = stringUtil.getString(1143);
                    config.action.btn_2.cb = function() {
                        cc.director.runScene(new StoryScene());
                    };
                    var dialog = new DialogSmall(config);
                    dialog.show();     
                } else if (purchaseId.length == 1) {
                    var config = {
                        title: {},
                        content: {},
                        action: {
                            btn_1: {},
                            btn_2: {}
                        }
                    };
                    config.title.title = stringUtil.getString(1351);
                    config.content.des = stringUtil.getString(1349);
                    config.action.btn_1.txt = stringUtil.getString(1193);
                    config.action.btn_2.txt = stringUtil.getString(1143);
                    config.action.btn_2.cb = function() {
                        var positionIndex = 0;
                        cc.director.runScene(new StoryScene());
                    };
                    var dialog = new DialogSmall(config);
                    dialog.show();
                } else {
                    var positionIndex = 0;
                    cc.director.runScene(new StoryScene());
                }
            });
            btn2.setPosition(cc.winSize.width / 4 * 3, 60);
            this.addChild(btn2);
            btn2.setName("btn_2");
        } else {
            var btn1 = uiUtil.createCommonBtnWhite(stringUtil.getString(1193), this, function () {
                btn1.setEnabled(false);
                game.init();
                game.start();
                cc.director.runScene(new MainScene());
            });
            btn1.setPosition(cc.winSize.width / 2, 60);
            this.addChild(btn1);
            btn1.setName("btn_1");
        }
        return true;
    },

    onExit: function () {
        this._super();
    },

    onEnter: function () {
        this._super();
        audioManager.playMusic(audioManager.music.ABYSS, false);
    }
});

var ChooseScene = BaseScene.extend({
    ctor: function (mode) {
        this._super(APP_NAVIGATION.GAME);

        var layer = new ChooseLayer(mode);
        this.addChild(layer);
    },
    onEnter: function () {
        this._super();
    },
    onExit: function () {
        this._super();
    }
});