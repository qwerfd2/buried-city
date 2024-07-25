var IS_IN_DOG_NODE = false;
var DogNode = BottomFrameNode.extend({
    ctor: function (userData) {
        this._super(userData);
    },
    _init: function () {
        IS_IN_DOG_NODE = true;
        this.setName(Navigation.nodeName.DOG_NODE);
        this.uiConfig = {
            title: player.getDogName(),
            leftBtn: true,
            rightBtn: false
        };
        var leftEdge = 40;
        var rightEdge = this.bgRect.width - leftEdge;

        this.title.anchorX = 0;
        this.title.anchorY = 1;
        this.title.x = this.leftBtn.x + this.leftBtn.width / 2 + 10;
        this.title.y = this.bgRect.height - 5;
        
        this.renameBtn = new SpriteButton(cc.size(44, 44), "icon_iap_info.png");
        var self = this;
        this.renameBtn.setClickListener(this, function () {
            self.renameBtn.setVisible(false);
            editText = new cc.EditBox(cc.size(343, 46), autoSpriteFrameController.getScale9Sprite("edit_text_bg.png", cc.rect(4, 4, 1, 1)));
            editText.setDelegate({
                editBoxReturn: function (editBox) {
                    var str = editBox.getString();
                    var reg = str.match(/[,|]/g);
                    if (reg) {
                        uiUtil.showTinyInfoDialog(1234);
                        editBox.setString("");
                    } else {
                        realStr = utils.getStringOfLength(str, 20);
                        editBox.setString(realStr);
                        player.dogName = realStr;
                        if (realStr == "") {
                            realStr = stringUtil.getString(1106013).title;
                        }
                        self.title.setString(realStr);
                        utils.emitter.emit("dogStateChange");
                        Record.saveAll();
                        editText.setVisible(false);
                        self.renameBtn.setVisible(true);
                    }
                }
            });
            editText.anchorX = 0;
            editText.x = leftEdge;
            editText.y = 736;
            this.bg.addChild(editText);
            editText.setName("editText");
            editText.setReturnType(cc.KEYBOARD_RETURNTYPE_SEND);
            editText.setPlaceHolder(stringUtil.getString(7003));
        });
        this.renameBtn.setPosition(this.leftBtn.x + this.leftBtn.width / 2 + 450, this.bgRect.height - 100);
        this.bg.addChild(this.renameBtn);

        var digDes = autoSpriteFrameController.getSpriteFromSpriteName("#dig_item_1106013.png");
        digDes.setAnchorPoint(0.5, 1)
        digDes.setPosition(this.bgRect.width / 2, this.contentTopLineHeight - 10);
        this.bg.addChild(digDes);
        digDes.setName("dig_des");
        
        var dogStatusStr = player.getStatStr() + "\n\n" + stringUtil.getString(7011, player.getDogName(), player.getDogName());
        
        var des = new cc.LabelTTF(dogStatusStr, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(rightEdge - leftEdge, 0));
        des.setAnchorPoint(0.5, 1);
        des.setPosition(this.bgRect.width / 2, digDes.y - digDes.height + 10);
        this.bg.addChild(des);
        des.setName("des");
        des.setColor(cc.color.WHITE);
        utils.emitter.on("dogStateChange", function () {
            if (cc.sys.isObjectValid(des)) {
                dogStatusStr = player.getStatStr() + "\n\n" + stringUtil.getString(7011, player.getDogName(), player.getDogName());
                des.setString(dogStatusStr);
            }
        });
        
        this.statLine = new cc.Node();
        this.statLine.setAnchorPoint(0, 0);
        this.statLine.setPosition(rightEdge - 150, this.title.y - 55);
        this.statLine.setContentSize(160, 50);
        this.bg.addChild(this.statLine);
        
        var btnSize2 = cc.size(this.statLine.width / 3 + 11, this.statLine.height);
        var createAttrButton = function (attr, needStatusStr, stringId, reversPercentage, warnRange) {
            var btn = new AttrButton(btnSize2, attr, "", warnRange, {scale: 0.5});
            btn.setName(attr);
            btn.setClickListener(this, function () {
                showAttrStatusDialog(stringId, attr);
            });
            utils.emitter.on(attr + "_change", function (value) {
                btn.updateAttrBtn();
            });
            btn.updateAttrBtn = function () {
                if (cc.sys.isObjectValid(btn)) {
                    btn.updateView(reversPercentage ? 1 - player.getAttrPercentage(attr) : player.getAttrPercentage(attr), needStatusStr ? player.getAttrStr(attr) : null);
                }
            };
            btn.updateAttrBtn();
            return btn;
        };

        var injury = createAttrButton("dogInjury", false, 17, true, new Range("[0,0.3]"));
        injury.setPosition(this.statLine.width / 10 * 1, this.statLine.height / 2);
        this.statLine.addChild(injury);
        
        var starve = createAttrButton("dogFood", false, 18, false, new Range("[0,0.3]"));
        starve.setPosition(this.statLine.width / 10 * 5, this.statLine.height / 2);
        this.statLine.addChild(starve);
        
        var spirit = createAttrButton("dogMood", false, 19, false, new Range("[0,0.3]"));
        spirit.setPosition(this.statLine.width / 10 * 9 + 0.6, this.statLine.height / 2);
        this.statLine.addChild(spirit);
    },

    onEnter: function () {
        this._super();
    },
    onExit: function () {
        IS_IN_DOG_NODE = false;
        this._super();
    },
    onClickLeftBtn: function () {
        IS_IN_DOG_NODE = false;
        this.back();
    },
    onClickRightBtn: function () {
    }
});