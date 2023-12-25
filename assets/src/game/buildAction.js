var BuildOccupied = false;

var BuildAction = cc.Class.extend({
    ctor: function (bid) {
        this.isActioning = false;
        this.bid = bid;
        this.tcb2;
        this.id = this.bid;
        this.tcb;
    },
    getCurrentBuildLevel: function () {
        return player.room.getBuildLevel(this.bid);
    },
    save: function () {
        return {};
    },
    restore: function (saveObj) {
        if (saveObj) {
        }
    },
    clickIcon: function () {
    },
    clickAction1: function () {
    },
    _sendUpdageSignal: function () {
        utils.emitter.emit("build_node_update");
    },
    _updateStatus: function () {
    },
    _getUpdateViewInfo: function () {
    },
    updateView: function (view, idx) {
        this.view = view;
        this.idx = idx;
        if (this.view) {
            this.build = player.room.getBuild(this.bid);
            this.view.updateView({btnIdx: idx});
            this._updateStatus();
            var viewInfo = this._getUpdateViewInfo();
            if (this.build.anyBtnActive() && this.build.activeBtnIndex !== this.idx) {
                viewInfo.action1Disabled = true;
            }
            this.view.updateView(viewInfo);
        }
    },
    addTimer: function (time, totalTime, endCb, notAccelerate, startTime) {
        this.isActioning = true;
        this.pastTime = startTime || 0;
        this.totalTime = totalTime;
        var timerStartTime;
        if (startTime) {
            timerStartTime = cc.timer.time - startTime;
        }
        var self = this;
        var tcb = cc.timer.addTimerCallback(new TimerCallback(time, this, {
            process: function (dt) {
                self.pastTime += dt;
                if (self.view) {
                    var percent = self.pastTime / self.totalTime * 100;
                    self.view.updatePercentage(percent);

                    if (self.step && self.step === 1) {
                        self.view.updateHint(self.getPlacedTxt(self.totalTime - self.pastTime));
                    }
                    if (percent >= 100 && ((self.bid == 2 && self.step == 1) || (self.bid == 8 && self.step == 1))) {
                        self.isActioning = false;
                        self.pastTime = 0;
                        if (endCb) {
                            endCb();
                        }
                        self._sendUpdageSignal();
                        cc.timer.removeTimerCallback(this.tcb);
                    }
                }
            },
            end: function () {
                self.isActioning = false;
                self.pastTime = 0;

                if (endCb) {
                    endCb();
                }
                self._sendUpdageSignal();
            }
        }), timerStartTime);
        if (!notAccelerate) {
            cc.timer.accelerateWorkTime(time);
        }
        this.tcb = tcb;
        return this.tcb;
    },
    canMake: function () {
        return false;
    }
});

