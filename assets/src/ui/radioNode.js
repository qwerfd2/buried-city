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
        var dat = cc.sys.localStorage.getItem("radio") || "[]";
        dat = JSON.parse(dat);
        for (var i = dat.length - 1; i > -1; i--) {
            this.addMsg(dat[i], false);
        }
    },

    addMsg: function (msg, flag) {
        this.msgView.addLog(msg);
        if (msg.uid == Record.getUUID() && flag) {
            var log = cc.sys.localStorage.getItem("radio") || "[]";
            log = JSON.parse(log);
            log.unshift(msg);
            if (log.length > 30){
                log.pop();
            }
            cc.sys.localStorage.setItem("radio", JSON.stringify(log));
        }
    },

    createTableView: function () {
        this.msgView = new MessageView(cc.size(this.bg.width - 14, this.sectionView.y - this.sectionView.height - 60));
        this.msgView.setPosition(7, 60);
        this.bg.addChild(this.msgView, 1);
        this.msgView.setName("msgView");
        var self = this;
        var editText = new cc.EditBox(cc.size(this.bg.width - 30, 45), autoSpriteFrameController.getScale9Sprite("edit_text_bg.png", cc.rect(4, 4, 1, 1)));
        editText.setDelegate({
            editBoxReturn: function (editBox) {
                var str = editBox.getString();
                if (str) {
                    self.sendMsg(str);
                    editBox.setString("");
                }
            }
        });
        editText.x = this.bg.width / 2;
        editText.y = 35;
        this.bg.addChild(editText);
        editText.setName("editText");
        editText.setReturnType(cc.KEYBOARD_RETURNTYPE_SEND);
        editText.setPlaceHolder(stringUtil.getString(1148));
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
        var msgData = {
            uid: Record.getUUID(),
            msg: msg,
            time: Math.round(cc.timer.time)
        };
        this.addMsg(msgData, true);      
        if (!IAPPackage.isAllIAPUnlocked()) {
            return;
        } 
        var prefix = msg.substring(0, msg.indexOf(' '));
        var lists = ["language","achievement","chosenTalent","medal","medalTemp","uuid","username","lastScore","type","radio","ad","assetPath","music","sound","dataLog","screenfix","cheat","curMusic"];
        if (msg == "help"){
            msgData.msg = "Welcome to the Cheat Terminal.\n\nCommand:\nobtain 'name' int: Obtain the item given name, amount.\nobtain everything int: Obtain everything given amount.\nheal: Heal the player on all aspect.\nkill: kill the player.\nget 'record_name': Get the record content.\nset 'record_name' 'content': Set the record content.\neval code: eval some code.\n\nAll records: " + JSON.stringify(lists);
        } else if (prefix == "get"){
            var field = msg.substring(msg.indexOf(' ') + 1);
            if (lists.indexOf(field) == -1){
                msgData.msg = "Record name: '" + field + "' does not exist.";
            } else {
                msgData.msg = cc.sys.localStorage.getItem(field);
            }
        } else if (prefix == "set"){
            var field = msg.substring(msg.indexOf(' ') + 1);
            var recName = field.substring(0, field.indexOf(' '));
            var content = field.substring(field.indexOf(' ') + 1);
            if (content == null || content == undefined) {
                msgData.msg = "Content null or undefined";
            } else {
                if (lists.indexOf(recName)  == -1){
                    msgData.msg = "Record name: '" + recName + "' does not exist."+ content;
                } else {
                    cc.sys.localStorage.setItem(recName, content);
                    msgData.msg = "Write success. Hope the game doesn't crash...";
                }
            }
        } else if (prefix == "obtain") {
            var field = msg.substring(msg.indexOf(' ') + 1);
            var itemName = field.substring(0, field.indexOf(' '));
            var amount = Number(field.substring(field.indexOf(' ') + 1));
            var found = false;
            if (amount == NaN || amount == null || amount == 0) {
                msgData.msg = "Item number not a number or is 0.";
            } else {
                if (itemName == "everything") {
                    found = true;
                    player.onCurrencyChange(amount);
                    for (var itemId in itemConfig) {
                        itemId = Number(itemId);
                        player.storage.increaseItem(itemId, amount);
                    }
                } else {
                    if (itemName == stringUtil.getString(13).title) {
                        player.onCurrencyChange(amount);
                        found = true;
                    } else {
                        for (var itemId in itemConfig) {
                            itemId = Number(itemId);
                            var testItemName = stringUtil.getString(itemId).title;
                            if (itemName == testItemName) {
                                player.storage.increaseItem(itemId, amount);
                                found = true;   
                                break;
                            }    
                        }
                    }
                }
                if (!found) {
                    msgData.msg = "Item name is not found. Please check the name.";
                } else {
                    msgData.msg = "Item added. Enjoy...";
                }
            }
        } else if (prefix == "eval") {
            var field = msg.substring(msg.indexOf(' ') + 1);
            if (field == undefined || field == null) {
                msgData.msg = "Evaled content cannot be null.";
            } else {
                eval(field);
                msgData.msg = "Eval success.";
            }
        } else {
            if (msg == "heal") {
                player.changeSpirit(player.spiritMax);
                player.changeVigour(player.vigourMax);
                player.changeStarve(player.starveMax);
                player.changeInfect(-player.infectMax);
                player.changeInjury(-player.injuryMax);
                player.changeHp(player.hpMax);
                msgData.msg = "You are healed. Welcome.";
            } else if (msg == "kill") {
                player.die();
                msgData.msg = "Bye";
            } else {
                msgData.msg = "In case you don't know, the server for this game is dead, and Radio is no longer functional. But hey, feel free to try out the embedded Cheat Terminal! Just type 'help'.";
            }
        } 
        msgData.uid = utils.getRandomInt(1, 9999999);
        this.addMsg(msgData, false);
    }
});