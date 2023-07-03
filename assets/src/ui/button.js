/**
 * Created by lancelot on 15/5/18.
 */
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
        cc.e("btn pressed")
        audioManager.playEffect(audioManager.sound.CLICK);
    },
    onRelease: function (isInBound) {
        cc.e("btn release " + isInBound)
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
    ctor: function (a,b) {
        this._super(cc.size(66, 66));        
        icon=new cc.Sprite(a);
        icon.setScale(b || 1)      
        icon.setPosition(this.width / 8, this.height / 2);
        this.addChild(icon);
    }
})

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
            var edgePadding = (this.width - midPadding - iconWidth - label.width) / 2;

            icon.setAnchorPoint(0, 0.5);
            icon.x = edgePadding;
            icon.y = this.height / 2;

            label.setAnchorPoint(1, 0.5);
            label.x = this.width - edgePadding;
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
    ctor: function (on, bgSpriteName, checkedSpriteName) {
        var sprite = autoSpriteFrameController.getSpriteFromSpriteName(bgSpriteName);
        this._super(sprite.getContentSize());
        sprite.x = this.width / 2;
        sprite.y = this.height / 2;
        sprite.setName("normal");
        this.addChild(sprite);

        var checkedSprite = autoSpriteFrameController.getSpriteFromSpriteName(checkedSpriteName);
        checkedSprite.x = this.width / 2;
        checkedSprite.y = this.height / 2;
        checkedSprite.setName("checked");
        this.addChild(checkedSprite);

        this.on = on;
        this.updateView();
    },
    onRelease: function (isInBound) {
        this.on = !this.on;
        this.updateView();

        this._super(isInBound);
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
    ctor: function (spriteName) {
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

        var info = new SpriteButton(cc.size(100, 100), 'icon_iap_info.png');
        info.x = this.width - 27;
        info.y = this.height - 27;
        info.setName("info");
        this.addChild(info);
        info.setVisible(true);
        info.setClickListener(this, function () {
            this.showInfoDialog(this.purchaseId);
        });

        var mark = autoSpriteFrameController.getSpriteFromSpriteName('icon_iap_mark.png');
        mark.x = this.width / 2;
        mark.y = this.height / 2;
        mark.setName("mark");
        this.addChild(mark);
        mark.setVisible(false);

        var lock = new LockButton(bg.getContentSize(), 'icon_iap_lock.png');
        lock.x = this.width / 2;
        lock.y = this.height / 2;
        lock.setName("lock");
        this.addChild(lock);
        lock.setVisible(false);
        lock.setClickListener(this, function () {
            uiUtil.showUnlockDialog(this.purchaseId);
        });

        this.normalOpacity = 255;
        this.pressedOpacity = 127.5;
    },
    setEnabled: function (enabled) {
        this._super(enabled);
        if (enabled) {
            this.getChildByName("bg").setOpacity(this.normalOpacity);
            this.getChildByName("normal").setOpacity(this.normalOpacity);
            this.getChildByName("lock").setVisible(false);
            if (this.purchaseId != 0) {
                this.getChildByName("info").setVisible(true);
            }
        } else {
            this.getChildByName("bg").setOpacity(this.pressedOpacity);
            this.getChildByName("normal").setOpacity(this.pressedOpacity);
            this.getChildByName("lock").setVisible(true);
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
        if (purchaseId == 108) {
            config.title.icon = "npc_1.png";
        } else if (purchaseId == 109) {
            config.title.icon = "npc_4.png";
        } else {
            config.title.icon = "icon_iap_" + purchaseId + ".png";
        }
        config.content.des = strConfig.des + "\n\n" +strConfig.effect;
        config.title.title = strConfig.name;
        config.action.btn_1.txt = stringUtil.getString(1030);
        var d = new DialogSmall(config);
        if (purchaseId != 108 && purchaseId != 109) {
            d.titleNode.getChildByName("icon").scale = 0.45;
        }
        d.show();
    }
});

var LockButton = SpriteButton.extend({
    ctor: function (size, normalName) {
        this._super(size, normalName);

        var normal = this.getChildByName("normal");
        normal.x = 30;
        normal.y = this.height - 30;
    },
    animPressed: function () {
        var normal = this.getChildByName("normal");
        normal.runAction(cc.scaleTo(0.1, 1.2));
    },
    animNormal: function () {
        var normal = this.getChildByName("normal");
        normal.runAction(cc.scaleTo(0.1, 1));
    }
});