var BuffManager = cc.Class.extend({
    buffs: [],
    ctor: function () {
        this.buffs = [];
    },
    save: function () {
        var value = [];
        for (var i = 0; i < this.buffs.length; i++) {
            value.push(this.buffs[i].save())
        }
        return value;
    },
    restore: function (saveObj) {
        if (saveObj) {
            for (var i = 0; i < saveObj.length; i++) {
                this.buffs[i] = this.createBuff(saveObj[i].itemId, saveObj[i].lastTime);
            }
        }
    },
    createBuff: function (itemId, lastTime) {
        if (itemId == BuffItemEffectType.ITEM_1107012) {
            return new MaxHpBuff(itemId, lastTime);
        } else {
            return new Buff(itemId, lastTime);
        }
    },
    applyBuff: function (itemId) {
        var emptyIndex = -1;
        var sameIndex = -1;
        var isNewBuff = true;

        for (var i = 0; i < this.buffs.length; i++) {
            if (this.buffs[i] == null) {
                if (emptyIndex === -1) {
                    emptyIndex = i;
                }
                continue;
            }

            if (this.buffs[i].itemId == itemId) {
                sameIndex = i;
                isNewBuff = false;
                break;
            }
        }

        if (isNewBuff) {
            for (var j = 0; j < this.buffs.length; j++) {
                if (this.buffs[j] != null) {
                    this.buffs[j].lastTime = Math.floor(this.buffs[j].lastTime / 2);
                }
            }
        }

        if (sameIndex !== -1) {
            this.buffs[sameIndex] = this.createBuff(itemId);
            this.startBuff(sameIndex);
        } else if (emptyIndex !== -1) {
            this.buffs[emptyIndex] = this.createBuff(itemId);
            this.startBuff(emptyIndex);
        } else {
            this.buffs.push(this.createBuff(itemId));
            var newIndex = this.buffs.length - 1;
            this.startBuff(newIndex);
        }
    },
    startBuff: function (index) {
        if (this.buffs[index]) {
            this.buffs[index].onStart();
        }
    },
    abortBuff: function (index) {
        if (this.buffs[index]) {
            var oldBuff = this.buffs[index];
            this.buffs[index] = null;
            oldBuff.onEnd();
        }
    },
    abortAllBuff: function () {
        for (i = 0; i < this.buffs.length; i++) {
            var oldBuff = this.buffs[i];
            this.buffs[i] = null;
            oldBuff.onEnd();
        }
    },
    process: function (dt) {
        for (var i = 0; i < this.buffs.length; i++) {
            var res = this.buffs[i].process(dt);
            if (!res) {
                this.abortBuff(i);
            }
        }
    },
    isBuffEffect: function (itemId) {
        var result = false;
        for (var i = 0; i < this.buffs.length; i++) {
            if (itemId == this.buffs[i].itemId) {
                result = true;
            }
        }
        return result;
    },
    getBuffValue: function (itemId) {
        for (var i = 0; i < this.buffs.length; i++) {
            if (this.buffs[i].itemId == itemId) {
                return this.buffs[i].value ? this.buffs[i].value : 0;
            }
        }
        return 0;
    },
    getBuff: function (attr) {
        for (var i = 0; i < this.buffs.length; i++) {
            if (attr === 'hp' && this.buffs[i].itemId == "1107012") {
                return this.buffs[i];
            }
            if (attr === 'infect' && this.buffs[i].itemId == "1107022") {
                return this.buffs[i];
            }
            if (attr === 'vigour' && this.buffs[i].itemId == "1107032") {
                return this.buffs[i];
            }
            if (attr === 'starve' && this.buffs[i].itemId == "1107042") {
                return this.buffs[i];
            }
            if (attr === 'virus' && this.buffs[i].itemId == "1107052") {
                return this.buffs[i];
            }
        }
        return null;
    }
});

var BuffEffect = {
    1: "hp",
    2: "infect",
    3: "def",
    4: "starve",
    5: "injury",
    6: "atk"
};

var BuffEffectType = {
    //增加上限
    ENHANCE_MAX: 1,
    //抵御负面影响
    DEFENCE_ADVERSE_EFFECT: 2
};
var BuffItemEffectType = {
    ITEM_1107012: 1107012,
    ITEM_1107022: 1107022,
    ITEM_1107032: 1107032,
    ITEM_1107042: 1107042,
    ITEM_1107052: 1107052
};

var Buff = cc.Class.extend({
    ctor: function (itemId, lastTime) {
        this.itemId = itemId;
        this.buffConfig = utils.clone(itemConfig[itemId]["effect_buff"]);
        this.lastTime = lastTime || this.buffConfig.lastTime * 60 * 60;
    },
    onStart: function () {
    },
    onEnd: function () {
    },
    process: function (dt) {
        this.lastTime -= dt;
        return this.lastTime > 0;
    },
    save: function () {
        return {
            itemId: this.itemId,
            lastTime: this.lastTime
        };
    }
});

var MaxHpBuff = Buff.extend({
    ctor: function (itemId, lastTime) {
        this._super(itemId, lastTime);
        this.value = this.buffConfig.value;
    },
    onStart: function () {
        player.updateHpMax();
    },
    onEnd: function () {
        player.updateHpMax();
    }
});