var HomeNode = BottomFrameNode.extend({
    ctor: function (userData) {
        this._super(userData);

        if (userData) {
            //从外面回家
            this.flushBag();
            //删除无用的副本
            player.map.deleteUnusableSite();
        }

        player.goHome();
        
        var homeBg = new cc.Sprite("res/new/home_bg.png");
        homeBg.setAnchorPoint(0.5, 0);
        homeBg.setPosition(this.bgRect.width / 2, 0);
        this.bg.addChild(homeBg, 2);

        var infos = [
            {bid: 1, pos: {x: 65, y: 230}},
            {bid: 2, pos: {x: 425, y: 780}},
            {bid: 18, pos: {x: 205, y: 165}},
            {bid: 4, pos: {x: 477, y: 562}},
            {bid: 5, pos: {x: 310, y: 330}},
            {bid: 6, pos: {x: 75, y: 390}},
            {bid: 15, pos: {x: 408, y: 677}},
            {bid: 7, pos: {x: 250, y: 630}},
            {bid: 8, pos: {x: 84, y: 780}},
            {bid: 9, pos: {x: 75, y: 590}},
            {bid: 10, pos: {x: 480, y: 410}},
            {bid: 11, pos: {x: 436, y: 85}},
            {bid: 13, pos: {x: 124, y: 49}},
            {bid: 14, pos: {x: 425, y: 216}},
            {bid: 16, pos: {x: 203, y: 290}},
            {bid: 19, pos: {x: 436, y: 85}},
            {bid: 17, pos: {x: 416, y: 108}},
            {bid: 3, pos: {x: 545, y: 268}},
            {bid: 12, pos: {x: 335, y: 125}},
            {bid: 20, pos: {x: 196, y: 780}},
            {bid: 21, pos: {x: 525, y: 674}}
        ];
        this.btnList = {};

        var self = this;
        infos.forEach(function (info) {
            var buildLevel = player.room.getBuildLevel(info.bid);
            buildLevel = Math.max(0, buildLevel);
            var btn = new ButtonAtHome("#icon_start_build_" + info.bid + "_" + buildLevel + ".png");
            btn.setClickListener(self, self.onClickBuild);
            btn.setPosition(info.pos);
            homeBg.addChild(btn);
            btn.setName("homeBtn_" + info.bid);
            btn.info = info;
            self.btnList[info.bid] = btn;

            self.updateBtn(info.bid);
        });

        utils.emitter.on("placed_success", function (bid) {
            self.updateBtn(bid);
        });
        
        utils.emitter.on("dogStateChange", function () {
            if (cc.sys.isObjectValid(homeBg)) {
                self.updateBtn(12);
            }
        });
        
        utils.emitter.on("bombUsed", function () {
            if (cc.sys.isObjectValid(homeBg)) {
                self.updateBtn(17);
            }
        });   

        if (!player.getSetting("initLog", false)) {
            player.setSetting("initLog", true);
            player.log.addMsg(1168);
        }

        //为大门加入发光
        var gateBtn = this.btnList[14];
        var gateLight = autoSpriteFrameController.getSpriteFromSpriteName('gate_light.png');
        gateLight.x = gateBtn.width / 2;
        gateLight.y = gateBtn.height / 2;
        gateBtn.addChild(gateLight);
        gateLight.runAction(cc.repeatForever((cc.sequence(cc.fadeOut(2), cc.fadeIn(2)))));

    },
    updateBtn: function (bid) {
        var btn = this.btnList[bid];
        var build = player.room.getBuild(bid);
        if (bid != 17 && bid != 12) {
            if (build.level >= 0) {
                btn.changeType(ButtonAtHomeType.WHITE);
            } else {
                btn.changeType(ButtonAtHomeType.BLACK);
            }
        } else if (bid == 17) {
            if (player.isBombActive) {
                btn.changeType(ButtonAtHomeType.WHITE);
            } else {
                btn.changeType(ButtonAtHomeType.BLACK);
            }
        } else {
            if (player.isDogActive() && build.level >= 0) {
                btn.changeType(ButtonAtHomeType.WHITE);
            } else {
                btn.changeType(ButtonAtHomeType.BLACK);
            }
        }

        uiUtil.removeIconWarn(btn);

        if (bid === 1 && userGuide.isStep(userGuide.stepName.HOME_TOOL)) {
            uiUtil.createIconWarn(btn);
        } else if (bid === 14 && (userGuide.isStep(userGuide.stepName.HOME_GATE) || userGuide.isStep(userGuide.stepName.HOME_GATE_AGAIN))) {
            uiUtil.createIconWarn(btn);
        } else if (bid === 13 && userGuide.isStep(userGuide.stepName.HOME_STORAGE)) {
            uiUtil.createIconWarn(btn);
        } else if (bid === 9 && userGuide.isStep(userGuide.stepName.HOME_SLEEP)) {
            uiUtil.createIconWarn(btn);
        }

        uiUtil.createBuildWarn(btn, bid);
    },
    onClickBuild: function (sender) {
        var bid = sender.info.bid;

        if (bid === 1 && userGuide.isStep(userGuide.stepName.HOME_TOOL)) {
            userGuide.step();
        } else if (bid === 14 && (userGuide.isStep(userGuide.stepName.HOME_GATE) || userGuide.isStep(userGuide.stepName.HOME_GATE_AGAIN))) {
            userGuide.step();
        } else if (bid === 13 && userGuide.isStep(userGuide.stepName.HOME_STORAGE)) {
            userGuide.step();
        } else if (bid === 9 && userGuide.isStep(userGuide.stepName.HOME_SLEEP)) {
            userGuide.step();
        }
        switch (bid) {
            case 13:
                this.forward(Navigation.nodeName.STORAGE_NODE, sender.info);
                break;
            case 14:
                if (player.room.getBuildLevel(bid) >= 0) {
                    this.forward(Navigation.nodeName.GATE_NODE, sender.info);
                }
                break;
            case 15:
                this.forward(Navigation.nodeName.RADIO_NODE, sender.info);
                break;
            default:
                this.forward(Navigation.nodeName.BUILD_NODE, sender.info);
        }
    },
    _init: function () {
        this.setName(Navigation.nodeName.HOME_NODE);
        this.uiConfig = {
            title: Navigation.nodeName.HOME_NODE,
            leftBtn: false,
            rightBtn: false
        };
    },
    onClickLeftBtn: function () {
        this.forward(Navigation.nodeName.BOTTOM_FRAME_NODE);
    },

    flushBag: function () {
        var counter = 0;
        var offset = IAPPackage.getHandyworkerOffset();
        player.bag.forEach(function (item, num) {
            if (!player.equip.isEquiped(item.id) && item.id != BattleConfig.BULLET_ID && item.id != BattleConfig.HOMEMADE_ID && item.id != "1101061") {
                var weight = itemConfig[item.id].weight;
                counter += weight * num;
                player.storage.increaseItem(item.id, num, false);
                player.bag.decreaseItem(item.id, num);
            } else if (item.id == "1101061") {
                num = num - 5;
                if (num > 0) {
                    var weight = itemConfig[item.id].weight;
                    counter += weight * num;
                    player.storage.increaseItem(item.id, num, false);
                    player.bag.decreaseItem(item.id, num);
                }
            }
        });
        cc.timer.updateTime(Math.round((counter / offset) * 60));
    },
    onExit: function () {
        this._super();
        utils.emitter.off("placed_success");
    },
    onEnter: function () {
        var self = this;
        this._super();
        this.updateDogHouse();
        //新手引导文字
        this.scheduleOnce(function () {
            if (userGuide.isStep(userGuide.stepName.GAME_START)) {
                uiUtil.showGuideDialog(stringUtil.getString(1237), "res/new/guide_pic_1.png", self);
            } else if (userGuide.isStep(userGuide.stepName.BACK_HOME_WARN)) {
                uiUtil.showGuideDialog(stringUtil.getString(1238), "res/new/guide_pic_2.png", self, true);
            } else if (userGuide.isStep(userGuide.stepName.WAKE_UP_WARN)) {
                uiUtil.showGuideDialog(stringUtil.getString(1239), "res/new/guide_pic_1.png", self);
            } else if (userGuide.isStep(userGuide.stepName.RADIO_PROMPT)) {
                uiUtil.showGuideDialog(stringUtil.getString("radio_tut"), "radio", self);
                userGuide.step();
            }
        }, 0.1);
    },

    updateDogHouse: function () {
        var bid = 12;
        var btn = this.btnList[bid];
        var self = this;
        btn.setEnabled(true);
        btn.removeChildByName("lock");
    }
});