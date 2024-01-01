var _p;

_p = cc.Layer.prototype;
_p._ctor = function() {
    cc.Layer.prototype.init.call(this);
};

_p = cc.LayerColor.prototype;
_p._ctor = function(color, w, h) {
    color = color ||  cc.color(0, 0, 0, 255);
    w = w === undefined ? cc.winSize.width : w;
    h = h === undefined ? cc.winSize.height : h;

    cc.LayerColor.prototype.init.call(this, color, w, h);
};

_p = cc.LayerGradient.prototype;
_p._ctor = function(start, end, v, colorStops) {
    start = start || cc.color(0,0,0,255);
    end = end || cc.color(0,0,0,255);
    v = v || cc.p(0, -1);

    this.initWithColor(start, end, v);

    if (colorStops instanceof Array) {
        cc.log("Warning: Color stops parameter is not supported in JSB.");
    }
};

_p = cc.LayerMultiplex.prototype;
_p._ctor = function(layers) {
    if(layers != undefined){
        if (layers instanceof Array)
            cc.LayerMultiplex.prototype.initWithArray.call(this, layers);
        else
            cc.LayerMultiplex.prototype.initWithArray.call(this, Array.prototype.slice.call(arguments));
    }else{
        cc.LayerMultiplex.prototype.init.call(this);
    }
};

_p = cc.Sprite.prototype;
_p._ctor = function(fileName, rect) {
    if (fileName === undefined) {
        cc.Sprite.prototype.init.call(this);
    }
    else if (typeof(fileName) === "string") {
        if (fileName[0] === "#") {

            var frameName = fileName.substr(1, fileName.length - 1);
            this.initWithSpriteFrameName(frameName);
        } else {

            rect ? this.initWithFile(fileName, rect) : this.initWithFile(fileName);
        }
    }
    else if (typeof(fileName) === "object") {
        if (fileName instanceof cc.Texture2D) {

            rect ? this.initWithTexture(fileName, rect) : this.initWithTexture(fileName);
        } else if (fileName instanceof cc.SpriteFrame) {

            this.initWithSpriteFrame(fileName);
        }
    }
};

_p = cc.SpriteBatchNode.prototype;
_p._ctor = function(fileImage, capacity) {
    capacity = capacity || cc.SpriteBatchNode.DEFAULT_CAPACITY;
    if (typeof(fileImage) == "string")
        this.initWithFile(fileImage, capacity);
    else
        this.initWithTexture(fileImage, capacity);
};

_p = cc.SpriteFrame.prototype;
_p._ctor = function(filename, rect, rotated, offset, originalSize){
    if(originalSize != undefined){
        if(filename instanceof cc.Texture2D)
            this.initWithTexture(filename, rect, rotated, offset, originalSize);
        else
            this.initWithTexture(filename, rect, rotated, offset, originalSize);
    }else if(rect != undefined){
        if(filename instanceof cc.Texture2D)
            this.initWithTexture(filename, rect);
        else
            this.initWithTextureFilename(filename, rect);
    }
};

_p = cc.GridBase.prototype;
_p._ctor = function(gridSize, texture, flipped){
    if(gridSize !== undefined)
        this.initWithSize(gridSize, texture, flipped);
};

_p = cc.Grid3D.prototype;
_p._ctor = function(gridSize, texture, flipped){
    if(gridSize !== undefined)
        this.initWithSize(gridSize, texture, flipped);
};

_p = cc.TiledGrid3D.prototype;
_p._ctor = function(gridSize, texture, flipped){
    if(gridSize !== undefined)
        this.initWithSize(gridSize, texture, flipped);
};

_p = cc.Menu.prototype;
_p._ctor = function(menuItems) {
    if((arguments.length > 0) && (arguments[arguments.length-1] == null))
        cc.log("parameters should not be ending with null in Javascript");

    var argc = arguments.length,
        items = [];
    if (argc == 1) {
        if (menuItems instanceof Array) {
            items = menuItems;
        }
        else{
            items.push(arguments[0]);
        }
    }
    else if (argc > 1) {
        for (var i = 0; i < argc; i++) {
            if (arguments[i])
                items.push(arguments[i]);
        }
    }

    if(items && items.length > 0)
        this.initWithArray(items);
    else
        this.init();
};