var Formula = BuildAction.extend({
    ctor: function (fid, bid) {
        this._super(bid);
        this.id = fid;
        this.config = utils.clone(formulaConfig[this.id]);
        this.needBuild = null;
        this.step = 0;
        this.tcb2;
        this.maxStep = this.config["placedTime"] ? 2 : 1;
    },
    save: function () {
        return {step: this.step, pastTime: this.pastTime};
    },
    restore: function (saveObj) {
        if (saveObj) {
            this.step = saveObj.step;
            this.pastTime = saveObj.pastTime;
            if (this.step == 1) {
                this.place();
            }
        }
    },
    clickIcon: function () {
        uiUtil.showItemDialog(this.config.produce[0].itemId, true);
    },
    place: function (check) {
        var self = this;
        var itemInfo = this.config.produce[0];
        var itemName = stringUtil.getString(itemInfo.itemId).title;
        var time = this.config["placedTime"];
        time *= 60;
        if (check) {
            cc.timer.removeTimerCallback(this.tcb2);
            this.tcb2 = this.addTimer(time, time, function () {
                if (self.step < self.maxStep) {
                    self.step++;
                    var lan = cc.sys.localStorage.getItem("language");
                    if (lan === 'zh' || lan === 'zh-Hant') {
                        player.log.addMsg(1091, player.room.getBuildCurrentName(self.bid), itemName);
                    } else {
                        player.log.addMsg(1091, itemName, player.room.getBuildCurrentName(self.bid));
                    }
                    utils.emitter.emit("placed_success", self.bid);
                }
            }, true, this.pastTime);
        } else {
            this.addTimer(time, time, function () {
                if (self.step < self.maxStep) {
                    self.step++;
                    var lan = cc.sys.localStorage.getItem("language");
                    if (lan === 'zh' || lan === 'zh-Hant') {
                        player.log.addMsg(1091, player.room.getBuildCurrentName(self.bid), itemName);
                    } else {
                        player.log.addMsg(1091, itemName, player.room.getBuildCurrentName(self.bid));
                    }
                    utils.emitter.emit("placed_success", self.bid);
                }
            }, true, this.pastTime);
        }
    },
    clickAction1: function () {
        if (!uiUtil.checkVigour())
            return;
        var itemInfo = this.config.produce[0];
        var itemName = stringUtil.getString(itemInfo.itemId).title;
        if (this.step == 0) {
            if (BuildOccupied) {
                return;
            }
            BuildOccupied = true;
            this.build.setActiveBtnIndex(this.idx);
            utils.emitter.emit("left_btn_enabled", false);
            //2. 制作
            var time = this.config["makeTime"];
            time *= 60;
            if (IAPPackage.isHandyworkerUnlocked()) {
                time = Math.round(time * 0.7);
            }
            var self = this;
            this.addTimer(time, time, function () {
                self.step++;
                if (self.step == self.maxStep) {
                    self.step = 0;
                }
                BuildOccupied = false;
                if (self.step == 1) {
                    //1. cost成功
                    player.costItems(self.config.cost);
                    if (self.bid == 2) {
                        self.place(true);
                    } else {
                        self.place();
                    }
                } else {
                    //1. cost成功
                    player.costItems(self.config.cost);
                    //非放置类的,第一次进度完成即获取物品
                    player.gainItems(self.config.produce);
                    self.config.produce.forEach(function (item) {
                        Achievement.checkMake(item.itemId, item.num);
                    });
                    player.log.addMsg(1090, itemInfo.num, itemName, player.storage.getNumByItemId(itemInfo.itemId));
                    self.build.resetActiveBtnIndex();
                    if (self.build.id === 1 && userGuide.isStep(userGuide.stepName.TOOL_ALEX)) {
                        userGuide.step();
                        //解锁大门
                        player.room.createBuild(14, 0);
                    }
                }
                utils.emitter.emit("left_btn_enabled", true);
                Record.saveAll();
            });
        } else if (this.step == 2 || this.bid != 2) {
            //天气影响
            var produce = utils.clone(this.config.produce);
            //蒸馏水的影响
            produce.forEach(function (item) {
                if (item.itemId == 1101061) {
                    item.num += player.weather.getValue("item_1101061");
                }
            });
            //温棚影响
            if (this.bid == 2) {
                produce.forEach(function (item) {
                    item.num += player.weather.getValue("build_2");
                });
            }
            //放置完毕收获
            player.gainItems(produce);
            produce.forEach(function (item) {
                Achievement.checkProduce(item.itemId, item.num);
            });
            this.step = 0;
            player.log.addMsg(1092, produce[0].num, itemName, player.storage.getNumByItemId(itemInfo.itemId));
            this.build.resetActiveBtnIndex();
            Record.saveAll();
        } else if (this.step == 1 && this.bid == 2) {
            if (player.storage.validateItem(1101081, 1)) {
                player.storage.decreaseItem(1101081, 1);
                this.pastTime += 10800;
                this.place(true);
            } else {
                action1Disabled = true;
            }
        }
        this._sendUpdageSignal();
    },
    getPlacedTxt: function (time) {
        var itemName = stringUtil.getString(this.config.produce[0].itemId).title;
        return stringUtil.getString(1008, Math.ceil(time / 60 / 60));
    },
    _getUpdateViewInfo: function () {
        var iconName = "#icon_item_" + this.config.produce[0].itemId + ".png";
        var time = this.config["makeTime"];
        if (IAPPackage.isHandyworkerUnlocked()) {
            time = Math.round(time * 0.7);
        }
        var action1Txt;
        if (!this.step) {
            action1Txt = stringUtil.getString(1002, time);
        } else if (this.step == 1 && this.bid == 2) {
            action1Txt = stringUtil.getString(6674, stringUtil.getString(1101081).title);
            
        } else if (this.step == 2) {
            action1Txt = stringUtil.getString(1003);
        }
        var itemName = stringUtil.getString(this.config.produce[0].itemId).title;

        var hint, hintColor, items, action1Disabled;
        if (this.needBuild.level > player.room.getBuildLevel(this.needBuild.bid)) {
            hint = stringUtil.getString(1006, player.room.getBuildName(this.needBuild["bid"], this.needBuild["level"]));
            hintColor = cc.color.RED;
            action1Disabled = true;
        } else if (this.isActioning) {
            if (this.step == 1 && this.bid == 2) {
                hint = stringUtil.getString(1008, Math.ceil(this.config["placedTime"] / 60));
                if (player.storage.validateItem(1101081, 1)) {
                    action1Disabled = false;
                } else {
                    action1Disabled = true;
                }
            } else if (this.bid != 2) {
                hint = stringUtil.getString(1007, itemName);
                action1Disabled = true;
            } else {
                hint = stringUtil.getString(1166, itemName);
                action1Disabled = true;
            }
            hintColor = cc.color.WHITE;
        } else {
            if (this.step == 2) {
                hint = stringUtil.getString(1009, itemName);
            } else {
                hint = "";
                var cost = this.config.cost;
                if (!player.validateItems(cost)) {
                    action1Disabled = true;
                }
                items = cost.map(function (itemInfo) {
                    return {
                        itemId: itemInfo.itemId,
                        num: itemInfo.num,
                        color: itemInfo.haveNum >= itemInfo.num ? cc.color.WHITE : cc.color.RED
                    };
                });
            }
        }
        var res = {
            iconName: iconName,
            hint: hint,
            hintColor: hintColor,
            items: items,
            action1: action1Txt,
            action1Disabled: action1Disabled,
            percentage: 0
        };
        return res;
    },
    canMake: function () {
        var cost = this.config.cost;
        return player.validateItems(cost) && this.needBuild.level <= player.room.getBuildLevel(this.needBuild.bid);
    }
});

