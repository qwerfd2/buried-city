var DATE = new Date();
var DAY = DATE.getDate() + 8;
var MONTH = DATE.getMonth();
var audioManager = {
    sound: {
        ATTACK_1: "res/sound/attack_1.mp3",
        ATTACK_2: "res/sound/attack_2.mp3",
        ATTACK_3: "res/sound/attack_3.mp3",
        ATTACK_4: "res/sound/attack_4.mp3",
        ATTACK_5: "res/sound/attack_5.mp3",
        ATTACK_6: "res/sound/attack_6.mp3",
        ATTACK_7: "res/sound/attack_7.mp3",
        ATTACK_8: "res/sound/attack_8.mp3",
        BOMB: "res/sound/bomb.mp3",
        BUILD_UPGRADE: "res/sound/build_upgrade.mp3",
        CLICK: "res/sound/click.mp3",
        LOG_POP_UP: "res/sound/log_pop_up.mp3",
        LOOT: "res/sound/loot.mp3",
        MONSTER_ATTACK: "res/sound/monster_attack.mp3",
        MONSTER_DIE: "res/sound/monster_die.mp3",
        BANDIT_DIE: "res/sound/bandit_die.mp3",
        POPUP: "res/sound/popup.mp3",
        TRAP: "res/sound/trap.mp3",
        UNDER_ATTACK_MIDNIGHT: "res/sound/under_attack_midnight.mp3",
        BARK: "res/sound/bark.mp3",
        SHORT_BARK: "res/sound/short_bark.mp3",
        COOK: "res/sound/cook.mp3",
        ESTOVE: "res/sound/electricstove.mp3",
        STOVE: "res/sound/stove.mp3",
        HARVEST: "res/sound/harvest.mp3",
        TOOLBOX: "res/sound/toolbox.mp3",
        CLOSE_DOOR: "res/sound/close_door.mp3",
        OPEN_DOOR: "res/sound/open_door.mp3",
        FOOT_STEP: "res/sound/foot_step.mp3",
        RADIO: "res/sound/radio.mp3",
        BUBBLES: "res/sound/bubbles.mp3",
        PUNCH: "res/sound/punch.mp3",
        EXCHANGE: "res/sound/exchange.mp3",
        BAD_EFFECT: "res/sound/bad_effect.mp3",
        GOOD_EFFECT: "res/sound/good_effect.mp3",
        NPC_KNOCK: "res/sound/npc_knock.mp3",
        BOTTLE_OPEN: "res/sound/bottle_open.mp3",
        COFFEE_POUR: "res/sound/coffee_pour.mp3",
        GOLD: "res/sound/gold.mp3",
        GOLP: "res/sound/golp.mp3",
    },
    music: {
        BATTLE: "res/music/battle.ogg",
        BATTLE_OLD: "res/music/battle_old.ogg",
        DEATH: "res/music/death.ogg",
        HOME: "res/music/home.ogg",
        NPC: "res/music/npc.ogg",
        NPC_OLD: "res/music/npc_old.ogg",
        HOTEL: "res/music/hotel_rest.ogg",
        HOME_REST: "res/music/living room.ogg",
        HOME_BED: "res/music/bed.ogg",
        MAIN_PAGE: "res/music/mainmenu.ogg",
        MAP_CLOUDY: "res/music/cloudy.ogg",
        MAP_SUNNY: "res/music/sunny.ogg",
        MAP_SNOW: "res/music/snow.ogg",
        MAP_RAIN: "res/music/rain.ogg",
        MAP_FOG: "res/music/fog.ogg",
        SITE_1: "res/music/env1.ogg",
        SITE_2: "res/music/env2.ogg",
        SITE_3: "res/music/env3.ogg",
        SITE_4: "res/music/env_4.ogg",
        SITE_5: "res/music/env_5.ogg",
        SITE_6: "res/music/env_6.ogg",
        BANDITDEN: "res/music/banditden.ogg",
        SITE_SECRET: "res/music/secret_room.ogg",
        CREDITS: "res/music/credit.ogg",
        RECALL: "res/music/recall.ogg",
        ABYSS: "res/music/choose.ogg",
        AQUARIUM: "res/music/aquarium.ogg"
    },
    lastMusic: null,
    playingMusic: null,
    setSound: function (isOn) {
        cc.sys.localStorage.setItem("sound", isOn ? 1 : 2);
    },
    needSound: function () {
        var sound = cc.sys.localStorage.getItem("sound") || 1;
        if (sound == 1)
            return true;
        else
            return false;
    },
    setMusic: function (isOn) {
        cc.sys.localStorage.setItem("music", isOn ? 1 : 2);
    },
    needMusic: function () {
        var music = cc.sys.localStorage.getItem("music") || 1;
        if (music == 1)
            return true;
        else
            return false;
    },
    playEffect: function (char, bool) {
        if (!needSound()) {
            return;
        }
        return cc.audioEngine.playEffect(char, bool);
    },
    
    stopEffect: function (int) {
        if (!needSound()) {
            return;
        }
        cc.audioEngine.stopEffect(int);
    },
    playMusic: function (url, loop) {
        if (!needMusic()) {
            return;
        }
        if (url == this.playingMusic && loop) {
            return;
        }
        this.lastMusic = this.playingMusic;
        this.playingMusic = url;
        return cc.audioEngine.playMusic(url, loop);
    },
    stopMusic: function (releaseData) {
        if (!needMusic()) {
            return;
        }
        this.lastMusic = this.playingMusic;
        this.playingMusic = "";
        cc.audioEngine.stopMusic(releaseData);
    },
    insertMusic: function (url) {
        this.playMusic(url, true);
    },
    resumeMusic: function () {   
        this.playMusic(this.lastMusic, true);
    },
    getPlayingMusic: function () {
        return this.playingMusic;
    }
};