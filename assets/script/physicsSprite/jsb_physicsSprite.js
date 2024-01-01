cc.PhysicsDebugNode.create = function( space ) {
    var s = space;
    if( space.handle !== undefined )
        s = space.handle;
    return cc.PhysicsDebugNode._create( s );
};

cc.PhysicsDebugNode.prototype._ctor = function(space){
    this.init();
    var s = space;
    if( space.handle !== undefined )
        s = space.handle;
    this.setSpace(s);
};

cc.PhysicsDebugNode.prototype.setSpace = function( space ) {
    var s = space;
    if( space.handle !== undefined )
        s = space.handle;
    return this._setSpace( s );
};

cc.PhysicsSprite.prototype.setBody = function( body ) {
    var b = body;
    if( body.handle !== undefined )
        b = body.handle;
    return this._setCPBody( b );
};

cc.PhysicsSprite.prototype.getBody = function() {
    return this.getCPBody();
};

_safeExtend(cc.PhysicsSprite.prototype, {
    setPositionX: function(x) {
        this.setPosition( cc.p(x, this.getPositionY()) );
    },
    setPositionY: function(y) {
        this.setPosition( cc.p(this.getPositionX(), y) );
    }
});

var _proto = cc.PhysicsSprite.prototype;
cc.defineGetterSetter(_proto, "body", _proto.getBody, _proto.setBody);
cc.defineGetterSetter(_proto, "x", _proto.getPositionX, _proto.setPositionX);
cc.defineGetterSetter(_proto, "y", _proto.getPositionY, _proto.setPositionY);
cc.defineGetterSetter(_proto, "rotation", _proto.getRotation, _proto.setRotation);
cc.defineGetterSetter(_proto, "dirty", _proto.isDirty, _proto.setDirty);

var _p = cc.PhysicsSprite.prototype;
_p._ctor = function(fileName, rect){
    if (fileName === undefined) {
        cc.PhysicsSprite.prototype.init.call(this);
    }else if (typeof(fileName) === "string") {
        if (fileName[0] === "#") {

            var frameName = fileName.substr(1, fileName.length - 1);
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(frameName);
            this.initWithSpriteFrame(spriteFrame);
        } else {

            if(rect)
                this.initWithFile(fileName, rect);
            else
                this.initWithFile(fileName);
        }
    }else if (typeof(fileName) === "object") {
        if (fileName instanceof cc.Texture2D) {

            this.initWithTexture(fileName, rect);
        } else if (fileName instanceof cc.SpriteFrame) {

            this.initWithSpriteFrame(fileName);
        }
    }
};

cc.PhysicsSprite._create = cc.PhysicsSprite.create;
cc.PhysicsSprite.create = function (fileName, rect) {
    var sprite;

    if (arguments.length == 0) {
        sprite = cc.PhysicsSprite._create();
        return sprite;
    }

    if (typeof(fileName) === "string") {
        if (fileName[0] === "#") {

            var frameName = fileName.substr(1, fileName.length - 1);
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(frameName);
            sprite = cc.PhysicsSprite.createWithSpriteFrame(spriteFrame);
        } else {

            sprite = rect ? cc.PhysicsSprite._create(fileName, rect) : cc.PhysicsSprite._create(fileName);
        }
        if (sprite)
            return sprite;
        else return null;
    }

    if (typeof(fileName) === "object") {
        if (fileName instanceof cc.Texture2D) {

            sprite = rect ? cc.PhysicsSprite.createWithTexture(fileName, rect) : cc.PhysicsSprite.createWithTexture(fileName);
        } else if (fileName instanceof cc.SpriteFrame) {

            sprite = cc.PhysicsSprite.createWithSpriteFrame(fileName)
        }
        if (sprite)
            return  sprite;
        else return null;
    }

    return null;
};