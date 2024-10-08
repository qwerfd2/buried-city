var uiUtil = uiUtil || {};

uiUtil.fontFamily = {
    normal: "FZDaHei-B02S"
};

uiUtil.fontSize = {
    //一般中号文字
    COMMON_1: 32,
    COMMON_2: 24,
    COMMON_3: 20
};

uiUtil.showChooseInfoDialog = function (purchaseId) {
    var strConfig = stringUtil.getString("p_" + purchaseId);
    var config = {
        title: {},
        content: {},
        action: {btn_1: {}}
    };
    config.content.des = strConfig.des + "\n\n" +strConfig.effect;
    config.title.title = strConfig.name;
    config.action.btn_1.txt = stringUtil.getString(1030);
    var d = new DialogSmall(config);
    d.show();
};

uiUtil.bazaarItem = function(itemInfo, target, cb) {
    var node = new cc.Node();

    var item = new Item(itemInfo.itemId);
    //背景
    var bg = autoSpriteFrameController.getSpriteFromSpriteName("frame_iap_bg_talent.png");
    node.setContentSize(bg.getContentSize());
    bg.x = node.width / 2;
    bg.y = node.height / 2;
    node.addChild(bg);
    //商品名
    as = stringUtil.getString(itemInfo.itemId).title;
    ad = player.storage.getNumByItemId(itemInfo.itemId);
    var off = IAPPackage.getPriceOff(itemInfo.itemId);
    ee = round(player.getPrice(itemInfo.itemId) * ((100 - off) / 100));
    var name = new cc.LabelTTF(as, uiUtil.fontFamily.normal, 26);
    name.x = bg.width / 2;
    name.y = bg.height / 1.15;
    name.color = cc.color.BLACK;
    node.addChild(name);
    
    var price = new ItemRichText([{itemId: "money", num: ee}], 120, 1, 0.5, cc.color.BLACK, uiUtil.fontSize.COMMON_2);
    price.x = bg.width / 6 - 30;
    price.y = bg.height / 6;
    price.setAnchorPoint(0, 1);
    node.addChild(price);
    //图标 1
    var icon = autoSpriteFrameController.getSpriteFromSpriteName("#dig_item_" + itemInfo.itemId + ".png");
    icon.x = bg.width / 2;
    icon.y = bg.height / 2;
    icon.setScale(0.5);
    node.addChild(icon);
    var btnSize = cc.size(bg.width - 20, bg.height - 20);
    var btnIcon = new ButtonWithPressed(btnSize);
    btnIcon.x = bg.width / 2;
    btnIcon.y = bg.height / 2;
    node.addChild(btnIcon);
    
    var offIcon = uiUtil.createSaleOffIcon();
    offIcon.x = node.width - 20;
    offIcon.y = 40;
    node.addChild(offIcon);
    offIcon.setVisible(false);
    offIcon.setName('offIcon');
    if (off > 0) {
        offIcon.setVisible(true);
        offIcon.updateOff(off);
    }
    
    btnIcon.setClickListener(this, function() {
        uiUtil.bazaarSell(itemInfo.itemId, false, itemInfo.amount, off);
    });
    return node;
};

uiUtil.bazaarSell = function(itemId, vvv, amount, discount) {
    var ee = player.getPrice(itemId);
    var config = {
        title: {},
        content: {
            log: true
        },
        action: {
            btn_1: {},
            btn_2: {}
        }
    };
    var strConfig = stringUtil.getString(itemId);
    config.title.title = strConfig.title;
    config.title.icon = "#icon_item_" + itemId + ".png";
    config.content.dig_des = "#dig_item_" + itemId + ".png";
    var Num = player.bag.getNumByItemId(itemId);
    var Nuw = (Num / Num || 0);

    config.action.btn_1.txt = stringUtil.getString(1031);
    var ss = "";
    var z = 1;
    if (vvv) {
        ss = stringUtil.getString(9033);
        config.title.txt_1 = cc.formatStr(stringUtil.getString("item_1").title.txt_1, Num);
        z = 0.8;
    } else {
        ss = stringUtil.getString(9034);
        config.title.txt_1 = cc.formatStr(stringUtil.getString("item_1").title.txt_1, amount);
        z = (100 - discount) / 100;
        Nuw = 1;
    }
    ee *= z;
    config.action.btn_2.txt = ss;
    var dialog = new DialogBig(config);
    config.action.btn_2.target = dialog;
    dialog.show();

    var oo = dialog.contentNode;
    var dig_des = dialog.contentNode.getChildByName('dig_des');
    var label1 = new cc.LabelTTF(stringUtil.getString(9022) + Nuw, uiUtil.fontFamily.normal, 25);
    label1.setAnchorPoint(0, 1);
    label1.setPosition(30, dialog.contentNode.width / 2 - 40);
    label1.setColor(cc.color.BLACK);
    oo.addChild(label1);

    var label2 = new cc.LabelTTF(ss + stringUtil.getString(9023) + round(ee) * Nuw, uiUtil.fontFamily.normal, 25);
    label2.setAnchorPoint(0, 1);
    label2.setPosition(label1.x, label1.y - 70);
    label2.setColor(cc.color.BLACK);
    label2.setName("label2");
    oo.addChild(label2);
    
    var info = new SpriteButton(cc.size(60, 60), 'icon_iap_info.png');
    info.x = dialog.contentNode.width - 40;
    info.y = dialog.contentNode.height - 40;
    info.setName("info");
    oo.addChild(info);
    info.setVisible(true);
    info.setClickListener(this, function () {
        uiUtil.showItemDialog(itemId, true, "bazaar");
    });

    var slider = new cc.ControlSlider("#slider_bg.png", "#slider_content.png", "#slider_cap.png");
    slider.setMinimumValue(Nuw);
    if (vvv) {
        slider.setMaximumValue(player.bag.getNumByItemId(itemId));
    } else {
        slider.setMaximumValue(amount);
    }
    slider.setPosition(oo.width / 2, label2.y - 70);
    slider.setAnchorPoint(0.5, 0.5);
    oo.addChild(slider);

    dialog.value = slider.getValue().toFixed(0);
    slider.addTargetWithActionForControlEvents(this, function(sender) {
        var value = sender.getValue().toFixed(0);
        var v = ee * value;
        dialog.value = value;
        label1.setString(stringUtil.getString(9022) + value);
        label2.setString(ss + stringUtil.getString(9023) + round(v));
    }, cc.CONTROL_EVENT_VALUECHANGED);

    config.action.btn_2.cb = function() {
        var a = (this.value ? this.value : 0);
        if (a > 0) {
            var v = a * ee;
            if (vvv) {
                bazaarSellDialog(vvv, stringUtil.getString(9024, a + "x " + config.title.title, round(v)), function() {
                    player.bag.decreaseItem(itemId, a);
                    player.onCurrencyChange(v);
                    player.log.addMsg(stringUtil.getString(9025, a + "x " + config.title.title, round(v)));
                    utils.emitter.emit("pay");
                    Record.saveAll();
                })
            } else {
                bazaarSellDialog(vvv, stringUtil.getString(9026, round(v), a + "x " + config.title.title), function() {
                    if (player.currency >= v) {
                        player.map.getSite(400).storage.increaseItem(itemId, a, false);
                        player.map.getSite(400).haveNewItems = true;
                        player.onCurrencyChange(-v);
                        for (var i = 0; i < player.shopList.length; i++) {
                            if (player.shopList[i].itemId == itemId) {
                                player.shopList[i].amount -= a;
                            }
                        }
                        player.log.addMsg(stringUtil.getString(9027, round(v), a + "x " + config.title.title));
                        utils.emitter.emit("pay");
                        Record.saveAll();
                    } else {
                        bazaarNotEnoughDialog(stringUtil.getString(9028, Number(player.currency.toFixed(2))));
                    };
                })
            }
        }
    }
};

uiUtil.Steal = function(arr, success, npcName) {
    var config = {
        title: {},
        content: {},
        action: {
            btn_1: {}
        }
    };
    config.action.btn_1.txt = stringUtil.getString(1073);
    var title = success ? stringUtil.getString(9011) : stringUtil.getString(9010);
    var des;
    var bo = arr.length > 0;
    if (success) {
        if (bo) {
            des = stringUtil.getString(9013);
        } else {
            des = stringUtil.getString(9036);
        }
    } else {
        des = stringUtil.getString(9012);
    }
    config.title.title = title;
    config.content.des = des;
    var dialog = new DialogTiny(config);
    dialog.autoDismiss = false;
    var co = dialog.contentNode;

    dialog.titleNode.getChildByName('title').setPosition(co.width / 15, co.height - 55);
    richText = new ItemRichText(arr, arr.length * 90, arr.length, 0.5, cc.color.BLACK, 22);
    richText.setVisible(success && bo);
    co.addChild(richText);
    var res = 1;
    if (IAPPackage.isAllItemUnlocked()) {
        res = 0;
    }
    var close = new cc.LabelTTF(npcName + stringUtil.getString(9014) + res, "", 25);
    close.setAnchorPoint(0, 1);
    close.setPosition(co.width / 12, co.height / 3)
    close.setColor(cc.color(255, 0, 0, 255));
    close.setVisible(!bo && !success);
    co.addChild(close);

    dialog.show();
}

