if (cc.log) {
    cc.ENVIRONMENT_COCOS = 1;
    var module = {}
} else {
    cc.ENVIRONMENT_COCOS = 0;
}

cc.originAudioEngine = {};

var setSound = function (isOn) {
    cc.sys.localStorage.setItem("sound", isOn ? 1 : 2);
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