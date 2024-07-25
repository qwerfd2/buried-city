
var chatLayer = cc.Layer.extend({
    onEnter: function() {
        this._super();

        this.username = Record.getUUID();
        this.latestMessageId = 0;
        this.messages = [];
        this.apiUrl = "http://ec2-3-106-122-234.ap-southeast-2.compute.amazonaws.com/~ec2-user/bc/api.php";

        this.scrollView = new ccui.ScrollView();
        this.scrollView.setDirection(ccui.ScrollView.DIR_VERTICAL);
        this.scrollView.setTouchEnabled(true);
        this.scrollView.setContentSize(cc.size(cc.winSize.width - 20, cc.winSize.height - 120));
        this.scrollView.setInnerContainerSize(this.scrollView.getContentSize());
        this.scrollView.setAnchorPoint(cc.p(0, 0));
        this.scrollView.setPosition(cc.p(10, 100));
        this.addChild(this.scrollView);

        this.textArea = new cc.LabelTTF("", "Arial", 20, cc.size(this.scrollView.getContentSize().width, 0), cc.TEXT_ALIGNMENT_LEFT);
        this.textArea.setAnchorPoint(cc.p(0, 1));
        this.scrollView.addChild(this.textArea);

        this.inputField = new cc.EditBox(cc.size(300, 40), new cc.Scale9Sprite("edit_text_bg.png"));
        this.inputField.setPosition(cc.p(cc.winSize.width / 2, 50));
        this.inputField.setPlaceHolder("Type a message...");
        this.inputField.setDelegate(this);
        this.addChild(this.inputField);

        var btnClose = uiUtil.createSpriteBtn({
            normal: "btn_ad_back.png"
        }, this, function() {
            cc.director.runScene(new MenuScene());
        });
        btnClose.setName("btn_1");
        btnClose.x = cc.winSize.width - 70;
        btnClose.y = cc.winSize.height - 70;
        this.addChild(btnClose);

        this.fetchMessages(0);
        this.schedule(this.fetchNewMessages, 3);
    },

    fetchMessages: function(index, val) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.apiUrl + "?function=getMessage&index=" + index, true);
        if (!index) {
            val = true;
        }
        var self = this;
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var data = JSON.parse(xhr.responseText);
                self.handleNewMessages(data, val);
            }
        };
        xhr.send();
    },

    fetchNewMessages: function(val) {
        this.fetchMessages(this.latestMessageId, val);
    },

    handleNewMessages: function(data, val) {
        var self = this;

        data.forEach(function(message) {
            self.latestMessageId = Math.max(self.latestMessageId, message.id);
            var formattedMessage = message.message;
            self.messages.unshift(formattedMessage);
        });
        if (data.length > 0 && val) {
            self.updateTextArea(true);
        } else {
            self.updateTextArea();
        }
    },

    wrapText: function(message, maxLineLength) {
        var realLen = 0;
        var wrappedMessage = "";
        var words = message.split(" ");

        words.forEach(function(word) {
            for (var i = 0; i < word.length; i++) {
                var charCode = word.charCodeAt(i);
                if (charCode >= 65 && charCode <= 90) {
                    realLen += 1.5;
                } else if (charCode >= 0 && charCode <= 128) {
                    realLen += 1;
                } else {
                    realLen += 2;
                }

                if (realLen > maxLineLength) {
                    wrappedMessage += "\n";
                    realLen = 0;
                }

                wrappedMessage += word[i];
            }

            wrappedMessage += ' ';
            realLen += 1;
        });

        return wrappedMessage.trim();
    },

    updateTextArea: function(bottom) {
        var maxLineLength = 75;
        var self = this;
        var wrappedMessages = this.messages.map(function(message) {
            return self.wrapText(message, maxLineLength);
        });

        wrappedMessages.reverse();

        this.textArea.setString(wrappedMessages.join("\n\n"));

        var textAreaHeight = this.textArea.getContentSize().height;
        var scrollHeight = Math.max(textAreaHeight, this.scrollView.getContentSize().height);
        this.scrollView.setInnerContainerSize(cc.size(this.scrollView.getContentSize().width, scrollHeight));
        this.textArea.setPosition(cc.p(0, scrollHeight));
        if (bottom) {
            this.scrollView.jumpToBottom();
        }
    },

    sendMessage: function() {
        var message = this.inputField.string;
        if (message.trim() === "") {
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.apiUrl + "?function=sendMessage&username=" + this.username + "&message=" + message, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        var self = this;
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.success) {
                    self.inputField.string = "";
                    self.fetchNewMessages(true);
                }
            }
        };
        xhr.send();
    },

    editBoxReturn: function(editBox) {
        this.sendMessage();
    }
});

var chatScene = BaseScene.extend({
    ctor: function () {
        this._super(APP_NAVIGATION.MENU_SUB);
    },
    onEnter: function () {
        this._super();
        var layer = new chatLayer();
        this.addChild(layer);
    },
    onExit: function () {
        this._super();
    }
});
