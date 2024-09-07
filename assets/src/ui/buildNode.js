var BuildNode = BottomFrameNode.extend({
    ctor: function (userData) {
        this._super(userData);
    },
    _init: function () {
        this.bid = this.userData.bid;
        this.build = player.room.getBuild(this.bid);
        var title = player.room.getBuildCurrentName(this.bid);
        if (this.bid === 19) {
            title += " & ";
            title += player.room.getBuildCurrentName(11);
        }
        this.setName(Navigation.nodeName.BUILD_NODE);
        this.uiConfig = {
            title: title,
            leftBtn: true,
            rightBtn: false
        };
        var self = this;
        this.upgradeView = uiUtil.createCommonListItem(
            {
                target: this, cb: function () {
                uiUtil.showBuildDialog(self.build.id, self.build.isMax() ? self.build.level : (self.build.level + 1));
            }
            },
            {
                target: this, cb: function () {
                if (!uiUtil.checkVigour()) {
                    return;
                }
                if (BuildOccupied) {
                    return;
                }
                BuildOccupied = true;
                utils.emitter.emit("left_btn_enabled", false);
                self.build.upgrade(function (percentage) {
                    self.upgradeView.updatePercentage(percentage);
                    if (self.bid === 9 && userGuide.isStep(userGuide.stepName.MAKE_BED)) {
                        uiUtil.removeIconWarn(self.upgradeView.getChildByName("action1"));
                    }
                }, function () {
                    utils.emitter.emit("left_btn_enabled", true);
                    if (self.bid === 9 && userGuide.isStep(userGuide.stepName.MAKE_BED)) {
                        userGuide.step();
                    }
                    BuildOccupied = false;
                    self.afterUpgrade();
                    btnShop.setEnabled(true);
                });
                btnShop.setEnabled(false);
            }
            }
        );
        if (this.bid === 9 && userGuide.isStep(userGuide.stepName.MAKE_BED)) {
            if (player.room.getBuildLevel(9) > -1) {
                userGuide.step();
            } else {
                uiUtil.createIconWarn(this.upgradeView.getChildByName("action1"));
            }
        }

        this.upgradeView.setAnchorPoint(0.5, 1);
        this.upgradeView.setPosition(this.bgRect.width / 2, this.contentTopLineHeight);
        this.bg.addChild(this.upgradeView, 1);
        if (this.bid === 19) {
            this.fenceView = uiUtil.createCommonListItem(
                {
                    target: this, cb: function () {
                    uiUtil.showBuildDialog(11, player.room.getBuild(11).isMax() ? player.room.getBuild(11).level : (player.room.getBuild(11).level + 1));
                    }
                },
                {
                    target: this, cb: function () {
                    if (!uiUtil.checkVigour()) {
                        return;
                    }
                    if (BuildOccupied) {
                        return;
                    }
                    BuildOccupied = true;
                    utils.emitter.emit("left_btn_enabled", false);
                    player.room.getBuild(11).upgrade(function (percentage) {
                        self.fenceView.updatePercentage(percentage);
                    }, function () {
                        BuildOccupied = false;
                        utils.emitter.emit("left_btn_enabled", true);
                        self.afterUpgrade();
                        btnShop.setEnabled(true);
                    });
                    btnShop.setEnabled(false);
                }
            });
            this.fenceView.setAnchorPoint(0.5, 1);
            this.fenceView.setPosition(this.bgRect.width / 2, this.contentTopLineHeight - this.upgradeView.height);
            this.bg.addChild(this.fenceView, 2);
        }

        this.updateUpgradeView();
        this.sectionView = autoSpriteFrameController.getSpriteFromSpriteName("#frame_section_bg.png");    
        if (this.build.id === 19) {
            this.sectionView.setPosition(this.bgRect.width / 2, this.contentTopLineHeight - this.upgradeView.getContentSize().height * 2);
        } else {
            this.sectionView.setPosition(this.bgRect.width / 2, this.contentTopLineHeight - this.upgradeView.getContentSize().height);
        }
        this.sectionView.setAnchorPoint(0.5, 1);
        this.bg.addChild(this.sectionView);
        if (this.build.id == 20 && this.build.level >= 0) {
            var itemChangeNode = new ItemChangeNode(player.safe, stringUtil.getString("20_0").title, player.storage, stringUtil.getString(1035), false, false, 100);
            itemChangeNode.setAnchorPoint(0, 0);
            itemChangeNode.setPosition(0, 0);
            this.bg.addChild(itemChangeNode);
            this.createTableView();
        } else {
            var operatorTxt = new cc.LabelTTF(stringUtil.getString(1004), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
            operatorTxt.setAnchorPoint(0, 0.5);
            operatorTxt.setPosition(20, this.sectionView.getContentSize().height / 2);
            operatorTxt.setColor(cc.color.BLACK);
            this.sectionView.addChild(operatorTxt);
            this.createTableView();
            if (this.build.id == 12 && this.build.level >= 0) {
                this.initDogHouse();
            }
        }

        if (this.build.id == 12) {
            audioManager.playEffect(audioManager.sound.BARK);
        } else if (this.build.id == 15) {
            audioManager.playEffect(audioManager.sound.RADIO);
        } else if (this.build.id == 6) {
            audioManager.playEffect(audioManager.sound.BUBBLES);
        } else if (this.build.id == 2) {
            audioManager.playEffect(audioManager.sound.HARVEST);
        } else if (this.build.id == 4) {
            audioManager.playEffect(audioManager.sound.COOK);
        } else if (this.build.id == 18) {
            audioManager.playEffect(audioManager.sound.ESTOVE);
        } else if (this.build.id == 5) {
            audioManager.playEffect(audioManager.sound.STOVE);
        } else if (this.build.id == 1 || this.build.id === 16) {
            audioManager.playEffect(audioManager.sound.TOOLBOX);
        }

        this.updateAllView();

        var btnShop = new SpriteButton(cc.size(100, 70), "btn_shop.png");
        btnShop.setClickListener(this, function () {
            this.forward(Navigation.nodeName.SHOP_NODE);
        });
        btnShop.setPosition(this.bgRect.width - 60, this.actionBarBaseHeight);
        this.bg.addChild(btnShop);

        if (IAPPackage.isAllIAPUnlocked()) {
            btnShop.setEnabled(true);
            btnShop.setVisible(true);
        } else {
            btnShop.setEnabled(false);
            btnShop.setVisible(false);
        }
    },
    onEnter: function () {
        this._super();
        this.updateFunc = this.buildNodeUpdate();
        utils.emitter.on("build_node_update", this.updateFunc);

        if (this.build.id === 10) {
            audioManager.insertMusic(audioManager.music.HOME_REST);
        } else if (this.build.id === 9) {
            audioManager.insertMusic(audioManager.music.HOME_BED);
        }
    },
    onExit: function () {
        this._super();
        utils.emitter.off("build_node_update", this.updateFunc);

        this.cleanBuildAction();

        if (this.build.id === 10 || this.build.id === 9) {
            audioManager.resumeMusic();
        }
    },
    initDogHouse: function () {
        var str;
        if (player.isDogActive()) {
            str = "icon_item_1106013.png";
        } else {
            str = "dog_unable.png";
        }
        var btnDog = new SpriteButton(cc.size(64, 64), str);
        btnDog.setClickListener(this, function () {
            this.forward(Navigation.nodeName.DOG_NODE);
        });
        btnDog.setPosition(this.bgRect.width / 3 - 20, this.contentTopLineHeight - 200);
        this.bg.addChild(btnDog);
        btnDog.setName("btnDog");
        var self = this;
        utils.emitter.on("dogStateChange", function () {
            if (cc.sys.isObjectValid(btnDog)) {
                self.bg.removeChildByName("btnDog");
                if (player.isDogActive()) {
                    str = "icon_item_1106013.png";
                } else {
                    str = "dog_unable.png";
                }
                btnDog = new SpriteButton(cc.size(64, 64), str);
                btnDog.setClickListener(self, function () {
                    self.forward(Navigation.nodeName.DOG_NODE);
                });
                btnDog.setPosition(self.bgRect.width / 3 - 20, self.contentTopLineHeight - 200);
                self.bg.addChild(btnDog);
                btnDog.setName("btnDog");
            }
        });

        var dogTxt = new cc.LabelTTF(stringUtil.getString(7000, player.getDogName()), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        dogTxt.setAnchorPoint(0.4, 0.5);
        dogTxt.setPosition(this.bgRect.width / 2 + 50, this.contentTopLineHeight - 200);
        dogTxt.setColor(cc.color.WHITE);
        this.bg.addChild(dogTxt);

        var goOutLabel = new cc.LabelTTF(stringUtil.getString(7001, player.getDogName()), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3 + 4, cc.size(400, 0), cc.TEXT_ALIGNMENT_LEFT);
        goOutLabel.setAnchorPoint(0.5, 0.5);
        goOutLabel.setColor(cc.color.WHITE);
        goOutLabel.setPosition(this.bgRect.width / 2, this.contentTopLineHeight - 300);
        this.bg.addChild(goOutLabel);
        goOutLabel.setName("goOutLabel");

        this.checkBox1 = new CheckBox(player.dogState, "checkbox_bg.png", "checkbox_on.png", true);
        this.checkBox2 = new CheckBox(!player.dogState, "checkbox_bg.png", "checkbox_on.png", true);
        this.checkBox1.setClickListener(this, function (sender) {
            this.checkBox2.on = false;
            this.checkBox2.updateView();
            if (!player.dogState) {
                player.dogState = 1;
                utils.emitter.emit("dogStateChange");
                Record.saveAll();
            } else {
                this.checkBox1.on = true;
                this.checkBox1.updateView();
            }
        });
        this.checkBox1.setAnchorPoint(1, 0.5);
        this.checkBox1.setPosition(this.bgRect.width / 5 + 400, this.contentTopLineHeight - 300);
        this.bg.addChild(this.checkBox1);
        this.checkBox1.setName("goOutCheckBtn");

        var stayHomeLabel = new cc.LabelTTF(stringUtil.getString(7002, player.getDogName()), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3 + 4, cc.size(400, 0), cc.TEXT_ALIGNMENT_LEFT);
        stayHomeLabel.setAnchorPoint(0.5, 0.5);
        stayHomeLabel.setColor(cc.color.WHITE);
        stayHomeLabel.setPosition(this.bgRect.width / 2, this.contentTopLineHeight - 360);
        this.bg.addChild(stayHomeLabel);
        stayHomeLabel.setName("stayHomeLabel");

        this.checkBox2.setClickListener(this, function (sender) {
            this.checkBox1.on = false;
            this.checkBox1.updateView();
            if (player.dogState) {
                player.dogState = 0;
                utils.emitter.emit("dogStateChange");
                Record.saveAll();
            } else {
                this.checkBox2.on = true;
                this.checkBox2.updateView();
            }
        });
        this.checkBox2.setAnchorPoint(1, 0.5);
        this.checkBox2.setPosition(this.bgRect.width / 5 + 400, this.contentTopLineHeight - 360);
        this.bg.addChild(this.checkBox2);
        this.checkBox2.setName("stayHomeCheckBtn");
    },
    cleanBuildAction: function () {
        this.data.forEach(function (buildAction, index) {
            buildAction.updateView(null, index);
        });
    },

    buildNodeUpdate: function () {
        var self = this;
        return function () {
            self.updateAllView();
        };
    },

    afterUpgrade: function () {
        this.updateAllView();
        var title = player.room.getBuildCurrentName(this.build.id);
        if (this.bid === 19) {
            title += " & ";
            title += player.room.getBuildCurrentName(11);
        } else if (this.bid === 20) {
            var itemChangeNode = new ItemChangeNode(player.safe, stringUtil.getString("20_0").title, player.storage, stringUtil.getString(1035), false, false, 100);
            itemChangeNode.setAnchorPoint(0, 0);
            itemChangeNode.setPosition(0, 0);
            this.bg.addChild(itemChangeNode);            
        } else if (this.bid === 12) {
            this.initDogHouse();
        }
        this.title.setString(title);
    },

    updateAllView: function () {
        this.updateUpgradeView();

        var offsetPos = this.tableView.getContentOffset();
        this.updateData();
        this.tableView.reloadData();
        this.tableView.setContentOffset(offsetPos);

        if (this.build.id === 1 && userGuide.isStep(userGuide.stepName.TOOL_BACK)) {
            uiUtil.createIconWarn(this.leftBtn);
        }
        if (this.build.id === 9 && userGuide.isStep(userGuide.stepName.SLEEP_WAKE_UP)) {
            uiUtil.createIconWarn(this.leftBtn);
        }
    },

    updateData: function () {
        this.data = this.build.getBuildActions();
    },

    createTableView: function () {
        this.updateData();
        
        this.tableView = new cc.TableView(this, cc.size(596, 610));
        this.tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.tableView.x = (this.bgRect.width - this.tableView.getViewSize().width) / 2;
        this.tableView.y = 10;
        this.tableView.setDelegate(this);
        this.bg.addChild(this.tableView);
        this.tableView.reloadData();
    },
    tableCellTouched: function (table, cell) {
    },

    tableCellSizeForIndex: function (table, idx) {
        return cc.size(596, 120);
    },

    tableCellAtIndex: function (table, idx) {
        var cell = table.dequeueCell();
        var size = this.tableCellSizeForIndex(idx);
        var itemView;
        var self = this;
        if (!cell) {
            cell = new cc.TableViewCell();
            itemView = uiUtil.createCommonListItem(
                {
                    target: this, cb: function (sender) {
                    this.data[sender.idx].clickIcon();
                }
                },
                {
                    target: this, cb: function (sender) {
                    var action = this.data[sender.idx];
                    action.clickAction1();

                    if (self.build.id === 1 && userGuide.isStep(userGuide.stepName.TOOL_ALEX)) {
                        var btn = itemView.getChildByName("action1");
                        uiUtil.removeIconWarn(btn);
                    } else if (self.build.id === 9 && userGuide.isStep(userGuide.stepName.BED_SLEEP)) {
                        var btn = itemView.getChildByName("action1");
                        uiUtil.removeIconWarn(btn);
                        userGuide.step();
                    }
                }
                }
            );
            itemView.setAnchorPoint(0.5, 0.5);
            itemView.setPosition(size.width / 2, size.height / 2);
            itemView.setName("itemView");
            cell.addChild(itemView);

        } else {
            itemView = cell.getChildByName("itemView");
        }

        var action = this.data[idx];
        action.updateView(itemView, idx);
        if (itemView.getChildByName("lock")) {
            itemView.removeChildByName("lock");
        }

        if (this.build.id === 1 && userGuide.isStep(userGuide.stepName.TOOL_ALEX)) {
            var btn = itemView.getChildByName("action1");
            if (userGuide.isItemFormula(action.id)) {
                uiUtil.createIconWarn(btn);
            } else {
                uiUtil.removeIconWarn(btn);
            }
        }

        if (self.build.id === 9 && userGuide.isStep(userGuide.stepName.BED_SLEEP)) {
            var btn = itemView.getChildByName("action1");
            if (userGuide.isToSleepBed(action.type)) {
                uiUtil.createIconWarn(btn);
            } else {
                uiUtil.removeIconWarn(btn);
            }
        }

        return cell;
    },

    numberOfCellsInTableView: function (table) {
        return this.data.length;
    },

    updateUpgradeView: function () {
        var action1Disabled;
        if (this.build.id === 19) {
            var upgradeInfo = player.room.getBuild(11).canUpgrade();
            switch (upgradeInfo.buildUpgradeType) {
                case BuildUpgradeType.UPGRADABLE:
                case BuildUpgradeType.CONDITION:
                case BuildUpgradeType.COST:
                    var upgradeConfig = player.room.getBuild(11).getUpgradeConfig();
                    if (IAPPackage.isHandyworkerUnlocked()) {
                        upgradeConfig.upgradeTime = Math.round(upgradeConfig.upgradeTime * 0.7);
                    }
                    var action1Txt = player.room.getBuild(11).needBuild() ? stringUtil.getString(1005, upgradeConfig.upgradeTime) : stringUtil.getString(1001, upgradeConfig.upgradeTime);

                    var hint = upgradeInfo.buildUpgradeType === BuildUpgradeType.CONDITION ? stringUtil.getString(1006, player.room.getBuildName(upgradeInfo.condition["bid"], upgradeInfo.condition["level"])) : "";
                    var items = null;
                    if (upgradeInfo.buildUpgradeType === BuildUpgradeType.UPGRADABLE) {
                        items = upgradeConfig.upgradeCost;
                    } else if (upgradeInfo.buildUpgradeType === BuildUpgradeType.COST) {
                        items = upgradeInfo.cost.map(function (itemInfo) {
                            return {
                                itemId: itemInfo.itemId,
                                num: itemInfo.num,
                                color: itemInfo.haveNum >= itemInfo.num ? cc.color.WHITE : cc.color.RED
                            };
                        });
                    }
                    action1Disabled = upgradeInfo.buildUpgradeType === BuildUpgradeType.UPGRADABLE ? false : true;
                    //当建筑物中有任何不是本btn的活跃动作时,则不能使用
                    if (this.build.anyBtnActive() && this.build.activeBtnIndex !== -1) {
                        action1Disabled = true;
                    }
                    if (player.room.getBuild(11).isUpgrading || this.build.isUpgrading) {
                        action1Disabled = true;
                    }
                    this.fenceView.updateView({
                        iconName: "#build_11_" + upgradeConfig.level + ".png",
                        hint: hint,
                        hintColor: hint ? cc.color.RED : null,
                        items: items,
                        action1: action1Txt,
                        action1Disabled: action1Disabled,
                        percentage: 0
                    });
                    break;
                case BuildUpgradeType.MAX_LEVEL:
                    this.fenceView.updateView({
                        iconName: "#build_11_2.png",
                        hint: stringUtil.getString(1147),
                        percentage: 0
                    });
                    break;
            }
        }
        var upgradeInfo = this.build.canUpgrade();
        switch (upgradeInfo.buildUpgradeType) {

            case BuildUpgradeType.UPGRADABLE:
            case BuildUpgradeType.CONDITION:
            case BuildUpgradeType.COST:
                var upgradeConfig = this.build.getUpgradeConfig();

                if (IAPPackage.isHandyworkerUnlocked()) {
                    upgradeConfig.upgradeTime = Math.round(upgradeConfig.upgradeTime * 0.7);
                }
                var action1Txt = this.build.needBuild() ? stringUtil.getString(1005, upgradeConfig.upgradeTime) : stringUtil.getString(1001, upgradeConfig.upgradeTime);

                var hint = upgradeInfo.buildUpgradeType === BuildUpgradeType.CONDITION ? stringUtil.getString(1006, player.room.getBuildName(upgradeInfo.condition["bid"], upgradeInfo.condition["level"])) : "";
                var items = null;
                if (upgradeInfo.buildUpgradeType === BuildUpgradeType.UPGRADABLE) {
                    items = upgradeConfig.upgradeCost;
                } else if (upgradeInfo.buildUpgradeType === BuildUpgradeType.COST) {
                    items = upgradeInfo.cost.map(function (itemInfo) {
                        return {
                            itemId: itemInfo.itemId,
                            num: itemInfo.num,
                            color: itemInfo.haveNum >= itemInfo.num ? cc.color.WHITE : cc.color.RED
                        };
                    });
                }
                action1Disabled = upgradeInfo.buildUpgradeType === BuildUpgradeType.UPGRADABLE ? false : true;

                //当建筑物中有任何不是本btn的活跃动作时,则不能使用
                if (this.build.anyBtnActive() && this.build.activeBtnIndex !== -1) {
                    action1Disabled = true;
                }
                if (player.room.getBuild(11).isUpgrading && this.build.id === 19) {
                    action1Disabled = true;
                }
                if (this.build.isUpgrading) {
                    action1Disabled = true;
                }

                var iconName = "#build_" + this.build.id + "_" + upgradeConfig.level + ".png";
                this.upgradeView.updateView({
                    iconName: iconName,
                    hint: hint,
                    hintColor: hint ? cc.color.RED : null,
                    items: items,
                    action1: action1Txt,
                    action1Disabled: action1Disabled,
                    percentage: 0
                });
                break;
            case BuildUpgradeType.MAX_LEVEL:
                var iconName = "#build_" + this.build.id + "_" + this.build.level + ".png";
                this.upgradeView.updateView({
                    iconName: iconName,
                    hint: stringUtil.getString(1147),
                    percentage: 0
                });
                break;
        }
    },
    onClickLeftBtn: function () {
        if (this.build.id === 1 && userGuide.isStep(userGuide.stepName.TOOL_BACK)) {
            userGuide.step();
        } else if (this.build.id === 9 && userGuide.isStep(userGuide.stepName.SLEEP_WAKE_UP)) {
            userGuide.step();
        }
        this.back();
    }
});