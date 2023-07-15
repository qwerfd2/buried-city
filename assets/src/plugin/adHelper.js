
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

var AdController = cc.Class.extend({
    ctor: function () {
    },
    preloadAd: function () {
    },
    showAd: function () {
    }
});

var adHelper = {
    AD_STATUS_READY: 1,
    AD_STATUS_DISMISS: 2,
    AD_STATUS_ERROR: 3,
    AD_STATUS_SHOW: 4,
    AD_STATUS_DISMISS_NO_REWARD: 5,

    enable: false,

    init: function (adType) {
        if (PurchaseAndroid.payType === PurchaseAndroid.PAY_TYPE_GOOGLE_PLAY) {
            this.enable = true;
        } else {
            this.enable = false;
        }
        if (!this.enable)
            return;

        cc.log("ad init");
        this.adType = 0;
        this._isAdReady = false;
        this._isAdActive = false;
        this.restore();
    },
    save: function () {

    },
    restore: function () {

    },

    changeAdActive: function (active) {
        this._isAdActive = active;
        cc.log("ad active change " + active);
        this.save();
    },

    //每天有概率激活广告
    activeAd: function () {
        if (!this.enable)
            return;
        cc.log("active ad");
        if (!this.isAdActive()) {
            var rand = Math.random();
            if (rand < adConfig.probability) {
                this.changeAdActive(true);
            }
        }
        this.updateAd();
    },

    updateAd: function () {
        if (!this.enable)
            return;
        cc.log("update ad active=" + this.isAdActive() + " ready=" + this.isAdReady());
        if (this.isAdActive() && !this.isAdReady()) {
            this.preloadAd();
        }
    },
    preloadAd: function () {
        if (!this.enable)
            return;
        cc.log("preload ad");
        if (this._ad) {
            this._ad.preloadAd();
        }
    },
    showAd: function () {
        if (!this.enable)
            return;
        cc.log("show ad");
        if (this._ad) {
            this._ad.showAd();
        }
    },
    onAdStatusChange: function (status) {
        cc.log("on ad change " + status);
        switch (status) {
            case this.AD_STATUS_READY:
                this._isAdReady = true;
                break;
            case this.AD_STATUS_ERROR:
                this._isAdReady = false;
                break;
            case this.AD_STATUS_DISMISS:
                this._isAdReady = false;
                this.changeAdActive(false);
                cc.timer.resume();
                break;
            case this.AD_STATUS_SHOW:
                cc.timer.pause();
                break;
            case this.AD_STATUS_DISMISS_NO_REWARD:
                this._isAdReady = false;
                this.changeAdActive(false);
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
    },

    isAdReady: function () {
        return 0;
    },

    isAdActive: function () {
        return this._isAdActive;
    }
};