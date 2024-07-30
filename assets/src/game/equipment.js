var EquipmentPos = {
    GUN: 0,
    WEAPON: 1,
    EQUIP: 2,
    TOOL: 3,
    SPECIAL: 4
}
var Equipment = cc.Class.extend({
    ctor: function () {
        this.equipPos = {};
        this.equip(EquipmentPos.WEAPON, Equipment.HAND);
    },
    equip: function (pos, itemId) {
        if (itemId !== Equipment.HAND) {
            if (!player.bag.validateItem(itemId, 1)) {
                return false;
            }
        }
        if (this.isEquiped(itemId)) {
            return false;
        }
        cc.timer.updateTime(60);
        this.equipPos[pos] = itemId;
        return true;
    },
    unequip: function (pos) {
        this.equipPos[pos] = 0;
        if (pos === EquipmentPos.WEAPON) {
            this.equipPos[pos] = Equipment.HAND;
        }
    },
    unequipByItemId: function (itemId) {
        for (var pos in EquipmentPos) {
            if (this.getEquip(EquipmentPos[pos]) == itemId) {
                this.unequip(EquipmentPos[pos]);
                break;
            }
        }
    },
    getEquip: function (pos) {
        return this.equipPos[pos];
    },
    isEquiped: function (itemId) {
        var res = false;
        for (var pos in EquipmentPos) {
            if (this.getEquip(EquipmentPos[pos]) == itemId) {
                res = true;
                break;
            }
        }
        return res;
    },
    save: function () {
        return this.equipPos;
    },

    restore: function (opt) {
        if (opt) {
            this.equipPos = opt;
        }
    },

    getEquipedItemList: function (isMelee) {
        var itemList = [];
        if (!isMelee) {
            for (var key in EquipmentPos) {
                var itemId = this.equipPos[EquipmentPos[key]];
                if (itemId) {
                    itemList.push(itemId);
                }
            }
        } else {    
            for (var key in EquipmentPos) {
                if (key != "GUN") {
                    if (key != "TOOL") {
                        var itemId = this.equipPos[EquipmentPos[key]];
                        if (itemId) {
                            itemList.push(itemId);
                        }
                    } else {
                        var itemId = this.equipPos[EquipmentPos[key]];
                        if (itemId) {
                            if (!(itemId == "1303012" || itemId == "1303033" || itemId == "1303044")) {
                                itemList.push(itemId);
                            }
                        }
                    }
                } else {
                    var itemId = this.equipPos[EquipmentPos[key]];
                    if (itemId) {
                        if (itemId == "1301091") {
                            itemList.push(itemId);
                        }
                    }
                }
            }
        }
        if (itemList.length > 1) {
            var index = itemList.indexOf(Equipment.HAND);
            if (index !== -1) {
                itemList.splice(index, 1);
            }
        }
        return itemList;
    },

    haveWeapon: function () {
        var gunItemId = player.equip.getEquip(EquipmentPos.GUN);
        var weaponItemId = player.equip.getEquip(EquipmentPos.WEAPON);
        return gunItemId || (weaponItemId && weaponItemId != Equipment.HAND);
    }
});
Equipment.HAND = 1;