var SiteNode = BottomFrameNode.extend({
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

        var template = stringUtil.getString(5000);
        var txt1 = new cc.LabelTTF(cc.formatStr(template.title.txt_1, this.site.getProgressStr(0, this.site.id)), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        txt1.setAnchorPoint(0, 1);
        txt1.setPosition(this.title.x, this.actionBarBaseHeight - 4);
        this.bg.addChild(txt1);

        var txt2 = new cc.LabelTTF(cc.formatStr(template.title.txt_2, this.site.storage.getAllItemNum()), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        txt2.setAnchorPoint(1, 1);
        txt2.setPosition(rightEdge + 20, this.actionBarBaseHeight - 4);
        this.bg.addChild(txt2);

        var digDes = autoSpriteFrameController.getSpriteFromSpriteName("#site_dig_" + this.site.id + ".png");
        digDes.setAnchorPoint(0.5, 1)
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
        if (this.site.id == 400) {
            btn1.setPosition(this.bgRect.width / 6, 100);
        } else {
            btn1.setPosition(this.bgRect.width / 4, 100);
        }
        this.bg.addChild(btn1);
        btn1.setName("btn_1");

        this.notifyIcon = new cc.Sprite('res/new/map_actor.png');
        this.notifyIcon.x = btn1.width - 5;
        this.notifyIcon.y = btn1.height - 5;
        btn1.addChild(this.notifyIcon);
        this.notifyIcon.setVisible(this.site.haveNewItems);

        var btn2 = uiUtil.createCommonBtnWhite(stringUtil.getString(1033), this, this.onClickBtn2);
        if (this.site.id == 400) {
            btn2.setPosition(this.bgRect.width / 6 * 5, 100);
        } else {
            btn2.setPosition(this.bgRect.width / 4 * 3, 100);
        }
        this.bg.addChild(btn2);
        btn2.setName("btn_2")
        btn2.setEnabled(!this.site.isSiteEnd());
        
        if (this.site.id == 400) {
            var btn3 = uiUtil.createCommonBtnWhite(stringUtil.getString("gachapon").title, this, this.onClickBtn3);
            btn3.setPosition(this.bgRect.width / 2, 100);
            this.bg.addChild(btn3);
            btn3.setName("btn_3")
        }

        if (userGuide.isStep(userGuide.stepName.ENTER_SITE)) {
            uiUtil.createIconWarn(btn2);
            userGuide.step();

            btn1.setVisible(false);
            btn2.x = this.bgRect.width / 2;

        } else if (userGuide.isStep(userGuide.stepName.BACK_SITE)) {
            uiUtil.createIconWarn(this.leftBtn);
            userGuide.step();
        } else if (userGuide.isStep(userGuide.stepName.BACK_SITE)) {
            uiUtil.createIconWarn(this.leftBtn);
            userGuide.step();
        }

        if (this.site.isUnderAttacked) {
            this.site.isUnderAttacked = false;
            this.showWarnDialog();
        }
    },
    onClickBtn1: function () {
        this.forward(Navigation.nodeName.SITE_STORAGE_NODE, this.userData);
        this.site.haveNewItems = false;
    },
    onClickBtn2: function () {
        if (this.site.id == 400) {
            this.forward(Navigation.nodeName.BAZAAR_NODE, this.userData);
        } else {
            this.forward(Navigation.nodeName.BATTLE_AND_WORK_NODE, this.userData);
        }
    },
    onClickBtn3: function () {
        var config = utils.clone(stringUtil.getString("gachaponDialog"));
        var strConfig = stringUtil.getString("gachapon");
        config.title.icon = "#site_202.png";
        config.title.title = strConfig.title;
        config.title.txt_1 = cc.formatStr(config.title.txt_1, 8);
        config.content.des = strConfig.des;
        var dialog = new DialogSmall(config);
        dialog.autoDismiss = false;
        this.btnPlay = uiUtil.createSpriteBtn({normal: "icon_ad_play.png"}, this, function () {
            if (player.currency < 8) {
                var config = {
                    title: {},
                    content: {des: stringUtil.getString(9028, Number(player.currency.toFixed(2)))},
                    action: {btn_1: {}}
                };
                config.action.btn_1.txt = stringUtil.getString(1073);
                var d = new DialogTiny(config);
                d.y = -94;
                d.show();
                return;
            }
            player.onCurrencyChange(-8);
            var rand = utils.getRandomInt(0, 399);
            var bound = 0;
            for (var i = 0; i < GachaponConfig.length; i++) {
                bound += GachaponConfig[i].weight;
                if (rand < bound) {
                    //this is it!
                    rand = i;
                    break;
                }
            }
            var itemId = GachaponConfig[rand].itemId;
            var num = GachaponConfig[rand].num;
            player.map.getSite(400).storage.increaseItem(itemId, num);
            Record.saveAll();
            player.map.getSite(400).haveNewItems = true;
            this.notifyIcon.setVisible(true);
            var str = stringUtil.getString(1069) + stringUtil.getString(itemId).title + " x" + num;
            player.log.addMsg(str);
            var config = {
                title: {},
                content: {des: str},
                action: {btn_1: {}}
            };
            config.action.btn_1.txt = stringUtil.getString(1030);
            var d = new DialogTiny(config);
            d.y = -94;
            d.show();
        });
        this.btnPlay.x = dialog.contentNode.width / 2;
        this.btnPlay.y = dialog.contentNode.height / 2 - 70;
        dialog.contentNode.addChild(this.btnPlay);
        var itemTableView = uiUtil.createItemListSlidersViewOnly(GachaponConfig);
        itemTableView.setPosition(20, 100);
        dialog.contentNode.addChild(itemTableView);
        dialog.show();
    },
    onEnter: function () {
        this._super();
    },
    onExit: function () {
        this._super();
    },

    onClickLeftBtn: function () {
        if (this.site.canClose()) {
            player.map.closeSite(this.site.id);
        }
        this.back();
        player.outSite();
    },

    showWarnDialog: function () {
        var config = {
            content: {des: stringUtil.getString(1264)},
            action: {btn_1: {}}
        };
        config.action.btn_1.txt = stringUtil.getString(1030);
        var dialog = new DialogTiny(config);
        dialog.show();
    }
});

var BazaarSiteNode = SiteNode.extend({
    onClickBtn1: function () {
        this.forward(Navigation.nodeName.BAZAAR_STORAGE_NODE, this.userData);
        this.site.haveNewItems = false;
    }
});