_p = cc.MenuItem.prototype;
_p._ctor = function(callback, target) {
    callback && this.initWithCallback(callback.bind(target));
};

_p = cc.MenuItemLabel.prototype;
_p._ctor = function(label, callback, target) {
    callback = callback ? callback.bind(target) : null;
    label && this.initWithLabel(label, callback);
};

_p = cc.MenuItemAtlasFont.prototype;
_p._ctor = function(value, charMapFile, itemWidth, itemHeight, startCharMap, callback, target) {
    callback = callback ? callback.bind(target) : null;
    value !== undefined && this.initWithString(value, charMapFile, itemWidth, itemHeight, startCharMap, callback);
};

_p = cc.MenuItemFont.prototype;
_p._ctor = function(value, callback, target) {
    callback = callback ? callback.bind(target) : null;
    value !== undefined && this.initWithString(value, callback);
};

_p = cc.MenuItemSprite.prototype;
_p._ctor = function(normalSprite, selectedSprite, three, four, five) {
    if (selectedSprite) {
        normalSprite = normalSprite;
        selectedSprite = selectedSprite;
        var disabledSprite, target, callback;
        if (five) {
            disabledSprite = three;
            callback = four;
            target = five;
        } else if (four && typeof four === "function") {
            disabledSprite = three;
            callback = four;
        } else if (four && typeof three === "function") {
            target = four;
            callback = three;
            disabledSprite = normalSprite;
        } else if (three === undefined) {
            disabledSprite = normalSprite;
        }
        callback = callback ? callback.bind(target) : null;
        this.initWithNormalSprite(normalSprite, selectedSprite, disabledSprite, callback);
    }
};

_p = cc.MenuItemImage.prototype;
_p._ctor = function(normalImage, selectedImage, three, four, five) {
    var disabledImage = null,
        callback = null,
        target = null;

    if (normalImage === undefined) {
        cc.MenuItemImage.prototype.init.call(this);
    }
    else {
        if (four === undefined)  {
            callback = three;
        }
        else if (five === undefined) {
            if (typeof three === "function") {
                callback = three;
                target = four;
            }
            else {
                disabledImage = three;
                callback = four;
            }
        }
        else if (five) {
            disabledImage = three;
            callback = four;
            target = five;
        }
        callback = callback ? callback.bind(target) : null;
        this.initWithNormalSprite(new cc.Sprite(normalImage), new cc.Sprite(selectedImage), disabledImage ? new cc.Sprite(disabledImage) : new cc.Sprite(normalImage), callback);
    }
};

_p = cc.MenuItemToggle.prototype;
_p._ctor = function() {
    var argc =  arguments.length, callback, target;

    if (typeof arguments[argc-2] === 'function') {
        callback = arguments[argc-2];
        target = arguments[argc-1];
        argc = argc - 2;
    } else if(typeof arguments[argc-1] === 'function'){
        callback = arguments[argc-1];
        argc = argc - 1;
    }

    if(argc > 0) {
        this.initWithItem(arguments[0]);

        for (var i = 1; i < argc; i++) {
            if (arguments[i])
                this.addSubItem(arguments[i]);
        }
        if (callback)
            target ? this.setCallback(callback, target) : this.setCallback(callback);
    }
    else {
        callback = callback ? callback.bind(target) : null;
        this.initWithCallback(callback);
    }
};

_p = cc.MotionStreak.prototype;
_p._ctor = function(fade, minSeg, stroke, color, texture){
    if(texture !== undefined)
        this.initWithFade(fade, minSeg, stroke, color, texture);
};

_p = cc.ParticleBatchNode.prototype;
_p._ctor = function(fileImage, capacity){
    capacity = capacity || cc.PARTICLE_DEFAULT_CAPACITY;
    if (typeof(fileImage) == "string") {
        cc.ParticleBatchNode.prototype.init.call(this, fileImage, capacity);
    } else if (fileImage instanceof cc.Texture2D) {
        this.initWithTexture(fileImage, capacity);
    }
};

_p = cc.ParticleSystem.prototype;
_p._ctor = function(plistFile){
    if (!plistFile || typeof(plistFile) === "number") {
        var ton = plistFile || 100;
        this.initWithTotalParticles(ton);
    } else if ( typeof plistFile === "string") {
        this.initWithFile(plistFile);
    } else if(plistFile){
        this.initWithDictionary(plistFile);
    }
};

