var TimerManager = cc.Class.extend({
    ctor: function () {
        //标准比例
        this.timeScaleOrigin = 10 * 60 / 6;
        this.timeScale = this.timeScaleOrigin;
        this.pausedRef = 0;
        cc.director.getScheduler().scheduleUpdateForTarget(this);

        this.stageTime = [6, 20];
        //游戏时间, 默认从6点开始
        this.time = 6 * 60 * 60 + 1;
        this.currentSeason = 0;
        this.restore();
        //现实时间
        this.realTime = this.time / this.timeScale;
        //是否加速
        this.isAccelerated = false;
        //加速结束时间
        this.accelerateEndTime = 0;

        this.callbackList = [];
        this.endCallbackList = [];
    },
    save: function () {
        var opt = {
            time: this.time
        };
        return opt;
    },

    restore: function () {
        var opt = Record.restore("time");
        if (opt) {
            this.time = opt.time;
        }
        this.currentSeason = this.getSeason();
    },

    update: function (dt) {
        if (this.isPaused())
            return;

        this.realTime += dt;
        var dtTime = dt * this.timeScale;
        this.updateTime(dtTime);

    },
    updateTime: function (dtTime) {
        this.time += dtTime;

        var self = this;
        this.callbackList.forEach(function (cb) {
            cb.process(dtTime);
            if (self.time >= cb.getEndTime()) {
                cb.end();
                self.endCallbackList.push(cb);
            }
        });
        //加速结束
        if (this.isAccelerated && this.time >= this.accelerateEndTime) {
            this.isAccelerated = false;
            this.timeScale = this.timeScaleOrigin;
        }

        while (this.endCallbackList.length != 0) {
            var endCb = this.endCallbackList.pop();
            if (!endCb.reset(this.time)) {
                this.removeTimerCallback(endCb);
            }
        }
        this.formatTime();
    },
    pause: function () {
        this.pausedRef++;
    },
    resume: function () {
        this.pausedRef--;
        this.pausedRef = Math.max(0, this.pausedRef);
    },
    isPaused: function () {
        return this.pausedRef > 0;
    },
    stop: function () {
        this.callbackList = [];
        cc.director.getScheduler().unscheduleUpdateForTarget(this);
    },
    accelerateWorkTime: function (time) {
        var realTime = 3;
        if (time / this.timeScale > realTime) {
            this.accelerate(time, realTime);
        }
    },
    accelerate: function (time, realTime) {
        if (this.isAccelerated) {
            return;
        }
        this.timeScale = time / realTime;
        this.isAccelerated = true;
        //加速结束时间
        this.accelerateEndTime = this.time + time;
    },
    formatTime: function () {
        var d = Math.floor(this.time / (24 * 60 * 60));
        var dTime = this.time % (24 * 60 * 60);
        var d = Math.floor(this.time / (24 * 60 * 60));
        var dTime = this.time % (24 * 60 * 60);
        var h = Math.floor(dTime / (60 * 60));
        var hTime = dTime % (60 * 60);
        var m = Math.floor(hTime / 60);
        var mTime = hTime % 60;
        var s = Math.floor(mTime);
        var format = {d: d, h: h, m: m, s: s};
        return format;
    },

    objToTime: function (obj) {
        var time = obj.d * 24 * 60 * 60 + obj.h * 60 * 60 + obj.m * 60 + obj.s;
        return time;
    },

    addToCallbackList: function (callback, priority) {
        var cb = callback;
        var p = priority || 0;
        cb.setPriority(p);

        this.callbackList.push(cb);
        this.callbackList.sort(function (a, b) {
            return b.priority - a.priority;
        });
    },

    addTimerCallback: function (callback, startTime, priority) {
        var cb = callback;
        var now = startTime === undefined || startTime === null ? this.time : startTime;
        cb.setStartTime(now);

        this.addToCallbackList(cb, priority);
        return cb;
    },

    //每小时的什么时间执行
    addTimerCallbackByHour: function (time, target, func, priority) {
        var nowTime = this.time;
        var now = this.formatTime();
        //今天的目标时间是否已经度过
        var targetTimeObj = {
            d: now.d,
            h: now.h,
            m: time.m || 0,
            s: time.s || 0
        };
        var targetTime = this.objToTime(targetTimeObj);
        if (targetTime >= nowTime) {
            //使用头一小时的此时
            if (targetTimeObj.h == 0) {
                targetTimeObj.d--;
                targetTimeObj.h = 23;
            } else {
                targetTimeObj.h--;
            }
            targetTime = this.objToTime(targetTimeObj);
        }

        var cb = new TimerCallback(60 * 60, target, {end: func}, TimerManager.REPEAT_FOREVER);
        return this.addTimerCallback(cb, targetTime, priority);
    },
    //每分钟执行
    addTimerCallbackByMinute: function (delegate) {
        var cb = new TimerCallback(60, delegate, {
            process: delegate.process
        }, TimerManager.REPEAT_FOREVER);
        return this.addTimerCallback(cb);
    },
    //整点
    addTimerCallbackHourByHour: function (target, func, priority) {
        return this.addTimerCallbackByHour({}, target, func, priority);
    },

    //每天某时间执行
    addTimerCallbackByDay: function (time, target, func, priority) {
        var nowTime = this.time;
        var now = this.formatTime();
        //今天的目标时间是否已经度过
        var targetTimeObj = {
            d: now.d,
            h: time.h || 0,
            m: time.m || 0,
            s: time.s || 0
        };
        var targetTime = this.objToTime(targetTimeObj);
        if (targetTime >= nowTime) {
            //使用头一天的此时
            targetTimeObj.d--;
            targetTime = this.objToTime(targetTimeObj);
        }

        var cb = new TimerCallback(24 * 60 * 60, target, {end: func}, TimerManager.REPEAT_FOREVER);
        return this.addTimerCallback(cb, targetTime, priority);
    },

    //每天0点时
    addTimerCallbackDayByDay: function (target, func, priority) {
        return this.addTimerCallbackByDay({h: 0}, target, func, priority);
    },

    removeTimerCallback: function (callback) {
        var index = this.callbackList.indexOf(callback);
        if (index != -1) {
            this.callbackList.splice(index, 1);
        }
    },

    //日夜交替
    addTimerCallbackDayAndNight: function (target, func, priority) {
        var cb1 = this.addTimerCallbackByDay({h: this.stageTime[0]}, this, function () {
            func.call(target, "day");
        }, priority);
        var cb2 = this.addTimerCallbackByDay({h: this.stageTime[1]}, this, function () {
            func.call(target, "night");
        }, priority);
        return [cb1, cb2];
    },

    removeTimerCallbackDayAndNight: function (cb) {
        var self = this;
        cb.forEach(function (c) {
            self.removeTimerCallback(c);
        });
    },

    skipStage: function () {
        var endTime = 0;
        var formatTime = this.formatTime();
        if (formatTime.h < this.stageTime[0]) {
            endTime = this.objToTime({
                d: formatTime.d,
                h: this.stageTime[0],
                m: 0,
                s: 0
            });
        } else if (formatTime.h >= this.stageTime[0] && formatTime.h < this.stageTime[1]) {
            endTime = this.objToTime({
                d: formatTime.d,
                h: this.stageTime[1],
                m: 0,
                s: 0
            });
        } else {
            endTime = this.objToTime({
                d: formatTime.d + 1,
                h: this.stageTime[0],
                m: 0,
                s: 0
            });
        }
        var dtTime = endTime - this.time;
        this.updateTime(dtTime);
    },

    getTimeFromNowToMorning: function () {
        var endTime = 0;
        var formatTime = this.formatTime();
        if (formatTime.h < this.stageTime[0]) {
            endTime = this.objToTime({
                d: formatTime.d,
                h: this.stageTime[0],
                m: 0,
                s: 0
            });
        } else {
            endTime = this.objToTime({
                d: formatTime.d + 1,
                h: this.stageTime[0],
                m: 0,
                s: 0
            });
        }
        var dtTime = endTime - this.time;
        return dtTime;
    },

    getSeason: function (timeObj) {
        timeObj = timeObj || this.formatTime();
        var day = timeObj.d % 120;
        var season = Math.floor(day / 30);
        return season;
    },

    checkSeason: function () {
        var s = this.getSeason();
        if (s != this.currentSeason) {
            this.currentSeason = s;
            player.log.addMsg(stringUtil.getString(3016)[this.currentSeason]);
            Achievement.checkSeason(this.currentSeason);
        }
    },

    getStage: function () {
        var formatTime = this.formatTime();
        if (formatTime.h < this.stageTime[0]) {
            return "night";
        } else if (formatTime.h >= this.stageTime[0] && formatTime.h < this.stageTime[1]) {
            return "day";
        } else {
            return "night";
        }
    },
    now: function () {
        return this.time;
    },
    getTimeNum: function() {
        var timeObj = this.formatTime();
        return (timeObj.d + 1);
    },
    getTimeDayStr: function () {
        var timeObj = this.formatTime();
        return stringUtil.getString(1000, timeObj.d + 1);
    },
    getTimeHourStr: function () {
        var timeObj = this.formatTime();
        var str = "";
        if (timeObj.h < 10) {
            str += "0" + timeObj.h;
        } else {
            str += timeObj.h;
        }
        str += ":";
        if (timeObj.m < 10) {
            str += "0" + timeObj.m;
        } else {
            str += timeObj.m;
        }
        return str;
    },
    getFinalTimeStr: function () {
        var timeObj = this.formatTime();
        var hourStr = "";
        if (timeObj.h < 10) {
            hourStr += "0" + timeObj.h;
        } else {
            hourStr += timeObj.h;
        }
        var minuteStr = "";
        if (timeObj.m < 10) {
            minuteStr += "0" + timeObj.m;
        } else {
            minuteStr += timeObj.m;
        }
        return stringUtil.getString(1203, timeObj.d, hourStr, minuteStr);
    },
    getFinalTimeNum: function () {
        var timeObj = this.formatTime();
        var hourStr = "";
        if (timeObj.h < 10) {
            hourStr += "0" + timeObj.h;
        } else {
            hourStr += timeObj.h;
        }
        var minuteStr = "";
        if (timeObj.m < 10) {
            minuteStr += "0" + timeObj.m;
        } else {
            minuteStr += timeObj.m;
        }
        return [timeObj.d, hourStr, minuteStr];
    },
    getTimeStr: function (val) {
        var timeObj = this.formatT(val);
        //var timeObj = {d:1,h:1,s:1};
        var hourStr = "";
        if (timeObj.h < 10) {
            hourStr += "0" + timeObj.h;
        } else {
            hourStr += timeObj.h;
        }
        var minuteStr = "";
        if (timeObj.m < 10) {
            minuteStr += "0" + timeObj.m;
        } else {
            minuteStr += timeObj.m;
        }
        return stringUtil.getString(1203, timeObj.d, hourStr, minuteStr);
    },
    formatT: function (val) {
        var d = Math.floor(val / (24 * 60 * 60));
        var dTime = val % (24 * 60 * 60);
        var d = Math.floor(val / (24 * 60 * 60));
        var dTime = val % (24 * 60 * 60);
        var h = Math.floor(dTime / (60 * 60));
        var hTime = dTime % (60 * 60);
        var m = Math.floor(hTime / 60);
        var mTime = hTime % 60;
        var s = Math.floor(mTime);
        var format = {d: d, h: h, m: m, s: s};
        return format;
    }
});

TimerManager.REPEAT_FOREVER = Number.MAX_VALUE;

var TimerCallback = cc.Class.extend({
    ctor: function (internalTime, target, delegate, repeat) {
        this.internalTime = internalTime;
        this.target = target;
        this.delegate = delegate;
        this.repeat = repeat || 1;

        this.priority = 0;
    },
    setStartTime: function (now) {
        this.startTime = now;
        this.updateEndTime();
    },
    setPriority: function (p) {
        this.priority = p;
    },
    updateEndTime: function () {
        this.endTime = this.startTime + this.internalTime;
    },
    getEndTime: function () {
        return this.endTime;
    },
    process: function (dtTime) {
        if (this.delegate.process) {
            this.delegate.process.call(this.target, dtTime);
        }
    },
    end: function () {
        if (this.delegate.end) {
            this.delegate.end.call(this.target);
        }
        this.repeat--;
    },
    //判断是否可以重置
    reset: function (now) {
        if (this.repeat > 0) {
            this.setStartTime(now);
            return true;
        } else {
            return false;
        }
    },
    toJSON: function () {
        return {
            internalTime: this.internalTime,
            startTime: this.startTime,
            repeat: this.repeat,
            priority: this.priority
        };
    }
});