var SaveFileLayer = cc.Layer.extend({
    ctor: function (mode) {
        this.cloningState = 0;
        this.renamingState = 0;
        this.blocked = 0;
        this.mode = mode;
        Record.init("record");
        this._super();
        return true;
    },

    onExit: function () {
        this._super();
    },

    onEnter: function () {
        this._super();
        if (!this.mode) {
            audioManager.playMusic(audioManager.music.ABYSS, false);
        }
        if (Record.getScreenFix() == 1) {
            this.setScale(0.83);
        }
        var x = cc.winSize.width / 2;
        var x2 = x - 250;
        var x3 = x + 230;
        var str = stringUtil.getString(6000);
        this.title = new cc.LabelTTF(str, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_1);
        this.title.x = x;
        this.title.y = cc.visibleRect.height - 50;
        this.addChild(this.title);

        var btn1 = uiUtil.createCommonBtnWhite(stringUtil.getString(1193), this, function () {
            if (this.cloningState || this.renamingState) {
                if (this.cloningState) {
                    this.cloningState = 0;
                    this.title.setString(stringUtil.getString(6000));
                    this.refreshAll();
                } else {
                    this.restoreFromRename(this.renamingState);
                }
            } else {
                cc.director.runScene(new MenuScene());
            }
        });
        btn1.setPosition(x, 60);
        this.addChild(btn1);
        btn1.setName("btn_1");

        var NODE_HEIGHT = 196;
        var heightPadding = 30;
        var index = 1;
        var y = this.title.y + 180 - (10 + index * (heightPadding + NODE_HEIGHT));

        this.slotOneTitle = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        this.slotOneTitle.setAnchorPoint(0, 1);
        this.slotOneTitle.setPosition(x2, y - 40);

        this.slotOneDesc = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        this.slotOneDesc.setAnchorPoint(0, 1);
        this.slotOneDesc.setPosition(x2, y - 90);
        
        this.addChild(this.slotOneTitle);
        this.addChild(this.slotOneDesc);

        this.slotOne = new SpriteButton(cc.size(560, 158), "#save_slot.png");
        this.slotOne.setClickListener(this, function () {this.onClickSaveFile(1)});
        this.slotOne.setPosition(x, y - 100);
        this.addChild(this.slotOne);

        this.slotOneRenameButton = new SpriteButton(cc.size(44, 44), "icon_iap_info.png");
        this.slotOneRenameButton.setClickListener(this, function () {this.onClickRenameSaveFile(1)});
        this.slotOneRenameButton.setPosition(x3, y - 50);
        this.addChild(this.slotOneRenameButton);

        this.slotOneCloneButton = new SpriteButton(cc.size(44, 44), "icon_save_copy.png");
        this.slotOneCloneButton.setClickListener(this, function () {this.onClickCloneSaveFile(1)});
        this.slotOneCloneButton.setPosition(x3, y - 100);
        this.addChild(this.slotOneCloneButton);

        this.slotOneDeleteButton = new SpriteButton(cc.size(44, 44), "icon_save_delete.png");
        this.slotOneDeleteButton.setClickListener(this, function () {this.onClickDeleteSaveFile(1)});
        this.slotOneDeleteButton.setPosition(x3, y - 150);
        this.addChild(this.slotOneDeleteButton);

        this.refreshData(1);

        index = 2;
        y = this.title.y + 180 - (10 + index * (heightPadding + NODE_HEIGHT));

        this.slotTwoTitle = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        this.slotTwoTitle.setAnchorPoint(0, 1);
        this.slotTwoTitle.setPosition(x2, y - 40);

        this.slotTwoDesc = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        this.slotTwoDesc.setAnchorPoint(0, 1);
        this.slotTwoDesc.setPosition(x2, y - 90);
        
        this.addChild(this.slotTwoTitle);
        this.addChild(this.slotTwoDesc);

        this.slotTwo = new SpriteButton(cc.size(560, 158), "#save_slot.png");
        this.slotTwo.setClickListener(this, function () {this.onClickSaveFile(2)});
        this.slotTwo.setPosition(x, y - 100);
        this.addChild(this.slotTwo);

        this.slotTwoRenameButton = new SpriteButton(cc.size(44, 44), "icon_iap_info.png");
        this.slotTwoRenameButton.setClickListener(this, function () {this.onClickRenameSaveFile(2)});
        this.slotTwoRenameButton.setPosition(x3, y - 50);
        this.addChild(this.slotTwoRenameButton);

        this.slotTwoCloneButton = new SpriteButton(cc.size(44, 44), "icon_save_copy.png");
        this.slotTwoCloneButton.setClickListener(this, function () {this.onClickCloneSaveFile(2)});
        this.slotTwoCloneButton.setPosition(x3, y - 100);
        this.addChild(this.slotTwoCloneButton);

        this.slotTwoDeleteButton = new SpriteButton(cc.size(44, 44), "icon_save_delete.png");
        this.slotTwoDeleteButton.setClickListener(this, function () {this.onClickDeleteSaveFile(2)});
        this.slotTwoDeleteButton.setPosition(x3, y - 150);
        this.addChild(this.slotTwoDeleteButton);

        this.refreshData(2);

        index = 3;
        y = this.title.y + 180 - (10 + index * (heightPadding + NODE_HEIGHT));

        this.slotThrTitle = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        this.slotThrTitle.setAnchorPoint(0, 1);
        this.slotThrTitle.setPosition(x2, y - 40);

        this.slotThrDesc = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        this.slotThrDesc.setAnchorPoint(0, 1);
        this.slotThrDesc.setPosition(x2, y - 90);
        
        this.addChild(this.slotThrTitle);
        this.addChild(this.slotThrDesc);

        this.slotThr = new SpriteButton(cc.size(560, 158), "#save_slot.png");
        this.slotThr.setClickListener(this, function () {this.onClickSaveFile(3)});
        this.slotThr.setPosition(x, y - 100);
        this.addChild(this.slotThr);

        this.slotThrRenameButton = new SpriteButton(cc.size(44, 44), "icon_iap_info.png");
        this.slotThrRenameButton.setClickListener(this, function () {this.onClickRenameSaveFile(3)});
        this.slotThrRenameButton.setPosition(x3, y - 50);
        this.addChild(this.slotThrRenameButton);

        this.slotThrCloneButton = new SpriteButton(cc.size(44, 44), "icon_save_copy.png");
        this.slotThrCloneButton.setClickListener(this, function () {this.onClickCloneSaveFile(3)});
        this.slotThrCloneButton.setPosition(x3, y - 100);
        this.addChild(this.slotThrCloneButton);

        this.slotThrDeleteButton = new SpriteButton(cc.size(44, 44), "icon_save_delete.png");
        this.slotThrDeleteButton.setClickListener(this, function () {this.onClickDeleteSaveFile(3)});
        this.slotThrDeleteButton.setPosition(x3, y - 150);
        this.addChild(this.slotThrDeleteButton);

        this.refreshData(3);

        index = 4;
        y = this.title.y + 180 - (10 + index * (heightPadding + NODE_HEIGHT));

        this.slotFurTitle = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        this.slotFurTitle.setAnchorPoint(0, 1);
        this.slotFurTitle.setPosition(x2, y - 40);

        this.slotFurDesc = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        this.slotFurDesc.setAnchorPoint(0, 1);
        this.slotFurDesc.setPosition(x2, y - 90);
        
        this.addChild(this.slotFurTitle);
        this.addChild(this.slotFurDesc);

        this.slotFur = new SpriteButton(cc.size(560, 158), "#save_slot.png");
        this.slotFur.setClickListener(this, function () {this.onClickSaveFile(4)});
        this.slotFur.setPosition(x, y - 100);
        this.addChild(this.slotFur);

        this.slotFurRenameButton = new SpriteButton(cc.size(44, 44), "icon_iap_info.png");
        this.slotFurRenameButton.setClickListener(this, function () {this.onClickRenameSaveFile(4)});
        this.slotFurRenameButton.setPosition(x3, y - 50);
        this.addChild(this.slotFurRenameButton);

        this.slotFurCloneButton = new SpriteButton(cc.size(44, 44), "icon_save_copy.png");
        this.slotFurCloneButton.setClickListener(this, function () {this.onClickCloneSaveFile(4)});
        this.slotFurCloneButton.setPosition(x3, y - 100);
        this.addChild(this.slotFurCloneButton);

        this.slotFurDeleteButton = new SpriteButton(cc.size(44, 44), "icon_save_delete.png");
        this.slotFurDeleteButton.setClickListener(this, function () {this.onClickDeleteSaveFile(4)});
        this.slotFurDeleteButton.setPosition(x3, y - 150);
        this.addChild(this.slotFurDeleteButton);

        this.refreshData(4);
    },
    setButtonState: function (num, state) {
        if (num == 1) {
            this.slotOneDeleteButton.setVisible(state);
            this.slotOneCloneButton.setVisible(state);
            this.slotOneRenameButton.setVisible(state);   
        } else if (num == 2) {
            this.slotTwoDeleteButton.setVisible(state);
            this.slotTwoCloneButton.setVisible(state);
            this.slotTwoRenameButton.setVisible(state);
        } else if (num == 3) {
            this.slotThrDeleteButton.setVisible(state);
            this.slotThrCloneButton.setVisible(state);
            this.slotThrRenameButton.setVisible(state);
        } else {
            this.slotFurDeleteButton.setVisible(state);
            this.slotFurCloneButton.setVisible(state);
            this.slotFurRenameButton.setVisible(state);
        }
    },
    refreshData: function (num) {
        var saveMeta = this.getMetaStr(num);
        var state = true;
        if (saveMeta[1] == "" || this.cloningState || this.renamingState) {
            state = false;
        }
        this.setButtonState(num, state);
        if (num == 1) {
            this.slotOneTitle.setString(saveMeta[0]);
            this.slotOneDesc.setString(saveMeta[1]); 
        } else if (num == 2) {
            this.slotTwoTitle.setString(saveMeta[0]);
            this.slotTwoDesc.setString(saveMeta[1]);
        } else if (num == 3) {
            this.slotThrTitle.setString(saveMeta[0]);
            this.slotThrDesc.setString(saveMeta[1]);
        } else {
            this.slotFurTitle.setString(saveMeta[0]);
            this.slotFurDesc.setString(saveMeta[1]);
        }
    },
    getTimeStr: function (num) {
        var d = Math.floor(num / (24 * 60 * 60));
        var dTime = num % (24 * 60 * 60);
        var d = Math.floor(num / (24 * 60 * 60));
        var dTime = num % (24 * 60 * 60);
        var h = Math.floor(dTime / (60 * 60));
        var hTime = dTime % (60 * 60);
        var m = Math.floor(hTime / 60);
        var filler = "";
        var filler2 = "";
        if (h < 10) {
            filler = "0";
        }
        if (m < 10) {
            filler2 = "0";
        }
        var format = "Day " + d + ", " + filler + h + ":" + filler2 + m;
        return format;
    },
    getMetaStr: function (num) {
        var saveMeta = Record.restore("player" + num) || {};
        var saveName = "";
        var saveMetaStr = "";
        var additional = "";
        if (!saveMeta.saveName) {
            saveName = stringUtil.getString(6001);
            if (!this.cloningState && !this.renamingState) {
                saveName += stringUtil.getString(6013);
            }
        } else {
            saveName = saveMeta.saveName;
            var timeMeta = Record.restore("time" + num);
            var talentMeta = JSON.parse(cc.sys.localStorage.getItem("chosenTalent" + num) || "[]").length || 0;
            if (saveMeta.cloned) {
                additional += stringUtil.getString(6003);
            }
            saveMetaStr = stringUtil.getString(6002, this.getTimeStr(timeMeta.time), talentMeta, saveMeta.currency, additional);
            if (!this.cloningState && !this.renamingState) {
                saveMetaStr += stringUtil.getString(6014);
            }
        }
        return [saveName, saveMetaStr];
    },
    refreshAll: function () {
        for (var i = 1; i < 5; i++) {
            this.refreshData(i);
        }
    },
    onClickSaveFile: function (num) {
        var metaStr = this.getMetaStr(num);
        if (this.cloningState) {
            if (metaStr[1] == "") {
                if (this.blocked) {
                    return;
                }
                this.blocked = true;
                var config = {
                    title: {title: ""},
                    content: {des: stringUtil.getString(6004, this.cloningState, num)},
                    action: {btn_1: {txt: stringUtil.getString(1193)}, btn_2: {txt: stringUtil.getString(1030)}}
                };
                var self = this;
                config.action.btn_1.cb = function () {
                    self.blocked = false;
                },
                config.action.btn_2.cb = function () {
                    if (self.cloningState) {
                        var cloneState = self.cloningState;
                        self.cloningState = 0;
                        var chosenTalent = cc.sys.localStorage.getItem("chosenTalent" + cloneState) || "[]";
                        var radio = cc.sys.localStorage.getItem("radio" + cloneState) || "[]";
                        var medalTemp = cc.sys.localStorage.getItem("medalTemp" + cloneState) || "[]";
                        var ad = cc.sys.localStorage.getItem("ad" + cloneState) || "0";
                        var weather = cc.sys.localStorage.getItem("weather" + cloneState) || "0";
                        var player = Record.restore("player" + cloneState);
                        var time = Record.restore("time" + cloneState);
                        var navigation = Record.restore("navigation" + cloneState);
    
                        player.saveName += stringUtil.getString(6005);
                        player.saveName = player.saveName.substring(0, 24);
                        player.cloned = true;
    
                        cc.sys.localStorage.setItem("chosenTalent" + num, chosenTalent);
                        cc.sys.localStorage.setItem("radio" + num, radio);
                        cc.sys.localStorage.setItem("medalTemp" + num, medalTemp);
                        cc.sys.localStorage.setItem("ad" + num, ad.toString());
                        cc.sys.localStorage.setItem("weather" + num, weather.toString());
    
                        Record.init("record");
                        Record.save("player" + num, player);
                        Record.save("time" + num, time);
                        Record.save("navigation" + num, navigation);

                        self.title.setString(stringUtil.getString(6000));
                        self.refreshAll();
                        self.blocked = false;
                    }
                }
                var toast = new DialogTiny(config);
                toast.show();
            } else {
                var config = {
                    title: {title: ""},
                    content: {des: stringUtil.getString(6006)},
                    action: {btn_1: {txt: stringUtil.getString(1193)}}
                };
                var toast = new DialogTiny(config);
                toast.show();
            }
        } else {
            if (this.blocked) {
                return;
            }
            this.blocked = true;
            if (metaStr[1] == "") {
                game.newGame(num);
            } else {
                utils.SAVE_SLOT = num;
                game.init();
                game.start();
                cc.director.runScene(new MainScene());
            }
        }
    },
    onClickRenameSaveFile: function (num) {
        if (this.blocked) {
            return;
        }
        this.blocked = true;
        this.renamingState = num;
        this.title.setString(stringUtil.getString(6016));
        this.refreshAll();
        this.setTitleVisible(num, false);
        var coords = [0, 975, 750, 525, 300];
        this.editText = new cc.EditBox(cc.size(343, 40), autoSpriteFrameController.getScale9Sprite("edit_text_bg.png", cc.rect(4, 4, 1, 1)));
        var self = this;
        this.editText.setDelegate({
            editBoxReturn: function (editBox) {
                var str = editBox.getString();
                var reg = str.match(/[,|]/g);
                if (reg) {
                    uiUtil.showTinyInfoDialog(1234);
                    editBox.setString("");
                } else {
                    var realStr = utils.getStringOfLength(str, 36);
                    var index = self.editText.getName();
                    if (realStr == "") {
                        realStr = stringUtil.getString(6007);
                    }
                    var saveMeta = Record.restore("player" + index);
                    saveMeta.saveName = realStr;
                    Record.save("player" + index, saveMeta);
                    self.restoreFromRename(self.renamingState);
                }
            }
        });
        this.editText.anchorX = 0;
        this.editText.x = (cc.winSize.width / 2) - 250;
        this.editText.y = coords[num];
        this.addChild(this.editText);

        this.editText.setName(num.toString());
        this.editText.setReturnType(cc.KEYBOARD_RETURNTYPE_SEND);
        this.editText.setPlaceHolder(stringUtil.getString(6008));
    },
    restoreFromRename: function (index) {
        this.editText.setVisible(false);
        this.blocked = false;
        this.renamingState = 0;
        this.title.setString(stringUtil.getString(6000));
        this.refreshAll();
        this.setTitleVisible(index, true);
    },
    setTitleVisible: function (index, state) {
        if (index == 1) {
            this.slotOneTitle.setVisible(state);
        } else if (index == 2) {
            this.slotTwoTitle.setVisible(state);
        } else if (index == 3) {
            this.slotThrTitle.setVisible(state);
        } else {
            this.slotFurTitle.setVisible(state);
        }
    },
    onClickDeleteSaveFile: function (num) {
        if (this.blocked) {
            return;
        }
        this.blocked = true;
        var saveMeta = this.getMetaStr(num);
        var self = this;
        uiUtil.showNewGameDialog(num, saveMeta, function () {
            self.blocked = false;
        }, function () {
            game.deleteData(num);
            self.refreshData(num);
            self.blocked = false;
        });
    },
    onClickCloneSaveFile: function (num) {
        if (this.blocked) {
            return;
        }
        this.blocked = true;
        var saveMeta = this.getMetaStr(num);
        var config = {
            title: {title: stringUtil.getString(6009), icon: "copied_save.png"},
            content: {des: stringUtil.getString(6010, num, saveMeta[0])},
            action: {btn_1: {txt: stringUtil.getString(1193)}, btn_2: {txt: stringUtil.getString(1143)}}
        };
        var self = this;
        config.action.btn_1.cb = function () {
            self.blocked = false;
        }
        config.action.btn_2.cb = function () {
            self.cloningState = num;
            self.title.setString(stringUtil.getString(6011));
            self.refreshAll();
            self.blocked = false;
        }
        config.title.icon = "copied_save.png";
        var toast = new DialogBig(config);
        toast.autoDismiss = false;
        toast.show();
    },
});


var saveFileScene = BaseScene.extend({
    ctor: function (mode) {
        this._super(APP_NAVIGATION.GAME);
        var layer = new SaveFileLayer(mode);
        this.addChild(layer);
    },
    onEnter: function () {
        this._super();
    },
    onExit: function () {
        this._super();
    }
});