/**
 * User: Alex
 * Date: 15/1/5
 * Time: 下午4:07
 */
var DayLayer = cc.Layer.extend({
    ctor: function (res) {
        this._super();
        this.res = res;
        if (Record.getScreenFix()) {
            this.setScale(0.9);
        }
        var self = this;
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchEnded: function (touch, event) {
            }
        }), this);
        return true;
    },

    onExit: function () {
        this._super();
    },

    onEnter: function () {
        this._super();

        var self = this;

        var bgColor = new cc.LayerColor();
        bgColor.setColor(cc.color(0, 0, 0, 200));
        bgColor.setOpacity(0);
        this.addChild(bgColor, 0);
        bgColor.setName("bgColor");

        var btnBg = new Button(cc.winSize);
        btnBg.x = cc.winSize.width / 2;
        btnBg.y = cc.winSize.height / 2;
        this.addChild(btnBg);
        btnBg.setClickListener(this, function () {
            btnBg.setEnabled(false);
            self.dismiss();
            cc.timer.resume();
        });
        btnBg.setEnabled(false);

        var electricFenceBuild = player.room.getBuild(19);
        var bgName;
        if (this.res.happened) {
            if (this.res.win) {
                //是否存在电网
                if (this.res.isFence) {
                    bgName = "day_scene_win_electric.png";
                } else if (this.res.isBomb) {
                    bgName = "day_scene_win_bomb.png";
                }else if (this.res.isOrig){
                    bgName = "day_scene_win.png";
                }
            } else {
                bgName = "day_scene_lose.png";
            }
        } else {
            bgName = "day_scene_peace.png";
        }
        var bg = autoSpriteFrameController.getSpriteFromSpriteName(bgName);
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        this.addChild(bg);
        bg.setOpacity(0);

        var label1 = new cc.LabelTTF(stringUtil.getString(1000, cc.timer.formatTime().d + 1), uiUtil.fontFamily.normal, 60);
        label1.x = bg.width / 2;
        label1.y = 922;
        bg.addChild(label1);
        label1.setOpacity(0);

        if (this.res.happened) {
            if (this.res.win || this.res.defend) {
                var label2 = new cc.LabelTTF(stringUtil.getString(1078), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_1, cc.size(bg.width - 2 * 64, 0), cc.TEXT_ALIGNMENT_CENTER);
                label2.x = bg.width / 2;
                label2.y = 624;
                bg.addChild(label2);

                label2.setOpacity(0);
            } else {
                var label3 = new cc.LabelTTF(stringUtil.getString(1079), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_1, cc.size(bg.width - 2 * 64, 0));
                label3.setAnchorPoint(0, 0);
                label3.setPosition(64, 550);
                bg.addChild(label3);
                label3.setOpacity(0);

                var label2 = new cc.LabelTTF(stringUtil.getString(1077), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_1, cc.size(bg.width - 2 * 64, 0));
                label2.anchorY = 0;
                label2.x = bg.width / 2;
                label2.y = label3.y + label3.height / 2 + 40;
                bg.addChild(label2);
                label2.setOpacity(0);

                var richText = new ItemRichText(this.res.items, bg.width - 2 * 64, 3, 0.8, null, uiUtil.fontSize.COMMON_1);
                richText.setName("richText");
                richText.setAnchorPoint(0, 1);
                richText.x = 64;
                richText.y = label3.y - label3.height / 2 - 20;
                bg.addChild(richText);
                richText.children.forEach(function (child) {
                    child.setOpacity(0);
                });
            }
        } else {
            var label2 = new cc.LabelTTF(stringUtil.getString(1223), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_1, cc.size(bg.width - 2 * 64, 0), cc.TEXT_ALIGNMENT_CENTER);
            label2.x = bg.width / 2;
            label2.y = 624;
            bg.addChild(label2);

            label2.setOpacity(0);
        }

        bgColor.runAction(cc.sequence(cc.fadeIn(1), cc.callFunc(function () {
            bg.runAction(cc.sequence(cc.fadeIn(1), cc.callFunc(function () {
                label1.runAction(cc.sequence(cc.fadeIn(1), cc.callFunc(function () {
                })));

                if (label2) {
                    label2.runAction(cc.fadeIn(1));
                }

                if (label3) {
                    label3.runAction(cc.fadeIn(1));
                }

                if (richText) {
                    richText.children.forEach(function (child) {
                        child.runAction(cc.fadeIn(1));
                    });
                }

                btnBg.setEnabled(true);
            })));
        })));
        return true;
    },

    show: function () {
        cc.director.getRunningScene().addChild(this, 101);
    },
    dismiss: function () {
        this.removeFromParent();
    }
});