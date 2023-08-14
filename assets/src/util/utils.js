var utils = module.exports;
utils = utils || {};

utils.emitter = new Emitter();

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
            if (key == "gameMoney") {
                str += "电力 x" + obj[key] + " ";
            } else if (key == "money") {
                str += "钻石 x" + obj[key] + " ";
            } else {
                var items = obj[key];
                items.forEach(function (item) {
                    var itemD = itemData[item.itemId];
                    str += itemD.name + " x" + item.num + " ";
                });
            }
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
    ///中文2，英文1
    var realLength = 0, len = str.length, charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
};

utils.timeToStr = function (time) {
    var second = 1000;
    var minutes = second * 60;
    var hours = minutes * 60;
    var days = hours * 24;
    var months = days * 30;

    var longtime = new Date().getTime() - time;

    var timeStr = stringUtil.getString("time_str");
    if (longtime > months) {
        return timeStr[0];
    } else if (longtime > days * 7) {
        return timeStr[1];
    } else if (longtime > days) {
        return cc.formatStr(timeStr[2], Math.floor(longtime / days));
    } else if (longtime > hours) {
        return cc.formatStr(timeStr[3], Math.floor(longtime / hours));
    } else if (longtime > minutes) {
        return cc.formatStr(timeStr[4], Math.floor(longtime / minutes));
    } else if (longtime > second) {
        return cc.formatStr(timeStr[5], Math.floor(longtime / second));
    } else {
        return timeStr[6];
    }
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
utils.getTimeShareRetainStr = function (time) {
    time = Math.floor(time / 1000);
    var timeStr = "";
    var hour = Math.floor(time / 60 / 60);
    if (hour < 10)
        hour = "0" + hour;
    var minute = Math.floor(time / 60 % 60);
    if (minute < 10)
        minute = "0" + minute;
    var second = Math.floor(time % 60);
    if (second < 10)
        second = "0" + second;
    timeStr += hour + ":" + minute + ":" + second;
    return timeStr;
}

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds() // millisecond
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

utils.getProductIdMap = function () {
    var productIdMap = {};
    var purchaseIdList = Object.keys(PurchaseList);
    purchaseIdList.forEach(function (purchaseId) {
        var priceList = PurchaseList[purchaseId].priceList;
        priceList.forEach(function (info) {
            info.purchaseId = purchaseId;
            productIdMap[info.productId] = info;
        });
    });
    return productIdMap;
};

utils.getDateByTimezone = function (timezone) {
    var d = new Date(); //创建一个Date对象
    var localTime = d.getTime();
    var localOffset = d.getTimezoneOffset() * 60000; //获得当地时间偏移的毫秒数
    var utc = localTime + localOffset; //utc即GMT时间
    var offset = timezone;
    var timezoneTime = utc + (3600000 * offset);
    return new Date(timezoneTime);
};

utils.getFlagName = function (countryCode) {
    var flagName = "res/flags/" + countryCode + ".png";
    try {
        if (!jsb.fileUtils.isFileExist(flagName)) {
            flagName = "res/flags/CN.png";
        }
    } catch (e) {
        flagName = "res/flags/CN.png";
    }
    return flagName;
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