var TrapBuildAction = Formula.extend({
    ctor: function (bid) {
        this.isActioning = false;
        this.bid = bid;
        this.id = this.bid;
        this.config = utils.clone(buildActionConfig[this.id][0]);
        this.needBuild = {bid: this.id, level: 0};
        this.step = 0;
        this.maxStep = this.config["placedTime"] ? 2 : 1;
    },
    clickIcon: function () {
        uiUtil.showBuildActionDialog(this.bid, 0);
    },
    place: function () {
        var self = this;
        var itemInfo = this.config.produce[0];
        var itemName = stringUtil.getString(itemInfo.itemId).title;
        var placedTimes = self.config["placedTime"];
        var time;
        if (player.trapTime != -1) {
            time = player.trapTime;
        } else {
            time = utils.getRandomInt(placedTimes[0], placedTimes[1]);
            player.trapTime = time;
            Record.saveAll();
        }
        time *= 60;
        cc.timer.removeTimerCallback(this.tcb2);
        this.tcb2 = this.addTimer(time, time, function () {
            if (self.step < self.maxStep) {
                self.step++;
                var lan = cc.sys.localStorage.getItem("language");
                if (lan === 'zh' || lan === 'zh-Hant') {
                    player.log.addMsg(1091, player.room.getBuildCurrentName(self.bid), itemName);
                } else {
                    player.log.addMsg(1091, itemName, player.room.getBuildCurrentName(self.bid));
                }
                utils.emitter.emit("placed_success", self.bid);
            }
        }, true, this.pastTime);
    },
    clickAction1: function () {
        if (!uiUtil.checkVigour())
            return;

        var itemInfo = this.config.produce[0];
        var itemName = stringUtil.getString(itemInfo.itemId).title;

        if (this.step == 0) {
            this.build.setActiveBtnIndex(this.idx);
            utils.emitter.emit("left_btn_enabled", false);

            //2. 制作
            var time = this.config["makeTime"];
            time *= 60;
            if (IAPPackage.isHandyworkerUnlocked()) {
                time = Math.round(time * 0.7);
            }
            var self = this;
            this.addTimer(time, time, function () {
                self.step++;
                if (self.step == self.maxStep) {
                    self.step = 0;
                }
                if (self.step == 1) {
                    //1. cost成功
                    player.costItems(self.config.cost);
                    self.place(true);
                } else {
                    //1. cost成功
                    player.costItems(self.config.cost);
                    //非放置类的,第一次进度完成即获取物品
                    player.gainItems(self.config.produce);
                    this.build.resetActiveBtnIndex();
                }
                utils.emitter.emit("left_btn_enabled", true);
                Record.saveAll();
            });
        } else if (this.step == 1) {
            if (player.storage.validateItem(1103011, 1)) {
                player.storage.decreaseItem(1103011, 1);
                this.pastTime += 43200;
                this.place();
            } else {
                action1Disabled = true;
            }
        } else {
            //天气影响
            var produce = utils.clone(this.config.produce);
            //肉的影响
            produce.forEach(function (item) {
                if (item.itemId == 1103041) {
                    item.num += player.weather.getValue("item_1103041");
                }
            });
            //放置完毕收获
            player.gainItems(produce);
            produce.forEach(function (item) {
                Achievement.checkProduce(item.itemId, item.num);
            });
            this.step = 0;
            this.build.resetActiveBtnIndex();
            player.log.addMsg(1092, produce[0].num, itemName, player.storage.getNumByItemId(itemInfo.itemId));
            player.trapTime = -1;
            Record.saveAll();
        }
        this._sendUpdageSignal();
    },
    getPlacedTxt: function (time) {
        return stringUtil.getString(1154);
    },
    _getUpdateViewInfo: function () {
        var iconName = "#build_action_" + this.id + "_0" + ".png";
        var time = this.config["makeTime"];
        if (IAPPackage.isHandyworkerUnlocked()) {
            time = Math.round(time * 0.7);
        }
        var action1Txt;
        if (!this.step) {
           action1Txt = stringUtil.getString(1155, time); 
        } else if (this.step == 1) {
            action1Txt = stringUtil.getString(6674, stringUtil.getString(1103011).title);
        } else {
            action1Txt = stringUtil.getString(1003);
        }
        var itemName = stringUtil.getString(this.config.produce[0].itemId).title;

        var hint, hintColor, items, action1Disabled;
        if (this.needBuild.level > player.room.getBuildLevel(this.needBuild.bid)) {
            hint = stringUtil.getString(1006, player.room.getBuildName(this.needBuild["bid"], this.needBuild["level"]));
            hintColor = cc.color.RED;
            action1Disabled = true;
        } else if (this.isActioning) {
            if (this.step == 1) {
                hint = stringUtil.getString(1154);
                if (player.storage.validateItem(1103011, 1)){
                    action1Disabled = false;
                } else {
                    action1Disabled = false;
                }
            } else {
                hint = stringUtil.getString(1153);
                action1Disabled = true;
            }
            hintColor = cc.color.WHITE;
        } else {
            if (this.step == 2) {
                hint = stringUtil.getString(1009, itemName);
            } else {
                hint = "";
                var cost = this.config.cost;
                if (!player.validateItems(cost)) {
                    action1Disabled = true;
                }
                items = cost.map(function (itemInfo) {
                    return {
                        itemId: itemInfo.itemId,
                        num: itemInfo.num,
                        color: itemInfo.haveNum >= itemInfo.num ? cc.color.WHITE : cc.color.RED
                    };
                });
            }
        }
        var res = {
            iconName: iconName,
            hint: hint,
            hintColor: hintColor,
            items: items,
            action1: action1Txt,
            action1Disabled: action1Disabled,
            percentage: 0
        };
        return res;
    }
});

