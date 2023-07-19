var adConfig = {
    probability: 1,
    reward: {
        "produceValue": 3,
        "produceList": [{"itemId": "1101011", "weight": 15}, {
            "itemId": "1101021",
            "weight": 15
        }, {"itemId": "1101031", "weight": 6}, {
            "itemId": "1101041",
            "weight": 5
        }, {"itemId": "1101051", "weight": 0}, {
            "itemId": "1101**",
            "weight": 10
        }, {"itemId": "1102011", "weight": 1}, {
            "itemId": "1103*1",
            "weight": 10
        }, {"itemId": "1104011", "weight": 5}, {
            "itemId": "1104021",
            "weight": 5
        }, {"itemId": "1104043", "weight": 0}, {
            "itemId": "1105011",
            "weight": 10
        }, {"itemId": "1105042", "weight": 2}, {
            "itemId": "1105**",
            "weight": 0
        }, {"itemId": "1305011", "weight": 30}, {
            "itemId": "1103083",
            "weight": 3
        }, {"itemId": "1102**", "weight": 2}, {
            "itemId": "1301**",
            "weight": 0
        }, {"itemId": "1105022", "weight": 5}, {
            "itemId": "1105033",
            "weight": 1
        }, {"itemId": "1302*1", "weight": 1}, {
            "itemId": "1106013",
            "weight": 0
        }]
    }
};

var adHelper = {
    AD_STATUS_READY: 1,
    AD_STATUS_DISMISS: 2,
    AD_STATUS_ERROR: 3,
    AD_STATUS_SHOW: 4,
    AD_STATUS_DISMISS_NO_REWARD: 5,

    init: function (adType) {
        this.enable = true;
        this.adType = 0;
        this.restore();
    },
    save: function () {
    },
    restore: function () {
    },

    onAdStatusChange: function (status) {
        switch (status) {
            case this.AD_STATUS_READY:
                break;
            case this.AD_STATUS_ERROR:
                break;
            case this.AD_STATUS_DISMISS:
                cc.timer.resume();
                break;
            case this.AD_STATUS_SHOW:
                cc.timer.pause();
                break;
            case this.AD_STATUS_DISMISS_NO_REWARD:
                cc.timer.resume();
                break;
        }

        if (this._cb) {
            this._cb.call(this._target, status);
        }
    },
    addAdListener: function (target, cb) {
        this._target = target;
        this._cb = cb;
    },
    removeAdListener: function () {
        this._target = null;
        this._cb = null;
    }
};