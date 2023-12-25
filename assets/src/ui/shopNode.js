var ShopNode = BottomFrameNode.extend({
    ctor: function (userData) {
        this._super(userData);
    },
    _init: function () {
        this.setName(Navigation.nodeName.SHOP_NODE);
        this.uiConfig = {
            title: stringUtil.getString(1216),
            leftBtn: true,
            rightBtn: false
        };

        this.nodeMap = {};
        var NODE_WIDTH = 246;
        var NODE_HEIGHT = 249;
        var widthPadding = (this.bgRect.width - 20 - 2 * NODE_WIDTH ) / 3;
        var heightPadding = 5;
        var data = [202, 203, 204, 205, 206, 207];
        var self = this;
        data.forEach(function (purchaseId, index) {
            var payNode = uiUtil.createPayItemNode(purchaseId, self, self.onPayResult);
            payNode.anchorX = 0;
            payNode.anchorY = 1;
            payNode.x = widthPadding + (index % 2) * (widthPadding + NODE_WIDTH) + 10;
            payNode.y = self.contentTopLineHeight - ( Math.floor(index / 2) * (heightPadding + NODE_HEIGHT) + 5);
            self.bg.addChild(payNode);
            self.nodeMap[purchaseId] = payNode;
        });
    },

    onPayResult: function (purchaseId, payResult) {
        if (payResult == 1) {
            var payNode = this.nodeMap[purchaseId];
            payNode.updateStatus();
            payNode.updatePrice(stringUtil.getString(1192));
        }
    },

    onClickLeftBtn: function () {
        this.back();
    },

    onEnter: function () {
        this._super();
        cc.timer.pause();
    },
    
    onExit: function () {
        this._super();
        cc.timer.resume();
    }
});