cc.ParticleFire.prototype._ctor  = cc.ParticleFireworks.prototype._ctor
                                      = cc.ParticleSun.prototype._ctor
                                      = cc.ParticleGalaxy.prototype._ctor
                                      = cc.ParticleMeteor.prototype._ctor
                                      = cc.ParticleFlower.prototype._ctor
                                      = cc.ParticleSpiral.prototype._ctor
                                      = cc.ParticleExplosion.prototype._ctor
                                      = cc.ParticleSmoke.prototype._ctor
                                      = cc.ParticleRain.prototype._ctor
                                      = cc.ParticleSnow.prototype._ctor
                                      = function(){
                                            this.init();
                                      };

_p = cc.ProgressTimer.prototype;
_p._ctor = function(sprite){
    sprite !== undefined && this.initWithSprite(sprite);
};

_p = cc.TextFieldTTF.prototype;
_p._ctor = function(placeholder, dimensions, alignment, fontName, fontSize){
    if(fontSize !== undefined){
        this.initWithPlaceHolder("", dimensions, alignment, fontName, fontSize);
        if(placeholder)
            this._placeHolder = placeholder;
    }        
    else if(fontName === undefined && alignment !== undefined){
        fontName = arguments[1];
        fontSize = arguments[2];
        this.initWithString("", fontName, fontSize);
        if(placeholder)
            this._placeHolder = placeholder;
    }
};

_p = cc.RenderTexture.prototype;
_p._ctor = function(width, height, format, depthStencilFormat){
    if(width !== undefined && height !== undefined){
        format = format || cc.Texture2D.PIXEL_FORMAT_RGBA8888;
        depthStencilFormat = depthStencilFormat || 0;
        this.initWithWidthAndHeight(width, height, format, depthStencilFormat);
    }
};

_p = cc.TileMapAtlas.prototype;
_p._ctor = function(tile, mapFile, tileWidth, tileHeight){
    if(tileHeight !== undefined)
        this.initWithTileFile(tile, mapFile, tileWidth, tileHeight);
};

_p = cc.TMXLayer.prototype;
_p._ctor = function(tilesetInfo, layerInfo, mapInfo){
    if(mapInfo !== undefined)
        this.initWithTilesetInfo(tilesetInfo, layerInfo, mapInfo);
};

_p = cc.TMXTiledMap.prototype;
_p._ctor = function(tmxFile,resourcePath){
    if(resourcePath !== undefined){
        this.initWithXML(tmxFile,resourcePath);
    }else if(tmxFile !== undefined){
        this.initWithTMXFile(tmxFile);
    }
};

_p = cc.TMXMapInfo.prototype;
_p._ctor = function(tmxFile, resourcePath){
    if (resourcePath !== undefined) {
        this.initWithXML(tmxFile,resourcePath);
    }else if(tmxFile !== undefined){
        this.initWithTMXFile(tmxFile);
    }
};

_p = cc.TransitionScene.prototype;
_p._ctor = function(t, scene){
    if(t !== undefined && scene !== undefined)
        this.initWithDuration(t, scene);
};

_p = cc.TransitionSceneOriented.prototype;
_p._ctor = function(t, scene, orientation){
    orientation != undefined && this.initWithDuration(t, scene, orientation);
};

_p = cc.TransitionPageTurn.prototype;
_p._ctor = function(t, scene, backwards){
    backwards != undefined && this.initWithDuration(t, scene, backwards);
};

cc.Speed.prototype._ctor = function(action, speed) {
    speed !== undefined && this.initWithAction(action, speed);
};

cc.Follow.prototype._ctor = function (followedNode, rect) {
    if(followedNode)
        rect ? ret.initWithTarget(followedNode, rect)
             : ret.initWithTarget(followedNode);
};

cc.OrbitCamera.prototype._ctor = function (t, radius, deltaRadius, angleZ, deltaAngleZ, angleX, deltaAngleX) {
    deltaAngleX !== undefined && this.initWithDuration(t, radius, deltaRadius, angleZ, deltaAngleZ, angleX, deltaAngleX);
};

cc.CardinalSplineTo.prototype._ctor = cc.CardinalSplineBy.prototype._ctor = function(duration, points, tension) {
    tension !== undefined && this.initWithDuration(duration, points, tension);
};

