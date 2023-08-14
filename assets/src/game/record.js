var Record = {
    recordObj: null,
    recordName: null,
    init: function (recordName) {
        this.recordName = recordName;
        this.recordObj = JSON.parse(cc.sys.localStorage.getItem(recordName) || "{}");
    },
    saveAll: function () {
        if (!IS_IN_WORKROOM_STORAGE_NODE) {
            this.save("player", player.save());
            this.save("time", cc.timer.save());
        }
    },
    save: function (key, obj) {
        this.recordObj[key] = obj;
        this.flush();
    },
    deleteRecord: function (recordName) {
        if (this.recordObj) {
            delete this.recordObj;
        }
        cc.sys.localStorage.removeItem(recordName);
    },
    restore: function (key) {
        return this.recordObj[key];
    },
    flush: function () {
        cc.sys.localStorage.setItem(this.recordName, JSON.stringify(this.recordObj));
    },
    uuid: null,
    getUUID: function () {
        this.uuid = this.uuid || cc.sys.localStorage.getItem("uuid");
        if (!this.uuid) {
            this.uuid = "" + new Date().getTime();
            for (var i = 0; i < 5; i++) {
                this.uuid += utils.getRandomInt(0, 9);
            }
            cc.sys.localStorage.setItem("uuid", this.uuid);
        }
        return this.uuid;
    },
    getUsername: function () {
        var username = cc.sys.localStorage.getItem("username") || 0;
        if (username == 0 || username == "" || username == null) {
            var uid = this.getUUID();
            return uid.substr(uid.length - 5);
        }
        return username;
    },
    setUsername: function (username) {
        cc.sys.localStorage.setItem("username", username);
    },
    isFirstTime: function () {
        var record = cc.sys.localStorage.getItem("record");
        return !record;
    },
    getLastScore: function () {
        var lastScore = cc.sys.localStorage.getItem("lastScore");
        if (lastScore) {
            lastScore = JSON.parse(lastScore);
        }
        return lastScore;
    },
    setLastScore: function (data) {
        var log = cc.sys.localStorage.getItem("dataLog") || "[]";
        log = JSON.parse(log);
        log.unshift(data);
        if (log.length > 20){
            log.pop();
        }
        cc.sys.localStorage.setItem("dataLog", JSON.stringify(log));
    },

    getType: function () {
        var type = cc.sys.localStorage.getItem("type");
        if (type === undefined || type === null || type === "") {
            return -1;
        } else {
            return Number(type);
        }
    },
    setType: function (type) {
        cc.sys.localStorage.setItem("type", type);
    },

    getMedalCheat: function () {
       var value = cc.sys.localStorage.getItem("cheat") || 0;
       return value == 1 ? true : false;
    },
    
    setMedalCheat: function (on) {
        var onVal = 2;
        if (on) {
            onVal = 1;
        }
        cc.sys.localStorage.setItem("cheat", onVal);
    },
    
    getScreenFix: function () {
       var value = cc.sys.localStorage.getItem("screenfix") || 0;
       return value;
    },
    
    setScreenFix: function (on) {
        cc.sys.localStorage.setItem("screenfix", Number(on));
    },
    
    getCity: function () {
       var value = cc.sys.localStorage.getItem("city") || 0;
       return value == 1 ? true : false;
    },
    
    setCity: function (on) {
        var onVal = 2;
        if (on) {
            onVal = 1;
        }
        cc.sys.localStorage.setItem("city", onVal);
    },
    
    getFestival: function () {
       var value = cc.sys.localStorage.getItem("festival") || 0;
       return value == 1 ? true : false;
    },
    
    setFestival: function (on) {
        var onVal = 2;
        if (on) {
            onVal = 1;
        }
        cc.sys.localStorage.setItem("festival", onVal);
    }
};

var ShareType = {
    NO_SHARED: 1,
    SHARED_CAN_REWARD: 2,
    SHARED_AND_REWARD: 3
};