var BonfireBuildAction = BuildAction.extend({
    ctor: function (bid) {
        this._super(bid);
        this.config = utils.clone(buildActionConfig[this.id][0]);
        this.fuel = 0;
        this.pastTime = 0;
        this.startTime = null;
        this.fuelMax = this.config.max;
        this.timePerFuel = this.config["makeTime"] * 60;
        this.needBuild = {bid: this.id, level: 0};
    },
    clickIcon: function () {
        uiUtil.showBuildActionDialog(this.bid, 0);
    },
    clickAction1: function () {
        if (!uiUtil.checkVigour())
            return;
        if (player.validateItems(this.config.cost)) {
            if (this.fuel >= this.fuelMax) {
                uiUtil.showTinyInfoDialog(1134);
            } else {
                player.costItems(this.config.cost);

                this.addFuel();
            }
        } else {
            uiUtil.showTinyInfoDialog(1146);
        }
    },
    addFuelTimer: function () {
        var self = this;
        this.addTimer(this.timePerFuel, function () {
            self.fuel--;
            if (self.fuel > 0) {
                self.addFuelTimer();
            } else {
                //中断回复后,并不需要build resetActiveBtnIndex
                if (self.build) {
                    self.build.resetActiveBtnIndex();
                }
                //燃料用尽刷新温度
                player.updateTemperature();
            }
            Record.saveAll();
        }, this.startTime);
    },
    addFuel: function () {
        //燃料空的时候,注册timer
        if (this.fuel == 0) {
            this.addFuelTimer();
            this.build.setActiveBtnIndex(this.idx);
        }
        this.fuel++;

        player.updateTemperature();

        this._sendUpdageSignal();
        player.log.addMsg(1097);

        Record.saveAll();
    },
    save: function () {
        return {
            fuel: this.fuel,
            pastTime: this.pastTime,
            startTime: this.startTime
        };
    },
    restore: function (saveObj) {
        if (saveObj) {
            this.fuel = saveObj.fuel || 0;
            this.pastTime = saveObj.pastTime || 0;
            this.startTime = saveObj.startTime;
        }
        if (this.fuel > 0) {
            this.addFuelTimer();
        }
    },
    addTimer: function (time, endCb, startTime) {
        this.isActioning = true;
        var self = this;
        var tcb = cc.timer.addTimerCallback(new TimerCallback(time, this, {
            process: function (dt) {
                self.pastTime += dt;
                self.totalTime = self.fuel * self.timePerFuel;
                if (self.view) {
                    self.view.updatePercentage((self.totalTime - self.pastTime ) / self.totalTime * 100);
                }
            },
            end: function () {
                self.isActioning = false;
                self.pastTime = 0;
                self.startTime = null;

                if (endCb) {
                    endCb();
                }

                self._sendUpdageSignal();
            }
        }), startTime);
        this.startTime = tcb.startTime;
    },
    _getUpdateViewInfo: function () {
        var iconName = "#build_action_" + this.id + "_0" + ".png";

        var action1Txt = stringUtil.getString(1010);

        var hint, hintColor, items, action1Disabled;
        if (this.needBuild.level > player.room.getBuildLevel(this.needBuild.bid)) {
            hint = stringUtil.getString(1006, player.room.getBuildName(this.needBuild["bid"], this.needBuild["level"]));
            hintColor = cc.color.RED;
            action1Disabled = true;
        } else if (this.isActioning) {
            hint = stringUtil.getString(1012, this.fuel, Math.floor(this.fuel * this.config["makeTime"] / 60));
            hintColor = cc.color.WHITE;
        } else {
            hint = stringUtil.getString(1011);
            hintColor = cc.color.WHITE;
        }

        var res = {
            iconName: iconName,
            hint: hint,
            hintColor: hintColor,
            items: items,
            action1: action1Txt,
            action1Disabled: action1Disabled,
            percentage: 0
        };
        return res;
    }
});

