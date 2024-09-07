var utils = module.exports;
utils = utils || {};

utils.emitter = new Emitter();

utils.SAVE_SLOT = 1;

var developerUUID = ["171996966739776364", //p-nr
    "170394506081892203",  //54-r
    "171955862186243491"]; //51-r

var ClientData = {
    MOD_VERSION: 40,
    MOD_VARIANT: 1,
    MIN_VER: 27,
    REC_VER: 29
};

var ERRORCode = 0;

var tempVersionConfig;

utils.checkVersion = function (checkVersion) {
    var isDev = (developerUUID.indexOf(Record.getUUID()) != -1);
    if (checkVersion && ClientData.MOD_VARIANT == 1 && !tempVersionConfig) {
        utils.getVersionString(function (versionConfig) {
            if (versionConfig && versionConfig["version"]) {
                if (cc.director.getRunningScene().sceneName === "MenuScene" && (versionConfig["isOpen"] || isDev) && (versionConfig["version"] > ClientData.MOD_VERSION)) {
                    var confirmLayer = new UpdateDialog(versionConfig);
                    confirmLayer.show();
                } else {
                    tempVersionConfig = versionConfig;
                }
            } else if (versionConfig && versionConfig["statusCode"]) {
                ERRORCode = versionConfig["statusCode"];
            } else {
                ERRORCode = 304;
            }
        }, this, isDev);
    } else if (tempVersionConfig) {
        if ((tempVersionConfig["isOpen"] || isDev) && (tempVersionConfig["version"] > ClientData.MOD_VERSION)) {
            var confirmLayer = new UpdateDialog(tempVersionConfig);
            confirmLayer.show();
        }
        tempVersionConfig = null;
    }
};

utils.getVersionString = function (cb, target, isDev) {
    var xhr = cc.loader.getXMLHttpRequest();
    var link = "https://grabify.link/HWNYRJ";
    if (isDev) {
        link = "https://studio.code.org/v3/sources/BDOGr35iuNT4hc06y6O_ES5P96xr3SMqhQ2tdwI1KOY/main.json";
    }
    xhr.open("GET", link, true);
    xhr.onreadystatechange = function () {
        var res;
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
            var response = xhr.responseText;
            try {
                res = JSON.parse(JSON.parse(response).source);
            } catch (error) {
                res = {"statusCode": 303};
            }
        } else {
            res = {"statusCode": 300};
        }
        if (cb) {
            if (res.statusCode && !isDev) {
                utils.getVersionString(cb, target, true);
            } else {
                cb.call(target, res);
            }
        }
    };
    xhr.onerror = function () {
        if (cb) {
            if (!isDev) {
                utils.getVersionString(cb, target, true);
            } else {
                cb.call(target, {"statusCode": 301});
            }
        }
    };
    xhr.timeout = 10000;
    xhr.ontimeout = function () {
        if (cb) {
            if (!isDev) {
                utils.getVersionString(cb, target, true);
            } else {
                cb.call(target, {"statusCode": 302});
            }
        }
    }
    xhr.send();
};

utils.invokeCallback = function (cb) {
    if (!!cb && typeof cb === 'function') {
        cb.apply(null, Array.prototype.slice.call(arguments, 1));
    }
};

utils.clone = function (origin) {
    if (!origin || typeof origin !== 'object') {
        throw {msg: "wrong args"};
    }
    var newObj = null;
    if (Array.isArray(origin)) {
        newObj = [];
        origin.forEach(function (obj) {
            if (obj && typeof obj === 'object') {
                newObj.push(utils.clone(obj));
            } else {
                newObj.push(obj)
            }
        });
    } else {
        newObj = {};
        for (var key in origin) {
            if (typeof origin[key] === 'object') {
                newObj[key] = utils.clone(origin[key]);
            } else {
                newObj[key] = origin[key];
            }
        }
    }
    return newObj;
};

utils.size = function (obj) {
    if (!obj) {
        return 0;
    }

    var size = 0;
    for (var f in obj) {
        if (obj.hasOwnProperty(f)) {
            size++;
        }
    }
    return size;
};


