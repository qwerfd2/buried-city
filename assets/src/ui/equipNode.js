var EquipNode = cc.Node.extend({
    ctor: function () {
        this._super();

        this.tabSize = 5;
        this.setContentSize(572, 100);

        var self = this;
        var tabBgFrame = autoSpriteFrameController.getSpriteFrameFromSpriteName("build_icon_bg.png");
        var padding = (this.getContentSize().width - this.tabSize * tabBgFrame.getRect().width) / (this.tabSize + 1);
        for (var i = 0; i < this.tabSize; i++) {
            var tabBg = uiUtil.createSpriteBtn({normal: "build_icon_bg.png"}, this, this.onTabClick);
            tabBg.setPosition(padding * (i + 1) + tabBgFrame.getRect().width * (i + 0.5), this.getContentSize().height / 2);
            tabBg.setName("tab_" + i);
            tabBg.idx = i;
            tabBg.open = false;
            tabBg.updateIcon = function (iconName) {
                if (self.getChildByName("icon_" + this.idx)) {
                    self.removeChildByName("icon_" + this.idx);
                }
                if (iconName) {
                    var icon = autoSpriteFrameController.getSpriteFromSpriteName(iconName);
                    icon.setName("icon_" + this.idx);
                    icon.setPosition(this.getPosition());
                    self.addChild(icon, 10);
                }
            };
            tabBg.setZoomOnTouchDown(false);
            this.addChild(tabBg);
        }

        this.updateTabView();

        this.selectedPos = -1;
        this.selectedCap = autoSpriteFrameController.getSpriteFromSpriteName("#frame_tab_head.png");
        this.selectedCap.setVisible(false);
        this.selectedCap.setAnchorPoint(0.5, 1);
        this.selectedCap.setPositionY(this.getContentSize().height / 2 + tabBgFrame.getRect().height / 2);
        this.addChild(this.selectedCap, 9);
    },

    onTabClick: function (sender) {
        if (this.selectedPos !== sender.idx) {

            var lastSelectedTab = this.getChildByName("tab_" + this.selectedPos);
            if (lastSelectedTab) {
                if (lastSelectedTab.open) {
                    this.closeDropDownView();
                    this.selectedCap.setVisible(false);
                }
            }

            if (userGuide.isStep(userGuide.stepName.GATE_EQUIP_1)) {
                userGuide.step();
                uiUtil.removeIconWarn(this);
            }

            this.selectedPos = sender.idx;
            this.openDropDownView(this.selectedPos);

            this.removeIconWarn(this.selectedPos);

        } else {
            var selectedTab = this.getChildByName("tab_" + this.selectedPos);
            if (selectedTab.open) {
                this.closeDropDownView();
            } else {
                this.openDropDownView(this.selectedPos);
            }
        }
    },

    openDropDownView: function (pos) {
        var itemType = 0;
        switch (pos) {
            case EquipmentPos.GUN:
                itemType = 1301;
                break;
            case EquipmentPos.WEAPON:
                itemType = 1302;
                break;
            case EquipmentPos.EQUIP:
                itemType = 1304;
                break;
            case EquipmentPos.TOOL:
                itemType = 1303;
                break;
        }
        var itemList = [];
        if (pos == EquipmentPos.SPECIAL){
            if (player.tmpBag) {
                if (player.tmpBag.validateItem(1305053, 1)){
                    itemList.push("1305053");
                }
                if (player.tmpBag.validateItem(1305064, 1)){
                    itemList.push("1305064");
                }
            } else {
                if (player.bag.validateItem(1305053, 1)){
                    itemList.push("1305053");
                }
                if (player.bag.validateItem(1305064, 1)){
                    itemList.push("1305064");
                }
            }
        } else {
            itemList = player.tmpBag ? player.tmpBag.getItemsByType(itemType) : player.bag.getItemsByType(itemType);
            itemList = itemList.map(function (storageCell) {
                return storageCell.item.id;
            });
        }

        if (pos === EquipmentPos.WEAPON) {
            itemList.unshift(Equipment.HAND);
        }
        this.createDropDownView(pos, itemList);

        var selectedTab = this.getChildByName("tab_" + pos);
        selectedTab.open = true;
        this.selectedCap.setVisible(true);
        this.selectedCap.setPositionX(selectedTab.getPositionX());
    },
    closeDropDownView: function () {
        var content = this.getChildByName("content");
        if (content) {
            var selectedTab = this.getChildByName("tab_" + content.pos);
            selectedTab.open = false;
            this.selectedCap.setVisible(false);
            this.removeChildByName("content");
        }
    },

    createDropDownView: function (pos, itemIdList) {
        if (itemIdList.length === 0) {
            itemIdList.push(0);
        }
        var vPadding = 10;
        var size = cc.size(565, 108 * itemIdList.length + 2 * vPadding);
        var bg = autoSpriteFrameController.getScale9Sprite("frame_tab_content.png", cc.rect(14, 14, 1, 1));
        bg.setContentSize(size);

        var self = this;
        itemIdList.forEach(function (itemId, index) {
            var line = self.createOneLineView(itemId, pos);
            line.setAnchorPoint(0.5, 1);
            line.setPosition(bg.getContentSize().width / 2, bg.getContentSize().height - vPadding - index * line.getContentSize().height);
            bg.addChild(line);
            if (index !== 0) {
                var sLine = autoSpriteFrameController.getSpriteFromSpriteName("#frame_tab_line.png");
                sLine.setPosition(line.getContentSize().width / 2, line.getContentSize().height);
                sLine.setAnchorPoint(0.5, 0);
                line.addChild(sLine);
            }

            if (userGuide.isStep(userGuide.stepName.GATE_EQUIP_2) && userGuide.isItemCreate(itemId)) {
                uiUtil.createIconWarn(line);
            }

            if (userGuide.equipNeedGuide2(itemId)) {
                uiUtil.createIconWarn(line);
            }
        });

        bg.setAnchorPoint(0.5, 1);
        bg.setPosition(this.getContentSize().width / 2, 5);
        bg.setName("content");
        this.addChild(bg);

        bg.pos = pos;
    },

    createOneLineView: function (itemId, pos) {
        var size = cc.size(520, 108);
        var node = new cc.Node();
        node.setContentSize(size);

        var self = this;
        var btn = uiUtil.createSpriteBtn({
            normal: "tab_content_btn_normal.png",
            pressed: "tab_content_btn_pressed.png"
        }, this, function () {
            player.equip.equip(self.selectedPos, itemId);
            self.closeDropDownView();
            self.updateTabView();
            Record.saveAll();

            if (userGuide.isStep(userGuide.stepName.GATE_EQUIP_2) && userGuide.isItemCreate(itemId)) {
                userGuide.step();
                utils.emitter.emit("nextStep");
            }

            if (userGuide.equipNeedGuide2(itemId)) {
                userGuide.guide2Step(itemId);
            }
        }, cc.rect(1, 1, 1, 1));
        btn.setPosition(size.width / 2, size.height / 2);
        btn.setPreferredSize(size);
        btn.setZoomOnTouchDown(false);
        node.addChild(btn);

        if (itemId) {
            var iconName, itemInfo;
            if (itemId === Equipment.HAND) {
                iconName = "#icon_tab_content_hand.png";
                itemInfo = {
                    name: stringUtil.getString(1170),
                    weight: 0,
                    effect_weapon: {atkCD: 1}
                };
            } else {
                if (itemId == "1305053" || itemId == "1305064") {
                    iconName = "#icon_item_"+itemId+".png";
                } else {
                    iconName = "#icon_tab_content_" + itemId + ".png";
                }
                itemInfo = itemConfig[itemId];
                itemInfo.name = stringUtil.getString(itemId).title;
            }

            var icon = autoSpriteFrameController.getSpriteFromSpriteName(iconName);
            icon.setAnchorPoint(0, 0.5);
            icon.setPosition(0, size.height / 2);
            node.addChild(icon);
            
            var name = new cc.LabelTTF(itemInfo.name, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
            name.setPosition(icon.x + icon.width * icon.scale, size.height - 5);
            name.setAnchorPoint(0, 1);
            node.addChild(name);

            var weight = new cc.LabelTTF(stringUtil.getString(1025) + itemInfo.weight, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
            weight.setPosition(name.x, name.y - name.height - 5);
            weight.setAnchorPoint(0, 1);
            node.addChild(weight);

            var num = new cc.LabelTTF(stringUtil.getString(1026) + player.bag.getNumByItemId(itemId), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
            num.setPosition(name.x, weight.y - weight.height - 5);
            num.setAnchorPoint(0, 1);
            node.addChild(num);

            if (itemInfo.effect_weapon) {
                var atkCD = new cc.LabelTTF(stringUtil.getString(1027) + itemInfo.effect_weapon.atkCD, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
                atkCD.setPosition(size.width - 20, name.y - name.height - 5);
                atkCD.setAnchorPoint(1, 1);
                node.addChild(atkCD);
            }
        } else {
            var string;
            if (pos == EquipmentPos.SPECIAL) {
                string = stringUtil.getString(1305053).title + " / " + stringUtil.getString(1305064).title;
            } else {
                string = stringUtil.getString(1024);
            }
            var label = new cc.LabelTTF(string, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
            label.setPosition(node.getContentSize().width / 2, node.getContentSize().height / 2);
            node.addChild(label);
        }
        return node;
    },

    updateTabView: function () {
        for (var i = 0; i < this.tabSize; i++) {
            var tabBg = this.getChildByName("tab_" + i);
            var equipPos = 0;
            if (i === 0) {
                equipPos = EquipmentPos.GUN;
            } else if (i === 1) {
                equipPos = EquipmentPos.WEAPON;
            } else if (i === 2) {
                equipPos = EquipmentPos.EQUIP;
            } else if (i === 3) {
                equipPos = EquipmentPos.TOOL;
            } else if (i === 4) {
                equipPos = EquipmentPos.SPECIAL;
            }
            var iconName = "";
            var itemId = player.equip.getEquip(equipPos)
            if (itemId) {
                if (itemId === Equipment.HAND) {
                    iconName = "#icon_tab_hand.png";
                } else {
                    if (itemId == "1305053") {
                        iconName = "#icon_item_1305053.png";
                    } else if (itemId == "1305064") {
                        iconName = "#icon_item_1305064.png";
                    } else {
                        iconName = "#icon_tab_" + itemId + ".png";
                    }
                }
            } else {
                switch (equipPos) {
                    case EquipmentPos.GUN:
                        iconName = "#icon_tab_gun.png";
                        break;
                    case EquipmentPos.WEAPON:
                        iconName = "#icon_tab_weapon.png";
                        break;
                    case EquipmentPos.EQUIP:
                        iconName = "#icon_tab_equip.png";
                        break;
                    case EquipmentPos.TOOL:
                        iconName = "#icon_tab_tool.png";
                        break;
                    case EquipmentPos.SPECIAL:
                        iconName = "#build_action_fix.png";
                        break;
                }
            }
            tabBg.updateIcon(iconName);
        }
    },
    onEnter: function () {
        this._super();
        var self = this;
        utils.emitter.on("equiped_item_decrease_in_bag", function () {
            self.updateTabView();
        });

        utils.emitter.on("equip_item_need_guide", function (itemId) {
            var itemType = ("" + itemId).substr(0, 4);
            var equipPos = EquipmentPos.GUN;
            if (itemType == 1301) {
                equipPos = EquipmentPos.GUN;
            } else if (itemType == 1302) {
                equipPos = EquipmentPos.WEAPON;
            } else if (itemType == 1303) {
                equipPos = EquipmentPos.TOOL;
            } else if (itemType == 1304) {
                equipPos = EquipmentPos.EQUIP;
            }
            self.updateIconWarnByPos(equipPos);
        });
    },
    onExit: function () {
        this._super();
        utils.emitter.off("equiped_item_decrease_in_bag");
        utils.emitter.off("equip_item_need_guide");
    },

    updateIconWarn: function () {
        if (userGuide.isStep(userGuide.stepName.GATE_EQUIP_1)) {

            uiUtil.createIconWarn(this, this.getChildByName("tab_1").getPosition());
        }
    },

    updateIconWarnByPos: function (equipPos) {
        uiUtil.createIconWarn(this, this.getChildByName("tab_" + equipPos).getPosition(), equipPos);
    },

    removeIconWarn: function (equipPos) {
        uiUtil.removeIconWarn(this, equipPos);
    }
});