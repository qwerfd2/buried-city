var BuildUpgradeType = {
    UPGRADABLE: 1,
    MAX_LEVEL: 2,
    CONDITION: 3,
    COST: 4
}
var Build = cc.Class.extend({
    ctor: function (bid, level, saveObj) {
        this.id = bid;
        this.level = level || 0;
        this.configs = utils.clone(buildConfig[this.id]);
        this.currentConfig = this.configs[this.level];
        this.isUpgrading = false;
        this.actions = [];
        this.initBuildActions();
        this.activeBtnIndex = -2;

        this.restore(saveObj);
    },
    initBuildActions: function () {
        var produceList = [];
        var l = 0;
        var self = this;
        for (var i = 0; i < this.configs.length; i++) {
            produceList = produceList.concat(this.configs[i].produceList.map(function (fid) {
                var formula = new Formula(fid, self.id);
                formula.needBuild = {bid: self.id, level: l};
                return formula;
            }));
            l++;
        }
        this.actions = produceList;
    },
    save: function () {
        var saveActions = {};
        this.actions.forEach(function (action) {
            saveActions[action.id] = action.save();
        });
        return {
            id: this.id,
            level: this.level,
            saveActions: saveActions,
            activeBtnIndex: this.activeBtnIndex
        };
    },
    restore: function (opt) {
        if (opt) {
            var saveActions = opt.saveActions;
            this.actions.forEach(function (action) {
                action.restore(saveActions[action.id]);
            });
            //fix bug: 1.1.7存档升上来时,此处无值导致生产线无法解锁的问题
            if (opt.activeBtnIndex !== undefined && opt.activeBtnIndex !== null) {
                this.activeBtnIndex = opt.activeBtnIndex;
            }
        }
    },
    needBuild: function () {
        return this.level < 0;
    },
    isMax: function () {
        return this.level >= this.configs.length - 1;
    },
    canUpgrade: function () {
        var res = {buildUpgradeType: BuildUpgradeType.UPGRADABLE};
        //1. 是否有下一级可升级
        if (this.level >= this.configs.length - 1) {
            res.buildUpgradeType = BuildUpgradeType.MAX_LEVEL;
            return res;
        }
        //2. 前置条件是否满足
        var nextLevel = this.level + 1;
        var condition = this.configs[nextLevel]["condition"];
        if (!player.room.isBuildExist(condition["bid"], condition["level"])) {
            res.buildUpgradeType = BuildUpgradeType.CONDITION;
            res.condition = condition;
            return res;
        }
        //3. cost是否满足
        var cost = this.configs[nextLevel]["cost"];
        if (!player.validateItems(cost)) {
            res.buildUpgradeType = BuildUpgradeType.COST;
            res.cost = cost;
            return res;
        }
        return res;
    },
    upgrade: function (processCb, endCb) {
        //1. cost成功
        var nextLevel = this.level + 1;
        var cost = this.configs[nextLevel]["cost"];
        player.costItems(cost);

        //2. 升级
        this.isUpgrading = true;
        var createTime = this.configs[nextLevel]["createTime"] || 0;
        createTime *= 60;
        if (IAPPackage.isHandyworkerUnlocked()) {
            createTime = Math.round(createTime * 0.7);
        }
        var pastTime = 0;
        var self = this;
        cc.timer.addTimerCallback(new TimerCallback(createTime, this, {
            process: function (dt) {
                pastTime += dt;
                processCb(pastTime / createTime * 100);
            },
            end: function () {
                self.isUpgrading = false;
                self.afterUpgrade();
                endCb();
                player.log.addMsg(1089, player.room.getBuildCurrentName(self.id));
            }
        }));
        cc.timer.accelerateWorkTime(createTime);
        this.setActiveBtnIndex(-1);
        utils.emitter.emit("build_node_update");

        audioManager.playEffect(audioManager.sound.BUILD_UPGRADE);
    },
    afterUpgrade: function () {
        this.level++;
        this.currentConfig = this.configs[this.level];
        this.resetActiveBtnIndex();
        Record.saveAll();
    },
    getUpgradeConfig: function () {
        var nextLevel = this.level + 1;
        var config = this.configs[nextLevel];
        if (config) {
            var upgradeTime = config["createTime"];
            var upgradeCost = config["cost"];
            return {
                level: nextLevel,
                upgradeTime: upgradeTime,
                upgradeCost: upgradeCost
            };
        } else {
            return null;
        }
    },
    getBuildActions: function () {
        this.actions.forEach(function (f) {
            if (f.id === 1405024) {
                f.purchaseId = 105;
                f.isLocked = false;
            } else if (f.id === 1404024) {
                f.purchaseId = 106;
                f.isLocked = false;
            }
        });

        var actions = this.actions.filter(function (f) {
            return true;
        });

        actions = actions.filter(function (f) {
            return true;
        });
        return actions;
    },
    setActiveBtnIndex: function (index) {
        this.activeBtnIndex = index;
    },
    resetActiveBtnIndex: function () {
        this.activeBtnIndex = -2;
    },
    anyBtnActive: function () {
        return this.activeBtnIndex !== -2;
    },
    needWarn: function () {
        var res = this.canUpgrade();
        var canUpgrade = res.buildUpgradeType === BuildUpgradeType.UPGRADABLE;
        var replacedSuccess = this.actions.some(function (action) {
            return action.step === 2 && !action.isActioning;
        });
        var canMake = this.actions.some(function (action) {
            return action.step === 0 && !action.isActioning && action.canMake();
        });
        var isActioning = this.actions.some(function (action) {
            return action.isActioning;
        });

        var obj = {
            upgrade: canUpgrade,
            make: canMake,
            take: replacedSuccess
        };
        if (isActioning) {
            obj.upgrade = false;
            obj.make = false;
            obj.take = false;
        }
        return obj;
    }
});

