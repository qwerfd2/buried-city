var SectionTableView = cc.ScrollView.extend({
    ctor: function (size, id) {
        this.mycontainer = new cc.Layer();
        this._super(size, this.mycontainer);

        this.id = id;
        this.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.setBounceable(false);
        this.setClippingToBounds(true);

        this.setDelegate(this);

        this.inited = false;
        return true;
    },

    updateView: function (data, needGuide) {
        var offsetPos = this.getContentOffset();

        this.data = data;
        this.mycontainer.removeAllChildren();

        var totalHeight = 0;
        var self = this;
        this.data.forEach(function (sectionData) {
            if (sectionData.itemList.length > 0) {
                var section = new ItemSection(self, sectionData.title, sectionData.itemList, self.id, needGuide);
                sectionData.node = section;
                totalHeight += section.getContentSize().height;
            }
        });

        this.setContentSize(this.getViewSize().width, totalHeight);

        this.data.forEach(function (sectionData) {
            var section = sectionData.node;
            if (section) {
                section.setAnchorPoint(0.5, 1);
                section.setPosition(self.mycontainer.getContentSize().width / 2, totalHeight);
                self.mycontainer.addChild(section);
                totalHeight -= section.getContentSize().height;
            }
        });

        this.setContentOffset(cc.p(0, this.getViewSize().height - this.mycontainer.getContentSize().height));

        if (this.inited) {
            var offsetPos2 = this.getContentOffset();
            if (offsetPos.y <= 0) {
                offsetPos2.y = offsetPos.y;
            }
            this.setContentOffset(offsetPos2);
        } else {
            this.inited = true;
        }
    },

    scrollViewDidScroll: function (view) {
    },
    scrollViewDidZoom: function (view) {
        var offset = view.getContentOffset();

        offset = this.clampOffset(offset);
        view.setContentOffset(offset);
    },
    getActiveRect: function () {
        var touchPos = this.convertToWorldSpace(this.getPosition());
        return cc.rect(touchPos.x, touchPos.y, this.getViewSize().width, this.getViewSize().height);
    }
});

