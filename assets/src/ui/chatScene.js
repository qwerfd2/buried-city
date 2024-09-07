var CSRF = "";
var SESSION = "";
var chatLayer = cc.Layer.extend({
    onEnter: function() {
        this._super();

        this.username = Record.getUUID();
        this.latestMessageId = 0;
        this.messages = [];
        this.channel = "BDOGr35iuNT4hc06y6O_ES5P96xr3SMqhQ2tdwI1KOY";
        this.apiUrl = "https://studio.code.org/datablock_storage/" + this.channel + "/";
        this.csrfUrl = "https://studio.code.org/projects/applab/" + this.channel;

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
        this.inputField.setPlaceHolder(stringUtil.getString(6665));
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
        this.initData();
        this.fetchMessages(0);
        this.schedule(this.fetchNewMessages, 3);
    },

    initData: function() {
        if (CSRF != "" && SESSION != "") {
            return;
        }
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.csrfUrl, true);
        var self = this;
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var responseText = xhr.responseText;
        
                var metaStart = responseText.indexOf('<meta name="csrf-token" content="');
                
                if (metaStart !== -1) {
                    var contentStart = responseText.indexOf('content="', metaStart) + 9;
                    var contentEnd = responseText.indexOf('"', contentStart);
                    
                    // Extract the token
                    var token = responseText.substring(contentStart, contentEnd);
                    CSRF = token;
                }
                function extractToken(cookieString) {
                    var tokenStart = cookieString.indexOf('_learn_session=');
                    var tokenEnd = cookieString.indexOf(';', tokenStart);
                    
                    if (tokenStart > -1 && tokenEnd > -1) {
                        return cookieString.substring(tokenStart, tokenEnd);
                    } else if (tokenStart > -1) {
                        return cookieString.substring(tokenStart);
                    }
                    return null;
                }
                var setCookieHeader = xhr.getAllResponseHeaders();
                var learnSession = extractToken(setCookieHeader);

                SESSION = learnSession;
            }
        };
        
        xhr.send();
    },

    fetchMessages: function(index, val) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.apiUrl + "read_records?table_name=message", true);
        if (!index) {
            val = true;
        }
        var self = this;
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var data = JSON.parse(xhr.responseText)
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
        var trigger = false;

        data.forEach(function(message) {
            if (message.id > self.latestMessageId){
                trigger = true;
                self.latestMessageId = Math.max(self.latestMessageId, message.id);
                var formattedMessage = message.m;
                self.messages.unshift(formattedMessage);
            }
        });

        if (trigger && val) {
            this.updateTextArea(true);
        } else {
            this.updateTextArea();
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
            return self.wrapText(message.toString(), maxLineLength);
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
        if (message.trim() === "" || CSRF == "" || SESSION == "") {
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.apiUrl + "create_record", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("x-csrf-token", CSRF);
        xhr.setRequestHeader("cookie", SESSION);

        var self = this;
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    if (response.id) {
                        self.inputField.string = "";
                        self.fetchNewMessages(true);
                    }
                }
            }
        };
        var json_data = JSON.stringify({
            u: self.username,
            m: message
        });
        var data = JSON.stringify({
            table_name: "message",
            record_json: json_data
          });
        xhr.send(data);
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