cc.CatmullRomTo.prototype._ctor = cc.CatmullRomBy.prototype._ctor = function(dt, points) {
    points !== undefined && this.initWithDuration(dt, points);
};

_p = cc.ActionEase.prototype;
_p._ctor = function(action) {
    action !== undefined && this.initWithAction(action);
};
cc.EaseExponentialIn._ctor
    = cc.EaseExponentialOut._ctor
    = cc.EaseExponentialInOut._ctor
    = cc.EaseSineIn._ctor
    = cc.EaseSineOut._ctor
    = cc.EaseSineInOut._ctor
    = cc.EaseBounce._ctor
    = cc.EaseBounceIn._ctor
    = cc.EaseBounceOut._ctor
    = cc.EaseBounceInOut._ctor
    = cc.EaseBackIn._ctor
    = cc.EaseBackOut._ctor
    = cc.EaseBackInOut._ctor
    = _p._ctor;

_p = cc.EaseRateAction.prototype;
_p._ctor = function(action, rate) {
    rate !== undefined && this.initWithAction(action, rate);
};
cc.EaseIn.prototype._ctor
    = cc.EaseOut.prototype._ctor
    = cc.EaseInOut.prototype._ctor
    = _p._ctor;

_p = cc.EaseElastic.prototype;
_p._ctor = function(action, period) {
    if( action ) {
        period !== undefined ? this.initWithAction(action, period)
                             : this.initWithAction(action);
    }
};
cc.EaseElasticIn._ctor
    = cc.EaseElasticOut._ctor
    = cc.EaseElasticInOut._ctor
    = _p._ctor;

cc.ReuseGrid.prototype._ctor = function(times) {
    times !== undefined && this.initWithTimes(times);
};

cc.GridAction.prototype._ctor
    = cc.Grid3DAction.prototype._ctor
    = cc.TiledGrid3DAction.prototype._ctor
    = cc.PageTurn3D.prototype._ctor
    = cc.FadeOutTRTiles.prototype._ctor
    = cc.FadeOutBLTiles.prototype._ctor
    = cc.FadeOutUpTiles.prototype._ctor
    = cc.FadeOutDownTiles.prototype._ctor
    = function(duration, gridSize) {
    gridSize && this.initWithDuration(duration, gridSize);
};

cc.Twirl.prototype._ctor = function(duration, gridSize, position, twirls, amplitude) {
    amplitude !== undefined && this.initWithDuration(duration, gridSize, position, twirls, amplitude);
};

cc.Waves.prototype._ctor = function(duration, gridSize, waves, amplitude, horizontal, vertical) {
    vertical !== undefined && this.initWithDuration(duration, gridSize, waves, amplitude, horizontal, vertical);
};

cc.Liquid.prototype._ctor = function(duration, gridSize, waves, amplitude) {
    amplitude !== undefined && this.initWithDuration(duration, gridSize, waves, amplitude);
};

cc.Shaky3D.prototype._ctor = function(duration, gridSize, range, shakeZ) {
    shakeZ !== undefined && this.initWithDuration(duration, gridSize, range, shakeZ);
};

cc.Ripple3D.prototype._ctor = function(duration, gridSize, position, radius, waves, amplitude) {
    amplitude !== undefined && this.initWithDuration(duration, gridSize, position, radius, waves, amplitude);
};

cc.Lens3D.prototype._ctor = function(duration, gridSize, position, radius) {
    radius !== undefined && this.initWithDuration(duration, gridSize, position, radius);
};

cc.FlipY3D.prototype._ctor
    = cc.FlipX3D.prototype._ctor
    = function(duration) {
    duration !== undefined && this.initWithDuration(duration, cc.size(1, 1));
};

cc.Waves3D.prototype._ctor = function(duration, gridSize, waves, amplitude) {
    amplitude !== undefined && this.initWithDuration(duration, gridSize, waves, amplitude);
};

cc.RemoveSelf.prototype._ctor = function(isNeedCleanUp) {
    isNeedCleanUp !== undefined && cc.RemoveSelf.prototype.init.call(this, isNeedCleanUp);
};

cc.FlipX.prototype._ctor = function(flip) {
    flip !== undefined && this.initWithFlipX(flip);
};

cc.FlipY.prototype._ctor = function(flip) {
    flip !== undefined && this.initWithFlipY(flip);
};

