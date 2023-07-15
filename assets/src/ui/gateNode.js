var GateNode = BottomFrameNode.extend({
    ctor: function (userData) {
        this._super(userData);
    },
    _init: function () {
        this.build = player.room.getBuild(this.userData.bid);
        var title = player.room.getBuildCurrentName(this.build.id);
        this.setName(Navigation.nodeName.GATE_NODE);
        this.uiConfig = {
            title: title,
            leftBtn: true,
            rightBtn: true
        };
        //区分仓库
        player.setSetting("inGate", true);
        var equipNode = new EquipNode();
        equipNode.setAnchorPoint(0.5, 1);
        equipNode.setPosition(this.bgRect.width / 2, this.contentTopLineHeight);
        this.bg.addChild(equipNode, 1);
        equipNode.setName("equipNode");

        var itemChangeNode = new ItemChangeNode(player.bag, stringUtil.getString(1034), player.storage, stringUtil.getString(1035), false, false, 100);
        itemChangeNode.setAnchorPoint(0.5, 0);
        itemChangeNode.setPosition(this.bgRect.width / 2, 0);
        this.bg.addChild(itemChangeNode);
        audioManager.playEffect(audioManager.sound.CLOSE_DOOR);
    },

    onEnter: function () {
        this._super();
        this.onItemClick = this.onItemClickFunc();
        utils.emitter.on("item_click", this.onItemClick);
        var self = this;
        if(userGuide.isStep(userGuide.stepName.GATE_OUT)){
            uiUtil.createIconWarn(self.rightBtn);
        }
        utils.emitter.on("nextStep", function () {
            if (userGuide.isStep(userGuide.stepName.GATE_OUT)) {
                uiUtil.createIconWarn(self.rightBtn);
            }
        });
    },
    onExit: function () {
        this._super();

        player.setSetting("inGate", false);
        utils.emitter.off("item_click", this.onItemClick);
        utils.emitter.off("nextStep");
    },
    onItemClickFunc: function () {
        var self = this;
        return function (storageCell, id, isLongPressed) {
            if (userGuide.isStep(userGuide.stepName.GATE_EQUIP_1) && userGuide.isItemCreate(storageCell.item.id)) {
                self.bg.getChildByName("equipNode").updateIconWarn();
            }
        }
    },

    onClickLeftBtn: function () {
        this.back();
    },
    onClickRightBtn: function () {
        if (userGuide.isStep(userGuide.stepName.GATE_OUT)) {
            userGuide.step();
            //player.room.createBuild(9, 0);
        }
        this.forward(Navigation.nodeName.GATE_OUT_NODE);
        player.log.addMsg(1110);
        player.out();
        audioManager.playEffect(audioManager.sound.FOOT_STEP);
    },
});