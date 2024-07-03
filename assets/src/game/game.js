var player;
var game = {
    init: function () {
        Record.init("record");
        Navigation.init();
        if (utils.emitter) {
            utils.emitter.removeAllListeners();
        }
        utils.emitter = new Emitter();
        cc.timer = new TimerManager();
        player = new Player();
        player.restore();
        userGuide.init();
        Medal.initCompletedForOneGame(false);
    },
    start: function () {
        player.start();
    },
    stop: function () {
        if (cc.timer) {
            cc.timer.stop();
        }
    },
    relive: function () {
        this.init();
        this.start();
        player.relive();
    },
    deleteData: function (num) {
        cc.sys.localStorage.setItem("chosenTalent" + num, "[]");
        cc.sys.localStorage.setItem("radio" + num, "[]");
        cc.sys.localStorage.setItem("medalTemp" + num, "[]");
        cc.sys.localStorage.setItem("ad" + num, "0");
        cc.sys.localStorage.setItem("weather" + num, "0");
        Record.init("record");
        Record.save("player" + num, {});
        Record.save("time" + num, {});
        Record.save("navigation" + num, {});
    },
    newGame: function (num) {
        utils.SAVE_SLOT = num;
        Medal.initCompletedForOneGame(true);
        cc.director.runScene(new ChooseScene(0));
    },
};