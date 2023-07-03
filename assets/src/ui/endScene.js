/**
 * User: Alex
 * Date: 15/1/5
 * Time: 下午4:07
 */

var EndLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        return true;
    },

    onExit: function () {
        this._super();
    },

    onEnter: function () {
        this._super();
        if (Record.getScreenFix()) {
            this.setScale(0.9);
        }
        var bg = autoSpriteFrameController.getSpriteFromSpriteName("#end_bg.png");
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        this.addChild(bg);
        bg.setName("bg");

        var leftEdge = 42;
        var rightEdge = bg.width - leftEdge;

        var label1 = new cc.LabelTTF(stringUtil.getString(1226), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_1);
        label1.anchorX = 0;
        label1.x = leftEdge;
        label1.y = 736;
        bg.addChild(label1);

        var labelDay = new cc.LabelTTF(cc.timer.formatTime().d || "0", uiUtil.fontFamily.normal, 110);
        labelDay.setPosition(132, 630);
        labelDay.setColor(cc.color.BLACK);
        bg.addChild(labelDay);

        var timeStrArray = cc.timer.getTimeHourStr().split(':');
        var labelHour = new cc.LabelTTF(timeStrArray[0], uiUtil.fontFamily.normal, 110);
        labelHour.setPosition(320, 630);
        labelHour.setColor(cc.color.BLACK);
        bg.addChild(labelHour);

        var labelMinute = new cc.LabelTTF(timeStrArray[1], uiUtil.fontFamily.normal, 110);
        labelMinute.setPosition(508, 630);
        labelMinute.setColor(cc.color.BLACK);
        bg.addChild(labelMinute);
        var editText = new cc.EditBox(cc.size(343, 46), autoSpriteFrameController.getScale9Sprite("edit_text_bg.png", cc.rect(4, 4, 1, 1)));
        editText.setDelegate({
            editBoxReturn: function (editBox) {
            var str = editBox.getString();
                var reg = str.match(/[,|]/g);
                if (reg) {
                    uiUtil.showTinyInfoDialog(1234);
                    editBox.setString("");
                } else {
                    if (str) {
                        var realLen = 0;
                        var realStr = "";
                        var len = 12;
                        for (var i = 0; i < str.length; i++) {
                            var charCode = str.charCodeAt(i);
                            if (charCode >= 65 && charCode <= 90)
                                realLen += 1.5;
                            else if (charCode >= 0 && charCode <= 128)
                                realLen += 1;
                            else
                                realLen += 2;
                            realStr += str[i];
                            if (realLen >= len) {
                                break;
                            }
                        }
                        editBox.setString(realStr);
                        Record.setUsername(realStr);
                    }
                }
            }
        });
        editText.anchorX = 0;
        editText.x = leftEdge;
        editText.y = 786;
        bg.addChild(editText);
        editText.setName("editText");
        editText.setReturnType(cc.KEYBOARD_RETURNTYPE_SEND);
        editText.setPlaceHolder(stringUtil.getString(1161));
        var username = Record.getUsername();
        var uid = Record.getUUID();
        uid = uid.substr(uid.length - 5);
        if (username && username != uid) {
            editText.setString(username);
        }

        var btn2 = uiUtil.createSpriteBtn({normal: "btn_home.png"}, this, function () {
            this.uploadGameData();
            game.newGame();
            cc.director.runScene(new MenuScene());
        });
        btn2.x = leftEdge + (rightEdge - leftEdge) / 4 * 2;
        btn2.y = 432;
        bg.addChild(btn2);
        btn2.setName("btn2");

        if (!CommonUtil.adStatus) {
            btn1.setVisible(true);
            btn2.x = leftEdge + (rightEdge - leftEdge) / 4 * 3;
        }

        this.newGetMedal = Medal.getCompletedForOneGame();
        if (this.newGetMedal) {
            this.showMedalGet();
        }
    },
    showMedalGet: function () {

        var self = this;

        var medal = this.newGetMedal.shift();
        if (medal) {
            var medalDialog = new medalShowDialog(medal);
            medalDialog.setPosition(0, cc.winSize.height - 250);
            medalDialog.setCascadeOpacityEnabled(true);
            medalDialog.setOpacity(0);
            medalDialog.runAction(cc.sequence(cc.fadeIn(1), cc.delayTime(2), cc.fadeOut(1), cc.callFunc(function () {
                medalDialog.removeFromParent();
                self.showMedalGet();
            })));
            this.addChild(medalDialog);
        }
    },

    uploadGameData: function () {

        var self = this;
        var data = {};
        data.username = Record.getUsername();
        data.days = cc.timer.getFinalTimeNum();
        data.time = new Date().getTime();
        data.weight = player.storage.getAllItemNum();
        data.distance = player.totalDistance;
        Record.setLastScore(data);
    }
});

var EndScene = BaseScene.extend({
    ctor: function () {
        this._super(APP_NAVIGATION.GAME);
        autoSpriteFrameController.addSpriteFrames("res/end.plist");
    },
    onEnter: function () {
        this._super();
        var layer = new EndLayer();
        this.addChild(layer);
    },
    onExit: function () {
        this._super();
    }
});