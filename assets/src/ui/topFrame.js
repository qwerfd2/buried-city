var TopFrameNode = cc.Node.extend({
    ctor: function () {
        this._super();

        var bg = autoSpriteFrameController.getSpriteFromSpriteName("#frame_bg_top.png")
        bg.setAnchorPoint(0.5, 1);
        var screenFix = Record.getScreenFix();
        if (screenFix == 1) {
            bg.setScale(0.87);
            bg.setPosition(cc.winSize.width / 2, cc.winSize.height - 90);
        } else {
            bg.setPosition(cc.winSize.width / 2, cc.winSize.height - 18);
        }
        
        this.addChild(bg, 6, 1);

        this.firstLine = new cc.Node();
        this.firstLine.setAnchorPoint(0, 0);
        this.firstLine.setPosition(6, 190);
        this.firstLine.setContentSize(584, 50);
        bg.addChild(this.firstLine);

        var btnSize = cc.size(this.firstLine.width / 5 - 10, this.firstLine.height);
        var halfBtnSize = cc.size(this.firstLine.width / 9 - 4, this.firstLine.height);
        
        var day = new StatusButton(cc.size(this.firstLine.width / 7 + 6, this.firstLine.height), "#icon_day.png", "", {scale: 0.5});
        day.setClickListener(this, function (sender) {
            var label = sender.getChildByName("label");
            showStatusDialog(1, cc.timer.getTimeDayStr(), sender.spriteFrameName);
        });
        
        day.setPosition(btnSize.width*0.39 + 3, this.firstLine.getContentSize().height / 2);
        day.setName("day");
        this.firstLine.addChild(day);
        
        var season = new StatusButton(halfBtnSize, "#icon_season_0.png", "", {
            scale: 0.5,
            noLabel: true
        });
        season.setClickListener(this, function (sender) {
            var label = sender.getChildByName("label");
            showStatusDialog(2, label.getString(), sender.spriteFrameName);
        });
        
        season.setPosition(btnSize.width*1.05 + 7.8, this.firstLine.getContentSize().height / 2);
        season.setName("season");
        this.firstLine.addChild(season);
        
        var time = new StatusButton(btnSize, "#icon_time.png", "", {scale: 0.5});
        time.setClickListener(this, function (sender) {
            var label = sender.getChildByName("label");
            showStatusDialog(4, label.getString(), sender.spriteFrameName);
        });
        
        time.setPosition(btnSize.width*1.83 + 8, this.firstLine.getContentSize().height / 2);
        time.setName("time");
        this.firstLine.addChild(time);

        this.updateByTime();

        var weather = new StatusButton(halfBtnSize, "#icon_weather_" + player.weather.weatherId + ".png", player.weather.getWeatherName(), {
            scale: 0.5,
            noLabel: true
        });
        weather.setClickListener(this, function (sender) {
            var label = sender.getChildByName("label");
            showStatusDialog(11, label.getString(), sender.spriteFrameName);
        });
        
        weather.setPosition(btnSize.width*2.6 + 9.6, this.firstLine.getContentSize().height / 2);
        weather.setName("weather");
        this.firstLine.addChild(weather);
        utils.emitter.on("weather_change", function (weatherId) {
            weather.updateView("icon_weather_" + weatherId + ".png", player.weather.getWeatherName());
        });

        var temperature = new StatusButton(cc.size(this.firstLine.width / 7 - 15, this.firstLine.height), "#icon_temperature_0.png", player.temperature, {scale: 0.5});
        temperature.setClickListener(this, function (sender) {
            var label = sender.getChildByName("label");
            showStatusDialog(3, label.getString(), sender.spriteFrameName);
        });
        
        temperature.setPosition(btnSize.width*3.3 - 0.8, this.firstLine.getContentSize().height / 2);
        temperature.setName("temperature");
        this.firstLine.addChild(temperature);
        utils.emitter.on("temperature_change", function (value) {
            temperature.updateView(null, player.temperature);
        });
        var eActive = player.map.getSite(WORK_SITE).isActive;
        var sid = 0;
        if (eActive) {
            eActive = "active";
            sid = 1126;
        } else {
            eActive = "inactive";
            sid = 1127;
        }
        var electric = new StatusButton(cc.size(this.firstLine.width / 9 - 8, this.firstLine.height), "#icon_electric_"+eActive+".png", stringUtil.getString(sid), {
            scale: 0.7,
            noLabel: true
        });
        electric.setClickListener(this, function (sender) {
            var label = sender.getChildByName("label");
            showStatusDialog(12, label.getString(), sender.spriteFrameName);
        });
        
        electric.setPosition(btnSize.width*4 - 13.2, this.firstLine.getContentSize().height / 2);
        electric.setName("electric");
        this.firstLine.addChild(electric);
        utils.emitter.on("onWorkSiteChange", function (val) {
            var sid = 0;
            if (val){
                sid = 1126;
                val = "active";
            } else {
                sid = 1127;
                val = "inactive";
            }
            electric.updateView("icon_electric_" + val + ".png", stringUtil.getString(sid));
        });
        
        var currency = new StatusButton(cc.size(this.firstLine.width / 6 - 5, this.firstLine.height),"#money_white.png"," "+Math.floor(player.currency),{
            scale: 0.6
        });
        currency.setPosition(btnSize.width * 4.7 - 13.2, this.firstLine.getContentSize().height / 2);
        var self = this;
        currency.setClickListener(this, function(sender) {
            showStatusDialog(13, Math.floor(player.currency), "#money_black.png");
        });

        utils.emitter.on("onCurrencyChange", function(a) {
            currency.updateView(""," "+Math.floor(a));
        });

        this.firstLine.addChild(currency);

        this.secondLine = new cc.Node();
        this.secondLine.setAnchorPoint(0, 0);
        this.secondLine.setPosition(6, 134);
        this.secondLine.setContentSize(584, 50);
        bg.addChild(this.secondLine);

        var btnSize2 = cc.size(this.secondLine.width / 8, this.secondLine.height);
        var createAttrButton = function (attr, needStatusStr, stringId, reversPercentage, warnRange) {
            var btn = new AttrButton(btnSize2, attr, "", warnRange, {scale: 0.5});
            btn.setClickListener(this, function () {
                showAttrStatusDialog(stringId, attr);
            });
            btn.setName(attr);
            utils.emitter.on(attr + "_change", function (value) {
                btn.updateAttrBtn();
            });
            btn.updateAttrBtn = function () {
                if (cc.sys.isObjectValid(btn)) {
                    btn.updateView(reversPercentage ? 1 - player.getAttrPercentage(attr) : player.getAttrPercentage(attr), needStatusStr ? player.getAttrStr(attr) : null);
                }
            };
            btn.updateAttrBtn();
            return btn;
        };

        var injury = createAttrButton("injury", false, 10, true, new Range("[0,0.5]"));
        injury.setPosition(this.secondLine.width / 16 * 1, this.secondLine.height / 2);
        this.secondLine.addChild(injury);

        var infect = createAttrButton("infect", false, 9, true, new Range("[0,0.75]"));
        infect.setPosition(this.secondLine.width / 16 * 3, this.secondLine.height / 2);
        this.secondLine.addChild(infect);

        var starve = createAttrButton("starve", false, 6, false, new Range("[0,0.5]"));
        starve.setPosition(this.secondLine.width / 16 * 5, this.secondLine.height / 2);
        this.secondLine.addChild(starve);

        var vigour = createAttrButton("vigour", false, 7, false, new Range("[0,0.5]"));
        vigour.setPosition(this.secondLine.width / 16 * 7, this.secondLine.height / 2);
        this.secondLine.addChild(vigour);

        var spirit = createAttrButton("spirit", false, 8, false, new Range("[0,0.5]"));
        spirit.setPosition(this.secondLine.width / 16 * 9, this.secondLine.height / 2);
        this.secondLine.addChild(spirit);

        var water = createAttrButton("water", false, 14, false, new Range("[0,0.5]"));
        water.setPosition(this.secondLine.width / 16 * 11, this.secondLine.height / 2);
        this.secondLine.addChild(water);
        
        var virus = createAttrButton("virus", false, 15, true, new Range("[0,0.25]"));
        virus.setPosition(this.secondLine.width / 16 * 13, this.secondLine.height / 2);
        this.secondLine.addChild(virus);

        var hp = createAttrButton("hp", false, 5, false, new Range("[0,0.5]"));
        hp.setPosition(this.secondLine.width / 16 * 15, this.secondLine.height / 2);
        this.secondLine.addChild(hp);
        

        this.thirdLine = new ButtonWithPressed(cc.size(584, 122));
        this.thirdLine.setAnchorPoint(0, 0);
        this.thirdLine.setPosition(6, 6);
        bg.addChild(this.thirdLine);
        this.createLogBar();

        var self = this;
        utils.emitter.on("logChanged", function (msg) {
            if (cc.sys.isObjectValid(self.thirdLine)) {
                self.thirdLine.updateLog(msg.txt);
                self.logTablebg.getChildByName("logView").addLog(msg);
            }
        });
        return true;
    },
    updateByTime: function () {
        var timeObj = cc.timer.formatTime();

        var seasonStr = stringUtil.getString(3000);
        var s = cc.timer.getSeason(timeObj);
        this.firstLine.getChildByName("season").updateView("#icon_season_" + s + ".png", seasonStr[s]);
        this.firstLine.getChildByName("day").updateView(null, cc.timer.formatTime().d + 1);
        this.firstLine.getChildByName("time").updateView(null, cc.timer.getTimeHourStr());
    },

    onExit: function () {
        this._super();
        utils.emitter.off("logChanged");
        if (this.tcb) {
            cc.timer.removeTimerCallback(this.tcb);
        }
    },

    onEnter: function () {
        this._super();
        var self = this;
        if (utils.emitter.listeners("logChanged").length < 1) {
            utils.emitter.on("logChanged", function (msg) {
                self.thirdLine.updateLog(msg.txt);
                self.logTablebg.getChildByName("logView").addLog(msg);
            });
        }

        this.tcb = cc.timer.addTimerCallback(new TimerCallback(60, this, {
            end: function () {
                self.updateByTime();
            }
        }, TimerManager.REPEAT_FOREVER));
    },

    createLogBar: function () {

        this.thirdLine.setClickListener(this, function () {
            this.bgNode.setVisible(!this.bgNode.isVisible());
            if (this.bgNode.isVisible()) {
                audioManager.playEffect(audioManager.sound.LOG_POP_UP);
            }
        });
        var self = this;

        for (var i = 0; i < 4; i++) {
            var label = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(580, 0));
            label.setAnchorPoint(0, 0);
            label.setPosition(0, i * 30 + 4);
            label.setName("log_" + i);
            label.setColor(cc.color.WHITE);
            this.thirdLine.addChild(label);
        }

        this.thirdLine.updateLog = function (log) {
            var logs = utils.splitLog(log, 55, 62);
            logs.forEach(function (llog) {
                self.thirdLine.updateLogSingleLine(llog);
            });
        };

        this.thirdLine.updateLogSingleLine = function (log) {
            for (var i = 3; i >= 0; i--) {
                var label = this.getChildByName("log_" + i);
                if (i === 0) {
                    label.setString(log);
                } else {
                    var lastLabel = this.getChildByName("log_" + (i - 1));
                    label.setString(lastLabel.getString());
                }
            }
        };
        this.createLogTableView();
    },

    createLogTableView: function () {
        this.bgNode = new cc.Node();
        this.addChild(this.bgNode, 5);
        this.logTablebg = autoSpriteFrameController.getSpriteFromSpriteName("#frame_bg_bottom.png");
        this.logTablebg.setAnchorPoint(0.5, 0);   
        var bgColor = new cc.LayerColor();
        bgColor.setColor(cc.color(0, 0, 0, 155));
        bgColor.setOpacity(200);    
        this.bgNode.addChild(bgColor, 0);
        var screenFix = Record.getScreenFix();
        if (screenFix == 1) {
            this.logTablebg.setPosition(cc.winSize.width / 2, 91);
            this.logTablebg.setScale(0.87);
        } else {
            this.logTablebg.setPosition(cc.winSize.width / 2, 18);        
        }
        this.bgNode.addChild(this.logTablebg, 10);

        var self = this;
        var btn = new ButtonInScrollView(this.logTablebg.getContentSize());
        btn.setAnchorPoint(0, 0);
        btn.setPosition(0, 0);
        this.logTablebg.addChild(btn);
        btn.setClickListener(this, function () {
            if (self.bgNode.isVisible()) {
                self.bgNode.setVisible(false);
            }
        });

        var logView = new LogView(cc.size(this.logTablebg.width, this.logTablebg.height - 20));
        logView.setPosition(7, 5);
        logView.setName("logView");
        this.logTablebg.addChild(logView, 1);

        this.bgNode.setVisible(false);
    }
});

