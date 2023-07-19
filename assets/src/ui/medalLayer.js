var medalNode = cc.Node.extend({
    ctor: function (medalIndex) {
        this._super();

        var medalInfoIndex = Medal.getNowMedalIndex(medalIndex);
        var medalInfo = Medal._map[medalInfoIndex];
        var medalStrings = stringUtil.getString("m_" + medalInfoIndex);

        var leftEdge = 50;
        var medalIcon = new cc.Sprite("res/new/medalIcon_" + medalIndex + ".png");
        medalIcon.setPosition(leftEdge + 75, 128);
        this.addChild(medalIcon);

        var completedMedalInfo = Medal._map[Medal.getCompletedMedalIndex(medalIndex)];
        if (completedMedalInfo.completed && !completedMedalInfo.warned) {
            completedMedalInfo.warned = true;
            Medal.save();
            var medalWarn = new cc.Sprite("res/new/medalWarn.png");
            medalWarn.setPosition(leftEdge, medalIcon.height - 10);
            medalIcon.addChild(medalWarn);
        }

        var level = Number(medalInfoIndex.toString().split("").pop());
        
        var starBg;
        if ((level == 1 && medalInfo.completed) || Record.getMedalCheat()) {
            starBg = new cc.Sprite("res/new/star_3.png");

        } else {
            starBg = new cc.Sprite("res/new/star_" + (3 - level) + ".png");
        }
        starBg.setPosition(leftEdge + 75, 16);
        this.addChild(starBg);

        var medalPercentage = medalInfo.aimCompleted / medalInfo.aim * 100;
        if (medalPercentage > 100 || Record.getMedalCheat())
            medalPercentage = 100;
        var processText;
        if (Record.getMedalCheat()) {
            processText = new cc.LabelTTF(medalInfo.aim + "/" + medalInfo.aim, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        } else {
            processText = new cc.LabelTTF(medalInfo.aimCompleted + "/" + medalInfo.aim, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3);
        }
        processText.setColor(cc.color(0, 0, 0, 255));
        processText.setAnchorPoint(0,0.5)
        processText.setPosition(leftEdge + 460, 210);
        this.addChild(processText);

        var pbBg = autoSpriteFrameController.getSpriteFromSpriteName("#pb_bg.png");
        pbBg.setPosition(leftEdge + 180, 210);
        pbBg.setAnchorPoint(0, 0.5);
        pbBg.setName("pbBg");
        this.addChild(pbBg);

        var pb = new cc.ProgressTimer(autoSpriteFrameController.getSpriteFromSpriteName("#pb.png"));
        pb.type = cc.ProgressTimer.TYPE_BAR;
        pb.midPoint = cc.p(0, 0);
        pb.barChangeRate = cc.p(1, 0);
        pb.setAnchorPoint(0, 0.5);
        pb.setPosition(leftEdge + 180, 210);
        pb.setPercentage(medalPercentage);
        pb.setName("pb");
        this.addChild(pb);

        var medalTitle = new cc.LabelTTF(medalStrings.name, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(350, 0));
        medalTitle.setAnchorPoint(0, 1);
        medalTitle.setColor(cc.color(0, 0, 0, 255));
        medalTitle.setPosition(leftEdge + 200, 195);
        medalTitle.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(medalTitle);

        var medalCondition = new cc.LabelTTF(medalStrings.condition, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(350, 0));
        medalCondition.setAnchorPoint(0, 1);
        medalCondition.setColor(cc.color(0, 0, 0, 255));
        medalCondition.setPosition(leftEdge + 200, medalTitle.y - medalTitle.height);
        medalCondition.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(medalCondition);

        var medalDes = new cc.LabelTTF(medalStrings.des, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(350, 0));
        medalDes.setAnchorPoint(0, 1);
        medalDes.setColor(cc.color(0, 0, 0, 255));
        medalDes.setPosition(leftEdge + 200, medalCondition.y - medalCondition.height);
        medalDes.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(medalDes);
    }
})

var medalLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        if (Record.getScreenFix() == 1) {
            this.setScale(0.83);
        }
        var bg = new cc.Sprite("res/new/medalBg.png");
        bg.setAnchorPoint(0, 0);
        this.addChild(bg);
        this.setContentSize(bg.getContentSize());

        var title = new cc.LabelTTF(stringUtil.getString(1246), uiUtil.fontFamily.normal, 55);
        title.setPosition(this.width / 4 + 100, 1070);
        title.setColor(cc.color(0, 0, 0, 255));
        this.addChild(title);

        var startPosition = 750;
        var offY = 280;

        var itemCount = 0;
        var medal1 = new medalNode(1);
        medal1.y = startPosition - offY * itemCount;
        this.addChild(medal1);
        itemCount++;

        var medal2 = new medalNode(2);
        medal2.y = startPosition - offY * itemCount;
        this.addChild(medal2);
        itemCount++;

        var medal3 = new medalNode(3);
        medal3.y = startPosition - offY * itemCount;
        this.addChild(medal3);

        var agreementLabel = new cc.LabelTTF(stringUtil.getString(9016), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3 + 4, cc.size(90, 0), cc.TEXT_ALIGNMENT_CENTER);
        agreementLabel.setAnchorPoint(0.5, 0.5);
        agreementLabel.setColor(cc.color(0, 0, 0, 255));
        agreementLabel.setPosition(title.x + 330, 1070);
        bg.addChild(agreementLabel);
        agreementLabel.setName("text_dec");

        var checkBox = new CheckBox(Record.getMedalCheat(), "checkbox_bg.png", "checkbox_on.png");
        checkBox.setClickListener(this, function (sender) {
            var on = sender.on;
            Record.setMedalCheat(on);
            cc.director.runScene(new medalScene());
        });
        checkBox.setAnchorPoint(1, 0.5);
        checkBox.setPosition(title.x + 300, 1070);
        bg.addChild(checkBox);
        checkBox.setName("agreement");

        var btnBack = uiUtil.createCommonBtnBlack(stringUtil.getString(1193), this, function () {
            cc.director.runScene(new MenuScene());
        })
        btnBack.setPosition(this.width / 2, 50);
        this.addChild(btnBack);
        this.setPositionX((cc.winSize.width - this.width) / 2);
    }
})

