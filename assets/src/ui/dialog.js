var dialogManager = {
    dialogStack: [],
    showDialog: function (dialog) {
        this.dialogStack.push(dialog);
    },
    dismissDialog: function (dialog) {
        for (var i = 0; i < this.dialogStack.length; i++) {
            if (dialog === this.dialogStack[i]) {
                break;
            }
        }
        this.dialogStack.splice(i, 1);
    },
    isDialogShowing: function () {
        return this.dialogStack.length > 0;
    }
};

var bazaarSellDialog = function(boolean, str, cd) {
    var config = {
        title: {},
        content: {},
        action: {
            btn_1: {},
            btn_2: {}
        }
    };

    config.action.btn_1.txt = stringUtil.getString(1031);
    if (boolean) {
        str += stringUtil.getString(9030);
        config.action.btn_2.txt = stringUtil.getString(9033);
    } else {
        str += stringUtil.getString(9031);
        config.action.btn_2.txt = stringUtil.getString(9034);
    }
    config.content.des = String(str).toString();
    config.action.btn_2.cb = cd
    aa = new DialogTiny(config).show();
};

var virusExchangeDialog = function(tid, cd) {
    var config = {
        title: {},
        content: {},
        action: {
            btn_1: {},
            btn_2: {}
        }
    };
    var amount = 5;
    if (tid == 5){
        amount = 10;
    }
    var name = stringUtil.getString(tid).title;
    config.action.btn_1.txt = stringUtil.getString(1031);
    var str = stringUtil.getString(1333, name, amount);
    config.action.btn_2.txt = stringUtil.getString(1334);
    config.content.des = String(str).toString();
    config.action.btn_2.cb = cd
    aa = new DialogTiny(config);
    aa.y = -196;
    aa.show();
};

var bazaarNotEnoughDialog = function(str) {
    var config = {
        title: {},
        content: {},
        action: {
            btn_1: {},
            btn_2: {}
        }
    };

    config.content.des = String(str).toString();
    config.action.btn_2.txt = stringUtil.getString(1073);
    new DialogTiny(config).show();
};

var round = function(a) {
    return Math.round(a * 100).toFixed(2) / 100;
};

var Dialog = cc.Layer.extend({
    ctor: function () {
        this._super();

        this.setName("dialog");

        this.bgNode = new cc.Node();
        this.initContentSize();
        var winSize = cc.winSize;
        var contentSize = this.bgNode.getContentSize();
        this.bgNode.setPosition((winSize.width - contentSize.width) / 2, 29 + (839 - contentSize.height) / 2);
        this.addChild(this.bgNode, 1);

        var bgColor = new cc.LayerColor();
        bgColor.setColor(cc.color(0, 0, 0, 155));
        bgColor.setOpacity(200);
        this.addChild(bgColor, 0);
        bgColor.setName("bgColor");

        var self = this;
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchEnded: function (touch, event) {
                self.onClickLayer(touch.getLocation());
            }
        }), this);
        this.autoDismiss = true;

        var self = this;
        var keyboardListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function (keyCode, event) {
                if (keyCode == cc.KEY.back) {
                    if (self.autoDismiss) {
                        self.scheduleOnce(function () {
                            self.dismiss();
                        }, 0.1)
                    }
                }
            }
        });
        cc.eventManager.addListener(keyboardListener, this);
    },
    onClickLayer: function (pos) {
        if (!this.autoDismiss)
            return;
        var bgNodePos = this.bgNode.getPosition();
        var bgNodeSize = this.bgNode.getContentSize();
        var bgNodeRect = cc.rect(bgNodePos.x, bgNodePos.y, bgNodeSize.width, bgNodeSize.height);
        if (!cc.rectContainsPoint(bgNodeRect, pos)) {
            this.dismiss();
        }
    },
    initContentSize: function () {
        return cc.size(100, 100);
    },
    getDialogContentSize: function () {
        return this.bgNode.getContentSize();
    },
    show: function () {
        this.getChildByName('bgColor').setVisible(!dialogManager.isDialogShowing());
        cc.director.getRunningScene().addChild(this, 100);
        audioManager.playEffect(audioManager.sound.POPUP);
        var keyEventLayer = cc.director.getRunningScene().getChildByName("keyEventLayer");
        if (keyEventLayer) {
            cc.eventManager.pauseTarget(keyEventLayer);
        }
        dialogManager.showDialog(this);
    },
    dismiss: function () {
        dialogManager.dismissDialog(this);
        this.removeFromParent();
        var keyEventLayer = cc.director.getRunningScene().getChildByName("keyEventLayer");
        if (keyEventLayer) {
            cc.eventManager.resumeTarget(keyEventLayer);
        }

        if (this.onDismissListener) {
            this.onDismissListener.cb.call(this.onDismissListener.target);
        }
    },
    setOnDismissListener: function (listener) {
        this.onDismissListener = listener;
    }
});



