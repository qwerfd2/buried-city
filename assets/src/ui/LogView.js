/**
 * Created by lancelot on 15/4/21.
 */
var LogView = cc.ScrollView.extend({
    ctor: function (size) {
        this.mycontainer = new cc.Layer();
        this._super(size, this.mycontainer);

        this.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.setBounceable(false);
        this.setClippingToBounds(true);
        this.setDelegate(this);

        this.data = [];
        this.updateContentSize();
        return true;
    },

    addLog: function (msg) {
        var newItem = this.createOneItem(msg);
        newItem.setAnchorPoint(0, 0);
        newItem.setPosition(0, 0);
        this.mycontainer.addChild(newItem);
        this.data.forEach(function (oldItem) {
            oldItem.y += newItem.height;
        });

        this.data.push(newItem);
        this.updateContentSize();
    },
    updateContentSize: function () {
        var height = 0;
        this.data.forEach(function (oldItem) {
            height += oldItem.height;
        });
        height = Math.max(height, this.getViewSize().height);
        this.setContentSize(this.getContentSize().width, height);
    },

    createOneItem: function (msg) {
        var node = new cc.Node();
        var time = new cc.LabelTTF(msg.time, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(this.getViewSize().width - 20, 0));
        time.setAnchorPoint(0, 1);
        time.tag = 1;
        node.addChild(time);
        var msg = new cc.LabelTTF(msg.txt, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(this.getViewSize().width - 20, 0));
        msg.setAnchorPoint(0, 0);
        msg.tag = 2;
        node.addChild(msg);
        node.setContentSize(this.getViewSize().width, time.height + msg.height + 10);
        time.setPosition(0, node.height - 5);
        msg.setPosition(0, 5);
        return node;
    }
});

var LogView2 = cc.ScrollView.extend({
    ctor: function(size) {
        this.mycontainer = new cc.Layer();
        this._super(size, this.mycontainer);

        this.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
        this.setBounceable(false);
        this.setClippingToBounds(true);

        this.setDelegate(this);

        this.data = [];
        this.updateContentSize();
        return true;
    },

    addLog: function(msg) {
        var newItem = this.createOneItem(msg);
        newItem.setAnchorPoint(0, 0);
        newItem.setPosition(0, 0);
        this.mycontainer.addChild(newItem);

        this.data.forEach(function(oldItem) {
            oldItem.y += newItem.height;
        });

        this.data.push(newItem);
        this.updateContentSize();
    },
    updateContentSize: function() {
        var height = 0;
        this.data.forEach(function(oldItem) {
            height += oldItem.height;
        });
        height = Math.max(height, this.getViewSize().height);
        this.setContentSize(this.getContentSize().width, height);
    },

    createOneItem: function(arr) {
        var node = new cc.Node();

        var time = new ccui.Text(stringUtil.getString(1000, arr.ti), "", 20);
        time.setColor(cc.color(0, 0, 0, 255))
        time.setAnchorPoint(0, 1);
        time.tag = 1;
        node.addChild(time);

        var Line = new ccui.Text(String("_").repeat(30), "", 20);
        Line.setColor(cc.color(0, 0, 0, 255))
        Line.setAnchorPoint(0, 1);
        node.addChild(Line);

        var msg = new ccui.Text(stringUtil.getString(9010), "", 20);
        msg.setAnchorPoint(0, 0);
        msg.setColor(cc.color(255, 0, 0, 255))
        msg.setVisible(!arr.ar.length)
        node.addChild(msg);

        var richText = new ItemRichText(arr.ar, arr.ar.length * 85, arr.ar.length, 0.4, cc.color.BLACK, 20);
        richText.setVisible(arr.ar.length);
        node.addChild(richText);

        node.setContentSize(this.getViewSize().width, 50);

        time.setPosition(0, node.height - 6);
        Line.setPosition(-19, 26)
        msg.setPosition(60, node.height - 34);
        richText.setPosition(60, node.height - 34);

        return node;
    }
});

var MessageView = LogView.extend({
    ctor: function (size) {
        this._super(size);
    },
    createOneItem: function (log) {
        var node = new cc.Node();
        var time = new cc.LabelTTF(cc.timer.getTimeStr(Number(log.time)), uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_3, cc.size(this.getViewSize().width, 0));
        time.setAnchorPoint(0, 1);
        time.tag = 1;
        node.addChild(time);
        var msg = new cc.LabelTTF(log.msg, uiUtil.fontFamily.normal, uiUtil.fontSize.COMMON_2, cc.size(this.getViewSize().width, 0));
        msg.setAnchorPoint(0, 0);
        msg.tag = 2;
        node.addChild(msg);
        if (log.uid == Record.getUUID()) {
            msg.setColor(cc.color.RED);
        }
        node.setContentSize(this.getViewSize().width, time.height + msg.height + 10);
        time.setPosition(0, node.height - 5);
        msg.setPosition(0, 5);
        node.log = log;
        return node;
    },
    addLog: function (log) {
        this._super(log);
        this.updateTime();
    },
    updateTime: function () {
        this.mycontainer.getChildren().forEach(function (child) {
            var time = child.getChildByTag(1);
            if (time) {
                time.setString(stringUtil.getString(child.log.uid == Record.getUUID() ? 1150 : 1149, cc.timer.getTimeStr(Number(child.log.time))));
            }
        });
    }
});