cc.Place.prototype._ctor = function(pos, y) {
    if (pos !== undefined) {
        if (pos.x !== undefined) {
            y = pos.y;
            pos = pos.x;
        }
        this.initWithPosition(pos, y);
    }
};

cc.CallFunc.prototype._ctor = function(selector, selectorTarget, data) {
    if(selector !== undefined){
        if(selectorTarget === undefined)
            this.initWithFunction(selector);
        else this.initWithFunction(selector, selectorTarget, data);
    }
};

cc.ActionInterval.prototype._ctor = function(d) {
    d !== undefined && this.initWithDuration(d);
};

cc.Sequence.prototype._ctor = function(tempArray) {
    var paramArray = (tempArray instanceof Array) ? tempArray : arguments;
    var last = paramArray.length - 1;
    if ((last >= 0) && (paramArray[last] == null))
        cc.log("parameters should not be ending with null in Javascript");

    if (last >= 0) {
        var prev = paramArray[0];
        for (var i = 1; i < last; i++) {
            if (paramArray[i]) {
                prev = cc.Sequence.create(prev, paramArray[i]);
            }
        }
        this.initWithTwoActions(prev, paramArray[last]);
    }
};

cc.Repeat.prototype._ctor = function(action, times) {
    times !== undefined && this.initWithAction(action, times);
};

cc.RepeatForever.prototype._ctor = function(action) {
    action !== undefined && this.initWithAction(action);
};

cc.Spawn.prototype._ctor = function(tempArray) {
    var paramArray = (tempArray instanceof Array) ? tempArray : arguments;
    var last = paramArray.length - 1;
    if ((last >= 0) && (paramArray[last] == null))
        cc.log("parameters should not be ending with null in Javascript");

    if (last >= 0) {
        var prev = paramArray[0];
        for (var i = 1; i < last; i++) {
            if (paramArray[i]) {
                prev = cc.Spawn.create(prev, paramArray[i]);
            }
        }
        this.initWithTwoActions(prev, paramArray[last]);
    }
};

cc.RotateTo.prototype._ctor = cc.RotateBy.prototype._ctor = function(duration, deltaAngleX, deltaAngleY) {
    if (deltaAngleX !== undefined) {
        if (deltaAngleY !== undefined)
            this.initWithDuration(duration, deltaAngleX, deltaAngleY);
        else
            this.initWithDuration(duration, deltaAngleX);
    }
};

cc.MoveBy.prototype._ctor = cc.MoveTo.prototype._ctor = function(duration, pos, y) {
    if (pos !== undefined) {
        if(pos.x === undefined) {
            pos = cc.p(pos, y);
        }

        this.initWithDuration(duration, pos);
    }
};

cc.SkewTo.prototype._ctor = cc.SkewBy.prototype._ctor = function(t, sx, sy) {
    sy !== undefined && this.initWithDuration(t, sx, sy);
};

cc.JumpBy.prototype._ctor = cc.JumpTo.prototype._ctor = function(duration, position, y, height, jumps) {
    if (height !== undefined) {
        if (jumps !== undefined) {
            position = cc.p(position, y);
        }
        else {
            jumps = height;
            height = y;
        }
        this.initWithDuration(duration, position, height, jumps);
    }
};

cc.BezierBy.prototype._ctor = cc.BezierTo.prototype._ctor = function(t, c) {
    c !== undefined && this.initWithDuration(t, c);
};

cc.ScaleTo.prototype._ctor = cc.ScaleBy.prototype._ctor = function(duration, sx, sy) {
    if (sx !== undefined) {
        if (sy !== undefined)
            this.initWithDuration(duration, sx, sy);
        else this.initWithDuration(duration, sx);
    }
};

cc.Blink.prototype._ctor = function(duration, blinks) {
    blinks !== undefined && this.initWithDuration(duration, blinks);
};

cc.FadeTo.prototype._ctor = function(duration, opacity) {
    opacity !== undefined && this.initWithDuration(duration, opacity);
};

cc.FadeIn.prototype._ctor = function(duration) {
    duration !== undefined && this.initWithDuration(duration, 255);
};

cc.FadeOut.prototype._ctor = function(duration) {
    duration !== undefined && this.initWithDuration(duration, 0);
};

