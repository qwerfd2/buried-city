var MedalConfig = {
    103: {
        aim: 5,
        aimCompleted: 0,
        completed: 0,
        effect: {items: [{itemId: 1103083, num: 6}]}
    },
    102: {
        aim: 60,
        aimCompleted: 0,
        completed: 0,
        effect: {items: [{itemId: 1104011, num: 2}]}
    },
    101: {
        aim: 120,
        aimCompleted: 0,
        completed: 0,
        effect: {items: [{itemId: 1104043, num: 1}]}
    },
    203: {
        aim: 20,
        aimCompleted: 0,
        completed: 0,
        effect: {attr: {hp: 10}}
    },
    202: {
        aim: 200,
        aimCompleted: 0,
        completed: 0,
        effect: {attr: {hp: 20}}
    },
    201: {
        aim: 2000,
        aimCompleted: 0,
        completed: 0,
        effect: {attr: {hp: 50}}
    },
    303: {
        aim: 5,
        aimCompleted: 0,
        completed: 0,
        effect: {items: [{itemId: 1305011, num: 30}]}
    },
    302: {
        aim: 15,
        aimCompleted: 0,
        completed: 0,
        effect: {items: [{itemId: 1301011, num: 1}]}
    },
    301: {
        aim: 30,
        aimCompleted: 0,
        completed: 0,
        effect: {items: [{itemId: 1301052, num: 1}]}
    }
};
var Medal = {
    _map: null,
    init: function () {
        if (!this._map) {
            var medalStr = cc.sys.localStorage.getItem("medal");
            if (medalStr) {
                this._map = JSON.parse(medalStr);
            } else {
                this._map = utils.clone(MedalConfig);
            }
            for (var medalId in this._map) {
                var medalInfo = this._map[medalId];
                medalInfo.aim = MedalConfig[medalId].aim;
                medalInfo.effect = MedalConfig[medalId].effect;
            }
        }
    },
    save: function () {
        cc.sys.localStorage.setItem("medal", JSON.stringify(this._map));
    },
    newGameReset: function () {
        var ids = ["101", "102", "103", "301", "302", "303"];
        var self = this;
        ids.forEach(function (id) {
            var info = self._map[id];
            if (!info.completed) {
                info.aimCompleted = 0;
            }
        });
        this.save();
    },
    improve: function (player) {
        this.improveAttr(player);
        this.improveItems(player);
    },
    improveAttr: function (player) {
        var ids = ["201", "202", "203"];
        var self = this;
        ids.forEach(function (id) {
            var info = self._map[id];
            if (info.completed === 1 || Record.getMedalCheat()) {
                player.hp += info.effect.attr.hp;
                player.hpMaxOrigin += info.effect.attr.hp;
                player.hpMax = player.hpMaxOrigin;
            }
        });
    },
    getNowMedalIndex: function (index) {
        var medalInfoIndex = Number("" + index + "03");
        var medalInfoEndIndex = Number("" + index + "01");
        for (var i = medalInfoIndex; i >= medalInfoEndIndex; i--) {
            if (this._map[i].completed || Record.getMedalCheat())
                medalInfoIndex = i - 1;
        }
        if (this._map[medalInfoIndex])
            return medalInfoIndex;
        else
            return medalInfoIndex + 1;
    },
    getCompletedMedalIndex: function (index) {
        var medalInfoIndex = Number("" + index + "03");
        var medalInfoEndIndex = Number("" + index + "01");
        for (var i = medalInfoIndex; i >= medalInfoEndIndex; i--) {
            if (this._map[i].completed)
                medalInfoIndex = i;
        }
        if (this._map[medalInfoIndex])
            return medalInfoIndex;
        return null;
    },
    improveItems: function (player) {
        var ids = ["101", "102", "103", "301", "302", "303"];
        var self = this;
        ids.forEach(function (id) {
            var info = self._map[id];
            if (info.completed === 1 || Record.getMedalCheat()) {
                info.effect.items.forEach(function (item) {
                    player.storage.increaseItem(item.itemId, item.num);
                });
            }
        });
    },
    checkCompleted: function (medalInfo, index) {
        if (medalInfo != 1) {
            if (medalInfo.aimCompleted >= medalInfo.aim) {
                medalInfo.completed = 1;
                this.addCompletedForOneGame(index);
            }
        }
    },
    initCompletedForOneGame: function (isNewGame) {
        var completeOneGame = cc.sys.localStorage.getItem("medalTemp");
        if (isNewGame || !completeOneGame) {
            this._completeForOneGame = [];
        } else {
            this._completeForOneGame = JSON.parse(completeOneGame);
        }
        cc.sys.localStorage.setItem("medalTemp", JSON.stringify(this._completeForOneGame));
    },
    addCompletedForOneGame: function (medalInfo) {
        this._completeForOneGame.push(medalInfo);
        cc.sys.localStorage.setItem("medalTemp", JSON.stringify(this._completeForOneGame));
    },
    getCompletedForOneGame: function () {
        return this._completeForOneGame;
    },
    checkDay: function (day) {
        var ids = ["101", "102", "103"];
        var self = this;
        ids.forEach(function (id) {
            var info = self._map[id];
            if (info.completed !== 1) {
                info.aimCompleted += Number(day);
                self.checkCompleted(info, 1);
            }
        });
        this.save();
    },
    checkMonsterKilled: function (num) {
        var ids = ["201", "202", "203"];
        var self = this;
        ids.forEach(function (id) {
            var info = self._map[id];
            if (info.completed !== 1) {
                info.aimCompleted += Number(num);
                self.checkCompleted(info, 2);
            }
        });
        this.save();
    },
    checkSecretRoomEnd: function (num) {
        var ids = ["301", "302", "303"];
        var self = this;
        ids.forEach(function (id) {
            var info = self._map[id];
            if (info.completed !== 1) {
                info.aimCompleted += Number(num);
                self.checkCompleted(info, 3);
            }
        });
        this.save();
    }
};