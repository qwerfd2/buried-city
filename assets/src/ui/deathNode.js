var RELIVE_ITEMID = 1106054;
var DeathNode = BottomFrameNode.extend({
    ctor: function (userData) {
        this._super(userData);
    },
    _init: function () {
        this.setName(Navigation.nodeName.DEATH_NODE);
        this.uiConfig = {
            title: stringUtil.getString(1083),
            leftBtn: false,
            rightBtn: false
        };

        var leftEdge = 40;
        var rightEdge = this.bgRect.width - leftEdge;

        var digDes = autoSpriteFrameController.getSpriteFromSpriteName("#dig_death.png");
        digDes.setAnchorPoint(0.5, 1)
        digDes.setPosition(this.bgRect.width / 2, this.contentTopLineHeight - 10);
        this.bg.addChild(digDes);
        digDes.setName("dig_des");

        var des = new cc.LabelTTF(stringUtil.getString(1084, cc.timer.getFinalTimeStr(0)), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(rightEdge - leftEdge, 0));
        des.setAnchorPoint(0.5, 1);
        des.setPosition(this.bgRect.width / 2, digDes.y - digDes.height - 10);
        this.bg.addChild(des);
        des.setName("des");
        des.setColor(cc.color.WHITE);

        var btn1 = uiUtil.createCommonBtnWhite(stringUtil.getString(1085), this, this.onClickBtn1);
        btn1.setPosition(this.bgRect.width / 2, 100);
        this.bg.addChild(btn1);
        btn1.setName("btn_1");
        
        var reliveItemNum = player.bag.getNumByItemId(RELIVE_ITEMID) + player.storage.getNumByItemId(RELIVE_ITEMID) + player.safe.getNumByItemId(RELIVE_ITEMID);
        this.label1 = new cc.LabelTTF(stringUtil.getString(1087, reliveItemNum), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        this.label1.setAnchorPoint(0.5, 0);
        this.label1.x = btn1.x;
        this.label1.y = btn1.y + btn1.height / 2 + 10;
        this.bg.addChild(this.label1);

        var btn2 = uiUtil.createCommonBtnWhite(stringUtil.getString(1086), this, this.onClickBtn2);
        btn2.setPosition(this.bgRect.width / 2, 100);
        this.bg.addChild(btn2);
        btn2.setName("btn_2")

        btn2.x = this.bgRect.width / 4;
        btn1.x = this.bgRect.width / 4 * 3;
        this.label1.x = btn1.x;
        game.stop();
    },
    onClickBtn1: function () {
        if (this.validateBag()) {
            player.bag.decreaseItem(RELIVE_ITEMID, 1);
            this.goHome();
            return;
        }
        if (this.validateStorage()) {
            player.storage.decreaseItem(RELIVE_ITEMID, 1);
            this.goHome();
            return;
        }
        if (this.validateSafe()) {
            player.safe.decreaseItem(RELIVE_ITEMID, 1);
            this.goHome();
            return;
        }

        var self = this;
        var purchaseId = 203;
        var payDialog = uiUtil.showPayDialog(purchaseId, function () {
            utils.pay(purchaseId, self);
            if (self.validateStorage()) {
                self.label1.setString(stringUtil.getString(1087, 1));
                return;
            }
        });

        var priceLabel = payDialog.titleNode.getChildByName("price");
        priceLabel.setString("");
    },
    onClickBtn2: function () {
        cc.director.runScene(new EndScene());
    },
    onEnter: function () {
        this._super();
        cc.timer.pause();
    },
    onExit: function () {
        this._super();
        cc.timer.resume();
    },
    onClickLeftBtn: function () {
    },
    onClickRightBtn: function () {
    },
    goHome: function () {
        Navigation.root(Navigation.nodeName.HOME_NODE, -1);

        game.relive();
        cc.director.runScene(new MainScene());
        player.log.addMsg(1123, player.bag.getNumByItemId(RELIVE_ITEMID) + player.storage.getNumByItemId(RELIVE_ITEMID) + player.safe.getNumByItemId(RELIVE_ITEMID));
        setTimeout(function () {audioManager.playMusic(audioManager.music.HOME)}, 200);
    },
    validateBag: function () {
        return player.bag.validateItem(RELIVE_ITEMID, 1);
    },
    validateStorage: function () {
        return player.storage.validateItem(RELIVE_ITEMID, 1);
    },
    validateSafe: function () {
        return player.safe.validateItem(RELIVE_ITEMID, 1);
    }
});