cc.TintTo.prototype._ctor = cc.TintBy.prototype._ctor = function(duration, red, green, blue) {
    blue !== undefined && this.initWithDuration(duration, red, green, blue);
};

cc.DelayTime.prototype._ctor = function(duration) {
    duration !== undefined && this.initWithDuration(duration);
};

cc.Animate.prototype._ctor = function(animation) {
    animation && this.initWithAnimation(animation);
};

cc.TargetedAction.prototype._ctor = function(target, action) {
    action && this.initWithTarget(target, action);
};

cc.ProgressTo.prototype._ctor = function(duration, percent) {
    percent !== undefined && this.initWithDuration(duration, percent);
};

cc.ProgressFromTo.prototype._ctor = function(duration, fromPercentage, toPercentage) {
    toPercentage !== undefined && this.initWithDuration(duration, fromPercentage, toPercentage);
};

cc.SplitCols.prototype._ctor = cc.SplitRows.prototype._ctor = function(duration, rowsCols) {
    rowsCols !== undefined && this.initWithDuration(duration, rowsCols);
};

cc.JumpTiles3D.prototype._ctor = function(duration, gridSize, numberOfJumps, amplitude) {
    amplitude !== undefined && this.initWithDuration(duration, gridSize, numberOfJumps, amplitude);
};

cc.WavesTiles3D.prototype._ctor = function(duration, gridSize, waves, amplitude) {
    amplitude !== undefined && this.initWithDuration(duration, gridSize, waves, amplitude);
};

cc.TurnOffTiles.prototype._ctor = function(duration, gridSize, seed) {
    if (gridSize !== undefined) {
        seed = seed || 0;
        this.initWithDuration(duration, gridSize, seed);
    }
};

cc.ShakyTiles3D.prototype._ctor = function(duration, gridSize, range, shakeZ) {
    shakeZ !== undefined && this.initWithDuration(duration, gridSize, range, shakeZ);
};

cc.ShatteredTiles3D.prototype._ctor = function(duration, gridSize, range, shatterZ) {
    shatterZ !== undefined && this.initWithDuration(duration, gridSize, range, shatterZ);
};

cc.ShuffleTiles.prototype._ctor = function(duration, gridSize, seed) {
    seed !== undefined && this.initWithDuration(duration, gridSize, seed);
};

cc.ActionTween.prototype._ctor = function(duration, key, from, to) {
    to !== undefined && this.initWithDuration(duration, key, from, to);
};

cc.Animation.prototype._ctor = function(frames, delay, loops) {
    if (frames === undefined) {
        this.init();
    } else {
        var frame0 = frames[0];
        delay = delay === undefined ? 0 : delay;
        loops = loops === undefined ? 1 : loops;
        if(frame0){
            if (frame0 instanceof cc.SpriteFrame) {

                this.initWithSpriteFrames(frames, delay, loops);
            }else if(frame0 instanceof cc.AnimationFrame) {

                this.initWithAnimationFrames(frames, delay, loops);
            }
        }
    }
};

cc.AnimationFrame.prototype._ctor = function(spriteFrame, delayUnits, userInfo) {
    delayUnits !== undefined && this.initWithSpriteFrame(spriteFrame, delayUnits, userInfo);
};

cc.AtlasNode.prototype._ctor = function(tile, tileWidth, tileHeight, itemsToRender) {
    itemsToRender !== undefined && this.initWithTileFile(tile, tileWidth, tileHeight, itemsToRender);
};

cc.ClippingNode.prototype._ctor = function(stencil) {
    if(stencil != undefined)
        cc.ClippingNode.prototype.init.call(this, stencil);
    else
        cc.ClippingNode.prototype.init.call(this);
};

cc.DrawNode.prototype._ctor = function() {
    cc.DrawNode.prototype.init.call(this);
};

cc.LabelAtlas.prototype._ctor = function(strText, charMapFile, itemWidth, itemHeight, startCharMap) {
    if(startCharMap != undefined){
        startCharMap = startCharMap.charCodeAt(0);
        cc.LabelAtlas.prototype.initWithString.call(this, strText, charMapFile, itemWidth, itemHeight, startCharMap);
    }else if(charMapFile != undefined){
        this.initWithString(strText, charMapFile);
    }
};