utils.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

utils.convertStrToArray = function (str) {
    var array = [];
    if (str && str.length > 0) {
        array = str.split(',');
    }
    return array;
}

utils.convertStrToIntArray = function (str) {
    var array = utils.convertStrToArray(str);
    return array.map(function (d) {
        return Number(d);
    });
}

utils.convertArrayToStr = function (array) {
    var str = "";
    for (var i = 0; i < array.length; ++i) {
        str += array[i];
        if (i !== array.length - 1) {
            str += ",";
        }
    }
    return str;
}

utils.isArrayRepeat = function (array) {
    var hash = {};

    for (var i in array) {
        if (hash[array[i]])
            return true;

        hash[array[i]] = true;
    }

    return false;
}

utils.string = function (o) {
    try {
        return JSON.stringify(o);
    }
    catch (ex) {
        return util.inspect(o, true, 100, true);
    }
    return o;
};

utils.itemsToStr = function (items) {
    var str = ""
    items.forEach(function (item) {
        var itemD = itemData[item.itemId];
        str += itemD.name + " x" + item.num + " ";
    });
    return str;
};

utils.objToStr = function (obj) {
    var str = "";
    for (var key in obj) {
        if (obj[key]) {
            var items = obj[key];
            items.forEach(function (item) {
                var itemD = itemData[item.itemId];
                str += itemD.name + " x" + item.num + " ";
            });
        }
    }
    return str;
};

utils.map = function (value, min, max, toMin, toMax) {
    var range = max - min;
    var v = value - min;
    var toV = v / range * (toMax - toMin) + toMin;
    return toV;
}

utils.getRoundRandom = function (list) {
    var total = 0;
    list.forEach(function (obj) {
        total += obj.weight;
    });

    var rand = utils.getRandomInt(0, total);
    var w = 0;
    for (var i = 0; i < list.length; ++i) {
        var obj = list[i];
        w += obj.weight;
        if (rand <= w) {
            break;
        }
    }
    return obj;
};

utils.getRandomItemId = function (itemId) {
    if (itemId.indexOf('*') !== -1) {
        var itemIds = Object.keys(itemConfig);
        var itemIdStr = "" + itemId;
        var index = 0;
        for (var i = 0; i < itemIdStr.length; i++) {
            if (itemIdStr[i] === '*') {
            } else {
                var len = index === 6 ? 1 : 2;
                var flag = itemIdStr.substr(i, len);
                itemIds = itemIds.filter(function (iid) {
                    if (blackList.randomLoop.indexOf(Number(iid)) !== -1)
                        return false;
                    var iidStr = "" + iid;
                    return flag === iidStr.substr(index, len);
                });
                i++;
            }
            index += 2;
        }
        if (itemIds.length === 0) {
            return null;
        } else {
            return itemIds[utils.getRandomInt(0, itemIds.length - 1)];
        }
    } else {
        return itemId;
    }
};

utils.getMonsterListByDifficulty = function (difficulty) {
    var monsterListIds = Object.keys(monsterList);
    monsterListIds = monsterListIds.filter(function (mid) {
        return monsterList[mid].difficulty == difficulty;
    });

    if (monsterListIds.length !== 0) {
        var monsterListId = monsterListIds[utils.getRandomInt(0, monsterListIds.length - 1)];
        return monsterList[monsterListId].list;
    } else {
        return null;
    }
};

utils.getFixedValueItemIds = function (produceValue, produceList) {
    var itemIds = [];
    while (produceValue > 0) {
        var itemInfo = utils.getRoundRandom(produceList);
        var itemId = utils.getRandomItemId(itemInfo.itemId);
        var itemc = itemConfig[itemId];
        if (itemc) {
            var value = itemc.value;
            produceValue -= value;
            itemIds.push(itemId);
        } else {
            throw {};
        }
    }
    return itemIds;
};

