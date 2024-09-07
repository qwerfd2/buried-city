var ItemType = {
    TOOL: "11",
    EQUIP: "13",

    MATERIAL: "01",
    MODEL: "02",
    FOOD: "03",
    MEDICINE: "04",
    ECONOMY: "05",
    SPECIFIC: "06",
    BUFF: "07",

    GUN: "01",
    WEAPON: "02",
    WEAPON_TOOL: "03",
    DEFEND: "04",
    OTHER: "05"
}

var Item = cc.Class.extend({
    ctor: function (id) {
        this.id = id;
        this.config = utils.clone(itemConfig[this.id]);
    },
    getPrice: function () {
        return this.config["price"];
    },
    getValue: function () {
        return this.config["value"];
    },
    getType: function (level) {
        var itemIdStr = "" + this.id;
        var typeId = itemIdStr.substr(level * 2, 2);
        return typeId;
    },
    getWeight: function () {
        return this.config["weight"];
    },
    isType: function (type1, type2) {
        return (this.getType(0) == type1 && this.getType(1) == type2);
    },
    getFoodEffect: function () {
        return this.config["effect_food"];
    },
    getMedicineEffect: function () {
        return this.config["effect_medicine"];
    }
});