cc.LabelBMFont.prototype._ctor = function(str, fntFile, width, alignment, imageOffset) {
    str = str || "";
    if( fntFile ) {
        width = width || 0;
        alignment = alignment === undefined ? cc.TEXT_ALIGNMENT_LEFT : alignment;
        imageOffset = imageOffset || cc.p(0, 0);
        cc.LabelBMFont.prototype.initWithString.call(this, str, fntFile, width, alignment, imageOffset);
    }
};

cc.LabelTTF.prototype._ctor = function(text, fontName, fontSize, dimensions, hAlignment, vAlignment) {
    text = text || "";
    if (fontName && fontName instanceof cc.FontDefinition) {
        this.initWithStringAndTextDefinition(text, fontName);
    }
    else {
        fontName = fontName || "";
        fontSize = fontSize || 16;
        dimensions = dimensions || cc.size(0,0);
        hAlignment = hAlignment === undefined ? cc.TEXT_ALIGNMENT_LEFT : hAlignment;
        vAlignment = vAlignment === undefined ? cc.VERTICAL_TEXT_ALIGNMENT_TOP : vAlignment;
        this.initWithString(text, fontName, fontSize, dimensions, hAlignment, vAlignment);
    }
};

cc.EventTouch.prototype._ctor = function(touches) {
    touches !== undefined && cc.EventTouch.prototype.setTouches.call(this, touches);
};
cc.Touch.prototype._ctor = function(x, y, id) {
    id !== undefined && cc.Touch.prototype.setTouchInfo.call(this, x, y, id);
};

cc.GLProgram.prototype._ctor = function(vShaderFileName, fShaderFileName) {
    if(vShaderFileName !== undefined && fShaderFileName !== undefined){
        cc.GLProgram.prototype.init.call(this, vShaderFileName, fShaderFileName);
        cc.GLProgram.prototype.link.call(this);
        cc.GLProgram.prototype.updateUniforms.call(this);
    } 
};

cc.Sprite._create = cc.Sprite.create;

cc.Sprite.create = function (fileName, rect) {
    var sprite;

    if (arguments.length == 0) {
        sprite = cc.Sprite._create();
        return sprite;
    }

    if (typeof(fileName) === "string") {
        if (fileName[0] === "#") {

            var frameName = fileName.substr(1, fileName.length - 1);
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(frameName);
            sprite = cc.Sprite.createWithSpriteFrame(spriteFrame);
        } else {

            sprite = rect ? cc.Sprite._create(fileName, rect) : cc.Sprite._create(fileName);
        }
        if (sprite)
            return sprite;
        else return null;
    }

    if (typeof(fileName) === "object") {
        if (fileName instanceof cc.Texture2D) {

            sprite = rect ? cc.Sprite.createWithTexture(fileName, rect) : cc.Sprite.createWithTexture(fileName);
        } else if (fileName instanceof cc.SpriteFrame) {

            sprite = cc.Sprite.createWithSpriteFrame(fileName);
        }
        if (sprite)
            return  sprite;
        else return null;
    }

    return null;
};

cc.LabelTTF._create = cc.LabelTTF.create;

cc.LabelTTF.create = function (text, fontName, fontSize, dimensions, hAlignment, vAlignment) {
    var label;
    if (fontName && fontName instanceof cc.FontDefinition) {
        label = cc.LabelTTF.createWithFontDefinition(text, fontName);
    }
    else {
        fontName = fontName || "";
        fontSize = fontSize || 16;
        dimensions = dimensions || cc.size(0, 0);
        hAlignment = hAlignment == undefined ? cc.TEXT_ALIGNMENT_CENTER : hAlignment;
        vAlignment = vAlignment == undefined ? cc.VERTICAL_TEXT_ALIGNMENT_TOP : vAlignment;
        label = cc.LabelTTF._create(text, fontName, fontSize, dimensions, hAlignment, vAlignment);
    }
    if (label)
        return label;
    else return null;
};

cc.SpriteBatchNode._create = cc.SpriteBatchNode.create;

cc.SpriteBatchNode.create = function(fileName, capacity){
    if (typeof(fileName) == "string")
        return cc.SpriteBatchNode._create(fileName);
    else if (fileName instanceof cc.Texture2D) {
        return isNaN(capacity) ? cc.SpriteBatchNode.createWithTexture(fileName) :  cc.SpriteBatchNode.createWithTexture(fileName,capacity);
    }
    return null;
};

