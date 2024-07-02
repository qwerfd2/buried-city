var SaveFileLayer = cc.Layer.extend({
    ctor: function (mode) {
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
        audioManager.playMusic(audioManager.music.ABYSS, false);
        if (Record.getScreenFix() == 1) {
            this.setScale(0.83);
        }
        var str = "Select a save file to load";
        var title = new cc.LabelTTF(str, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_1);
        title.x = cc.winSize.width / 2;
        title.y = cc.visibleRect.height - 50;
        this.addChild(title);
        var NODE_HEIGHT = 196;
        var heightPadding = 30;
        var index = 1;
        var localY = title.y + 180 - (10 + index * (heightPadding + NODE_HEIGHT));
        var saveMeta = this.getMetaStr(1);

        // Initialize information for save slot 1

        this.slotOneTitle = new cc.LabelTTF(saveMeta[0], uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        this.slotOneTitle.setAnchorPoint(0, 1);
        this.slotOneTitle.x = 80;
        this.slotOneTitle.y = localY - 40;

        var slotOneDesc = new cc.LabelTTF(saveMeta[1], uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        slotOneDesc.setAnchorPoint(0, 1);
        slotOneDesc.x = 80;
        slotOneDesc.y = localY - 90;
        
        this.addChild(this.slotOneTitle);
        this.addChild(slotOneDesc);

        this.slotOne = new SpriteButton(cc.size(560, 158), "#save_slot.png");
        this.slotOne.setClickListener(this, function () {this.onClickSaveFile(1)});
        this.slotOne.x = 330;
        this.slotOne.y = localY - 100;
        this.addChild(this.slotOne);

        this.slotOneRenameButton = new SpriteButton(cc.size(44, 44), "icon_iap_info.png");
        this.slotOneRenameButton.setClickListener(this, function () {this.onClickRenameSaveFile(1)});
        this.slotOneRenameButton.x = 560;
        this.slotOneRenameButton.y = localY - 50;
        this.addChild(this.slotOneRenameButton);

        this.slotOneCloneButton = new SpriteButton(cc.size(44, 44), "icon_save_copy.png");
        this.slotOneCloneButton.setClickListener(this, function () {this.onClickCloneSaveFile(1)});
        this.slotOneCloneButton.x = 560;
        this.slotOneCloneButton.y = localY - 100;
        this.addChild(this.slotOneCloneButton);

        this.slotOneDeleteButton = new SpriteButton(cc.size(44, 44), "icon_save_delete.png");
        this.slotOneDeleteButton.setClickListener(this, function () {this.onClickDeleteSaveFile(1)});
        this.slotOneDeleteButton.x = 560;
        this.slotOneDeleteButton.y = localY - 150;
        this.addChild(this.slotOneDeleteButton);
        
        if (saveMeta[1] == "") {
            this.slotOneDeleteButton.setVisible(false);
            this.slotOneCloneButton.setVisible(false);
            this.slotOneRenameButton.setVisible(false);
        }

        var btn1 = uiUtil.createCommonBtnWhite(stringUtil.getString(1193), this, function () {
            cc.director.runScene(new MenuScene());
        });
        btn1.setPosition(cc.winSize.width / 2, 60);
        this.addChild(btn1);
        btn1.setName("btn_1");
        
        //save slot 2

        index = 2;
        localY = title.y + 180 - (10 + index * (heightPadding + NODE_HEIGHT));

        saveMeta = this.getMetaStr(2);

        this.slotTwoTitle = new cc.LabelTTF(saveMeta[0], uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        this.slotTwoTitle.setAnchorPoint(0, 1);
        this.slotTwoTitle.x = 80;
        this.slotTwoTitle.y = localY - 40;

        var slotTwoDesc = new cc.LabelTTF(saveMeta[1], uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        slotTwoDesc.setAnchorPoint(0, 1);
        slotTwoDesc.x = 80;
        slotTwoDesc.y = localY - 90;
        
        this.addChild(this.slotTwoTitle);
        this.addChild(slotTwoDesc);

        this.slotTwo = new SpriteButton(cc.size(560, 158), "#save_slot.png");
        this.slotTwo.setClickListener(this, function () {this.onClickSaveFile(2)});
        this.slotTwo.x = 330;
        this.slotTwo.y = localY - 100;
        this.addChild(this.slotTwo);

        this.slotTwoRenameButton = new SpriteButton(cc.size(44, 44), "icon_iap_info.png");
        this.slotTwoRenameButton.setClickListener(this, function () {this.onClickRenameSaveFile(2)});
        this.slotTwoRenameButton.x = 560;
        this.slotTwoRenameButton.y = localY - 50;
        this.addChild(this.slotTwoRenameButton);

        this.slotTwoCloneButton = new SpriteButton(cc.size(44, 44), "icon_save_copy.png");
        this.slotTwoCloneButton.setClickListener(this, function () {this.onClickCloneSaveFile(2)});
        this.slotTwoCloneButton.x = 560;
        this.slotTwoCloneButton.y = localY - 100;
        this.addChild(this.slotTwoCloneButton);

        this.slotTwoDeleteButton = new SpriteButton(cc.size(44, 44), "icon_save_delete.png");
        this.slotTwoDeleteButton.setClickListener(this, function () {this.onClickDeleteSaveFile(2)});
        this.slotTwoDeleteButton.x = 560;
        this.slotTwoDeleteButton.y = localY - 150;
        this.addChild(this.slotTwoDeleteButton);

        if (saveMeta[1] == "") {
            this.slotTwoDeleteButton.setVisible(false);
            this.slotTwoCloneButton.setVisible(false);
            this.slotTwoRenameButton.setVisible(false);
        }

        // slot 3

        index = 3;
        localY = title.y + 180 - (10 + index * (heightPadding + NODE_HEIGHT));

        saveMeta = this.getMetaStr(3);

        this.slotThrTitle = new cc.LabelTTF(saveMeta[0], uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        this.slotThrTitle.setAnchorPoint(0, 1);
        this.slotThrTitle.x = 80;
        this.slotThrTitle.y = localY - 40;

        var slotThrDesc = new cc.LabelTTF(saveMeta[1], uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        slotThrDesc.setAnchorPoint(0, 1);
        slotThrDesc.x = 80;
        slotThrDesc.y = localY - 90;
        
        this.addChild(this.slotThrTitle);
        this.addChild(slotThrDesc);

        this.slotThr = new SpriteButton(cc.size(560, 158), "#save_slot.png");
        this.slotThr.setClickListener(this, function () {this.onClickSaveFile(3)});
        this.slotThr.x = 330;
        this.slotThr.y = localY - 100;
        this.addChild(this.slotThr);

        this.slotThrRenameButton = new SpriteButton(cc.size(44, 44), "icon_iap_info.png");
        this.slotThrRenameButton.setClickListener(this, function () {this.onClickRenameSaveFile(3)});
        this.slotThrRenameButton.x = 560;
        this.slotThrRenameButton.y = localY - 50;
        this.addChild(this.slotThrRenameButton);

        this.slotThrCloneButton = new SpriteButton(cc.size(44, 44), "icon_save_copy.png");
        this.slotThrCloneButton.setClickListener(this, function () {this.onClickCloneSaveFile(3)});
        this.slotThrCloneButton.x = 560;
        this.slotThrCloneButton.y = localY - 100;
        this.addChild(this.slotThrCloneButton);

        this.slotThrDeleteButton = new SpriteButton(cc.size(44, 44), "icon_save_delete.png");
        this.slotThrDeleteButton.setClickListener(this, function () {this.onClickDeleteSaveFile(3)});
        this.slotThrDeleteButton.x = 560;
        this.slotThrDeleteButton.y = localY - 150;
        this.addChild(this.slotThrDeleteButton);

        if (saveMeta[1] == "") {
            this.slotThrDeleteButton.setVisible(false);
            this.slotThrCloneButton.setVisible(false);
            this.slotThrRenameButton.setVisible(false);
        }

        // slot 4

        index = 4;
        localY = title.y + 180 - (10 + index * (heightPadding + NODE_HEIGHT));

        saveMeta = this.getMetaStr(4);

        this.slotFurTitle = new cc.LabelTTF(saveMeta[0], uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        this.slotFurTitle.setAnchorPoint(0, 1);
        this.slotFurTitle.x = 80;
        this.slotFurTitle.y = localY - 40;

        var slotFurDesc = new cc.LabelTTF(saveMeta[1], uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        slotFurDesc.setAnchorPoint(0, 1);
        slotFurDesc.x = 80;
        slotFurDesc.y = localY - 90;
        
        this.addChild(this.slotFurTitle);
        this.addChild(slotFurDesc);

        this.slotFur = new SpriteButton(cc.size(560, 158), "#save_slot.png");
        this.slotFur.setClickListener(this, function () {this.onClickSaveFile(4)});
        this.slotFur.x = 330;
        this.slotFur.y = localY - 100;
        this.addChild(this.slotFur);

        this.slotFurRenameButton = new SpriteButton(cc.size(44, 44), "icon_iap_info.png");
        this.slotFurRenameButton.setClickListener(this, function () {this.onClickRenameSaveFile(4)});
        this.slotFurRenameButton.x = 560;
        this.slotFurRenameButton.y = localY - 50;
        this.addChild(this.slotFurRenameButton);

        this.slotFurCloneButton = new SpriteButton(cc.size(44, 44), "icon_save_copy.png");
        this.slotFurCloneButton.setClickListener(this, function () {this.onClickCloneSaveFile(4)});
        this.slotFurCloneButton.x = 560;
        this.slotFurCloneButton.y = localY - 100;
        this.addChild(this.slotFurCloneButton);

        this.slotFurDeleteButton = new SpriteButton(cc.size(44, 44), "icon_save_delete.png");
        this.slotFurDeleteButton.setClickListener(this, function () {this.onClickDeleteSaveFile(4)});
        this.slotFurDeleteButton.x = 560;
        this.slotFurDeleteButton.y = localY - 150;
        this.addChild(this.slotFurDeleteButton);

        if (saveMeta[1] == "") {
            this.slotFurDeleteButton.setVisible(false);
            this.slotFurCloneButton.setVisible(false);
            this.slotFurRenameButton.setVisible(false);
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
        if (!saveMeta.saveName) {
            saveName = "EMPTY SLOT";
        } else {
            saveName = saveMeta.saveName;
            var timeMeta = Record.restore("time" + num);
            var storage = new Storage('');
            storage.restore(saveMeta.storage);
            var talentMeta = JSON.parse(cc.sys.localStorage.getItem("chosenTalent" + num) || "[]").length || 0;
            saveMetaStr = this.getTimeStr(timeMeta.time) + ", " + talentMeta + " talent(s), " + storage.getAllItemNum() + " items\nClick to Start";
        }
        return [saveName, saveMetaStr];
    },
    onClickSaveFile: function (num) {
        utils.SAVE_SLOT = num;
        var metaStr = this.getMetaStr(num)
        if (metaStr[1] == "") {
            // empty save file, start new
            game.newGame();
        } else {
            //load existing
            game.init();
            game.start();
            cc.director.runScene(new MainScene());
        }
    },
    onClickRenameSaveFile: function (num) {
        if (num == 1) {
            this.slotOneRenameButton.setVisible(false);
            this.slotOneTitle.setVisible(false);
        } else if (num == 2) {
            this.slotTwoRenameButton.setVisible(false);
            this.slotTwoTitle.setVisible(false);
        } else if (num == 3) {
            this.slotThrRenameButton.setVisible(false);
            this.slotThrTitle.setVisible(false);
        } else {
            this.slotFurRenameButton.setVisible(false);
            this.slotFurTitle.setVisible(false);
        }
        var coords = [0, 975, 775, 575, 375];
        editText = new cc.EditBox(cc.size(343, 46), autoSpriteFrameController.getScale9Sprite("edit_text_bg.png", cc.rect(4, 4, 1, 1)));
        var self = this;
        editText.setDelegate({
            editBoxReturn: function (editBox) {
                var str = editBox.getString();
                var reg = str.match(/[,|]/g);
                if (reg) {
                    uiUtil.showTinyInfoDialog(1234);
                    editBox.setString("");
                } else {
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
                    var index = editText.getName();
                    if (realStr == "") {
                        realStr = "Save File";
                    }
                    var saveMeta = Record.restore("player" + index);
                    saveMeta.saveName = realStr;
                    Record.save("player" + index, saveMeta);
                    editText.setVisible(false);
                    if (index == 1) {
                        self.slotOneRenameButton.setVisible(true);
                        self.slotOneTitle.setString(realStr);
                        self.slotOneTitle.setVisible(true);
                    } else if (index == 2) {
                        self.slotTwoRenameButton.setVisible(true);
                        self.slotTwoTitle.setString(realStr);
                        self.slotTwoTitle.setVisible(true);
                    } else if (index == 3) {
                        self.slotThrRenameButton.setVisible(true);
                        self.slotThrTitle.setString(realStr);
                        self.slotThrTitle.setVisible(true);
                    } else {
                        self.slotFurRenameButton.setVisible(true);
                        self.slotFurTitle.setString(realStr);
                        self.slotFurTitle.setVisible(true);
                    }
                }
            }
        });
        editText.anchorX = 0;
        editText.x = 100;
        editText.y = coords[num];
        this.addChild(editText);
        editText.setName(num.toString());
        editText.setReturnType(cc.KEYBOARD_RETURNTYPE_SEND);
        editText.setPlaceHolder("Save file name");
    },
    onClickDeleteSaveFile: function (num) {
        var saveMeta = this.getMetaStr(num);
        uiUtil.showNewGameDialog(num, saveMeta, function () {
            game.deleteData(num);
            //refresh needed
        });
    },
    onClickCloneSaveFile: function (num) {

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