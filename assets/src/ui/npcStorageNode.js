/**
 * Created by lancelot on 15/4/22.
 */
var NpcStorageNode = BottomFrameNode.extend({
    ctor: function (userData) {
        this._super(userData);
    },
    _init: function () {
        this.npc = player.npcManager.getNPC(this.userData);
        this.setName(Navigation.nodeName.NPC_STORAGE_NODE);
        this.uiConfig = {
            title: this.npc.getName(),
            leftBtn: true,
            rightBtn: false
        };

        var equipNode = new EquipNode();
        equipNode.setAnchorPoint(0.5, 1);
        equipNode.setPosition(this.bgRect.width / 2, this.contentTopLineHeight);
        this.bg.addChild(equipNode, 1);

        var itemChangeNode = new ItemExchangeNode(this.npc, player.bag, stringUtil.getString(1034), this.npc.storage, this.npc.getName());
        itemChangeNode.setAnchorPoint(0.5, 0);
        itemChangeNode.setPosition(this.bgRect.width / 2, 0);
        this.bg.addChild(itemChangeNode);
    },
    onEnter: function () {
        this._super();
        this.onExchangeEnd = this.onExchangeEndFunc();
        utils.emitter.on("exchange_end", this.onExchangeEnd);
    },
    onExit: function () {
        this._super();
        utils.emitter.off("exchange_end", this.onExchangeEnd);
    },
    onExchangeEndFunc: function () {
        var self = this;
        return function () {
            self.back();
        }
    },

    onClickLeftBtn: function () {
        this.back();
    }
});

var ItemExchangeNode = ItemChangeNode.extend({
    ctor: function (npc, topStorage, topStorageName, bottomStorage, bottomStorageName) {
        this._super(topStorage, topStorageName, bottomStorage, bottomStorageName);
        this.npc = npc;

        var sectionBar = this.getChildByName("bottom").getChildByName("section");
        var self = this;
        this.exchangeBtn = uiUtil.createCommonBtnBlack(stringUtil.getString(1040), this, function () {
            if (!self.exchangeBtn.isEnabled())
                return;
            self.topSrcData.map = self.topData.map;
            self.bottomSrcData.map = self.bottomData.map;
            utils.emitter.emit("exchange_end");
            audioManager.playEffect(audioManager.sound.LOOT);

            self.npc.tradingCount = self.npc.tradingCount || 0
            self.npc.tradingCount++;
        });
        this.exchangeBtn.setAnchorPoint(0.5, 0.5);
        this.exchangeBtn.setPosition(sectionBar.getContentSize().width - this.exchangeBtn.width / 2 - 20, sectionBar.getContentSize().height / 2);
        this.exchangeBtn.setEnabled(false);
        sectionBar.addChild(this.exchangeBtn);

        this.exchangeRage = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        this.exchangeRage.setAnchorPoint(1, 0.5);
        this.exchangeRage.setPosition(this.exchangeBtn.x - this.exchangeBtn.width / 2 - 10, sectionBar.getContentSize().height / 2);
        this.exchangeRage.setColor(cc.color.BLACK);
        sectionBar.addChild(this.exchangeRage);
    },
    initData: function (topStorage, bottomStorage) {
        this.topSrcData = topStorage;
        this.bottomSrcData = bottomStorage;
        this.topData = topStorage.clone();
        this.bottomData = bottomStorage.clone();
        player.tmpBag = this.topData;
    },
    onExit: function () {
        this._super();
        delete player.tmpBag;
    },
    exchange: function (id, itemId, num) {
        var res = this._super(id, itemId, num);
        if (res) {
            var tradeRate = this.npc.getTradeRate(this.bottomData);
            this.exchangeRage.setString(this.updateExchangeStr(tradeRate));
            this.exchangeBtn.setEnabled(tradeRate >= 1);
        }
        return res;
    },
    updateExchangeStr: function (tradeRate) {
        var index = 0;
        if (tradeRate >= 1.3) {
            index = 0;
        } else if (tradeRate >= 1.1) {
            index = 1;
        } else if (tradeRate >= 1) {
            index = 2;
        } else if (tradeRate >= 0.9) {
            index = 3;
        } else if (tradeRate >= 0.7) {
            index = 4;
        } else {
            index = 5;
        }
        return stringUtil.getString(3010)[index];
    },
    equipNeedGuide: function () {
        return false;
    },
    initGuideLayer: function () {
    }
});