cc.SpriteFrame._create = cc.SpriteFrame.create;

cc.SpriteFrame.create = function(fileName, rect, rotated, offset, originalSize){
    var spriteFrame = null;
    switch (arguments.length) {
        case 2:
            if (fileName instanceof cc.Texture2D)
                spriteFrame = cc.SpriteFrame.createWithTexture(fileName, rect);
            else spriteFrame = cc.SpriteFrame._create(fileName, rect);
            break;
        case 5:
            spriteFrame = cc.SpriteFrame._create(fileName, rect, rotated, offset, originalSize);
            break;
        default:
            throw "Argument must be non-nil ";
            break;
    }
    return spriteFrame;
};

cc.ParticleSystem._create = cc.ParticleSystem.create;

cc.ParticleSystem.create = function(plistFile){
    var particleSystem =null;
    if (typeof(plistFile) === "number") {
        particleSystem = cc.ParticleSystem.createWithTotalParticles(plistFile);
    }else if(typeof(plistFile) === "string" || typeof(plistFile) === "object"){
        particleSystem = cc.ParticleSystem._create(plistFile);
    }
    return particleSystem;
};

cc.ParticleBatchNode._create = cc.ParticleBatchNode.create;

cc.ParticleBatchNode.create = function(fileImage, capacity){
    if (typeof(fileImage) == "string")
        return cc.ParticleBatchNode._create(fileImage);
    else if (fileImage instanceof cc.Texture2D) {
        return isNaN(capacity) ? cc.ParticleBatchNode.createWithTexture(fileImage) :  cc.ParticleBatchNode.createWithTexture(fileImage, capacity);
    }
    return null;
};

cc.TMXTiledMap._create = cc.TMXTiledMap.create;

cc.TMXTiledMap.create = function (tmxFile, resourcePath) {
    if(resourcePath != undefined){
        return cc.TMXTiledMap.createWithXML(tmxFile, resourcePath);
    } else if (tmxFile != undefined) {
        return cc.TMXTiledMap._create(tmxFile);
    }
    return null;
};

cc.MenuItemImage.create = function(normalImage, selectedImage, three, four, five) {
    return new cc.MenuItemImage(normalImage, selectedImage, three, four, five);
}

cc.MenuItemToggle.create = function() {
    var n = arguments.length;

    if (typeof arguments[n-2] === 'function' || typeof arguments[n-1] === 'function')   {
        var args = Array.prototype.slice.call(arguments);
        var obj = null;
        if( typeof arguments[n-2] === 'function' )
            obj = args.pop();

        var func = args.pop();

        var item = cc.MenuItemToggle._create.apply(this, args);

        if( obj !== null )
            item.setCallback(func, obj);
        else
            item.setCallback(func);
        return item;
    } else {
        return cc.MenuItemToggle._create.apply(this, arguments);
    }
};

cc.LabelAtlas.create = function( a,b,c,d,e ) {

    var n = arguments.length;

    if ( n == 5) {
        return cc.LabelAtlas._create(a,b,c,d,e.charCodeAt(0));
    } else {
        return cc.LabelAtlas._create.apply(this, arguments);
    }
};

cc.LayerMultiplex.create = cc.LayerMultiplex.createWithArray;

cc.Animation.create = function (frames, delay, loops) {
    if(frames === undefined){
        return cc.Animation.createWithAnimationFrames();
    }
    else if(frames[0] && frames[0] instanceof cc.AnimationFrame){
        return cc.Animation.createWithAnimationFrames.apply(this, arguments);
    }
    else if(frames[0] && frames[0] instanceof cc.SpriteFrame){
        delay = delay || 0;
        return cc.Animation.createWithSpriteFrames.apply(this, arguments);
    }
};

cc.Menu.create = function(menuItems) {
    if((arguments.length > 0) && (arguments[arguments.length-1] == null))
        cc.log("parameters should not be ending with null in Javascript");

    var argc = arguments.length,
        items = [];
    if (argc == 1) {
        if (menuItems instanceof Array) {
            items = menuItems;
        }
        else{
            items.push(arguments[0]);
        }
    }
    else if (argc > 1) {
        for (var i = 0; i < argc; i++) {
            if (arguments[i])
                items.push(arguments[i]);
        }
    }
    return cc.Menu._create.apply(null, items);
};