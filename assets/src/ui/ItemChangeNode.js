/**
 * Created by lancelot on 15/4/27.
 */

var ItemChangeNode = cc.Node.extend({
    ctor: function (topStorage, topStorageName, bottomStorage, bottomStorageName, withTakeAll, smallSize) {
        this._super();

        if (smallSize) {
            this.setContentSize(596, 570);
        } else {
            this.setContentSize(596, 670);
        }

        var topView = this.createStorageView(cc.size(this.getContentSize().width, this.getContentSize().height / 2), "top");
        topView.setAnchorPoint(0.5, 1);
        topView.setPosition(this.getContentSize().width / 2, this.getContentSize().height);
        topView.setName("top");
        this.addChild(topView);
        topView.getChildByName("section").getChildByName("name").setString(topStorageName);
        if (topStorage instanceof Bag) {
            var section = topView.getChildByName("section");
            var weightLabel = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2 + 4);
            weightLabel.setAnchorPoint(1, 0.5);
            weightLabel.setPosition(section.width - 10, section.height / 2);
            weightLabel.setName("weight");
            weightLabel.setColor(cc.color.BLACK);
            section.addChild(weightLabel);
        }

        var bottomView = this.createStorageView(cc.size(this.getContentSize().width, this.getContentSize().height / 2), "bottom");
        bottomView.setAnchorPoint(0.5, 0);
        bottomView.setPosition(this.getContentSize().width / 2, 0);
        bottomView.setName("bottom");
        this.addChild(bottomView);
        bottomView.getChildByName("section").getChildByName("name").setString(bottomStorageName);

        if (withTakeAll) {
            var self = this;
            var section = bottomView.getChildByName("section");
            var btnTakeAll = uiUtil.createCommonBtnBlack(stringUtil.getString(1124), this, function () {
                self.exchangeAll("bottom");
                self.updateView();
                audioManager.playEffect(audioManager.sound.LOOT);

                if (userGuide.isStep(userGuide.stepName.ALL_GET)) {
                    userGuide.step();
                    uiUtil.removeIconWarn(btnTakeAll);
                    utils.emitter.emit("guideNextRoom");
                }
            });
            btnTakeAll.setAnchorPoint(0.5, 0.5);
            btnTakeAll.setPosition(section.getContentSize().width - btnTakeAll.width / 2 - 20, section.getContentSize().height / 2);
            section.addChild(btnTakeAll);
            btnTakeAll.labelAnchor = cc.p(0.3, 0.5);
            var btnIcon = autoSpriteFrameController.getSpriteFromSpriteName("btn_icon_take_all.png");
            btnIcon.x = 27;
            btnIcon.y = btnTakeAll.height / 2;
            btnTakeAll.addChild(btnIcon);
            if (userGuide.isStep(userGuide.stepName.ALL_GET)) {
                uiUtil.createIconWarn(btnTakeAll);
            }
        }

        this.initData(topStorage, bottomStorage);
        this.updateView();

        audioManager.playEffect(audioManager.sound.EXCHANGE);
    },
    initData: function (topStorage, bottomStorage) {
        this.topData = topStorage;
        this.bottomData = bottomStorage;
    },
    onEnter: function () {
        this._super();

        this.onItemClick = this.onItemClickFunc();
        utils.emitter.on("item_click", this.onItemClick);

        if (this.topData instanceof Bag) {
            var self = this;
            this.topData.setOnItemChangeListener(function () {
                self.updateView();
            });
        }
    },
    onExit: function () {
        this._super();

        utils.emitter.off("item_click", this.onItemClick);

        this.topData.removeOnItemChangeListener();

        this.topData = null;
        this.bottomData = null;

    },
    onItemClickFunc: function () {
        var self = this;
        return function (storageCell, id, isLongPressed) {
            if (isLongPressed) {
                uiUtil.showItemSliderDialog(storageCell.item.id, id === "top" ? self.topData : self.bottomData, function (num) {
                    num = Number(num);
                    self.exchange(id, storageCell.item.id, num);
                    self.updateView();
                });
            } else {
                self.exchange(id, storageCell.item.id, 1);
                self.updateView();
            }
        }
    },
    exchange: function (id, itemId, num) {
        if (!this.topData || !this.bottomData)
            return false;

        var fromData, toData;
        if (id === "top") {
            fromData = this.topData;
            toData = this.bottomData;
        } else {
            fromData = this.bottomData;
            toData = this.topData;
        }
        if (fromData.validateItem(itemId, num)) {
            if (toData.validateItemWeight(itemId, num)) {
                fromData.decreaseItem(itemId, num);
                toData.increaseItem(itemId, num);
                return true;
            } else {
                cc.e("not enough weight");
                uiUtil.showTinyInfoDialog(1131);
                return false;
            }
        } else {
            return false;
        }
    },

    exchangeAll: function (id) {
        var fromData, toData;
        if (id === "top") {
            fromData = this.topData;
            toData = this.bottomData;
        } else {
            fromData = this.bottomData;
            toData = this.topData;
        }
        fromData.forEach(function (item, num) {
            for (var i = 0; i < num; i++) {
                if (toData.validateItemWeight(item.id, 1)) {
                    fromData.decreaseItem(item.id, 1);
                    toData.increaseItem(item.id, 1);
                }
            }
        });
    },

    updateView: function () {
        var topTableView = this.getChildByName("top").getChildByName("tableView");
        var topItemList = this.topData.getItemsByType("");
        var weightLabel = this.getChildByName("top").getChildByName("section").getChildByName("weight");
        if (weightLabel) {
            weightLabel.setString(stringUtil.getString(1028, this.topData.getCurrentWeight() + "/" + this.topData.getTotalWeight()));
            weightLabel.setColor(this.topData.getCurrentWeight() === this.topData.getTotalWeight() ? cc.color.RED : cc.color.BLACK);
        }

        var bottomTableView = this.getChildByName("bottom").getChildByName("tableView");
        var bottomItemList = this.bottomData.getItemsByType("");
        //不可移动物品过滤
        if (this.bottomData.name == 'player') {
            bottomItemList = bottomItemList.filter(function (storageCell) {
                var itemId = storageCell.item.id;
                return (blackList.storageMove.indexOf(Number(itemId)) === -1);
            });
        }
        if (this.equipNeedGuide()) {
            this.tmpEquipGuideList = this.tmpEquipGuideList || utils.clone(userGuide.equipGuideList);
            var self = this;
            topItemList = topItemList.sort(function (itemIdA, itemIdB) {
                if (self.tmpEquipGuideList[itemIdA.item.id]) {
                    return -1;
                } else if (self.tmpEquipGuideList[itemIdB.item.id]) {
                    return 1;
                } else {
                    return 0;
                }
            });
            bottomItemList = bottomItemList.sort(function (itemIdA, itemIdB) {
                if (self.tmpEquipGuideList[itemIdA.item.id]) {
                    return -1;
                } else if (self.tmpEquipGuideList[itemIdB.item.id]) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }
        topTableView.updateView([{itemList: topItemList}], this.equipNeedGuide());
        bottomTableView.updateView([{itemList: bottomItemList}], this.equipNeedGuide());
    },

    createStorageView: function (size, tag) {
        var node = new cc.Node();
        node.setContentSize(size);

        var section = autoSpriteFrameController.getSpriteFromSpriteName("#frame_section_bg.png");
        section.setAnchorPoint(0.5, 1);
        section.setPosition(node.getContentSize().width / 2, node.getContentSize().height);
        section.setName("section");
        node.addChild(section);

        var name = new cc.LabelTTF(name, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        name.setAnchorPoint(0, 0.5);
        name.setPosition(10, section.getContentSize().height / 2);
        name.setName("name");
        name.setColor(cc.color.BLACK);
        section.addChild(name);

        var tableView = new SectionTableView(cc.size(size.width, size.height - section.getContentSize().height - 10), tag);
        tableView.setPosition((size.width - tableView.getViewSize().width) / 2, 10);
        tableView.setName("tableView");
        node.addChild(tableView);

        return node;
    },
    equipNeedGuide: function () {
        return userGuide.isStepGuideFinish();
    }
});