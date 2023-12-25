var AdSiteNode = BottomFrameNode.extend({
    ctor: function (userData) {
        this._super(userData);
    },
    _init: function () {
        this.site = player.map.getSite(this.userData);
        this.setName(Navigation.nodeName.SITE_NODE);
        this.uiConfig = {
            title: this.site.getName(),
            leftBtn: true,
            rightBtn: false
        };

        player.enterSite(this.site.id);

        var leftEdge = 40;
        var rightEdge = this.bgRect.width - leftEdge;

        this.title.anchorX = 0;
        this.title.anchorY = 1;
        this.title.x = this.leftBtn.x + this.leftBtn.width / 2 + 10;
        this.title.y = this.bgRect.height - 5;

        this.txt2 = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        this.txt2.setAnchorPoint(1, 1);
        this.txt2.setPosition(rightEdge + 20, this.actionBarBaseHeight - 4);
        this.bg.addChild(this.txt2);

        var digDes = autoSpriteFrameController.getSpriteFromSpriteName("#site_dig_" + this.site.id + ".png");
        digDes.setAnchorPoint(0.5, 1);
        digDes.setPosition(this.bgRect.width / 2, this.contentTopLineHeight - 50);
        this.bg.addChild(digDes);
        digDes.setName("dig_des");

        var des = new cc.LabelTTF(this.site.getDes(), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(rightEdge - leftEdge, 0));
        des.setAnchorPoint(0.5, 1);
        des.setPosition(this.bgRect.width / 2, digDes.y - digDes.height - 40);
        this.bg.addChild(des);
        des.setName("des");
        des.setColor(cc.color.WHITE);

        var btn1 = uiUtil.createCommonBtnWhite(stringUtil.getString(1032), this, this.onClickBtn1);
        btn1.setPosition(this.bgRect.width / 2, 100);
        this.bg.addChild(btn1);
        btn1.setName("btn_1")

        this.notifyIcon = new cc.Sprite('res/new/map_actor.png');
        this.notifyIcon.x = btn1.width - 5;
        this.notifyIcon.y = btn1.height - 5;
        btn1.addChild(this.notifyIcon);

        this.stop = autoSpriteFrameController.getSpriteFromSpriteName("icon_ad_stop.png");
        this.stop.setPosition(digDes.width / 2, digDes.height / 2);
        digDes.addChild(this.stop);

        this.playHighlight = autoSpriteFrameController.getSpriteFromSpriteName('icon_ad_play_highlight.png');
        this.playHighlight.x = digDes.width / 2;
        this.playHighlight.y = digDes.height / 2;
        this.playHighlight.setScale(0.8);
        digDes.addChild(this.playHighlight);

        var btnPlay = uiUtil.createBigBtnWhite(stringUtil.getString(9019), this, function () {
            cc.timer.updateTime(1800);
            adHelper.onAdStatusChange(adHelper.AD_STATUS_DISMISS);
        });
        btnPlay.x = this.playHighlight.width / 2;
        btnPlay.y = this.playHighlight.height / 2;
        this.playHighlight.addChild(btnPlay);

        this.changeAdPlayStatus(cc.sys.localStorage.getItem("ad") == "1");
    },
    changeAdPlayStatus: function (canPlay) {
        this.stop.setVisible(!canPlay);
        this.playHighlight.setVisible(canPlay);

        var template = stringUtil.getString(5000);
        this.txt2.setString(cc.formatStr(template.title.txt_2, this.site.storage.getAllItemNum()));

        this.notifyIcon.setVisible(this.site.haveNewItems);
    },
    onClickBtn1: function () {
        this.forward(Navigation.nodeName.AD_STORAGE_NODE, this.userData);
        this.site.haveNewItems = false;
    },
    onEnter: function () {
        this._super();
        adHelper.addAdListener(this, this.onAdStatusChange);
    },
    onExit: function () {
        this._super();
        adHelper.removeAdListener();
    },

    onAdStatusChange: function (adStatus) {
        var canReward = adStatus === adHelper.AD_STATUS_DISMISS;
        if (canReward) {

            var adc = utils.clone(adConfig);
            var itemIds = utils.getFixedValueItemIds(adc.reward.produceValue, adc.reward.produceList);
            var items = utils.convertItemIds2Item(itemIds);
            var self = this;
            items.forEach(function (item) {
                self.site.increaseItem(item.itemId, item.num, false);
            });
            Record.saveAll();
            cc.sys.localStorage.setItem("ad", "0");
        }

        var canPlay = adStatus === adHelper.AD_STATUS_READY;
        this.changeAdPlayStatus(canPlay);
    },

    onClickLeftBtn: function () {
        if (this.site.canClose()) {
            player.map.closeSite(this.site.id);
        }
        this.back();
        player.outSite();
    }
});