var ItemCell = cc.Node.extend({
    ctor: function (scrollView, storageCell, id, needGuide) {
        this._super();

        this.scrollView = scrollView;
        this.storageCell = storageCell;
        this.id = id;
        this.needGuide = needGuide;
        this.setContentSize(84, 84);
        var bgName = "#item_bg.png";
        if (storageCell.item.getType(0) === ItemType.EQUIP && storageCell.item.getType(1) !== ItemType.OTHER) {
            bgName = "#item_equip_bg.png";
        }
        this.btn = new TableViewButton(this.scrollView, {normal: bgName});
        this.btn.setClickListener(this, this.onItemClick);
        this.btn.setPosition(this.getContentSize().width / 2, this.getContentSize().height / 2);
        this.addChild(this.btn);

        var itemId = storageCell.item.id;
        var iconName = "icon_item_" + itemId + ".png";

        var iconFame = autoSpriteFrameController.getSpriteFrameFromSpriteName(iconName);
        if (!iconFame) {
            iconFame = autoSpriteFrameController.getSpriteFrameFromSpriteName("icon_item_1101051.png");
        }
        var icon = autoSpriteFrameController.getSpriteFromSpriteName(iconFame);
        icon.setPosition(this.btn.getContentSize().width / 2, this.btn.getContentSize().height / 2);
        this.btn.addChild(icon);

        var numLabel = new cc.LabelTTF("" + storageCell.num, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
        numLabel.setPosition(this.btn.getContentSize().width - 4, 4);
        numLabel.setAnchorPoint(1, 0);
        this.btn.addChild(numLabel);
        numLabel.enableStroke(cc.color.BLACK, 2);

        if (player.getSetting("inGate", false) && userGuide.isStep(userGuide.stepName.GATE_ITEM) && userGuide.isItemCreate(itemId)) {
            uiUtil.createIconWarn(this.btn);
        } else if (player.getSetting("inStorage", false) && userGuide.isStep(userGuide.stepName.STORAGE_ITEM) && userGuide.isItemEat(itemId)) {
            uiUtil.createIconWarn(this.btn);
        }

        if (this.needGuide) {
            if (this.scrollView.id == "bottom" && userGuide.equipNeedGuide1(itemId)) {
                uiUtil.createIconWarn(this.btn);
            }
            if (this.scrollView.id == "top" && userGuide.equipNeedGuide2(itemId)) {
                userGuide.resetGuide2Step(itemId);
                this.scheduleOnce(function () {
                    utils.emitter.emit("equip_item_need_guide", itemId);
                }, 0.01);
            }
        }
    },
    onItemClick: function (sender, isLongPressed) {
        if (player.getSetting("inGate", false) && userGuide.isStep(userGuide.stepName.GATE_ITEM) && userGuide.isItemCreate(this.storageCell.item.id)) {
            userGuide.step();
        } else if (player.getSetting("inStorage", false) && userGuide.isStep(userGuide.stepName.STORAGE_ITEM) && userGuide.isItemEat(this.storageCell.item.id)) {
            userGuide.step();
            uiUtil.removeIconWarn(this.btn);
        }

        if (this.needGuide) {
            if (this.scrollView.id == "bottom" && userGuide.equipNeedGuide1(this.storageCell.item.id)) {
                uiUtil.removeIconWarn(this.btn);
                userGuide.guide1Step(this.storageCell.item.id);
            }
        }
        utils.emitter.emit("item_click", this.storageCell, this.id, isLongPressed);
    },
    setBtnEnable: function (enabled) {
        this.btn.setEnabled(enabled);
    }
});

var ItemSection = cc.Node.extend({
    ctor: function (scrollView, title, itemList, id, needGuide) {
        this._super();

        this.scrollView = scrollView;
        this.title = title;
        this.dataList = itemList;
        this.id = id;
        this.needGuide = needGuide;
        this.updateView();
    },
    updateView: function () {

        this.removeAllChildren();

        var cellWidth = 110;
        var cellHeight = 100;
        var titleHeight = this.title ? 50 : 0;

        var col = 5;
        var rol = Math.ceil(this.dataList.length / col);
        var cellTop = rol * cellHeight;

        this.setContentSize(cellWidth * col, cellTop + titleHeight);

        if (this.title) {
            var titleLabel = new cc.LabelTTF(this.title, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
            titleLabel.setPosition((100 - 84) / 2, cellTop + titleHeight / 2);
            titleLabel.setAnchorPoint(0, 0.5);
            this.addChild(titleLabel);
        }

        var self = this;
        this.dataList.forEach(function (storageCell, index) {
            var cell = new ItemCell(self.scrollView, storageCell, self.id, self.needGuide);
            cell.setAnchorPoint(0, 1);
            cell.setPosition((index % col) * cellWidth + (cellWidth - cell.getContentSize().width) / 2, cellTop - (Math.floor(index / col) * cellHeight));
            self.addChild(cell, 100 - Math.floor(index / col));
        });
    },
    setBtnEnable: function (enabled) {
        this.getChildren().forEach(function (c) {
            if (c instanceof ItemCell) {
                c.setBtnEnable(enabled);
            }
        });
    }
});

var TableViewButton = cc.Node.extend({
    ctor: function (scrollView, config) {
        this._super();

        this.scrollView = scrollView;

        this.normalSprite = autoSpriteFrameController.getSpriteFromSpriteName(config.normal);
        this.setContentSize(this.normalSprite.getContentSize());
        this.normalSprite.setPosition(this.height / 2, this.width / 2);
        this.addChild(this.normalSprite);

        this.setAnchorPoint(0.5, 0.5);
        this.boundingRect = cc.rect(0, 0, this.width, this.height);

        this.pressedTime = 0;
        this.isPressed = false;
        this.scheduleUpdate();

        var self = this;
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            touchBeganPos: null,
            onTouchBegan: function (touch, event) {
                this.touchBeganPos = touch.getLocation();
                this.activeRect = self.scrollView.getActiveRect();
                if (cc.rectContainsPoint(this.activeRect, this.touchBeganPos)) {
                    var localPos = self.convertToNodeSpace(this.touchBeganPos);
                    if (cc.rectContainsPoint(self.boundingRect, localPos)) {
                        self.isPressed = true;
                        self.pressedTime = 0;
                        self.animPressed();
                    }
                    return true;
                } else {
                    return false;
                }
            },
            onTouchMoved: function (touch, event) {
                if (self.isPressed) {
                    if (cc.pDistanceSQ(this.touchBeganPos, touch.getLocation()) > 200) {
                        self.isPressed = false;
                        self.animNormal();
                    }
                }
            },
            onTouchEnded: function (touch, event) {
                if (self.isPressed) {
                    self.isPressed = false;
                    self.animNormal();
                    var localPos = self.convertToNodeSpace(touch.getLocation());
                    if (cc.rectContainsPoint(self.boundingRect, localPos)) {
                        self.onClick();
                    }
                }
            }
        }), this);
    },
    setClickListener: function (target, cb) {
        this.target = target;
        this.cb = cb;
    },
    onClick: function (isLongPressed) {
        audioManager.playEffect(audioManager.sound.CLICK);
        if (this.target && this.cb) {
            this.cb.call(this.target, this, isLongPressed);
        }
    },
    animPressed: function () {
        this.runAction(cc.scaleTo(0.1, 1.2));
    },
    animNormal: function () {
        this.runAction(cc.scaleTo(0.1, 1));
    },
    update: function (dt) {
        if (this.isPressed) {
            this.pressedTime += dt;
            if (this.pressedTime >= 0.5) {
                this.onClick(true);
                this.isPressed = false;
                this.animNormal();
            }
        }
    }
});