var TrapBuild = Build.extend({
    ctor: function (bid, level, saveObj) {
        this._super(bid, level, saveObj);
    },
    initBuildActions: function () {
        var action = new TrapBuildAction(this.id);
        this.actions.push(action);
    }
});

var SafeBuild = Build.extend({
    ctor: function (bid, level, saveObj) {
        this._super(bid, level, saveObj);
    },
    initBuildActions: function () {
    },
    isActive: function () {
        return this.level >= 0;
    }
});

var DogBuild = Build.extend({
    ctor: function (bid, level, saveObj) {
        this._super(bid, level, saveObj);
    },
    initBuildActions: function () {
    },
    isActive: function () {
        return player.isDogActive() && this.level >= 0 && !player.dogState;
    }
});

var RestBuild = Build.extend({
    ctor: function (bid, level) {
        this._super(bid, level);
    },
    initBuildActions: function () {
        var action1 = new RestBuildAction(this.id, this.level);
        this.actions.push(action1);
        var action2 = new DrinkBuildAction(this.id, this.level);
        this.actions.push(action2);
    },
    restore: function (opt) {
    }
});

var BedBuild = Build.extend({
    ctor: function (bid, level) {
        this._super(bid, level);
    },
    initBuildActions: function () {
        for (var type in BedBuildActionType) {
            var action = new BedBuildAction(this.id, this.level, BedBuildActionType[type]);
            this.actions.push(action);
        }
    },
    restore: function (opt) {
    }
});

var BonfireBuild = Build.extend({
    ctor: function (bid, level, saveObj) {
        this._super(bid, level, saveObj);
    },
    initBuildActions: function () {
        var action = new BonfireBuildAction(this.id);
        this.actions.push(action);
    },
    isActive: function () {
        if (this.level >= 0) {
            return this.actions[0].fuel > 0;
        }
        return false;
    }
});

var BombBuild = Build.extend({
    ctor: function (bid, level) {
        this._super(bid, level);
    },
    initBuildActions: function () {
        var action = new BombBuildAction(this.id);
        this.actions.push(action);
    },
    restore: function (opt) {
    }
});

var ElectricStoveBuild = Build.extend({
    ctor: function (bid, level, saveObj) {
        this._super(bid, level, saveObj);
    },
    initBuildActions: function () {
    },
    isActive: function () {
        return player.map.getSite(WORK_SITE).isActive;
    }
});

