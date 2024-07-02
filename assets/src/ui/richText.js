var ItemRichText = cc.Node.extend({
    ctor: function (itemInfos, width, col, itemIconScale, txtDefaultColor, txtSize, leftEmpty) {
        this._super();
        this.width = width;
        this.col = col;
        this.itemIconScale = itemIconScale || 1;
        this.defaultColor = txtDefaultColor || cc.color.WHITE;
        this.txtSize = txtSize || uiUtil.fontSize.COMMON_3;
        this.leftEmpty = leftEmpty;
        this.updateView(itemInfos);
    },
    updateView: function (itemInfos) {
        this.removeAllChildren();

        var self = this;
        this.itemInfos = itemInfos;
        if (this.itemInfos.length > 0) {
            this.items = this.itemInfos.map(function (itemInfo) {
                return {
                    itemId: itemInfo.itemId,
                    txt: itemInfo.txt || "x" + itemInfo.num,
                    color: itemInfo.color || self.defaultColor
                }
            });

            this.row = Math.ceil(this.items.length / this.col);
            var colWidth = this.width / this.col;
            var rowHeight = 0;
            for (var i = 0; i < this.items.length; i++) {
                var itemInfo = this.items[i];
                var icon = autoSpriteFrameController.getSpriteFromSpriteName("#icon_item_" + itemInfo.itemId + ".png");
                icon.setScale(this.itemIconScale);
                this.addChild(icon);
                var txt = new cc.LabelTTF(itemInfo.txt, uiUtil.fontFamily.normal, this.txtSize);
                txt.setColor(itemInfo.color);
                this.addChild(txt);
                if (!rowHeight) {
                    rowHeight = Math.max(icon.getContentSize().height * this.itemIconScale, txt.getContentSize().height);
                    this.height = this.row * rowHeight;
                }

                var c = i % this.col;
                var r = Math.floor(i / this.col);
                icon.setAnchorPoint(0, 0.5);
                icon.setPosition(c * colWidth + 10, this.height - (r + 0.5) * rowHeight);
                txt.setAnchorPoint(1, 0.5);
                txt.setPosition(c * colWidth + colWidth - 10, this.height - (r + 0.5) * rowHeight);
            }
            this.setContentSize(this.width, this.height);
        } else if (!this.leftEmpty) {
            var none = new cc.LabelTTF(stringUtil.getString(1230), uiUtil.fontFamily.normal, this.txtSize);
            none.setColor(this.defaultColor);
            none.anchorX = 0;
            this.addChild(none);
        }
    }
});