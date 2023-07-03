/**
 * Created by lancelot on 15/6/2.
 */
var userGuide = {
    stepName: {
        GAME_START: 0,
        HOME_GATE: 1,
        GATE_OUT: 2,
        MAP_SITE: 3,
        MAP_SITE_GO: 4,
        ENTER_SITE: 5,
        FIGHT_SITE: 6,
        NEXT_ROOM: 7,
        WORK_SITE: 8,
        ALL_GET: 9,
        BACK_ROOM: 10,
        BACK_SITE: 11,

        MAP_SITE_HOME: 12,
        MAP_SITE_HOME_GO: 13,
        BACK_HOME_WARN: 14,
        HOME_STORAGE: 15,
        STORAGE_ITEM: 16,
        STORAGE_EAT: 17,
        STORAGE_BACK: 18,
        HOME_SLEEP: 19,
        MAKE_BED: 20,
        BED_SLEEP: 21,
        SLEEP_WAKE_UP: 22,
        WAKE_UP_WARN: 23,
        HOME_TOOL: 24,
        TOOL_ALEX: 25,
        TOOL_BACK: 26,
        HOME_GATE_AGAIN: 27
    },

    isStep: function (step) {
        return player.getStep() === step;
    },
    step: function () {
        player.step();
    },
    ITEM_CREATE: 1302021,
    isItemCreate: function (id) {
        return id == this.ITEM_CREATE;
    },
    FORMULA_ID: 1402021,
    isItemFormula: function (fid) {
        return fid == this.FORMULA_ID;
    },
    BED_SLEEP_ID: 2,
    isToSleepBed: function (id) {
        return id == this.BED_SLEEP_ID;
    },
    ITEM_EAT: 1103083,
    isItemEat: function (id) {
        return id == this.ITEM_EAT;
    },
    SITE_ID: 201,
    isSite: function (siteId) {
        return siteId == this.SITE_ID;
    },

    isStepGuideFinish: function () {
        return player.getStep() >= this.stepName.MAP_SITE_HOME_GO;
    },

    EQUIP_GUIDE_1: {
        STORAGE_TO_BAG: 0
    },
    EQUIP_GUIDE_2: {
        EQUIP: 0
    },
    init: function () {
        var str = player.getSetting("userGuide");
        if (str) {
            this.equipGuideList = JSON.parse(str);
        } else {
            this.equipGuideList = {
                1301: {guide_1_step: 0, guide_2_step: 0},
                1302: {guide_1_step: 0, guide_2_step: 0},
                1303: {guide_1_step: 0, guide_2_step: 0},
                1304: {guide_1_step: 0, guide_2_step: 0}
            };
        }
    },
    equipNeedGuide: function (itemId) {
        return this.equipGuideList[itemId];
    },
    getEquipGuideInfo: function (itemId) {
        var itemIdStr = "" + itemId;
        var typeId = itemIdStr.substr(0, 4);
        return this.equipGuideList[typeId];

    },
    equipNeedGuide1: function (itemId) {
        var guideInfo = this.getEquipGuideInfo(itemId);
        if (!guideInfo) {
            return false;
        }
        return guideInfo.guide_1_step <= this.EQUIP_GUIDE_1.STORAGE_TO_BAG && guideInfo.guide_2_step <= this.EQUIP_GUIDE_2.EQUIP;
    },
    guide1Step: function (itemId) {
        this.getEquipGuideInfo(itemId).guide_1_step++;
        this.save();
    },
    getGuide1Step: function (itemId) {
        return this.getEquipGuideInfo(itemId).guide_1_step;
    },
    equipNeedGuide2: function (itemId) {
        var res = false;
        var guideInfo = this.getEquipGuideInfo(itemId);
        if (guideInfo) {
            res = guideInfo.guide_2_step <= this.EQUIP_GUIDE_2.EQUIP;
        }
        return res;
    },
    guide2Step: function (itemId) {
        this.getEquipGuideInfo(itemId).guide_2_step++;
        this.save();
    },
    getGuide2Step: function (itemId) {
        return this.getEquipGuideInfo(itemId).guide_2_step;
    },
    resetGuide2Step: function (itemId) {
        this.getEquipGuideInfo(itemId).guide_2_step = this.EQUIP_GUIDE_2.EQUIP;
        this.save();
    },
    save: function () {
        player.setSetting("userGuide", JSON.stringify(this.equipGuideList));
    },
    changeEquipNeedState: function (itemId) {
        if (this.equipGuideList.hasOwnProperty(itemId)) {
            this.equipGuideList[itemId] = false;
            player.setSetting("userGuide", JSON.stringify(this.equipGuideList));
        }
    }
};