var DialogCommon = Dialog.extend({
    ctor: function (config) {
        this._super();

        config.title = config.title || {};
        config.action = config.action || {};
        config.content = config.content || {};
        this.config = config;

        var leftEdge = 20;
        var rightEdge = this.bgNode.getContentSize().width - leftEdge;

        this.leftEdge = leftEdge;
        this.rightEdge = rightEdge;

        if (config.title.icon) {
            var icon;
            if (config.title.icon.match("/")) {
                icon = new cc.Sprite(config.title.icon);
            } else {
                icon = autoSpriteFrameController.getSpriteFromSpriteName(config.title.icon);
            }
            icon.setAnchorPoint(0, 0.5)
            icon.setPosition(leftEdge, this.titleNode.getContentSize().height / 2 - 4);
            this.titleNode.addChild(icon);
            icon.setName("icon");
        }

        var title = new cc.LabelTTF(config.title.title, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_1, cc.size(360, 0));
        title.anchorX = 0;
        title.anchorY = 0.5;
        title.y = this.titleNode.height / 2;
        this.titleNode.addChild(title);
        title.setName("title");
        title.setColor(cc.color.BLACK);
        title.updateView = function () {
            if (icon && icon.isVisible()) {
                title.x = leftEdge + icon.width * icon.scale;
            } else {
                title.x = leftEdge;
            }
        };
        title.updateView();

        if (config.title.txt_1) {
            var txt1 = new cc.LabelTTF(config.title.txt_1, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
            txt1.setAnchorPoint(0, 1);
            txt1.setPosition(title.x, title.y - title.height / 2 + 2);
            this.titleNode.addChild(txt1);
            txt1.setName("txt_1");
            txt1.setColor(cc.color.BLACK);
        }
        if (config.title.txt_2) {
            var txt2 = new cc.LabelTTF(config.title.txt_2, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
            txt2.setAnchorPoint(1, 0.5);
            this.titleNode.addChild(txt2);
            txt2.setName("txt_2");
            txt2.setColor(cc.color.BLACK);

            txt1.setAnchorPoint(0, 1);
            txt1.setPosition(title.x, title.y - title.height / 2 + 2);
            txt2.setAnchorPoint(0, 1);
            txt2.setPosition(txt1.x + txt1.width + 35, title.y - title.height / 2 + 2);
        }

        if (config.action.btn_1) {
            var btn1 = uiUtil.createCommonBtnBlack(config.action.btn_1.txt, this, this.onClickBtn1);
            btn1.setPosition(this.actionNode.getContentSize().width / 2, this.actionNode.getContentSize().height / 2);
            this.actionNode.addChild(btn1);
            btn1.setName("btn_1")
        }

        if (config.action.btn_2) {
            var btn2 = uiUtil.createCommonBtnBlack(config.action.btn_2.txt, this, this.onClickBtn2);
            this.actionNode.addChild(btn2);
            btn2.setName("btn_2")

            btn1.setPosition(this.actionNode.getContentSize().width / 4, this.actionNode.getContentSize().height / 2);
            btn2.setPosition(this.actionNode.getContentSize().width / 4 * 3, this.actionNode.getContentSize().height / 2);
        }

        if (config.action.btn_3) {
            var btn3 = uiUtil.createCommonBtnBlack(config.action.btn_3.txt, this, this.onClickBtn3);
            this.actionNode.addChild(btn3);
            btn3.setName("btn_3")

            btn1.setPosition(this.actionNode.getContentSize().width / 6, this.actionNode.getContentSize().height / 2);
            btn2.setPosition(this.actionNode.getContentSize().width / 6 * 3, this.actionNode.getContentSize().height / 2);
            btn3.setPosition(this.actionNode.getContentSize().width / 6 * 5, this.actionNode.getContentSize().height / 2);
        }
        this._initData();
    },
    _initData: function () {
    },

    onClickBtn1: function () {
        this.dismiss();
        if (this.config.action.btn_1.cb) {
            this.config.action.btn_1.cb.call(this.config.action.btn_1.target);
        }
    },
    onClickBtn2: function () {
        this.dismiss();
        if (this.config.action.btn_2.cb) {
            this.config.action.btn_2.cb.call(this.config.action.btn_2.target);
        }
    },
    onClickBtn3: function () {
        this.dismiss();
        if (this.config.action.btn_3.cb) {
            this.config.action.btn_3.cb.call(this.config.action.btn_3.target);
        }
    }
});

var DialogGuide = DialogCommon.extend({
    ctor: function (config, target, isPicDown) {
        this._super(config);

        this.target = target;
        this.leftEdge = 30;
        this.rightEdge = this.bgNode.getContentSize().width - this.leftEdge;
        if (config.content.dig_des) {
            var digDes = new cc.Sprite(config.content.dig_des);
            digDes.setAnchorPoint(0.5, 1);
            digDes.setPosition(this.contentNode.getContentSize().width / 2, this.contentNode.getContentSize().height - 20);
            this.contentNode.addChild(digDes);
            digDes.setName("dig_des");
        }

        if (config.content.des) {
            var des = new cc.LabelTTF(config.content.des, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(this.rightEdge - this.leftEdge, 0));
            des.setAnchorPoint(0, 1);
            des.setPosition(this.leftEdge, digDes ? this.contentNode.getContentSize().height - digDes.height - 20 * digDes.scale : this.contentNode.getContentSize().height - 20);
            this.contentNode.addChild(des, 1);
            des.setName("des");
            des.setColor(cc.color.BLACK);
        }

        if (isPicDown) {
            des.setAnchorPoint(0.5, 1);
            des.setPosition(this.contentNode.getContentSize().width / 2, this.contentNode.getContentSize().height - 20);

            digDes.setAnchorPoint(0, 1);
            digDes.setPosition(this.leftEdge, des ? this.contentNode.getContentSize().height - des.height * des.scale - 50 : this.contentNode.getContentSize().height - 20);
        }

        if (config.content.log) {
            var log = new cc.Node();
            log.setAnchorPoint(0, 0);
            log.setPosition(0, 0);
            log.setContentSize(this.contentNode.getContentSize().width, 100);
            log.setName("log");
            this.contentNode.addChild(log);
        }
    },
    onClickLayer: function () {
        this.dismiss();
    },
    initContentSize: function () {
        var bg = new cc.Sprite("res/new/guide_bg.png");
        bg.setAnchorPoint(0, 0);
        bg.setPosition(0, 0);
        this.bgNode.addChild(bg, 0);
        bg.setName("bg");
        this.bgNode.setContentSize(bg.getContentSize());

        this.titleNode = new cc.Node();
        this.titleNode.setAnchorPoint(0.5, 0);
        this.titleNode.setPosition(this.bgNode.getContentSize().width / 2, this.bgNode.getContentSize().height - 110);
        this.titleNode.setContentSize(this.bgNode.getContentSize().width, 100);
        this.bgNode.addChild(this.titleNode);

        this.actionNode = new cc.Node();
        this.actionNode.setAnchorPoint(0.5, 1);
        this.actionNode.setPosition(0, 0);
        this.actionNode.setContentSize(0, 0);
        this.bgNode.addChild(this.actionNode);

        this.contentNode = new cc.Node();
        this.contentNode.setAnchorPoint(0.5, 0);
        this.contentNode.setPosition(this.bgNode.getContentSize().width / 2, 93);
        this.contentNode.setContentSize(this.bgNode.getContentSize().width, this.bgNode.getContentSize().height - this.titleNode.getContentSize().height - this.actionNode.getContentSize().height - 20);
        this.bgNode.addChild(this.contentNode);
    },
    onExit: function () {
        this._super();
        if (userGuide.isStep(userGuide.stepName.GAME_START)) {
            userGuide.step();
            this.target.updateBtn(14);
        } else if (userGuide.isStep(userGuide.stepName.BACK_HOME_WARN)) {
            userGuide.step();
            this.target.updateBtn(13);
        } else if (userGuide.isStep(userGuide.stepName.WAKE_UP_WARN)) {
            userGuide.step();
            this.target.updateBtn(1);
        }
    }
})

var DialogSteal = DialogCommon.extend({
    ctor: function (config, target, itemList) {
        this.itemList = itemList;
        this._super(config);

        this.target = target;
        this.leftEdge = 30;
        this.rightEdge = this.bgNode.getContentSize().width - this.leftEdge;

        if (config.content.dig_des) {
            var digDes = new cc.Sprite(config.content.dig_des);
            digDes.setAnchorPoint(0.5, 1);
            digDes.setPosition(this.contentNode.getContentSize().width / 2, this.contentNode.getContentSize().height + 80);
            this.contentNode.addChild(digDes);
            digDes.setName("dig_des");
        }

        if (config.content.des) {
            var des = new cc.LabelTTF(config.content.des, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(this.rightEdge - this.leftEdge, 0));
            des.setAnchorPoint(0, 1);
            des.setPosition(this.leftEdge - 40, this.contentNode.getContentSize().height - 170);
            this.contentNode.addChild(des, 1);
            des.setName("des");
            des.setScale(1.2);
            des.setColor(cc.color.BLACK);
        }

        if (config.content.log) {
            var log = new cc.Node();
            log.setAnchorPoint(0, 0);
            log.setPosition(0, 0);
            log.setContentSize(this.contentNode.getContentSize().width, 100);
            log.setName("log");
            this.contentNode.addChild(log);
        }
    },
    onClickLayer: function () {
        this.dismiss();
    },
    initContentSize: function () {
        var bg = new cc.Sprite("res/new/guide_bg.png");
        bg.setAnchorPoint(0, 0);
        bg.setPosition(0, 0);
        this.bgNode.addChild(bg, 0);
        bg.setName("bg");
        this.bgNode.setContentSize(bg.getContentSize());

        this.titleNode = new cc.Node();
        this.titleNode.setAnchorPoint(0.5, 0);
        this.titleNode.setPosition(this.bgNode.getContentSize().width / 2, this.bgNode.getContentSize().height - 100);
        this.titleNode.setContentSize(this.bgNode.getContentSize().width, 100);
        this.bgNode.addChild(this.titleNode);

        this.actionNode = new cc.Node();
        this.actionNode.setAnchorPoint(0.5, 1);
        this.actionNode.setPosition(0, 0);
        this.actionNode.setContentSize(0, 0);
        this.bgNode.addChild(this.actionNode);

        this.contentNode = new cc.Node();
        this.contentNode.setAnchorPoint(0.5, 0);
        this.contentNode.setPosition(this.bgNode.getContentSize().width / 2, 83);
        this.contentNode.setContentSize(this.bgNode.getContentSize().width, this.bgNode.getContentSize().height - this.titleNode.getContentSize().height - this.actionNode.getContentSize().height - 20);
        
        this.contentNode.setScale(0.9);
        this.bgNode.addChild(this.contentNode);

        var richText = new ItemRichText(this.itemList, 480, 5, 0.6, cc.color.BLACK, uiUtil.fontSize.COMMON_2);
        richText.setName("richText");
        richText.setAnchorPoint(0, 1);
        richText.setPosition(-20, this.contentNode.y - 50);
        this.contentNode.addChild(richText);
    },
    onExit: function () {
        this._super();
    }
})

var DialogBig = DialogCommon.extend({
    ctor: function (config) {
        this._super(config);

        if (config.content.dig_des) {
            var digDes = autoSpriteFrameController.getSpriteFromSpriteName(config.content.dig_des);
            digDes.setAnchorPoint(0.5, 1)
            digDes.setPosition(this.contentNode.getContentSize().width / 2, this.contentNode.getContentSize().height - 5);
            this.contentNode.addChild(digDes);
            digDes.setName("dig_des");
        }

        if (config.content.des) {
            var des = new cc.LabelTTF(config.content.des, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(this.rightEdge - this.leftEdge, 0));
            des.setAnchorPoint(0, 1);
            des.setPosition(this.leftEdge, digDes ? this.contentNode.getContentSize().height - digDes.height * digDes.scale : this.contentNode.getContentSize().height - 20);
            this.contentNode.addChild(des, 1);
            des.setName("des");
            des.setColor(cc.color.BLACK);
        }

        if (config.content.log) {
            var log = new cc.Node();
            log.setAnchorPoint(0, 0);
            log.setPosition(0, 0);
            log.setContentSize(this.contentNode.getContentSize().width, 100);
            log.setName("log");
            this.contentNode.addChild(log);
        }
    },
    
    initContentSize: function () {
        var bg = autoSpriteFrameController.getSpriteFromSpriteName("#dialog_big_bg.png");
        bg.setAnchorPoint(0, 0);
        bg.setPosition(0, 0);
        this.bgNode.addChild(bg, 0);
        bg.setName("bg");
        this.bgNode.setContentSize(bg.getContentSize());

        this.titleNode = new cc.Node();
        this.titleNode.setAnchorPoint(0.5, 0);
        this.titleNode.setPosition(this.bgNode.getContentSize().width / 2, this.bgNode.getContentSize().height - 90);
        this.titleNode.setContentSize(this.bgNode.getContentSize().width, 90);
        this.bgNode.addChild(this.titleNode);

        this.actionNode = new cc.Node();
        this.actionNode.setAnchorPoint(0.5, 1);
        this.actionNode.setPosition(this.bgNode.getContentSize().width / 2, 72);
        this.actionNode.setContentSize(this.bgNode.getContentSize().width, 72);
        this.bgNode.addChild(this.actionNode);

        this.contentNode = new cc.Node();
        this.contentNode.setAnchorPoint(0.5, 0);
        this.contentNode.setPosition(this.bgNode.getContentSize().width / 2, 72);
        this.contentNode.setContentSize(this.bgNode.getContentSize().width, this.bgNode.getContentSize().height - this.titleNode.getContentSize().height - this.actionNode.getContentSize().height);
        this.bgNode.addChild(this.contentNode);
    }
});

var DialogBig2 = DialogCommon.extend({
    ctor: function (config) {
        this._super(config);

        if (config.content.dig_des) {
            var digDes = autoSpriteFrameController.getSpriteFromSpriteName(config.content.dig_des);
            digDes.setAnchorPoint(0.5, 1)
            digDes.setPosition(this.contentNode.getContentSize().width / 2, this.contentNode.getContentSize().height - 5);
            this.contentNode.addChild(digDes);
            digDes.setName("dig_des");
        }

        if (config.content.des) {
            var des = new cc.LabelTTF(config.content.des, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(this.rightEdge - this.leftEdge, 0));
            des.setAnchorPoint(0, 1);
            des.setPosition(this.leftEdge, digDes ? this.contentNode.getContentSize().height - digDes.height * digDes.scale : this.contentNode.getContentSize().height - 20);
            this.contentNode.addChild(des, 1);
            des.setName("des");
            des.setColor(cc.color.BLACK);
        }

        if (config.content.log) {
            var log = new cc.Node();
            log.setAnchorPoint(0, 0);
            log.setPosition(0, 0);
            log.setContentSize(this.contentNode.getContentSize().width, 100);
            log.setName("log");
            this.contentNode.addChild(log);
        }
    },
    initContentSize: function () {
        var bg = new cc.Sprite("res/new/Steal.png");
        bg.setAnchorPoint(0, 0);
        bg.setPosition(0, 0);
        this.bgNode.addChild(bg, 0);
        this.bgNode.setContentSize(bg.getContentSize());
        this.titleNode = new cc.Node();
        this.titleNode.setAnchorPoint(0.5, 0);
        this.titleNode.setPosition(this.bgNode.getContentSize().width / 2, this.bgNode.getContentSize().height - 90);
        this.titleNode.setContentSize(this.bgNode.getContentSize().width, 90);
        this.bgNode.addChild(this.titleNode);

        this.actionNode = new cc.Node();
        this.actionNode.setAnchorPoint(0.5, 1);
        this.actionNode.setPosition(this.bgNode.getContentSize().width / 2, 72);
        this.actionNode.setContentSize(this.bgNode.getContentSize().width, 72);
        this.bgNode.addChild(this.actionNode);

        this.contentNode = new cc.Node();
        this.contentNode.setAnchorPoint(0.5, 0);
        this.contentNode.setPosition(this.bgNode.getContentSize().width / 2, 72);
        this.contentNode.setContentSize(this.bgNode.getContentSize().width, this.bgNode.getContentSize().height - this.titleNode.getContentSize().height - this.actionNode.getContentSize().height);
        this.bgNode.addChild(this.contentNode);

    }
});

var DialogSmall = DialogCommon.extend({
    ctor: function (config) {
        this._super(config);

        if (config.content.des) {
            var des = new cc.LabelTTF(config.content.des, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(this.rightEdge - this.leftEdge, 0));
            des.setAnchorPoint(0, 1);
            des.setPosition(this.leftEdge, this.contentNode.getContentSize().height - 5);
            this.contentNode.addChild(des);
            des.setName("des");
            des.setColor(cc.color.BLACK);
        }
    },
    initContentSize: function () {
        var bg = autoSpriteFrameController.getSpriteFromSpriteName("#dialog_small_2_bg.png");
        bg.setAnchorPoint(0, 0);
        bg.setPosition(0, 0);
        this.bgNode.addChild(bg, 0);

        this.bgNode.setContentSize(bg.getContentSize());

        this.titleNode = new cc.Node();
        this.titleNode.setAnchorPoint(0.5, 0);
        this.titleNode.setPosition(this.bgNode.getContentSize().width / 2, this.bgNode.getContentSize().height - 90);
        this.titleNode.setContentSize(this.bgNode.getContentSize().width, 90);
        this.bgNode.addChild(this.titleNode);

        this.actionNode = new cc.Node();
        this.actionNode.setAnchorPoint(0.5, 1);
        this.actionNode.setPosition(this.bgNode.getContentSize().width / 2, 72);
        this.actionNode.setContentSize(this.bgNode.getContentSize().width, 72);
        this.bgNode.addChild(this.actionNode);

        this.contentNode = new cc.Node();
        this.contentNode.setAnchorPoint(0.5, 0);
        this.contentNode.setPosition(this.bgNode.getContentSize().width / 2, 72);
        this.contentNode.setContentSize(this.bgNode.getContentSize().width, this.bgNode.getContentSize().height - this.titleNode.getContentSize().height - this.actionNode.getContentSize().height);
        this.bgNode.addChild(this.contentNode);
    }
});

var DialogTiny = DialogCommon.extend({
    ctor: function (config) {
        this._super(config);

        if (config.content.des) {
            var des = new cc.LabelTTF(config.content.des, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(this.rightEdge - this.leftEdge, 0));
            des.setAnchorPoint(0, 0);
            des.setPosition(this.leftEdge, (this.contentNode.height - des.height) / 2);
            this.contentNode.addChild(des);
            des.setName("des");
            des.setColor(cc.color.BLACK);
        }
    },
    initContentSize: function () {
        var bg = autoSpriteFrameController.getSpriteFromSpriteName("#dialog_tiny_bg.png");
        bg.setAnchorPoint(0, 0);
        bg.setPosition(0, 0);
        this.bgNode.addChild(bg, 0);

        this.bgNode.setContentSize(bg.getContentSize());

        this.titleNode = new cc.Node();
        this.titleNode.setAnchorPoint(0.5, 0);
        this.titleNode.setPosition(this.bgNode.width / 2 + 50, 100);
        this.titleNode.setContentSize(this.bgNode.getContentSize().width, 90);
        this.bgNode.addChild(this.titleNode);

        this.actionNode = new cc.Node();
        this.actionNode.setAnchorPoint(0.5, 1);
        this.actionNode.setPosition(this.bgNode.getContentSize().width / 2, 72);
        this.actionNode.setContentSize(this.bgNode.getContentSize().width, 72);
        this.bgNode.addChild(this.actionNode);

        this.contentNode = new cc.Node();
        this.contentNode.setAnchorPoint(0.5, 0);
        this.contentNode.setPosition(this.bgNode.getContentSize().width / 2, 72);
        this.contentNode.setContentSize(this.bgNode.getContentSize().width, this.bgNode.getContentSize().height - this.actionNode.getContentSize().height);
        this.bgNode.addChild(this.contentNode);
    }
});

var RandomBattleDialog = DialogBig.extend({
    ctor: function (battleInfo, cb) {

        this.monsterList = battleInfo.list;
        this.difficulty = battleInfo.difficulty;

        var config = {
            title: {},
            content: {log: true}
        };
        config.title.title = stringUtil.getString(1080);
        config.title.icon = "icon_warning_monster.png";
        config.content.des = stringUtil.getString(3009)[this.difficulty - 1];
        config.content.dig_des = "#monster_dig_" + this.difficulty + ".png";
        this._super(config);

        var digDes = this.contentNode.getChildByName("dig_des");
        var digMidBg = autoSpriteFrameController.getSpriteFromSpriteName("#monster_dig_mid_bg.png");
        digMidBg.setPosition(digDes.x, digDes.y - digDes.height / 2);
        digMidBg.setScale(0.8);
        this.contentNode.addChild(digMidBg, 0);

        this.autoDismiss = false;

        this.cb = cb;
        this.log = this.contentNode.getChildByName("log");
        this.log.height = this.log.height + 70;
        this.createBattleBeginView();
        this.getChildByName("bgColor").height = 1004;
        var screenFix = Record.getScreenFix();
        if (screenFix == 1) {
            this.getChildByName("bgColor").height = 946;
        } else {
            this.getChildByName("bgColor").height = 1004;
        }
    },
    show: function () {
        this._super();
        cc.timer.pause();
    },
    dismiss: function () {
        this._super();
        cc.timer.resume();
    },
    createBattleBeginView: function () {
        var label1 = new cc.LabelTTF(stringUtil.getString(1041), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        label1.setAnchorPoint(0, 1);
        label1.setPosition(this.leftEdge, this.log.getContentSize().height);
        label1.setColor(cc.color.BLACK);
        this.log.addChild(label1);

        var iconList = uiUtil.createEquipedItemIconList(true);
        iconList.setPosition(label1.x + label1.width + 5, label1.y - label1.height / 2);
        this.log.addChild(iconList);

        var label2 = new cc.LabelTTF(stringUtil.getString(1042) + " " + this.difficulty, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        label2.setAnchorPoint(0, 1);
        label2.setPosition(this.leftEdge, label1.getPositionY() - label1.getContentSize().height);
        label2.setColor(cc.color.RED);
        this.log.addChild(label2);

        if (cc.RTL) {
            label1.anchorX = 1;
            label1.x = this.rightEdge;

            iconList.x = label1.x - label1.width - 5 - iconList.width;

            label2.anchorX = 1;
            label2.x = this.rightEdge;
        }

        var currentTime = Number(cc.timer.time);
        currentTime -= player.lastAlcoholTime;

        if (!player.equip.haveWeapon()) {
            var label3 = new cc.LabelTTF(stringUtil.getString(1207), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(this.rightEdge - this.leftEdge, 0));
            label3.setAnchorPoint(0, 1);
            label3.setPosition(this.leftEdge, label2.y - label2.height);
            this.log.addChild(label3);
            label3.setColor(cc.color.RED);
        } else if (currentTime <= 43200) {
            currentTime = 43200 - currentTime;
            currentTime = Math.ceil(currentTime / 3600);
            currentTime = Number(2 * currentTime);
            var label3 = new cc.LabelTTF(stringUtil.getString(1325, currentTime), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(this.rightEdge - this.leftEdge, 0));
            label3.setAnchorPoint(0, 1);
            label3.setPosition(this.leftEdge, label2.y - label2.height);
            this.log.addChild(label3);
            label3.setColor(cc.color.RED);
        }

        if (player.isLowVigour()) {
            var label4Str = stringUtil.getString(1206);
            var label4 = new cc.LabelTTF(label4Str, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(this.rightEdge - this.leftEdge, 0));
            label4.setAnchorPoint(0, 1);
            if (label3) {
                label4.setPosition(this.leftEdge, label3.y - label3.height);
            } else {
                label4.setPosition(this.leftEdge, label2.y - label2.height);
            }
            this.log.addChild(label4);
            label4.setColor(cc.color.RED);
        }
        var self = this;
        var btn1 = uiUtil.createCommonBtnBlack(stringUtil.getString(1044), this, function () {
            self.log.removeAllChildren();
            self.actionNode.removeAllChildren();
            self.createBattleProcessView();
        });
        btn1.setPosition(this.actionNode.getContentSize().width / 4, this.actionNode.getContentSize().height / 2);
        this.actionNode.addChild(btn1);

        var btn2 = uiUtil.createCommonBtnBlack(stringUtil.getString(1081), this, function () {
            self.log.removeAllChildren();
            self.actionNode.removeAllChildren();
            self.createBattleProcessView(true);
        });
        btn2.setPosition(this.actionNode.getContentSize().width / 4 * 3, this.actionNode.getContentSize().height / 2);
        this.actionNode.addChild(btn2);
    },
    createBattleProcessView: function (isDodge) {
        var des = this.contentNode.getChildByName("des");
        des.setString("");

        var battle = new Battle({
            id: 0,
            monsterList: this.monsterList
        }, isDodge, this.difficulty);
        var self = this;
        battle.setGameEndListener(function (sumRes) {
            utils.emitter.off("battleProcessLog");
            utils.emitter.off("battleMonsterLength");
            utils.emitter.off("battleDodgePercentage");

            Medal.checkMonsterKilled(sumRes.monsterKilledNum);

            self.scheduleOnce(function () {
                self.log.removeAllChildren();
                self.actionNode.removeAllChildren();

                if (sumRes.isDodge) {
                    player.log.addMsg(1114);
                    self.dismiss();
                    if (self.cb) {
                        self.cb();
                    }
                } else {
                    player.log.addMsg(1115);
                    self.createBattleEndView(sumRes);
                }
            }, 2);
        });

        for (var i = 0; i < 5; i++) {
            var label = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(400, 0));
            label.setAnchorPoint(0, 0);
            label.setPosition(this.leftEdge, i * 40 + 10);
            label.setName("log_" + i);
            label.setColor(cc.color.BLACK);
            this.log.addChild(label);
        }

        this.log.updateLog = function (log) {
            for (var i = 4; i >= 0; i--) {
                var label = this.getChildByName("log_" + i);
                var currentLogInfo;
                if (i === 0) {
                    currentLogInfo = log;
                } else {
                    var lastLabel = this.getChildByName("log_" + (i - 1));
                    currentLogInfo = lastLabel.logInfo;
                }

                if (currentLogInfo) {
                    label.logInfo = currentLogInfo;
                    label.setString(currentLogInfo.log);
                    if (currentLogInfo.color) {
                        label.setColor(currentLogInfo.color);
                    } else {
                        label.setColor(cc.color.BLACK);
                    }

                    if (currentLogInfo.bigger) {
                        label.setFontSize(uiUtil.fontSize.COMMON_2);
                    } else {
                        label.setFontSize(uiUtil.fontSize.COMMON_3);
                    }
                }
            }
        }
        utils.emitter.on("battleProcessLog", function (prelog) {
            var logs = utils.splitLog(prelog["log"], 50, 42);
            for (var key in logs) {
                var oneLog = {
                    log: logs[key],
                    color: prelog["color"],
                    bigger: prelog["bigger"]
                }
                self.log.updateLog(oneLog);
            }
        });

        var pbBg = autoSpriteFrameController.getSpriteFromSpriteName("#pb_bg.png");
        pbBg.setAnchorPoint(0.5, 0);
        pbBg.setPosition(this.actionNode.getContentSize().width / 2, this.actionNode.getContentSize().height / 2 - 10);
        pbBg.setName("pbBg");
        this.actionNode.addChild(pbBg);

        var pb = new cc.ProgressTimer(autoSpriteFrameController.getSpriteFromSpriteName("#pb.png"));
        pb.type = cc.ProgressTimer.TYPE_BAR;
        pb.midPoint = cc.p(0, 0);
        pb.barChangeRate = cc.p(1, 0);
        pb.setPosition(pbBg.getPositionX(), pbBg.getPositionY() + pbBg.getContentSize().height / 2);
        pb.setPercentage(0);
        pb.setName("pb");
        this.actionNode.addChild(pb);

        if (isDodge) {
            utils.emitter.on("battleDodgePercentage", function (percentage) {
                pb.setPercentage(percentage);
            });
        } else {
            var monsterLenTotal = this.monsterList.length;

            var labelNum = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
            labelNum.setAnchorPoint(1, 0);
            labelNum.setPosition(pbBg.x + pbBg.width / 2, pbBg.y + pbBg.height + 5);
            labelNum.setColor(cc.color.BLACK);
            this.actionNode.addChild(labelNum);
            labelNum.setString(stringUtil.getString(1139) + cc.formatStr("%s/%s", monsterLenTotal, monsterLenTotal));

            utils.emitter.on("battleMonsterLength", function (monsterLen) {
                pb.setPercentage((monsterLenTotal - monsterLen) / monsterLenTotal * 100);
                labelNum.setString(stringUtil.getString(1139) + cc.formatStr("%s/%s", monsterLen, monsterLenTotal));
            });
        }
    },
    createBattleEndView: function (sumRes) {
        var des = this.contentNode.getChildByName("des");
        des.setString(stringUtil.getString(1082));

        this.log.height += 10;

        var label1 = new cc.LabelTTF(stringUtil.getString(1058), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        label1.setAnchorPoint(0, 1);
        label1.setPosition(this.leftEdge, this.log.getContentSize().height);
        label1.setColor(cc.color.BLACK);
        this.log.addChild(label1);

        var items = [];
        if (sumRes.bulletNum > 0) {
            items.push({itemId: BattleConfig.BULLET_ID, num: sumRes.bulletNum});
        }
        if (sumRes.tools > 0) {
            items.push({
                itemId: sumRes.toolItemId,
                num: sumRes.tools
            });
        }

        var richText = new ItemRichText(items, this.rightEdge - this.leftEdge - label1.width, 3, 0.5, cc.color.BLACK);
        richText.setName("richText")
        richText.setAnchorPoint(0, 0.5);
        richText.setPosition(label1.x + label1.width, label1.y - label1.height / 2);
        this.log.addChild(richText);

        var label2 = new cc.LabelTTF(stringUtil.getString(1059) + stringUtil.getString("hp") + " " + sumRes.totalHarm + ", " + stringUtil.getString("15").title + " " + sumRes.totalVirus, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        label2.setAnchorPoint(0, 1);
        label2.setPosition(this.leftEdge, label1.getPositionY() - label1.getContentSize().height - 10);
        label2.setColor(cc.color.BLACK);
        this.log.addChild(label2);

        if (sumRes.totalVirus) {
                player.changeAttr("virus", sumRes.totalVirus);
        }
        
        if (sumRes.brokenWeapon) {
            var label3 = new cc.LabelTTF(stringUtil.getString(1208), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
            label3.setAnchorPoint(0, 1);
            label3.setPosition(this.leftEdge, label2.getPositionY() - label2.getContentSize().height - 10);
            label3.setColor(cc.color.BLACK);
            this.log.addChild(label3);
            var items2 = sumRes.brokenWeapon.map(function (itemId) {
                return {itemId: itemId, num: 1};
            });
            var richText2 = new ItemRichText(items2, this.rightEdge - this.leftEdge - label3.width, 3, 0.5, cc.color.BLACK);
            richText2.setName("richText2")
            richText2.setAnchorPoint(0, 0.5);
            richText2.setPosition(label3.x + label3.width, label3.y - label3.height / 2);
            this.log.addChild(richText2);
        }
        if (sumRes.win) {
            var randomRewardConfig = randomReward[this.difficulty];
            var rand = Math.random();
            if (rand <= randomRewardConfig.probability) {
                var label4 = new cc.LabelTTF(stringUtil.getString(1222), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
                label4.setAnchorPoint(0, 1);
                label4.setPosition(this.leftEdge, label3.getPositionY() - label3.getContentSize().height - 10);
                label4.setColor(cc.color.BLACK);
                this.log.addChild(label4);
                var itemIds = utils.getFixedValueItemIds(randomRewardConfig["produceValue"], randomRewardConfig["produceList"]);
                var items3 = utils.convertItemIds2Item(itemIds);
                player.gainItemsInBag(items3);

                var richText3 = new ItemRichText(items3, this.rightEdge - this.leftEdge - label4.width, 3, 0.5, cc.color.BLACK);
                richText3.setName("richText3")
                richText3.setAnchorPoint(0, 0.5);
                richText3.setPosition(label4.x + label4.width, label4.y - label4.height / 2);
                this.log.addChild(richText3);
            }
        }

        if (cc.RTL) {
            label1.anchorX = 1;
            label1.x = this.rightEdge;

            richText.anchorX = 1;
            richText.x = label1.x - label1.width;

            label2.anchorX = 1;
            label2.x = this.rightEdge;

            if (label3) {
                label3.anchorX = 1;
                label3.x = this.rightEdge;

                richText2.anchorX = 1;
                richText2.x = label3.x - label3.width;
            }

            if (label4) {
                label4.anchorX = 1;
                label4.x = this.rightEdge;

                richText3.anchorX = 1;
                richText3.x = label4.x - label4.width;
            }
        }
        var self = this;
        var btn = uiUtil.createCommonBtnBlack(stringUtil.getString(1073), this, function () {
            self.dismiss();
            if (this.cb) {
                this.cb();
            }
        });
        btn.setPosition(this.actionNode.getContentSize().width / 2, this.actionNode.getContentSize().height / 2);
        this.actionNode.addChild(btn);
    }
});

var NpcDialog = DialogBig.extend({
    ctor: function (config) {
        this._super(config);

        this.autoDismiss = false;
        var heartNode = uiUtil.createHeartNode();
        heartNode.setAnchorPoint(1, 0.5);
        heartNode.x = this.rightEdge;
        heartNode.y = this.titleNode.height / 2;
        this.titleNode.addChild(heartNode);
        heartNode.updateView(config.title.heart);
    }
});

var ItemListDialog = DialogBig.extend({
    ctor: function (itemInfos) {
        var config = {
            title: {},
            action: {btn_1: {}}
        };
        config.title.title = stringUtil.getString(1140);
        config.action.btn_1.txt = stringUtil.getString(1073);
        this._super(config);

        this.items = itemInfos;

        var col = 1;
        var row = Math.ceil(this.items.length / col);
        var colWidth = this.contentNode.width / col;
        var rowHeight;
        for (var i = 0; i < this.items.length; i++) {
            var itemInfo = this.items[i];
            var icon = autoSpriteFrameController.getSpriteFromSpriteName("#icon_item_" + itemInfo.itemId + ".png");
            icon.setScale(0.5);
            this.contentNode.addChild(icon);
            if (!rowHeight) {
                rowHeight = icon.height * icon.scale;
            }

            var name = new cc.LabelTTF(stringUtil.getString(itemInfo.itemId).title, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
            name.setColor(cc.color.BLACK);
            this.contentNode.addChild(name);

            var num = new cc.LabelTTF(itemInfo.num, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
            num.setColor(itemInfo.num <= itemInfo.haveNum ? cc.color.BLACK : cc.color.RED);
            this.contentNode.addChild(num);

            var txt = new cc.LabelTTF(stringUtil.getString(1141, itemInfo.haveNum), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
            txt.setColor(cc.color.BLACK);
            this.contentNode.addChild(txt);

            var c = i % col;
            var r = Math.floor(i / col);
            var halfHeight = this.contentNode.height - 20 - (r + 0.5) * rowHeight;
            var leftEdge = this.leftEdge;
            var rightEdge = this.rightEdge;
            icon.setAnchorPoint(0, 0.5);
            icon.setPosition(leftEdge, halfHeight);
            name.setAnchorPoint(0, 0.5);
            name.setPosition(icon.x + icon.width * icon.scale + 10, halfHeight);
            txt.setAnchorPoint(1, 0.5);
            txt.setPosition(rightEdge, halfHeight);
            num.setAnchorPoint(1, 0.5);
            num.setPosition(txt.x - txt.width - 10, halfHeight);
        }
    }
});

var AboutUUIDDialog = DialogTiny.extend({
    ctor: function () {
        var config = {
            title: {},
            content: {},
            action: {btn_1: {}}
        };
        config.action.btn_1.txt = stringUtil.getString(1030);

        this._super(config);
        var str = "UUID: " +Record.getUUID() + "\nBuried City, Modded by ArithSeq";
        var label1 = new cc.LabelTTF(str, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        label1.x = this.contentNode.width / 2;
        label1.y = this.contentNode.height / 2;
        this.contentNode.addChild(label1);
        label1.setColor(cc.color.BLACK);
    }
});

var NpcTradeItemDialog = DialogTiny.extend({
    ctor: function (needItems) {
        var config = {
            title: {},
            content: {},
            action: {btn_1: {}}
        };
        config.action.btn_1.txt = stringUtil.getString(1030);

        this._super(config);
        this.y = -196;
        
        var label1 = new cc.LabelTTF(stringUtil.getString(1039) + ": ", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        label1.setAnchorPoint(0, 1);
        label1.setPosition(20, 140);
        this.contentNode.addChild(label1);
        label1.setColor(cc.color.BLACK);

        var richText = new ItemRichText(needItems, 420, 5, 0.4);
        richText.setName("richText");
        richText.setAnchorPoint(0, 1);
        richText.setPosition(10, label1.y - 30);
        this.contentNode.addChild(richText);
    }
});

var PayDialog = DialogBig.extend({
    ctor: function (purchaseId, cb) {
        var config = {
            title: {},
            content: {},
            action: {btn_1: {}, btn_2: {}}
        };
        this.purchaseId = purchaseId;
        var strConfig = stringUtil.getString("p_" + purchaseId);
        var purchaseConfig = IAPPackage.getPurchaseConfig(purchaseId);

        config.title.title = strConfig.name;
        if (purchaseId == 108) {
            config.title.icon = "npc_1.png";
        } else if (purchaseId == 109) {
            config.title.icon = "npc_4.png";
        } else {
            config.title.icon = "icon_iap_" + purchaseId + ".png";
        }
        config.action.btn_1.txt = stringUtil.getString(1193);

        if (purchaseId < 200) {
            config.action.btn_2.txt = stringUtil.getString(1227);
        } else {
            config.action.btn_2.txt = stringUtil.getString(1213);
        }
        config.action.btn_2.target = null;
        config.action.btn_2.cb = cb;

        this._super(config);

        if (purchaseId == 108 || purchaseId == 109) {
            this.titleNode.getChildByName("icon").scale = 1;
        } else {
            this.titleNode.getChildByName("icon").scale = 0.45;
        }
        this.titleNode.getChildByName("title").updateView();

        var price = new cc.LabelTTF(stringUtil.getString(1192), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        price.anchorX = 1;
        price.setPosition(this.rightEdge, 20);
        this.titleNode.addChild(price);
        price.setName("price");
        price.setColor(cc.color.BLACK);

        this.actionNode.getChildByName("btn_2").setEnabled(!IAPPackage.isIAPUnlocked(purchaseId));

        var offIcon = uiUtil.createSaleOffIcon();
        offIcon.x = this.titleNode.width - 20;
        offIcon.y = this.titleNode.height;
        this.titleNode.addChild(offIcon);
        offIcon.setVisible(false);
        offIcon.setName('offIcon');
        this.updateOffIcon();

        if (purchaseId == 106) {
            var saleIcon = autoSpriteFrameController.getSpriteFromSpriteName('icon_sale.png');
            saleIcon.x = this.titleNode.width - 20;
            saleIcon.y = this.titleNode.height - 10;
            this.titleNode.addChild(saleIcon);
        }
    },
    updateOffIcon: function () {
        var offIcon = this.titleNode.getChildByName('offIcon');
        var off = IAPPackage.getPriceOff(this.purchaseId);
        if (off > 0) {
            offIcon.setVisible(true);
            offIcon.updateOff(off);
        } else {
            offIcon.setVisible(false);
        }
    },
    show: function () {
        this._super();
        if (cc.timer)
            cc.timer.pause();
    },
    dismiss: function () {
        this._super();
        if (cc.timer)
            cc.timer.resume();
    }
});

var LoadingDialog = Dialog.extend({
    ctor: function () {
        this._super();
        this.autoDismiss = false;

        this.sprite = autoSpriteFrameController.getSpriteFromSpriteName("loading_anim_1.png");
        this.sprite.x = this.width / 2;
        this.sprite.y = this.height / 2;
        this.addChild(this.sprite);

        var array = [];
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("loading_anim_1.png"));
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("loading_anim_2.png"));
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("loading_anim_3.png"));
        array.push(autoSpriteFrameController.getSpriteFrameFromSpriteName("loading_anim_4.png"));
        var animation = new cc.Animation(array, 0.2);
        var anim = cc.animate(animation);
        this.sprite.runAction(cc.repeatForever(anim));
    },
    initContentSize: function () {
        return cc.winSize;
    }
});

var BackToMenuDialog = DialogTiny.extend({
    ctor: function (cb) {
        var config = {
            title: {},
            content: {},
            action: {btn_1: {}, btn_2: {}}
        };
        config.content.des = stringUtil.getString(1273);
        config.action.btn_2.txt = stringUtil.getString(1030);
        config.action.btn_2.target = null;
        config.action.btn_2.cb = cb;

        config.action.btn_1.txt = stringUtil.getString(1031);
        config.action.btn_1.cb = null;
        this._super(config);
    },
    show: function () {
        this._super();
        if (cc.timer)
            cc.timer.pause();
    },
    dismiss: function () {
        this._super();
        if (cc.timer)
            cc.timer.resume();
    }
});
var DialogMoreGame = Dialog.extend({
    ctor: function(a) {
        this._super();

        var bg = autoSpriteFrameController.getSpriteFromSpriteName("frame_ad_bg.png");
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        this.addChild(bg);

        var webview = new ccui.WebView();
        webview.loadFile(a);
        webview.setContentSize(cc.size(440, 545));
        webview.anchorY = 0;
        webview.x = bg.width / 2;
        webview.y = 20;
        bg.addChild(webview, 100);
        webview.setOnDidFinishLoading(function() {
            webview.setVisible(true);
        });
        webview.setVisible(false);
        webview.setScalesPageToFit(true);

        var btnClose = uiUtil.createSpriteBtn({
            normal: "btn_ad_back.png"
        }, this, function() {
            this.dismiss();
        });
        btnClose.x = bg.width - 20;
        btnClose.y = bg.height - 20;
        bg.addChild(btnClose);

        this.autoDismiss = false;
    },
    initContentSize: function() {
        return cc.winSize;
    }
});

var FTUEDialog = DialogBig.extend({
    ctor: function () {
        var config = {
            title: {title: stringUtil.getString(1337)},
            content: {des: stringUtil.getString(1338)},
            action: {btn_1: {}}
        };
        config.action.btn_1.txt = stringUtil.getString(1030);
        this._super(config);
    }
});