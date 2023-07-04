/**
 * User: Alex
 * Date: 15/1/5
 * Time: 下午4:07
 */
//缓存新版本文件信息
var tempVersionConfig;
var MenuLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        ClientData.CLIENT_VERSION = CommonUtil.getMetaData("versionName");
        ClientData.MOD_VERSION = 4;
        ClientData.MOD_VARIANT = 1;
        PurchaseAndroid.init(CommonUtil.getMetaData("sdk_type"), {});
        adHelper.init(3);
        Medal.init();
        return true;
    },

    onExit: function () {
        this._super();
    },

    onEnter: function () {
        this._super();
        if (Record.getScreenFix()) {
            this.setScale(0.84);
        }
        var bgName = "#menu_bg.png";
        var bg = autoSpriteFrameController.getSpriteFromSpriteName(bgName);
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        this.addChild(bg);

        var logoName;
        if (cc.sys.localStorage.getItem("language") === cc.sys.LANGUAGE_CHINESE) {
            logoName = 'top_logo_zh.png';
        } else {
            logoName = 'top_logo_en.png';
        }
        var logo = autoSpriteFrameController.getSpriteFromSpriteName(logoName);
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
        
        var musics = [audioManager.music.BATTLE, audioManager.music.DEATH, audioManager.music.HOME, audioManager.music.NPC, audioManager.music.HOME_REST, audioManager.music.MAIN_PAGE, audioManager.music.MAP, audioManager.music.SITE_1, audioManager.music.SITE_2, audioManager.music.SITE_3];
        var curIndex =Number(cc.sys.localStorage.getItem("curMusic")) || 5;
        
        btn1.setPosition(bg.width / 2, bg.height / 2 - 126);
        bg.addChild(btn1);
        btn1.setName("btn_1");

        var btn2 = uiUtil.createBigBtnWhite(stringUtil.getString(1143), this, function () {
            audioManager.stopMusic(musics[curIndex]);
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
        
        audioManager.playMusic(musics[curIndex], true);   

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
        
        var btn_chgmusic = uiUtil.createSpriteBtn({normal: "icon_music_on.png"}, this, function () {
            
            audioManager.stopMusic(musics[curIndex], true);
            if (curIndex < musics.length - 1) {
                curIndex += 1;
            } else {
                curIndex = 0;
            }          
            cc.sys.localStorage.setItem("curMusic", curIndex);
            audioManager.playMusic(musics[curIndex], true);
        });
        btn_chgmusic.setPosition(bg.width - 106, bg.height / 2 - 236);
        bg.addChild(btn_chgmusic);
        
        var btn_rate = uiUtil.createSpriteBtn({normal: "btn_rate.png"}, this, function () {
            CommonUtil.gotoUrl("https://github.com/qwerfd2/buried-city");
        });
        btn_rate.setPosition(106, bg.height / 2 - 236);
        bg.addChild(btn_rate);

        var btn6 = uiUtil.createBtn2(ClientData.CLIENT_VERSION + "-" + ClientData.MOD_VARIANT + "-" + ClientData.MOD_VERSION, this, function () {
            var d = new AboutUUIDDialog();
            d.show();
        });
        btn6.setPosition(bg.width / 2, 20);
        bg.addChild(btn6);

        var btn7 = uiUtil.createSpriteBtn({normal: "icon_medal.png"}, this, function () {
            cc.director.runScene(new medalScene());
        });
        btn7.setPosition(106, bg.height / 2 - 346);
        bg.addChild(btn7);

        var btn8 = uiUtil.createSpriteBtn({normal: "btn_contact.png"}, this, function () {
            if (cc.sys.localStorage.getItem("language") == 'zh' || cc.sys.localStorage.getItem("language") == 'zh-Hant') {
                new DialogMoreGame("index_zh.html").show();      
            } else {
                new DialogMoreGame("index_en.html").show();
            }
        });
        btn8.setPosition(106, 106);
        bg.addChild(btn8);
        
        Achievement.init();
    },

    newGame: function () {
        game.newGame();
        cc.director.runScene(new ChooseScene());
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
        this.label_music.setPosition(cc.winSize.width / 2, 1050);
        this.addChild(this.label_music);

        this.btn_music = new SettingButton("", true);
        this.btn_music.on = audioManager.needMusic();
        if (this.btn_music.on) {
            this.btn_music.setTitle(stringUtil.getString(1249));
        } else {
            this.btn_music.setTitle(stringUtil.getString(1250));
        }
        this.btn_music.setPosition(cc.winSize.width / 2, 1000);
        this.addChild(this.btn_music);
        this.btn_music.setClickListener(this, function (sender) {
            self.openMusicSelector(sender.on);
        })
        
        this.label_sound = new cc.LabelTTF(stringUtil.getString(1169), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        this.label_sound.setPosition(cc.winSize.width / 2, 900);
        this.addChild(this.label_sound);

        this.btn_sound = new SettingButton("", true);
        this.btn_sound.on = audioManager.needSound();
        if (this.btn_sound.on) {
            this.btn_sound.setTitle(stringUtil.getString(1249));
        } else {
            this.btn_sound.setTitle(stringUtil.getString(1250));
        }
        this.btn_sound.setPosition(cc.winSize.width / 2, 850);
        this.addChild(this.btn_sound);
        this.btn_sound.setClickListener(this, function (sender) {
            self.openSoundSelector(sender.on);
        })

        this.label_lan = new cc.LabelTTF(stringUtil.getString(1251), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        this.label_lan.setPosition(cc.winSize.width / 2, 600);
        this.addChild(this.label_lan);

        this.btn_lan = new SettingButton("", true);
        this.lan = cc.sys.localStorage.getItem("language");
        if (!this.lan)
            this.lan = cc.sys.language;
        this.btn_lan.setTitle(stringName[this.lan]);
        this.btn_lan.setPosition(cc.winSize.width / 2, 550);
        this.addChild(this.btn_lan);
        this.btn_lan.setClickListener(this, function (sender) {
            self.openLanguageSelector();
        })
        
        this.label_screenfix = new cc.LabelTTF(stringUtil.getString(9017), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        this.label_screenfix.setPosition(cc.winSize.width / 2, 750);
        this.addChild(this.label_screenfix);

        this.btn_screenfix = new SettingButton("", true);
        this.btn_screenfix.on = Record.getScreenFix();
        if (this.btn_screenfix.on) {
            this.btn_screenfix.setTitle(stringUtil.getString(1249));
        } else {
            this.btn_screenfix.setTitle(stringUtil.getString(1250));
        }
        this.btn_screenfix.setPosition(cc.winSize.width / 2, 700);
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
            }
        }), this);

        var self = this;
        var keyboardListener = cc.EventListener.create({
            event: cc.EventListener.KEYBOARD,
            onKeyReleased: function (keyCode, event) {
                cc.log("pressed Keycode = " + keyCode);
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
            cc.v("pause eventManager");
            cc.eventManager.pauseTarget(keyEventLayer);
        }
    },
    onExit: function () {
        this._super();
        var keyEventLayer = cc.director.getRunningScene().getChildByName("keyEventLayer");
        if (keyEventLayer) {
            keyEventLayer.scheduleOnce(function () {
                cc.v("resume eventManger");
                cc.eventManager.resumeTarget(keyEventLayer);
            }, 0.1)
        }
    },
    openMusicSelector: function (nowState) {
        var self = this;
        if (this.btn_music_selector)
            return;
        this.btn_music_selector = new SettingButton(nowState ? stringUtil.getString(1250) : stringUtil.getString(1249));
        this.btn_music_selector.on = !nowState;
        this.btn_music_selector.setClickListener(this, function (sender) {
            var on = sender.on;
            if (on) {
                audioManager.setMusic(on);
                audioManager.playMusic(audioManager.music.MAIN_PAGE, true);
            } else {
                audioManager.stopMusic(audioManager.music.MAIN_PAGE, true);
                audioManager.setMusic(on);
            }
            self.refreshThisLayer();
        });
        this.btn_music_selector.setPosition(this.btn_music.x, this.btn_music.y - this.btn_music.height);
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
        this.btn_sound_selector.setPosition(this.btn_sound.x, this.btn_sound.y - this.btn_sound.height);
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
        this.btn_screenfix_selector = new SettingButton(nowState ? stringUtil.getString(1250) : stringUtil.getString(1249));
        this.btn_screenfix_selector.on = !nowState;
        this.btn_screenfix_selector.setClickListener(this, function (sender) {
            Record.setScreenFix(sender.on);
            self.refreshThisLayer();
            cc.director.runScene(new MenuScene());
        });
        this.btn_screenfix_selector.setPosition(this.btn_screenfix.x, this.btn_screenfix.y - this.btn_screenfix.height);
        this.addChild(this.btn_screenfix_selector);
    },
    closeScreenfixSelector: function () {
        if (this.btn_screenfix_selector) {
            this.btn_screenfix_selector.removeFromParent();
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
        btn.setName("btn");
        btn.setAnchorPoint(0, 0);

        var label = new ccui.Text("test", "", uiUtil.fontSize.COMMON_2);
        label.setColor(cc.color(0, 0, 0, 0));
        label.setName("label");
        label.setPosition(btn.width / 2, btn.height / 2);

        var listItem = new ccui.Layout();
        listItem.addChild(btn);
        listItem.addChild(label, 1);
        listItem.setContentSize(272, 62);

        listView.setItemModel(listItem);
        listView.setContentSize(272, 340);
        listView.setAnchorPoint(0.5, 1);

        var lans = utils.clone(lanSupports);
        lans.push("zh-Hant");
        for (var key in lans) {
            if (lans[key] != this.lan)
                listView.pushBackDefaultItem();
        }

        var items = listView.getItems();
        var lanIndex = 0;
        for (var key in items) {
            if (lans[lanIndex] == this.lan) {
                lanIndex++;
            }
            items[key].getChildByName("label").setString(stringName[lans[lanIndex]]);
            var button = items[key].getChildByName("btn");
            button.lan = lans[lanIndex];
            button.addTouchEventListener(function (sender, type) {
                if (type == ccui.Widget.TOUCH_ENDED) {
                    cc.sys.localStorage.setItem("language", sender.lan);

                    if (jsb.fileUtils.isFileExist("src/data/string/string_" + sender.lan + ".js") || jsb.fileUtils.isFileExist("src/data/string/string_" + sender.lan + ".jsc")) {
                        __cleanScript("src/data/string/string_" + self.lan + ".js");
                        require("src/data/string/string_" + sender.lan + ".js")
                        if (sender.lan == cc.sys.LANGUAGE_ARABIC) {
                            cc.RTL = true;
                        } else {
                            cc.RTL = false;
                        }
                    }
                    uiUtil.fontFamily.normal = cc.sys.isNative && ((cc.sys.localStorage.getItem("language") === cc.sys.LANGUAGE_CHINESE && !cc.sys.LANGUAGE_CHINESE_HANT) || cc.sys.localStorage.getItem("language") === cc.sys.LANGUAGE_ENGLISH) ? "FZDaHei-B02S" : ""

                    cc.director.runScene(new MenuScene(true));
                }
            }, this)
            lanIndex++;
        }
        this.languageSelector.addChild(listView);
        this.languageSelector.setPosition(cc.pSub(this.btn_lan.getPosition(), cc.p(0, this.btn_lan.height / 2)));
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
    ctor: function (openSetting) {
        this._super(APP_NAVIGATION.MENU);
        this.openSetting = openSetting;
        this.sceneName = "MenuScene";
        autoSpriteFrameController.addSpriteFrames("res/ui.plist");
        autoSpriteFrameController.addSpriteFrames("res/menu.plist");
        autoSpriteFrameController.addSpriteFrames("res/icon.plist");
        autoSpriteFrameController.addSpriteFrames("res/npc.plist");
        autoSpriteFrameController.addSpriteFrames("res/medal.plist");
    },
    onEnter: function () {
        this._super();
        var layer = new MenuLayer();
        this.addChild(layer);

        if (this.openSetting) {
            var settingLayer = new SettingLayer();
            if (Record.getScreenFix()) {
                settingLayer.setScale(0.84);
            }
            this.addChild(settingLayer);
        }
    },
    onExit: function () {
        this._super();
    }
});