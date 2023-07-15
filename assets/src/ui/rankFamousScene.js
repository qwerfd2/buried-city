var RankFamousLayer = cc.Layer.extend({
    ctor: function () {
        this._super();

        return true;
    },

    onExit: function () {
        this._super();
    },

    onEnter: function () {
        this._super();
        if (Record.getScreenFix()) {
            this.setScale(0.83);
        }
        this.bg = new cc.Sprite("res/new/rank_famous_bg.png");
        this.bg.x = cc.winSize.width / 2;
        this.bg.y = cc.winSize.height / 2;
        this.addChild(this.bg);

        this.data = [];
        this.skip = 0;
        this.isEnd = false;
        this.createTableView();
        this.requestData();

        var btn = uiUtil.createCommonBtnBlack(stringUtil.getString(1193), this, function () {
            cc.director.runScene(new MenuScene());
        });
        btn.setPosition(this.bg.width / 2, this.bg.height / 2 - 500);
        this.bg.addChild(btn);
        btn.setName("btn");

        var btnInfo = uiUtil.createSpriteBtn({normal: "icon_info.png"}, this, function () {
            this.showInfoDialog();
        });
        btnInfo.x = 576;
        btnInfo.y = 1066;
        this.bg.addChild(btnInfo);
    },

    showInfoDialog: function () {
        var config = {
            title: {},
            content: {des: stringUtil.getString(1263)},
            action: {btn_1: {}}
        };
        config.action.btn_1.txt = stringUtil.getString(1030);

        var dialog = new DialogTiny(config);
        dialog.show();
    },

    updateView: function () {
        var offsetPos = this.tableView.getContentOffset();
        var contentSize = this.tableView.getContentSize();
        this.tableView.reloadData();
        var newContentSize = this.tableView.getContentSize();
        offsetPos.y -= newContentSize.height - contentSize.height;
        this.tableView.setContentOffset(offsetPos);

        this.tbSliderBar.updateBarSize(this.tableView.getViewSize().height / this.tableView.getContentSize().height);
    },
    requestData: function (doneCb) {
        this.loading = true;
        var self = this;
        this.data = JSON.parse(cc.sys.localStorage.getItem("dataLog") || "[]");
        self.updateView();
        self.skip = self.data.length;
        self.isEnd = this.data.length === 0;
    },
    createTableView: function () {
        this.tableView = new cc.TableView(this, cc.size(610, 840));
        this.tableView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.tableView.setVerticalFillOrder(cc.TABLEVIEW_FILL_TOPDOWN);
        this.tableView.x = 10;
        this.tableView.y = 100;
        this.tableView.setDelegate(this);
        this.bg.addChild(this.tableView);
        this.tableView.reloadData();

        this.tbSliderBar = new SliderBar(cc.size(10, 840));
        this.tbSliderBar.setAnchorPoint(1, 0);
        this.tbSliderBar.x = this.bg.width - 10;
        this.tbSliderBar.y = 100;
        this.bg.addChild(this.tbSliderBar);
        this.tbSliderBar.updateBarSize(this.tableView.getViewSize().height / this.tableView.getContentSize().height);
        this.tbSliderBar.onScroll(1);
    },
    tableCellTouched: function (table, cell) {
    },

    tableCellSizeForIndex: function (table, idx) {
        return cc.size(610, 120);
    },

    tableCellAtIndex: function (table, idx) {
        var cell = table.dequeueCell();
        var size = this.tableCellSizeForIndex(idx);
        var leftEdge = 125;
        var rightEdge = size.width - 15;
        if (!cell) {
            cell = new cc.TableViewCell();

            var tombstone = new cc.Sprite('res/new/icon_tombstone.png');
            tombstone.setAnchorPoint(0, 0.5);
            tombstone.x = 10;
            tombstone.y = size.height / 2;
            cell.addChild(tombstone);

            var username = new cc.LabelTTF('', uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_1);
            username.setAnchorPoint(0, 0.5);
            username.x = leftEdge;
            username.y = size.height - 35;
            username.setColor(cc.color.BLACK);
            username.setName('username');
            cell.addChild(username);

            var createTime = new cc.LabelTTF('', uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_1);
            createTime.setAnchorPoint(1, 0.5);
            createTime.x = rightEdge;
            createTime.y = size.height - 35;
            createTime.setColor(cc.color.BLACK);
            createTime.setName('createTime');
            cell.addChild(createTime);

            var lastWord = new cc.LabelTTF('', uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(rightEdge - leftEdge, 0));
            lastWord.setAnchorPoint(0, 0.5);
            lastWord.x = leftEdge;
            lastWord.y = 25;
            lastWord.setColor(cc.color.BLACK);
            lastWord.setName('lastWord');
            cell.addChild(lastWord);
        }
        var info = this.data[idx];

        cell.getChildByName('username').setString(info.username);
        cell.getChildByName('createTime').setString(cc.formatStr('(%s)', new Date(info.time).format('YYYY.MM.dd')));
        cell.getChildByName('lastWord').setString(stringUtil.getString(1203, info.days[0], info.days[1], info.days[2]) + ", " + stringUtil.getString(1028, info.weight) + ", " + stringUtil.getString(1136, info.distance));

        return cell;
    },

    numberOfCellsInTableView: function (table) {
        return this.data.length;
    },
    scrollViewDidScroll: function (view) {
        if (this.tbSliderBar) {
            this.tbSliderBar.onScroll(view.getContentOffset().y / (view.getViewSize().height - view.getContentSize().height));
        }
    }

});

var RankFamousScene = BaseScene.extend({
    ctor: function () {
        this._super(APP_NAVIGATION.MENU_SUB);
    },
    onEnter: function () {
        this._super();
        var layer = new RankFamousLayer();
        this.addChild(layer);
    },
    onExit: function () {
        this._super();
    }
});