var RestBuildAction = BuildAction.extend({
    ctor: function (bid, level) {
        this._super(bid);
        this.level = level >= 0 ? level : 0;
        cc.assert(this.level < buildActionConfig[this.id].length, "RestBuildAction buildActionConfig doesn't exist!");
        this.configs = utils.clone(buildActionConfig[this.id]);
        this.needBuild = {bid: this.id, level: 0};
        this.index = 0;
    },
    updateConfig: function () {
        var level = this.getCurrentBuildLevel();
        level = level >= 0 ? level : 0;
        this.config = this.configs[level][this.index];
    },
    clickIcon: function () {
        uiUtil.showBuildActionDialog(this.bid, this.index);
    },
    clickAction1: function () {
        if (!uiUtil.checkVigour())
            return;
        this.updateConfig();
        utils.emitter.emit("left_btn_enabled", false);
        this.build.setActiveBtnIndex(this.idx);
        //2. 制作
        var time = this.config["makeTime"];
        time *= 60;
        if (IAPPackage.isHandyworkerUnlocked()) {
            time = Math.round(time * 0.7);
        }
        var self = this;
        audioManager.playEffect(audioManager.sound.COFFEE_POUR);
        this.addTimer(time, time, function () {
            //1. cost成功
            player.costItems(self.config.cost);
            player.lastCoffeeTime = Number(cc.timer.time);
            self.config.cost.forEach(function (item) {
                Achievement.checkCost(item.itemId, item.num);
            });
            audioManager.playEffect(audioManager.sound.GOLP);
            player.applyEffect(self.config["effect"]);
            var itemInfo = self.config.cost[0];
            var itemName = stringUtil.getString(itemInfo.itemId).title;
            player.log.addMsg(1096, itemName, player.storage.getNumByItemId(itemInfo.itemId));
            self.build.resetActiveBtnIndex();
            utils.emitter.emit("left_btn_enabled", true);
            Record.saveAll();
        });
        this._sendUpdageSignal();
    },
    _getUpdateViewInfo: function () {
        this.updateConfig();
        var iconName = "#build_action_" + this.id + "_0" + ".png";
        var time = this.config["makeTime"];
        if (IAPPackage.isHandyworkerUnlocked()) {
            time = Math.round(time * 0.7);
        }
        var action1Txt = stringUtil.getString(1014, time);

        var hint, hintColor, items, action1Disabled;
        if (this.needBuild.level > player.room.getBuildLevel(this.needBuild.bid)) {
            hint = stringUtil.getString(1006, player.room.getBuildName(this.needBuild["bid"], this.needBuild["level"]));
            hintColor = cc.color.RED;
            action1Disabled = true;
        } else if (this.isActioning) {
            if (this.level === 1) {
                hint = stringUtil.getString(1016);
            } else if (this.level === 2) {
                hint = stringUtil.getString(1017);
            } else {
                hint = stringUtil.getString(1015);
            }
            hintColor = cc.color.WHITE;
            action1Disabled = true;
        } else {
            hint = "";
            var cost = this.config.cost;
            if (!player.validateItems(cost)) {
                action1Disabled = true;
            }
            items = cost.map(function (itemInfo) {
                return {
                    itemId: itemInfo.itemId,
                    num: itemInfo.num,
                    color: itemInfo.haveNum >= itemInfo.num ? cc.color.WHITE : cc.color.RED
                };
            });
        }
        var res = {
            iconName: iconName,
            hint: hint,
            hintColor: hintColor,
            items: items,
            action1: action1Txt,
            action1Disabled: action1Disabled,
            percentage: 0
        };
        return res;
    }
});