var showStatusDialog = function (stringId, value, iconName) {
    var config = utils.clone(stringUtil.getString("statusDialog"));
    var strConfig = stringUtil.getString(stringId);
    config.title.icon = iconName;
    config.title.title = strConfig.title;
    config.title.txt_1 = cc.formatStr(config.title.txt_1, value);
    if (player.room.getBuildLevel(15) > -1) {
        config.title.txt_2 = stringId == 11 ? stringUtil.getString(9003) + player.weather.Random: ""
    }
    config.content.des = strConfig.des;
    var dialog = new DialogSmall(config);
    dialog.show();
};

var showAttrStatusDialog = function (stringId, attr) {
    var config = utils.clone(stringUtil.getString("statusDialog"));
    var strConfig = stringUtil.getString(stringId);
    config.title.icon = "#icon_" + attr + "_0.png";
    config.title.title = strConfig.title;
    if (attr === 'hp' || attr === 'virus') {
        config.title.txt_1 = cc.formatStr(config.title.txt_1, player[attr] + "/" + player[attr + "Max"]);
    } else {
        config.title.txt_1 = cc.formatStr(player.getAttrStr(attr), config.title.txt_1, player[attr] + "/" + player[attr + "Max"]);
    }
    config.content.des = strConfig.des;
    var dialog = new DialogBig(config);
    dialog.autoDismiss = false;

    var des = dialog.contentNode.getChildByName('des');

    var buffEffect = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(dialog.rightEdge - dialog.leftEdge, 0));
    buffEffect.anchorX = 0;
    buffEffect.anchorY = 1;
    buffEffect.x = dialog.leftEdge;
    buffEffect.y = des.y - des.height - 10;
    dialog.contentNode.addChild(buffEffect);
    buffEffect.setColor(cc.color(0, 162, 53));
    buffEffect.setVisible(false);

    var buffLastTime = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(dialog.rightEdge - dialog.leftEdge, 0));
    buffLastTime.anchorX = 0;
    buffLastTime.anchorY = 1;
    buffLastTime.x = dialog.leftEdge;
    dialog.contentNode.addChild(buffLastTime);
    buffLastTime.setColor(cc.color(0, 162, 53));
    buffLastTime.setVisible(false);

    var updateBuff = function () {
        if ((attr === 'hp' && player.buffManager.isBuffEffect(BuffItemEffectType.ITEM_1107012))
            || (attr === 'infect' && player.buffManager.isBuffEffect(BuffItemEffectType.ITEM_1107022))
            || (attr === 'vigour' && player.buffManager.isBuffEffect(BuffItemEffectType.ITEM_1107032))
            || (attr === 'starve' && player.buffManager.isBuffEffect(BuffItemEffectType.ITEM_1107042))
            || (attr === 'virus' && player.buffManager.isBuffEffect(BuffItemEffectType.ITEM_1107052))) {
            buffEffect.setVisible(true);
            buffLastTime.setVisible(true);

            var buff = player.buffManager.getBuff();
            buffEffect.setString(stringUtil.getString(1296, stringUtil.getString(buff.itemId).title) + stringUtil.getString('b_' + buff.itemId));
            buffLastTime.setString(stringUtil.getString(1297) + utils.getBuffTimeStr(buff.lastTime));
            buffLastTime.y = buffEffect.y - buffEffect.height - 6;
        } else {
            buffEffect.setVisible(false);
            buffLastTime.setVisible(false);
        }
    };

    updateBuff();

    var storage;
    if (player.isAtHome) {
        storage = player.storage;
    } else {
        if (player.tmpBag) {
            storage = player.tmpBag;
        } else {
            storage = player.bag;
        }
    }

    //fix bug: NPC交易时快捷使用物品带来的不正确
    if (!player.tmpBag) {
        var itemList = [];
        if (attr === 'starve') {
            itemList = storage.getItemsByType("1103");
        } else if (attr === 'infect') {
            itemList = storage.getItemsByType("1104");
            itemList = itemList.filter(function (storageCell) {
                return storageCell.item.id != '1104011';
            });
        } else if (attr === 'injury') {
            itemList = storage.getItemsByType("1104");
            itemList = itemList.filter(function (storageCell) {
                return storageCell.item.id == '1104011';
            });
        } else if (attr == 'hp') {
            itemList = storage.getItemsByType("1107");
        }

        var itemTableView = uiUtil.createItemListSliders(itemList);
        itemTableView.x = 20;
        itemTableView.y = 2;
        dialog.contentNode.addChild(itemTableView);

        var onItemUse = function (itemId, source) {
            if (source !== 'top')
                return;
            var res = player.useItem(storage, itemId);
            if (res.result) {
                itemTableView.updateData();
                itemTableView.reloadData();
                Record.saveAll();
                dialog.dismiss();
            }
        };

        utils.emitter.on("btn_1_click", onItemUse);
        dialog.setOnDismissListener({
            target: dialog, cb: function () {
                utils.emitter.off('btn_1_click', onItemUse);
            }
        });
    }
    if (attr == "virus") {
        var showText = new cc.LabelTTF(stringUtil.getString(1336), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(dialog.rightEdge - dialog.leftEdge, 0));
        showText.anchorX = 0;
        showText.anchorY = 1;
        showText.x = dialog.leftEdge;
        showText.y = 100;
        dialog.contentNode.addChild(showText);
        showText.setColor(cc.color.RED);
    
        if (player.injuryMax > 14) {
            var exchangeInjury = new ImageButton("res/new/injury.png");
            exchangeInjury.setPosition(60, 40);
            exchangeInjury.setScale(0.7);
            dialog.contentNode.addChild(exchangeInjury, 1);
            exchangeInjury.setClickListener(this, function(a) {
                virusExchangeDialog(10, function() {
                    player.injuryMax -= 5;
                    player.injury = cc.clampf(player.injury, 0, player.injuryMax);
                    player.virusMax += 20;
                    player.changeInjury(0);
                    player.changeVirus(0);
                    Record.saveAll();
                    player.log.addMsg(stringUtil.getString(1335, 5, stringUtil.getString(10).title));
                    dialog.dismiss();
                })
            });
        }
        if (player.infectMax > 14) {
            var exchangeInfection = new ImageButton("res/new/infection.png");
            exchangeInfection.setPosition(120, 40);
            exchangeInfection.setScale(0.7);
            dialog.contentNode.addChild(exchangeInfection, 1);
            exchangeInfection.setClickListener(this, function(a) {
                virusExchangeDialog(9, function() {
                    player.infectMax -= 5;
                    player.infect = cc.clampf(player.infect, 0, player.infectMax);
                    player.virusMax += 20;
                    player.changeInfect(0);
                    player.changeVirus(0);
                    Record.saveAll();
                    player.log.addMsg(stringUtil.getString(1335, 5, stringUtil.getString(9).title));
                    dialog.dismiss();
                })
            });
        }
        if (player.starveMax > 14) {
            var exchangeHunger = new ImageButton("res/new/hunger.png");
            exchangeHunger.setPosition(180, 40);
            exchangeHunger.setScale(0.7);
            dialog.contentNode.addChild(exchangeHunger, 1);
            exchangeHunger.setClickListener(this, function(a) {
                virusExchangeDialog(6, function() {
                    player.starveMax -= 5;
                    player.starve = cc.clampf(player.starve, 0, player.starveMax);
                    player.virusMax += 20;
                    player.changeStarve(0);
                    player.changeVirus(0);
                    Record.saveAll();
                    player.log.addMsg(stringUtil.getString(1335, 5, stringUtil.getString(6).title));
                    dialog.dismiss();
                })        
            });
        }
        if (player.vigourMax > 14) {
            var exchangeVigour = new ImageButton("res/new/vigour.png");
            exchangeVigour.setPosition(240, 40);
            exchangeVigour.setScale(0.7);
            dialog.contentNode.addChild(exchangeVigour, 1);
            exchangeVigour.setClickListener(this, function(a) {
                virusExchangeDialog(7, function() {
                    player.vigourMax -= 5;
                    player.vigour = cc.clampf(player.vigour, 0, player.vigourMax);
                    player.virusMax += 20;
                    player.changeVigour(0);
                    player.changeVirus(0);
                    Record.saveAll();
                    player.log.addMsg(stringUtil.getString(1335, 5, stringUtil.getString(7).title));
                    dialog.dismiss();
                })
            });
        }
        if (player.spiritMax > 14) {
            var exchangeSpirit = new ImageButton("res/new/spirit.png");
            exchangeSpirit.setPosition(300, 40);
            exchangeSpirit.setScale(0.7);
            dialog.contentNode.addChild(exchangeSpirit, 1);
            exchangeSpirit.setClickListener(this, function(a) {
                virusExchangeDialog(8, function() {
                    player.spiritMax -= 5;
                    player.spirit = cc.clampf(player.spirit, 0, player.spiritMax);
                    player.virusMax += 20;
                    player.changeSpirit(0);
                    player.changeVirus(0);
                    Record.saveAll();
                    player.log.addMsg(stringUtil.getString(1335, 5, stringUtil.getString(8).title));
                    dialog.dismiss();
                })
            });
        }
        if (player.waterMax > 14) {
            var exchangeWater = new ImageButton("res/new/water.png");
            exchangeWater.setPosition(360, 40);
            exchangeWater.setScale(0.7);
            dialog.contentNode.addChild(exchangeWater, 1);
            exchangeWater.setClickListener(this, function(a) {
                virusExchangeDialog(14, function() {
                    player.waterMax -= 5;
                    player.water = cc.clampf(player.water, 0, player.waterMax);
                    player.virusMax += 20;
                    player.changeWater(0);
                    player.changeVirus(0);
                    Record.saveAll();
                    player.log.addMsg(stringUtil.getString(1335, 5, stringUtil.getString(14).title));
                    dialog.dismiss();
                })
            });
        }
        if (player.hpMax > 29) {
            var exchangeHp = new ImageButton("res/new/hp.png");
            exchangeHp.setPosition(420, 40);
            exchangeHp.setScale(0.7);
            dialog.contentNode.addChild(exchangeHp, 1);
            exchangeHp.setClickListener(this, function(a) {
                virusExchangeDialog(5, function() {
                    player.hpMax -= 10;
                    player.hp = cc.clampf(player.hp, 0, player.hpMax);
                    player.virusMax += 20;
                    player.changeHp(0);
                    player.changeVirus(0);
                    Record.saveAll();
                    player.log.addMsg(stringUtil.getString(1335, 10, stringUtil.getString(5).title));
                    dialog.dismiss();
                })
            });
        }
    }

    dialog.show();
};