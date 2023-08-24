var DISMISS_BLOCKED = false;
var SiteNode = BottomFrameNode.extend({
    ctor: function (userData) {
        this._super(userData);
    },
    _init: function () {
        this.site = player.map.getSite(this.userData);
        this.setName(Navigation.nodeName.SITE_NODE);
        this.uiConfig = {
            title: this.site.getName(),
            leftBtn: true,
            rightBtn: false
        };
        player.enterSite(this.site.id);

        var leftEdge = 40;
        var rightEdge = this.bgRect.width - leftEdge;
        this.title.anchorX = 0;
        this.title.anchorY = 1;
        this.title.x = this.leftBtn.x + this.leftBtn.width / 2 + 10;
        this.title.y = this.bgRect.height - 5;

        var template = stringUtil.getString(5000);
        var txt1 = new cc.LabelTTF(cc.formatStr(template.title.txt_1, this.site.getProgressStr(0, this.site.id)), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        txt1.setAnchorPoint(0, 1);
        txt1.setPosition(this.title.x, this.actionBarBaseHeight - 4);
        this.bg.addChild(txt1);

        var txt2 = new cc.LabelTTF(cc.formatStr(template.title.txt_2, this.site.storage.getAllItemNum()), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        txt2.setAnchorPoint(1, 1);
        txt2.setPosition(rightEdge + 20, this.actionBarBaseHeight - 4);
        this.bg.addChild(txt2);

        var digDes = autoSpriteFrameController.getSpriteFromSpriteName("#site_dig_" + this.site.id + ".png");
        digDes.setAnchorPoint(0.5, 1)
        digDes.setPosition(this.bgRect.width / 2, this.contentTopLineHeight - 50);
        this.bg.addChild(digDes);
        digDes.setName("dig_des");

        var des = new cc.LabelTTF(this.site.getDes(), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(rightEdge - leftEdge, 0));
        des.setAnchorPoint(0.5, 1);
        des.setPosition(this.bgRect.width / 2, digDes.y - digDes.height - 40);
        this.bg.addChild(des);
        des.setName("des");
        des.setColor(cc.color.WHITE);

        var btn1 = uiUtil.createCommonBtnWhite(stringUtil.getString(1032), this, this.onClickBtn1);
        if (this.site.id == 400) {
            btn1.setPosition(this.bgRect.width / 6, 100);
        } else {
            btn1.setPosition(this.bgRect.width / 4, 100);
        }
        this.bg.addChild(btn1);
        btn1.setName("btn_1");

        this.notifyIcon = new cc.Sprite('res/new/map_actor.png');
        this.notifyIcon.x = btn1.width - 5;
        this.notifyIcon.y = btn1.height - 5;
        btn1.addChild(this.notifyIcon);
        this.notifyIcon.setVisible(this.site.haveNewItems);

        var btn2 = uiUtil.createCommonBtnWhite(stringUtil.getString(1033), this, this.onClickBtn2);
        if (this.site.id == 400) {
            btn2.setPosition(this.bgRect.width / 6 * 5, 100);
        } else {
            btn2.setPosition(this.bgRect.width / 4 * 3, 100);
        }
        this.bg.addChild(btn2);
        btn2.setName("btn_2")
        btn2.setEnabled(!this.site.isSiteEnd());
        
        if (this.site.id == 400) {

            var btn3 = uiUtil.createCommonBtnWhite(stringUtil.getString("gachapon").title, this, this.onClickBtn3);
            btn3.setPosition(this.bgRect.width / 2, 100);
            this.bg.addChild(btn3);
            btn3.setName("btn_3");
            
            var btn4 = uiUtil.createCommonBtnWhite(stringUtil.getString(1342), this, this.onClickBtn4);
            btn4.setPosition(this.bgRect.width / 2, 170);
            this.bg.addChild(btn4);
            btn4.setName("btn_4");
        }

        if (userGuide.isStep(userGuide.stepName.ENTER_SITE)) {
            uiUtil.createIconWarn(btn2);
            userGuide.step();

            btn1.setVisible(false);
            btn2.x = this.bgRect.width / 2;

        } else if (userGuide.isStep(userGuide.stepName.BACK_SITE)) {
            uiUtil.createIconWarn(this.leftBtn);
            userGuide.step();
        } else if (userGuide.isStep(userGuide.stepName.BACK_SITE)) {
            uiUtil.createIconWarn(this.leftBtn);
            userGuide.step();
        }

        if (this.site.isUnderAttacked) {
            this.site.isUnderAttacked = false;
            this.showWarnDialog();
        }
    },
    onClickBtn1: function () {
        this.forward(Navigation.nodeName.SITE_STORAGE_NODE, this.userData);
        this.site.haveNewItems = false;
    },
    onClickBtn2: function () {
        if (this.site.id == 400) {
            this.forward(Navigation.nodeName.BAZAAR_NODE, this.userData);
        } else {
            this.forward(Navigation.nodeName.BATTLE_AND_WORK_NODE, this.userData);
        }
    },
    onClickBtn3: function () {
        var config = utils.clone(stringUtil.getString("gachaponDialog"));
        var strConfig = stringUtil.getString("gachapon");
        config.title.icon = "#site_202.png";
        config.title.title = strConfig.title;
        config.title.txt_1 = cc.formatStr(config.title.txt_1, 6);
        config.content.des = strConfig.des;
        var dialog = new DialogSmall(config);
        dialog.autoDismiss = false;
        this.btnPlay = uiUtil.createSpriteBtn({normal: "icon_ad_play.png"}, this, function () {
            if (player.currency < 6) {
                this.displayNotEnough();
                return;
            }
            player.onCurrencyChange(-6);
            var rand = utils.getRandomInt(0, 399);
            var bound = 0;
            for (var i = 0; i < GachaponConfig.length; i++) {
                bound += GachaponConfig[i].weight;
                if (rand < bound) {
                    //this is it!
                    rand = i;
                    break;
                }
            }
            var itemId = GachaponConfig[rand].itemId;
            var num = GachaponConfig[rand].num;
            var str = stringUtil.getString(1069) + stringUtil.getString(itemId).title + " x" + num;
            player.log.addMsg(str);
            player.map.getSite(400).storage.increaseItem(itemId, num, false);
            player.map.getSite(400).haveNewItems = true;
            Record.saveAll();
            this.notifyIcon.setVisible(true);
            var config = {
                title: {},
                content: {des: str},
                action: {btn_1: {}}
            };
            config.action.btn_1.txt = stringUtil.getString(1030);
            var d = new DialogTiny(config);
            d.y = -94;
            d.show();
        });
        this.btnPlay.x = dialog.contentNode.width / 2;
        this.btnPlay.y = dialog.contentNode.height / 2 - 70;
        dialog.contentNode.addChild(this.btnPlay);
        var itemTableView = uiUtil.createItemListSlidersViewOnly(GachaponConfig);
        itemTableView.setPosition(20, 100);
        dialog.contentNode.addChild(itemTableView);
        dialog.show();
    },
    onClickBtn4: function () {
        var config = utils.clone(stringUtil.getString("gachaponDialog"));
        config.title.txt_1 = "";
        config.title.title = stringUtil.getString(1342);
        config.content.des = stringUtil.getString(1343);
        this.dialogHotel = new DialogSmall(config);
        this.dialogHotel.tempName = "hotelDialog";
        this.dialogHotel.autoDismiss = false;
        var screenFix = Record.getScreenFix();
        if (screenFix == 1) {
            this.dialogHotel.getChildByName("bgColor").height = 827;
        } else {
            this.dialogHotel.getChildByName("bgColor").height = 864;
        }
        
        this.hotelBtn1 = uiUtil.createCommonBtnBlack(stringUtil.getString(1344, 1, 1), this, this.hotelClickBtn1);
        this.hotelBtn1.setPosition(this.dialogHotel.contentNode.width / 4, this.dialogHotel.contentNode.height / 2);
        this.dialogHotel.contentNode.addChild(this.hotelBtn1);
        this.hotelBtn1.setName("hotelBtn_1");
        
        this.hotelBtn2 = uiUtil.createCommonBtnBlack(stringUtil.getString(1344, 4, 3), this, this.hotelClickBtn2);
        this.hotelBtn2.setPosition(this.dialogHotel.contentNode.width / 4 * 3, this.dialogHotel.contentNode.height / 2);
        this.dialogHotel.contentNode.addChild(this.hotelBtn2);
        this.hotelBtn2.setName("hotelBtn_2");
        
        this.hotelBtn3 = uiUtil.createCommonBtnBlack(stringUtil.getString(1345, 16), this, this.hotelClickBtn3);
        this.hotelBtn3.setPosition(this.dialogHotel.contentNode.width / 4, this.dialogHotel.contentNode.height / 2 - 60);
        this.dialogHotel.contentNode.addChild(this.hotelBtn3);
        this.hotelBtn3.setName("hotelBtn_3");
        
        this.hotelBtn4 = uiUtil.createCommonBtnBlack(stringUtil.getString(1346, (player.alcoholPrice * 4)), this, this.hotelClickBtn4);
        this.hotelBtn4.setPosition(this.dialogHotel.contentNode.width / 4 * 3, this.dialogHotel.contentNode.height / 2 - 60);
        this.hotelBtn4.setName("hotelBtn_4");
        this.dialogHotel.contentNode.addChild(this.hotelBtn4);
    
        var pbBg = autoSpriteFrameController.getSpriteFromSpriteName("#pb_bg.png");
        pbBg.setAnchorPoint(0.5, 0);
        pbBg.setPosition(this.dialogHotel.contentNode.width / 3 * 2, this.dialogHotel.contentNode.height + 30);
        pbBg.setName("pbBg");
        this.dialogHotel.contentNode.addChild(pbBg);

        this.pb = new cc.ProgressTimer(autoSpriteFrameController.getSpriteFromSpriteName("#pb.png"));
        this.pb.type = cc.ProgressTimer.TYPE_BAR;
        this.pb.midPoint = cc.p(0, 0);
        this.pb.barChangeRate = cc.p(1, 0);
        this.pb.setPosition(pbBg.getPositionX() , pbBg.getPositionY() + pbBg.getContentSize().height / 2);
        this.pb.setPercentage(0);
        this.pb.setName("pb");
        this.dialogHotel.contentNode.addChild(this.pb);
                
        this.dialogHotel.show();
    },
    displayNotEnough: function () {
        var config = {
            title: {},
            content: {des: stringUtil.getString(9028, Number(player.currency.toFixed(2)))},
            action: {btn_1: {}}
        };
        config.action.btn_1.txt = stringUtil.getString(1073);
        var d = new DialogTiny(config);
        d.y = -94;
        d.show();
    },
    hotelClickBtn1: function () {
        var time = 3600;
        if (player.currency > 0) {
            player.isInSleepHotel = true;
            player.isInSleep = true;
            player.onCurrencyChange(-1);
            var currentTime = Number(cc.timer.time);
            currentTime -= player.lastCoffeeTime;
            if (currentTime <= 21600) {
                var hint = Math.ceil((21600 - currentTime) / 3600);
                player.log.addMsg(1324, hint);
            } else {
                player.log.addMsg(1098);
            }
            this.addTimer(time, function () {
                player.isInSleep = false;
                player.isInSleepHotel = false;
                Record.saveAll();
            });
        } else {
            this.displayNotEnough();
        }
    },
    hotelClickBtn2: function () {
        var time = 3600 * 4;
        if (player.currency > 2) {
            player.isInSleepHotel = true;
            player.isInSleep = true;
            player.onCurrencyChange(-3);
            var currentTime = Number(cc.timer.time);
            currentTime -= player.lastCoffeeTime;
            if (currentTime <= 21600) {
                var hint = Math.ceil((21600 - currentTime) / 3600);
                player.log.addMsg(1324, hint);
            } else {
                player.log.addMsg(1098);
            }
            this.addTimer(time, function () {
                player.isInSleep = false;
                player.isInSleepHotel = false;
                Record.saveAll();
            });
        } else {
            this.displayNotEnough();
        }
    },
    hotelClickBtn3: function () {
        var time = 1800;
        if (player.currency > 15) {
            player.log.addMsg(1017);
            player.onCurrencyChange(-16);
            this.addTimer(time, function () {
                player.lastCoffeeTime = Number(cc.timer.time);
                player.applyEffect({"spirit": 100, "spirit_chance": 1});
                Record.saveAll();
            });
        } else {
            this.displayNotEnough();
        }
    },
    hotelClickBtn4: function () {
        var time = 1800;
        var price = player.alcoholPrice * 4;
        if (player.currency > price) {
            player.log.addMsg(1307);
            player.onCurrencyChange(-price);
            var self = this;
            this.addTimer(time, function () {
                player.lastAlcoholTime = Number(cc.timer.time);
                player.applyEffect({"spirit": 100, "spirit_chance": 1});
                var rand = Math.random();
                if (rand < 0.3 && player.alcoholPrice < 9) {
                    player.alcoholPrice += 1;
                }
                Record.saveAll();
            });
        } else {
            this.displayNotEnough();
        }
    },
    addTimer: function (time, endCb) {
        if (this.isHotelActive) {
            return;
        }
        DISMISS_BLOCKED = true;
        this.hotelBtn1.setEnabled(false);
        this.hotelBtn2.setEnabled(false);
        this.hotelBtn3.setEnabled(false);
        this.hotelBtn4.setEnabled(false);
        this.dialogHotel.actionNode.getChildByName("btn_1").setEnabled(false);
        this.pastTime = 0;
        this.isHotelActive = true;
        var self = this;
        cc.timer.addTimerCallback(new TimerCallback(time, this, {
            process: function (dt) {
                self.pastTime += dt;
                if (self.pb) {
                    self.pb.setPercentage((time - self.pastTime) / time * 100);
                }
            },
            end: function () {
                if (self.dialogHotel) {
                    DISMISS_BLOCKED = false;
                    self.pastTime = 0;
                    self.hotelBtn1.setEnabled(true);
                    self.hotelBtn2.setEnabled(true);
                    self.hotelBtn3.setEnabled(true);
                    self.hotelBtn4.setEnabled(true);
                    self.dialogHotel.actionNode.getChildByName("btn_1").setEnabled(true);
                    self.isHotelActive = false;
                }
                if (endCb) {
                    endCb();
                }
                if (self.dialogHotel) {
                    self.dialogHotel.contentNode.removeChildByName("hotelBtn_4");
                    self.hotelBtn4 = uiUtil.createCommonBtnBlack(stringUtil.getString(1346, (player.alcoholPrice * 4)), self, self.hotelClickBtn4);
                    self.hotelBtn4.setPosition(self.dialogHotel.contentNode.width / 4 * 3, self.dialogHotel.contentNode.height / 2 - 60);
                    self.hotelBtn4.setName("hotelBtn_4");
                    self.dialogHotel.contentNode.addChild(self.hotelBtn4);
                }
            }
        }));
        cc.timer.accelerateWorkTime(time);
    },
    onEnter: function () {
        this._super();

        if (this.userData == 400) {
            player.isAtBazaar = true;
            Record.saveAll();
        }
    },
    onExit: function () {
        this._super();
        if (player.isAtBazaar) {
            player.isAtBazaar = false;
            Record.saveAll();
        }
    },

    onClickLeftBtn: function () {
        if (this.site.canClose()) {
            player.map.closeSite(this.site.id);
        }
        this.back();
        player.outSite();
    },

    showWarnDialog: function () {
        var config = {
            content: {des: stringUtil.getString(1264)},
            action: {btn_1: {}}
        };
        config.action.btn_1.txt = stringUtil.getString(1030);
        var dialog = new DialogTiny(config);
        dialog.show();
    }
});

var BazaarSiteNode = SiteNode.extend({
    onClickBtn1: function () {
        this.forward(Navigation.nodeName.BAZAAR_STORAGE_NODE, this.userData);
        this.site.haveNewItems = false;
    }
});