uiUtil.StealLog = function(a) {
    var config = {
        title: {},
        content: {},
        action: {}
    };
    var npc = player.npcManager.getNPC(a);
    var npcName = npc.getName();
    var npcLog = npc.log;
    var lo = new DialogBig2(config);
    var logView = new LogView2(cc.size(436, 412));
    logView.setPosition(lo.x + 90, lo.y);
    logView.setName("logView");
    lo.contentNode.addChild(logView, 1);
    for (var i in npcLog) {
        logView.addLog(npcLog[i]);
    }

    var npcname = new ccui.Text(npcName, "", 16);
    npcname.setColor(cc.color(0, 0, 0, 255));
    npcname.setPosition(lo.width / 4, lo.y - 12);
    lo.contentNode.addChild(npcname, 1);
    
    var title = new ccui.Text(stringUtil.getString(9004), "", 24);
    title.setColor(cc.color(0, 0, 0, 255));
    title.setPosition(lo.width / 4, lo.y + 470);
    lo.contentNode.addChild(title, 1);
    lo.show();
};

uiUtil.createBtn2 = function (txt, target, cb) {
    var label = new cc.LabelTTF(txt, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
    var btn = new cc.ControlButton(label);
    btn.addTargetWithActionForControlEvents(target, function (sender) {
        audioManager.playEffect(audioManager.sound.CLICK);
        utils.invokeCallback(cb, sender);
    }, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
    btn.setAdjustBackgroundImage(false);
    return btn;
}

uiUtil.createSpriteBtn = function (spriteState, target, cb, rect) {
    cc.assert(spriteState.normal, "must have normal!");

    var fontInfo = spriteState.fontInfo || {};
    var txt = fontInfo.txt || "";
    var font = fontInfo.font || uiUtil.fontFamily.normal;
    var fontSize = fontInfo.fontSize || uiUtil.fontSize.COMMON_2;
    var color = fontInfo.color || cc.color.WHITE;

    fontSize -= 4;

    var normalSprite = autoSpriteFrameController.getScale9Sprite(spriteState.normal, rect);
    var label = new cc.LabelTTF(txt, font, fontSize, cc.size(normalSprite.width, 0), cc.TEXT_ALIGNMENT_CENTER);
    label.setColor(color);

    var btn = new cc.ControlButton(label, normalSprite);
    btn.setContentSize(normalSprite.getSprite().getContentSize());
    if (spriteState.pressed) {
        var pressedSprite = autoSpriteFrameController.getScale9Sprite(spriteState.pressed, rect);
        btn.setBackgroundSpriteForState(pressedSprite, cc.CONTROL_STATE_HIGHLIGHTED);
    }
    if (spriteState.disable) {
        var disableSprite = autoSpriteFrameController.getScale9Sprite(spriteState.disable, rect);
        btn.setBackgroundSpriteForState(disableSprite, cc.CONTROL_STATE_DISABLED);
    }
    if (spriteState.icon_state_1) {
        var iconState1 = autoSpriteFrameController.getSpriteFromSpriteName("#" + spriteState.icon_state_1);
        iconState1.setPosition(btn.getContentSize().width / 2, btn.getContentSize().height / 2);
        iconState1.tag = 1;
        btn.addChild(iconState1);
    }
    if (spriteState.icon_state_2) {
        var iconState2 = autoSpriteFrameController.getSpriteFromSpriteName("#" + spriteState.icon_state_2);
        iconState2.setPosition(btn.getContentSize().width / 2, btn.getContentSize().height / 2);
        iconState2.tag = 2;
        btn.addChild(iconState2);
        btn.isRadio = true;
        btn.isSelected = false;
        iconState2.setVisible(false);

        btn.changeRadio = function (seleted) {
            this.isSelected = seleted;
            if (seleted) {
                iconState1.setVisible(false);
                iconState2.setVisible(true);
            } else {
                iconState1.setVisible(true);
                iconState2.setVisible(false);
            }
        }
    }

    btn.addTargetWithActionForControlEvents(target, function (sender) {
        if (sender.isRadio) {
            sender.isSelected = !sender.isSelected;
            sender.changeRadio(sender.isSelected);
        }
        audioManager.playEffect(audioManager.sound.CLICK);
        cb.call(target, sender);
    }, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
    btn.setAdjustBackgroundImage(false);
    return btn;
}

uiUtil.createCommonBtnBlack = function (txt, target, cb) {
    var btn = uiUtil.createSpriteBtn({
        normal: "btn_common_black_normal.png",
        fontInfo: {txt: txt, fontSize: uiUtil.fontSize.COMMON_2}
    }, target, cb);
    btn.setTitleColorForState(cc.color.WHITE, cc.CONTROL_STATE_NORMAL);
    btn.setTitleColorForState(cc.color.GRAY, cc.CONTROL_STATE_DISABLED);
    return btn;
}

uiUtil.createSmallBtnBlack = function (txt, target, cb) {
    var btn = uiUtil.createSpriteBtn({
        normal: "btn_dark_short.png",
        fontInfo: {txt: txt, fontSize: uiUtil.fontSize.COMMON_2}
    }, target, cb);
    btn.setTitleColorForState(cc.color.WHITE, cc.CONTROL_STATE_NORMAL);
    btn.setTitleColorForState(cc.color.GRAY, cc.CONTROL_STATE_DISABLED);
    return btn;
}

uiUtil.createCommonBtnWhite = function (txt, target, cb) {
    var btn = uiUtil.createSpriteBtn({
        normal: "btn_common_white_normal.png",
        fontInfo: {txt: txt, fontSize: uiUtil.fontSize.COMMON_2}
    }, target, cb);
    btn.setTitleColorForState(cc.color.BLACK, cc.CONTROL_STATE_NORMAL);
    btn.setTitleColorForState(cc.color.GRAY, cc.CONTROL_STATE_DISABLED);
    return btn;
}

uiUtil.createBigBtnWhite = function (txt, target, cb) {
    var btn = uiUtil.createSpriteBtn({
        normal: "btn_big_white_normal.png",
        fontInfo: {txt: txt, fontSize: uiUtil.fontSize.COMMON_1}
    }, target, cb);
    btn.setTitleColorForState(cc.color.BLACK, cc.CONTROL_STATE_NORMAL);
    btn.setTitleColorForState(cc.color.GRAY, cc.CONTROL_STATE_DISABLED);
    return btn;
};

uiUtil.createToolBtn = function (target, cb) {
    var btn = uiUtil.createSpriteBtn({
        normal: "btn_tool.png"
    }, target, cb);
    return btn;
}

uiUtil.createStatusBtn = function (txt, target, cb) {
    var label = new cc.LabelTTF(txt, "", 20);
    var btn = new cc.ControlButton(label);
    btn.label = label;
    btn.addTargetWithActionForControlEvents(target, function (sender) {
        audioManager.playEffect(audioManager.sound.CLICK);
        utils.invokeCallback(cb, sender);
    }, cc.CONTROL_EVENT_TOUCH_UP_INSIDE);
    return btn;
}

uiUtil.createCommonToolIcon = function (contentIconName, target, cb) {
    var btn = uiUtil.createSpriteBtn({normal: "build_icon_bg.png"}, target, cb);
    var s = autoSpriteFrameController.getSpriteFromSpriteName(contentIconName);
    s.setPosition(btn.getContentSize().width / 2, btn.getContentSize().height);
    btn.addChild(s);
}
uiUtil.createCommonListItem = function (clickIcon, action1, action2) {
    var bgNode = new cc.Node();
    bgNode.setContentSize(600, 100);
    var iconBg = uiUtil.createSpriteBtn({normal: "build_icon_bg.png"}, clickIcon.target, clickIcon.cb);
    iconBg.setPosition(20 + iconBg.getContentSize().width / 2, bgNode.getContentSize().height / 2);
    iconBg.setName("iconBg");
    if (!clickIcon.cb) {
        iconBg.setVisible(false);
    }
    bgNode.addChild(iconBg);

    var hint = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(268, 0));
    hint.setAnchorPoint(0, 1);   
    hint.setName("hint");
    hint.setColor(cc.color.WHITE);

    var pbBg = autoSpriteFrameController.getSpriteFromSpriteName("#pb_bg.png");
    pbBg.setAnchorPoint(0, 0);
    pbBg.setName("pbBg");
    
    if (clickIcon.cb) {
        hint.setPosition(iconBg.getPositionX() + iconBg.getContentSize().width / 2 + 10, iconBg.getPositionY() + iconBg.getContentSize().height / 2);
        pbBg.setPosition(iconBg.getPositionX() + iconBg.getContentSize().width / 2 + 10, iconBg.getPositionY() - iconBg.getContentSize().height / 2);
    } else {
        hint.setPosition(70, bgNode.getContentSize().height / 2 + 20);
        pbBg.setPosition(70, bgNode.getContentSize().height / 2 - 20);
    }
    
    bgNode.addChild(hint);
    bgNode.addChild(pbBg);

    var pb = new cc.ProgressTimer(autoSpriteFrameController.getSpriteFromSpriteName("#pb.png"));
    pb.type = cc.ProgressTimer.TYPE_BAR;
    pb.midPoint = cc.p(0, 0);
    pb.barChangeRate = cc.p(1, 0);
    pb.setPosition(pbBg.getPositionX() + pbBg.getContentSize().width / 2, pbBg.getPositionY() + pbBg.getContentSize().height / 2);
    pb.setPercentage(0);
    pb.setName("pb");
    bgNode.addChild(pb);

    if (action1) {
        var action1 = uiUtil.createSpriteBtn({
            normal: "btn_common_white_normal.png",
            fontInfo: action1.fontInfo
        }, action1.target, action1.cb);
        action1.setTitleColorForState(cc.color.BLACK, cc.CONTROL_STATE_NORMAL);
        action1.setTitleColorForState(cc.color.GRAY, cc.CONTROL_STATE_DISABLED);
        action1.setZoomOnTouchDown(false);
        if (clickIcon.cb) {
            action1.setPosition(bgNode.getContentSize().width - 10 - action1.getContentSize().width / 2, bgNode.getContentSize().height / 2);
        } else {
            action1.setPosition(bgNode.getContentSize().width - 70 - action1.getContentSize().width / 2, bgNode.getContentSize().height / 2);
        }
        action1.setName("action1");
        bgNode.addChild(action1);
    }

    if (action2) {
        var action2 = uiUtil.createSpriteBtn({
            normal: "btn_common_white_normal.png",
            fontInfo: action2.fontInfo
        }, action2.target, action2.cb);
        action2.setTitleColorForState(cc.color.BLACK, cc.CONTROL_STATE_NORMAL);
        action2.setTitleColorForState(cc.color.GRAY, cc.CONTROL_STATE_DISABLED);
        action2.setZoomOnTouchDown(false);
        action2.setPosition(bgNode.getContentSize().width - 10 - action2.getContentSize().width / 2, bgNode.getContentSize().height / 2);
        action2.setName("action2");
        action2.setVisible(false);
        bgNode.addChild(action2);
    }
    bgNode.updateItemRichText = function (items) {
        var richText = bgNode.getChildByName("richText");
        if (richText) {
            richText.updateView(items);
        } else {
            richText = new ItemRichText(items, 268, 3, 0.3);
            richText.setName("richText");
            richText.setAnchorPoint(0, 1);
            if (clickIcon.cb) {
                richText.setPosition(iconBg.getPositionX() + iconBg.getContentSize().width / 2 + 10, iconBg.getPositionY() + iconBg.getContentSize().height / 2);
            } else {
                richText.setPosition(70, bgNode.getContentSize().height / 2 + 30);
            }

            bgNode.addChild(richText);
        }
        if (!richText.getChildByName("itemListBtn")) {
            var itemListBtn = new ButtonWithPressed(richText.getContentSize());
            itemListBtn.setAnchorPoint(0, 0);
            itemListBtn.setPosition(0, 0);
            richText.addChild(itemListBtn);
            itemListBtn.setClickListener(richText, function () {
                uiUtil.showItemListDialog(this.itemInfos);
            });
            itemListBtn.setName("itemListBtn");
        }

    };
    bgNode.updateView = function (newData) {
        if (!cc.sys.isObjectValid(bgNode))
            return;

        if (newData.iconName) {
            if (iconBg.getChildByName("icon")) {
                iconBg.removeChildByName("icon");
            }
            var icon = autoSpriteFrameController.getSpriteFromSpriteName(newData.iconName);
            icon.setName("icon");
            icon.setPosition(iconBg.getContentSize().width / 2, iconBg.getContentSize().height / 2);
            iconBg.addChild(icon);
        }

        if (newData.hint) {
            hint.setString(newData.hint);

            if (newData.hintColor) {
                hint.setColor(newData.hintColor);
            }
        } else {
            hint.setString("");
        }

        if (newData.items) {
            this.updateItemRichText(newData.items);
            //如果同时出现hint和items,items的位置下移
            if (newData.hint) {
                var richText = bgNode.getChildByName("richText");
                richText.setPosition(richText.getPositionX(), richText.getPositionY() - hint.getContentSize().height);
            }
        } else {
            if (bgNode.getChildByName("richText")) {
                bgNode.removeChildByName("richText");
            }
        }

        if (newData.action1) {
            action1.setVisible(true);
            action1.setTitleForState(newData.action1, cc.CONTROL_STATE_NORMAL);

            action1.setEnabled(!newData.action1Disabled);
        } else {
            action1.setVisible(false);
        }

        if (newData.action2) {
            action2.setTitleForState(newData.action2, cc.CONTROL_STATE_NORMAL);
            action2.setEnabled(!newData.action2Disabled);
        }

        if (newData.percentage != undefined) {
            pb.setPercentage(newData.percentage);
        }

        if (newData.btnIdx !== undefined) {
            if (iconBg) {
                iconBg.idx = newData.btnIdx;
            }
            if (action1) {
                action1.idx = newData.btnIdx;
            }
            if (action2) {
                action2.idx = newData.btnIdx;
            }
        }
    };

    bgNode.updatePercentage = function (percentage) {
        if (cc.sys.isObjectValid(pb))
            pb.setPercentage(percentage);
    };

    bgNode.updateHint = function (hintTxt) {
        hint.setString(hintTxt);
    };
    return bgNode;
}

uiUtil.showItemDialog = function (itemId, showOnly, source) {
    var item = new Item(itemId);
    var stringId = "item_1";
    if (item.isType(ItemType.TOOL, ItemType.FOOD)) {
        stringId = "item_2";
    } else if (item.isType(ItemType.TOOL, ItemType.MEDICINE)) {
        stringId = "item_3";
    } else if (item.isType(ItemType.TOOL, ItemType.BUFF) || itemId == 1106014) {
        stringId = "item_3";
    }
    var config = utils.clone(stringUtil.getString(stringId));
    var strConfig = stringUtil.getString(itemId);
    if (showOnly) {
        //元数据
        var metaConfig = utils.clone(stringUtil.getString("item_1"));
        config.action = metaConfig.action;
    } else {
        if (config.action.btn_2) {
            config.action.btn_2.target = null;
            config.action.btn_2.cb = function () {
                if (player.getSetting("inStorage", false) && userGuide.isStep(userGuide.stepName.STORAGE_EAT) && userGuide.isItemEat(itemId)) {
                    userGuide.step();
                }
                utils.emitter.emit("btn_1_click", itemId, source);
            };
        }
    }
    config.title.title = strConfig.title;
    config.title.icon = "#icon_item_" + itemId + ".png";
    var itemToShowEquipNeeded = [1305053, 1305075, 1305064];
    var itemToShowEquipNotNeeded = [1305034, 1305024, 1305023, 1306001];
    if (itemToShowEquipNeeded.indexOf(Number(itemId)) !== -1) {
        strConfig.des += "\n" + stringUtil.getString("equip_needed");
    } else if (itemToShowEquipNotNeeded.indexOf(Number(itemId)) !== -1) {
        strConfig.des += "\n" + stringUtil.getString("no_need_equip");
    }
    config.content.des = strConfig.des;
    config.content.dig_des = "#dig_item_" + itemId + ".png";
    var dialog = new DialogBig(config);
    var txt1 = dialog.titleNode.getChildByName("txt_1");
    var storage;
    if (player.isAtHome) {
        storage = player.storage;
        txt1.setString(cc.formatStr(txt1.getString(), storage.getNumByItemId(itemId)));
    } else if (player.isAtBazaar && source == "bazaar") {
        for (var i = 0; i < player.shopList.length; i++) {
            if (player.shopList[i].itemId == itemId) {
                txt1.setString(cc.formatStr(txt1.getString(), player.shopList[i].amount));
                break;
            }
        }
    } else {
        if (player.tmpBag) {
            storage = player.tmpBag;
        } else {
            storage = player.bag;
        }
        txt1.setString(cc.formatStr(txt1.getString(), storage.getNumByItemId(itemId)));
    }
   
    dialog.show();
    if (item.isType(ItemType.TOOL, ItemType.BUFF)) {
        var des = dialog.contentNode.getChildByName('des');
        var buffWarn = new cc.LabelTTF(stringUtil.getString(1299), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(dialog.rightEdge - dialog.leftEdge, 0));
        buffWarn.anchorX = 0;
        buffWarn.anchorY = 1;
        buffWarn.x = dialog.leftEdge;
        buffWarn.y = des.y - des.height - 20;
        dialog.contentNode.addChild(buffWarn, 1);
        buffWarn.setName("buffWarn");
        buffWarn.setColor(cc.color.RED);
    }

    if (player.getSetting("inStorage", false) && userGuide.isStep(userGuide.stepName.STORAGE_EAT) && userGuide.isItemEat(itemId)) {
        uiUtil.createIconWarn(dialog.actionNode.getChildByName("btn_2"));
    }
};

uiUtil.showGuideDialog = function(str, pic, target, isPicDown) {
    var config;
    if (!player.getSetting("step")) {
        config = {
            title: {},
            content: {},
            action: {
                btn_1: {},
                btn_2: {}
            }
        };
    } else {
        config = {
            title: {},
            content: {},
            action: {}
        };
    }

    config.title.title = "";
    config.content.des = str;
    config.content.dig_des = pic;
    if (!player.getSetting("step")) {
        config.action.btn_1.txt = stringUtil.getString(9000);
        config.action.btn_1.target = null;
        config.action.btn_1.cb = function() {
            player.setSetting("step", 30);
            player.buildWarn.setVisible(false);
            player.log.addMsg(stringUtil.getString(9001));
        };
        config.action.btn_2.txt = stringUtil.getString(9002);
    }
    var dialog = new DialogGuide(config, target, isPicDown);
    if (!player.getSetting("step")) {
        dialog.actionNode.getChildByName('btn_1').setPosition(120, 36);
        dialog.actionNode.getChildByName('btn_2').setPosition(dialog.contentNode.width - 120, 36);
    }
    dialog.titleNode.getChildByName('title').setPosition(dialog.contentNode.width / 2, dialog.contentNode.height + 66);
    dialog.show();
}

uiUtil.showStolenDialog = function (str, pic, target, itemList, isShow) {
    var config = {
        title: {},
        content: {}
    };
    config.title.title = "";
    config.content.des = str;
    config.content.dig_des = pic;
    var isSteal = false;
    if (pic == "res/new/stealPrompt.png") {
        isSteal = true;
    }
    var dialog = new DialogSteal(config, target, itemList, isShow, isSteal);
    dialog.show();
}

uiUtil.showBuildDialog = function (bid, level) {
    var config = utils.clone(stringUtil.getString("build"));
    var strConfig = stringUtil.getString(bid + "_" + level);
    config.title.title = strConfig.title;
    config.title.icon = "#build_" + bid + "_" + level + ".png";
    config.content.des = strConfig.des;
    config.content.dig_des = "#dig_build_" + bid + "_" + level + ".png";
    var dialog = new DialogBig(config);
    var log = dialog.contentNode.getChildByName("log");
    log.height = 130;

    var upgradeConfig = player.room.getBuild(bid).getUpgradeConfig();
    if (upgradeConfig) {

        var label = new cc.LabelTTF(cc.formatStr(config.content.log), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        label.setAnchorPoint(0, 1);
        label.setPosition(dialog.leftEdge, log.getContentSize().height - 10);
        label.setColor(cc.color.BLACK);
        log.addChild(label);

        var needItems = upgradeConfig.upgradeCost;
        var pass = player.validateItems(needItems);

        needItems = needItems.map(function (itemInfo) {
            return {
                itemId: itemInfo.itemId,
                num: itemInfo.num,
                color: itemInfo.haveNum >= itemInfo.num ? cc.color.BLACK : cc.color.RED
            };
        });

        var richText = new ItemRichText(needItems, dialog.rightEdge - dialog.leftEdge, 3, 0.5, cc.color.BLACK);
        richText.setName("richText")
        richText.setAnchorPoint(0, 1);
        richText.setPosition(dialog.leftEdge, label.getPositionY() - label.getContentSize().height - 10);
        log.addChild(richText);
    }
    dialog.show();
};

uiUtil.showBuildActionDialog = function (bid, index) {
    var config = utils.clone(stringUtil.getString("build"));
    var strConfig = stringUtil.getString("b_a_" + bid);
    //为喝酒加入的特例
    if (bid == 10 && index == 1) {
        strConfig = stringUtil.getString("b_a_" + bid + "_" + index);
    }
    config.title.title = strConfig.title;
    config.title.icon = "#build_action_" + bid + "_" + index + ".png";
    config.content.des = strConfig.des;
    var dialog = new DialogSmall(config);
    dialog.show();
};

uiUtil.showItemSliderDialog = function (itemId, storage, siteId, cb) {
    var item = new Item(itemId);
    var stringId = "item_1";
    if (item.isType(ItemType.TOOL, ItemType.FOOD)) {
        stringId = "item_2";
    } else if (item.isType(ItemType.TOOL, ItemType.MEDICINE)) {
        stringId = "item_3";
    }
    var config = utils.clone(stringUtil.getString(stringId));
    var strConfig = stringUtil.getString(itemId);
    var metaConfig = utils.clone(stringUtil.getString("item_1"));
    config.action = metaConfig.action;

    config.title.title = strConfig.title;
    config.title.icon = "#icon_item_" + itemId + ".png";
    config.content.des = strConfig.des;
    config.content.dig_des = "#dig_item_" + itemId + ".png";
    var totalNum = storage.getNumByItemId(itemId);
    config.title.title = stringUtil.getString(itemId).title;
    var string;
    if (itemId == "1305011" || itemId == "1105011" || itemId == "1305012") {
        string = stringUtil.getString(1028, 1);
    } else {
        string = stringUtil.getString(1028, itemConfig[itemId].weight);
    }
    config.title.txt_1 = string;
    config.title.txt_2 = stringUtil.getString(1029, "1/" + totalNum);
    config.action.btn_1.txt = stringUtil.getString(1030);
    var dialog = new DialogBig(config);
    config.action.btn_1.target = dialog;
    config.action.btn_1.cb = function () {
        cb(this.value ? this.value : 0);
    };
    var content = dialog.contentNode;

    if (siteId == 400) {
        var label = new cc.LabelTTF(stringUtil.getString(1326), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        label.setAnchorPoint(0, 1);
        label.setPosition(content.width / 6, 30);
        label.setColor(cc.color.RED);
        content.addChild(label);
    }

    var slider = new cc.ControlSlider("#slider_bg.png", "#slider_content.png", "#slider_cap.png");
    slider.setMinimumValue(1); // Sets the min value of range
    slider.setMaximumValue(totalNum); // Sets the max value of range
    slider.setPosition(content.width / 2, 40);
    slider.setAnchorPoint(0.5, 0.5);
    content.addChild(slider);

    dialog.value = slider.getValue().toFixed(0);
    // When the value of the slider will change, the given selector will be call
    slider.addTargetWithActionForControlEvents(this, function (sender) {
        var value = sender.getValue().toFixed(0);
        dialog.value = value;
        var valueStr = "";
        if (value < 10) {
            valueStr = " " + value;
        } else {
            valueStr += value;
        }
        var string;
        if (itemId == "1305011" || itemId == "1105011" || itemId == "1305012") {
            string = stringUtil.getString(1028, Math.ceil(0.02 * value));
        } else {
            string = stringUtil.getString(1028, value * itemConfig[itemId].weight)
        }
        dialog.titleNode.getChildByName("txt_1").setString(string);
        dialog.titleNode.getChildByName("txt_2").setString(stringUtil.getString(1029, valueStr + "/" + totalNum));
    }, cc.CONTROL_EVENT_VALUECHANGED);
    slider.setName("slider");
    dialog.show();
};

uiUtil.showNpcNeedHelpDialog = function (npc, noCb, yesCb, needRestore) {
    var config = {
        title: {},
        content: {log: true},
        action: {btn_1: {}, btn_2: {}}
    };
    config.title.title = npc.getName();
    config.title.txt = cc.timer.getTimeDayStr() + " " + cc.timer.getTimeHourStr();
    config.title.icon = "#icon_npc.png";
    config.title.heart = npc.reputation;
    if (needRestore) {
        config.title.heart++;
    }

    config.content.dig_des = "#npc_dig_" + npc.id + ".png";
    config.content.des = stringUtil.getString(1065);

    config.action.btn_1.txt = stringUtil.getString(1071);
    config.action.btn_1.target = npc;
    config.action.btn_1.cb = noCb;

    config.action.btn_2.txt = stringUtil.getString(1072);
    config.action.btn_2.target = npc;
    config.action.btn_2.cb = yesCb;

    var dialog = new NpcDialog(config);
    dialog.autoDismiss = false;
    var log = dialog.contentNode.getChildByName("log");
    log.height = 130;

    var label = new cc.LabelTTF(stringUtil.getString(1066), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
    label.setAnchorPoint(0, 1);
    label.setPosition(dialog.leftEdge, log.getContentSize().height - 10);
    label.setColor(cc.color.BLACK);
    log.addChild(label);

    var needItems = npc.getNeedHelpItems();
    var pass = player.validateItems(needItems);

    needItems = needItems.map(function (itemInfo) {
        return {
            itemId: itemInfo.itemId,
            num: itemInfo.num,
            color: itemInfo.haveNum >= itemInfo.num ? cc.color.BLACK : cc.color.RED
        };
    });

    var richText = new ItemRichText(needItems, dialog.rightEdge - dialog.leftEdge, 3, 0.5, cc.color.BLACK);
    richText.setName("richText")
    richText.setAnchorPoint(0, 1);
    richText.setPosition(dialog.leftEdge, label.getPositionY() - label.getContentSize().height - 10);
    log.addChild(richText);

    var btnYes = dialog.actionNode.getChildByName("btn_2");
    btnYes.setEnabled(pass);

    dialog.show();
    audioManager.playEffect(audioManager.sound.NPC_KNOCK);
};
uiUtil.showNpcSaleDialog = function (npc, noCb, yesCb, rid) {
    var needItems = npc.tradeItem;
    var price = npc.price;
    
    var config = {
        title: {},
        content: {log: true},
        action: {btn_1: {}, btn_2: {}}
    };
    config.title.txt = cc.timer.getTimeDayStr() + " " + cc.timer.getTimeHourStr();
    config.title.icon = "#icon_npc.png";
    if (rid != 0) {
        config.content.dig_des = "#npc_dig_" + npc.id + ".png";
        config.title.title = npc.getName();
    } else {
        config.content.dig_des = "#npc_dig_0.png";
        config.title.title = "???";
    }
    config.content.des = stringUtil.getString(1339, price);

    config.action.btn_1.txt = stringUtil.getString(1071);
    config.action.btn_1.target = npc;
    config.action.btn_1.cb = noCb;

    config.action.btn_2.txt = stringUtil.getString(1072);
    config.action.btn_2.target = npc;
    config.action.btn_2.cb = yesCb;
    var dialog = new DialogBig(config);
    dialog.autoDismiss = false;
    var log = dialog.contentNode.getChildByName("log");
    log.height = 130;

    var label = new cc.LabelTTF(stringUtil.getString(1066), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
    label.setAnchorPoint(0, 1);
    label.setPosition(dialog.leftEdge, log.getContentSize().height - 10);
    label.setColor(cc.color.BLACK);
    log.addChild(label);

    var pass = player.validateItems(needItems);

    needItems = needItems.map(function (itemInfo) {
        return {
            itemId: itemInfo.itemId,
            num: itemInfo.num,
            color: itemInfo.haveNum >= itemInfo.num ? cc.color.BLACK : cc.color.RED
        };
    });

    var richText = new ItemRichText(needItems, dialog.rightEdge - dialog.leftEdge, 3, 0.5, cc.color.BLACK);
    richText.setName("richText")
    richText.setAnchorPoint(0, 1);
    richText.setPosition(dialog.leftEdge, label.getPositionY() - label.getContentSize().height - 10);
    log.addChild(richText);

    var btnYes = dialog.actionNode.getChildByName("btn_2");
    btnYes.setEnabled(pass);

    dialog.show();
    audioManager.playEffect(audioManager.sound.NPC_KNOCK);
};
uiUtil.showNpcSendGiftDialog = function (npc) {
    var config = {
        title: {},
        content: {log: true},
        action: {btn_1: {}}
    };
    config.title.title = npc.getName();
    config.title.txt = cc.timer.getTimeDayStr() + " " + cc.timer.getTimeHourStr();
    config.title.icon = "#icon_npc.png";
    config.title.heart = npc.reputation;

    config.content.dig_des = "#npc_dig_" + npc.id + ".png";

    var gifts, isItem;
    if (npc.needSendGiftList["item"]) {
        isItem = true;
        gifts = npc.needSendGiftList["item"];
        delete npc.needSendGiftList["item"];

        var itemMap = {};
        gifts.forEach(function (item) {
            itemMap[item.itemId] = itemMap[item.itemId] || 0;
            itemMap[item.itemId] += Number.parseInt(item.num);
        });
        gifts = Object.keys(itemMap).map(function (itemId) {
            return {itemId: itemId, num: itemMap[itemId]};
        });

        config.content.des = stringUtil.getString(1068) + "\n" + stringUtil.getString(1069);
        gifts.forEach(function (gift) {
            player.log.addMsg(1103, gift.num, stringUtil.getString(gift.itemId).title, player.storage.getNumByItemId(gift.itemId));
        });
    } else {
        isItem = false;
        gifts = npc.needSendGiftList["site"];
        delete npc.needSendGiftList["site"];

        config.content.des = stringUtil.getString(1070);
        gifts.forEach(function (gift) {
            var siteName = stringUtil.getString("site_" + gift.siteId).name;
            config.content.des += stringUtil.getString(1221, siteName);
        });
    }

    config.action.btn_1.txt = stringUtil.getString(1073);
    config.action.btn_1.target = npc;
    config.action.btn_1.cb = function () {
        gifts.forEach(function (gift) {
            if (gift.hasOwnProperty("itemId")) {
                player.gainItems([gift]);
            } else {
                player.map.unlockSite(gift.siteId);
            }
        });
        if (npc.needSendGift()) {
            npc.sendGift();
        }
        Record.saveAll();
    };

    var dialog = new NpcDialog(config);
    if (isItem) {
        var log = dialog.contentNode.getChildByName("log");

        var richText = new ItemRichText(gifts, dialog.rightEdge - dialog.leftEdge, 3, 0.5, cc.color.BLACK);
        richText.setName("richText")
        richText.setAnchorPoint(0, 1);
        richText.setPosition(dialog.leftEdge, log.getContentSize().height - 10);
        log.addChild(richText);
    }
    dialog.show();
    audioManager.playEffect(audioManager.sound.NPC_KNOCK);
};

uiUtil.showNpcInMapDialog = function (entity, time, fuelNeed, canAfford, okCb, cancelCb) {
    var npc = entity.baseSite;
    var config = {
        title: {},
        content: {log: true},
        action: {btn_1: {}, btn_2: {}}
    };
    config.title.title = npc.getName();
    config.title.icon = "#icon_npc.png";
    config.title.heart = npc.reputation;
    config.content.dig_des = "#npc_dig_" + npc.id + ".png";
    config.content.des = npc.getDes();
    config.action.btn_1.txt = stringUtil.getString(1157);
    config.action.btn_1.target = entity;
    config.action.btn_1.cb = cancelCb;
    config.action.btn_2.txt = stringUtil.getString(1138);
    config.action.btn_2.target = entity;
    config.action.btn_2.cb = okCb;
    var dialog = new NpcDialog(config, canAfford);
    
    var log = dialog.contentNode.getChildByName("log");

    var label1 = new cc.LabelTTF(utils.getTimeDistanceStr(time), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
    label1.setAnchorPoint(0, 1);
    label1.setPosition(dialog.leftEdge, log.getContentSize().height - 30);
    label1.setColor(cc.color.BLACK);
    log.addChild(label1);
    
    if (fuelNeed > 0) {
        var label3 = new cc.LabelTTF(stringUtil.getString(1340) + " " + fuelNeed, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        label3.setAnchorPoint(0, 1);
        label3.setPosition(dialog.leftEdge, label1.y - label1.height - 10);
        if (canAfford) {
            label3.setColor(cc.color.BLACK);
        } else {
            label3.setColor(cc.color.RED);
        }
        log.addChild(label3);
    }
    
    var needItems = [];
    npc.storage.forEach(function(item, num) {
        needItems.push({
            itemId: item.id,
            num: num,
            color: cc.color.BLACK
        });
    });
    
    var transportNode = uiUtil.createTransportNode(canAfford, function() {
        //stop using moto
        player.useMoto = false;
        dialog.dismiss();
    }, function() {
        //start using moto
        player.useMoto = true;
        dialog.dismiss();
    });
    transportNode.setAnchorPoint(1, 0.5);
    transportNode.setPosition(cc.winSize.width / 2 + 230, label1.y + 580);
    dialog.addChild(transportNode, 1);
    
    var showItemBtn = new ImageButton("res/new/tradelist.png");
    showItemBtn.setPosition(cc.winSize.width / 2 + 180, label1.y + 180);
    dialog.addChild(showItemBtn, 1);
    showItemBtn.setClickListener(this, function(a) {
        var d = new NpcTradeItemDialog(needItems);
        d.show();
    });
    dialog.show();
    if (userGuide.isStep(userGuide.stepName.MOTO_PROMPT) && player.hasMotocycle()) {
        var config = {
            title: {title: ""},
            content: {des: stringUtil.getString("motor_tut")},
            action: {btn_1: {txt: stringUtil.getString(1193)}}
        };
        var toast = new DialogTiny(config);
        toast.y = -196;
        toast.show();
        userGuide.step();
    }
};

uiUtil.showSiteDialog = function (entity, time, fuelNeed, canAfford, okCb, cancelCb) {
    var config = utils.clone(stringUtil.getString(5000));
    config.title.icon = "#site_" + entity.baseSite.id + ".png";

    config.title.title = entity.baseSite.getName();
    config.title.txt_1 = cc.formatStr(config.title.txt_1, entity.baseSite.getProgressStr(1, entity.baseSite.id));
    config.title.txt_2 = cc.formatStr(config.title.txt_2, entity.baseSite.getAllItemNum());
    config.content.log = true;
    config.content.dig_des = "#site_dig_" + entity.baseSite.id + ".png";

    config.content.des = entity.baseSite.getDes();
    config.action.btn_1.target = entity;
    config.action.btn_1.cb = cancelCb;
    config.action.btn_2.target = entity;
    config.action.btn_2.cb = okCb;
    var dialog = new DialogBig(config);
    
    var transportNode = uiUtil.createTransportNode(canAfford, function() {
        //stop using moto
        player.useMoto = false;
        dialog.dismiss();
    }, function() {
        //start using moto
        player.useMoto = true;
        dialog.dismiss();
    });
    transportNode.setAnchorPoint(1, 0.5);
    transportNode.x = dialog.rightEdge + 30;
    transportNode.y = dialog.titleNode.height / 2;
    dialog.titleNode.addChild(transportNode);
    
    var txt1 = dialog.titleNode.getChildByName("txt_1");
    var txt2 = dialog.titleNode.getChildByName("txt_2");
    var icon = dialog.titleNode.getChildByName('icon');
    txt1.x = icon.x;
    txt2.x = txt1.x + txt1.width + 35;

    dialog.contentNode.getChildByName("dig_des").setScale(0.8);
    var des = dialog.contentNode.getChildByName("des");
    des.y = des.y + 20;

    var log = dialog.contentNode.getChildByName("log");
    var label = new cc.LabelTTF(utils.getTimeDistanceStr(time), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
    label.setAnchorPoint(0, 1);
    label.setPosition(dialog.leftEdge, log.getContentSize().height - 30);
    label.setColor(cc.color.BLACK);
    log.addChild(label);
    
    if (fuelNeed > 0) {
        var str = stringUtil.getString(1340) + " " + fuelNeed;
        var label2 = new cc.LabelTTF(str, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        label2.setAnchorPoint(0, 1);
        label2.setPosition(dialog.leftEdge, label.y - label.height - 10);
        if (canAfford) {
            label2.setColor(cc.color.BLACK);
        } else {
            label2.setColor(cc.color.RED);
        }
        log.addChild(label2);
    }
    
    if (entity.baseSite.id == 400) {
        var needItems = [];
        player.shopList.forEach(function(item) {
            if (item.amount > 0) {
                needItems.push({
                    itemId: item.itemId,
                    num: item.amount,
                    color: cc.color.BLACK
                });
            }
        });
        var showItemBtn = new ImageButton("res/new/tradelist.png");
        showItemBtn.setPosition(cc.winSize.width / 2 + 180, label.y + 180);
        dialog.addChild(showItemBtn, 1);
        showItemBtn.setClickListener(this, function(a) {
            var hasSales = false;
            for (var i = 0; i < player.shopList.length; i++) {
                if (player.shopList[i].discount != 0) {
                    hasSales = true;
                    break;
                }
            }
            var d = new NpcTradeItemDialog(needItems, hasSales);
            d.show();
        });
    }
    dialog.show();
    if (userGuide.isStep(userGuide.stepName.MOTO_PROMPT) && player.hasMotocycle()) {
        var config = {
            title: {title: ""},
            content: {des: stringUtil.getString("motor_tut")},
            action: {btn_1: {txt: stringUtil.getString(1193)}}
        };
        var toast = new DialogTiny(config);
        toast.y = -196;
        toast.show();
        userGuide.step();
    } else if (userGuide.isStep(userGuide.stepName.MAP_SITE_GO) && userGuide.isSite(entity.baseSite.id)) {
        uiUtil.createIconWarn(dialog.actionNode.getChildByName("btn_2"));
    }
};

uiUtil.showHomeDialog = function (entity, time, fuelNeed, canAfford, okCb, cancelCb) {
    var config = utils.clone(stringUtil.getString(5000));
    config.title.icon = "#site_" + entity.baseSite.id + ".png";
    config.title.title = entity.baseSite.getName();
    config.title.txt_1 = null;
    config.title.txt_2 = null;
    config.content.log = true;
    config.content.dig_des = "#site_dig_" + entity.baseSite.id + ".png";
    config.content.des = entity.baseSite.getDes();
    config.action.btn_1.target = entity;
    config.action.btn_1.cb = cancelCb;
    config.action.btn_2.target = entity;
    config.action.btn_2.cb = okCb;
    var dialog = new DialogBig(config);
    
    var transportNode = uiUtil.createTransportNode(canAfford, function() {
        //stop using moto
        player.useMoto = false;
        dialog.dismiss();
    }, function() {
        //start using moto
        player.useMoto = true;
        dialog.dismiss();
    });
    transportNode.setAnchorPoint(1, 0.5);
    transportNode.x = dialog.rightEdge + 30;
    transportNode.y = dialog.titleNode.height / 2;
    dialog.titleNode.addChild(transportNode);
    
    dialog.contentNode.getChildByName("dig_des").setScale(0.8);
    var des = dialog.contentNode.getChildByName("des");
    des.y = des.y + 20;

    var log = dialog.contentNode.getChildByName("log");
    var label = new cc.LabelTTF(utils.getTimeDistanceStr(time), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
    label.setAnchorPoint(0, 1);
    label.setPosition(dialog.leftEdge, log.getContentSize().height - 30);
    label.setColor(cc.color.BLACK);
    log.addChild(label);
    
    if (fuelNeed > 0) {
        var label2 = new cc.LabelTTF(stringUtil.getString(1340) + " " + fuelNeed, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        label2.setAnchorPoint(0, 1);
        label2.setPosition(dialog.leftEdge, label.y - label.height - 10);
        if (canAfford) {
            label2.setColor(cc.color.BLACK);
        } else {
            label2.setColor(cc.color.RED);
        }
        log.addChild(label2);
    }
    dialog.show();

    if (userGuide.isStep(userGuide.stepName.MAP_SITE_HOME_GO) && entity.baseSite.id == HOME_SITE) {
        uiUtil.createIconWarn(dialog.actionNode.getChildByName("btn_2"));
    }
};

uiUtil.showRandomBattleDialog = function (battleInfo, cb) {
    var dialog = new RandomBattleDialog(battleInfo, cb);
    dialog.show();
};

uiUtil.showTinyInfoDialog = function (msg) {
    var config = {
        title: {},
        content: {},
        action: {btn_1: {}}
    };
    if (typeof msg === 'number') {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        msg = stringUtil.getString.apply(this, args);
    }
    config.content.des = msg;
    config.action.btn_1.txt = stringUtil.getString(1073);
    var dialog = new DialogTiny(config);
    dialog.show();
};

uiUtil.checkVigour = function () {
    if (player.isLowVigour()) {
        uiUtil.showTinyInfoDialog(1133);
        return false;
    } else {
        return true;
    }
};

uiUtil.checkStarve = function () {
    if (player.isAttrMax("starve")) {
        uiUtil.showTinyInfoDialog(1128);
        return false;
    } else {
        return true;
    }
};

uiUtil.checkDogStarve = function () {
    if (player.isAttrMax("dogFood")) {
        uiUtil.showTinyInfoDialog(stringUtil.getString(1130));
        return false;
    } else {
        return true;
    }
};

uiUtil.createHeartNode = function () {
    var heartPadding = 5;
    var heartNum = 5;

    var heartBgFrame = autoSpriteFrameController.getSpriteFrameFromSpriteName("icon_heart_bg.png");
    var w = (heartNum - 1 ) * heartPadding + heartNum * heartBgFrame.getRect().width;

    var node = new cc.Node();
    node.setContentSize(w, heartBgFrame.getRect().height);

    for (var i = 0; i < heartNum; i++) {
        var heartBg = autoSpriteFrameController.getSpriteFromSpriteName(heartBgFrame);
        heartBg.setAnchorPoint(0, 0.5);
        heartBg.x = i * (heartBg.width + heartPadding);
        heartBg.y = node.height / 2;
        heartBg.setName("heart_" + i);
        node.addChild(heartBg);
    }

    node.updateView = function (heart) {
        var min = Math.floor(heart / 2);
        var max = Math.ceil(heart / 2);

        for (var i = 0; i < heartNum; i++) {
            var hbg = this.getChildByName("heart_" + i);
            hbg.removeAllChildren();

            if (i < min) {
                var fullHeart = autoSpriteFrameController.getSpriteFromSpriteName("#icon_heart_full.png");
                fullHeart.x = heartBg.width / 2;
                fullHeart.y = heartBg.height / 2;
                hbg.addChild(fullHeart);
            }
            if (max !== min) {
                if (i === (max - 1)) {
                    var halfHeart = autoSpriteFrameController.getSpriteFromSpriteName("#icon_heart_half.png");
                    halfHeart.x = heartBg.width / 2;
                    halfHeart.y = heartBg.height / 2;
                    hbg.addChild(halfHeart);
                }
            }
        }
    };
    return node;
};

uiUtil.createEquipedItemIconList = function (dark, isMelee) {
    var defaultColor = dark ? cc.color.BLACK : cc.color.WHITE;
    var equipedItemList = player.equip.getEquipedItemList(isMelee);
    equipedItemList = equipedItemList.map(function (itemId) {
        var res = {itemId: itemId};
        if (itemId !== Equipment.HAND) {
            var item = new Item(itemId);
            if (item.getType(1) === ItemType.WEAPON_TOOL) {
                res.num = player.bag.getNumByItemId(itemId);
                //特殊道具为0时不显示
                if (res.num === 0)
                    return null;
            }
        }
        return res;
    });
    if (player.equip.isEquiped(1301091)) {
        var fuelNum = player.fuel;
        if (fuelNum > 0) {
            equipedItemList.unshift({
                itemId: "gas",
                num: fuelNum
            });
        }
    } else if (player.equip.getEquip(EquipmentPos.GUN) && !isMelee) {
        var bulletNum = player.bag.getNumByItemId(BattleConfig.BULLET_ID);
        if (bulletNum > 0) {
            equipedItemList.unshift({
                itemId: BattleConfig.BULLET_ID,
                num: bulletNum
            });
        }
        var homemadeNum = player.bag.getNumByItemId(BattleConfig.HOMEMADE_ID);
        if (homemadeNum > 0) {
            equipedItemList.unshift({
                itemId: BattleConfig.HOMEMADE_ID,
                num: homemadeNum
            });
        }
    }

    var node = new cc.Node();
    var scale = 0.5;
    var x = 0;

    equipedItemList.forEach(function (itemInfo, i) {
        if (!itemInfo)
            return;
        var itemId = itemInfo.itemId;
        var name;
        if (itemId === Equipment.HAND) {
            name = "#icon_tab_hand.png";
        } else {
            name = "#icon_item_" + itemId + ".png";
        }

        var icon = autoSpriteFrameController.getSpriteFromSpriteName(name);
        icon.setScale(scale);
        icon.setAnchorPoint(0, 0.5);
        icon.setPosition(x, 0);
        node.addChild(icon);

        x = icon.x + icon.width * icon.getScale() + 5;

        if (itemInfo.num) {
            var num = new cc.LabelTTF("x" + itemInfo.num, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
            num.x = icon.x + icon.width * icon.getScale() + 2;
            num.y = icon.y;
            num.setAnchorPoint(0, 0.5);
            num.setColor(defaultColor);
            node.addChild(num);

            x = num.x + num.width + 5;
        }
    });
    node.width = x;
    return node;
};

uiUtil.showItemListDialog = function (itemList) {
    var newList = utils.clone(itemList);
    player.validateItems(newList);
    var dialog = new ItemListDialog(newList);
    dialog.show();
};

uiUtil.createIconWarn = function (parent, pos, name) {
    if (name === undefined || name === null) {
        name = "warn";
    }
    uiUtil.removeIconWarn(parent, name);
    var warn = autoSpriteFrameController.getSpriteFromSpriteName("#icon_warn.png");
    var warnPos = pos || cc.p(parent.width / 2, parent.height / 2);
    var offset = cc.p(warn.width / 2 - 30, warn.height / 2 - 96);
    warnPos = cc.pAdd(warnPos, offset);
    warn.setPosition(warnPos);
    warn.runAction(cc.repeatForever((cc.sequence(cc.spawn(cc.scaleTo(1, 0.8), cc.fadeIn(1)), cc.spawn(cc.scaleTo(1, 1), cc.fadeOut(1))))));
    warn.setName(name);
    parent.addChild(warn, 11);
    player.buildWarn = warn;
    if (parent.getChildByName("buildWarn")) {
        parent.getChildByName("buildWarn").setVisible(false);
    }
};

uiUtil.createBuildWarn = function (parent, bid, pos) {
    var node = new cc.Node();
    node.height = 38;
    node.setAnchorPoint(0.5, 0.5);
    var pos = pos || cc.p(parent.width / 2, parent.height / 2);
    node.setPosition(pos);
    node.setName("buildWarn");
    parent.addChild(node);

    var build = player.room.getBuild(bid);
    var needWarnInfo = build.needWarn();

    var warnList = [];
    for (var key in needWarnInfo) {
        if (needWarnInfo[key]) {
            var warn = autoSpriteFrameController.getSpriteFromSpriteName("#icon_" + key + ".png");
            warn.y = node.height / 2;
            warn.setName(key);
            node.addChild(warn);
            warnList.push(warn);
        }
    }
    node.width = warnList.length * 38;
    var padding = node.width / (warnList.length * 2);
    warnList.forEach(function (warn, index) {
        warn.x = index * 2 * padding + padding;
    });

    if (parent.getChildByName("warn")) {
        node.setVisible(false);
    }
};

uiUtil.removeIconWarn = function (parent, name) {
    if (name === undefined || name === null) {
        name = "warn";
    }
    if (parent.getChildByName(name)) {
        parent.removeChildByName(name);
    }
};

uiUtil.showNewGameDialog = function (num, meta, cb, cb2) {
    var config = {
        title: {},
        content: {},
        action: {btn_1: {}, btn_2: {}}
    };
    config.content.des = stringUtil.getString(6012, num, meta[0]);
    config.action.btn_2.txt = stringUtil.getString(1030);
    config.action.btn_2.target = null;
    config.action.btn_1.cb = cb;
    config.action.btn_2.cb = cb2;

    config.action.btn_1.txt = stringUtil.getString(1157);
    var dialog = new DialogTiny(config);
    dialog.show();
};

uiUtil.createSaleOffIcon = function () {
    var iconHighlight = autoSpriteFrameController.getSpriteFromSpriteName("icon_sale_highlight.png");
    var icon = autoSpriteFrameController.getSpriteFromSpriteName("icon_off.png");

    var node = new cc.Node();
    node.width = icon.width;
    node.height = icon.height;
    node.anchorX = 0.5;
    node.anchorY = 0.5;

    iconHighlight.x = node.width / 2;
    iconHighlight.y = node.height / 2;
    node.addChild(iconHighlight);
    iconHighlight.runAction(cc.repeatForever((cc.sequence(cc.fadeOut(1.5), cc.fadeIn(1.5)))));

    icon.x = node.width / 2;
    icon.y = node.height / 2;
    node.addChild(icon);

    var offLabel = new cc.LabelTTF("", uiUtil.fontFamily.normal, 36);
    offLabel.x = 20;
    offLabel.y = 32;
    offLabel.color = cc.color.BLACK;
    icon.addChild(offLabel);

    node.updateOff = function (off) {
        offLabel.setString(off);
    };
    return node;
};

uiUtil.createPayItemNode = function (purchaseId, target, cb) {
    var node = new cc.Node();
    var strConfig = stringUtil.getString("p_" + purchaseId);

    var bg = autoSpriteFrameController.getSpriteFromSpriteName("frame_iap_bg_item.png");
    node.setContentSize(bg.getContentSize());
    bg.x = node.width / 2;
    bg.y = node.height / 2;
    node.addChild(bg);

    var name = new cc.LabelTTF(strConfig.name, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(node.width - 10, 0), cc.TEXT_ALIGNMENT_CENTER);
    name.x = node.width / 2;
    name.y = 218;
    name.color = cc.color.BLACK;
    node.addChild(name);

    var price = new cc.LabelTTF(stringUtil.getString(1192), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
    price.anchorX = 1;
    price.x = bg.width - 10;
    price.y = 26;
    price.color = cc.color.BLACK;
    node.addChild(price);

    var icon = autoSpriteFrameController.getSpriteFromSpriteName("icon_iap_" + purchaseId + ".png");
    icon.x = bg.width / 2;
    icon.y = 118;
    node.addChild(icon);

    var btnSize = cc.size(bg.width - 20, bg.height - 20);
    var btnIcon = new ButtonWithPressed(btnSize);
    btnIcon.x = bg.width / 2;
    btnIcon.y = bg.height / 2;
    node.addChild(btnIcon);
    btnIcon.setClickListener(this, function () {
        uiUtil.showPayDialog(purchaseId, function () {
            utils.pay(purchaseId, target, cb);
        });
    });

    var unlock = new cc.LabelTTF(stringUtil.getString(1233), uiUtil.fontFamily.normal, 40, cc.size(node.width, 0), cc.TEXT_ALIGNMENT_CENTER);
    unlock.x = icon.x;
    unlock.y = icon.y;
    node.addChild(unlock);
    unlock.setVisible(false);
    unlock.enableStroke(cc.color.BLACK, 8);

    node.purchaseId = purchaseId;
    node.updateStatus = function () {
        unlock.setVisible(false);
    };

    node.updatePrice = function (priceStr) {
        price.setString(priceStr);
    };
    node.updateStatus();

    return node;
};

uiUtil.showPayDialog = function (purchaseId, cb) {
    var strConfig = stringUtil.getString("p_" + purchaseId);
    var purchaseConfig = IAPPackage.getPurchaseConfig(purchaseId);
    var d = new PayDialog(purchaseId, cb);
    if (purchaseId < 200) {
        var desstr = strConfig.des.replace('\\n', '\n');
        var des = new cc.LabelTTF(desstr, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(d.rightEdge - d.leftEdge, 0));
        des.anchorX = 0;
        des.anchorY = 1;
        des.setPosition(d.leftEdge, d.contentNode.height - 10);
        d.contentNode.addChild(des);
        des.setColor(cc.color.BLACK);

        var effectstr = strConfig.effect.replace('\\n', '\n', 'g');
        var effect = new cc.LabelTTF(effectstr, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(d.rightEdge - d.leftEdge, 0));
        effect.anchorX = 0;
        effect.anchorY = 1;
        effect.setPosition(d.leftEdge, des.y - des.height);
        d.contentNode.addChild(effect);
        effect.setColor(cc.color.RED);
    } else {
        d.titleNode.getChildByName("icon").setVisible(false);
        d.titleNode.getChildByName("title").updateView();
        var desstr = strConfig.des.replace('\\n', '\n');
        var des2 = new cc.LabelTTF(desstr, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(d.rightEdge - d.leftEdge, 0));
        des2.anchorX = 0;
        des2.anchorY = 1;
        des2.setPosition(d.leftEdge, d.contentNode.height - 10);
        d.contentNode.addChild(des2);
        des2.setColor(cc.color.BLACK);

        var des = new cc.LabelTTF(stringUtil.getString(1215), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(d.rightEdge - d.leftEdge, 0));
        des.anchorX = 0;
        des.anchorY = 1;
        des.setPosition(d.leftEdge, des2.y - des2.height);
        d.contentNode.addChild(des);
        des.setColor(cc.color.BLACK);

        var richText = new ItemRichText(purchaseConfig.effect, d.rightEdge - d.leftEdge, 3, 0.5, cc.color.BLACK);
        richText.setName("richText")
        richText.setAnchorPoint(0, 1);
        richText.setPosition(d.leftEdge, des.y - des.height);
        d.contentNode.addChild(richText);
    }
    d.show();
    return d;
};

var _labelTTF = cc.LabelTTF;
cc.LabelTTF = function (text, fontName, fontSize, dimensions, hAlignment, vAlignment) {
    var defaultHAlignment = null;
    return _labelTTF(text, fontName, fontSize, dimensions, defaultHAlignment || hAlignment, vAlignment);
};

uiUtil.showBackMenuDialog = function (cb) {
    var dialog = new BackToMenuDialog(cb);
    dialog.show();
};

uiUtil.createItemListSliders = function (itemList) {
    var data = [];
    var datasource = {
        tableCellSizeForIndex: function (table, idx) {
            return cc.size(100, 100);
        },
        tableCellAtIndex: function (table, idx) {
            var cell = table.dequeueCell();
            var size = this.tableCellSizeForIndex(idx);
            if (!cell) {
                cell = new cc.TableViewCell();

                var bg = autoSpriteFrameController.getSpriteFromSpriteName('item_bg.png');
                bg.x = size.width / 2;
                bg.y = size.height / 2;
                bg.setName('bg');
                cell.addChild(bg);

                var numLabel = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
                numLabel.anchorX = 1;
                numLabel.anchorY = 0;
                numLabel.x = bg.width - 4;
                numLabel.y = 4;
                numLabel.setName('num');
                bg.addChild(numLabel, 1);
                numLabel.enableStroke(cc.color.BLACK, 2);
            }
            var info = data[idx];

            var bg = cell.getChildByName('bg');
            if (bg.getChildByName('icon')) {
                bg.removeChildByName('icon');
            }

            var itemId = info.itemId;
            var iconName = "icon_item_" + itemId + ".png";
            var icon = autoSpriteFrameController.getSpriteFromSpriteName(iconName);
            icon.x = bg.width / 2;
            icon.y = bg.height / 2;
            icon.setName('icon');
            bg.addChild(icon);

            bg.getChildByName('num').setString(info.num);
            cell.data = info;

            return cell;
        },
        numberOfCellsInTableView: function (table) {
            return data.length;
        }
    };

    var delegate = {
        tableCellTouched: function (table, cell) {
            if (cell.data.itemId == 1) {
                player.redeemPlay();
            } else {
                uiUtil.showItemDialog(cell.data.itemId, false, 'top');
            }
        },
        tableCellHighlight: function (table, cell) {
            cell.getChildByName('bg').runAction(cc.scaleTo(0.1, 1.2));
        },
        tableCellUnhighlight: function (table, cell) {
            cell.getChildByName('bg').runAction(cc.scaleTo(0.1, 1));
        },
        tableCellWillRecycle: function (table, cell) {
        }
    };

    var tableView = new cc.TableView(datasource, cc.size(400, 100));
    tableView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
    tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
    tableView.setDelegate(delegate);
    tableView.updateData = function () {
        data = itemList.filter(function(storageCell) {
            return storageCell.num !== 0;
        }).map(function(storageCell) {
            return {
              itemId: storageCell.item.id,
              num: storageCell.num
            };
        });
    };
    tableView.updateData();
    tableView.reloadData();

    return tableView;
};

uiUtil.createTransportNode = function (canAfford, cdone, cdtwo) {
    var hasShoe = (player.bag.validateItem(1306001, 1) || player.storage.validateItem(1306001, 1));
    var shoeBox = new CheckBox(!hasShoe, "icon_item_1306001.png", "icon_music_off.png", false);
    var hasMoto = player.hasMotocycle();
    var motoBox = new CheckBox(!hasMoto || !canAfford || !player.useMoto, "icon_item_1305034.png", "icon_music_off.png", false);
    this.cdone = cdone;
    this.cdtwo = cdtwo;
    var self = this;
    shoeBox.onRelease = function () {
        var str = stringUtil.getString(1306001).title + " " + stringUtil.getString(8103) + " ";
        if (hasShoe) {
            str += stringUtil.getString(8104);
        } else {
            str += stringUtil.getString(8105);
        }
        var config = {
            title: {},
            content: {des: str},
            action: {btn_1: {}}
        };
        config.action.btn_1.txt = stringUtil.getString(1030);
        var d = new DialogTiny(config);
        d.y = -196;
        d.show();
    };
    motoBox.onRelease = function () {
        var str = stringUtil.getString(1305034).title + " " + stringUtil.getString(8103) + " ";
        var config = {
            title: {},
            content: {des: ""},
            action: {btn_1: {}}
        };
        if (hasMoto && canAfford) {
            if (player.useMoto) {
                str += stringUtil.getString(8104);
                config.action.btn_2 = {};
                config.action.btn_2.txt = stringUtil.getString(8117);
                config.action.btn_2.cb = self.cdone;
            } else {
                str += stringUtil.getString(8118);
                config.action.btn_2 = {};
                config.action.btn_2.txt = stringUtil.getString(8116);
                config.action.btn_2.cb = self.cdtwo;
            }
        } else if (!hasMoto) {
            str += stringUtil.getString(8105);
        } else {
            str += stringUtil.getString(8106);
        }
        config.content.des = str;
        config.action.btn_1.txt = stringUtil.getString(1030);
        var d = new DialogTiny(config);
        d.y = -196;
        d.show();
    };
    var node = new cc.Node();
    shoeBox.setScale(0.6);
    motoBox.setScale(0.6);
    node.setContentSize(70, 30)
    shoeBox.setAnchorPoint(0, 0.5);
    motoBox.setAnchorPoint(1, 0.5);
    node.addChild(shoeBox);
    node.addChild(motoBox);
    return node;
};

uiUtil.createItemListSlidersViewOnly = function (itemList, state) {
    var data = [];
    var datasource = {
        tableCellSizeForIndex: function (table, idx) {
            return cc.size(100, 100);
        },
        tableCellAtIndex: function (table, idx) {
            var cell = table.dequeueCell();
            var size = this.tableCellSizeForIndex(idx);
            if (!cell) {
                cell = new cc.TableViewCell();

                var bg = autoSpriteFrameController.getSpriteFromSpriteName('item_bg.png');
                bg.x = size.width / 2;
                bg.y = size.height / 2;
                bg.setName('bg');
                cell.addChild(bg);

                var numLabel = new cc.LabelTTF("", uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2);
                numLabel.anchorX = 1;
                numLabel.anchorY = 0;
                numLabel.x = bg.width - 4;
                numLabel.y = 4;
                numLabel.setName('num');
                bg.addChild(numLabel, 1);
                numLabel.enableStroke(cc.color.BLACK, 2);
            }
            var info = data[idx];

            var bg = cell.getChildByName('bg');
            if (bg.getChildByName('icon')) {
                bg.removeChildByName('icon');
            }

            var itemId = info.itemId;
            var iconName = "icon_item_" + itemId + ".png";
            var icon = autoSpriteFrameController.getSpriteFromSpriteName(iconName);
            icon.x = bg.width / 2;
            icon.y = bg.height / 2;
            icon.setName('icon');
            bg.addChild(icon);
            var probab = info.weight / 4;
            if (state) {
                var probab = info.weight / 4;
                bg.getChildByName('num').setString(probab.toFixed(2) + "%");
            } else {
                bg.getChildByName('num').setString(info.num);
            }
            cell.data = info;

            return cell;
        },
        numberOfCellsInTableView: function (table) {
            return data.length;
        }
    };

    var delegate = {
        tableCellTouched: function (table, cell) {
        },
        tableCellHighlight: function (table, cell) {
        },
        tableCellUnhighlight: function (table, cell) {
        },
        tableCellWillRecycle: function (table, cell) {
        }
    };

    var tableView = new cc.TableView(datasource, cc.size(400, 100));
    tableView.setDirection(cc.SCROLLVIEW_DIRECTION_HORIZONTAL);
    tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
    tableView.setDelegate(delegate);
    tableView.updateData = function () {
        data = utils.clone(itemList).reverse();
    };
    tableView.updateData();
    tableView.reloadData();

    return tableView;
};