/**
 * User: Alex
 * Date: 15/1/5
 * Time: 下午4:07
 */
var Navigation = {
    _array: null,
    _map: {},
    currentMusic: null,
    nodeName: {
        BOTTOM_FRAME_NODE: "BottomFrameNode",
        HOME_NODE: "HomeNode",
        BUILD_NODE: "BuildNode",
        STORAGE_NODE: "StorageNode",
        GATE_NODE: "GateNode",
        MAP_NODE: "MapNode",
        SITE_NODE: "SiteNode",
        AD_SITE_NODE: "AdSiteNode",
        WORK_SITE_NODE: "WorkSiteNode",
        BOSS_SITE_NODE: "BossSiteNode",
        SITE_STORAGE_NODE: "SiteStorageNode",
        NPC_NODE: "NpcNode",
        NPC_STORAGE_NODE: "NpcStorageNode",
        BATTLE_AND_WORK_NODE: "BattleAndWorkNode",
        WORK_ROOM_STORAGE_NODE: "WorkRoomStorageNode",
        DEATH_NODE: "DeathNode",
        RADIO_NODE: "RadioNode",
        GATE_OUT_NODE: "GateOutNode",
        SHOP_NODE: "ShopNode",
        AD_STORAGE_NODE: "AdStorageNode"
    },
    siteMusic: null,
    forward: function (nodeName, userData) {
        this._array.push({nodeName: nodeName, userData: userData});
        return this.current();
    },
    back: function () {
        this._array.pop();
        return this.current();
    },
    current: function () {
        if (this._array.length === 0) {
            return this.forward(this.nodeName.HOME_NODE);
        } else {
            var nodeInfo = this._array[this._array.length - 1];
            var clz = this.getClz(nodeInfo.nodeName);
            var node = new clz(nodeInfo.userData);
            node.setName("bottom");

            var musicName;
            switch (nodeInfo.nodeName) {
                case this.nodeName.HOME_NODE:
                    musicName = audioManager.music.HOME;
                    break;
                case this.nodeName.BUILD_NODE:
                    musicName = audioManager.music.HOME;
                    break;
                case this.nodeName.STORAGE_NODE:
                    musicName = audioManager.music.HOME;
                    break;
                case this.nodeName.GATE_NODE:
                    musicName = audioManager.music.HOME;
                    break;
                case this.nodeName.RADIO_NODE:
                    musicName = audioManager.music.HOME;
                    break;
                case this.nodeName.GATE_OUT_NODE:
                    musicName = audioManager.music.HOME;
                    break;
                case this.nodeName.DEATH_NODE:
                    musicName = audioManager.music.DEATH;
                    this.changeSiteMusic();
                    break;
                case this.nodeName.MAP_NODE:
                    musicName = audioManager.music.MAP;
                    this.changeSiteMusic();
                    break;
                case this.nodeName.NPC_NODE:
                    musicName = audioManager.music.NPC;
                    break;
                case this.nodeName.NPC_STORAGE_NODE:
                    musicName = audioManager.music.NPC;
                    break;
                case this.nodeName.SITE_NODE:
                    musicName = this.getSiteMusic();
                    break;
                case this.nodeName.AD_SITE_NODE:
                    musicName = audioManager.music.NPC;
                    break;
                case this.nodeName.WORK_SITE_NODE:
                    musicName = this.getSiteMusic();
                    break;
                case this.nodeName.BOSS_SITE_NODE:
                    musicName = this.getSiteMusic();
                    break;
                case this.nodeName.SITE_STORAGE_NODE:
                    musicName = this.getSiteMusic();
                    break;
                case this.nodeName.BATTLE_AND_WORK_NODE:
                    musicName = this.getSiteMusic();
                    break;
                case this.nodeName.WORK_ROOM_STORAGE_NODE:
                    musicName = this.getSiteMusic();
                    break;
                case this.nodeName.WORK_ROOM_STORAGE_NODE:
                    musicName = audioManager.music.NPC;
                    break;
                case this.nodeName.AD_STORAGE_NODE:
                    musicName = audioManager.music.NPC;
                    break;
                case this.nodeName.SHOP_NODE:
                    musicName = audioManager.music.HOME;
                    break;             
            }
            if ((musicName && musicName != this.currentMusic) || !this.currentMusic) {
                audioManager.stopMusic(this.currentMusic);
                this.currentMusic = musicName;
                audioManager.playMusic(this.currentMusic, true);
            }
            this.save();
            node.afterInit();
            return node;
        }
    },
    getSiteMusic: function () {
        if (!this.siteMusic) {
            var musicPool = [audioManager.music.SITE_1, audioManager.music.SITE_2, audioManager.music.SITE_3];
            this.siteMusic = musicPool[utils.getRandomInt(0, musicPool.length - 1)];
        }
        return this.siteMusic;
    },
    changeSiteMusic: function () {
        this.siteMusic = null;
    },
    stopMusic: function () {
        if (this.currentMusic) {
            audioManager.stopMusic(this.currentMusic);
            this.currentMusic = null;
        }
    },
    root: function (nodeName, userData) {
        this._array = [];
        return this.forward(nodeName, userData);
    },
    replace: function (nodeName, userData) {
        this._array.pop();
        return this.forward(nodeName, userData);
    },
    init: function () {
        this._array = [];
        this._map["BottomFrameNode"] = BottomFrameNode.prototype.constructor;
        this._map["HomeNode"] = HomeNode.prototype.constructor;
        this._map["BuildNode"] = BuildNode.prototype.constructor;
        this._map["StorageNode"] = StorageNode.prototype.constructor;
        this._map["GateNode"] = GateNode.prototype.constructor;
        this._map["MapNode"] = MapNode.prototype.constructor;
        this._map["SiteNode"] = SiteNode.prototype.constructor;
        this._map["AdSiteNode"] = AdSiteNode.prototype.constructor;
        this._map["WorkSiteNode"] = WorkSiteNode.prototype.constructor;
        this._map["BossSiteNode"] = BossSiteNode.prototype.constructor;
        this._map["SiteStorageNode"] = SiteStorageNode.prototype.constructor;
        this._map["NpcNode"] = NpcNode.prototype.constructor;
        this._map["NpcStorageNode"] = NpcStorageNode.prototype.constructor;
        this._map["BattleAndWorkNode"] = BattleAndWorkNode.prototype.constructor;
        this._map["WorkRoomStorageNode"] = WorkRoomStorageNode.prototype.constructor;
        this._map["DeathNode"] = DeathNode.prototype.constructor;
        this._map["RadioNode"] = RadioNode.prototype.constructor;
        this._map["GateOutNode"] = GateOutNode.prototype.constructor;
        this._map["ShopNode"] = ShopNode.prototype.constructor;
        this._map["AdStorageNode"] = AdStorageNode.prototype.constructor;
        this.restore();
    },
    getClz: function (nodeName) {
        return this._map[nodeName];
    },
    gotoDeathNode: function () {
        //去除所有dialog
        cc.director.getRunningScene().removeChildByName("dialog");
        var layer = cc.director.getRunningScene().getChildByName("main")
        layer.addChild(Navigation.root(Navigation.nodeName.DEATH_NODE));
        layer.removeChildByName("bottom");
    },
    save: function () {
        var saveObj = {
            _array: this._array
        };
        Record.save("navigation", saveObj);
        Record.saveAll();
    },
    restore: function () {
        var saveObj = Record.restore("navigation");
        if (saveObj) {
            this._array = saveObj._array;
        }
    }
};

