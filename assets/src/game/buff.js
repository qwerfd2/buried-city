var BuffManager = cc.Class.extend({
    buff: null,
    ctor: function () {
    },
    save: function () {
        if (this.buff) {
            return this.buff.save();
        }
        return null;
    },
    restore: function (saveObj) {
        if (saveObj) {
            this.buff = this.createBuff(saveObj.itemId, saveObj.lastTime);
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
        this.abortBuff();
        this.buff = this.createBuff(itemId);
        this.startBuff();
    },
    startBuff: function () {
        if (this.buff) {
            this.buff.onStart();
        }
    },
    abortBuff: function () {
        if (this.buff) {
            var oldBuff = this.buff;
            this.buff = null;
            oldBuff.onEnd();
        }
    },
    process: function (dt) {
        if (this.buff) {
            var res = this.buff.process(dt);
            if (!res) {
                this.abortBuff();
            }
        }
    },
    isBuffEffect: function (itemId) {
        if (this.buff) {
            return itemId == this.buff.itemId;
        } else {
            return false;
        }
    },
    getBuffValue: function () {
        if (this.buff) {
            return this.buff.value ? this.buff.value : 0;
        }
        return 0;
    },
    getBuff: function () {
        return this.buff;
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
    ITEM_1107042: 1107042
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