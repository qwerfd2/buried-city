var SiteStorageNode = BottomFrameNode.extend({
    ctor: function (userData) {
        this._super(userData);
    },
    _init: function () {
        this.site = player.map.getSite(this.userData);
        this.setName(Navigation.nodeName.SITE_STORAGE_NODE);
        this.uiConfig = {
            title: this.site.getName(),
            leftBtn: true,
            rightBtn: false
        };
        var equipNode = new EquipNode();
        equipNode.setAnchorPoint(0.5, 1);
        equipNode.setPosition(this.bgRect.width / 2, this.contentTopLineHeight);
        this.bg.addChild(equipNode, 1);

        var itemChangeNode = new ItemChangeNode(player.bag, stringUtil.getString(1034), this.site.storage, stringUtil.getString(1032), true, false, this.site);
        itemChangeNode.setAnchorPoint(0.5, 0);
        itemChangeNode.setPosition(this.bgRect.width / 2, 0);
        this.bg.addChild(itemChangeNode);
    },
    onEnter: function () {
        this._super();
    },
    onExit: function () {
        this._super();
    },
    onClickLeftBtn: function () {
        this.back();
    }
});

var AdStorageNode = SiteStorageNode.extend({});

var BazaarStorageNode = SiteStorageNode.extend({});