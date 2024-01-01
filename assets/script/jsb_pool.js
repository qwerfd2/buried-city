cc.pool = {
    _pool: {},

    _releaseCB: function () {
        this.release();
    },

    _autoRelease: function (obj) {
        var running = obj._running === undefined ? false : !obj._running;
        cc.director.getScheduler().scheduleCallbackForTarget(obj, this._releaseCB, 0, 0, 0, running)
    },

    putInPool: function (obj) {
        var pid = obj.constructor.prototype.__pid;
        if (!pid) {
            var desc = { writable: true, enumerable: false, configurable: true };
            desc.value = ClassManager.getNewID();
            Object.defineProperty(obj.constructor.prototype, '__pid', desc);
        }
        if (!this._pool[pid]) {
            this._pool[pid] = [];
        }

        obj.retain && obj.retain();

        obj.unuse && obj.unuse();
        this._pool[pid].push(obj);
    },

    hasObject: function (objClass) {
        var pid = objClass.prototype.__pid;
        var list = this._pool[pid];
        if (!list || list.length == 0) {
            return false;
        }
        return true;
    },

    removeObject: function (obj) {
        var pid = obj.constructor.prototype.__pid;
        if (pid) {
            var list = this._pool[pid];
            if (list) {
                for (var i = 0; i < list.length; i++) {
                    if (obj === list[i]) {

                        obj.release && obj.release();
                        list.splice(i, 1);
                    }
                }
            }
        }
    },

    getFromPool: function (objClass) {
        if (this.hasObject(objClass)) {
            var pid = objClass.prototype.__pid;
            var list = this._pool[pid];
            var args = Array.prototype.slice.call(arguments);
            args.shift();
            var obj = list.pop();

            obj.reuse && obj.reuse.apply(obj, args);

            cc.sys.isNative && obj.release && this._autoRelease(obj);
            return obj;
        }
    },

    drainAllPools: function () {
        for (var i in this._pool) {
            for (var j = 0; j < this._pool[i].length; j++) {
                var obj = this._pool[i][j];

                obj.release && obj.release();
            }
        }
        this._pool = {};
    }
};