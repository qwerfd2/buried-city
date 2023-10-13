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
        setTimeout(function() {audioManager.playMusic(audioManager.music.ARITHSEQ, false)}, 1000);
        this.bg = new cc.Sprite("res/new/about_bg.png");
        this.bg.x = cc.winSize.width / 2;
        this.bg.y = cc.winSize.height / 2;
        this.addChild(this.bg);
        
        var rankLogo = new cc.Sprite("res/new/top_logo_en.png");
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
            audioManager.stopMusic(audioManager.music.ARITHSEQ);
            cc.director.runScene(new MenuScene());
        });
        btn.setPosition(this.bg.width / 2, this.bg.height / 2 - 500);
        this.bg.addChild(btn);
        btn.setName("btn");
        
        var btn_github = uiUtil.createCommonBtnBlack("github.com", this, function () {
            CommonUtil.gotoUrl("https://github.com/qwerfd2/buried-city");
        });
        btn_github.setPosition(this.bg.width / 4 + 30, this.bg.height / 2);
        this.bg.addChild(btn_github);
        btn_github.setName("btn_github");
        
        var btn_rentry = uiUtil.createCommonBtnBlack("rentry.co", this, function () {
            CommonUtil.gotoUrl("https://rentry.co/fpkk2");
        });
        btn_rentry.setPosition(this.bg.width / 4 * 3 - 30, this.bg.height / 2);
        this.bg.addChild(btn_rentry);
        btn_rentry.setName("btn_rentry");
        
        var btn_archive = uiUtil.createCommonBtnBlack("archive.org", this, function () {
            CommonUtil.gotoUrl("https://archive.org/details/t-27_20230804");
        });
        btn_archive.setPosition(this.bg.width / 4 + 30, this.bg.height / 2 - 100);
        this.bg.addChild(btn_archive);
        btn_archive.setName("btn_archive");
        
        var btn_reddit = uiUtil.createCommonBtnBlack("reddit.com", this, function () {
            CommonUtil.gotoUrl("https://reddit.com/r/BuriedTown/comments/14k6zcq");
        });
        btn_reddit.setPosition(this.bg.width / 4 * 3 - 30, this.bg.height / 2 - 100);
        this.bg.addChild(btn_reddit);
        btn_reddit.setName("btn_reddit");
        
        var btn_tieba = uiUtil.createCommonBtnBlack("tieba.com", this, function () {
            CommonUtil.gotoUrl("https://tieba.baidu.com/p/8546322916");
        });
        btn_tieba.setPosition(this.bg.width / 4 + 30, this.bg.height / 2 - 200);
        this.bg.addChild(btn_tieba);
        btn_tieba.setName("btn_tieba");
        
        var btn_discord = uiUtil.createCommonBtnBlack("Discord", this, function () {
            var config = {
                title: {title: ""},
                content: {des: "Discord: antcfgss#0"},
                action: {btn_1: {txt: stringUtil.getString(1193)}}
            };
            var toast = new DialogTiny(config);
            toast.show();
        });
        btn_discord.setPosition(this.bg.width / 4 * 3 - 30, this.bg.height / 2 - 200);
        this.bg.addChild(btn_discord);
        btn_discord.setName("btn_discord");
        
        var btn_email = uiUtil.createCommonBtnBlack("Email", this, function () {
            CommonUtil.gotoUrl("mailto:mtngckover@gmail.com");
        });
        btn_email.setPosition(this.bg.width / 4 + 30, this.bg.height / 2 - 300);
        this.bg.addChild(btn_email);
        btn_email.setName("btn_email");
        
        var btn_qq = uiUtil.createCommonBtnBlack("QQ", this, function () {
            var config = {
                title: {title: ""},
                content: {des: "QQ: 3421587952"},
                action: {btn_1: {txt: stringUtil.getString(1193)}}
            };
            var toast = new DialogTiny(config);
            toast.show();
        });
        btn_qq.setPosition(this.bg.width / 4 * 3 - 30, this.bg.height / 2 - 300);
        this.bg.addChild(btn_qq);
        btn_qq.setName("btn_qq");
        
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