var WorkRoomStorageNode = BottomFrameNode.extend({
    ctor: function (userData) {
        this._super(userData);
    },
    _init: function () {
        var siteId = this.userData.siteId;
        this.workRoom = this.userData.room;
        this.site = player.map.getSite(siteId);
        this.setName(Navigation.nodeName.WORK_ROOM_STORAGE_NODE);
        this.uiConfig = {
            title: stringUtil.getString(3007)[this.workRoom.workType],
            leftBtn: true,
            rightBtn: false
        };

        var equipNode = new EquipNode();
        equipNode.setAnchorPoint(0.5, 1);
        equipNode.setPosition(this.bgRect.width / 2, this.contentTopLineHeight);
        this.bg.addChild(equipNode, 1);

        this.storage = new Storage();
        var self = this;
        this.workRoom.list.forEach(function (itemInfo) {
            self.storage.increaseItem(itemInfo.itemId, itemInfo.num);
        });

        var itemChangeNode = new ItemChangeNode(player.bag, stringUtil.getString(1034), this.storage, this.uiConfig.title, true, true, siteId);
        itemChangeNode.setAnchorPoint(0.5, 0);
        itemChangeNode.setPosition(this.bgRect.width / 2, 100);
        this.bg.addChild(itemChangeNode);

        var btn = uiUtil.createCommonBtnWhite(stringUtil.getString(1060), this, this.onClickRightBtn);
        btn.setPosition(this.bgRect.width / 2, 60);
        this.bg.addChild(btn);
        btn.setName("btn");
        utils.emitter.on("guideNextRoom",function(){
            if(userGuide.isStep(userGuide.stepName.BACK_ROOM)){
                uiUtil.createIconWarn(btn);
                userGuide.step();
            }
        });
    },
    onEnter: function () {
        this._super();
    },
    onExit: function () {
        this._super();
        utils.emitter.off("guideNextRoom");
    },
    flushItems: function () {
        var self = this;
        this.storage.forEach(function (item, num) {
            self.site.increaseItem(item.id, num);
        });
        Record.saveAll();
    },

    onClickLeftBtn: function () {
        this.flushItems();
        this.back();
    },
    onClickRightBtn: function () {
        if(userGuide.isStep(userGuide.stepName.BACK_ROOM)){
            userGuide.step();
            utils.emitter.emit("nextStep");
        }
        this.flushItems();
        this.replace(Navigation.nodeName.BATTLE_AND_WORK_NODE, this.userData.siteId)
    }
});