var DrinkBuildAction = BuildAction.extend({
    ctor: function (bid, level) {
        this._super(bid);
        this.level = level >= 0 ? level : 0;
        cc.assert(this.level < buildActionConfig[this.id].length, "DrinkBuildAction buildActionConfig doesn't exist!");
        this.configs = utils.clone(buildActionConfig[this.id]);
        this.needBuild = {bid: this.id, level: 0};
        this.index = 1;
    },
    updateConfig: function () {
        var level = this.getCurrentBuildLevel();
        this.level = level >= 0 ? level : 0;
        this.config = this.configs[this.level][this.index];
        this.config.cost = [{"itemId": 1105022, "num": player.alcoholPrice}];
    },
    clickIcon: function () {
        uiUtil.showBuildActionDialog(this.bid, this.index);
    },
    clickAction1: function () {
        if (!uiUtil.checkVigour())
            return;
        this.updateConfig();
        utils.emitter.emit("left_btn_enabled", false);
        this.build.setActiveBtnIndex(this.idx);
        //2. 制作
        var time = this.config["makeTime"];
        time *= 60;
        if (IAPPackage.isHandyworkerUnlocked()) {
            time = Math.round(time * 0.7);
        }
        var self = this;
        audioManager.playEffect(audioManager.sound.BOTTLE_OPEN);
        this.addTimer(time, time, function () {
            //1. cost成功
            player.costItems(self.config.cost);
            player.lastAlcoholTime = Number(cc.timer.time);
            self.config.cost.forEach(function (item) {
                Achievement.checkCost(item.itemId, item.num);
            });
            audioManager.playEffect(audioManager.sound.GOLP);
            var rand = Math.random();
            if (rand < 0.3 && player.alcoholPrice < 9) {
                player.alcoholPrice += 1;
            }
            player.applyEffect(self.config["effect"]);
            var itemInfo = self.config.cost[0];
            var itemName = stringUtil.getString(itemInfo.itemId).title;
            player.log.addMsg(1309, itemName, player.storage.getNumByItemId(itemInfo.itemId));
            self.build.resetActiveBtnIndex();
            utils.emitter.emit("left_btn_enabled", true);
            Record.saveAll();
        });
        this._sendUpdageSignal();
    },
    _getUpdateViewInfo: function () {
        this.updateConfig();
        var iconName = "#build_action_" + this.id + "_1" + ".png";
        var time = this.config["makeTime"];
        if (IAPPackage.isHandyworkerUnlocked()) {
            time = Math.round(time * 0.7);
        }
        var action1Txt = stringUtil.getString(1308, time);

        var hint, hintColor, items, action1Disabled;
        if (this.needBuild.level > player.room.getBuildLevel(this.needBuild.bid)) {
            hint = stringUtil.getString(1006, player.room.getBuildName(this.needBuild["bid"], this.needBuild["level"]));
            hintColor = cc.color.RED;
            action1Disabled = true;
        } else if (this.isActioning) {
            if (this.level === 1) {
                hint = stringUtil.getString(1306);
            } else if (this.level === 2) {
                hint = stringUtil.getString(1307);
            } else {
                hint = stringUtil.getString(1305);
            }
            hintColor = cc.color.WHITE;
            action1Disabled = true;
        } else {
            hint = "";
            var cost = this.config.cost;
            if (!player.validateItems(cost)) {
                action1Disabled = true;
            }
            items = cost.map(function (itemInfo) {
                return {
                    itemId: itemInfo.itemId,
                    num: itemInfo.num,
                    color: itemInfo.haveNum >= itemInfo.num ? cc.color.WHITE : cc.color.RED
                };
            });
        }
        var res = {
            iconName: iconName,
            hint: hint,
            hintColor: hintColor,
            items: items,
            action1: action1Txt,
            action1Disabled: action1Disabled,
            percentage: 0
        };
        return res;
    }
});

