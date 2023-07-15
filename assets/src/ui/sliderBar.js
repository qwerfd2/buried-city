var SliderBar = cc.Node.extend({
    ctor: function (size) {
        this._super();

        this.setContentSize(size);
        this.setAnchorPoint(0.5, 0.5);

        var drawNode = new cc.DrawNode();
        this.addChild(drawNode);
        drawNode.drawRect(cc.p(0, 0), cc.p(this.width, this.height), cc.color(128, 128, 128, 255), 1, cc.color(128, 128, 128, 10));

        this.bar = new cc.Node();
        this.bar.setContentSize(this.width + 10, this.height);
        this.bar.setAnchorPoint(0.5, 0);
        this.bar.x = this.width / 2;
        this.bar.y = 0;
        var barDrawNode = new cc.DrawNode();
        barDrawNode.setName('draw');
        this.bar.addChild(barDrawNode);
        barDrawNode.drawRect(cc.p(0, 0), cc.p(this.bar.width, this.bar.height), cc.color(212, 212, 212, 255), 1, cc.color(212, 212, 212, 10));

        this.addChild(this.bar);

        this.setVisible(false);
    },
    //根据显示区域和数据总区域的比值
    updateBarSize: function (viewPercent) {
        this.bar.height = this.height * viewPercent;
        if (this.bar.getChildByName('draw')) {
            this.bar.removeChildByName('draw');
        }
        var barDrawNode = new cc.DrawNode();
        barDrawNode.setName('draw');
        this.bar.addChild(barDrawNode);
        barDrawNode.drawRect(cc.p(0, 0), cc.p(this.bar.width, this.bar.height), cc.color(212, 212, 212, 255), 1, cc.color(212, 212, 212, 10));
    },
    onScroll: function (positionPercent) {
        if (positionPercent >= 0 && positionPercent < 1) {
            var totalHeight = this.height - this.bar.height;
            var posY = positionPercent * totalHeight;
            this.bar.y = posY;

            var self = this;
            this.unscheduleAllCallbacks();
            this.scheduleOnce(function () {
                self.setVisible(false);
            }, 2)
        }

        if (this.height > this.bar.height) {
            this.setVisible(true);
        } else {
            this.setVisible(false);
        }
    }
});