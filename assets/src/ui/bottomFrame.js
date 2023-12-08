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
        AD_STORAGE_NODE: "AdStorageNode",
        BAZAAR_SITE_NODE: "BazaarSiteNode",
        BAZAAR_STORAGE_NODE: "BazaarStorageNode",
        BAZAAR_NODE: "BazaarNode",
        DOG_NODE: "DogNode"
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
                    switch (Number(cc.sys.localStorage.getItem("weather")) || 0) {
                        case 0:
                            musicName = audioManager.music.MAP_CLOUDY;
                            break;
                        case 1:
                            musicName = audioManager.music.MAP_SUNNY;
                            break;
                        case 2:
                            musicName = audioManager.music.MAP_RAIN;
                            break;
                        case 3:
                            musicName = audioManager.music.MAP_SNOW;
                            break;
                        case 4:
                            musicName = audioManager.music.MAP_FOG;
                            break;                
                    };
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
                case this.nodeName.BAZAAR_NODE:
                    musicName = audioManager.music.NPC;
                    break;
                case this.nodeName.BAZAAR_STORAGE_NODE:
                    musicName = audioManager.music.NPC;
                    break;
                case this.nodeName.BAZAAR_SITE_NODE:
                    musicName = audioManager.music.NPC;
                    break;
                case this.nodeName.DOG_NODE:
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
    updateMapMusic: function () {
        if (this._array[this._array.length - 1].nodeName == this.nodeName.MAP_NODE) {
            var musicName;
            switch (Number(cc.sys.localStorage.getItem("weather")) || 0) {
                case 0:
                    musicName = audioManager.music.MAP_CLOUDY;
                    break;
                case 1:
                    musicName = audioManager.music.MAP_SUNNY;
                    break;
                case 2:
                    musicName = audioManager.music.MAP_RAIN;
                    break;
                case 3:
                    musicName = audioManager.music.MAP_SNOW;
                    break;
                case 4:
                    musicName = audioManager.music.MAP_FOG;
                    break;                
            };
            this.changeSiteMusic();
            if ((musicName && musicName != this.currentMusic) || !this.currentMusic) {
                audioManager.stopMusic(this.currentMusic);
                this.currentMusic = musicName;
                audioManager.playMusic(this.currentMusic, true);
            }
        }
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
        this._map["BazaarNode"] = BazaarNode.prototype.constructor;
        this._map["DogNode"] = DogNode.prototype.constructor;
        this._map["BazaarSiteNode"] = BazaarSiteNode.prototype.constructor;
        this._map["BazaarStorageNode"] = BazaarStorageNode.prototype.constructor;
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
    gotoDogNode: function () {
        if (IS_IN_DOG_NODE || player.isDead) {
            return;
        }
        if (player.isAtHome) {
            var layer = cc.director.getRunningScene().getChildByName("main")
            layer.addChild(Navigation.root(Navigation.nodeName.DOG_NODE));
            layer.removeChildByName("bottom");
        } else {
            var config = utils.clone(stringUtil.getString("statusDialog"));
            config.title.title = player.getDogName();
            config.content.dig_des = "#dig_item_1106013.png";
            config.title.txt_1 = "";
            config.content.des = player.getStatStr();
            var dialog = new DialogBig(config);
            dialog.autoDismiss = true;
            
            var btnSize2 = cc.size(30, 30);
            var createAttrButton = function (attr, needStatusStr, stringId, reversPercentage, warnRange) {
                var btn = new AttrButton(btnSize2, attr, "", warnRange, {scale: 0.5});
                btn.setName(attr);

                utils.emitter.on(attr + "_change", function (value) {
                    btn.updateAttrBtn();
                });
                btn.updateAttrBtn = function () {
                    if (cc.sys.isObjectValid(btn)) {
                        btn.updateView(reversPercentage ? 1 - player.getAttrPercentage(attr) : player.getAttrPercentage(attr), needStatusStr ? player.getAttrStr(attr) : null);
                   }
                };
                btn.updateAttrBtn();
                return btn;
            };
            
            var injury = createAttrButton("dogInjury", false, 17, true, new Range("[0,0.3]"));
            injury.setPosition(cc.winSize.width / 2 + 80, dialog.titleNode.y + 170);
            dialog.addChild(injury, 1);
        
            var starve = createAttrButton("dogFood", false, 18, false, new Range("[0,0.3]"));
            starve.setPosition(cc.winSize.width / 2 + 130, dialog.titleNode.y + 170);
            dialog.addChild(starve, 1);
        
            var spirit = createAttrButton("dogMood", false, 19, false, new Range("[0,0.3]"));
            spirit.setPosition(cc.winSize.width / 2 + 180, dialog.titleNode.y + 170);
            dialog.addChild(spirit, 1);        

            var getItemList = function () {
                var itemList = [];
                var itemList2 = [];
                var itemList3 = [];
                itemList = storage.getItemsByType("1103");
                itemList = itemList.filter(function (storageCell) {
                    return storageCell.item.id == '1103041';
                });
                itemList2 = storage.getItemsByType("1104");
                itemList2 = itemList2.filter(function (storageCell) {
                    return storageCell.item.id == '1104011';
                });
                itemList3 = storage.getItemsByType("1106");
                itemList3 = itemList3.filter(function (storageCell) {
                    return storageCell.item.id == '1106014';
                });    
                return itemList.concat(itemList2, itemList3);
            };

            var storage;
            if (player.isAtHome) {
                storage = player.storage;
            } else {
                if (player.tmpBag) {
                    storage = player.tmpBag;
                } else {
                    storage = player.bag;
                }
            }

            if (!player.tmpBag) {
                var itemList = getItemList();
                var itemTableView = uiUtil.createItemListSliders(itemList);
                itemTableView.x = 20;
                itemTableView.y = 2;
                itemTableView.setName("itemTable");
                dialog.contentNode.addChild(itemTableView, 1);

                var onItemUse = function (itemId, source) {
                    if (source !== 'top')
                        return;
                    var res = player.useItemForDog(storage, itemId);
                    if (res.result) {
                        itemTableView.updateData();
                        itemTableView.reloadData();
                        Record.saveAll();
                    }
                };

                utils.emitter.on("btn_1_click", onItemUse);
                dialog.setOnDismissListener({
                    target: dialog, cb: function () {
                        utils.emitter.off('btn_1_click', onItemUse);
                    }
                });
            }
        }
        dialog.show();
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
        var screenFix = Record.getScreenFix(); 
        if (screenFix == 1) {
            this.bg.setScale(0.87);
            this.bg.setPosition(cc.winSize.width / 2, 90);
        } else {
            this.bg.setPosition(cc.winSize.width / 2, 18);
        }
        this.bg.setAnchorPoint(0.5, 0);
        
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
        utils.emitter.emit("entered_alter_node");
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