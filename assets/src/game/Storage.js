/**
 * Created by lancelot on 15/4/7.
 */

var StorageCell = cc.Class.extend({
    ctor: function (item, num) {
        this.item = item;
        this.num = num;
    }
});
var Storage = cc.Class.extend({
    ctor: function (name) {
        this.map = {};
        this.name = name;
    },
    save: function () {
        var saveObj = {};
        for (var itemId in this.map) {
            saveObj[itemId] = this.map[itemId].num;
        }
        return saveObj;
    },
    restore: function (saveObj) {
        for (var itemId in saveObj) {
            this.map[itemId] = new StorageCell(new Item(itemId), saveObj[itemId]);
        }
    },
    increaseItem: function (itemId, num) {
        num = Number(num);
        cc.i("increaseItem: " + itemId + " " + num)
        if (num === 0) {
            return;
        }
        var cell = this.map[itemId];
        if (cell) {
            cell.num += num;
        } else {
            this.map[itemId] = new StorageCell(new Item(itemId), num);
        }
        if (this.name === 'player') {
            Achievement.checkGetItem(itemId);
        }
        if (this.listener) {
            this.listener.call(this, itemId);
        }
    },
    decreaseItem: function (itemId, num) {
        num = Number(num);
        cc.i("decreaseItem: " + itemId + " " + num)
        var cell = this.map[itemId];
        cell.num -= num;
        if (cell.num === 0) {
            delete this.map[itemId];
        }

        if (this.listener) {
            this.listener.call(this, itemId);
        }
    },
    validateItem: function (itemId, num) {
        num = Number(num);
        var cell = this.map[itemId];
        if (cell) {
            return cell.num >= num;
        } else {
            return false;
        }
    },

    getItemsByType: function (type) {
        type = "" + type;
        var items = Object.keys(this.map);
        var self = this;
        var len = type.length;
        items = items.filter(function (itemId) {
            if (blackList.storageDisplay.indexOf(Number(itemId)) !== -1)
                return false;
            var itemIdStr = "" + itemId;
            return type == itemIdStr.substr(0, len);
        });

        var min = 1300000;
        var max = 1400000;
        items.sort(function (itemIdA, itemIdB) {
            itemIdA = Number(itemIdA);
            itemIdB = Number(itemIdB);

            if ((itemIdA >= min && itemIdA < max) && (itemIdB < min || itemIdB >= max)) {
                return -1;
            } else if ((itemIdA < min || itemIdA >= max) && (itemIdB >= min && itemIdB < max)) {
                return 1;
            } else if ((itemIdA >= min && itemIdA < max) && (itemIdB >= min && itemIdB < max)) {
                if (itemIdA === BattleConfig.BULLET_ID || itemIdB === BattleConfig.BULLET_ID) {
                    return 1;
                }
                return itemIdA - itemIdB;
            } else {
                return itemIdA - itemIdB;
            }

        });
        items = items.map(function (itemId) {
            return self.map[itemId];
        });
        return items;
    },

    getItemsByTypeGroup: function (typeArray) {
        var res = {};
        typeArray.forEach(function (key) {
            res[key] = [];
        });
        for (var itemId in this.map) {
            if (blackList.storageDisplay.indexOf(Number(itemId)) === -1) {
                var itemIdStr = "" + itemId;
                for (var i = 0; i < typeArray.length - 1; i++) {
                    var type = typeArray[i];
                    var len = type.length;
                    if (itemIdStr.substr(0, len) == type) {
                        res[type].push(this.map[itemId]);
                        break;
                    }
                }
                if (i >= typeArray.length - 1) {
                    res["other"].push(this.map[itemId]);
                }
            }
        }
        return res;
    },

    forEach: function (func) {
        for (var itemId in this.map) {
            var cell = this.map[itemId];
            func(cell.item, cell.num);
        }
    },
    getNumByItemId: function (itemId) {
        if (this.map[itemId]) {
            return this.map[itemId].num;
        } else {
            return 0;
        }
    },
    getItem: function (itemId) {
        if (this.map[itemId]) {
            return this.map[itemId].item;
        } else {
            return null;
        }
    },
    clone: function () {
        var newStorage = new Storage();
        for (var itemId in this.map) {
            newStorage.increaseItem(itemId, this.getNumByItemId(itemId));
        }
        return newStorage;
    },
    setItem: function (itemId, num) {
        num = Number(num);
        if (num === 0) {
            delete this.map[itemId];
        } else {
            var cell = this.map[itemId];
            if (cell) {
                cell.num = num;
            } else {
                this.map[itemId] = new StorageCell(new Item(itemId), num);
            }
        }
    },
    isEmpty: function () {
        return Object.keys(this.map).length === 0;
    },
    getAllItemNum: function () {
        var totalNum = 0;
        this.forEach(function (item, num) {
            if (blackList.storageDisplay.indexOf(Number(item.id)) === -1) {
                totalNum += num;
            }
        });
        return totalNum;
    },
    validateItemWeight: function (itemId, num) {
        return true;
    },

    getItemSortNum: function () {
        return Object.keys(this.map).length;
    },

    setOnItemChangeListener: function (listener) {
        this.listener = listener;
    },

    removeOnItemChangeListener: function () {
        this.listener = null;
    }
});

