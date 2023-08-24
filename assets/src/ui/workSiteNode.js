var workSiteConfig = {
    costTime: 120,
    needItems: [
        {itemId: 1102063, num: 1}
    ],
    lastTime: 96 * 60,
    brokenProbability: 0.02
};
var gasSiteConfig = {
    costTime: 90,
    needItems: [
        {itemId: 1102073, num: 1}
    ],
    lastTime: 72 * 60,
    brokenProbability: 0.02
};

var WorkSiteNode = BottomFrameNode.extend({
    ctor: function (userData) {
        this._super(userData);
    },
    _init: function () {
        this.clickDisabled = false;
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
        btn1.setPosition(this.bgRect.width / 4, 80);
        this.bg.addChild(btn1);
        btn1.setName("btn_1");

        this.notifyIcon = new cc.Sprite('res/new/map_actor.png');
        this.notifyIcon.x = btn1.width - 5;
        this.notifyIcon.y = btn1.height - 5;
        btn1.addChild(this.notifyIcon);
        this.notifyIcon.setVisible(this.site.haveNewItems);

        var btn2 = uiUtil.createCommonBtnWhite(stringUtil.getString(1033), this, this.onClickBtn2);
        btn2.setPosition(this.bgRect.width / 4 * 3, 80);
        this.bg.addChild(btn2);
        btn2.setName("btn_2")
        btn2.setEnabled(!this.site.isSiteEnd());

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
            this.showWarnDialog(1264);
        }

        var self = this;
        this.actionView = uiUtil.createCommonListItem(
            {
                target: this, cb: function () {
            }
            },
            {
                target: this, cb: self.onClickFix
            }
        );

        this.actionView.setAnchorPoint(0.5, 0.5);
        this.actionView.setPosition(this.bgRect.width / 2, 180);
        this.bg.addChild(this.actionView, 1);

        this.updateView();
    },
    
    onClickBtn1: function () {
        if (!this.clickDisabled) {
            this.forward(Navigation.nodeName.SITE_STORAGE_NODE, this.userData);
            this.site.haveNewItems = false;
        } 
    },
    onClickBtn2: function () {
        if (!this.clickDisabled) {
            if (this.site.id == 400) {
                this.forward(Navigation.nodeName.BAZAAR_NODE, this.userData);
            } else {
                this.forward(Navigation.nodeName.BATTLE_AND_WORK_NODE, this.userData);
            }
        }
    },
    onClickFix: function () {
        this.actionView.updateView({
            action1Disabled: true
        });
        var time;
        if (this.site.id == 204) {
            time = workSiteConfig.costTime * 60;
        } else {
            time = gasSiteConfig.costTime * 60;
            if (!player.hasMotocycle()) {
                this.showWarnDialog(6669);
                return;
            }
        }
        this.clickDisabled = true;
        var pastTime = 0;
        var self = this;
        if (IAPPackage.isHandyworkerUnlocked()) {
            time = Math.round(time * 0.7);
        }

        cc.timer.addTimerCallback(new TimerCallback(time, this, {
            process: function (dt) {
                pastTime += dt;
                self.actionView.updatePercentage(pastTime / time * 100);
            },
            end: function () {
                var items;
                if (self.site.id == 204) {
                    items = utils.clone(workSiteConfig.needItems);
                    Achievement.checkCost(1, 1);
                } else {
                    items = utils.clone(gasSiteConfig.needItems);
                }
                player.costItemsInBag(items);
                self.site.fix();
                self.clickDisabled = false;
                self.updateView(0);
            }
        }));
        cc.timer.accelerateWorkTime(time);
    },
    updateView: function (temp) {
        var hint;
        var needItems;
        var time;
        if (this.site.id == 204) {
            needItems = utils.clone(workSiteConfig.needItems);
            time = workSiteConfig.costTime;
        } else {
            needItems = utils.clone(gasSiteConfig.needItems);
            time = gasSiteConfig.costTime;
        }
        var res = player.validateItemsInBag(needItems);
        needItems = needItems.map(function (itemInfo) {
            return {
                itemId: itemInfo.itemId,
                num: itemInfo.num,
                color: itemInfo.haveNum >= itemInfo.num ? cc.color.WHITE : cc.color.RED
            };
        });
        if (IAPPackage.isHandyworkerUnlocked()) {
            time = Math.round(time * 0.7);
        }
        var actionDisabled = !res || this.site.isActive || temp;

        this.actionView.updateView({
            iconName: "#build_action_fix.png",
            hint: hint,
            hintColor: hint ? cc.color.RED : null,
            items: needItems,
            action1: stringUtil.getString(1323, time),
            action1Disabled: actionDisabled,
            percentage: 0
        });
    },
    onEnter: function () {
        this._super();
    },
    onExit: function () {
        this._super();
    },

    onClickLeftBtn: function () {
        if (!this.clickDisabled) {
            if (this.site.canClose()) {
                player.map.closeSite(this.site.id);
            }
            this.back();
            player.outSite();
        }
    },
    showWarnDialog: function (num) {
        var config = {
            content: {des: stringUtil.getString(num)},
            action: {btn_1: {}}
        };
        config.action.btn_1.txt = stringUtil.getString(1030);
        var dialog = new DialogTiny(config);
        dialog.show();
    }
});