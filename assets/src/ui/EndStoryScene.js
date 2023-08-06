var EndStoryLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        return true;
    },

    onExit: function () {
        this._super();
    },

    onEnter: function () {
        this._super();
        game.stop();
        this.sequence = 0;
        var bg = new Button(cc.winSize);
        bg.x = cc.winSize.width / 2;
        bg.y = cc.winSize.height / 2;
        this.addChild(bg);
        bg.setClickListener(this, function () {
            bg.setEnabled(false);
            this.sequence++;
            if (this.sequence == 1) {
                txt1.runAction(cc.fadeOut(1));
                txt2.runAction(cc.fadeOut(1));
                txt3.runAction(cc.fadeOut(1));
                setTimeout(function () {
                    txt4.runAction(cc.fadeIn(1));
                    setTimeout(function () {
                        txt5.runAction(cc.fadeIn(1));
                        setTimeout(function () {
                            txt6.runAction(cc.fadeIn(1));
                            setTimeout(function () {
                                bg.setEnabled(true);
                            }, 1500);
                        }, 1500);
                    }, 1500);
                }, 1500);
            } else if (this.sequence == 2) {
                txt4.runAction(cc.fadeOut(1));
                txt5.runAction(cc.fadeOut(1));
                txt6.runAction(cc.fadeOut(1));
                setTimeout(function () {
                    txt7.runAction(cc.fadeIn(1));
                    setTimeout(function () {
                        endButtonOne.setEnabled(1);
                        endButtonTwo.setEnabled(1);
                        endButtonOne.runAction(cc.fadeIn(1));
                        endButtonTwo.runAction(cc.fadeIn(1));
                    }, 1500);
                }, 1500);
            } else if (this.sequence == 3) {
                txt1.runAction(cc.fadeOut(1));
                txt2.runAction(cc.fadeOut(1));
                txt3.runAction(cc.fadeOut(1));
                setTimeout(function () {
                    txt4.runAction(cc.fadeIn(1));
                    setTimeout(function () {
                        txt5.runAction(cc.fadeIn(1));
                        setTimeout(function () {
                            txt6.runAction(cc.fadeIn(1));
                            setTimeout(function () {
                                bg.setEnabled(true);
                            }, 1500);
                        }, 1500);
                    }, 1500);
                }, 1500);
            } else if (this.sequence == 4) {
                txt4.runAction(cc.fadeOut(1));
                txt5.runAction(cc.fadeOut(1));
                txt6.runAction(cc.fadeOut(1));
                setTimeout(function () {
                    txt7.runAction(cc.fadeIn(1));
                    setTimeout(function () {
                        endButtonThree.setEnabled(1);
                        endButtonThree.runAction(cc.fadeIn(1));
                    }, 1500);
                }, 1500);
            }
        });
        bg.setEnabled(false);

        var txtNode = new cc.Node();
        txtNode.setContentSize(500, 750);
        txtNode.setAnchorPoint(0.5, 1);
        txtNode.x = cc.winSize.width / 2;
        txtNode.y = cc.winSize.height - 150;
        this.addChild(txtNode);

        var txt1 = new cc.LabelTTF(stringUtil.getString(8000), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(txtNode.width, 0));
        txt1.setAnchorPoint(0, 1);
        txt1.setPosition(0, txtNode.height);
        txt1.setColor(cc.color.WHITE);
        txtNode.addChild(txt1);
        
        var txt2 = new cc.LabelTTF(stringUtil.getString(8001), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(txtNode.width, 0));
        txt2.setAnchorPoint(0, 1);
        txt2.setPosition(0, txt1.y - txt1.height - 120);
        txt2.setColor(cc.color.WHITE);
        txtNode.addChild(txt2);

        var txt3 = new cc.LabelTTF(stringUtil.getString(8002), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(txtNode.width, 0));
        txt3.setAnchorPoint(0, 1);
        txt3.setPosition(0, txt2.y - txt2.height - 120);
        txt3.setColor(cc.color.WHITE);
        txtNode.addChild(txt3);
        
        var txt4 = new cc.LabelTTF(stringUtil.getString(8003), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(txtNode.width, 0));
        txt4.setAnchorPoint(0, 1);
        txt4.setPosition(0, txtNode.height);
        txt4.setColor(cc.color.WHITE);
        txtNode.addChild(txt4);

        var txt5 = new cc.LabelTTF(stringUtil.getString(8004), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(txtNode.width, 0));
        txt5.setAnchorPoint(0, 1);
        txt5.setPosition(0, txt4.y - txt4.height - 120);
        txt5.setColor(cc.color.WHITE);
        txtNode.addChild(txt5);
        
        var txt6 = new cc.LabelTTF(stringUtil.getString(8005), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(txtNode.width, 0));
        txt6.setAnchorPoint(0, 1);
        txt6.setPosition(0, txt5.y - txt5.height - 120);
        txt6.setColor(cc.color.WHITE);
        txtNode.addChild(txt6);

        var txt7 = new cc.LabelTTF(stringUtil.getString(8006), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(txtNode.width, 0));
        txt7.setAnchorPoint(0, 1);
        txt7.setPosition(0, txtNode.height);
        txt7.setColor(cc.color.WHITE);
        txtNode.addChild(txt7);
        
        var endButtonOne = uiUtil.createBigBtnWhite(stringUtil.getString(8100), this, function () {
            endButtonOne.setVisible(false); 
            endButtonTwo.setVisible(false);
            endButtonOne.setEnabled(false); 
            endButtonTwo.setEnabled(false);
            txt7.runAction(cc.fadeOut(1));
            setTimeout(function () {
                txt1.setString(stringUtil.getString(8010));
                txt2.setString(stringUtil.getString(8011));
                txt3.setString(stringUtil.getString(8012));
                txt4.setString(stringUtil.getString(8013));
                txt5.setString(stringUtil.getString(8014));
                txt6.setString(stringUtil.getString(8015));
                txt7.setString(stringUtil.getString(8016));
                txt1.runAction(cc.fadeIn(1));
                setTimeout(function () {
                    txt2.runAction(cc.fadeIn(1));
                    setTimeout(function () {
                        txt3.runAction(cc.fadeIn(1));
                        setTimeout(function () {
                            bg.setEnabled(true);
                        }, 1500);
                    }, 1500);
                }, 1500);
            }, 1500);
        });
        endButtonOne.setAnchorPoint(0.5, 0.5);
        endButtonOne.setPosition(cc.winSize.width / 2 - 140, 150);
        this.addChild(endButtonOne);
        
        var endButtonTwo = uiUtil.createBigBtnWhite(stringUtil.getString(8101), this, function () {
            endButtonOne.setVisible(false); 
            endButtonTwo.setVisible(false);
            endButtonOne.setEnabled(false); 
            endButtonTwo.setEnabled(false);
            txt7.runAction(cc.fadeOut(1));
            setTimeout(function () {
                txt1.setString(stringUtil.getString(8020));
                txt2.setString(stringUtil.getString(8021));
                txt3.setString(stringUtil.getString(8022));
                txt4.setString(stringUtil.getString(8023));
                txt5.setString(stringUtil.getString(8024));
                txt6.setString(stringUtil.getString(8025));
                txt7.setString(stringUtil.getString(8026));
                txt1.runAction(cc.fadeIn(1));
                setTimeout(function () {
                    txt2.runAction(cc.fadeIn(1));
                    setTimeout(function () {
                        txt3.runAction(cc.fadeIn(1));
                        setTimeout(function () {
                            bg.setEnabled(true);
                        }, 1500);
                    }, 1500);
                }, 1500);
            }, 1500);
        });
        endButtonTwo.setAnchorPoint(0.5, 0.5);
        endButtonTwo.setPosition(cc.winSize.width / 2 + 140, 150);
        this.addChild(endButtonTwo);
        
        var endButtonThree = uiUtil.createBigBtnWhite(stringUtil.getString(1030), this, function () {
            cc.director.runScene(new MenuScene());
        });
        endButtonThree.setAnchorPoint(0.5, 0.5);
        endButtonThree.setPosition(cc.winSize.width / 2, 150);
        this.addChild(endButtonThree);
        
        txt1.setOpacity(0);
        txt1.runAction(cc.fadeIn(1));
        txt2.setOpacity(0);
        txt3.setOpacity(0);
        txt4.setOpacity(0);
        txt5.setOpacity(0);
        txt6.setOpacity(0);
        txt7.setOpacity(0);
        endButtonOne.setOpacity(0);
        endButtonTwo.setOpacity(0);
        endButtonThree.setOpacity(0);
        endButtonOne.setEnabled(0);
        endButtonTwo.setEnabled(0);
        endButtonThree.setEnabled(0);
        setTimeout(function () {
        txt2.runAction(cc.fadeIn(1));
           setTimeout(function () {
            txt3.runAction(cc.fadeIn(1));
                txt3.runAction(cc.fadeIn(1));
                setTimeout(function () {
                    bg.setEnabled(true);
                }, 1500);
            }, 1500);
        }, 1500);
        
        return true;
    }
});

var EndStoryScene = BaseScene.extend({
    ctor: function () {
        this._super(APP_NAVIGATION.GAME);
    },
    onEnter: function () {
        this._super();
        var layer = new EndStoryLayer();
        this.addChild(layer);
    },
    onExit: function () {
        this._super();
    }
});