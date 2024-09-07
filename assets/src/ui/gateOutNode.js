var GateOutNode = BottomFrameNode.extend({
    ctor: function (userData) {
        this._super(userData);
    },
    _init: function () {
        this.setName(Navigation.nodeName.GATE_OUT_NODE);
        this.uiConfig = {
            title: "",
            leftBtn: false,
            rightBtn: false
        };

        var gateOutBg = autoSpriteFrameController.getSpriteFromSpriteName("#gate_out_bg.png");
        gateOutBg.setAnchorPoint(0.5, 0.5);
        gateOutBg.setPosition(this.bgRect.width / 2, this.bgRect.height / 2);
        this.bg.addChild(gateOutBg, -1);
        this.line.setVisible(false);

        var self = this;
        var btn = new Button(this.bgRect);
        btn.setClickListener(this, function () {
            self.goOut();
        });
        btn.x = this.bgRect.width / 2;
        btn.y = this.bgRect.height / 2;
        this.bg.addChild(btn);

        var leftPadding = 30;

        var labelTip = new cc.LabelTTF(stringUtil.getString(1167), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(this.bgRect.width - 2 * leftPadding, 0));
        labelTip.setAnchorPoint(0, 0);
        labelTip.setPosition(leftPadding, 400);
        this.bg.addChild(labelTip);

        var tipArray = stringUtil.getString(3011);
        var tipStr = tipArray[utils.getRandomInt(0, tipArray.length - 1)];
        var tip = new cc.LabelTTF(tipStr, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(this.bgRect.width - 2 * leftPadding, 0));
        tip.setAnchorPoint(0, 1);
        tip.setPosition(leftPadding, labelTip.y - 20);
        this.bg.addChild(tip);

        this.scheduleOnce(function () {
            self.goOut();
        }, 3);

    },
    goOut: function () {
        player.map.deleteUnusableSite();
        this.forward(Navigation.nodeName.MAP_NODE);
    },
    onEnter: function () {
        this._super();
    },
    onExit: function () {
        this._super();
    }
});