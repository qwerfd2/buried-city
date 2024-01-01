var Map = cc.Class.extend({
    ctor: function () {
        this.npcMap = {};
        this.siteMap = {};
        this.needDeleteSiteList = [];
    },
    save: function () {
        var npcSaveObj = [];
        for (var npcId in this.npcMap) {
            npcSaveObj.push(npcId);
        }
        var siteSaveObj = {};
        for (var siteId in this.siteMap) {
            siteSaveObj[siteId] = this.siteMap[siteId].save();
        }
        return {
            npcMap: npcSaveObj,
            siteMap: siteSaveObj,
            pos: this.pos,
            needDeleteSiteList: this.needDeleteSiteList
        };
    },
    restore: function (saveObj) {
        if (saveObj) {
            var self = this;
            var npcSaveObj = saveObj.npcMap;
            npcSaveObj.forEach(function (npcId) {
                self.npcMap[npcId] = true;
            });

            var siteSaveObj = saveObj.siteMap;
            for (var siteId in siteSaveObj) {
                var site;
                if (siteId == AD_SITE) {
                    site = new AdSite(siteId);
                } else if (siteId == BOSS_SITE) {
                    site = new BossSite(siteId);
                } else if (siteId == WORK_SITE || siteId == GAS_SITE) {
                    site = new WorkSite(siteId);
                } else if (siteId == BAZAAR_SITE) {
                    site = new BazaarSite(siteId);
                } else {
                    site = new Site(siteId);
                }
                site.restore(siteSaveObj[siteId]);
                this.siteMap[siteId] = site;
            }

            this.pos = saveObj.pos;
            this.needDeleteSiteList = saveObj.needDeleteSiteList;

        } else {
            this.init();
        }
    },
    init: function () {
        var all;
        if (IAPPackage.isAllItemUnlocked()) {
            all = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,20,21,22,30,31,32,33,41,42,43,51,52,61,100,201,202,203,204,301,302,303,304,305,306,307,308,309,310,311,312,400,500,501,502,666];
        } else {
            all = [100, 201, 202, 204];
        }
        for (var i = 0; i < all.length; i++){
            this.unlockSite(all[i]);
        }

        //根据角色决定家的位置
        var homePos = {
            "x": 45,
            "y": 50
        };
        this.getSite(100).pos = homePos;
        // 家的初始化位置
        this.pos = this.getSite(100).pos;
    },

    forEach: function (func) {
        for (var npcId in this.npcMap) {
            func(player.npcManager.getNPC(npcId));
        }
        for (var siteId in this.siteMap) {
            if (!this.siteMap[siteId].closed && (siteId < 300 || siteId > 399)) {
                func(this.siteMap[siteId]);
            }
        }
    },
    unlockNpc: function (npcId) {
        
            this.npcMap[npcId] = true;

            var npc = player.npcManager.getNPC(npcId);
            utils.emitter.emit("unlock_site", npc);
            player.log.addMsg(1125, npc.getName());
        
    },
    unlockSite: function (siteId) {
        if (!this.siteMap.hasOwnProperty(siteId)) {
            var site;
            if (siteId == AD_SITE) {
                site = new AdSite(siteId);
            } else if (siteId == BOSS_SITE) {
                site = new BossSite(siteId);
            } else if (siteId == WORK_SITE || siteId == GAS_SITE) {
                site = new WorkSite(siteId);
            } else if (siteId == BAZAAR_SITE) {
                site = new BazaarSite(siteId);
            } else {
                site = new Site(siteId);
            }
            site.init();
            this.siteMap[siteId] = site;
            utils.emitter.emit("unlock_site", site);
            player.log.addMsg(1104, site.getName());
        }
    },
    closeSite: function (siteId) {
        if (this.siteMap.hasOwnProperty(siteId)) {
            this.needDeleteSiteList.push(siteId);
            // 不需要处理on,暂时没有在大地图关闭site的需求
            utils.emitter.emit("close_site", siteId);
        }
    },
    deleteUnusableSite: function () {
        while (this.needDeleteSiteList.length !== 0) {
            var siteId = this.needDeleteSiteList.pop();
            var site = this.getSite(siteId);
            if (site.canClose()) {
                site.closed = true;
            }
        }
    },
    updatePos: function (pos) {
        this.pos = pos;
    },
    getSite: function (siteId) {
        return this.siteMap[siteId];
    },
    resetPos: function () {
        this.pos = this.getSite(100).pos;
    }
});