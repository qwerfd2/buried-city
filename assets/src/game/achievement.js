var AchievementConfig = {
    bt_season_1: {aim: 1, aimCompleted: 0, completed: 0, time: 0, seasonId: 1},
    bt_season_2: {aim: 1, aimCompleted: 0, completed: 0, time: 0, seasonId: 2},
    bt_season_3: {aim: 1, aimCompleted: 0, completed: 0, time: 0, seasonId: 3},
    bt_season_4: {aim: 1, aimCompleted: 0, completed: 0, time: 0, seasonId: 0},
    bt_produce_1: {aim: 50, aimCompleted: 0, completed: 0, time: 0, itemId: 1103011},
    bt_produce_2: {aim: 25, aimCompleted: 0, completed: 0, time: 0, itemId: 1103041},
    bt_produce_3: {aim: 100, aimCompleted: 0, completed: 0, time: 0, itemId: 1101061},
    bt_produce_4: {aim: 15, aimCompleted: 0, completed: 0, time: 0, itemId: 1105022},
    bt_make_1: {aim: 1, aimCompleted: 0, completed: 0, time: 0, itemId: 1301033},
    bt_make_2: {aim: 1, aimCompleted: 0, completed: 0, time: 0, itemId: 1304023},
    bt_make_3: {aim: 1, aimCompleted: 0, completed: 0, time: 0, itemId: 1305024},
    bt_make_4: {aim: 1, aimCompleted: 0, completed: 0, time: 0, itemId: 1302032},
    bt_npc_1: {aim: 1, aimCompleted: 0, completed: 0, time: 0, npcId: 1},
    bt_npc_2: {aim: 1, aimCompleted: 0, completed: 0, time: 0, npcId: 1},
    bt_npc_3: {aim: 1, aimCompleted: 0, completed: 0, time: 0, npcId: 3},
    bt_npc_4: {aim: 1, aimCompleted: 0, completed: 0, time: 0, npcId: 3},
    bt_npc_5: {aim: 1, aimCompleted: 0, completed: 0, time: 0, npcId: 2},
    bt_npc_6: {aim: 1, aimCompleted: 0, completed: 0, time: 0, npcId: 2},
    bt_npc_7: {aim: 1, aimCompleted: 0, completed: 0, time: 0, npcId: 4},
    bt_npc_8: {aim: 1, aimCompleted: 0, completed: 0, time: 0, npcId: 4},
    bt_npc_9: {aim: 1, aimCompleted: 0, completed: 0, time: 0, npcId: 5},
    bt_npc_10: {aim: 1, aimCompleted: 0, completed: 0, time: 0, npcId: 5},
    bt_npc_11: {aim: 1, aimCompleted: 0, completed: 0, time: 0, npcId: 6},
    bt_npc_12: {aim: 1, aimCompleted: 0, completed: 0, time: 0, npcId: 6},
    bt_item_1: {aim: 1, aimCompleted: 0, completed: 0, time: 0, itemId: 1301041},
    bt_item_2: {aim: 1, aimCompleted: 0, completed: 0, time: 0, itemId: 1301052},
    bt_item_3: {aim: 1, aimCompleted: 0, completed: 0, time: 0, itemId: 1301063},
    bt_item_4: {aim: 1, aimCompleted: 0, completed: 0, time: 0, itemId: 1302043},
    bt_item_5: {aim: 1, aimCompleted: 0, completed: 0, time: 0, itemId: 1303022},
    bt_item_6: {aim: 1, aimCompleted: 0, completed: 0, time: 0, itemId: 1303012},
    bt_cost_1: {aim: 50, aimCompleted: 0, completed: 0, time: 0, itemId: 1105011},
    bt_cost_2: {aim: 100, aimCompleted: 0, completed: 0, time: 0, itemId: 1105011},
    bt_cost_3: {aim: 150, aimCompleted: 0, completed: 0, time: 0, itemId: 1105011},
    bt_special_1: {aim: 5, aimCompleted: 0,completed: 0, time: 0, itemId: 1},
    bt_special_2: {aim: 1, aimCompleted: 0, completed: 0, time: 0},
};
var Achievement = {
    _map: null,
    _enable: false,
    init: function () {
        if (!this._map) {
            var achievementStr = cc.sys.localStorage.getItem("achievement");
            if (achievementStr) {
                this._map = JSON.parse(achievementStr);
            } else {
                this._map = utils.clone(AchievementConfig);
            }
        }
        this._enable = true;
    },
    save: function (gcId) {
        if (IAPPackage.isAllIAPUnlocked() || IAPPackage.isAllItemUnlocked()) {
            return;
        }
        if (this._map[gcId]["aimCompleted"] >= this._map[gcId]["aim"] && this._map[gcId]["completed"] == 0) {
            player.log.addMsg(stringUtil.getString(1272) + stringUtil.getString(gcId).title);
            this._map[gcId]["completed"] = 1;
            this._map[gcId]["time"] = new Date().getTime();
        }
        cc.sys.localStorage.setItem("achievement", JSON.stringify(this._map));
    },
    findIdFromArray: function (ids, key, value) {
        var gcId = "";
        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            if (this._map[id][key] == value) {
                gcId = id;
                break;
            }
        }
        return gcId;
    },
    checkSeason: function (seasonId) {
        var ids = ["bt_season_1", "bt_season_2", "bt_season_3", "bt_season_4"];
        var gcId = this.findIdFromArray(ids, "seasonId", seasonId);
        if (gcId) {
            this._map[gcId].aimCompleted = 1;
            this.save(gcId);
        }
    },
    checkProduce: function (itemId, num) {
        var ids = ["bt_produce_1", "bt_produce_2", "bt_produce_3", "bt_produce_4"];
        var gcId = this.findIdFromArray(ids, "itemId", itemId);
        if (gcId) {
            this._map[gcId].aimCompleted += num;
            this.save(gcId);
        }
    },
    checkMake: function (itemId, num) {
        var ids = ["bt_make_1", "bt_make_2", "bt_make_3", "bt_make_4"];
        var gcId = this.findIdFromArray(ids, "itemId", itemId);
        if (gcId) {
            this._map[gcId].aimCompleted += num;
            this.save(gcId);
        }
    },
    checkNpcUnlock: function (npcId) {
        var ids = ["bt_npc_1", "bt_npc_3", "bt_npc_5", "bt_npc_7", "bt_npc_9", "bt_npc_11"];
        var gcId = this.findIdFromArray(ids, "npcId", npcId);
        if (gcId) {
            this._map[gcId].aimCompleted = 1;
            this.save(gcId);
        }
    },
    checkNpcReputation: function (npcId) {
        var ids = ["bt_npc_2", "bt_npc_4", "bt_npc_6", "bt_npc_8", "bt_npc_10", "bt_npc_12"];
        var gcId = this.findIdFromArray(ids, "npcId", npcId);
        if (gcId) {
            this._map[gcId].aimCompleted = 1;
            this.save(gcId);
        }
    },
    checkGetItem: function (itemId) {
        var ids = ["bt_item_1", "bt_item_2", "bt_item_3", "bt_item_4", "bt_item_5", "bt_item_6"];
        var gcId = this.findIdFromArray(ids, "itemId", itemId);
        if (gcId) {
            this._map[gcId].aimCompleted = 1;
            this.save(gcId);
        }
    },
    checkCost: function (itemId, num) {
        var ids = ["bt_cost_1", "bt_cost_2", "bt_cost_3", "bt_special_1"];
        var self = this;
        ids.forEach(function (gcId) {
            if (itemId == self._map[gcId].itemId) {
                self._map[gcId].aimCompleted += num;
                self.save(gcId);
            }
        })
    },
    checkSpecial: function (gcId) {
        var self = this;
        if (gcId == "bt_special_2"){
            self._map[gcId].aimCompleted = 1;
            self.save(gcId);
        }
    }
};