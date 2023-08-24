var aboutLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
        return true;
    },

    onExit: function () {
        this._super();
    },

    onEnter: function () {
        this._super();
        if (Record.getScreenFix() == 1) {
            this.setScale(0.83);
        }
        this.bg = new cc.Sprite("res/new/about_bg.png");
        this.bg.x = cc.winSize.width / 2;
        this.bg.y = cc.winSize.height / 2;
        this.addChild(this.bg);
        
        var rankLogoName = "res/new/";
        if (cc.sys.localStorage.getItem("language") === cc.sys.LANGUAGE_CHINESE) {
            rankLogoName += "top_logo_zh.png";
        } else {
            rankLogoName += "top_logo_en.png";
        }
        
        var rankLogo = new cc.Sprite(rankLogoName);
        rankLogo.x = cc.winSize.width / 2;
        rankLogo.y = 1038;
        rankLogo.scale = 0.5;
        this.addChild(rankLogo);
        
        var nameLabel = new cc.LabelTTF(stringUtil.getString(6667), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_1, cc.size(this.bg.width / 5 * 4, 0));
        nameLabel.setAnchorPoint(0, 1);
        nameLabel.setPosition(this.bg.width / 10, this.bg.height - 200);
        nameLabel.setColor(cc.color.BLACK);
        this.bg.addChild(nameLabel);
        
        var btn = uiUtil.createCommonBtnBlack(stringUtil.getString(1193), this, function () {
            cc.director.runScene(new MenuScene());
        });
        btn.setPosition(this.bg.width / 2, this.bg.height / 2 - 500);
        this.bg.addChild(btn);
        btn.setName("btn");
        
        var btn_github = uiUtil.createCommonBtnBlack("github.com", this, function () {
            CommonUtil.gotoUrl("https://github.com/qwerfd2/buried-city");
        });
        btn_github.setPosition(this.bg.width / 4 + 30, this.bg.height / 2 - 100);
        this.bg.addChild(btn_github);
        btn.setName("btn_github");
        
        var btn_rentry = uiUtil.createCommonBtnBlack("rentry.co", this, function () {
            CommonUtil.gotoUrl("https://rentry.co/fpkk2");
        });
        btn_rentry.setPosition(this.bg.width / 4 * 3 - 30, this.bg.height / 2 - 100);
        this.bg.addChild(btn_rentry);
        btn.setName("btn_rentry");
        
        var btn_archive = uiUtil.createCommonBtnBlack("archive.org", this, function () {
            CommonUtil.gotoUrl("https://archive.org/details/t-27_20230804");
        });
        btn_archive.setPosition(this.bg.width / 4 + 30, this.bg.height / 2 - 200);
        this.bg.addChild(btn_archive);
        btn.setName("btn_archive");
        
        var btn_reddit = uiUtil.createCommonBtnBlack("reddit.com", this, function () {
            CommonUtil.gotoUrl("https://reddit.com/r/BuriedTown/comments/14k6zcq");
        });
        btn_reddit.setPosition(this.bg.width / 4 * 3 - 30, this.bg.height / 2 - 200);
        this.bg.addChild(btn_reddit);
        btn.setName("btn_reddit");
        
        var btn_tieba = uiUtil.createCommonBtnBlack("tieba.com", this, function () {
            CommonUtil.gotoUrl("https://tieba.baidu.com/p/8546322916");
        });
        btn_tieba.setPosition(this.bg.width / 4 + 30, this.bg.height / 2 - 300);
        this.bg.addChild(btn_tieba);
        btn.setName("btn_tieba");
        
        var btn_email = uiUtil.createCommonBtnBlack("Email", this, function () {
            CommonUtil.gotoUrl("mailto:mtngckover@gmail.com");
        });
        btn_email.setPosition(this.bg.width / 4 * 3 - 30, this.bg.height / 2 - 300);
        this.bg.addChild(btn_email);
        btn.setName("btn_email");
    }
});

var aboutScene = BaseScene.extend({
    ctor: function () {
        this._super(APP_NAVIGATION.MENU_SUB);
    },
    onEnter: function () {
        this._super();
        var layer = new aboutLayer();
        this.addChild(layer);
    },
    onExit: function () {
        this._super();
    }
});