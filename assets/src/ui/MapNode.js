var MAP_IS_MOVING = false;
var MapNode = BottomFrameNode.extend({
    ctor: function (userData) {
        this._super(userData);
    },
    _init: function () {
        this.setName(Navigation.nodeName.MAP_NODE);
        this.uiConfig = {
            title: "",
            leftBtn: false,
            rightBtn: false
        };

        var mapView = new MapView(cc.size(this.bgRect.width - 12, this.bgRect.height - 12));
        mapView.setPosition((this.bgRect.width - mapView.getViewSize().width) / 2 + 1, 6);
        this.bg.addChild(mapView, 2);
    },
});

var MapView = cc.ScrollView.extend({
    ctor: function (size) {
        var container = new cc.Layer();
        this._super(size, container);
        this.bg = new cc.Sprite("res/new/map_bg_new.png");
        this.bg.setAnchorPoint(0, 0);
        this.bg.setName("name");
        container.addChild(this.bg);
        this.updateWeather(player.weather.weatherId);

        this.setContentSize(this.bg.getContentSize());

        this.setDirection(cc.SCROLLVIEW_DIRECTION_BOTH);
        this.setBounceable(false);
        this.setDelegate(this);

        this.actor = new Actor(this);
        this.actor.setPosition(player.map.pos);
        container.addChild(this.actor, 1);

        var self = this;
        this.entityList = [];

        player.map.forEach(function (baseSite) {
            self.createEntity(baseSite);
        });
        return true;
    },

    onEnter: function () {
        this._super();
        var self = this;
        utils.emitter.on("unlock_site", function (site) {
            self.createEntity(site);
        });
        this.func = this.createFuncOnWeatherChange();
        utils.emitter.on("weather_change", this.func);

        adHelper.addAdListener(this, function (adStatus) {
            self.entityList.forEach(function (e) {
                e.updateStatus();
            });
        });

        this.funcOnWorkSiteChange = this.createFuncOnWorkSiteChange();
        utils.emitter.on("onWorkSiteChange", this.funcOnWorkSiteChange);
    },
    onExit: function () {
        this._super();
        utils.emitter.off("unlock_site");
        utils.emitter.off("weather_change", this.func);

        adHelper.removeAdListener();

        utils.emitter.off("onWorkSiteChange", this.funcOnWorkSiteChange);
    },
    _updateAllStatus: function () {
        this.entityList.forEach(function (e) {
            e.updateStatus();
        });
    },
    createFuncOnWorkSiteChange: function () {
        var self = this;
        return function (isWorkSiteActive) {
            self._updateAllStatus();
        };
    },
    createFuncOnWeatherChange: function () {
        var self = this;
        return function (weatherId) {
            self.updateWeather(weatherId);
        };
    },
    updateWeather: function (weatherId) {
        var weatherBg = this.bg.getChildByName("weather");
        if (weatherBg) {
            weatherBg.removeFromParent();
        }
        if (weatherId != Weather.CLOUDY) {
            weatherBg = new cc.Sprite("res/new/weather_" + weatherId + ".png");
            weatherBg.setAnchorPoint(0, 0);
            weatherBg.setName("weather");
            this.bg.addChild(weatherBg);
        }
    },

    onEntityClick: function (entity) {
        if (this.actor.isMoving)
            return;

        var self = this;
        var startPos = this.actor.getPosition();
        var endPos = entity.baseSite.pos;
        var distance = cc.pDistance(startPos, endPos);
        var fuelNeed = Math.ceil(distance / 80);
        var canAfford = false;
        if (player.fuel >= fuelNeed) {
            canAfford = true;
        }
        var time = distance / this.actor.getMaxVelocity(canAfford);
        if ((!player.storage.validateItem(1305034, 1) && !player.bag.validateItem(1305034, 1)) || !player.useMoto) {
            fuelNeed = -1;
        }
        var okFunc = function () {
            entity.setHighlight(true);
            cc.timer.accelerate(time, player.storage.validateItem(1306001, 1) ? 2 : 3);
            player.log.addMsg(1112, entity.baseSite.getName());
            self.makeLine(startPos, endPos);
            self.actor.move(endPos, canAfford, function () {
                player.totalDistance += Math.round(distance);
                if (player.dogState) {
                    player.dogDistance += Math.round(distance);
                    //stub for future dog ideas - leveling mechanism for dog?
                }
                self.enterEntity(entity);
            });

            if (userGuide.isStep(userGuide.stepName.MAP_SITE_GO) && userGuide.isSite(entity.baseSite.id)) {
                userGuide.step();
            }

            if (userGuide.isStep(userGuide.stepName.MAP_SITE_HOME_GO) && entity.baseSite.id == HOME_SITE) {
                userGuide.step();
            }
        };

        var cancelFunc = function () {
            entity.setHighlight(false);
        };

        if (userGuide.isStep(userGuide.stepName.MAP_SITE) && userGuide.isSite(entity.baseSite.id)) {
            uiUtil.removeIconWarn(entity);
            userGuide.step();
        }

        if (userGuide.isStep(userGuide.stepName.MAP_SITE_HOME) && entity.baseSite.id == HOME_SITE) {
            uiUtil.removeIconWarn(entity);
            userGuide.step();
        }

        if (entity.baseSite instanceof Site) {
            if (entity.baseSite.id == HOME_SITE) {
                uiUtil.showHomeDialog(entity, time, fuelNeed, canAfford, okFunc, cancelFunc);
            } else {
                uiUtil.showSiteDialog(entity, time, fuelNeed, canAfford, okFunc, cancelFunc);
            }
        } else {
            uiUtil.showNpcInMapDialog(entity, time, fuelNeed, canAfford, okFunc, cancelFunc);
        }
    },

    enterEntity: function (entity) {
        if (this.pathLine) {
            this.pathLine.removeFromParent();
        }

        var mapNode = this.getParent().getParent();
        var baseSite = entity.baseSite;
        var nodeName;
        if (baseSite instanceof Site) {
            if (baseSite.id == HOME_SITE) {
                nodeName = Navigation.nodeName.HOME_NODE;
                player.log.addMsg(1111);
                player.trySteal();
            } else {
                if (baseSite.id == AD_SITE) {
                    nodeName = Navigation.nodeName.AD_SITE_NODE;
                } else if (baseSite.id == BOSS_SITE) {
                    nodeName = Navigation.nodeName.BOSS_SITE_NODE;
                } else if (baseSite.id == WORK_SITE || baseSite.id == GAS_SITE) {
                    nodeName = Navigation.nodeName.WORK_SITE_NODE;
                } else if (baseSite.id == BAZAAR_SITE) {
                    nodeName = Navigation.nodeName.BAZAAR_SITE_NODE;
                } else {
                    nodeName = Navigation.nodeName.SITE_NODE;
                }
                player.log.addMsg(1116, entity.baseSite.getName());
            }
        } else {
            nodeName = Navigation.nodeName.NPC_NODE;
            player.log.addMsg(1116, entity.baseSite.getName());
        }
        mapNode.forward(nodeName, baseSite.id);
        Record.saveAll();
    },

    locate: function (withAnim, cb) {
        var targetPos = this.actor.getPosition();
        targetPos = cc.pMult(targetPos, this.getZoomScale());
        var winCenterPos = cc.pSub(cc.p(cc.winSize.width / 2, cc.winSize.height / 2), this.getContentOffset());
        var vector = cc.pSub(targetPos, winCenterPos);
        var offset = this.getContentOffset();
        offset = cc.pSub(offset, vector);
        offset = this.clampOffset(offset);
        if (withAnim) {
            var animVelocity = 2000;
            var animTime = cc.pLength(vector) / animVelocity;
            this.setContentOffsetInDuration(offset, animTime);
            if (cb) {
                this.scheduleOnce(cb, animTime);
            }
        } else {
            this.setContentOffset(offset);
        }
    },

    follow: function (dtPos) {
        var offset = this.getContentOffset();
        offset = cc.pSub(offset, dtPos);
        offset = this.clampOffset(offset);

        var targetPos = this.actor.getPosition();
        targetPos = cc.pMult(targetPos, this.getZoomScale());
        var winCenterPos = cc.pSub(cc.p(cc.winSize.width / 2, cc.winSize.height / 2), this.getContentOffset());
        if (cc.pDistanceSQ(targetPos, winCenterPos) <= 5) {
            this.setContentOffset(offset);
        }
    },

    scrollViewDidScroll: function (view) {
    },
    
    scrollViewDidZoom: function (view) {
        var offset = view.getContentOffset();
        offset = this.clampOffset(offset);
        view.setContentOffset(offset);
    },
    clampOffset: function (offset) {
        var scale = this.getZoomScale();
        var newOffset = cc.pClamp(offset, cc.p(cc.winSize.width - this.getContentSize().width * scale, cc.winSize.height - this.getContentSize().height * scale), cc.p(0, 0));
        return newOffset;
    },
    createEntity: function (baseSite) {
        var n = new Entity(baseSite, this);
        this.addChild(n);
        this.entityList.push(n);
        n.setClickListener(this, this.onEntityClick);
    },
    makeLine: function (startP, endP) {
        this.pathLine = new cc.Node();
        this.pathLine.setPosition(startP);
        var v = cc.pSub(endP, startP);
        var length = cc.pLength(v);
        var lineSpriteFrame = new cc.Sprite("res/new/map_line.png");
        var w = lineSpriteFrame.getContentSize().width;
        var num = Math.ceil(length / w);
        for (var i = 0; i < num; i++) {
            var l = new cc.Sprite("res/new/map_line.png");
            l.setAnchorPoint(0, 0.5);
            l.setPosition(i * w, 0);
            this.pathLine.addChild(l);
        }

        var radian = cc.pAngle(v, cc.p(1, 0));
        var angle = radian / Math.PI * 180;
        if (v.y >= 0) {
            angle = 360 - angle;
        }
        this.pathLine.setRotation(angle);
        this.addChild(this.pathLine);
    }
});

