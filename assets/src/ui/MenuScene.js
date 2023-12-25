var ClientData = {};
var Musics = [audioManager.music.BATTLE, audioManager.music.HOME, audioManager.music.HOME_REST, audioManager.music.HOME_BED, audioManager.music.MAIN_PAGE, audioManager.music.MAP_CLOUDY, audioManager.music.MAP_SUNNY, audioManager.music.MAP_SNOW, audioManager.music.MAP_RAIN, audioManager.music.MAP_FOG, audioManager.music.SITE_1, audioManager.music.SITE_2, audioManager.music.SITE_3, audioManager.music.ABYSS, audioManager.music.SITE_SECRET, audioManager.music.AQUARIUM, audioManager.music.BANDITDEN, audioManager.music.SITE_4, audioManager.music.SITE_5, audioManager.music.SITE_6, audioManager.music.HOTEL, audioManager.music.NPC, audioManager.music.DEATH, audioManager.music.BATTLE_OLD];

var MusicName = ["Destroyer - Sergey Cheremisinov","Secrets and Lies - David Celeste","April in Detroit - David Celeste","The Reunion - Trevor Kowalski","There Must Be - So Vea","The Slow Shift - Gavin Luke","In the Waiting - Johannes Bornlof","Planting the Seeds - David Celeste","Nordkap - Martin Landh","Into the Forest I Go - David Celeste","She Came Back - David Celeste","Incandescence - Silver Maple","Isolation - Farrell Wooten","Sleepwalker I - Sergey Cheremisinov", "Tensor Bandage - Blue Wizard Studio", "Deep Corridor - Brambles", "Search and Flight - Sergey Cheremisinov", "恐惧边缘 - 罗杨", "死亡触手 - 罗杨", "废土 - 罗杨", "来一杯咖啡 - 罗杨", "最后的避难所 - 罗杨", "末路 - 罗杨","穷途 - 罗杨"];

