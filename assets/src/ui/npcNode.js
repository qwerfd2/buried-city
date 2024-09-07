var NpcNode = BottomFrameNode.extend({
    ctor: function (userData) {
        this._super(userData);
    },
    _init: function () {
        this.npc = player.npcManager.getNPC(this.userData);
        this.Increase = 0;
        this.setName(Navigation.nodeName.NPC_NODE);
        this.uiConfig = {
            title: this.npc.getName(),
            leftBtn: true,
            rightBtn: false
        };
        var leftEdge = 40;
        var rightEdge = this.bgRect.width - leftEdge;
        if (this.userData == 2 || this.userData == 4) {
            this.Increase = 5;
        }
        var self = this;
        this.heartNode = uiUtil.createHeartNode();
        this.heartNode.setAnchorPoint(1, 0.5);
        this.heartNode.x = rightEdge;
        this.heartNode.y = this.actionBarBaseHeight;
        this.heartNode.setName("heart");
        this.bg.addChild(this.heartNode);
        this.heartNode.updateView(this.npc.reputation);

        var digDes = autoSpriteFrameController.getSpriteFromSpriteName("#npc_dig_bg.png");
        digDes.setAnchorPoint(0.5, 1)
        digDes.setPosition(this.bgRect.width / 2, this.contentTopLineHeight - 20);
        this.bg.addChild(digDes);
        digDes.setName("dig_des");

        var dig = autoSpriteFrameController.getSpriteFromSpriteName("#npc_dig_" + this.npc.id + ".png");
        dig.x = digDes.width / 2;
        dig.y = digDes.height / 2;
        digDes.addChild(dig);

        var des = new cc.LabelTTF(this.npc.getDialog(), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(rightEdge - leftEdge, 0));
        des.setAnchorPoint(0.5, 1);
        des.setPosition(this.bgRect.width / 2, digDes.y - digDes.height - 20);
        this.bg.addChild(des);
        des.setName("des");
        des.setColor(cc.color.WHITE);
        this.desupdateView = function(str) {
           des.setString(str);
        }

        var have = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(260, 0), cc.TEXT_ALIGNMENT_CENTER);
        have.setAnchorPoint(0.5, 0);
        have.setPosition(this.bgRect.width / 4 - 33, 130);
        have.setColor(cc.color.GREEN);
        this.bg.addChild(have);
        have.setName("have");

        var btn1 = uiUtil.createCommonBtnWhite("", this, this.onClickBtn1);
        btn1.setPosition(have.x, 100);
        this.bg.addChild(btn1);
        btn1.setName("btn_1");

        this.updateViewAfterNpcNeed();

        var tradeItems = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        tradeItems.setAnchorPoint(0.5, 0);
        tradeItems.setPosition(this.bgRect.width / 4 * 2, 40);
        tradeItems.setColor(cc.color.GREEN);
        this.bg.addChild(tradeItems);
        tradeItems.setName("trade");
        var self = this;
        tradeItems.updateView = function () {
            var a = self.npc.storage.getItemSortNum();
            this.setString(stringUtil.getString(1137, a));
        };
        tradeItems.updateView();

        var btn2 = uiUtil.createCommonBtnWhite(stringUtil.getString(1040), this, this.onClickBtn2);
        btn2.setPosition(this.bgRect.width / 4 * 2, 100);
        this.bg.addChild(btn2);
        btn2.setName("btn_2");
        
        var stealLogBtn = new ImageButton("res/new/stealLogBtn.png");
        stealLogBtn.setPosition(this.bgRect.width / 4 * 3 + 68, 212);
        this.bg.addChild(stealLogBtn, 1);
        stealLogBtn.setClickListener(this, function(a) {
            uiUtil.StealLog(self.userData)
        });

        var alert = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        alert.setAnchorPoint(0.5, 0);
        alert.setPosition(this.bgRect.width / 4 * 3 + 33, 160);
        alert.setColor(cc.color(255, 0, 0, 255));
        this.bg.addChild(alert);

        alert.updateView = function() {
            var vaal = self.npc.Alert + self.Increase;
            alert.setString(stringUtil.getString(9009) + vaal);
        };

        var steal = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        steal.setAnchorPoint(0.5, 0);
        steal.setPosition(this.bgRect.width / 4 * 3 + 33, 130);
        steal.setColor(cc.color.GREEN);
        this.bg.addChild(steal);

        steal.updateView = function() {
            steal.setString(stringUtil.getString(9005) + player.Steal + "%");
        };

        var btn3 = uiUtil.createCommonBtnWhite(stringUtil.getString(9015), this, function() {
            if (!self.npc.isSteal) {
                return;
            }
            var a = player.bag.getCurrentWeight()
            var b = player.bag.getTotalWeight()
            if (a >= b) {//背包满了不可偷窃
                uiUtil.showTinyInfoDialog(stringUtil.getString(9008));
            } else {
                self.npc.isSteal = false;
                btn3.setEnabled(false);
                self.Steal();
                tradeItems.updateView();
                Record.saveAll();
            }
        });

        btn3.setPosition(steal.x, 100);
        this.bg.addChild(btn3);
        btn3.updateView = function() {
            var a = self.npc.storage.getItemSortNum();
            var b = self.npc.isSteal;
            var c = self.npc.reputation;
            btn3.setEnabled(a && b && c)
        };

        tradeItems.updateView();
        alert.updateView();
        steal.updateView();
        btn3.updateView();

        utils.emitter.on("Alert", function() {
            alert.updateView();
        });

        utils.emitter.on("Steal", function() {
            steal.updateView();
            btn3.updateView()
        });
    },
    
    Steal: function() {
        var arr = [];
        var ItemSortNum = this.npc.storage.getItemSortNum();
        var baseLine = (player.Steal - this.npc.Alert - this.Increase) / ItemSortNum;
        var self = this;
        var success = false;
        this.npc.storage.forEach(function(i, n) {
            var rand = 100;
            if (self.npc.id == 2) {
                rand = 120;
            }
            var b = utils.getRandomInt(0, rand);
            var am = utils.getRandomInt(1, n);
            var am2 = utils.getRandomInt(0, n);
            am = Math.max(am + am2, n);
            if (b <= baseLine) {
                success = true;
                if (itemConfig[i.id].weight == 0) {
                    self.npc.storage.decreaseItem(i.id, am);
                    player.bag.increaseItem(i.id, am, true);
                    arr.push({
                        itemId: i.id,
                        num: n
                    })
                } else {
                    var amount = 0;
                    for (var a = 0; a < am; a++) {
                        if (player.bag.validateItemWeight(i.id, 1)) {
                            self.npc.storage.decreaseItem(i.id, 1);
                            player.bag.increaseItem(i.id, 1, true);
                            amount++;
                        }
                    }
                    if (amount > 0) {
                        arr.push({
                            itemId: i.id,
                            num: amount
                        })
                    }
                }
            }
        });
        
        var time = cc.timer.getTimeNum();
        self.npc.log.push({
            ti: time,
            ar: arr
        })
        var bo = arr.length > 0;
        uiUtil.Steal(arr, success, bo, this.npc.getName());

        //偷窃成功
        if (success) {
            self.npc.changeAlert(1)
            this.desupdateView(stringUtil.getString(9006));
        } else { //失败
            if (!IAPPackage.isAllItemUnlocked()) {
                if (IAPPackage.isSocialEffectUnlocked()) {
                    self.npc.changeReputation(-1);
                } else {
                    self.npc.changeReputation(-2);
                }
            } 
            self.npc.changeAlert(2);
            this.heartNode.updateView(this.npc.reputation);
            this.desupdateView(stringUtil.getString(9007));
        }
    },
    
    updateViewAfterNpcNeed: function () {
        var needItemInfo = this.npc.getNeedItem();
        var needStr = stringUtil.getString(needItemInfo.itemId).title + stringUtil.getString(6661) + needItemInfo.num;

        var have = this.bg.getChildByName("have");
        have.setString(stringUtil.getString(1036, needStr) + ', ' + stringUtil.getString(1038, player.bag.getNumByItemId(needItemInfo.itemId)));

        var btn1 = this.bg.getChildByName("btn_1");
        btn1.setTitleForState(stringUtil.getString(1036, ""), cc.CONTROL_STATE_NORMAL);
        btn1.setEnabled(!this.npc.isReputationMax());
    },
    onClickBtn1: function () {
        this.npc.takeNeedItem();
        this.updateViewAfterNpcNeed();
        this.bg.getChildByName("trade").updateView();
        this.bg.getChildByName("heart").updateView(this.npc.reputation);
    },
    onClickBtn2: function () {
        this.forward(Navigation.nodeName.NPC_STORAGE_NODE, this.userData);
    },
    onEnter: function () {
        this._super();
        player.isAtBazaar = true;
        Record.saveAll();
    },
    onExit: function () {
        this._super();
        utils.emitter.off("Steal");
        utils.emitter.off("Alert");
        player.isAtBazaar = false;
        Record.saveAll();
    },

    onClickLeftBtn: function () {
        this.back();
    }
});