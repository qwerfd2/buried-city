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
        if (!Record.getCity()) {
            this.bg = new cc.Sprite("res/new/map_bg_new.png");
        } else {
            this.bg = new cc.Sprite("res/new/map_bg.png");
        }
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
        var time = distance / this.actor.getMaxVelocity();
        var okFunc = function () {
            entity.setHighlight(true);
            cc.timer.accelerate(time, player.storage.validateItem(1306001, 1) ? 2 : 3);
            player.log.addMsg(1112, entity.baseSite.getName());
            self.makeLine(startPos, endPos);
            self.actor.move(endPos, function () {
                self.enterEntity(entity);
                player.totalDistance += Math.round(distance);
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
                uiUtil.showHomeDialog(entity, time, okFunc, cancelFunc);
            } else {
                uiUtil.showSiteDialog(entity, time, okFunc, cancelFunc);
            }
        } else {
            uiUtil.showNpcInMapDialog(entity, time, okFunc, cancelFunc);
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
                } else if (baseSite.id == WORK_SITE) {
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

        this.MAX_VELOCITY = 97 / (1 * 60 * 60 ) * 0.8 * 1.1;
        //靴子效果
        this.MAX_VELOCITY_ENHANCE = this.MAX_VELOCITY * 0.25;
        //摩托车效果
        this.MAX_VELOCITY_ENHANCE_MOTO = this.MAX_VELOCITY * 0.35;
        //战隼效果
        this.MAX_VELOCITY_ENHANCE_ZHANSUN = this.MAX_VELOCITY * 0.45;

        this.isMoving = false;
        this.targetPos = null;

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
    getMaxVelocity: function () {
        var v = this.MAX_VELOCITY;
        if (player.storage.getNumByItemId(1305044) > 0) {
            v += this.MAX_VELOCITY_ENHANCE_ZHANSUN;
        } else if (player.storage.getNumByItemId(1305034) > 0) {
            v += this.MAX_VELOCITY_ENHANCE_MOTO;
        }
        //靴子效果累加
        if (player.storage.getNumByItemId(1306001) > 0) {
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
            this.setPosition(cc.pAdd(pos, dtPos));
            player.map.updatePos(this.getPosition());
            if (cc.pDistanceSQ(this.targetPos, this.getPosition()) <= 10) {
                //到达终点
                this.setPosition(this.targetPos);
                player.map.updatePos(this.getPosition());

                this.isMoving = false;
                this.afterMove();
            } else {
                var distance = cc.pDistance(this.lastCheckPos, this.getPosition());
                var self = this;
                if (distance >= RandomBattleConfig.distance) {
                    this.paused = player.randomAttack(function () {
                        self.paused = false;
                    });
                    this.lastCheckPos = this.getPosition();
                }
            }
        }
    },
    move: function (pos, cb) {
        if (this.isMoving)
            return;
        this.maxVelocityThisTrip = this.getMaxVelocity();
        this.targetPos = pos;
        this.lastCheckPos = this.getPosition();
        this.cb = cb;
        this.beforeMove();
    },
    beforeMove: function () {
        this.isMoving = true;
    },
    afterMove: function () {
        this.isMoving = false;
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
            if (this.baseSite.id == 202) {
                iconName = "#site202.png";
            } else {
                iconName = "#site_" + this.baseSite.id + ".png";
            }
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

            if (this.baseSite.isActive) {
                var notifyIcon = autoSpriteFrameController.getSpriteFromSpriteName('icon_electric_active.png');
                notifyIcon.x = this.width - 10;
                notifyIcon.y = this.height - 10;
                notifyIcon.setScale(0.6);
                notifyIcon.setName('icon');
                this.addChild(notifyIcon);
            } else {
                var notifyIcon = autoSpriteFrameController.getSpriteFromSpriteName('icon_electric_inactive.png');
                notifyIcon.x = this.width - 10;
                notifyIcon.y = this.height - 10;
                notifyIcon.setScale(0.6);
                notifyIcon.setName('icon');
                this.addChild(notifyIcon);
            }
        }
    }
});