var BottomFrameNode = cc.Node.extend({
    ctor: function (userData) {
        this._super();
        this.userData = userData;
        this.initRes();
        this.bg = autoSpriteFrameController.getSpriteFromSpriteName("#frame_bg_bottom.png");
        if (Record.getScreenFix()) {
            this.bg.setScale(0.9);
        }
        this.bg.setAnchorPoint(0.5, 0);
        this.bg.setPosition(cc.winSize.width / 2, 18);
        this.addChild(this.bg);
        this.bgRect = cc.rect(0, 0, this.bg.width, this.bg.height);
        this.contentTopLineHeight = 770;
        this.line = autoSpriteFrameController.getSpriteFromSpriteName("#frame_line.png");
        this.line.setPosition(this.bgRect.width / 2, this.contentTopLineHeight);
        this.bg.addChild(this.line, 1);
        var actionBarBaseHeight = 803;
        this.actionBarBaseHeight = actionBarBaseHeight;
        this.title = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_1);
        this.title.setPosition(this.bgRect.width / 2, actionBarBaseHeight);
        this.bg.addChild(this.title);
        this.leftBtn = new SpriteButton(cc.size(100, 70), "btn_back.png", null, "btn_back_disabled.png");
        this.leftBtn.setClickListener(this, this.onClickLeftBtn);
        this.leftBtn.setPosition(60, actionBarBaseHeight);
        this.bg.addChild(this.leftBtn, 2);
        this.rightBtn = new SpriteButton(cc.size(100, 70), "btn_forward.png", null, "btn_forward_disabled.png");
        this.rightBtn.setClickListener(this, this.onClickRightBtn);
        this.rightBtn.setPosition(this.bgRect.width - 60, actionBarBaseHeight);
        this.bg.addChild(this.rightBtn, 2);
        this._init();
        this.title.setString(this.uiConfig.title);
        this.leftBtn.setVisible(this.uiConfig.leftBtn);
        this.rightBtn.setVisible(this.uiConfig.rightBtn);
        return true;
    },
    _init: function () {
        this.setName(Navigation.nodeName.BOTTOM_FRAME_NODE);
        this.uiConfig = {
            title: Navigation.nodeName.BOTTOM_FRAME_NODE,
            leftBtn: false,
            rightBtn: true
        };
    },
    onClickLeftBtn: function () {
    },
    onClickRightBtn: function () {
        //this.forward(Navigation.nodeName.HOME_NODE);

    },

    forward: function (nodeName, userData) {
        var parent = this.getParent();
        this.removeFromParent();
        parent.addChild(Navigation.forward(nodeName,userData));
    },
    back: function () {
        var parent = this.getParent();
        this.removeFromParent();
        parent.addChild(Navigation.back());
    },
    replace: function (nodeName, userData) {
        var parent = this.getParent();
        this.removeFromParent();
        parent.addChild(Navigation.replace(nodeName,userData));
    },

    onExit: function () {
        this._super();
        utils.emitter.off("left_btn_enabled", this.func);
        utils.emitter.off("nextStep");
        this.releaseRes();
    },

    onEnter: function () {
        var self = this;
        this._super();
        this.func = this.setLeftBtnEnabled();
        utils.emitter.on("left_btn_enabled", this.func);
    },

    buildNodeUpdate: function () {
        var self = this;
        return function () {
            self.updateUpgradeView();
            self.updateData();
            self.tableView.reloadData();
        };
    },
    setLeftBtnEnabled: function () {
        var self = this;
        return function (enabled) {
            self.leftBtn.setEnabled(enabled);
        };
    },
    initRes: function () {
    },
    releaseRes: function () {
    },
    afterInit: function () {
    }
});