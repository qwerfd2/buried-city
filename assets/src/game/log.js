var Log = cc.Class.extend({
    ctor: function () {
        this.logList = [];
    },
    addMsg: function (msg) {
        if (msg !== undefined && msg !== null) {
            if (typeof msg === 'number') {
                var args = [];
                for (var i = 0; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                msg = stringUtil.getString.apply(this, args);
            }
            var msg = {
                txt: msg,
                time: cc.timer.getTimeDayStr() + " " + cc.timer.getTimeHourStr()
            };
            this.logList.push(msg);
            utils.emitter.emit("logChanged", msg);
        }
    }
});