var Actor = cc.Node.extend({
    ctor: function (map) {
        this._super();

        this.map = map;
        var s = new cc.Sprite("res/new/map_actor.png");
        this.setContentSize(s.getContentSize());
        this.setAnchorPoint(0.5, 0.5);
        s.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        this.addChild(s);
        this.lastDistance = 0;
        this.MAX_VELOCITY = 97 / (60 * 60) * 0.88;
        //靴子效果
        this.MAX_VELOCITY_ENHANCE = this.MAX_VELOCITY * 0.5;
        //摩托车效果
        this.MAX_VELOCITY_ENHANCE_MOTO = this.MAX_VELOCITY * 2;
        this.isUsingMoto = false;
        this.isMoving = false;
        MAP_IS_MOVING = false;
        this.targetPos = null;
        this.sumDistance = 0;
        this.paused = false;
        this.lastCheckPos = null;

        var self = this;
        this.tcb = cc.timer.addTimerCallback(new TimerCallback(24 * 60 * 60, this, {
            process: function (dt) {
                self.updateActor(dt);
            },
            end: function () {
            }
        }, TimerManager.REPEAT_FOREVER));
    },
    getMaxVelocity: function (canAfford) {
        var v = this.MAX_VELOCITY;
        if ((player.storage.validateItem(1305034, 1) || player.bag.validateItem(1305034, 1)) && canAfford && player.useMoto) {
            v += this.MAX_VELOCITY_ENHANCE_MOTO;
            this.isUsingMoto = true;
        } else {
            this.isUsingMoto = false;
        }
        //靴子效果累加
        if (player.storage.validateItem(1306001, 1) || player.bag.validateItem(1306001, 1)) {
            v += this.MAX_VELOCITY_ENHANCE;
        }
        //天气影响
        v += this.MAX_VELOCITY * player.weather.getValue("speed");
        return v;
    },
    onExit: function () {
        this._super();
        cc.timer.removeTimerCallback(this.tcb);
    },
    updateActor: function (dt) {
        if (this.isMoving && !this.paused) {
            var vector = cc.pSub(this.targetPos, this.getPosition());
            this.velocity = cc.pMult(cc.pNormalize(vector), this.maxVelocityThisTrip);

            var pos = this.getPosition();
            var dtPos = cc.pMult(this.velocity, dt);
            var newPos = cc.pAdd(pos, dtPos);
            var dBetween = cc.pDistance(pos, newPos);
            this.lastDistance += Math.ceil(dBetween * 10);
            this.sumDistance += dBetween;
            this.totalFuel = 0;
            if (this.lastDistance >= 795 && this.isUsingMoto) {
                this.lastDistance -= 795;
                player.onFuelChange(-1);
                this.totalFuel += 1;
            }
            this.setPosition(newPos);
            player.map.updatePos(this.getPosition());
            var self = this;
            if (player.mapBattle.a) {
                this.paused = player.randomAttack(function () {
                    self.paused = false;
                }, true);
                this.lastCheckPos = this.getPosition();
            } else if (cc.pDistanceSQ(this.targetPos, this.getPosition()) <= 10) {
                //到达终点
                if (player.storage.validateItem(1306001, 1) || player.bag.validateItem(1306001, 1)) {
                    player.shoeTime += this.sumDistance;
                }
                this.setPosition(this.targetPos);
                player.map.updatePos(this.getPosition());
                if (this.sumDistance > 10) {
                    var rand = utils.getRandomInt(1, 79);
                    var distanceRounded = Math.ceil(this.sumDistance / 80);
                    if (rand < distanceRounded) {
                        var winnings = utils.getRandomInt(5, 15);
                        if (player.equip.isEquiped(1305075) && player.hasMotocycle()) {
                            var str = stringUtil.getString(8107) + "\n" + stringUtil.getString(9013);
                            uiUtil.showStolenDialog(str, "res/new/car.png", self, [{itemId: "gas", num: winnings}], false);
                            if (this.isUsingMoto) {
                                player.onFuelChange(winnings - 1);
                            } else {
                                player.onFuelChange(winnings);
                            }
                        } else if (player.equip.isEquiped(1305075)) {
                            //cannot extract due to no motorcycle
                            var str = stringUtil.getString(8107) + "\n" + stringUtil.getString(6670);
                            uiUtil.showStolenDialog(str, "res/new/car.png", self, {}, true);
                            if (this.isUsingMoto) {
                                player.onFuelChange(-1);
                            }
                        } else {
                            var str = stringUtil.getString(8107) + "\n" + stringUtil.getString(8108);
                            uiUtil.showStolenDialog(str, "res/new/car.png", self, {}, true);
                            if (this.isUsingMoto) {
                                player.onFuelChange(-1);
                            }
                        }
                    } else {
                        if (this.isUsingMoto) {
                            player.onFuelChange(-1);
                        }
                    }
                }
                this.isMoving = false;
                MAP_IS_MOVING = false;
                this.afterMove();         
            } else {
                var distance = cc.pDistance(this.lastCheckPos, this.getPosition());
                var pDistance;
                var self = this;
                var timeObj = cc.timer.formatTime();
                for (var i = 0; i < RandomBattleConfig.strength.length; i++) {
                    var strengthObj = RandomBattleConfig.strength[i];
                    if (timeObj.d >= strengthObj.time[0] && timeObj.d <= (strengthObj.time[1] ? strengthObj.time[1] : Number.MAX_VALUE)) {
                        pDistance = strengthObj.distance;
                        break;
                    }
                }
                if (distance >= pDistance) {
                    this.paused = player.randomAttack(function () {
                        self.paused = false;
                    }, false);
                    this.lastCheckPos = this.getPosition();
                }
            }
        }
    },
    move: function (pos, canAfford, cb) {
        if (this.isMoving)
            return;
        this.maxVelocityThisTrip = this.getMaxVelocity(canAfford);
        this.targetPos = pos;
        this.lastCheckPos = this.getPosition();
        this.cb = cb;
        this.beforeMove();
    },
    beforeMove: function () {
        this.isMoving = true;
        MAP_IS_MOVING = true;
    },
    afterMove: function () {
        this.isMoving = false;
        MAP_IS_MOVING = false;
        if (this.cb) {
            this.cb();
        }
    }
});