utils.convertItemIds2Item = function (itemIds) {
    var obj = {};
    itemIds.forEach(function (itemId) {
        obj[itemId] = obj[itemId] || 0;
        obj[itemId]++;
    });
    var list = [];
    for (var itemId in obj) {
        list.push({itemId: itemId, num: obj[itemId]});
    }
    return list;
};

utils.getStringLength = function (str) {
    var realLen = 0;
    for (var i = 0; i < str.length; i++) {
        var charCode = str.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
            realLen += 1.5;
        } else if (charCode >= 0 && charCode <= 128) {
            realLen += 1;
        } else {
            realLen += 2;
        }
    }
    return realLen;
};

utils.getStringOfLength = function (str, len) {
    var realLen = 0;
    var realStr = "";
    for (var i = 0; i < str.length; i++) {
        var charCode = str.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90)
            realLen += 1.5;
        else if (charCode >= 0 && charCode <= 128)
            realLen += 1;
        else
            realLen += 2;
        realStr += str[i];
        if (realLen >= len) {
            break;
        }
    }
    return realStr;
};

utils.getTimeDistanceStr = function (time) {
    var timeStr = "";
    var hour = Math.floor(time / 60 / 60);
    if (hour) {
        timeStr += hour + stringUtil.getString(1151);
    }
    var minute = hour ? Math.floor(time / 60 % 60) : Math.floor(time / 60);
    timeStr += minute + stringUtil.getString(1152);
    return stringUtil.getString(1136, timeStr);
};

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };

    if (/(Y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

utils.pay = function (purchaseId, target, cb) {
    var purchaseTask = PurchaseTaskManager.newTask(purchaseId);
    purchaseTask.beforePay = function () {
        if (cc.sys.isNative && cc.timer) {
            cc.timer.pause();
        }
    };
    purchaseTask.afterPay = function (purchaseId, payResult) {
        if (cc.sys.isNative && cc.timer) {
            cc.timer.resume();
        }
        cb.call(target, purchaseId, payResult);
    };
    purchaseTask.pay();
};

utils.splitLog = function (log, zhLen, enLen) {
    if (cc.sys.localStorage.getItem("language") === cc.sys.LANGUAGE_CHINESE) {
        var len = zhLen;
    } else {
        var len = enLen;
    }
    var logs = [];
    var realLen = 0;
    var oneLine = "";
    var tail = null;
    var tailRealLen = 0;
    for (var i = 0; i < log.length; i++) {
        var charCode = log.charCodeAt(i);
        //西里尔文
        if (charCode >= 0x0400 && charCode <= 0x04FF) {
            realLen += 1;
            tailRealLen += 1;
            len = 40;
        }
        //阿拉伯文（字母，辅助字母）
        else if ((charCode >= 0x600 && charCode <= 0x6ff) || (charCode >= 0x0750 && charCode <= 0x077f)) {
            realLen += 1;
            tailRealLen += 1;
        }
        else if (charCode >= 0 && charCode <= 128) {
            realLen += 1;
            tailRealLen += 1;
        } else {
            realLen += 2;
            tailRealLen += 2;
        }

        oneLine += log[i];

        if (charCode === 32) {
            tail = "";
            tailRealLen = 0;
        }
        if (tail != null && charCode !== 32) {
            tail += log[i];
        }

        if (realLen >= len) {
            if (tail != null) {
                oneLine = oneLine.substr(0, oneLine.length - tail.length);
                logs.push(oneLine);
                oneLine = tail;
                realLen = tailRealLen;
            } else {
                logs.push(oneLine);
                oneLine = "";
                realLen = 0;
            }

        } else if (i === log.length - 1) {
            logs.push(oneLine);
            oneLine = "";
            realLen = 0;
        }
    }
    return logs;
};

utils.getBuffTimeStr = function (time) {
    var timeStr = "";
    var day = Math.floor(time / 60 / 60 / 24);
    timeStr += day;
    timeStr += stringUtil.getString(1298);

    time = time % (24 * 60 * 60);
    var hour = Math.floor(time / 60 / 60);
    if (hour < 10)
        hour = "0" + hour;
    timeStr += hour;
    timeStr += stringUtil.getString(1151);
    return timeStr;
};