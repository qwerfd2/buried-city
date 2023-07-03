/**
 * Created by lancelot on 15/4/23.
 */

var StorageNode = BottomFrameNode.extend({
    ctor: function (userData) {
        this._super(userData);
    },
    _init: function () {
        this.setName(Navigation.nodeName.STORAGE_NODE);
        this.build = player.room.getBuild(this.userData.bid);
        this.uiConfig = {
            title: player.room.getBuildCurrentName(this.build.id),
            leftBtn: true,
            rightBtn: false
        };
        player.setSetting("inStorage", true);

        this.tableView = new SectionTableView(cc.size(640, 750));
        this.tableView.setPosition((this.bgRect.width - this.tableView.getViewSize().width) / 2, 10);
        this.bg.addChild(this.tableView);

        this.updateView();
        var btnShop = new SpriteButton(cc.size(100, 70), "btn_shop.png");
        btnShop.setClickListener(this, function () {
            this.forward(Navigation.nodeName.SHOP_NODE);
        });
        btnShop.setPosition(this.bgRect.width - 60, this.actionBarBaseHeight);
        this.bg.addChild(btnShop);
        var btnShopHighlight = autoSpriteFrameController.getSpriteFromSpriteName('btn_shop_highlight.png');
        btnShopHighlight.x = btnShop.width / 2;
        btnShopHighlight.y = btnShop.height / 2;
        btnShop.addChild(btnShopHighlight);
        btnShopHighlight.runAction(cc.repeatForever((cc.sequence(cc.fadeOut(1.5), cc.fadeIn(1.5)))));
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
        cc.timer.pause();
        this.onItemClick = this.onItemClickFunc();
        utils.emitter.on("item_click", this.onItemClick);

        this.onItemUse = this.onItemUseFunc();
        utils.emitter.on("btn_1_click", this.onItemUse);

        var self = this;
        player.storage.setOnItemChangeListener(function (itemId) {
            self.updateView();
        });
    },
    onExit: function () {
        this._super();
        cc.timer.resume();
        utils.emitter.off("item_click", this.onItemClick);
        utils.emitter.off("btn_1_click", this.onItemUse);

        player.setSetting("inStorage", false);

        player.storage.removeOnItemChangeListener();
    },
    onItemClickFunc: function () {
        return function (storageCell) {
            uiUtil.showItemDialog(storageCell.item.id, false, 'storage');
        }
    },
    onItemUseFunc: function () {
        var self = this;
        return function (itemId, source) {
            if (source !== 'storage')
                return;
            var res = player.useItem(player.storage, itemId);
            if (res.result) {
                self.updateView();
            } else {
                cc.e("useItem fail " + res.msg);
            }
        }
    },
    updateView: function () {

        var typeStrArray = stringUtil.getString(3006);
        var typeArray = [
            "1101",
            "1103",
            "1104",
            "1107",
            "13",
            "other"
        ];
        var itemsGroup = player.storage.getItemsByTypeGroup(typeArray);
        var data = typeArray.map(function (key, index) {
            return {title: typeStrArray[index], itemList: itemsGroup[key]};
        });
        this.tableView.updateView(data);

        if (userGuide.isStep(userGuide.stepName.STORAGE_BACK)) {
            uiUtil.createIconWarn(this.leftBtn);
        }
        Record.saveAll();
    },

    onClickLeftBtn: function () {
        if (userGuide.isStep(userGuide.stepName.STORAGE_BACK)) {
            userGuide.step();
            utils.emitter.emit("nextStep");
        }
        this.back();
    }
});