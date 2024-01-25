var GetRichTextForBullet = function (color) {
    var items = [{itemId: "1305012", txt: ">"}, {itemId: "1305011", txt: " "}];
    if (player.useGoodBullet) {
        items = [{itemId: "1305012", txt: "<"}, {itemId: "1305011", txt: " "}];
    }
    return new ItemRichText(items, 190, 2, 0.5, color, uiUtil.fontSize.COMMON_1);
};
var BattleAndWorkNode = BottomFrameNode.extend({
    ctor: function (userData) {
        this._super(userData);
        this.updateView();
        Record.saveAll();
    },
    _init: function () {
        this.site = player.map.getSite(this.userData);
        this.setName(Navigation.nodeName.BATTLE_AND_WORK_NODE);
        this.uiConfig = {
            title: this.site.getName(),
            leftBtn: true,
            rightBtn: false
        };
        this.leftEdge = 40;
        this.rightEdge = this.bgRect.width - this.leftEdge;
        this.title.anchorX = 0;
        this.title.anchorY = 1;
        this.title.x = this.leftBtn.x + this.leftBtn.width / 2 + 10;
        this.title.y = this.bgRect.height - 5;
        var txt1 = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        txt1.setAnchorPoint(0, 1);
        txt1.setPosition(this.title.x, this.actionBarBaseHeight - 4);
        this.bg.addChild(txt1);
        txt1.setName("txt1");
        var txt2 = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        txt2.setAnchorPoint(1, 1);
        txt2.setPosition(this.rightEdge + 20, this.actionBarBaseHeight - 4);
        this.bg.addChild(txt2);
        txt2.setName("txt2");
        var des = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(this.rightEdge - this.leftEdge, 0));
        des.setAnchorPoint(0.5, 1);
        this.bg.addChild(des);
        des.setName("des");
        des.setColor(cc.color.WHITE);
    },
    updateView: function () {
        var txt1 = this.bg.getChildByName("txt1");
        var txt2 = this.bg.getChildByName("txt2");
        var des = this.bg.getChildByName("des");
        if (this.site.isSiteEnd()) {
            var self = this;
            this.scheduleOnce(function () {
                self.back();
            });
        } else {
            if (this.site.isSecretRoomsEntryShowed) {
                this.title.setString(stringUtil.getString(3012)[this.site.secretRoomType]);
                des.setString(stringUtil.getString(3013)[this.site.secretRoomType]);
                this.leftBtn.setVisible(false);
                var template = stringUtil.getString(5000);
                txt1.setString(cc.formatStr(template.title.txt_1, "???"));
                txt2.setString("");
                this.createSecretRoomsEntryView();
            } else if (this.site.isInSecretRooms) {
                this.title.setString(stringUtil.getString(3012)[this.site.secretRoomType]);
                this.leftBtn.setVisible(true);
                var template = stringUtil.getString(5000);
                txt1.setString(cc.formatStr(template.title.txt_1, "???"));
                txt2.setString("");
                this.room = this.site.secretRoomBegin();
                if (this.room.type === "battle") {
                    if (player.nowSiteId == 500) {
                        des.setString(stringUtil.getString(9059)[this.room.difficulty - 1]);
                    } else {
                        des.setString(stringUtil.getString(3009)[this.room.difficulty - 1]);
                    }
                    this.createBattleBeginView();
                } else {
                    des.setString(stringUtil.getString(3008)[this.room.workType]);
                    this.createWorkBeginView();
                }
            } else {
                this.leftBtn.setVisible(true);
                var template = stringUtil.getString(5000);
                txt1.setString(cc.formatStr(template.title.txt_1, this.site.getCurrentProgressStr()));
                txt2.setString(cc.formatStr(template.title.txt_2, this.site.storage.getAllItemNum()));
                this.room = this.site.roomBegin();
                if (this.room.type === "battle") {
                    if (player.nowSiteId == 500) {
                        des.setString(stringUtil.getString(9059)[this.room.difficulty - 1]);
                    } else {
                        des.setString(stringUtil.getString(3009)[this.room.difficulty - 1]);
                    }
                    this.createBattleBeginView();
                } else {
                    if (this.userData == 666 && this.site.step == this.site.rooms.length - 1) {
                        des.setString(stringUtil.getString(8102));
                    } else {
                        des.setString(stringUtil.getString(3008)[this.room.workType]);
                    }
                    this.createWorkBeginView();
                }
            }
            if (this.inited) {
                this.afterInit();
            }
        }
    },

    afterInit: function () {
        this.inited = true;
        if (this.site.isSecretRoomsEntryShowed || this.site.isInSecretRooms) {
            if (audioManager.getPlayingMusic() !== audioManager.music.SITE_SECRET) {
                audioManager.stopMusic(audioManager.getPlayingMusic());
                audioManager.playMusic(audioManager.music.SITE_SECRET, true);
            }
        } else {
            if (audioManager.getPlayingMusic() === audioManager.music.SITE_SECRET) {
                audioManager.stopMusic(audioManager.getPlayingMusic());
                audioManager.playMusic(Navigation.getSiteMusic(), true);
            }
        }
    },

    createSecretRoomsEntryView: function () {
        var node = new cc.Node();
        node.setContentSize(this.rightEdge - this.leftEdge, 600);
        node.setAnchorPoint(0.5, 0);
        node.setPosition(this.bgRect.width / 2, 0);
        node.setName("node");
        this.bg.addChild(node);
        if (this.bg.getChildByName("dig_des")) {
            this.bg.removeChildByName("dig_des");
        }
        var digDesBg = autoSpriteFrameController.getSpriteFromSpriteName("#site_dig_secret.png");
        digDesBg.setAnchorPoint(0.5, 1);
        digDesBg.setPosition(this.bgRect.width / 2, this.contentTopLineHeight - 20);
        this.bg.addChild(digDesBg);
        digDesBg.setName("dig_des");
        var digDesMidBg = autoSpriteFrameController.getSpriteFromSpriteName("#monster_dig_mid_bg.png");
        digDesMidBg.setPosition(digDesBg.width / 2, digDesBg.height / 2);
        digDesBg.addChild(digDesMidBg);

        this.bg.getChildByName("des").setPosition(this.bgRect.width / 2, digDesBg.y - digDesBg.height - 20);

        var self = this;
        var btn1 = uiUtil.createCommonBtnWhite(stringUtil.getString(1193), this, function () {
            self.onClickLeftBtn();
            self.site.isSecretRoomsEntryShowed = false;
        });
        btn1.setPosition(node.getContentSize().width / 4, 60);
        node.addChild(btn1);
        btn1.setName("btn1");
        var btn2 = uiUtil.createCommonBtnWhite(stringUtil.getString(1204), this, function () {
            node.removeFromParent();
            self.site.enterSecretRooms();
            self.updateView();
        });
        btn2.setPosition(node.getContentSize().width / 4 * 3, 60);
        node.addChild(btn2);
        btn2.setName("btn2");
    },

    createBattleBeginView: function () {
        var node = new cc.Node();
        node.setContentSize(this.rightEdge - this.leftEdge, 600);
        node.setAnchorPoint(0.5, 0);
        node.setPosition(this.bgRect.width / 2, 0);
        node.setName("node");
        this.bg.addChild(node);
        
        if (this.bg.getChildByName("dig_des")) {
            this.bg.removeChildByName("dig_des");
        }
        var digDesBg = autoSpriteFrameController.getSpriteFromSpriteName("#npc_dig_bg.png");
        digDesBg.setAnchorPoint(0.5, 1)
        digDesBg.setPosition(this.bgRect.width / 2, this.contentTopLineHeight - 20);
        this.bg.addChild(digDesBg);
        digDesBg.setName("dig_des");

        var digDesMidBg = autoSpriteFrameController.getSpriteFromSpriteName("#monster_dig_mid_bg.png");
        digDesMidBg.setPosition(digDesBg.width / 2, digDesBg.height / 2);
        digDesBg.addChild(digDesMidBg);

        this.bg.getChildByName("des").setPosition(this.bgRect.width / 2, digDesBg.y - digDesBg.height - 20);
        var digDes;
        if (player.nowSiteId == 500) {
            digDes = autoSpriteFrameController.getSpriteFromSpriteName("#bandit_dig_" + this.room.difficulty + ".png");
        } else {
            digDes = autoSpriteFrameController.getSpriteFromSpriteName("#monster_dig_" + this.room.difficulty + ".png");
        }
        digDes.setPosition(digDesBg.width / 2, digDesBg.height / 2);
        digDesBg.addChild(digDes);

        var label1 = new cc.LabelTTF(stringUtil.getString(1041), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        label1.setAnchorPoint(0, 1);
        label1.setPosition(0, 400);
        node.addChild(label1);
        var isMelee = player.nowSiteId == 502;
        var iconList = uiUtil.createEquipedItemIconList(false, isMelee);
        iconList.setPosition(0, label1.y - label1.height - 20);
        node.addChild(iconList);
        var label2;
        if (player.nowSiteId == 500) {
            label2 = new cc.LabelTTF(stringUtil.getString(1042) + " " + (this.room.difficulty + 5), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
            label2.setAnchorPoint(0, 1);
            label2.setPosition(0, iconList.getPositionY() - iconList.getContentSize().height - 25);
            node.addChild(label2);
        } else {
            label2 = new cc.LabelTTF(stringUtil.getString(1042) + " " + this.room.difficulty, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
            label2.setAnchorPoint(0, 1);
            label2.setPosition(0, iconList.getPositionY() - iconList.getContentSize().height - 25);
            node.addChild(label2);
            if (this.room.difficulty > 2) {
                label2.setColor(cc.color.RED);
            }     
        }

        if (player.equip.getEquip(EquipmentPos.GUN) && !player.equip.isEquiped(1301091) && player.bag.getNumByItemId(BattleConfig.BULLET_ID) && player.bag.getNumByItemId(BattleConfig.HOMEMADE_ID) && player.nowSiteId != 502) {
            //if gun is equipped, and not flamethrower, and has 2 bullets in the inventory to select.
            var bulletRichText = GetRichTextForBullet(cc.color.WHITE);
            bulletRichText.setName("bulletPriority");
            bulletRichText.setPosition(0, label2.getPositionY() - label2.getContentSize().height - 130);
            node.addChild(bulletRichText);

            var exchangeButton = uiUtil.createSpriteBtn({normal: "slider_cap.png", fontInfo: {txt: "⟳", color: cc.color.BLACK, fontSize: uiUtil.fontSize.COMMON_1}}, this, function () {
                player.useGoodBullet = !player.useGoodBullet;
                var bulletRichText = GetRichTextForBullet(cc.color.WHITE);
                bulletRichText.setName("bulletPriority");
                bulletRichText.setPosition(0, label2.getPositionY() - label2.getContentSize().height - 130);
                node.removeChildByName("bulletPriority");
                node.addChild(bulletRichText);
            });
            exchangeButton.setName("exchangebutton");
            exchangeButton.setPosition(180, bulletRichText.getPositionY() + 20);
            node.addChild(exchangeButton);
        }
        if (cc.RTL) {
            label1.anchorX = 1;
            label1.x = node.width;

            iconList.x = label1.x - label1.width - 5 - iconList.width;

            label2.anchorX = 1;
            label2.x = node.width;
        }

        var currentTime = Number(cc.timer.time);
        currentTime -= player.lastAlcoholTime;

        if (!player.equip.haveWeapon()) {
            var label3 = new cc.LabelTTF(stringUtil.getString(1207), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(node.width, 0));
            label3.setAnchorPoint(0, 1);
            label3.setPosition(0, label2.getPositionY() - label2.getContentSize().height - 10);
            node.addChild(label3);
            label3.setColor(cc.color.RED);
        } else if (currentTime <= 43200) {
            currentTime = 43200 - currentTime;
            currentTime = Math.ceil(currentTime / 3600);
            currentTime = Number(2 * currentTime);
            var label3 = new cc.LabelTTF(stringUtil.getString(1325, currentTime), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(this.rightEdge - this.leftEdge, 0));
            label3.setAnchorPoint(0, 1);
            label3.setPosition(0, label2.getPositionY() - label2.getContentSize().height - 10);
            node.addChild(label3);
            label3.setColor(cc.color.RED);
        }

        if (player.isLowVigour()) {
            var label4 = new cc.LabelTTF(stringUtil.getString(1206), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(node.width, 0));
            label4.setAnchorPoint(0, 1);
            if (label3) {
                label4.setPosition(0, label3.getPositionY() - label3.getContentSize().height - 10);
            } else {
                label4.setPosition(0, label2.getPositionY() - label2.getContentSize().height - 10);
            }
            node.addChild(label4);
            label4.setColor(cc.color.RED);
        }

        var self = this;
        var btn = uiUtil.createCommonBtnWhite(stringUtil.getString(1044), this, function () {
            node.removeFromParent();
            self.createBattleProcessView();
        });
        if (userGuide.isStep(userGuide.stepName.FIGHT_SITE)) {
            uiUtil.createIconWarn(btn);
            userGuide.step();
        }
        btn.setPosition(node.getContentSize().width / 2, 60);
        node.addChild(btn);
        btn.setName("btn");
    },
    createBattleProcessView: function () {
        this.bg.getChildByName("des").setString("");

        utils.emitter.emit("left_btn_enabled", false);
        var battle = new Battle({id: 0, monsterList: this.room.list}, false, this.room.difficulty, false, false);
        var self = this;
        battle.setGameEndListener(function (sumRes) {
            utils.emitter.off("battleProcessLog");
            utils.emitter.off("battleMonsterLength");
            if (self.site.isInSecretRooms) {
                self.site.secretRoomEnd();
            } else {
                self.site.roomEnd(sumRes.win);
                self.site.testSecretRoomsBegin();
            }

            self.scheduleOnce(function () {
                utils.emitter.emit("left_btn_enabled", true);

                if (cc.sys.isObjectValid(node.getParent())) {
                    node.removeFromParent();
                }

                self.createBattleEndView(sumRes);
            }, 2);
        });
        var node = new cc.Node();
        node.setContentSize(this.rightEdge - this.leftEdge, 100);
        node.setAnchorPoint(0.5, 0);
        node.setPosition(this.bgRect.width / 2, 0);
        this.bg.addChild(node);

        for (var i = 0; i < 7; i++) {
            var label = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(node.width, 0));
            label.setAnchorPoint(0, 0);
            label.setPosition(0, i * 50 + 120);
            label.setName("log_" + i);
            node.addChild(label);
        }

        node.updateLog = function (log) {

            var logs = utils.splitLog(log.log, 55, 55);
            for (var key in logs) {
                var logInfo = {
                    log: logs[key],
                    color: log.color,
                    bigger: log.bigger
                }
                for (var i = 6; i >= 0; i--) {
                    var label = this.getChildByName("log_" + i);
                    var currentLogInfo;
                    if (i === 0) {
                        currentLogInfo = logInfo;
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
                            label.setColor(cc.color.WHITE);
                        }

                        if (currentLogInfo.bigger) {
                            label.setFontSize(uiUtil.fontSize.COMMON_2);
                        } else {
                            label.setFontSize(uiUtil.fontSize.COMMON_3);
                        }
                    }

                }
            }
        };
        utils.emitter.on("battleProcessLog", function (log) {
            node.updateLog(log);
        });

        var pbBg = autoSpriteFrameController.getSpriteFromSpriteName("#pb_bg.png");
        pbBg.setAnchorPoint(0.5, 0);
        pbBg.setPosition(node.getContentSize().width / 2, 60);
        pbBg.setName("pbBg");
        node.addChild(pbBg);

        var pb = new cc.ProgressTimer(autoSpriteFrameController.getSpriteFromSpriteName("#pb.png"));
        pb.type = cc.ProgressTimer.TYPE_BAR;
        pb.midPoint = cc.p(0, 0);
        pb.barChangeRate = cc.p(1, 0);
        pb.setPosition(pbBg.getPositionX(), pbBg.getPositionY() + pbBg.getContentSize().height / 2);
        pb.setPercentage(0);
        pb.setName("pb");
        node.addChild(pb);

        var monsterLenTotal = this.room.list.length;
        var labelNum = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        labelNum.setAnchorPoint(1, 0);
        labelNum.setPosition(pbBg.x + pbBg.width / 2, pbBg.y + pbBg.height + 5);
        labelNum.setColor(cc.color.WHITE);
        node.addChild(labelNum);
        if (player.nowSiteId == 500) {
            labelNum.setString(stringUtil.getString(9139) + cc.formatStr("%s/%s", monsterLenTotal, monsterLenTotal));
        } else {
            labelNum.setString(stringUtil.getString(1139) + cc.formatStr("%s/%s", monsterLenTotal, monsterLenTotal));
        }
        utils.emitter.on("battleMonsterLength", function (monsterLen) {
            pb.setPercentage((monsterLenTotal - monsterLen) / monsterLenTotal * 100);
            if (player.nowSiteId == 500) {
                labelNum.setString(stringUtil.getString(9139) + cc.formatStr("%s/%s", monsterLen, monsterLenTotal));
            } else {
                labelNum.setString(stringUtil.getString(1139) + cc.formatStr("%s/%s", monsterLen, monsterLenTotal));
            }
        });
    },
    createBattleEndView: function (sumRes) {
        if (player.nowSiteId == 500) {
            this.bg.getChildByName("des").setString(stringUtil.getString(9118));
        } else {
            this.bg.getChildByName("des").setString(stringUtil.getString(1118));
        }
        var node = new cc.Node();
        node.setContentSize(this.rightEdge - this.leftEdge, 600);
        node.setAnchorPoint(0.5, 0);
        node.setPosition(this.bgRect.width / 2, 0);
        this.bg.addChild(node);

        var label1 = new cc.LabelTTF(stringUtil.getString(1058), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        label1.setAnchorPoint(0, 1);
        label1.setPosition(0, 400);
        node.addChild(label1);

        var items = [];
        if (sumRes.bulletNum > 0) {
            items.push({itemId: BattleConfig.BULLET_ID, num: sumRes.bulletNum});
        }
        if (sumRes.homemadeNum > 0) {
            items.push({itemId: BattleConfig.HOMEMADE_ID, num: sumRes.homemadeNum});
        }
        if (sumRes.tools > 0) {
            items.push({
                itemId: sumRes.toolItemId,
                num: sumRes.tools
            });
        }
        if (sumRes.fuel > 0) {
            items.push({
                itemId: "gas",
                num: sumRes.fuel
            });
        }

        var richText = new ItemRichText(items, this.rightEdge - this.leftEdge - label1.width, 5, 0.5);
        richText.setName("richText")
        richText.setAnchorPoint(0, 0.5);
        richText.setPosition(label1.x + label1.width, label1.y - label1.height / 2);
        node.addChild(richText);

        var label2 = new cc.LabelTTF(stringUtil.getString(1059) + stringUtil.getString("hp") + " " + sumRes.totalHarm + ", " + stringUtil.getString("15").title + " " + sumRes.totalVirus, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        label2.setAnchorPoint(0, 1);
        label2.setPosition(0, label1.getPositionY() - label1.getContentSize().height - 10);
        node.addChild(label2);

        if (sumRes.totalVirus) {
            player.changeAttr("virus", sumRes.totalVirus);
        }

        if (sumRes.brokenWeapon) {
            var label3 = new cc.LabelTTF(stringUtil.getString(1208), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
            label3.setAnchorPoint(0, 1);
            label3.setPosition(0, label2.getPositionY() - label2.getContentSize().height - 10);
            node.addChild(label3);
            var items2 = sumRes.brokenWeapon.map(function (itemId) {
                return {itemId: itemId, num: 1};
            });
            var richText2 = new ItemRichText(items2, this.rightEdge - this.leftEdge - label3.width, 5, 0.5);
            richText2.setName("richText2")
            richText2.setAnchorPoint(0, 0.5);
            richText2.setPosition(label3.x + label3.width, label3.y - label3.height / 2);
            node.addChild(richText2);
        }

        if (cc.RTL) {
            label1.anchorX = 1;
            label1.x = node.width;

            richText.anchorX = 1;
            richText.x = label1.x - label1.width;

            label2.anchorX = 1;
            label2.x = node.width;

            if (label3) {
                label3.anchorX = 1;
                label3.x = node.width;

                richText2.anchorX = 1;
                richText2.x = label3.x - label3.width;
            }
        }

        var self = this;
        var btn = uiUtil.createCommonBtnWhite(stringUtil.getString(1060), this, function () {
            node.removeFromParent();
            self.updateView();
            player.checkBreakdown(8112);
        });

        if (userGuide.isStep(userGuide.stepName.NEXT_ROOM)) {
            uiUtil.createIconWarn(btn);
            userGuide.step();
        }

        btn.setPosition(node.getContentSize().width / 2, 60);
        node.addChild(btn);
        btn.setName("btn");
        Record.saveAll();
    },
    createWorkBeginView: function () {
        if (this.bg.getChildByName("dig_des")) {
            this.bg.removeChildByName("dig_des");
        }
        var digDes;
        if (this.userData == 666 && this.site.step == this.site.rooms.length - 1) {
            digDes = new cc.Sprite("res/new/work_dig_3.png");
        } else {
            digDes = new cc.Sprite("res/new/work_dig_" + this.room.workType + ".png");
        }
        new cc.Sprite("res/new/work_dig_" + this.room.workType + ".png");
        digDes.setAnchorPoint(0.5, 1);
        digDes.setPosition(this.bgRect.width / 2, this.contentTopLineHeight - 20);
        digDes.setName("dig_des");
        this.bg.addChild(digDes);

        this.bg.getChildByName("des").setPosition(this.bgRect.width / 2, digDes.y - digDes.height - 20);

        var node = new cc.Node();
        node.setContentSize(this.rightEdge - this.leftEdge, 600);
        node.setAnchorPoint(0.5, 0);
        node.setPosition(this.bgRect.width / 2, 0);
        this.bg.addChild(node);

        var itemType = 1302;
        var itemList = player.bag.getItemsByType(itemType);
        itemList = itemList.filter(function (storageCell) {
            return itemConfig[storageCell.item.id].effect_tool;
        });
        itemList = itemList.map(function (storageCell) {
            return storageCell.item.id;
        });
        itemList.unshift(Equipment.HAND);

        var btnToolFrame = autoSpriteFrameController.getSpriteFrameFromSpriteName("btn_tool.png");
        var iconWidth = btnToolFrame.getRect().width;
        var padding = (node.getContentSize().width - itemList.length * iconWidth) / (itemList.length * 2);
        var self = this;
        for (var i = 0; i < itemList.length; i++) {
            var btn = uiUtil.createToolBtn(this, function (sender) {
                node.removeFromParent();
                if (this.userData == 666 && this.site.step == this.site.rooms.length - 1) {
                    Record.saveAll();
                    cc.director.runScene(new EndStoryScene());
                } else {
                    self.createWorkProcessView(sender.time, sender.itemId);
                }
            });
            btn.setPosition((padding * 2 + iconWidth) * i + (padding + iconWidth / 2 ), 120);
            btn.setAnchorPoint(0.5, 0.5);
            node.addChild(btn);

            if (userGuide.isStep(userGuide.stepName.WORK_SITE)) {
                uiUtil.createIconWarn(node, btn.getPosition());
                userGuide.step();
            }

            var itemId = itemList[i];
            if (itemId === Equipment.HAND) {
                time = 45;
            } else {
                time = itemConfig[itemId].effect_tool.workingTime;
            }
            time *= player.vigourEffect();
            btn.time = time;
            btn.itemId = itemId;

            var icon = autoSpriteFrameController.getSpriteFromSpriteName("#icon_item_" + itemId + ".png");
            icon.setPosition(btn.getContentSize().width / 2, btn.getContentSize().height / 2);
            icon.setScale(0.5);
            btn.addChild(icon);

            var label = new cc.LabelTTF(stringUtil.getString(1062) + time + "m", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(padding * 2 + iconWidth, 0), cc.TEXT_ALIGNMENT_CENTER);
            label.setAnchorPoint(0.5, 1);
            label.setPosition(btn.getPositionX(), btn.getPositionY() - iconWidth / 2 - 10);
            node.addChild(label);
        }
    },
    createWorkProcessView: function (time, itemId) {
        utils.emitter.emit("left_btn_enabled", false);
        var node = new cc.Node();
        node.setContentSize(this.rightEdge - this.leftEdge, 600);
        node.setAnchorPoint(0.5, 0);
        node.setPosition(this.bgRect.width / 2, 0);
        this.bg.addChild(node);

        var pbBg = autoSpriteFrameController.getSpriteFromSpriteName("#pb_bg.png");
        pbBg.setAnchorPoint(0.5, 0);
        pbBg.setPosition(node.getContentSize().width / 2, 60);
        pbBg.setName("pbBg");
        node.addChild(pbBg);

        var pb = new cc.ProgressTimer(autoSpriteFrameController.getSpriteFromSpriteName("#pb.png"));
        pb.type = cc.ProgressTimer.TYPE_BAR;
        pb.midPoint = cc.p(0, 0);
        pb.barChangeRate = cc.p(1, 0);
        pb.setPosition(pbBg.getPositionX(), pbBg.getPositionY() + pbBg.getContentSize().height / 2);
        pb.setPercentage(0);
        pb.setName("pb");
        node.addChild(pb);

        var passTime = 0;
        time *= 60;
        var self = this;
        cc.timer.addTimerCallback(new TimerCallback(time, this, {
            process: function (dt) {
                passTime += dt;
                pb.setPercentage(passTime / time * 100);
            },
            end: function () {
                node.removeFromParent();
                if (self.site.isInSecretRooms) {
                    self.site.secretRoomEnd();
                } else {
                    self.site.roomEnd(true);
                    self.site.testSecretRoomsBegin();
                }

                player.bag.testWeaponBroken(itemId, 0, 1);

                self.gotoWorkRoomStorage();
                utils.emitter.emit("left_btn_enabled", true);
            }
        }));
        cc.timer.accelerateWorkTime(time);
    },
    gotoWorkRoomStorage: function () {
        Record.saveAll();
        this.replace(Navigation.nodeName.WORK_ROOM_STORAGE_NODE, {
            siteId: this.site.id,
            room: this.room
        });
    },
    onEnter: function () {
        this._super();
    },
    onExit: function () {
        this._super();
    },

    onClickLeftBtn: function () {
        if (this.site.isInSecretRooms || this.site.isSecretRoomsEntryShowed) {
            var self = this;
            this.showSecretRoomLeaveWarning(function () {
                self.site.secretRoomsEnd();
                self.back();

                if (audioManager.getPlayingMusic() === audioManager.music.SITE_SECRET) {
                    audioManager.stopMusic(audioManager.getPlayingMusic());
                    audioManager.playMusic(Navigation.getSiteMusic(), true);
                }
            });
        } else {
            this.back();
        }
    },

    showSecretRoomLeaveWarning: function (cb) {
        var config = {
            title: {},
            content: {},
            action: {btn_1: {}, btn_2: {}}
        };
        config.content.des = stringUtil.getString(1229);
        config.action.btn_1.txt = stringUtil.getString(1157);

        config.action.btn_2.txt = stringUtil.getString(1228);
        config.action.btn_2.target = null;
        config.action.btn_2.cb = cb;

        var dialog = new DialogTiny(config);
        dialog.show();
    }
});