var BedBuildActionType = {
    SLEEP_1_HOUR: 1,
    SLEEP_4_HOUR: 2,
    SLEEP_ALL_NIGHT: 3
}
var BedBuildAction = BuildAction.extend({
    ctor: function (bid, level, bedBuildActionType) {
        this._super(bid);
        this.level = level >= 0 ? level : 0;
        cc.assert(this.level < buildActionConfig[this.id].length, "BedBuildAction buildActionConfig doesn't exist!");
        this.configs = utils.clone(buildActionConfig[this.id]);
        this.type = bedBuildActionType;
        this.needBuild = {bid: this.id, level: 0};
    },
    updateConfig: function () {
        var level = this.getCurrentBuildLevel();
        level = level >= 0 ? level : 0;
        this.config = this.configs[level];
    },
    clickIcon: function () {
        uiUtil.showBuildActionDialog(this.bid, this.type - 1);
    },
    clickAction1: function () {
        var time;
        this.updateConfig();
        switch (this.type) {
            case BedBuildActionType.SLEEP_1_HOUR:
                time = 1 * 60 * 60;
                break;
            case BedBuildActionType.SLEEP_4_HOUR:
                time = 4 * 60 * 60;
                break;
            case BedBuildActionType.SLEEP_ALL_NIGHT:
                time = cc.timer.getTimeFromNowToMorning();
                break;
        }
        var effect = this.config["effect"];
        var hours = time / 60 / 60;
        var totalEffect = {};
        for (var key in effect) {
            if (key.indexOf("_chance") === -1) {
                totalEffect[key] = Math.ceil(effect[key] * hours);
            } else {
                totalEffect[key] = effect[key];
            }
        }
        utils.emitter.emit("left_btn_enabled", false);
        this.build.setActiveBtnIndex(this.idx);
        //2. 制作
        //单位小时的影响
        player.sleep();
        var self = this;
        this.addTimer(time, time, function () {
            player.applyEffect(totalEffect);
            player.wakeUp();
            self.build.resetActiveBtnIndex();
            utils.emitter.emit("left_btn_enabled", true);
            Record.saveAll();
        });
        this._sendUpdageSignal();
        var currentTime = Number(cc.timer.time);
        currentTime -= player.lastCoffeeTime;
        if (currentTime <= 21600) {
            var hint = Math.ceil((21600 - currentTime) / 3600);
            player.log.addMsg(1324, hint);
        } else {
            player.log.addMsg(1098);
        }
    },
    _getUpdateViewInfo: function () {
        this.updateConfig();

        var iconName = "#build_action_" + this.id + "_" + (this.type - 1) + ".png";
        var action1Txt = stringUtil.getString(1018);

        var hint, hintColor, items, action1Disabled;
        if (this.needBuild.level > player.room.getBuildLevel(this.needBuild.bid)) {
            hint = stringUtil.getString(1006, player.room.getBuildName(this.needBuild["bid"], this.needBuild["level"]));
            hintColor = cc.color.RED;
            action1Disabled = true;
        } else if (this.isActioning) {
            hint = stringUtil.getString(1019);
            hintColor = cc.color.WHITE;
            action1Disabled = true;
        } else {
            hint = "";
            switch (this.type) {
                case BedBuildActionType.SLEEP_1_HOUR:
                    hint = stringUtil.getString(1144, 1);
                    break;
                case BedBuildActionType.SLEEP_4_HOUR:
                    hint = stringUtil.getString(1144, 4);
                    break;
                case BedBuildActionType.SLEEP_ALL_NIGHT:
                    hint = stringUtil.getString(1145);
                    break;
            }
            hintColor = cc.color.WHITE;
        }
        var res = {
            iconName: iconName,
            hint: hint,
            hintColor: hintColor,
            items: items,
            action1: action1Txt,
            action1Disabled: action1Disabled,
            percentage: 0
        };
        return res;
    }
});

