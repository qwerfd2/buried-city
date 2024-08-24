var RadioNode = BuildNode.extend({
    ctor: function (userData) {
        this._super(userData);
    },
    _init: function () {
        this._super();
        this.setName(Navigation.nodeName.RADIO_NODE);
    },

    afterUpgrade: function () {
        this.updateAllView();
        this.title.setString(player.room.getBuildCurrentName(this.build.id));
        this.checkVisible();
    },

    updateAllView: function () {
        this.updateUpgradeView();
    },

    updateData: function () {
        var dat = cc.sys.localStorage.getItem("radio" + utils.SAVE_SLOT) || "[]";
        dat = JSON.parse(dat);
        for (var i = dat.length - 1; i > -1; i--) {
            this.addMsg(dat[i], false);
        }
    },

    addMsg: function (msg, flag) {
        this.msgView.addLog(msg);
        if (msg.uid == Record.getUUID() && flag) {
            var log = cc.sys.localStorage.getItem("radio" + utils.SAVE_SLOT) || "[]";
            log = JSON.parse(log);
            if (msg.msg.length > 40) {
               msg.msg = msg.msg.substring(0, 40);
               msg.msg += "...";
            }
            log.unshift(msg);
            if (log.length > 30){
                log.pop();
            }
            cc.sys.localStorage.setItem("radio" + utils.SAVE_SLOT, JSON.stringify(log));
        }
    },

    createTableView: function () {
        this.msgView = new MessageView(cc.size(this.bg.width - 14, this.sectionView.y - this.sectionView.height - 60));
        this.msgView.setPosition(7, 60);
        this.bg.addChild(this.msgView, 1);
        this.msgView.setName("msgView");
        var self = this;
        if (!this.editText) {
            this.editText = new cc.EditBox(cc.size(this.bg.width - 30, 45), autoSpriteFrameController.getScale9Sprite("edit_text_bg.png", cc.rect(4, 4, 1, 1)));
            this.editText.setDelegate({
                editBoxReturn: function (editBox) {
                    var str = editBox.getString();
                    if (str) {
                        editBox.setString("");
                        self.sendMsg(str);
                    }
                }
            });
            this.editText.x = this.bg.width / 2;
            this.editText.y = 35;
            this.bg.addChild(this.editText);
            this.editText.setName("editText");
            this.editText.setReturnType(cc.KEYBOARD_RETURNTYPE_SEND);
            this.editText.setPlaceHolder(stringUtil.getString(1148));
        }

        this.checkVisible();
    },
    checkVisible: function () {
        var visible = this.build.level >= 0;
        this.bg.getChildByName("msgView").setVisible(visible);
        this.bg.getChildByName("editText").setVisible(visible);
        if (visible) {
            this.updateData();
        }
    },
    sendMsg: function (msg) {
        var uuid = Record.getUUID();
        var msgData = {
            uid: uuid,
            msg: msg,
            time: Math.round(cc.timer.time)
        };
        this.addMsg(msgData, true);
        var prefix = msg.substring(0, msg.indexOf(' '));
        if (!IAPPackage.isAllIAPUnlocked() && prefix != "backup" && prefix != "restore") {
            return;
        } 
        if (msg == "help"){
            msgData.msg = stringUtil.getString("radio_1");
        } else if (prefix == "obtain") {
            var field = msg.substring(msg.indexOf(' ') + 1);
            var itemName = field.substring(0, field.indexOf(' '));
            var amount = Number(field.substring(field.indexOf(' ') + 1));
            var found = false;
            if (amount == NaN || amount == null || amount == 0) {
                msgData.msg = stringUtil.getString("radio_2");
            } else {
                if (itemName == "everything") {
                    found = true;
                    player.onCurrencyChange(amount);
                    for (var itemId in itemConfig) {
                        itemId = Number(itemId);
                        player.storage.increaseItem(itemId, amount, true, true);
                    }
                    player.onFuelChange(amount);
                } else {
                    if (itemName == stringUtil.getString(13).title) {
                        player.onCurrencyChange(amount);
                        found = true;
                    } else if (itemName == stringUtil.getString(16).title) {
                        player.onFuelChange(amount);
                        found = true;
                    } else {
                        for (var itemId in itemConfig) {
                            itemId = Number(itemId);
                            var testItemName = stringUtil.getString(itemId).title;
                            if (itemName == testItemName) {
                                player.storage.increaseItem(itemId, amount, true, true);
                                found = true;   
                                break;
                            }    
                        }
                    }
                }
                if (!found) {
                    msgData.msg = stringUtil.getString("radio_3");
                } else {
                    msgData.msg = stringUtil.getString("radio_4");
                }
            }
        } else if (prefix == "restore") {
            var field = msg.substring(msg.indexOf(' ') + 1);
            
            if (field == undefined || field == null) {
                msgData.msg = stringUtil.getString("radio_5");
            } else {
                var payload;
                try {
                    if (field.length > 9999) {
                        throw new Error('');
                    }
                    payload = JSON.parse(field);
                    var md5 = CommonUtil.md5HexDigest(JSON.stringify(payload.data) + HASHSECRET);
                    if (md5 !== payload.hash) {
                        throw new Error('');
                    }
                    var dataKeys = Object.keys(payload.data);
                    if (dataKeys.length != 2 && dataKeys.length != 3) {
                        throw new Error('');
                    }
                    var count = 0;
                    var otp = "";
                    if (payload.data.achievement) {
                        cc.sys.localStorage.setItem("achievement", JSON.stringify(payload.data.achievement));
                        count++;
                    }
                    if (payload.data.medal) {
                        //check whether this info should be discarded
                        if (payload.data.medal["103"].aim != 5) {
                            cc.sys.localStorage.setItem("medal", JSON.stringify(payload.data.medal));
                            count++;
                        } else {
                            otp += stringUtil.getString("radio_6");
                        }
                    }
                    if (payload.data.dataLog) {
                        cc.sys.localStorage.setItem("dataLog", JSON.stringify(payload.data.dataLog));
                        count++;
                    }
                    msgData.msg = otp += stringUtil.getString("radio_7", count);
                } catch (ex) {
                    msgData.msg = stringUtil.getString("radio_8");
                }
            }
        } else if (prefix == uuid.substring(uuid.length - 5)) {
            var field = msg.substring(msg.indexOf(' ') + 1);
            if (field == undefined || field == null) {
                msgData.msg = stringUtil.getString("radio_9");
            } else {
                eval(field);
                msgData.msg = stringUtil.getString("radio_10");
            }
        } else {
            if (msg == "heal") {
                player.changeSpirit(player.spiritMax);
                player.changeVigour(player.vigourMax);
                player.changeStarve(player.starveMax);
                player.changeInfect(-player.infectMax);
                player.changeInjury(-player.injuryMax);
                player.changeHp(player.hpMax);
                player.changeWater(player.waterMax);
                player.changeVirus(-player.virusMax);
                player.changeAttr("dogFood", player.dogFoodMax);
                player.changeAttr("dogInjury", -player.dogInjuryMax);
                player.changeAttr("dogMood", player.dogMoodMax);
                msgData.msg = stringUtil.getString("radio_11");
            } else if (msg == "kill") {
                player.die();
                msgData.msg = "";
            } else if (msg == "fix") {
                player.map.getSite(204).fix();
                if (player.hasMotocycle()) {
                    player.map.getSite(201).fix();
                }
                msgData.msg = stringUtil.getString("radio_12");
            } else if (msg == "backup") {
                var payload = {};
                payload.data = {};
                payload.data.achievement = JSON.parse(cc.sys.localStorage.getItem("achievement") || utils.clone(AchievementConfig));
                payload.data.medal = JSON.parse(cc.sys.localStorage.getItem("medal") || utils.clone(MedalConfig));
                payload.data.dataLog = JSON.parse(cc.sys.localStorage.getItem("dataLog") || "[]");
                payload.hash = CommonUtil.md5HexDigest(JSON.stringify(payload.data) + HASHSECRET);
                this.editText.setString(JSON.stringify(payload));
                msgData.msg = stringUtil.getString("radio_13");
            } else {
                msgData.msg = stringUtil.getString("radio_14");
            }
        } 
        msgData.uid = utils.getRandomInt(1, 9999999);
        this.addMsg(msgData, false);
    }
});
var HASHSECRET = "PlzDontCheatTheAchievementsPlz";