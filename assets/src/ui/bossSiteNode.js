var BossSiteNode = BottomFrameNode.extend({
    ctor: function (userData) {
        this._super(userData);
    },
    _init: function () {
        this.site = player.map.getSite(this.userData);
        this.setName(Navigation.nodeName.SITE_NODE);
        this.uiConfig = {
            title: this.site.getName(),
            leftBtn: false,
            rightBtn: false
        };
        player.enterSite(this.site.id);

        var bossSiteBg = autoSpriteFrameController.getSpriteFromSpriteName("new_site_bg.png");
        bossSiteBg.setAnchorPoint(0.5, 0);
        bossSiteBg.setPosition(this.bgRect.width / 2, 0);
        this.bg.addChild(bossSiteBg, 2);

        var bossSubSiteIds = [301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312];
        this.btnList = {};
        var self = this;
        bossSubSiteIds.forEach(function (siteId) {
            var config = utils.clone(siteConfig[siteId]);
            var pos = config.coordinate;
            var btn = new ButtonAtSite("boss_sub_site_" + siteId + ".png");
            btn.setClickListener(self, self.onClickSite);
            btn.setPosition(pos);
            bossSiteBg.addChild(btn);
            btn.siteId = siteId;

            self.btnList[siteId] = btn;
            self.updateBtn(siteId);
        });

        var btnExit = new ButtonAtSite("boss_sub_site_exit.png");
        btnExit.setClickListener(this, this.onClickLeftBtn);
        btnExit.setPosition(cc.p(506.5, 50.5));
        bossSiteBg.addChild(btnExit);
        btnExit.changeType(ButtonAtSiteType.WHITE);
    },
    updateBtn: function (siteId) {
        var btn = this.btnList[siteId];
        var site = player.map.getSite(siteId);
        var iconName;
        if (site) {
            btn.changeType(ButtonAtSiteType.WHITE);
            btn.setEnabled(true);
            if (!site.isSiteEnd()) {
                iconName = 'icon_room_active.png';
                btn.changeType(ButtonAtSiteType.MID);
            }
        } else {
            btn.changeType(ButtonAtSiteType.BLACK);
            btn.setEnabled(false);
            iconName = 'icon_room_lock.png';
        }
        this.createBtnStatusIcon(btn, iconName);
    },

    createBtnStatusIcon: function (btn, iconName) {
        var name = 'status';
        if (btn.getChildByName(name)) {
            btn.removeChildByName(name);
        }
        if (iconName) {
            var warn = autoSpriteFrameController.getSpriteFromSpriteName(iconName);
            warn.setName(name);
            warn.x = btn.width / 2;
            warn.y = btn.height / 2;
            btn.addChild(warn, 11);

            if (iconName == 'icon_room_active.png') {
                warn.runAction(cc.repeatForever((cc.sequence(cc.fadeOut(1.5), cc.fadeIn(1.5)))));
            }
        }
    },
    onClickSite: function (sender) {
        this.forward(Navigation.nodeName.SITE_NODE, sender.siteId);
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