var Entity = Button.extend({
    ctor: function (baseSite) {

        this.baseSite = baseSite;

        var bg = autoSpriteFrameController.getSpriteFromSpriteName(this.baseSite.id == HOME_SITE ? "site_big_bg.png" : "#site_bg.png");
        this._super(bg.getContentSize());
        bg.setScale(0.8);
        bg.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        this.addChild(bg);

        var bg2 = autoSpriteFrameController.getSpriteFromSpriteName(this.baseSite.id == HOME_SITE ? "site_highlight_big_bg.png" : "#site_highlight_bg.png");
        bg2.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        bg2.setName("highlight");
        bg2.setScale(0.8);
        bg2.setVisible(false);
        this.addChild(bg2);

        var iconName, icon;
        if (this.baseSite instanceof Site) {
            iconName = "#site_" + this.baseSite.id + ".png";
        } else {
            iconName = "#npc_" + this.baseSite.id + ".png";
        }
        icon = autoSpriteFrameController.getSpriteFromSpriteName(iconName);
        icon.setScale(0.8);
        icon.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        this.addChild(icon);

        this.setAnchorPoint(0.5, 0.5);

        this.setPosition(this.baseSite.pos);

        if (userGuide.isStep(userGuide.stepName.MAP_SITE) && userGuide.isSite(this.baseSite.id)) {
            uiUtil.createIconWarn(this);
        }
        if (userGuide.isStep(userGuide.stepName.MAP_SITE_HOME) && this.baseSite.id == HOME_SITE) {
            uiUtil.createIconWarn(this);
        }
        this.updateStatus();
    },
    onPressed: function () {
        this.getChildByName("highlight").setVisible(true);
        this._super();
    },
    onRelease: function (isInBound) {
        this.getChildByName("highlight").setVisible(false);

        this._super(isInBound);
    },
    setHighlight: function (isHighlight) {
        this.getChildByName("highlight").setVisible(isHighlight);
    },
    updateStatus: function () {
        if (this.baseSite instanceof AdSite) {
            if (cc.sys.localStorage.getItem("ad") == "1") {
                var notifyIcon = autoSpriteFrameController.getSpriteFromSpriteName('icon_ad_show.png');
                notifyIcon.x = this.width - 10;
                notifyIcon.y = this.height - 10;
                notifyIcon.setScale(0.8);
                this.addChild(notifyIcon);
            }
        } else if (this.baseSite instanceof WorkSite) {
            var oldIcon = this.getChildByName('icon');
            if (oldIcon) {
                this.removeChildByName('icon');
            }
            var iconStr = "";
            if (this.baseSite.id == 204) {
                iconStr = "icon_electric_";     
            } else {
                iconStr = "icon_oil_";
            }
            if (this.baseSite.isActive) {
                iconStr += "active.png";
                var notifyIcon = autoSpriteFrameController.getSpriteFromSpriteName(iconStr);
                notifyIcon.x = this.width - 10;
                notifyIcon.y = this.height - 10;
                notifyIcon.setScale(0.6);
                notifyIcon.setName('icon');
                this.addChild(notifyIcon);
            } else {
                iconStr += "inactive.png"
                var notifyIcon = autoSpriteFrameController.getSpriteFromSpriteName(iconStr);
                notifyIcon.x = this.width - 10;
                notifyIcon.y = this.height - 10;
                notifyIcon.setScale(0.6);
                notifyIcon.setName('icon');
                this.addChild(notifyIcon);
            }
        }
    }
});