/**
 * Created by lancelot on 15/5/22.
 */

var autoSpriteFrameController = {
    _plistInfoCache: {},
    _map: {},

    addSpriteFrames: function (plist) {
        var valueMap = cc.loader.getRes(plist);
        if (valueMap) {
            this._plistInfoCache[plist] = valueMap;
        } else {
            valueMap = this._plistInfoCache[plist];
        }
        var self = this;
        Object.keys(valueMap.frames).forEach(function (spriteFrameName) {
            self._map[spriteFrameName] = plist;
        });
        cc.spriteFrameCache.addSpriteFrames(plist);
    },
    getSpriteFromSpriteName: function (spriteFrameName) {
        if (spriteFrameName instanceof cc.SpriteFrame) {
            var s = new cc.Sprite(spriteFrameName);
            s.width = spriteFrameName.getOriginalSize().width;
            s.height = spriteFrameName.getOriginalSize().height;
            return s;
        } else {
            if (spriteFrameName.indexOf('#') !== -1) {
                spriteFrameName = spriteFrameName.substr(1);
            }
            var spriteFrame = this.getSpriteFrameFromSpriteName(spriteFrameName);
            var s = new cc.Sprite(spriteFrame);
            s.width = spriteFrame.getOriginalSize().width;
            s.height = spriteFrame.getOriginalSize().height;
            return s;
        }
    },
    getSpriteFrameFromSpriteName: function (spriteFrameName) {
        var spriteFrame = cc.spriteFrameCache.getSpriteFrame(spriteFrameName);
        if (!spriteFrame) {
            var plist = this._map[spriteFrameName];
            cc.assert(plist, "plist doesn't exist! spriteFrameName=" + spriteFrameName);
            cc.spriteFrameCache.addSpriteFrames(plist);
            spriteFrame = cc.spriteFrameCache.getSpriteFrame(spriteFrameName);
        }
        return spriteFrame;
    },
    getScale9Sprite: function (spriteFrameName, rect) {
        var spriteFrame = this.getSpriteFrameFromSpriteName(spriteFrameName);
        return new cc.Scale9Sprite(spriteFrame, rect);
    }
};