var FridgeBuild = Build.extend({
    ctor: function (bid, level, saveObj) {
        this._super(bid, level, saveObj);
    },
    initBuildActions: function () {
    },
    isActive: function () {
        return player.map.getSite(WORK_SITE).isActive;
    }
});

var ElectricFenceBuild = Build.extend({
    ctor: function (bid, level, saveObj) {
        this._super(bid, level, saveObj);
    },
    initBuildActions: function () {
    },
    isActive: function () {
        return player.map.getSite(WORK_SITE).isActive;
    }
});

var Room = cc.Class.extend({
    ctor: function () {
        this.map = {};
    },
    initData: function () {
        //温棚
        this.createBuild(2, -1);
        //药盒
        this.createBuild(3, -1);
        //灶台
        this.createBuild(4, -1);
        //蒸馏器
        this.createBuild(6, -1);
        //野兔陷阱
        this.createBuild(8, -1);
        //椅子
        this.createBuild(10, -1);
        //狗舍
        this.createBuild(12, -1);
        //机床
        this.createBuild(16, -1);
        //雷区
        this.createBuild(17, 0);
        //电网
        this.createBuild(19, -1);
        //电炉
        this.createBuild(18, -1);
        //酒窖
        this.createBuild(7, -1);
        //栅栏
        this.createBuild(11, -1);
        //火炉
        this.createBuild(5, -1);
        //仓库
        this.createBuild(13, 0);
        //老式电台
        this.createBuild(15, -1);
        //Safe
        this.createBuild(20, -1);
        //Fridge
        this.createBuild(21, -1);
        //新手引导解锁
        //工具箱
        this.createBuild(1, 0);
        //大门
        this.createBuild(14, 0);
        //睡袋
        this.createBuild(9, -1);
    },
    save: function () {
        var saveObj = {};
        for (var bid in this.map) {
            saveObj[bid] = this.map[bid].save();
        }
        return saveObj;
    },
    restore: function (saveObj) {
        if (saveObj) {
            for (var bid in saveObj) {
                var obj = saveObj[bid];
                this.createBuild(bid, obj.level, obj);
            }
        } else {
            this.initData();
        }
    },
    isBuildExist: function (bid, level) {
        var build = this.map[bid];
        if (arguments.length == 1) {
            if (build) {
                return true;
            }
        } else {
            if (build && build.level >= level) {
                return true;
            }
        }
        return false;
    },
    createBuild: function (bid, level, obj) {
        var b;
        bid = Number(bid);
        level = Number(level);
        switch (bid) {
            case 5:
                b = new BonfireBuild(bid, level, obj);
                break;
            case 8:
                b = new TrapBuild(bid, level, obj);
                break;
            case 9:
                b = new BedBuild(bid, level, obj);
                break;
            case 10:
                b = new RestBuild(bid, level, obj);
                break;
            case 12:
                b = new DogBuild(bid, level, obj);
                break;
            case 17:
                b = new BombBuild(bid, level, obj);
                break;
            case 18:
                b = new ElectricStoveBuild(bid, level, obj);
                break;
            case 19:
                b = new ElectricFenceBuild(bid, level, obj);
                break;
            case 20:
                b = new SafeBuild(bid, level, obj);
            case 21:
                b = new FridgeBuild(bid, level, obj);
            default :
                b = new Build(bid, level, obj);
                break;
        }
        this.map[bid] = b;
    },
    getBuild: function (bid) {
        return this.map[bid];
    },
    getBuildName: function (bid, level) {
        return stringUtil.getString(bid + "_" + level).title;
    },
    getBuildLevel: function (bid) {
        return this.getBuild(bid).level;
    },
    getBuildCurrentName: function (bid) {
        var level = this.getBuildLevel(bid);
        if (level < 0)
            level = 0;
        return this.getBuildName(bid, level);
    },
    forEach: function (action) {
        for (var bid in this.map) {
            action(this.map[bid]);
        }
    }
});