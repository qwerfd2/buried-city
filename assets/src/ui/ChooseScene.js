
var ChooseLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        if (Record.getScreenFix() == 1) {
            this.setScale(0.83);
        }
        var title = new cc.LabelTTF(stringUtil.getString(1217), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_1);
        title.x = cc.winSize.width / 2;
        title.y = cc.visibleRect.height - 50;
        this.addChild(title);

        var NODE_WIDTH = 181;
        var NODE_HEIGHT = 196;
        var widthPadding = (cc.winSize.width - 3 * NODE_WIDTH ) / 4;
        var heightPadding = 30;
        var data = [0, 101, 102, 103, 104, 105, 106, 107, 110, 108, 109];
        var self = this;
        this.btnList = [];
        var purchase;
        data.forEach(function (purchaseId, index) {
            if (purchaseId == 110) {
                purchase ="icon_iap_105.png";
            } else if (purchaseId == 105) {
                purchase ="icon_iap_201.png";
            } else if (purchaseId < 108) {
                purchase ="icon_iap_" + purchaseId + ".png";
            } else {
                purchase = "icon_iap_bg.png";
            }
            var btn = new ButtonAtChooseScene(purchase);
            btn.anchorX = 0;
            btn.anchorY = 1;
            btn.x = widthPadding + (index % 3) * (widthPadding + NODE_WIDTH);
            btn.y = title.y - 80 - (10 + Math.floor(index / 3) * (heightPadding + NODE_HEIGHT) );
            self.addChild(btn);
            btn.purchaseId = purchaseId;
            btn.index = index;
            self.btnList.push(btn);
            cc.sys.localStorage.setItem("chosenTalent", "[]");
            btn.setClickListener(self, function (sender) {
                var i = sender.index;
                sender.alternateChecked();
                IAPPackage.chooseTalent(sender.purchaseId);
            });

            btn.setChecked(false);

            var strConfig = stringUtil.getString("p_" + purchaseId);

            var name = new cc.LabelTTF(strConfig.name, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
            name.anchorY = 0;
            name.x = btn.width / 2;
            name.y = btn.height + 5;
            btn.addChild(name);
        });

        this.btnList.forEach(function (btn) {
            btn.setEnabled(IAPPackage.isIAPUnlocked(btn.purchaseId));
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
                    var positionIndex = 0;
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
        return true;
    },

    onExit: function () {
        this._super();
    },

    onEnter: function () {
        this._super();
    }
});

var ChooseScene = BaseScene.extend({
    ctor: function () {
        this._super(APP_NAVIGATION.GAME);

        var layer = new ChooseLayer();
        this.addChild(layer);
    },
    onEnter: function () {
        this._super();
        //this.removeAllChildren();
    },
    onExit: function () {
        this._super();
    }
});