var MenuLayer = cc.Layer.extend({
    ctor: function (checkVersion) {
        this._super();
        ClientData.MOD_VERSION = 27;
        ClientData.MOD_VARIANT = 1;
        PurchaseAndroid.init(CommonUtil.getMetaData("sdk_type"), {});
        adHelper.init(3);
        Medal.init();
        var lastVer = cc.sys.localStorage.getItem("modVer") || ClientData.MOD_VERSION;
        if (lastVer > ClientData.MOD_VERSION) {
            var config = {
                title: {title: ""},
                content: {des: stringUtil.getString(6675)},
                action: {btn_1: {txt: stringUtil.getString(1193)}}
            };
            var toast = new DialogTiny(config);
            toast.show();
        } else if (lastVer < ClientData.MOD_VERSION) {
            var config = {
                title: {title: ""},
                content: {des: stringUtil.getString(6676)},
                action: {btn_1: {txt: stringUtil.getString(1193)}}
            };
            cc.sys.localStorage.removeItem("curMusic");
            var toast = new DialogTiny(config);
            toast.show();
            if (lastVer < 27) {
                game.newGame();
            }
        }
        cc.sys.localStorage.setItem("modVer", ClientData.MOD_VERSION);
        if (checkVersion && ClientData.MOD_VARIANT == 1) {
            this.requestVersion(function (response) {
                var number = Number(response);
                if (number > ClientData.MOD_VERSION) {
                    var config = {
                        title: {title: ""},
                        content: {des: stringUtil.getString(6666, number)},
                        action: {btn_1: {txt: stringUtil.getString(1193)}}
                    };
                    var toast = new DialogTiny(config);
                    toast.show();
                }
            });
        }
        return true;
    },

    onExit: function () {
        this._super();
    },
    
    requestVersion: function (func) {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", "https://studio.code.org/v3/sources/NP02DNkidhIYa_EcwdxRn4BOMeSI-9uY25BPILbpJuw/main.json", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {   
                    var response = xhr.responseText;        
                    func(JSON.parse(response).source);
                } catch (error) {}
            }
        };
        xhr.send();
    },
    
    onEnter: function () {
        this._super();
        var CAN_CHG_MUSIC = false;
        if (Record.getScreenFix() == 1) {
            this.setScale(0.83);
        }
        var bgName = "res/new/";
        if (MONTH == 11) {
            if (DAY > 18) {
                bgName += "menu_bg_christmas.png";
            } else {
                bgName += "menu_bg.png";
            }
        } else {
            bgName += "menu_bg.png";
        }
        var bg = new cc.Sprite(bgName);
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        this.addChild(bg);

        var logo = new cc.Sprite("res/new/top_logo_en.png");
        logo.x = bg.width / 2;
        logo.y = 938;
        bg.addChild(logo);

        var self = this;
        var btn1 = uiUtil.createBigBtnWhite(stringUtil.getString(1142), this, function () {
            if (Record.isFirstTime()) {
                self.newGame();
            } else {
                uiUtil.showNewGameDialog(function () {
                    self.newGame();
                });
            }
        });
        if (!cc.sys.localStorage.getItem("ftue") && ClientData.MOD_VARIANT == 1) {
            var d = new FTUEDialog();
            d.show();
            cc.sys.localStorage.setItem("ftue", 1);
        }     

        var curIndex = Number(cc.sys.localStorage.getItem("curMusic")) || 4;
        
        btn1.setPosition(bg.width / 2, bg.height / 2 - 126);
        bg.addChild(btn1);
        btn1.setName("btn_1");

        var btn2 = uiUtil.createBigBtnWhite(stringUtil.getString(1143), this, function () {
            btn2.setEnabled(false);
            audioManager.stopMusic(Musics[curIndex]);
            game.init();
            game.start();
            cc.director.runScene(new MainScene());
        });
        btn2.setPosition(bg.width / 2, bg.height / 2 - 236);
        bg.addChild(btn2);
        btn2.setName("btn_2");
        btn2.setEnabled(!Record.isFirstTime());

        var btn3 = uiUtil.createBigBtnWhite(stringUtil.getString(1235), this, function () {
            cc.director.runScene(new RankFamousScene());
        });
        btn3.setPosition(bg.width / 2, bg.height / 2 - 346);
        bg.addChild(btn3);
        btn3.setName("btn_3");
        
        var btn4 = uiUtil.createBigBtnWhite(stringUtil.getString(1260), this, function () {
            cc.director.runScene(new achievementScene());
        });
        btn4.setPosition(bg.width / 2, bg.height / 2 - 456);
        bg.addChild(btn4);
        btn4.setName("btn_4");
        
        audioManager.playMusic(Musics[curIndex], true);

        var btn_quit = uiUtil.createSpriteBtn({normal: "btn_ad_back.png"}, this, function () {
            PurchaseAndroid.exitGame();
        });
        btn_quit.setPosition(bg.width - 106, 106);
        bg.addChild(btn_quit);

        var btn_setting = uiUtil.createSpriteBtn({normal: "btn_game_setting.png"}, this, function () {
            this.addChild(new SettingLayer());
        });
        btn_setting.setPosition(bg.width - 106, bg.height / 2 - 346);
        bg.addChild(btn_setting);

        var musicLabel = new cc.LabelTTF(stringUtil.getString(1248) + ": " + MusicName[curIndex], uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        musicLabel.setPosition(bg.width / 2, 20);
        musicLabel.setColor(cc.color.GRAY)
        bg.addChild(musicLabel);
        musicLabel.runAction(cc.sequence(cc.delayTime(1), cc.fadeOut(0.7)));
        setTimeout(function(){CAN_CHG_MUSIC = true}, 2000);
        
        var btn_chgmusic = uiUtil.createSpriteBtn({normal: "icon_music_on.png"}, this, function () {
            if (!CAN_CHG_MUSIC) {
                return;
            }
            CAN_CHG_MUSIC = false;
            setTimeout(function(){CAN_CHG_MUSIC = true}, 2000);
            audioManager.stopMusic(Musics[curIndex], true);
            if (curIndex < Musics.length - 1) {
                curIndex += 1;
            } else {
                curIndex = 0;
            }
            cc.sys.localStorage.setItem("curMusic", curIndex);
            musicLabel.setString(stringUtil.getString(1248) + ": " + MusicName[curIndex]);
            musicLabel.runAction(cc.sequence(cc.fadeIn(0.3), cc.delayTime(1), cc.fadeOut(0.7)));
            audioManager.playMusic(Musics[curIndex], true);
        });
        btn_chgmusic.setPosition(bg.width - 106, bg.height / 2 - 236);
        bg.addChild(btn_chgmusic);
        var btn6 = uiUtil.createBtn2(ClientData.MOD_VARIANT + "-" + ClientData.MOD_VERSION, this, function () {
            var d = new AboutUUIDDialog();
            d.show();
        });
        btn6.setPosition(30, 20);
        bg.addChild(btn6);

        var btn7 = uiUtil.createSpriteBtn({normal: "icon_medal.png"}, this, function () {
            cc.director.runScene(new medalScene());
        });
        btn7.setPosition(106, bg.height / 2 - 346);
        bg.addChild(btn7);
        if (ClientData.MOD_VARIANT == 1) {
            var btn8 = uiUtil.createSpriteBtn({normal: "btn_contact.png"}, this, function () {
                if (cc.sys.localStorage.getItem("language") == 'zh' || cc.sys.localStorage.getItem("language") == 'zh-Hant') {
                    new DialogMoreGame("index_zh.html").show();      
                } else {
                    new DialogMoreGame("index_en.html").show();
                }
            });
            btn8.setPosition(106, 106);
            bg.addChild(btn8);
            
            var btn_rate = uiUtil.createSpriteBtn({normal: "btn_rate.png"}, this, function () {
                cc.director.runScene(new aboutScene());
            });
            btn_rate.setPosition(106, bg.height / 2 - 236);
            bg.addChild(btn_rate);
        }
        
        Achievement.init();
    },

    newGame: function () {
        game.newGame();
        cc.director.runScene(new ChooseScene(0));
    }
});

var SettingLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        var self = this;
        var layer = new cc.LayerColor(cc.color(0, 0, 0, 220));
        layer.changeWidth(1000);
        layer.x -= 300;
        this.addChild(layer);

        this.label_music = new cc.LabelTTF(stringUtil.getString(1248), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        this.label_music.setPosition(cc.winSize.width / 2 - 150, 1050);
        this.addChild(this.label_music);

        this.btn_music = new SettingButton("", true);
        this.btn_music.setScale(0.8);
        this.btn_music.on = audioManager.needMusic();
        if (this.btn_music.on) {
            this.btn_music.setTitle(stringUtil.getString(1249));
        } else {
            this.btn_music.setTitle(stringUtil.getString(1250));
        }
        this.btn_music.setPosition(cc.winSize.width / 2 - 150, 1000);
        this.addChild(this.btn_music);
        this.btn_music.setClickListener(this, function (sender) {
            self.openMusicSelector(sender.on);
        })
        
        this.label_sound = new cc.LabelTTF(stringUtil.getString(1169), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        this.label_sound.setPosition(cc.winSize.width / 2 + 150, 1050);
        this.addChild(this.label_sound);

        this.btn_sound = new SettingButton("", true);
        this.btn_sound.setScale(0.8);
        this.btn_sound.on = audioManager.needSound();
        if (this.btn_sound.on) {
            this.btn_sound.setTitle(stringUtil.getString(1249));
        } else {
            this.btn_sound.setTitle(stringUtil.getString(1250));
        }
        this.btn_sound.setPosition(cc.winSize.width / 2 + 150, 1000);
        this.addChild(this.btn_sound);
        this.btn_sound.setClickListener(this, function (sender) {
            self.openSoundSelector(sender.on);
        })

        this.label_lan = new cc.LabelTTF(stringUtil.getString(1251), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        this.label_lan.setPosition(cc.winSize.width / 2 + 150, 850);
        this.addChild(this.label_lan);

        this.btn_lan = new SettingButton("", true);
        this.btn_lan.setScale(0.8);
        this.lan = cc.sys.localStorage.getItem("language");
        if (!this.lan)
            this.lan = cc.sys.language;
        this.btn_lan.setTitle(stringName[this.lan]);
        this.btn_lan.setPosition(cc.winSize.width / 2 + 150, 800);
        this.addChild(this.btn_lan);
        this.btn_lan.setClickListener(this, function (sender) {
            self.openLanguageSelector();
        })
        
        this.label_screenfix = new cc.LabelTTF(stringUtil.getString(9017), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        this.label_screenfix.setPosition(cc.winSize.width / 2 - 150, 850);
        this.addChild(this.label_screenfix);

        this.btn_screenfix = new SettingButton("", true);
        this.btn_screenfix.setScale(0.8);
        var itemList = stringUtil.getString(1327);
        this.btn_screenfix.on = Record.getScreenFix();
        this.btn_screenfix.setTitle(itemList[this.btn_screenfix.on]);
        this.btn_screenfix.setPosition(cc.winSize.width / 2 - 150, 800);
        this.addChild(this.btn_screenfix);
        this.btn_screenfix.setClickListener(this, function (sender) {
            self.openScreenfixSelector(sender.on);
        })

        this.btn_back = uiUtil.createBigBtnWhite(stringUtil.getString(1030), this, function () {
            this.removeFromParent();
        });
        this.btn_back.setPosition(cc.winSize.width / 2, this.height / 2 - 456);
        this.addChild(this.btn_back);
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchMoved: function (touch, event) {
            },
            onTouchEnded: function (touch, event) {
                self.closeMusicSelector();
                self.closeLanguageSelector();
                self.closeSoundSelector();
                self.closeScreenfixSelector();
                self.closeCitySelector();
                self.closeFestivalSelector();
            }
        }), this);

        var self = this;
        var keyboardListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function (keyCode, event) {
                if (keyCode == cc.KEY.back) {
                    self.removeFromParent();
                }
            }
        });
        cc.eventManager.addListener(keyboardListener, this);
    },
    onEnter: function () {
        this._super();
        var keyEventLayer = cc.director.getRunningScene().getChildByName("keyEventLayer");
        if (keyEventLayer) {
            cc.eventManager.pauseTarget(keyEventLayer);
        }
    },
    onExit: function () {
        this._super();
        var keyEventLayer = cc.director.getRunningScene().getChildByName("keyEventLayer");
        if (keyEventLayer) {
            keyEventLayer.scheduleOnce(function () {
                cc.eventManager.resumeTarget(keyEventLayer);
            }, 0.1)
        }
    },
    openMusicSelector: function (nowState) {
        var self = this;
        if (this.btn_music_selector)
            return;
        this.btn_music_selector = new SettingButton(nowState ? stringUtil.getString(1250) : stringUtil.getString(1249));
        this.btn_music_selector.setScale(0.8);
        this.btn_music_selector.on = !nowState;
        this.btn_music_selector.setClickListener(this, function (sender) {
            var on = sender.on;
            if (on) {
                audioManager.setMusic(on);
                audioManager.playMusic(Musics[Number(cc.sys.localStorage.getItem("curMusic")) || 6], true);
            } else {
                audioManager.stopMusic();
                audioManager.setMusic(on);
            }
            self.refreshThisLayer();
        });
        this.btn_music_selector.setPosition(this.btn_music.x, this.btn_music.y - this.btn_music.height + 10);
        this.addChild(this.btn_music_selector);
    },
    closeMusicSelector: function () {
        if (this.btn_music_selector) {
            this.btn_music_selector.removeFromParent();
            this.btn_music_selector = null;
        }
    },
    
    openSoundSelector: function (nowState) {
        var self = this;
        if (this.btn_sound_selector)
            return;
        this.btn_sound_selector = new SettingButton(nowState ? stringUtil.getString(1250) : stringUtil.getString(1249));
        this.btn_sound_selector.setScale(0.8);
        this.btn_sound_selector.on = !nowState;
        this.btn_sound_selector.setClickListener(this, function (sender) {
            var on = sender.on;
            if (on) {
                audioManager.setSound(on);
                audioManager.playEffect(audioManager.sound.GOOD_EFFECT);
            } else {
                audioManager.setSound(on);
            }
            self.refreshThisLayer();
        });
        this.btn_sound_selector.setPosition(this.btn_sound.x, this.btn_sound.y - this.btn_sound.height + 10);
        this.addChild(this.btn_sound_selector);
    },
    closeSoundSelector: function () {
        if (this.btn_sound_selector) {
            this.btn_sound_selector.removeFromParent();
            this.btn_sound_selector = null;
        }
    },
    
    openScreenfixSelector: function (nowState) {
        var self = this;
        if (this.btn_screenfix_selector)
            return;
        var itemList = stringUtil.getString(1327);
        var num = [];
        if (nowState == 0) {
           num = [1, 2];
        } else if (nowState == 1) {
            num = [0, 2];
        } else {
            num = [0, 1];
        }
        this.btn_screenfix_selector = new SettingButton(itemList[num[0]]);
        this.btn_screenfix_selector.setScale(0.8);
        this.btn_screenfix_selector.on = num[0];
        this.btn_screenfix_selector.setClickListener(this, function (sender) {
            var on = Number(sender.on);
            Record.setScreenFix(on);
            if (on == 2 || nowState == 2) {
                cc.game.restart();
            }
            self.refreshThisLayer();
            cc.director.runScene(new MenuScene());
        });
        this.btn_screenfix_selector.setPosition(this.btn_screenfix.x, this.btn_screenfix.y - this.btn_screenfix.height + 10);
        this.addChild(this.btn_screenfix_selector);
        
        this.btn_screenfix_selector_2 = new SettingButton(itemList[num[1]]);
        this.btn_screenfix_selector_2.setScale(0.8);
        this.btn_screenfix_selector_2.on = num[1];
        this.btn_screenfix_selector_2.setClickListener(this, function (sender) {
            var on = Number(sender.on);
            Record.setScreenFix(on);
            if (on == 2 || nowState == 2) {
                cc.game.restart();
            }
            self.refreshThisLayer();
            cc.director.runScene(new MenuScene());
        });
        this.btn_screenfix_selector_2.setPosition(this.btn_screenfix.x, this.btn_screenfix.y - this.btn_screenfix.height * 2 + 20);
        this.addChild(this.btn_screenfix_selector_2);
    },
    closeScreenfixSelector: function () {
        if (this.btn_screenfix_selector) {
            this.btn_screenfix_selector.removeFromParent();
            this.btn_screenfix_selector_2.removeFromParent();
            this.btn_screenfix_selector = null;
        }
    },
    
    openLanguageSelector: function () {
        var self = this;
        if (this.languageSelector)
            return;
        this.languageSelector = new cc.Node();
        var listView = new ccui.ListView();

        var btn = new ccui.Button("btn_language_bg.png", "btn_language_bg_opa.png", "btn_language_bg.png", 1);
        btn.setScale(0.8);
        btn.setName("btn");
        btn.setAnchorPoint(0, 0);
        var label = new ccui.Text("", "", uiUtil.fontSize.COMMON_3);
        label.setColor(cc.color(0, 0, 0, 0));
        label.setName("label");
        label.setPosition(btn.width / 2 - 20, btn.height / 2 + 10);
        var listItem = new ccui.Layout();
        listItem.addChild(btn);
        listItem.addChild(label, 1);
        listItem.setContentSize(217, 49.6);

        listView.setItemModel(listItem);
        listView.setContentSize(217, 225);
        listView.setAnchorPoint(0.5, 1);

        var lans = utils.clone(lanSupports);
        lans.push("zh-Hant");
        for (var key in lans) {
            if (lans[key] != this.lan)
                listView.pushBackDefaultItem();
        }

        var items = listView.getItems();
        var lanIndex = 0;
        var realIndex = 0;
        for (var key in items) {
            if (lans[lanIndex] == this.lan) {
                lanIndex++;
            }
            realIndex++;
            var label = items[key].getChildByName("label");
            label.setString(stringName[lans[lanIndex]]);
            label.setPosition(label.x, label.y - 10);
            var button = items[key].getChildByName("btn");
            button.lan = lans[lanIndex];
            button.setPosition(button.x, button.y + 3);
            button.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    cc.sys.localStorage.setItem("language", sender.lan);

                    if (jsb.fileUtils.isFileExist("src/data/string/string_" + sender.lan + ".js")) {
                        __cleanScript("src/data/string/string_" + self.lan + ".js");
                        require("src/data/string/string_" + sender.lan + ".js")
                        if (sender.lan == cc.sys.LANGUAGE_ARABIC) {
                            cc.RTL = true;
                        } else {
                            cc.RTL = false;
                        }
                    }
                    cc.director.runScene(new MenuScene(true, false));
                }
            }, this)
            lanIndex++;
        }

        this.languageSelector.addChild(listView);
        this.languageSelector.setPosition(cc.pSub(this.btn_lan.getPosition(), cc.p(0, this.btn_lan.height / 2 - 3)));
        this.addChild(this.languageSelector);
    },
    closeLanguageSelector: function () {
        if (this.languageSelector) {
            this.languageSelector.removeFromParent();
            this.languageSelector = null;
        }
    },
    refreshThisLayer: function () {
        var parent = this.getParent();
        this.removeFromParent();
        parent.addChild(new SettingLayer());
    },
    onEnter: function () {
        this._super();
    },
    onExit: function () {
        this._super();
    },
});

var MenuScene = BaseScene.extend({
    ctor: function (openSetting, checkVersion) {
        this._super(APP_NAVIGATION.MENU);
        this.openSetting = openSetting;
        this.checkVersion = checkVersion;
        this.sceneName = "MenuScene";
        autoSpriteFrameController.addSpriteFrames("res/ui.plist");
        autoSpriteFrameController.addSpriteFrames("res/icon.plist");
        autoSpriteFrameController.addSpriteFrames("res/npc.plist");
    },
    onEnter: function () {
        this._super();
        var layer = new MenuLayer(this.checkVersion);
        this.addChild(layer);
        if (this.openSetting && ClientData.MOD_VARIANT == 1) {
            var d = new FTUEDialog();
            d.show();
        }
    },
    onExit: function () {
        this._super();
    }
});