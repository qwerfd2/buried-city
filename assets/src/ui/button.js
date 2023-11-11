var Button = cc.Node.extend({
    ctor: function (size, swallowTouches) {
        this._super();

        this.setContentSize(size);
        this.setAnchorPoint(0.5, 0.5);
        this.boundingRect = cc.rect(0, 0, this.width, this.height);
        this.touchBeganPos = null;
        this.enabled = true;
        if (swallowTouches === undefined || swallowTouches === null) {
            swallowTouches = true;
        }
        var self = this;
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: swallowTouches,
            onTouchBegan: function (touch, event) {
                return self.onTouchBegan(touch);
            },
            onTouchMoved: function (touch, event) {
                self.onTouchMoved(touch);
            },
            onTouchEnded: function (touch, event) {
                self.onTouchEnded(touch);
            }
        }), this);
    },
    onTouchBegan: function (touch) {
        if (this.enabled && this.isVisible()) {
            this.touchBeganPos = touch.getLocation();
            var localPos = this.convertToNodeSpace(this.touchBeganPos);
            if (cc.rectContainsPoint(this.boundingRect, localPos)) {
                this.isPressed = true;
                this.onPressed();
                return true;
            }
            return false;
        } else {
            return false;
        }
    },
    onTouchMoved: function (touch) {
    },
    onTouchEnded: function (touch) {
        if (this.enabled) {
            if (this.isPressed) {
                this.isPressed = false;
                var localPos = this.convertToNodeSpace(touch.getLocation());
                this.onRelease(cc.rectContainsPoint(this.boundingRect, localPos))
            }
        }
    },
    setClickListener: function (target, cb) {
        this.target = target;
        this.cb = cb;
    },
    onClick: function () {
        if (this.target && this.cb) {
            this.cb.call(this.target, this);
        }
    },
    onPressed: function () {
        audioManager.playEffect(audioManager.sound.CLICK);
    },
    onRelease: function (isInBound) {
        if (isInBound) {
            this.onClick();
        }
    },
    setEnabled: function (enabled) {
        this.enabled = enabled;
    },
    isVisible: function () {
        var v = this._super();
        var parent = this.getParent();
        while (parent) {
            if (!parent.isVisible()) {
                v = false;
                break;
            }
            parent = parent.getParent();
        }
        return v;
    },
    isEnabled: function () {
        return this.enabled;
    }

});

var ImageButton = Button.extend({
    ctor: function (a, b) {
        icon = new cc.Sprite(a);
        icon.setScale(b || 1);
        this._super(cc.size(icon.getContentSize().width, icon.getContentSize().height));  
        icon.setPosition(this.width / 2, this.height / 2);

        this.addChild(icon);
    }
});

