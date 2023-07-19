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
    newGame: function () {
        Record.deleteRecord("record");
        Record.deleteRecord("radio");
        Record.setType(-1);
        Medal.newGameReset();
        Medal.initCompletedForOneGame(true);
    },
    relive: function () {
        this.init();
        this.start();
        player.relive();
    }
};