var DogBuildAction = BuildAction.extend({
    ctor: function (bid) {
        this._super(bid);
        this.config = utils.clone(buildActionConfig[this.id][0]);
        this.needBuild = {bid: this.id, level: 0};
    },
    clickIcon: function () {
        uiUtil.showBuildActionDialog(this.bid, 0);     
    },
    clickAction1: function () {

    },
    addFuelTimer: function () {

    },
    addFuel: function () {

    },
    save: function () {
        return {
        };
    },
    restore: function (saveObj) {

    },
    addTimer: function (time, endCb, startTime) {

    },
    _getUpdateViewInfo: function () {

    }
});

var BombBuildAction = BuildAction.extend({
    ctor: function (bid) {
        this._super(bid);
        this.config = utils.clone(buildActionConfig[this.id][0]);
        this.needBuild = {bid: this.id, level: 0};
    },
    active: function () {
        player.isBombActive = true;
    },
    isActive: function () {
        return player.isBombActive;
    },
    clickIcon: function () {
        uiUtil.showBuildActionDialog(this.bid, 0);
    },
    clickAction1: function () {
        if (!uiUtil.checkVigour())
            return;
        if (this.isActive()) {
            uiUtil.showTinyInfoDialog(1304);
            return;
        }
        utils.emitter.emit("left_btn_enabled", false);
        this.build.setActiveBtnIndex(this.idx);
        //2. 制作
        var time = this.config["makeTime"];
        time *= 60;
        if (IAPPackage.isHandyworkerUnlocked()) {
            time = Math.round(time * 0.7);
        }
        var self = this;
        this.addTimer(time, time, function () {
            //1. cost成功
            player.costItems(self.config.cost);

            self.active();
            self.build.resetActiveBtnIndex();
            utils.emitter.emit("left_btn_enabled", true);
            Record.saveAll();
        });
        this._sendUpdageSignal();
    },
    _getUpdateViewInfo: function () {
        var iconName = "#build_action_" + this.id + "_0" + ".png";
        
        var time = this.config["makeTime"];
        if (IAPPackage.isHandyworkerUnlocked()) {
            time = Math.round(time * 0.7);
        }
        var action1Txt = stringUtil.getString(1303, time);
        var hint, hintColor, items, action1Disabled;
        if (this.needBuild.level > player.room.getBuildLevel(this.needBuild.bid)) {
            hint = stringUtil.getString(1006, player.room.getBuildName(this.needBuild["bid"], this.needBuild["level"]));
            hintColor = cc.color.RED;
            action1Disabled = true;
        } else if (this.isActioning) {
            hint = stringUtil.getString(1302);
            hintColor = cc.color.WHITE;
            action1Disabled = true;
        } else {
            hint = this.isActive() ? stringUtil.getString(1300) : stringUtil.getString(1301);
            var cost = this.config.cost;
            if (!player.validateItems(cost)) {
                action1Disabled = true;
            }
            items = cost.map(function (itemInfo) {
                return {
                    itemId: itemInfo.itemId,
                    num: itemInfo.num,
                    color: itemInfo.haveNum >= itemInfo.num ? cc.color.WHITE : cc.color.RED
                };
            });
        }
        var res = {
            iconName: iconName,
            hint: hint,
            hintColor: hintColor,
            items: items,
            action1: action1Txt,
            action1Disabled: action1Disabled,
            percentage: 0
        };
        return res;
    },
    save: function () {
        return {
            isActive: this.isActive
        };
    },
    restore: function (saveObj) {
        if (saveObj) {
            this.isActive = saveObj.isActive || false;
        }
    }
});