var TalentButton = Button.extend({
    ctor: function (a) {

        var icon = new cc.LabelTTF(String(a), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        if (IAPPackage.isAllIAPUnlocked() || IAPPackage.isAllItemUnlocked()) {
            icon.setColor(cc.color.GRAY);
        }
        
        var bg = new cc.Sprite("#icon_iap_bg.png");
        bg.setScale(0.2);
        this._super(cc.size(35, 35));
        icon.setPosition(this.width / 2 - 3, this.height / 2 + 2);

        bg.setPosition(this.width / 2, this.height / 2);
        this.addChild(icon);
        this.addChild(bg);
    }
});

var DogButton = Button.extend({
    ctor: function (a) {
        var str;
        if (player.dogState && player.room.getBuildLevel(12) >= 0) {
            if (player.isDogActive()) {
                str = "#icon_item_1106013.png";
            } else {
                str = "#dog_unable.png";
            }
            var bg = new cc.Sprite(str);
            bg.setName("dogBg");
            bg.setScale(0.4);
            this._super(cc.size(35, 35));

            bg.setPosition(this.width / 2, this.height / 2);
            this.addChild(bg);
        }
    },
    updateView: function () {
        this.removeChildByName("dogBg");
        var str;
        if (player.dogState && player.room.getBuildLevel(12) >= 0) {
            if (player.isDogActive()) {
                //white icon
                str = "#icon_item_1106013.png";
            } else {
                //gray icon
                str = "#dog_unable.png";
            }
            var bg = new cc.Sprite(str);
            bg.setName("dogBg");
            bg.setScale(0.4);

            bg.setPosition(this.width / 2, this.height / 2);
            this.addChild(bg);
        }
    }
});

var ButtonInScrollView = Button.extend({
    ctor: function (size) {
        this._super(size);
    },
    onTouchMoved: function (touch) {
        if (this.isPressed) {
            if (cc.pDistanceSQ(this.touchBeganPos, touch.getLocation()) > 200) {
                this.isPressed = false;
            }
        }
    }
});

var ButtonWithPressed = Button.extend({
    ctor: function (size) {
        this._super(size);

        var drawNode = new cc.DrawNode();
        drawNode.setName("pressedBg");
        drawNode.setVisible(false);
        this.addChild(drawNode);
        drawNode.drawRect(cc.p(0, 0), cc.p(this.width, this.height), cc.color(255, 255, 255, 100), 1, cc.color(255, 255, 255, 10));
    },
    onPressed: function () {
        this.getChildByName("pressedBg").setVisible(true);
        this._super();
    },
    onRelease: function (isInBound) {
        this.getChildByName("pressedBg").setVisible(false);
        this._super(isInBound);
    }
});
var SettingButton = Button.extend({
    ctor: function (str, withUpDown) {
        this._super(cc.size(272, 60));
        var icon = autoSpriteFrameController.getSpriteFromSpriteName("#btn_language_bg.png");
        icon.setName("icon");
        icon.setAnchorPoint(0, 0);
        this.addChild(icon);
        if (withUpDown) {
            var scroll = autoSpriteFrameController.getSpriteFromSpriteName("btn_language_scroll.png");
            scroll.setName("scroll");
            scroll.setAnchorPoint(0, 0);
            scroll.setPosition(icon.width - 35, 10);
            this.addChild(scroll);
        }

        var label = new cc.LabelTTF(str, "", uiUtil.fontSize.COMMON_2);
        label.setPosition(icon.width / 2, icon.height / 2);
        label.setColor(cc.color(0, 0, 0, 255));
        label.setName("label");

        this.addChild(label);
    },
    setTitle: function (str) {
        this.getChildByName("label").setString(str);
    },
    onPressed: function () {
        this.getChildByName("icon").setOpacity(128);
        this._super();
    },
    onRelease: function (isInBound) {
        this.getChildByName("icon").setOpacity(255);
        this._super(isInBound);
    }
})

var StatusButton = ButtonWithPressed.extend({
    ctor: function (size, spriteFrameName, str, opt) {
        this._super(size);
        this.opt = opt || {};
        this.spriteFrameName = spriteFrameName;

        var icon = autoSpriteFrameController.getSpriteFromSpriteName(spriteFrameName);
        icon.setName("icon");
        this.addChild(icon);
        if (this.opt.scale) {
            icon.setScale(this.opt.scale);
        }

        if (str === undefined || str === null) {
            str = "";
        }
        str += "";
        var label = new cc.LabelTTF(str, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        label.setName("label");
        this.addChild(label);

        if (opt.noLabel) {
            label.setVisible(false);
        }
        this.reposition();
    },
    reposition: function () {
        var midPadding = 0;
        var icon = this.getChildByName("icon");
        var label = this.getChildByName("label");
        if (label.isVisible()) {
            var iconWidth = this.opt.scale ? icon.width * this.opt.scale : icon.width;

            icon.setAnchorPoint(0, 0.5);
            icon.x = 0;
            icon.y = this.height / 2;

            label.setAnchorPoint(1.1, 0.5);
            label.x = this.width;
            label.y = this.height / 2;
        } else {
            icon.setAnchorPoint(0.5, 0.5);
            icon.x = this.width / 2;
            icon.y = this.height / 2;
        }
    },
    updateView: function (spriteFrameName, str) {
        if (spriteFrameName && this.spriteFrameName !== spriteFrameName) {
            this.spriteFrameName = spriteFrameName;
            this.removeChildByName("icon");
            var icon = autoSpriteFrameController.getSpriteFromSpriteName(spriteFrameName);
            icon.setName("icon");
            this.addChild(icon);
            if (this.opt.scale) {
                icon.setScale(this.opt.scale);
            }
        }
        if (str !== undefined && str !== null) {
            var label = this.getChildByName("label");
            label.setString("" + str);
        }
        this.reposition();
    }
});

var AttrButton = ButtonWithPressed.extend({
    ctor: function (size, attr, str, range, opt) {
        this._super(size);
        this.range = range;
        this.opt = opt || {};

        this.oldPercentage = null;
        var icon = autoSpriteFrameController.getSpriteFromSpriteName("#icon_" + attr + "_1.png");
        icon.setName("icon");
        this.addChild(icon);
        if (this.opt.scale) {
            icon.setScale(this.opt.scale);
        }
        var icon2 = new cc.ProgressTimer(autoSpriteFrameController.getSpriteFromSpriteName("#icon_" + attr + "_0.png"));
        icon2.type = cc.ProgressTimer.TYPE_BAR;
        icon2.midPoint = cc.p(0, 0);
        icon2.barChangeRate = cc.p(0, 1);
        icon2.x = icon.width / 2;
        icon2.y = icon.height / 2;
        icon2.setPercentage(100);
        icon2.setName("icon2");
        icon.addChild(icon2);

        if (this.range) {
            var icon3 = autoSpriteFrameController.getSpriteFromSpriteName("#icon_" + attr + "_2.png");
            icon3.x = icon.width / 2;
            icon3.y = icon.height / 2;
            icon3.setName("icon3");
            icon3.setVisible(false);
            icon.addChild(icon3);
            icon3.runAction(cc.repeatForever((cc.sequence(cc.fadeOut(1), cc.fadeIn(1)))));
        }

        if (str === undefined || str === null) {
            str = "";
        }
        str += "";

        var label = new cc.LabelTTF(str, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        label.setName("label");
        this.addChild(label);

        this.reposition();
    },
    reposition: function () {
        var midPadding = 0;
        var icon = this.getChildByName("icon");
        var label = this.getChildByName("label");
        var iconWidth = this.opt.scale ? icon.width * this.opt.scale : icon.width;
        var edgePadding = (this.width - midPadding - iconWidth - label.width) / 2;

        icon.setAnchorPoint(0, 0.5);
        icon.x = edgePadding;
        icon.y = this.height / 2;

        label.setAnchorPoint(1, 0.5);
        label.x = this.width - edgePadding;
        label.y = this.height / 2;
    },
    updateView: function (percentage, str) {
        if (percentage !== undefined || percentage !== null) {
            var icon = this.getChildByName("icon");
            icon.getChildByName("icon2").setPercentage(percentage * 100);
            if (this.range) {
                var icon3 = icon.getChildByName("icon3");
                icon3.setVisible(this.range.isInRange(percentage));
            }

            if (this.oldPercentage !== null) {
                var dtPercentage = percentage - this.oldPercentage;
                if (dtPercentage != 0) {
                    this.warnChange(dtPercentage > 0);
                }
            }
            this.oldPercentage = percentage;
        }

        if (str !== undefined && str !== null) {
            var label = this.getChildByName("label");
            label.setString("" + str);
        }

        this.reposition();
    },
    warnChange: function (up) {
        var icon = this.getChildByName("icon");

        if (icon.getChildByName("iconWarn")) {
            icon.removeChildByName("iconWarn", true);
        }

        var iconName = up ? "#icon_status_up.png" : "icon_status_down.png";
        var iconWarn = autoSpriteFrameController.getSpriteFromSpriteName(iconName);
        iconWarn.setAnchorPoint(0, 0.5);
        iconWarn.x = icon.width + 3;
        if (up) {
            iconWarn.y = icon.height / 4 * 3;
        } else {
            iconWarn.y = icon.height / 4;
        }
        iconWarn.setName("iconWarn");
        icon.addChild(iconWarn);
        iconWarn.runAction((cc.sequence(cc.fadeOut(1))));
    }

});

var ButtonAtHomeType = {
    WHITE: 1,
    BLACK: 2
};
var ButtonAtHome = Button.extend({
    ctor: function (spriteName) {
        var sprite = autoSpriteFrameController.getSpriteFromSpriteName(spriteName);
        this._super(sprite.getContentSize());
        sprite.x = this.width / 2;
        sprite.y = this.height / 2;
        sprite.setName("normal");
        this.addChild(sprite);

        this.changeType(ButtonAtHomeType.BLACK);
    },
    onPressed: function () {
        this.getChildByName("normal").setOpacity(this.pressedOpacity);
        this._super();
    },
    onRelease: function (isInBound) {
        this.getChildByName("normal").setOpacity(this.normalOpacity);
        this._super(isInBound);
    },
    changeType: function (type) {
        if (type === ButtonAtHomeType.WHITE) {
            this.normalOpacity = 255;
            this.pressedOpacity = 127.5;
        } else {
            this.normalOpacity = 63.75;
            this.pressedOpacity = 127.5;
        }
        this.getChildByName("normal").setOpacity(this.normalOpacity);
    }
});

var ButtonAtSiteType = {
    WHITE: 1,
    BLACK: 2,
    MID: 3
};
var ButtonAtSite = ButtonAtHome.extend({
    ctor: function (spriteName) {
        this._super(spriteName);
    },
    changeType: function (type) {
        if (type === ButtonAtSiteType.WHITE) {
            this.normalOpacity = 255;
            this.pressedOpacity = 127.5;
        } else if (type === ButtonAtSiteType.MID) {
            this.normalOpacity = 64;
            this.pressedOpacity = 127.5;
        } else {
            this.normalOpacity = 12.75;
            this.pressedOpacity = 127.5;
        }
        this.getChildByName("normal").setOpacity(this.normalOpacity);
    }
});

var CheckBox = Button.extend({
    ctor: function (on, bgSpriteName, checkedSpriteName, changable) {
        var sprite = autoSpriteFrameController.getSpriteFromSpriteName(bgSpriteName);
        this._super(sprite.getContentSize());
        this.changable = changable;
        sprite.x = this.width / 2;
        sprite.y = this.height / 2;
        sprite.setName("normal");
        this.addChild(sprite);

        var checkedSprite = autoSpriteFrameController.getSpriteFromSpriteName(checkedSpriteName);
        if (checkedSpriteName == "icon_music_off.png") {
            checkedSprite.setColor(cc.color.BLACK);
        }
        checkedSprite.x = this.width / 2;
        checkedSprite.y = this.height / 2;
        checkedSprite.setName("checked");
        this.addChild(checkedSprite);

        this.on = on;
        this.updateView();
    },
    onRelease: function (isInBound) {
        if (this.changable) {
            this.on = !this.on;
            this.updateView();
            this._super(isInBound);
        }
    },
    updateView: function () {
        this.getChildByName("checked").setVisible(this.on);
    }
});

var PayItemButton = Button.extend({
    ctor: function (size) {
        this._super(size);

        var bg = autoSpriteFrameController.getScale9Sprite("edit_text_bg.png", cc.rect(4, 4, 1, 1));
        bg.setContentSize(size);
        bg.x = this.width / 2;
        bg.y = this.height / 2;
        this.addChild(bg);

        var drawNode = new cc.DrawNode();
        drawNode.setName("pressedBg");
        drawNode.setVisible(false);
        this.addChild(drawNode);
        drawNode.drawRect(cc.p(0, 0), cc.p(this.width, this.height), cc.color(255, 255, 255, 100), 1, cc.color(255, 255, 255, 10));
    },
    onPressed: function () {
        this.getChildByName("pressedBg").setVisible(true);
        this._super();
    },
    onRelease: function (isInBound) {
        this.getChildByName("pressedBg").setVisible(false);
        this._super(isInBound);
    }
});

var SpriteButton = Button.extend({
    ctor: function (size, normalName, pressedName, disableName) {
        var normal = autoSpriteFrameController.getSpriteFromSpriteName(normalName);
        if (size) {
            this._super(size);
        } else {
            this._super(normal.getContentSize());
        }

        normal.x = this.width / 2;
        normal.y = this.height / 2;
        normal.setName("normal");
        this.addChild(normal);

        if (pressedName) {
            var pressed = autoSpriteFrameController.getSpriteFromSpriteName(pressedName);
            pressed.x = this.width / 2;
            pressed.y = this.height / 2;
            pressed.setName("pressed");
            this.addChild(pressed);
            pressed.setVisible(false);
        }

        if (disableName) {
            var disable = autoSpriteFrameController.getSpriteFromSpriteName(disableName);
            disable.x = this.width / 2;
            disable.y = this.height / 2;
            disable.setName("disable");
            this.addChild(disable);
            disable.setVisible(false);
        }
    },
    setEnabled: function (enabled) {
        this._super(enabled);

        var disable = this.getChildByName("disable");
        if (disable) {
            disable.setVisible(!enabled);
        }
    },
    onPressed: function () {
        var pressed = this.getChildByName("pressed");
        if (pressed) {
            pressed.setVisible(true);
        }
        this.animPressed();
        this._super();
    },
    onRelease: function (isInBound) {
        var pressed = this.getChildByName("pressed");
        if (pressed) {
            pressed.setVisible(false);
        }
        this.animNormal();
        this._super(isInBound);
    },
    onTouchMoved: function (touch) {
        this._super(touch);
        this.animNormal();
    },
    animPressed: function () {
        this.runAction(cc.scaleTo(0.1, 1.2));
    },
    animNormal: function () {
        this.runAction(cc.scaleTo(0.1, 1));
    }
});

var ButtonAtChooseScene = Button.extend({
    ctor: function (spriteName, mode) {
        this.mode = mode;
        var bg = autoSpriteFrameController.getSpriteFromSpriteName("icon_iap_bg.png");
        this._super(bg.getContentSize());
        bg.x = this.width / 2;
        bg.y = this.height / 2 + 5;
        bg.setName("bg");
        bg.setScale(0.9);
        this.addChild(bg);

        var sprite = autoSpriteFrameController.getSpriteFromSpriteName(spriteName);
        sprite.x = this.width / 2;
        sprite.y = this.height / 2 + 5;
        sprite.setName("normal");
        sprite.setScale(0.9);
        this.addChild(sprite);
        
        if (!this.mode) {
            var info = new SpriteButton(cc.size(60, 60), 'icon_iap_info.png');
            info.x = this.width - 27;
            info.y = this.height - 27;
            info.setName("info");
            this.addChild(info);
            info.setVisible(true);
            info.setClickListener(this, function () {
                this.showInfoDialog(this.purchaseId);
            });
        }
        var mark = autoSpriteFrameController.getSpriteFromSpriteName('icon_iap_mark.png');
        mark.x = this.width / 2;
        mark.y = this.height / 2;
        mark.setName("mark");
        this.addChild(mark);
        mark.setVisible(false);

        this.normalOpacity = 255;
        this.pressedOpacity = 127.5;
    },
    setEnabled: function (enabled) {
        this._super(enabled);
        if (enabled) {
            this.getChildByName("bg").setOpacity(this.normalOpacity);
            this.getChildByName("normal").setOpacity(this.normalOpacity);
            if (this.purchaseId != 0) {
                this.getChildByName("info").setVisible(true);
            }
        } else {
            this.getChildByName("bg").setOpacity(this.pressedOpacity);
            this.getChildByName("normal").setOpacity(this.pressedOpacity);
            this.getChildByName("info").setVisible(false);
        }
    },
    onPressed: function () {
        this.getChildByName("bg").setOpacity(this.pressedOpacity);
        this.getChildByName("normal").setOpacity(this.pressedOpacity);
        this._super();
    },
    onRelease: function (isInBound) {
        this.getChildByName("bg").setOpacity(this.normalOpacity);
        this.getChildByName("normal").setOpacity(this.normalOpacity);
        this._super(isInBound);
    },
    setChecked: function (checked) {
        this.checked = checked;
        this.getChildByName("mark").setVisible(this.checked);
    },
    alternateChecked: function () {
        this.checked = !this.checked;
        this.getChildByName("mark").setVisible(this.checked);
    },

    showInfoDialog: function (purchaseId) {

        var strConfig = stringUtil.getString("p_" + purchaseId);

        var config = {
            title: {},
            content: {},
            action: {btn_1: {}}
        };
        if (purchaseId == 105) {
            config.title.icon = "icon_iap_201.png";
        } else if (purchaseId == 108) {
            config.title.icon = "icon_iap_105.png";
        } else if (purchaseId > 108) {
            config.title.icon = "";
        } else {
            config.title.icon = "icon_iap_" + purchaseId + ".png";
        }
        config.content.des = strConfig.des + "\n\n" +strConfig.effect;
        config.title.title = strConfig.name;
        config.action.btn_1.txt = stringUtil.getString(1030);
        var d = new DialogSmall(config);
        if (purchaseId != 109 && purchaseId != 110) {
            d.titleNode.getChildByName("icon").scale = 0.45;
        }
        d.show();
    }
});