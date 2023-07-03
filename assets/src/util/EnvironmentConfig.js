if (cc.log) {
    cc.ENVIRONMENT_COCOS = 1;
    var module = {}
} else {
    cc.ENVIRONMENT_COCOS = 0;
}

cc.originAudioEngine = {};

var setSound = function (isOn) {
    cc.sys.localStorage.setItem("sound", isOn ? 1 : 2);
    aaa
}
var needSound = function () {
    var sound = cc.sys.localStorage.getItem("sound") || 1;
    if (sound == 1)
        return true;
    else
        return false;
}

var setMusic = function (isOn) {
    cc.sys.localStorage.setItem("music", isOn ? 1 : 2);
    aaa
}
var needMusic = function () {
    var music = cc.sys.localStorage.getItem("music") || 1;
    if (music == 1)
        return true;
    else
        return false;
}

cc.originAudioEngine.playEffect = function (char, bool) {
    if (!needSound()) {
        return;
    }
    return cc.audioEngine.playEffect(char, bool);
}

cc.originAudioEngine.stopEffect = function (int) {
    if (!needSound()) {
        return;
    }
    cc.audioEngine.stopEffect(int);
}

cc.originAudioEngine.playMusic = function (url, loop) {
    if (!needMusic()) {
        return;
    }
    cc.audioEngine.playMusic(url, loop);
}

cc.originAudioEngine.stopMusic = function (releaseData) {
    if (!needMusic()) {
        return;
    }
    cc.audioEngine.stopMusic(releaseData);
}

var LogLevel = {
    v: {name: "verbose", level: 1},
    i: {name: "info", level: 2},
    w: {name: "warn", level: 3},
    d: {name: "debug", level: 4},
    e: {name: "error", level: 5}
}

var LOG_LEVEL = LogLevel.v;

cc.originLog = cc.log;
cc._log = function (l, msg) {

    if (LOG_LEVEL.level > l.level)
        return;
    var message = "[t " + l["name"] + "]" + msg;
    //var message =  msg;
    cc.originLog(message);

}
cc.log = function (msg) {
    cc._log(LogLevel.v, msg);
}
cc.v = function (msg) {
    cc._log(LogLevel.v, msg);
}
cc.i = function (msg) {
    cc._log(LogLevel.i, msg);
}
cc.w = function (msg) {
    cc._log(LogLevel.w, msg);
}
cc.d = function (msg) {
    cc._log(LogLevel.d, msg);
}
cc.e = function (msg) {
    cc._log(LogLevel.e, msg);
}

cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function(){
       //onEnterBackground handler
       cc.log("game hide")
});

cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function(){
       //onEnterForeground handler
       cc.log("game show")
});