var Bag = Storage.extend({
    ctor: function (name) {
        this._super(name);
    },
    validateItemWeight: function (itemId, num) {
        var weight = Math.abs(itemConfig[itemId].weight) * num;
        return weight + this.getCurrentWeight() <= this.getTotalWeight();
    },
    getCurrentWeight: function () {
        var weight = 0;
        this.forEach(function (item, num) {
            weight += item.getWeight() * num;
        });
        return weight;
    },
    getTotalWeight: function () {
        var weight = 35;
        if (player.storage.getNumByItemId(1305023) > 0) {
            weight += 10;
        }
        if (player.storage.getNumByItemId(1305024) > 0) {
            weight += 25;
        }
        if (player.storage.getNumByItemId(1305044) > 0) {
            weight += 20;
        }
        return weight;
    },
    decreaseItem: function (itemId, num) {
        this._super(itemId, num);
        if (this.getNumByItemId(itemId) == 0 && player.equip.isEquiped(itemId)) {
            player.equip.unequipByItemId(itemId);
            utils.emitter.emit("equiped_item_decrease_in_bag");
        }
    },
    clone: function () {
        var newBag = new Bag();
        for (var itemId in this.map) {
            newBag.increaseItem(itemId, this.getNumByItemId(itemId));
        }
        return newBag;
    },
    testWeaponBroken: function (itemId) {
        //新手保护, 3天内不会损坏武器
        if (cc.timer.formatTime().d < 3) {
            return false;
        }
        if (itemConfig[itemId]) {
            var weaponBrokenProbability = itemConfig[itemId].effect_weapon.brokenProbability;
            if (IAPPackage.isWeaponEffectUnlocked()){
                weaponBrokenProbability -= weaponBrokenProbability * 0.25;
            }
            var rand = Math.random();
            cc.log("testWeaponBroken " + itemId + " " + weaponBrokenProbability + ":" + rand);
            var isBroken = (rand <= weaponBrokenProbability);
            if (isBroken) {
                player.equip.unequipByItemId(itemId);
                this.decreaseItem(itemId, 1);
                cc.log("itemId=" + itemId + " is broken");
                player.log.addMsg(1205, stringUtil.getString(itemId).title);

                Record.saveAll();
            }
            return isBroken;
        }
        return false;
    },
    testArmBroken: function (itemId) {
        //新手保护, 3天内不会损坏武器
        if (cc.timer.formatTime().d < 3) {
            return false;
        }
        if (itemConfig[itemId]) {
            var armBrokenProbability = itemConfig[itemId].effect_arm.brokenProbability;
            if (IAPPackage.isWeaponEffectUnlocked()){
                armBrokenProbability -= armBrokenProbability * 0.25;
            }
            var rand = Math.random();
            cc.log("testArmBroken " + itemId + " " + armBrokenProbability + ":" + rand);
            var isBroken = (rand <= armBrokenProbability);
            if (isBroken) {
                player.equip.unequipByItemId(itemId);
                this.decreaseItem(itemId, 1);
                cc.log("itemId=" + itemId + " is broken");
                player.log.addMsg(1205, stringUtil.getString(itemId).title);

                Record.saveAll();
            }
            return isBroken;
        }
        return false;
    }
});