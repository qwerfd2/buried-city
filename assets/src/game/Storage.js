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
    getRandomItem: function() {
        var keyArray = utils.clone(this.map);
        var deleteItem = [1106013, 1305064, 1305053, 1305034, 1305024, 1305023, 1102073, 1301091, 1305075];
        for (var a in deleteItem) {
            delete keyArray[deleteItem[a]];
        }
        keyArray = Object.keys(keyArray);
        if (!keyArray.length) {
            return null;
        }
        var randomIndex = utils.getRandomInt(0, keyArray.length - 1);
        var itemid = keyArray[randomIndex];
        var index = this.getNumByItemId(itemid);
        if (index > 10) {
            randomIndex = utils.getRandomInt(3, 9);
        } else {
            var cap = Math.max((index - 2), 1);
            randomIndex = utils.getRandomInt(1, cap);
        }
        var price = player.getPrice(itemid);
        if (itemid == 1305011 || itemid == 1305012) {
            randomIndex *= 2;
            if (randomIndex > index) {
                randomIndex = index - 4;
            }
        } else if (price >= 15) {
            //Expensive items, reduce amount.
            if (price >= 30) {
                randomIndex = Math.ceil(randomIndex / 3 * 2);
            } else {
                randomIndex = Math.ceil(randomIndex / 3);
            }
        }
        var result = [];
        result.push({itemId: itemid, num: randomIndex});
        return result;
    },
    increaseItem: function (itemId, num, includeWater, bypassCheck) {
        num = Number(num);
        //Water check. If water not full, auto deduct and edit.
        if (includeWater && this.name == 'player') {
            var total = Math.ceil((player.waterMax - player.water) / 18);
            var amount = 0;
            for (var i = 0; i < total; i++) {
                if (itemId == "1101061") {
                    if (!player.isAttrMax("water") && num > 0) {
                        num -= 1;
                        amount += 1;
                        player.incrementWater();
                    }
                }
            }
            if (amount > 0) {
                player.log.addMsg(stringUtil.getString(1328, amount));
            }
        }
        if (num <= 0 && !bypassCheck) {
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
        var cell = this.map[itemId];
        cell.num -= num;
        if (cell.num <= 0) {
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
                if (itemIdA === BattleConfig.BULLET_ID || itemIdB === BattleConfig.BULLET_ID || itemIdA === BattleConfig.HOMEMADE_ID || itemIdB === BattleConfig.HOMEMADE_ID) {
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
        if (num <= 0) {
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
        var w = itemConfig[itemId].weight;
        if (w == 0) {
            var oldAmount = player.bag.getNumByItemId(itemId);
            var newAmount = oldAmount + num;
            oldAmount = Math.ceil(oldAmount / 50);
            newAmount = Math.ceil(newAmount / 50);
            return newAmount + this.getCurrentWeight() - oldAmount <= this.getTotalWeight();
        } else {
            var weight = w * Math.max(0, num);
            return weight + this.getCurrentWeight() <= this.getTotalWeight();
        }
    },
    getCurrentWeight: function () {
        var weight = 0;
        this.forEach(function (item, num) {
            var w = item.getWeight();
            if (w == 0) {
                weight += Math.ceil(num / 50);
            } else {
                weight += w * Math.max(0, num);
            }
        });
        return weight;
    },
    getTotalWeight: function () {
        var weight = 40;
        if (player.storage.getNumByItemId(1305023) > 0) {
            weight += 10;
        }
        if (player.storage.getNumByItemId(1305024) > 0) {
            weight += 20;
        }
        if (player.storage.getNumByItemId(1305034) > 0) {
            weight += 30;
        }
        if (IAPPackage.isBigBagUnlocked()) {
            weight += 30;
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
    testWeaponBroken: function (itemId, type, multiplier) {
        //新手保护, 2天内不会损坏武器
        if (cc.timer.formatTime().d < 2) {
            return false;
        }
        if (itemConfig[itemId]) {
            var weaponBrokenProbability;
            if (type == 0) {
                weaponBrokenProbability = itemConfig[itemId].effect_weapon.brokenProbability * multiplier;
            } else {
                weaponBrokenProbability = itemConfig[itemId].effect_arm.brokenProbability;
            }
            if (IAPPackage.isWeaponEffectUnlocked()){
                weaponBrokenProbability -= weaponBrokenProbability * 0.25;
            }          
            var rand = Math.random();
            var isBroken = (rand <= weaponBrokenProbability);
            if (isBroken && player.weaponRound[itemId] > 2) {
                this.decreaseItem(itemId, 1);
                if (!this.validateItem(itemId, 1)) {
                    //player has another item of this ID. reduce item by 1 and don't unequip.
                    player.equip.unequipByItemId(itemId);
                }
                var returnItem = WeaponReturn[itemId];
                if (returnItem.length) {
                    for (var i = 0; i < returnItem.length; i++) {
                        this.increaseItem(returnItem[i], 1);
                    }
                }
                player.weaponRound[itemId] = 0;
                player.log.addMsg(1205, stringUtil.getString(itemId).title);
            } else if (isBroken) {
                player.weaponRound[itemId] = 3;
                isBroken = false;
            } else {
                player.weaponRound[itemId]++;
            }
            Record.saveAll();
            return isBroken;
        }
        return false;
    }
});

var Safe = Storage.extend({
    ctor: function (name) {
        this._super(name);
    },
    validateItemWeight: function (itemId, num) {
        var w = itemConfig[itemId].weight;
        if (w == 0) {
            var oldAmount = player.safe.getNumByItemId(itemId);
            var newAmount = oldAmount + num;
            oldAmount = Math.ceil(oldAmount / 50);
            newAmount = Math.ceil(newAmount / 50);
            return newAmount + this.getCurrentWeight() - oldAmount <= this.getTotalWeight();
        } else {
            var weight = w * Math.max(0, num);
            return weight + this.getCurrentWeight() <= this.getTotalWeight();
        }
    },
    getCurrentWeight: function () {
        var weight = 0;
        this.forEach(function (item, num) {
            var w = item.getWeight();
            if (w == 0) {
                weight += Math.ceil(num / 50);
            } else {
                weight += w * Math.max(0, num);
            }
        });
        return weight;
    },
    getTotalWeight: function () {
        if (player.room.getBuildLevel(20) >= 0) {
            return 50;
        } else {
            return 0;
        }
    },
    decreaseItem: function (itemId, num) {
        this._super(itemId, num);
    },
    clone: function () {
        var newSafe = new Safe();
        for (var itemId in this.map) {
            newSafe.increaseItem(itemId, this.getNumByItemId(itemId));
        }
        return newSafe;
    }
});