var medalScene = BaseScene.extend({
    ctor: function () {
        this._super(APP_NAVIGATION.MENU_SUB);
        this.addChild(new medalLayer());
    }
})

var medalShowDialog = cc.Layer.extend({
    ctor: function (medalIndex) {
        this._super();
        var bg = new cc.Sprite("res/new/frame_medal_bg.png");
        bg.setAnchorPoint(0, 0);
        this.addChild(bg);

        var medalInfoIndex = Medal.getCompletedMedalIndex(medalIndex);
        var medalInfo = Medal._map[medalInfoIndex];
        var medalStrings = stringUtil.getString("m_" + medalInfoIndex);

        var leftEdge = 50;
        var medalIcon = new cc.Sprite("res/new/medalIcon_" + medalIndex + ".png");
        medalIcon.setPosition(leftEdge + 75, 128);
        this.addChild(medalIcon);

        var level = Number(medalInfoIndex.toString().split("").pop());

        var starBg;
        if (level == 1 && medalInfo.completed) {
            starBg = new cc.Sprite("res/new/star_3.png");

        } else {
            starBg = new cc.Sprite("res/new/star_" + (3 - level) + ".png");
        }
        starBg.setPosition(leftEdge + 75, 16);
        this.addChild(starBg);

        var newGetLabel = new cc.LabelTTF(stringUtil.getString(1265), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_1);
        newGetLabel.setAnchorPoint(0, 0);
        newGetLabel.setColor(cc.color(255, 255, 255, 255));
        newGetLabel.setPosition(leftEdge + 218, 170);
        newGetLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(newGetLabel);

        var medalTitle = new cc.LabelTTF(medalStrings.name, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(300, 0));
        medalTitle.setAnchorPoint(0, 1);
        medalTitle.setColor(cc.color(255, 255, 255, 255));
        medalTitle.setPosition(leftEdge + 218, 130);
        medalTitle.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(medalTitle);

        var medalCondition = new cc.LabelTTF(medalStrings.condition, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(300, 0));
        medalCondition.setAnchorPoint(0, 1);
        medalCondition.setColor(cc.color(255, 255, 255, 255));
        medalCondition.setPosition(leftEdge + 218, medalTitle.y - medalTitle.height);
        medalCondition.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(medalCondition);

        var medalDes = new cc.LabelTTF(medalStrings.des, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(300, 0));
        medalDes.setAnchorPoint(0, 1);
        medalDes.setColor(cc.color(255, 255, 255, 255));
        medalDes.setPosition(leftEdge + 218, medalCondition.y - medalCondition.height);
        medalDes.setHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(medalDes);
    }
})