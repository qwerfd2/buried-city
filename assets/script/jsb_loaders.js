cc._emptyLoader = {
    load : function(realUrl, url){
        return null;
    }
};

cc.loader.register([
                        "mp3", "ogg", "wav", "mp4", "m4a", 
                        "font", "eot", "ttf", "woff", "svg", "gaf"
                    ], 
                    cc._emptyLoader);

cc._txtLoader = {
    load : function(realUrl, url){
        return jsb.fileUtils.getStringFromFile(realUrl);
    }
};
cc.loader.register(["txt", "xml", "vsh", "fsh", "tmx", "tsx"], cc._txtLoader);

cc._jsonLoader = {
    load : function(realUrl, url){
        var data = jsb.fileUtils.getStringFromFile(realUrl);
        try{
            return JSON.parse(data);
        }catch(e){
            cc.error(e);
            return null;
        }
    }
};
cc.loader.register(["json", "ExportJson"], cc._jsonLoader);

cc._imgLoader = {
    load : function(realUrl, url, res, cb){
        cc.loader.loadImg(realUrl, function(err, img){
            if(err) {
                cb && cb(err);
                return;
            }
            cc.loader.cache[url] = img;
            cb && cb(null, img);
        });
    }
};
cc.loader.register(["png", "jpg", "bmp","jpeg","gif"], cc._imgLoader);

cc._plistLoader = {
    load : function(realUrl, url){
        var content = jsb.fileUtils.getStringFromFile(realUrl);
        return cc.plistParser.parse(content);
    }
};
cc.loader.register(["plist"], cc._plistLoader);

cc._binaryLoader = {
    load : function(realUrl, url){
        return cc.loader.loadBinarySync(realUrl);
    }
};
cc.loader.register(["ccbi"], cc._binaryLoader);

cc._fntLoader = {
    INFO_EXP : /info [^\n]*(\n|$)/gi,
    COMMON_EXP : /common [^\n]*(\n|$)/gi,
    PAGE_EXP : /page [^\n]*(\n|$)/gi,
    CHAR_EXP : /char [^\n]*(\n|$)/gi,
    KERNING_EXP : /kerning [^\n]*(\n|$)/gi,
    ITEM_EXP : /\w+=[^ \r\n]+/gi,
    INT_EXP : /^[\-]?\d+$/,

    _parseStrToObj : function(str){
        var arr = str.match(this.ITEM_EXP);
        var obj = {};
        if(arr){
            for(var i = 0, li = arr.length; i < li; i++){
                var tempStr = arr[i];
                var index = tempStr.indexOf("=");
                var key = tempStr.substring(0, index);
                var value = tempStr.substring(index + 1);
                if(value.match(this.INT_EXP)) value = parseInt(value);
                else if(value[0] == '"') value = value.substring(1, value.length - 1);
                obj[key] = value;
            }
        }
        return obj;
    },
    parseFnt : function(fntStr, url){
        var self = this, fnt = {};

        var infoObj = self._parseStrToObj(fntStr.match(self.INFO_EXP)[0]);
        var paddingArr = infoObj["padding"].split(",");
        var padding = {
            left : parseInt(paddingArr[0]),
            top : parseInt(paddingArr[1]),
            right : parseInt(paddingArr[2]),
            bottom : parseInt(paddingArr[3])
        };

        var commonObj = self._parseStrToObj(fntStr.match(self.COMMON_EXP)[0]);
        fnt.commonHeight = commonObj["lineHeight"];
        if (cc._renderType === cc._RENDER_TYPE_WEBGL) {
            var texSize = cc.configuration.getMaxTextureSize();
            if(commonObj["scaleW"] > texSize.width || commonObj["scaleH"] > texSize.height)
                cc.log("cc.LabelBMFont._parseCommonArguments(): page can't be larger than supported");
        }
        if(commonObj["pages"] !== 1) cc.log("cc.LabelBMFont._parseCommonArguments(): only supports 1 page");

        var pageObj = self._parseStrToObj(fntStr.match(self.PAGE_EXP)[0]);
        if(pageObj["id"] !== 0) cc.log("cc.LabelBMFont._parseImageFileName() : file could not be found");
        fnt.atlasName = cc.path.changeBasename(url, pageObj["file"]);

        var charLines = fntStr.match(self.CHAR_EXP);
        var fontDefDictionary = fnt.fontDefDictionary = {};
        for(var i = 0, li = charLines.length; i < li; i++){
            var charObj = self._parseStrToObj(charLines[i]);
            var charId = charObj["id"];
            fontDefDictionary[charId] = {
                rect : {x : charObj["x"], y : charObj["y"], width : charObj["width"], height : charObj["height"]},
                xOffset : charObj["xoffset"],
                yOffset : charObj["yoffset"],
                xAdvance : charObj["xadvance"]
            };
        }

        var kerningDict = fnt.kerningDict = {};
        var kerningLines = fntStr.match(self.KERNING_EXP);
        if(kerningLines){
            for(var i = 0, li = kerningLines.length; i < li; i++){
                var kerningObj = self._parseStrToObj(kerningLines[i]);
                kerningDict[(kerningObj["first"] << 16) | (kerningObj["second"] & 0xffff)] = kerningObj["amount"];
            }
        }
        return fnt;
    },

    load : function(realUrl, url){
        var data = jsb.fileUtils.getStringFromFile(realUrl);
        return this.parseFnt(data, url);
    }
};
cc.loader.register(["fnt"], cc._fntLoader);