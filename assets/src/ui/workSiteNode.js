/**
 * Created by lancelot on 15/4/22.
 */
var workSiteConfig = {
    costTime: 120,
    needItems: [
        {itemId: 1102063, num: 1}
    ],
    lastTime: 168 * 60,
    brokenProbability: 0.02
};
var WorkSiteNode = BottomFrameNode.extend({
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
        this.actionView.setPosition(this.bgRect.width / 2, 100);
        this.bg.addChild(this.actionView, 1);

        this.updateView();
    },
    onClickFix: function () {
        var pastTime = 0;
        var self = this;
        var time = workSiteConfig.costTime * 60;
        if (IAPPackage.isHandyworkerUnlocked()) {
            time = Math.round(time * 0.7);
        }

        cc.timer.addTimerCallback(new TimerCallback(time, this, {
            process: function (dt) {
                pastTime += dt;
                self.actionView.updatePercentage(pastTime / time * 100);
            },
            end: function () {
                var items = utils.clone(workSiteConfig.needItems);
                player.costItemsInBag(items);
                self.site.fix();
                Achievement.checkCost(1, 1);
                Record.saveAll();

                self.updateView(0);
            }
        }));
        cc.timer.accelerateWorkTime(time);
    },
    updateView: function (temp) {
        var hint;
        var needItems = utils.clone(workSiteConfig.needItems);
        var res = player.validateItemsInBag(needItems);
        needItems = needItems.map(function (itemInfo) {
            return {
                itemId: itemInfo.itemId,
                num: itemInfo.num,
                color: itemInfo.haveNum >= itemInfo.num ? cc.color.WHITE : cc.color.RED
            };
        });
        var time = workSiteConfig.costTime;
        if (IAPPackage.isHandyworkerUnlocked()) {
            time = Math.round(time * 0.7);
        }
        cc.log('res ' + res + ' isActive ' + this.site.isActive);
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
        if (this.site.canClose()) {
            player.map.closeSite(this.site.id);
        }
        this.back();
        player.outSite();
    }
});