var BazaarNode = BottomFrameNode.extend({

    ctor: function(userData) {
        this._super(userData);

    },
    _init: function() {
        this.uiConfig = {
            title: stringUtil.getString("site_400").name,
            leftBtn: true,
            rightBtn: false
        };
        this.pay();
    },

    pay: function() {
        var self = this;
        self.remove();
        this.nodeMap = {};
        var data = player.shopList;
        data.sort(function(a, b) {
            var aa = player.getPrice(a.itemId);
            var bb = player.getPrice(b.itemId);
            return aa > bb;
        })
        var NODE_WIDTH = 246;
        var NODE_HEIGHT = 249;
        var widthPadding = (this.bgRect.width - 20 - 2 * NODE_WIDTH ) / 3;
        var heightPadding = 0;
        data.forEach(function(purchaseItem, index) {
            if (purchaseItem.amount > 0) {
                var payNode = uiUtil.bazaarItem(purchaseItem, {});
                payNode.anchorX = 0;
                payNode.anchorY = 1;
                payNode.x = widthPadding + (index % 2) * (widthPadding + NODE_WIDTH) + 10;
                payNode.y = self.contentTopLineHeight - ( Math.floor(index / 2) * (heightPadding + NODE_HEIGHT) + 5);
                self.bg.addChild(payNode);
                self.nodeMap[purchaseItem.itemId] = payNode;
            }

        });

    },

    remove: function() {
        var self = this;
        for (var purchaseId in self.nodeMap) {
            var payNode = self.nodeMap[purchaseId];
            payNode.removeFromParent();
        }
    },

    onClickLeftBtn: function() {
        this.back();
    },

    onEnter: function() {
        this._super();
        var self = this;
        utils.emitter.on("pay", function() {
            self.pay();
        });
    },

    onExit: function() {
        this._super();
        utils.emitter.off("pay");
        
    }
});