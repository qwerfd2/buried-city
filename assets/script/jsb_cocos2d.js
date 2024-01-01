cc.ENGINE_VERSION = "Cocos2d-JS v3.6";

cc.FIX_ARTIFACTS_BY_STRECHING_TEXEL = 0;
cc.DIRECTOR_STATS_POSITION = {x: 0, y: 0};
cc.DIRECTOR_FPS_INTERVAL = 0.5;
cc.COCOSNODE_RENDER_SUBPIXEL = 1;
cc.SPRITEBATCHNODE_RENDER_SUBPIXEL = 1;
cc.OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA = 0;
cc.TEXTURE_ATLAS_USE_TRIANGLE_STRIP = 0;
cc.TEXTURE_ATLAS_USE_VAO = 0;
cc.TEXTURE_NPOT_SUPPORT = 0;
cc.RETINA_DISPLAY_SUPPORT = 1;
cc.RETINA_DISPLAY_FILENAME_SUFFIX = "-hd";
cc.USE_LA88_LABELS = 1;
cc.SPRITE_DEBUG_DRAW = 0;
cc.SPRITEBATCHNODE_DEBUG_DRAW = 0;
cc.LABELBMFONT_DEBUG_DRAW = 0;
cc.LABELATLAS_DEBUG_DRAW = 0;
cc.IS_RETINA_DISPLAY_SUPPORTED = 1;
cc.DEFAULT_ENGINE = cc.ENGINE_VERSION + "-native";
cc.ENABLE_STACKABLE_ACTIONS = 1;
cc.ENABLE_GL_STATE_CACHE = 1;

cc.ResolutionPolicy = {

    EXACT_FIT:0,

    NO_BORDER:1,

    SHOW_ALL:2,

    FIXED_HEIGHT:3,

    FIXED_WIDTH:4,

    UNKNOWN:5
};

cc.LANGUAGE_ENGLISH    = 0;
cc.LANGUAGE_CHINESE    = 1;
cc.LANGUAGE_FRENCH     = 2;
cc.LANGUAGE_ITALIAN    = 3;
cc.LANGUAGE_GERMAN     = 4;
cc.LANGUAGE_SPANISH    = 5;
cc.LANGUAGE_RUSSIAN    = 6;
cc.LANGUAGE_KOREAN     = 7;
cc.LANGUAGE_JAPANESE   = 8;
cc.LANGUAGE_HUNGARIAN  = 9;
cc.LANGUAGE_PORTUGUESE = 10;
cc.LANGUAGE_ARABIC     = 11;

cc.Director.PROJECTION_2D = 0;
cc.Director.PROJECTION_3D = 1;
cc.Director.PROJECTION_CUSTOM = 3;
cc.Director.PROJECTION_DEFAULT = cc.Director.PROJECTION_3D;

cc.DEVICE_ORIENTATION_PORTRAIT = 0;
cc.DEVICE_ORIENTATION_LANDSCAPE_LEFT = 1;
cc.DEVICE_ORIENTATION_PORTRAIT_UPSIDE_DOWN = 2;
cc.DEVICE_ORIENTATION_LANDSCAPE_RIGHT = 3;
cc.DEVICE_MAX_ORIENTATIONS = 2;

cc.IMAGE_FORMAT_JPEG = 0;
cc.IMAGE_FORMAT_PNG = 1;
cc.IMAGE_FORMAT_RAWDATA = 9;

cc.TOUCH_ALL_AT_ONCE = 0;
cc.TOUCH_ONE_BY_ONE = 1;

cc.TRANSITION_ORIENTATION_LEFT_OVER = 0;
cc.TRANSITION_ORIENTATION_RIGHT_OVER = 1;
cc.TRANSITION_ORIENTATION_UP_OVER = 0;
cc.TRANSITION_ORIENTATION_DOWN_OVER = 1;

cc.RED = {r:255, g:0, b:0};
cc.GREEN = {r:0, g:255, b:0};
cc.BLUE = {r:0, g:0, b:255};
cc.BLACK = {r:0, g:0, b:0};
cc.WHITE = {r:255, g:255, b:255};
cc.YELLOW = {r:255, g:255, b:0};

cc.POINT_ZERO = {x:0, y:0};

cc.PARTICLE_DEFAULT_CAPACITY = 500;

cc.MENU_STATE_WAITING = 0;
cc.MENU_STATE_TRACKING_TOUCH = 1;
cc.MENU_HANDLER_PRIORITY = -128;
cc.DEFAULT_PADDING = 5;

cc.Scheduler.PRIORITY_SYSTEM    = -2147483648;

var _Class = cc.Texture2D;

_Class.PIXEL_FORMAT_NONE = -1;
_Class.PIXEL_FORMAT_AUTO = 0;
_Class.PIXEL_FORMAT_BGRA8888 = 1;
_Class.PIXEL_FORMAT_RGBA8888 = 2;
_Class.PIXEL_FORMAT_RGB888 = 3;
_Class.PIXEL_FORMAT_RGB565 = 4;
_Class.PIXEL_FORMAT_A8 = 5;
_Class.PIXEL_FORMAT_I8 = 6;
_Class.PIXEL_FORMAT_AI88 = 7;
_Class.PIXEL_FORMAT_RGBA4444 = 8;
_Class.PIXEL_FORMAT_RGB5A1 = 9;
_Class.PIXEL_FORMAT_PVRTC4 = 10;
_Class.PIXEL_FORMAT_PVRTC4A = 11;
_Class.PIXEL_FORMAT_PVRTC2 = 11;
_Class.PIXEL_FORMAT_PVRTC2A = 13;
_Class.PIXEL_FORMAT_ETC = 14;
_Class.PIXEL_FORMAT_S3TC_DXT1 = 15;
_Class.PIXEL_FORMAT_S3TC_DXT3 = 16;
_Class.PIXEL_FORMAT_S3TC_DXT5 = 17;
_Class.PIXEL_FORMAT_ATC_RGB = 18;
_Class.PIXEL_FORMAT_ATC_EXPLICIT_ALPHA = 19;
_Class.PIXEL_FORMAT_ATC_INTERPOLATED_ALPHA = 20;
_Class.PIXEL_FORMAT_DEFAULT = _Class.PIXEL_FORMAT_AUTO;
_Class.defaultPixelFormat = _Class.PIXEL_FORMAT_DEFAULT;

cc.ONE = 1;
cc.ZERO = 0;
cc.SRC_ALPHA = 0x0302;
cc.SRC_ALPHA_SATURATE = 0x308;
cc.SRC_COLOR = 0x300;
cc.DST_ALPHA = 0x304;
cc.DST_COLOR = 0x306;
cc.ONE_MINUS_SRC_ALPHA = 0x0303;
cc.ONE_MINUS_SRC_COLOR = 0x301;
cc.ONE_MINUS_DST_ALPHA = 0x305;
cc.ONE_MINUS_DST_COLOR = 0x0307;
cc.ONE_MINUS_CONSTANT_ALPHA = 0x8004;
cc.ONE_MINUS_CONSTANT_COLOR = 0x8002;

cc.LINEAR   = 0x2601;
cc.REPEAT   = 0x2901;
cc.CLAMP_TO_EDGE    = 0x812f;
cc.MIRRORED_REPEAT   = 0x8370;

cc.VERTEX_ATTRIB_FLAG_NONE = 0;
cc.VERTEX_ATTRIB_FLAG_POSITION = 1 << 0;
cc.VERTEX_ATTRIB_FLAG_COLOR = 1 << 1;
cc.VERTEX_ATTRIB_FLAG_TEX_COORDS = 1 << 2;
cc.VERTEX_ATTRIB_FLAG_POS_COLOR_TEX = ( cc.VERTEX_ATTRIB_FLAG_POSITION | cc.VERTEX_ATTRIB_FLAG_COLOR | cc.VERTEX_ATTRIB_FLAG_TEX_COORDS );
cc.GL_ALL = 0;

cc.VERTEX_ATTRIB_POSITION = 0;
cc.VERTEX_ATTRIB_COLOR = 1;
cc.VERTEX_ATTRIB_TEX_COORDS = 2;
cc.VERTEX_ATTRIB_MAX = 3;

cc.UNIFORM_PMATRIX = 0;
cc.UNIFORM_MVMATRIX = 1;
cc.UNIFORM_MVPMATRIX = 2;
cc.UNIFORM_TIME = 3;
cc.UNIFORM_SINTIME = 4;
cc.UNIFORM_COSTIME = 5;
cc.UNIFORM_RANDOM01 = 6;
cc.UNIFORM_SAMPLER = 7;
cc.UNIFORM_MAX = 8;

cc.UNIFORM_TIME_S = "CC_Time";
cc.UNIFORM_COS_TIME_S   = 'CC_CosTime';
cc.UNIFORM_COSTIME_S = "CC_CosTime";
cc.UNIFORM_SIN_TIME_S   = 'CC_SinTime';
cc.UNIFORM_SINTIME_S = "CC_SinTime";
cc.UNIFORM_PMATRIX_S = "CC_PMatrix";
cc.UNIFORM_MVMATRIX_S = "CC_MVMatrix";
cc.UNIFORM_MVPMATRIX_S = "CC_MVPMatrix";
cc.UNIFORM_P_MATRIX_S   = 'CC_PMatrix';
cc.UNIFORM_MV_MATRIX_S  = 'CC_MVMatrix';
cc.UNIFORM_MVP_MATRIX_S = 'CC_MVPMatrix';
cc.UNIFORM_RANDOM01_S   = 'CC_Random01';
cc.UNIFORM_SAMPLER_S    = 'CC_Texture0';
cc.UNIFORM_ALPHA_TEST_VALUE_S = "CC_AlphaValue";

cc.ITEM_SIZE = 32;

cc.CURRENT_ITEM = 0xc0c05001;
cc.ZOOM_ACTION_TAG = 0xc0c05002;
cc.NORMAL_TAG = 8801;
cc.SELECTED_TAG = 8802;
cc.DISABLE_TAG = 8803;

cc.stencilBits = -1;           

cc.g_NumberOfDraws = 0;        

cc.PRIORITY_NON_SYSTEM = cc.PRIORITY_SYSTEM + 1;          

cc.s_globalOrderOfArrival = 1;

cc.Event.TOUCH = 0;                  
cc.Event.KEYBOARD = 1;
cc.Event.ACCELERATION = 2;
cc.Event.MOUSE = 3;
cc.Event.FOCUS = 4

cc.Event.CUSTOM = 6;
cc.EventMouse.NONE = 0;
cc.EventMouse.DOWN = 1;
cc.EventMouse.UP = 2;
cc.EventMouse.MOVE = 3;
cc.EventMouse.SCROLL = 4;
cc.EventMouse.BUTTON_LEFT = 0;
cc.EventMouse.BUTTON_RIGHT = 2;
cc.EventMouse.BUTTON_MIDDLE = 1;
cc.EventMouse.BUTTON_4 = 3;
cc.EventMouse.BUTTON_5 = 4;
cc.EventMouse.BUTTON_6 = 5;
cc.EventMouse.BUTTON_7 = 6;
cc.EventMouse.BUTTON_8 = 7;
cc.EventTouch.MAX_TOUCHES = 5;
cc.EventTouch.EventCode = {BEGAN: 0, MOVED: 1, ENDED: 2, CANCELLED: 3};

cc.SpriteBatchNode.DEFAULT_CAPACITY = 29;                  

cc.ParticleSystem.SHAPE_MODE = 0;            
cc.ParticleSystem.TEXTURE_MODE = 1;
cc.ParticleSystem.STAR_SHAPE = 0;
cc.ParticleSystem.BALL_SHAPE = 1;

cc.ProgressTimer.TEXTURE_COORDS_COUNT = 4;       
cc.ProgressTimer.TEXTURE_COORDS = 0x4b;

cc.IMAGE_FORMAT_RAWDATA = 2;           

cc.TMXLayerInfo.ATTRIB_NONE = 1 << 0;            
cc.TMXLayerInfo.ATTRIB_BASE64 = 1 << 1;
cc.TMXLayerInfo.ATTRIB_GZIP = 1 << 2;
cc.TMXLayerInfo.ATTRIB_ZLIB = 1 << 3;
cc.TMX_PROPERTY_NONE = 0;
cc.TMX_PROPERTY_MAP = 1;
cc.TMX_PROPERTY_LAYER = 2;
cc.TMX_PROPERTY_OBJECTGROUP = 3;
cc.TMX_PROPERTY_OBJECT = 4;
cc.TMX_PROPERTY_TILE = 5;

cc.SCENE_FADE = 4208917214;             

cc.SCENE_RADIAL = 0xc001;               

cc.INVALID_INDEX = -1;

cc.PI = Math.PI;

cc.FLT_MAX = parseFloat('3.402823466e+38F');

cc.RAD = cc.PI / 180;

cc.DEG = 180 / cc.PI;

cc.UINT_MAX = 0xffffffff;

cc.swap = function (x, y, ref) {
    if ((typeof ref) == 'object' && (typeof ref.x) != 'undefined' && (typeof ref.y) != 'undefined') {
        var tmp = ref[x];
        ref[x] = ref[y];
        ref[y] = tmp;
    } else
        cc.log("cc.swap is being modified from original macro, please check usage");
};

cc.lerp = function (a, b, r) {
    return a + (b - a) * r;
};

cc.rand = function () {
    return Math.random() * 0xffffff;
};

cc.randomMinus1To1 = function () {
    return (Math.random() - 0.5) * 2;
};

cc.random0To1 = Math.random;

cc.degreesToRadians = function (angle) {
    return angle * cc.RAD;
};

cc.radiansToDegrees = function (angle) {
    return angle * cc.DEG;
};

cc.REPEAT_FOREVER = 0xffffffff;

cc.BLEND_SRC = cc.OPTIMIZE_BLEND_FUNC_FOR_PREMULTIPLIED_ALPHA ? 1 : 0x0302;

cc.BLEND_DST = 0x0303;

cc.nodeDrawSetup = function (node) {

    if (node._shaderProgram) {

        node._shaderProgram.use();
        node._shaderProgram.setUniformForModelViewAndProjectionMatrixWithMat4();
    }
};

cc.enableDefaultGLStates = function () {

};

cc.disableDefaultGLStates = function () {

};

cc.incrementGLDraws = function (addNumber) {
    cc.g_NumberOfDraws += addNumber;
};

cc.FLT_EPSILON = 0.0000001192092896;

cc.contentScaleFactor = cc.IS_RETINA_DISPLAY_SUPPORTED ? function () {
    return cc.director.getContentScaleFactor();
} : function () {
    return 1;
};

cc.pointPointsToPixels = function (points) {
    var scale = cc.contentScaleFactor();
    return cc.p(points.x * scale, points.y * scale);
};

cc.pointPixelsToPoints = function (pixels) {
    var scale = cc.contentScaleFactor();
    return cc.p(pixels.x / scale, pixels.y / scale);
};

cc._pointPixelsToPointsOut = function(pixels, outPoint){
    var scale = cc.contentScaleFactor();
    outPoint.x = pixels.x / scale;
    outPoint.y = pixels.y / scale;
};

cc.sizePointsToPixels = function (sizeInPoints) {
    var scale = cc.contentScaleFactor();
    return cc.size(sizeInPoints.width * scale, sizeInPoints.height * scale);
};

cc.sizePixelsToPoints = function (sizeInPixels) {
    var scale = cc.contentScaleFactor();
    return cc.size(sizeInPixels.width / scale, sizeInPixels.height / scale);
};

cc._sizePixelsToPointsOut = function (sizeInPixels, outSize) {
    var scale = cc.contentScaleFactor();
    outSize.width = sizeInPixels.width / scale;
    outSize.height = sizeInPixels.height / scale;
};

cc.rectPixelsToPoints = cc.IS_RETINA_DISPLAY_SUPPORTED ? function (pixel) {
    var scale = cc.contentScaleFactor();
    return cc.rect(pixel.x / scale, pixel.y / scale,
        pixel.width / scale, pixel.height / scale);
} : function (p) {
    return p;
};

cc.rectPointsToPixels = cc.IS_RETINA_DISPLAY_SUPPORTED ? function (point) {
    var scale = cc.contentScaleFactor();
    return cc.rect(point.x * scale, point.y * scale,
        point.width * scale, point.height * scale);
} : function (p) {
    return p;
};

cc.checkGLErrorDebug = function () {
    if (cc.renderMode == cc._RENDER_TYPE_WEBGL) {
        var _error = cc._renderContext.getError();
        if (_error) {
            cc.log(CC._localZOrder.checkGLErrorDebug, _error);
        }
    }
};

cc._reuse_p = [ {x:0, y:0}, {x:0,y:0}, {x:0,y:0}, {x:0,y:0} ];
cc._reuse_p_index = 0;
cc._reuse_size = {width:0, height:0};
cc._reuse_rect = {x:0, y:0, width:0, height:0};
cc._reuse_color3b = {r:255, g:255, b:255 };
cc._reuse_color4b = {r:255, g:255, b:255, a:255 };

cc.p = function( x, y )
{
    if (x == undefined)
        return {x: 0, y: 0};
    if (y == undefined)
        return {x: x.x, y: x.y};
    return {x:x, y:y};
};
cc._p = function( x, y )
{
    if( cc._reuse_p_index == cc._reuse_p.length )
        cc._reuse_p_index = 0;

    var p = cc._reuse_p[ cc._reuse_p_index];
    cc._reuse_p_index++;
    p.x = x;
    p.y = y;
    return p;
};

cc.pointEqualToPoint = function (point1, point2) {
    return ((point1.x == point2.x) && (point1.y == point2.y));
};

cc.PointZero = function () {
    return cc.p(0, 0);
};

cc.pUnrotate = function (v1, v2) {
    return cc.p(v1.x * v2.x + v1.y * v2.y, v1.y * v2.x - v1.x * v2.y);
};

cc.pForAngle = function (a) {
    return cc.p(Math.cos(a), Math.sin(a));
};

cc.pToAngle = function (v) {
    return Math.atan2(v.y, v.x);
};

cc.clampf = function (value, min_inclusive, max_inclusive) {
    if (min_inclusive > max_inclusive) {
        var temp = min_inclusive;
        min_inclusive = max_inclusive;
        max_inclusive = temp;
    }
    return value < min_inclusive ? min_inclusive : value < max_inclusive ? value : max_inclusive;
};

cc.pFromSize = function (s) {
    return cc.p(s.width, s.height);
};

cc.pCompOp = function (p, opFunc) {
    return cc.p(opFunc(p.x), opFunc(p.y));
};

cc.pLerp = function (a, b, alpha) {
    return cc.pAdd(cc.pMult(a, 1 - alpha), cc.pMult(b, alpha));
};

cc.pFuzzyEqual = function (a, b, variance) {
    if (a.x - variance <= b.x && b.x <= a.x + variance) {
        if (a.y - variance <= b.y && b.y <= a.y + variance)
            return true;
    }
    return false;
};

cc.pCompMult = function (a, b) {
    return cc.p(a.x * b.x, a.y * b.y);
};

cc.pAngleSigned = function (a, b) {
    var a2 = cc.pNormalize(a);
    var b2 = cc.pNormalize(b);
    var angle = Math.atan2(a2.x * b2.y - a2.y * b2.x, cc.pDot(a2, b2));
    if (Math.abs(angle) < cc.POINT_EPSILON)
        return 0.0;
    return angle;
};

cc.pAngle = function (a, b) {
    var angle = Math.acos(cc.pDot(cc.pNormalize(a), cc.pNormalize(b)));
    if (Math.abs(angle) < cc.POINT_EPSILON) return 0.0;
    return angle;
};

cc.pRotateByAngle = function (v, pivot, angle) {
    var r = cc.pSub(v, pivot);
    var cosa = Math.cos(angle), sina = Math.sin(angle);
    var t = r.x;
    r.x = t * cosa - r.y * sina + pivot.x;
    r.y = t * sina + r.y * cosa + pivot.y;
    return r;
};

cc.pLineIntersect = function (A, B, C, D, retP) {
    if ((A.x == B.x && A.y == B.y) || (C.x == D.x && C.y == D.y)) {
        return false;
    }
    var BAx = B.x - A.x;
    var BAy = B.y - A.y;
    var DCx = D.x - C.x;
    var DCy = D.y - C.y;
    var ACx = A.x - C.x;
    var ACy = A.y - C.y;

    var denom = DCy * BAx - DCx * BAy;

    retP.x = DCx * ACy - DCy * ACx;
    retP.y = BAx * ACy - BAy * ACx;

    if (denom == 0) {
        if (retP.x == 0 || retP.y == 0) {

            return true;
        }

        return false;
    }

    retP.x = retP.x / denom;
    retP.y = retP.y / denom;

    return true;
};

cc.pSegmentIntersect = function (A, B, C, D) {
    var retP = cc.p(0, 0);
    if (cc.pLineIntersect(A, B, C, D, retP))
        if (retP.x >= 0.0 && retP.x <= 1.0 && retP.y >= 0.0 && retP.y <= 1.0)
            return true;
    return false;
};

cc.pIntersectPoint = function (A, B, C, D) {
    var retP = cc.p(0, 0);

    if (cc.pLineIntersect(A, B, C, D, retP)) {

        var P = cc.p(0, 0);
        P.x = A.x + retP.x * (B.x - A.x);
        P.y = A.y + retP.x * (B.y - A.y);
        return P;
    }

    return cc.p(0,0);
};

cc.pSameAs = function (A, B) {
    if ((A != null) && (B != null)) {
        return (A.x == B.x && A.y == B.y);
    }
    return false;
};

cc.pZeroIn = function(v) {
    v.x = 0;
    v.y = 0;
};

cc.pIn = function(v1, v2) {
    v1.x = v2.x;
    v1.y = v2.y;
};

cc.pMultIn = function(point, floatVar) {
    point.x *= floatVar;
    point.y *= floatVar;
};

cc.pSubIn = function(v1, v2) {
    v1.x -= v2.x;
    v1.y -= v2.y;
};

cc.pAddIn = function(v1, v2) {
    v1.x += v2.x;
    v1.y += v2.y;
};

cc.pNormalizeIn = function(v) {
    cc.pMultIn(v, 1.0 / Math.sqrt(v.x * v.x + v.y * v.y));
};

cc._g = function( x, y )
{
    cc._reuse_grid.x = x;
    cc._reuse_grid.y = y;
    return cc._reuse_grid;
};

cc.size = function(w,h)
{
    return {width:w, height:h};
};
cc._size = function(w,h)
{
    cc._reuse_size.width = w;
    cc._reuse_size.height = h;
    return cc._reuse_size;
};
cc.sizeEqualToSize = function (size1, size2)
{
    return ((size1.width == size2.width) && (size1.height == size2.height));
};

cc.SizeZero = function () {
    return cc.size(0, 0);
};

cc.rect = function(x,y,w,h)
{
    var argLen = arguments.length;
    if (argLen === 0)
        return { x: 0, y: 0, width: 0, height: 0 };

    if (argLen === 1)
        return { x: x.x, y: x.y, width: x.width, height: x.height };

    if (argLen === 2)
        return { x: x.x, y: x.y, width: y.width, height: y.height };

    if (argLen === 4)
        return { x: x, y: y, width: w, height: h };

    throw "unknown argument type";
};
cc._rect = function(x,y,w,h)
{
    cc._reuse_rect.x = x;
    cc._reuse_rect.y = y;
    cc._reuse_rect.width = w;
    cc._reuse_rect.height = h;
    return cc._reuse_rect;
};
cc.rectEqualToRect = function (rect1, rect2) {
    return ( rect1.x==rect2.x && rect1.y==rect2.y && rect1.width==rect2.width && rect1.height==rect2.height);
};

cc.rectContainsRect = function (rect1, rect2) {
    if ((rect1.x >= rect2.x) || (rect1.y >= rect2.y) ||
        ( rect1.x + rect1.width <= rect2.x + rect2.width) ||
        ( rect1.y + rect1.height <= rect2.y + rect2.height))
        return false;
    return true;
};

cc.rectGetMaxX = function (rect) {
    return (rect.x + rect.width);
};

cc.rectGetMidX = function (rect) {
    return (rect.x + rect.width / 2.0);
};

cc.rectGetMinX = function (rect) {
    return rect.x;
};

cc.rectGetMaxY = function (rect) {
    return(rect.y + rect.height);
};

cc.rectGetMidY = function (rect) {
    return rect.y + rect.height / 2.0;
};

cc.rectGetMinY = function (rect) {
    return rect.y;
};

cc.rectContainsPoint = function (rect, point) {
    var ret = false;
    if (point.x >= rect.x && point.x <= rect.x + rect.width &&
        point.y >= rect.y && point.y <= rect.y + rect.height) {
        ret = true;
    }
    return ret;
};

cc.rectIntersectsRect = function( rectA, rectB )
{
    var bool = ! (  rectA.x > rectB.x + rectB.width ||
                    rectA.x + rectA.width < rectB.x ||
                    rectA.y > rectB.y +rectB.height ||
                    rectA.y + rectA.height < rectB.y );

    return bool;
};

cc.rectOverlapsRect = function (rectA, rectB)
{
    return !((rectA.x + rectA.width < rectB.x) ||
             (rectB.x + rectB.width < rectA.x) ||
             (rectA.y + rectA.height < rectB.y) ||
             (rectB.y + rectB.height < rectA.y));
};

cc.rectUnion = function (rectA, rectB) {
    var rect = cc.rect(0, 0, 0, 0);
    rect.x = Math.min(rectA.x, rectB.x);
    rect.y = Math.min(rectA.y, rectB.y);
    rect.width = Math.max(rectA.x + rectA.width, rectB.x + rectB.width) - rect.x;
    rect.height = Math.max(rectA.y + rectA.height, rectB.y + rectB.height) - rect.y;
    return rect;
};

cc.rectIntersection = function (rectA, rectB) {
    var intersection = cc.rect(
        Math.max(rectA.x, rectB.x),
        Math.max(rectA.y, rectB.y),
        0, 0);

    intersection.width = Math.min(rectA.x+rectA.width, rectB.x+rectB.width) - intersection.x;
    intersection.height = Math.min(rectA.y+rectA.height, rectB.y+rectB.height) - intersection.y;
    return intersection;
};

cc.RectZero = function () {
    return cc.rect(0, 0, 0, 0);
};

cc.Color = function (r, g, b, a) {
    this.r = r || 0;
    this.g = g || 0;
    this.b = b || 0;
    this.a = a || 255;
};

cc.color = function (r, g, b, a) {
    if (r === undefined)
        return {r: 0, g: 0, b: 0, a: 255};
    if (typeof r === "string")
        return cc.hexToColor(r);
    if (typeof r === "object")
        return {r: r.r, g: r.g, b: r.b, a: r.a || 255};
    return  {r: r, g: g, b: b, a: a || 255};
};

cc.colorEqual = function(color1, color2){
    return color1.r === color2.r && color1.g === color2.g && color1.b === color2.b;
};

cc.hexToColor = function (hex) {
    hex = hex.replace(/^#?/, "0x");
    var c = parseInt(hex);
    var r = c >> 16;
    var g = (c >> 8) % 256;
    var b = c % 256;
    return cc.color(r, g, b);
};

cc.colorToHex = function (color) {
    var hR = color.r.toString(16);
    var hG = color.g.toString(16);
    var hB = color.b.toString(16);
    var hex = "#" + (color.r < 16 ? ("0" + hR) : hR) + (color.g < 16 ? ("0" + hG) : hG) + (color.b < 16 ? ("0" + hB) : hB);
    return hex;
};

cc.color._getWhite = function(){
    return cc.color(255, 255, 255, 255);
};

cc.color._getYellow = function () {
    return cc.color(255, 255, 0, 255);
};

cc.color._getBlue = function () {
    return  cc.color(0, 0, 255, 255);
};

cc.color._getGreen = function () {
    return cc.color(0, 255, 0, 255);
};

cc.color._getRed = function () {
    return cc.color(255, 0, 0, 255);
};

cc.color._getMagenta = function () {
    return cc.color(255, 0, 255, 255);
};

cc.color._getBlack = function () {
    return cc.color(0, 0, 0, 255);
};

cc.color._getOrange = function () {
    return cc.color(255, 127, 0, 255);
};

cc.color._getGray = function () {
    return cc.color(166, 166, 166, 255);
};
var _proto = cc.color;

_proto.WHITE;
cc.defineGetterSetter(_proto, "WHITE", _proto._getWhite);

_proto.YELLOW;
cc.defineGetterSetter(_proto, "YELLOW", _proto._getYellow);

_proto.BLUE;
cc.defineGetterSetter(_proto, "BLUE", _proto._getBlue);

_proto.GREEN;
cc.defineGetterSetter(_proto, "GREEN", _proto._getGreen);

_proto.RED;
cc.defineGetterSetter(_proto, "RED", _proto._getRed);

_proto.MAGENTA;
cc.defineGetterSetter(_proto, "MAGENTA", _proto._getMagenta);

_proto.BLACK;
cc.defineGetterSetter(_proto, "BLACK", _proto._getBlack);

_proto.ORANGE;
cc.defineGetterSetter(_proto, "ORANGE", _proto._getOrange);

_proto.GRAY;
cc.defineGetterSetter(_proto, "GRAY", _proto._getGray);

cc.associateWithNative = function( jsobj, superclass_or_instance ) {};

cc.inherits = function (childCtor, parentCtor) {

    function tempCtor() {};
    tempCtor.prototype = parentCtor.prototype;
    childCtor.superClass_ = parentCtor.prototype;
    childCtor.prototype = new tempCtor();
    childCtor.prototype.constructor = childCtor;

};
cc.base = function(me, opt_methodName, var_args) {
    var caller = arguments.callee.caller;
    if (caller.superClass_) {

        ret =  caller.superClass_.constructor.apply( me, Array.prototype.slice.call(arguments, 1));
        return ret;
    }

    var args = Array.prototype.slice.call(arguments, 2);
    var foundCaller = false;
    for (var ctor = me.constructor;
        ctor; ctor = ctor.superClass_ && ctor.superClass_.constructor) {
        if (ctor.prototype[opt_methodName] === caller) {
            foundCaller = true;
        } else if (foundCaller) {
            return ctor.prototype[opt_methodName].apply(me, args);
        }
    }

    if (me[opt_methodName] === caller) {
        return me.constructor.prototype[opt_methodName].apply(me, args);
    } else {
        throw Error(
                    'cc.base called from a method of one name ' +
                    'to a method of a different name');
    }
};

var ClassManager = {
    id : (0|(Math.random()*998)),

    instanceId : (0|(Math.random()*998)),

    getNewID : function(){
        return this.id++;
    },

    getNewInstanceId : function(){
        return this.instanceId++;
    }
};

cc.Class = function(){};
cc.Class.extend = function (prop) {
    var _super = this.prototype;

    initializing = true;
    var prototype = Object.create(_super);
    initializing = false;
    fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

    for (var name in prop) {

        prototype[name] = typeof prop[name] == "function" &&
            typeof _super[name] == "function" && fnTest.test(prop[name]) ?
            (function (name, fn) {
                return function () {
                    var tmp = this._super;

                    this._super = _super[name];

                    var ret = fn.apply(this, arguments);
                    this._super = tmp;

                    return ret;
                };
            })(name, prop[name]) :
            prop[name];
    }

    function Class() {

        if (!initializing) {
            if (!this.ctor) {
                if (this.__nativeObj)
                    cc.log("No ctor function found! Please check whether `classes_need_extend` section in `ini` file like which in `tools/tojs/cocos2dx.ini`");
            }
            else {
                this.ctor.apply(this, arguments);
            }
        }
    }

    var classId = ClassManager.getNewID();
    ClassManager[classId] = _super;
    var desc = { writable: true, enumerable: false, configurable: true };
    Class.id = classId;
    desc.value = classId;
    Object.defineProperty(prototype, '__pid', desc);

    Class.prototype = prototype;

    Class.prototype.constructor = Class;

    Class.extend = arguments.callee;

    return Class;
};

cc.Node.extend = cc.Class.extend;
cc.AtlasNode.extend = cc.Class.extend;
cc.Layer.extend = cc.Class.extend;
cc.LayerGradient.extend = cc.Class.extend;
cc.LayerColor.extend = cc.Class.extend;
cc.LayerMultiplex.extend = cc.Class.extend;
cc.Sprite.extend = cc.Class.extend;
cc.SpriteBatchNode.extend = cc.Class.extend;
cc.SpriteFrame.extend = cc.Class.extend;
cc.LabelTTF.extend = cc.Class.extend;
cc.LabelBMFont.extend = cc.Class.extend;
cc.LabelAtlas.extend = cc.Class.extend;
cc.Menu.extend = cc.Class.extend;
cc.MenuItem.extend = cc.Class.extend;
cc.MenuItemLabel.extend = cc.Class.extend;
cc.MenuItemFont.extend = cc.Class.extend;
cc.MenuItemAtlasFont.extend = cc.Class.extend;
cc.MenuItemSprite.extend = cc.Class.extend;
cc.MenuItemImage.extend = cc.Class.extend;
cc.MenuItemToggle.extend = cc.Class.extend;
cc.Scene.extend = cc.Class.extend;
cc.ClippingNode.extend = cc.Class.extend;
cc.ProgressTimer.extend = cc.Class.extend;
cc.ParallaxNode.extend = cc.Class.extend;
cc.DrawNode.extend = cc.Class.extend;
cc.Component.extend = cc.Class.extend;
cc.GridBase.extend = cc.Class.extend;
cc.Grid3D.extend = cc.Class.extend;
cc.TiledGrid3D.extend = cc.Class.extend;
cc.MotionStreak.extend = cc.Class.extend;
cc.ParticleBatchNode.extend = cc.Class.extend;
cc.ParticleSystem.extend = cc.Class.extend;
cc.TextFieldTTF.extend = cc.Class.extend;
cc.RenderTexture.extend = cc.Class.extend;
cc.TileMapAtlas.extend = cc.Class.extend;
cc.TMXLayer.extend = cc.Class.extend;
cc.TMXTiledMap.extend = cc.Class.extend;
cc.TMXMapInfo.extend = cc.Class.extend;
cc.TransitionScene.extend = cc.Class.extend;
cc.GLProgram.extend = cc.Class.extend;

cc.Loader = cc.Class.extend({
    initWith:function (resources, selector, target) {
        if (selector) {
            this._selector = selector;
            this._target = target;
        }
        this._selector.call(this._target);
    }
});

cc.Loader.preload = function (resources, selector, target) {
    if (!this._instance) {
        this._instance = new cc.Loader();
    }
    this._instance.initWith(resources, selector, target);
    return this._instance;
};

cc.LoaderScene = cc.Loader;

var ConfigType = {
    NONE: 0,
    COCOSTUDIO: 1
};

var __onParseConfig = function(type, str) {
    if (type === ConfigType.COCOSTUDIO) {
        ccs.triggerManager.parse(JSON.parse(str));
    }
};

var _windowTimeIntervalId = 0;
var _windowTimeFunHash = {};
var WindowTimeFun = cc.Class.extend({
    _code: null,
    _intervalId: 0,
    ctor: function (code) {
        this._intervalId = _windowTimeIntervalId++;
        this._code = code;
    },
    fun: function () {
        if (!this._code) return;
        var code = this._code;
        if (typeof code == "string") {
            Function(code)();
        }
        else if (typeof code == "function") {
            code.apply(null, this._args);
        }
    }
});

var setTimeout = function (code, delay) {
    var target = new WindowTimeFun(code);
    if (arguments.length > 2)
        target._args = Array.prototype.slice.call(arguments, 2);
    var original = target.fun;
    target.fun = function () {
        original.apply(this, arguments);
        clearTimeout(target._intervalId);
    }
    cc.director.getScheduler().schedule(target.fun, target, delay / 1000, 0, 0, false, target._intervalId+"");
    _windowTimeFunHash[target._intervalId] = target;
    return target._intervalId;
};

var setInterval = function (code, delay) {
    var target = new WindowTimeFun(code);
    if (arguments.length > 2)
        target._args = Array.prototype.slice.call(arguments, 2);
    cc.director.getScheduler().schedule(target.fun, target, delay / 1000, cc.REPEAT_FOREVER, 0, false, target._intervalId+"");
    _windowTimeFunHash[target._intervalId] = target;
    return target._intervalId;
};

var clearInterval = function (intervalId) {
    var target = _windowTimeFunHash[intervalId];
    if (target) {
        cc.director.getScheduler().unschedule(target._intervalId+"", target);
        delete _windowTimeFunHash[intervalId];
    }
};
var clearTimeout = clearInterval;

cc.EventListener.UNKNOWN = 0;
cc.EventListener.TOUCH_ONE_BY_ONE = 1;
cc.EventListener.TOUCH_ALL_AT_ONCE = 2;
cc.EventListener.KEYBOARD = 3;
cc.EventListener.MOUSE = 4;
cc.EventListener.ACCELERATION = 5;
cc.EventListener.FOCUS = 6;

cc.EventListener.CUSTOM = 8;

cc.EventListener.create = function(argObj){
    if(!argObj || !argObj.event){
        throw "Invalid parameter.";
    }
    var listenerType = argObj.event;
    delete argObj.event;

    var listener = null;
    if(listenerType === cc.EventListener.TOUCH_ONE_BY_ONE) {
        listener = cc.EventListenerTouchOneByOne.create();
        if (argObj.swallowTouches) {
            listener.setSwallowTouches(argObj.swallowTouches);
        }
    }
    else if(listenerType === cc.EventListener.TOUCH_ALL_AT_ONCE)
        listener = cc.EventListenerTouchAllAtOnce.create();
    else if(listenerType === cc.EventListener.MOUSE)
        listener = cc.EventListenerMouse.create();
    else if(listenerType === cc.EventListener.CUSTOM){
        listener = cc.EventListenerCustom.create(argObj.eventName, argObj.callback);
        delete argObj.eventName;
        delete argObj.callback;
    } else if(listenerType === cc.EventListener.KEYBOARD)
        listener = cc.EventListenerKeyboard.create();
    else if(listenerType === cc.EventListener.ACCELERATION){
        listener = cc.EventListenerAcceleration.create(argObj.callback);
        delete argObj.callback;
    }else if(listenerType === cc.EventListener.FOCUS){
        listener = cc.EventListenerFocus.create();
    }
    else
    {
        cc.log("Error: Invalid listener type.");
    }

    for(var key in argObj) {

        if (key == "onMouseDown" || key == "onMouseMove")
            listener["_" + key] = argObj[key];
        else listener[key] = argObj[key];
    }

    return listener;
};

cc.eventManager.addListener = function(listener, nodeOrPriority) {
    if(!(listener instanceof cc.EventListener)) {
        listener = cc.EventListener.create(listener);
    }

    if (typeof nodeOrPriority == "number") {
        if (nodeOrPriority == 0) {
            cc.log("0 priority is forbidden for fixed priority since it's used for scene graph based priority.");
            return;
        }

        cc.eventManager.addEventListenerWithFixedPriority(listener, nodeOrPriority);
    } else {
        cc.eventManager.addEventListenerWithSceneGraphPriority(listener, nodeOrPriority);
    }

    return listener;
};

cc.eventManager.dispatchCustomEvent = function (eventName, optionalUserData) {
    var ev = new cc.EventCustom(eventName);
    ev.setUserData(optionalUserData);
    this.dispatchEvent(ev);
};

cc.EventCustom.prototype.setUserData = function(userData) {
    this._userData = userData;
};

cc.EventCustom.prototype.getUserData = function() {
    return this._userData;
};

cc.inputManager = {
    setAccelerometerEnabled: cc.Device.setAccelerometerEnabled,
    setAccelerometerInterval: cc.Device.setAccelerometerInterval,
    getDPI: cc.Device.getDPI
};

cc.EventListenerTouchOneByOne.prototype.clone = function() {
    var ret = cc.EventListenerTouchOneByOne.create();
    ret.onTouchBegan = this.onTouchBegan;
    ret.onTouchMoved = this.onTouchMoved;
    ret.onTouchEnded = this.onTouchEnded;
    ret.onTouchCancelled = this.onTouchCancelled;
    ret.setSwallowTouches(this.isSwallowTouches());
    return ret;
};

cc.EventListenerTouchAllAtOnce.prototype.clone = function() {
    var ret = cc.EventListenerTouchAllAtOnce.create();
    ret.onTouchesBegan = this.onTouchesBegan;
    ret.onTouchesMoved = this.onTouchesMoved;
    ret.onTouchesEnded = this.onTouchesEnded;
    ret.onTouchesCancelled = this.onTouchesCancelled;
    return ret;
};

cc.EventListenerKeyboard.prototype.clone = function() {
    var ret = cc.EventListenerKeyboard.create();
    ret.onKeyPressed = this.onKeyPressed;
    ret.onKeyReleased = this.onKeyReleased;
    return ret;
};

cc.EventListenerFocus.prototype.clone = function() {
    var ret = cc.EventListenerFocus.create();
    ret.onFocusChanged = this.onFocusChanged;
    return ret;
};

cc.EventListenerMouse.prototype.clone = function() {
    var ret = cc.EventListenerMouse.create();
    ret._onMouseDown = this._onMouseDown;
    ret._onMouseMove = this._onMouseMove;
    ret.onMouseUp = this.onMouseUp;
    ret.onMouseScroll = this.onMouseScroll;
    return ret;
};
cc.EventListenerMouse.prototype.onMouseMove = function(event) {
    if (!this._onMouseMove)
        return;
    event._listener = this;
    this._onMouseMove(event);
    this._previousX = event.getLocationX();
    this._previousY = event.getLocationY();
};
cc.EventListenerMouse.prototype.onMouseDown = function(event) {
    if (!this._onMouseDown)
        return;
    event._listener = this;
    this._previousX = event.getLocationX();
    this._previousY = event.getLocationY();
    this._onMouseDown(event);
};

cc.EventListenerKeyboard.prototype._onKeyPressed = function(keyCode, event) {
    if (!this.onKeyPressed)
        return;
    this.onKeyPressed(jsbKeyArr[keyCode], event);
};

cc.EventListenerKeyboard.prototype._onKeyReleased = function(keyCode, event) {
    if (!this.onKeyReleased)
        return;
    this.onKeyReleased(jsbKeyArr[keyCode], event);
};

cc.EventMouse.prototype.getLocation = function(){
    return { x: this.getLocationX(), y: this.getLocationY() };
};

cc.EventMouse.prototype.getLocationInView = function() {
    return {x: this.getLocationX(), y: cc.view.getDesignResolutionSize().height - this.getLocationY()};
};

cc.EventMouse.prototype.getDelta = function(){
    if (isNaN(this._listener._previousX)) {
        this._listener._previousX = this.getLocationX();
        this._listener._previousY = this.getLocationY();
    }
    return { x: this.getLocationX() - this._listener._previousX, y: this.getLocationY() - this._listener._previousY };
};

cc.EventMouse.prototype.getDeltaX = function(){
    if (isNaN(this._listener._previousX)) {
        this._listener._previousX = this.getLocationX();
        this._listener._previousY = this.getLocationY();
    }
    return this.getLocationX() - this._listener._previousX;
};

cc.EventMouse.prototype.getDeltaY = function(){
    if (isNaN(this._listener._previousX)) {
        this._listener._previousX = this.getLocationX();
        this._listener._previousY = this.getLocationY();
    }
    return this.getLocationY() - this._listener._previousY;
};

cc.Touch.prototype.getLocationX = function(){
    return this.getLocation().x;
};

cc.Touch.prototype.getLocationY = function(){
    return this.getLocation().y;
};

cc.Director.EVENT_PROJECTION_CHANGED = "director_projection_changed";
cc.Director.EVENT_AFTER_DRAW = "director_after_draw";
cc.Director.EVENT_AFTER_VISIT = "director_after_visit";
cc.Director.EVENT_AFTER_UPDATE = "director_after_update";

cc.Director.prototype.runScene = function(scene){
    if (!this.getRunningScene()) {
        this.runWithScene(scene);
    } else {
        this.replaceScene(scene);
    }
};

cc.visibleRect = {
    topLeft:cc.p(0,0),
    topRight:cc.p(0,0),
    top:cc.p(0,0),
    bottomLeft:cc.p(0,0),
    bottomRight:cc.p(0,0),
    bottom:cc.p(0,0),
    center:cc.p(0,0),
    left:cc.p(0,0),
    right:cc.p(0,0),
    width:0,
    height:0,

    init:function(){
        var origin = cc.director.getVisibleOrigin();
        var size = cc.director.getVisibleSize();
        var w = this.width = size.width;
        var h = this.height = size.height;
        var l = origin.x,
            b = origin.y,
            t = b + h,
            r = l + w;

        this.topLeft.x = l;
        this.topLeft.y = t;
        this.topRight.x = r;
        this.topRight.y = t;
        this.top.x = l + w/2;
        this.top.y = t;

        this.bottomLeft.x = l;
        this.bottomLeft.y = b;
        this.bottomRight.x = r;
        this.bottomRight.y = b;
        this.bottom.x = l + w/2;
        this.bottom.y = b;

        this.center.x = l + w/2;
        this.center.y = b + h/2;

        this.left.x = l;
        this.left.y = b + h/2;

        this.right.x = r;
        this.right.y = b + h/2;
    }
};
cc.visibleRect.init();

cc.FontDefinition = function () {
    this.fontName = "Arial";
    this.fontSize = 12;
    this.textAlign = cc.TEXT_ALIGNMENT_CENTER;
    this.verticalAlign = cc.VERTICAL_TEXT_ALIGNMENT_TOP;
    this.fillStyle = cc.color(255, 255, 255, 255);
    this.boundingWidth = 0;
    this.boundingHeight = 0;

    this.strokeEnabled = false;
    this.strokeStyle = cc.color(255, 255, 255, 255);
    this.lineWidth = 1;

    this.shadowEnabled = false;
    this.shadowOffsetX = 0;
    this.shadowOffsetY = 0;
    this.shadowBlur = 0;
    this.shadowOpacity = 1.0;
};

cc.arrayVerifyType = function (arr, type) {
    if (arr && arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
            if (!(arr[i] instanceof  type)) {
                cc.log("element type is wrong!");
                return false;
            }
        }
    }
    return true;
};

cc.arrayRemoveObject = function (arr, delObj) {
    for (var i = 0, l = arr.length; i < l; i++) {
        if (arr[i] == delObj) {
            arr.splice(i, 1);
            break;
        }
    }
};

cc.arrayRemoveArray = function (arr, minusArr) {
    for (var i = 0, l = minusArr.length; i < l; i++) {
        cc.arrayRemoveObject(arr, minusArr[i]);
    }
};

cc.arrayAppendObjectsToIndex = function(arr, addObjs,index){
    arr.splice.apply(arr, [index, 0].concat(addObjs));
    return arr;
};

cc.copyArray = function(arr){
    var i, len = arr.length, arr_clone = new Array(len);
    for (i = 0; i < len; i += 1)
        arr_clone[i] = arr[i];
    return arr_clone;
};

cc.cardinalSplineAt = function (p0, p1, p2, p3, tension, t) {
    var t2 = t * t;
    var t3 = t2 * t;

    var s = (1 - tension) / 2;

    var b1 = s * ((-t3 + (2 * t2)) - t);                      
    var b2 = s * (-t3 + t2) + (2 * t3 - 3 * t2 + 1);          
    var b3 = s * (t3 - 2 * t2 + t) + (-2 * t3 + 3 * t2);      
    var b4 = s * (t3 - t2);                                   

    var x = (p0.x * b1 + p1.x * b2 + p2.x * b3 + p3.x * b4);
    var y = (p0.y * b1 + p1.y * b2 + p2.y * b3 + p3.y * b4);
    return cc.p(x, y);
};

cc._DrawNode = cc.DrawNode;
cc.DrawNode = cc._DrawNode.extend({
    _drawColor: cc.color(255, 255, 255, 255),
    _lineWidth: 1,

    setLineWidth: function (width) {
        this._lineWidth = width;
    },

    getLineWidth: function () {
        return this._lineWidth;
    },

    setDrawColor: function(color) {
        var locDrawColor = this._drawColor;
        locDrawColor.r = color.r;
        locDrawColor.g = color.g;
        locDrawColor.b = color.b;
        locDrawColor.a = (color.a == null) ? 255 : color.a;
    },

    getDrawColor: function () {
        return  cc.color(this._drawColor.r, this._drawColor.g, this._drawColor.b, this._drawColor.a);
    },

    drawRect: function (origin, destination, fillColor, lineWidth, lineColor) {
        lineWidth = lineWidth || this._lineWidth;
        lineColor = lineColor || this._drawColor;
        var points = [origin, cc.p(origin.x, destination.y), destination, cc.p(destination.x, origin.y)];
        if (fillColor)
            cc._DrawNode.prototype.drawPoly.call(this, points, fillColor, lineWidth, lineColor);
        else {
            points.push(origin);
            var drawSeg = cc._DrawNode.prototype.drawSegment;
            for (var i = 0, len = points.length; i < len - 1; i++)
                drawSeg.call(this, points[i], points[i + 1], lineWidth, lineColor);
        }
    },

    drawCircle: function (center, radius, angle, segments, drawLineToCenter, lineWidth, color) {
        lineWidth = lineWidth || this._lineWidth;
        color = color || this._drawColor;
        if (color.a == null)
            color.a = 255;
        var coef = 2.0 * Math.PI / segments, vertices = [], i, len;
        for (i = 0; i <= segments; i++) {
            var rads = i * coef;
            var j = radius * Math.cos(rads + angle) + center.x;
            var k = radius * Math.sin(rads + angle) + center.y;
            vertices.push(cc.p(j, k));
        }
        if (drawLineToCenter)
            vertices.push(cc.p(center.x, center.y));

        lineWidth *= 0.5;
        var drawSeg = cc._DrawNode.prototype.drawSegment;
        for (i = 0, len = vertices.length; i < len - 1; i++)
            drawSeg.call(this, vertices[i], vertices[i + 1], lineWidth, color);
    },

    drawQuadBezier: function (origin, control, destination, segments, lineWidth, color) {
        lineWidth = lineWidth || this._lineWidth;
        color = color || this._drawColor;
        cc._DrawNode.prototype.drawQuadBezier.call(this, origin, control, destination, segments, color);
    },

    drawCubicBezier: function (origin, control1, control2, destination, segments, lineWidth, color) {
        lineWidth = lineWidth || this._lineWidth;
        color = color || this._drawColor;
        cc._DrawNode.prototype.drawCubicBezier.call(this, origin, control1, control2, destination, segments, color);
    },

    drawCatmullRom: function (points, segments, lineWidth, color) {
        this.drawCardinalSpline(points, 0.5, segments, lineWidth, color);
    },

    drawCardinalSpline: function (config, tension, segments, lineWidth, color) {
        lineWidth = lineWidth || this._lineWidth;
        color = color || this._drawColor;
        if (color.a == null)
            color.a = 255;
        var vertices = [], p, lt, deltaT = 1.0 / config.length, m1len = config.length - 1;

        for (var i = 0; i < segments + 1; i++) {
            var dt = i / segments;

            if (dt == 1) {
                p = m1len;
                lt = 1;
            } else {
                p = 0 | (dt / deltaT);
                lt = (dt - deltaT * p) / deltaT;
            }

            var newPos = cc.cardinalSplineAt(
                config[Math.min(m1len, Math.max(p - 1, 0))],
                config[Math.min(m1len, Math.max(p + 0, 0))],
                config[Math.min(m1len, Math.max(p + 1, 0))],
                config[Math.min(m1len, Math.max(p + 2, 0))],
                tension, lt);
            vertices.push(newPos);
        }

        lineWidth *= 0.5;
        var drawSeg = cc._DrawNode.prototype.drawSegment;
        for (var j = 0, len = vertices.length; j < len - 1; j++)
            drawSeg.call(this, vertices[j], vertices[j + 1], lineWidth, color);
    },

    drawDot:function (pos, radius, color) {
        color = color || this._drawColor;
        cc._DrawNode.prototype.drawDot.call(this, pos, radius, color);
    },

    drawSegment:function (from, to, lineWidth = this._lineWidth, color = this._drawColor) {
        cc._DrawNode.prototype.drawSegment.call(this, from, to, lineWidth, color);
    },

    drawPoly:function (verts, fillColor, borderWidth, borderColor) {
        borderColor = borderColor || this._drawColor;
        if (fillColor)
            cc._DrawNode.prototype.drawPoly.call(this, verts, fillColor, borderWidth, borderColor);
        else {
            verts.push(verts[0]);
            var drawSeg = cc._DrawNode.prototype.drawSegment;
            for (var i = 0, len = verts.length; i < len - 1; i++)
                drawSeg.call(this, verts[i], verts[i + 1], borderWidth, borderColor);
        }
    }
});
cc.DrawNode.create = function () {
    return new cc.DrawNode();
};

cc.TMXTiledMap.prototype.allLayers = function(){
    var retArr = [],
        locChildren = this.getChildren(),
        length = locChildren.length;
    for(var i = 0; i< length; i++){
        var layer = locChildren[i];
        if(layer && layer instanceof cc.TMXLayer)
            retArr.push(layer);
    }
    return retArr;
};
cc.TMXLayer.prototype._getTileAt = cc.TMXLayer.prototype.getTileAt;
cc.TMXLayer.prototype.getTileAt = function(x, y){
    var pos = y !== undefined ? cc.p(x, y) : x;
    return this._getTileAt(pos);
};
cc.TMXLayer.prototype._getTileGIDAt = cc.TMXLayer.prototype.getTileGIDAt;
cc.TMXLayer.prototype.getTileGIDAt = function(x, y){
    var pos = y !== undefined ? cc.p(x, y) : x;
    return this._getTileGIDAt(pos);
};
cc.TMXLayer.prototype._setTileGID = cc.TMXLayer.prototype.setTileGID;
cc.TMXLayer.prototype.setTileGID = function(gid, posOrX, flagsOrY, flags){
    var pos;
    if (flags !== undefined) {
        pos = cc.p(posOrX, flagsOrY);
        this._setTileGID(gid, pos, flags);
    } else if(flagsOrY != undefined){
        pos = posOrX;
        flags = flagsOrY;
        this._setTileGID(gid, pos, flags);
    } else {
        this._setTileGID(gid, posOrX);
    }
};
cc.TMXLayer.prototype._removeTileAt = cc.TMXLayer.prototype.removeTileAt;
cc.TMXLayer.prototype.removeTileAt = function(x, y){
    var pos = y !== undefined ? cc.p(x, y) : x;
    this._removeTileAt(pos);
};
cc.TMXLayer.prototype._getPositionAt = cc.TMXLayer.prototype.getPositonAt;
cc.TMXLayer.prototype.getPositonAt = function(x, y){
    var pos = y !== undefined ? cc.p(x, y) : x;
    return this._getPositionAt(pos);
};

var protoHasBlend = [cc.AtlasNode.prototype,
                     cc.DrawNode.prototype,
                     cc.LabelTTF.prototype,
                     cc.SpriteBatchNode.prototype,
                     cc.LabelBMFont.prototype,
                     cc.LayerColor.prototype,
                     cc.MotionStreak.prototype,
                     cc.Sprite.prototype,
                     cc.ParticleBatchNode.prototype,
                     cc.ParticleSystem.prototype];

var templateSetBlendFunc = function(src, dst) {
    var blendf;
    if (dst === undefined)
        blendf = src;
    else
        blendf = {src: src, dst: dst};
    this._setBlendFunc(blendf);
};
for (var i = 0, l = protoHasBlend.length; i < l; i++) {
    var proto = protoHasBlend[i];
    proto._setBlendFunc = proto.setBlendFunc;
    proto.setBlendFunc = templateSetBlendFunc;
}

var easeActions = {
    easeIn : 0,
    easeOut : 1,
    easeInOut : 2,
    easeExponentialIn : 3,
    easeExponentialOut : 4,
    easeExponentialInOut : 5,
    easeSineIn : 6,
    easeSineOut : 7,
    easeSineInOut : 8,
    easeElasticIn : 9,
    easeElasticOut : 10,
    easeElasticInOut : 11,
    easeBounceIn : 12,
    easeBounceOut : 13,
    easeBounceInOut : 14,
    easeBackIn : 15,
    easeBackOut : 16,
    easeBackInOut : 17,

    easeBezierAction : 18,
    easeQuadraticActionIn : 19,
    easeQuadraticActionOut : 20,
    easeQuadraticActionInOut : 21,
    easeQuarticActionIn : 22,
    easeQuarticActionOut : 23,
    easeQuarticActionInOut : 24,
    easeQuinticActionIn : 25,
    easeQuinticActionOut : 26,
    easeQuinticActionInOut : 27,
    easeCircleActionIn : 28,
    easeCircleActionOut : 29,
    easeCircleActionInOut : 30,
    easeCubicActionIn : 31,
    easeCubicActionOut : 32,
    easeCubicActionInOut : 33
};

function templateEaseActions(actionTag) {
    return function(param, param2, param3, param4) {
        return {tag: actionTag, param: param, param2: param2, param3: param3, param4: param4};
    }
}

for (var a in easeActions) {
    var actionTag = easeActions[a];
    cc[a] = templateEaseActions(actionTag);
}

cc.action = cc.Action.create;
cc.speed = cc.Speed.create;
cc.follow = cc.Follow.create;
cc.orbitCamera = cc.OrbitCamera.create;
cc.cardinalSplineTo = cc.CardinalSplineTo.create;
cc.cardinalSplineBy = cc.CardinalSplineBy.create;
cc.catmullRomTo = cc.CatmullRomTo.create;
cc.catmullRomBy = cc.CatmullRomBy.create;
cc.show = cc.Show.create;
cc.hide = cc.Hide.create;
cc.toggleVisibility = cc.ToggleVisibility.create;
cc.removeSelf = cc.RemoveSelf.create;
cc.flipX = cc.FlipX.create;
cc.flipY = cc.FlipY.create;

cc.callFunc = cc.CallFunc.create;
cc.actionInterval = cc.ActionInterval.create;
cc.sequence = cc.Sequence.create;
cc.repeat = cc.Repeat.create;
cc.repeatForever = cc.RepeatForever.create;
cc.spawn = cc.Spawn.create;
cc.rotateTo = cc.RotateTo.create;
cc.rotateBy = cc.RotateBy.create;

cc.skewTo = cc.SkewTo.create;
cc.skewBy = cc.SkewBy.create;

cc.bezierBy = cc.BezierBy.create;
cc.bezierTo = cc.BezierTo.create;
cc.scaleTo = cc.ScaleTo.create;
cc.scaleBy = cc.ScaleBy.create;
cc.blink = cc.Blink.create;
cc.fadeTo = cc.FadeTo.create;
cc.fadeIn = cc.FadeIn.create;
cc.fadeOut = cc.FadeOut.create;
cc.tintTo = cc.TintTo.create;
cc.tintBy = cc.TintBy.create;
cc.delayTime = cc.DelayTime.create;
cc.reverseTime = cc.ReverseTime.create;
cc.animate = cc.Animate.create;
cc.targetedAction = cc.TargetedAction.create;
cc.actionTween = cc.ActionTween.create;

cc.Place._create = cc.Place.create;
cc.place = cc.Place.create = function(posOrX, y){
    if (undefined === y){
        return cc.Place._create(posOrX);
    }else{
        return cc.Place._create(cc.p(posOrX, y));
    }
};
cc.MoveTo._create = cc.MoveTo.create;
cc.moveTo = cc.MoveTo.create = function(duration, posOrX, y){
    if (undefined === y){
        return cc.MoveTo._create(duration, posOrX);
    }else{
        return cc.MoveTo._create(duration, cc.p(posOrX, y));
    }
};
cc.MoveBy._create = cc.MoveBy.create;
cc.moveBy = cc.MoveBy.create = function(duration, posOrX, y){
    if (undefined === y){
        return cc.MoveBy._create(duration, posOrX);
    }else{
        return cc.MoveBy._create(duration, cc.p(posOrX, y));
    }
};
cc.JumpTo._create = cc.JumpTo.create;
cc.jumpTo = cc.JumpTo.create = function(duration, position, y, height, jumps){
    if (undefined === jumps){
        jumps = height;
        height = y;
        return cc.JumpTo._create(duration, position, height, jumps);
    }else{
        return cc.JumpTo._create(duration, cc.p(position, y), height, jumps);
    }
};
cc.JumpBy._create = cc.JumpBy.create;
cc.jumpBy = cc.JumpBy.create = function(duration, position, y, height, jumps){
    if (undefined === jumps){
        jumps = height;
        height = y;
        return cc.JumpBy._create(duration, position, height, jumps);
    }else{
        return cc.JumpBy._create(duration, cc.p(position, y), height, jumps);
    }
};

cc.gridAction = cc.GridAction.create;
cc.grid3DAction = cc.Grid3DAction.create;
cc.tiledGrid3DAction = cc.TiledGrid3DAction.create;
cc.stopGrid = cc.StopGrid.create;
cc.reuseGrid = cc.ReuseGrid.create;
cc.waves3D = cc.Waves3D.create;
cc.flipX3D = cc.FlipX3D.create;
cc.flipY3D = cc.FlipY3D.create;
cc.lens3D = cc.Lens3D.create;
cc.ripple3D = cc.Ripple3D.create;
cc.shaky3D = cc.Shaky3D.create;
cc.liquid = cc.Liquid.create;
cc.waves = cc.Waves.create;
cc.twirl = cc.Twirl.create;
cc.pageTurn3D = cc.PageTurn3D.create;
cc.shakyTiles3D = cc.ShakyTiles3D.create;
cc.shatteredTiles3D = cc.ShatteredTiles3D.create;
cc.shuffleTiles = cc.ShuffleTiles.create;
cc.fadeOutTRTiles = cc.FadeOutTRTiles.create;
cc.fadeOutBLTiles = cc.FadeOutBLTiles.create;
cc.fadeOutUpTiles = cc.FadeOutUpTiles.create;
cc.fadeOutDownTiles = cc.FadeOutDownTiles.create;
cc.turnOffTiles = cc.TurnOffTiles.create;
cc.wavesTiles3D = cc.WavesTiles3D.create;
cc.jumpTiles3D = cc.JumpTiles3D.create;
cc.splitRows = cc.SplitRows.create;
cc.splitCols = cc.SplitCols.create;
cc.progressTo = cc.ProgressTo.create;
cc.progressFromTo = cc.ProgressFromTo.create;

cc.Speed.prototype.speed = cc.ActionInterval.prototype.speed = function(speed) {

    var action = this, found = false;
    while (action.getInnerAction && !found) {
        if (action instanceof cc.Speed) {
            found = true;
        }
        else {
            action = action.getInnerAction();
        }
    }
    if (found) {
        speed = speed * action._getSpeed();
        action._setSpeed(speed);
    }
    else {
        this._speed(speed);
    }
    return this;
};
cc.Speed.prototype.setSpeed = cc.ActionInterval.prototype.setSpeed = function(speed) {

    var action = this, found = false;
    while (action.getInnerAction && !found) {
        if (action instanceof cc.Speed) {
            found = true;
        }
        else {
            action = action.getInnerAction();
        }
    }
    if (found) {
        action._setSpeed(speed);
    }
    else {
        this._speed(speed);
    }
};
cc.Speed.prototype.getSpeed = cc.ActionInterval.prototype.getSpeed = function() {
    var action = this, found = false;
    while (action.getInnerAction && !found) {
        if (action instanceof cc.Speed) {
            found = true;
        }
        else {
            action = action.getInnerAction();
        }
    }
    if (found) {
        return action._getSpeed();
    }
    else {
        return 1;
    }
};

cc.AffineTransform = function (a, b, c, d, tx, ty) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
};

cc.affineTransformMake = function (a, b, c, d, tx, ty) {
    return {a: a, b: b, c: c, d: d, tx: tx, ty: ty};
};

cc.pointApplyAffineTransform = function (point, t) {
    return {x: t.a * point.x + t.c * point.y + t.tx, y: t.b * point.x + t.d * point.y + t.ty};
};

cc._pointApplyAffineTransform = function (x, y, t) {
    return {x: t.a * x + t.c * y + t.tx,
        y: t.b * x + t.d * y + t.ty};
};

cc.sizeApplyAffineTransform = function (size, t) {
    return {width: t.a * size.width + t.c * size.height, height: t.b * size.width + t.d * size.height};
};

cc.affineTransformMakeIdentity = function () {
    return {a: 1.0, b: 0.0, c: 0.0, d: 1.0, tx: 0.0, ty: 0.0};
};

cc.affineTransformIdentity = function () {
    return {a: 1.0, b: 0.0, c: 0.0, d: 1.0, tx: 0.0, ty: 0.0};
};

cc.rectApplyAffineTransform = function (rect, anAffineTransform) {
    var top = cc.rectGetMinY(rect);
    var left = cc.rectGetMinX(rect);
    var right = cc.rectGetMaxX(rect);
    var bottom = cc.rectGetMaxY(rect);

    var topLeft = cc._pointApplyAffineTransform(left, top, anAffineTransform);
    var topRight = cc._pointApplyAffineTransform(right, top, anAffineTransform);
    var bottomLeft = cc._pointApplyAffineTransform(left, bottom, anAffineTransform);
    var bottomRight = cc._pointApplyAffineTransform(right, bottom, anAffineTransform);

    var minX = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    var maxX = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    var minY = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
    var maxY = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);

    return cc.rect(minX, minY, (maxX - minX), (maxY - minY));
};

cc._rectApplyAffineTransformIn = function(rect, anAffineTransform){
    var top = cc.rectGetMinY(rect);
    var left = cc.rectGetMinX(rect);
    var right = cc.rectGetMaxX(rect);
    var bottom = cc.rectGetMaxY(rect);

    var topLeft = cc._pointApplyAffineTransform(left, top, anAffineTransform);
    var topRight = cc._pointApplyAffineTransform(right, top, anAffineTransform);
    var bottomLeft = cc._pointApplyAffineTransform(left, bottom, anAffineTransform);
    var bottomRight = cc._pointApplyAffineTransform(right, bottom, anAffineTransform);

    var minX = Math.min(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    var maxX = Math.max(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x);
    var minY = Math.min(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
    var maxY = Math.max(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);

    rect.x = minX;
    rect.y = minY;
    rect.width = maxX - minX;
    rect.height = maxY - minY;
    return rect;
};

cc.affineTransformTranslate = function (t, tx, ty) {
    return {
        a: t.a,
        b: t.b,
        c: t.c,
        d: t.d,
        tx: t.tx + t.a * tx + t.c * ty,
        ty: t.ty + t.b * tx + t.d * ty
    };
};

cc.affineTransformScale = function (t, sx, sy) {
    return {a: t.a * sx, b: t.b * sx, c: t.c * sy, d: t.d * sy, tx: t.tx, ty: t.ty};
};

cc.affineTransformRotate = function (aTransform, anAngle) {
    var fSin = Math.sin(anAngle);
    var fCos = Math.cos(anAngle);

    return {a: aTransform.a * fCos + aTransform.c * fSin,
        b: aTransform.b * fCos + aTransform.d * fSin,
        c: aTransform.c * fCos - aTransform.a * fSin,
        d: aTransform.d * fCos - aTransform.b * fSin,
        tx: aTransform.tx,
        ty: aTransform.ty};
};

cc.affineTransformConcat = function (t1, t2) {
    return {a: t1.a * t2.a + t1.b * t2.c,                          
        b: t1.a * t2.b + t1.b * t2.d,                               
        c: t1.c * t2.a + t1.d * t2.c,                               
        d: t1.c * t2.b + t1.d * t2.d,                               
        tx: t1.tx * t2.a + t1.ty * t2.c + t2.tx,                    
        ty: t1.tx * t2.b + t1.ty * t2.d + t2.ty};                   
};

cc.affineTransformEqualToTransform = function (t1, t2) {
    return ((t1.a === t2.a) && (t1.b === t2.b) && (t1.c === t2.c) && (t1.d === t2.d) && (t1.tx === t2.tx) && (t1.ty === t2.ty));
};

cc.affineTransformInvert = function (t) {
    var determinant = 1 / (t.a * t.d - t.b * t.c);
    return {a: determinant * t.d, b: -determinant * t.b, c: -determinant * t.c, d: determinant * t.a,
        tx: determinant * (t.c * t.ty - t.d * t.tx), ty: determinant * (t.b * t.tx - t.a * t.ty)};
};

cc.Node.prototype.setUserData = function (data) {
    this.userData = data;
};
cc.Node.prototype.getUserData = function () {
    return this.userData;
};

cc.Node.prototype._setNormalizedPosition = cc.Node.prototype.setNormalizedPosition;
cc.Node.prototype.setNormalizedPosition = function(pos, y){
    if(y === undefined)
        cc.Node.prototype._setNormalizedPosition.call(this, pos);
    else
        cc.Node.prototype._setNormalizedPosition.call(this, cc.p(pos, y));
};

cc.Node.prototype.getBoundingBoxToWorld = function () {
    var contentSize = this.getContentSize();
    var rect = cc.rect(0, 0, contentSize.width, contentSize.height);
    var trans = this.getNodeToWorldTransform();
    rect = cc.rectApplyAffineTransform(rect, trans);

    if (!this.getChildren())
        return rect;

    var locChildren = this.getChildren();
    for (var i = 0; i < locChildren.length; i++) {
        var child = locChildren[i];
        if (child && child.isVisible()) {
            var childRect = child._getBoundingBoxToCurrentNode(trans);
            if (childRect)
                rect = cc.rectUnion(rect, childRect);
        }
    }
    return rect;
};

cc.Node.prototype._getBoundingBoxToCurrentNode = function (parentTransform) {
    var contentSize = this.getContentSize();
    var rect = cc.rect(0, 0, contentSize.width, contentSize.height);
    var _trans = this.getNodeToParentTransform();
    var trans = (parentTransform == null) ? _trans : cc.affineTransformConcat(_trans, parentTransform);
    rect = cc.rectApplyAffineTransform(rect, trans);

    if (!this.getChildren())
        return rect;

    var locChildren = this.getChildren();
    for (var i = 0; i < locChildren.length; i++) {
        var child = locChildren[i];
        if (child && child.isVisible()) {
            var childRect = child._getBoundingBoxToCurrentNode(trans);
            if (childRect)
                rect = cc.rectUnion(rect, childRect);
        }
    }
    return rect;
};

cc.Layer.prototype.bake = cc.Layer.prototype.unbake = function() {};
cc.Layer.prototype.isBaked = function() {return false;};

cc.RenderTexture.prototype._beginWithClear = cc.RenderTexture.prototype.beginWithClear;
cc.RenderTexture.prototype.beginWithClear = function(r, g, b, a, depthValue, stencilValue) {
    arguments[0] /= 255;
    arguments[1] /= 255;
    arguments[2] /= 255;
    arguments[3] /= 255;
    this._beginWithClear.apply(this, arguments);
};

cc.Texture2D.prototype._setTexParameters = cc.Texture2D.prototype.setTexParameters;
cc.Texture2D.prototype.setTexParameters = function (texParams, magFilter, wrapS, wrapT) {
    var minFilter;
    if (magFilter === undefined) {
        minFilter = texParams.minFilter;
        magFilter = texParams.magFilter;
        wrapS = texParams.wrapS;
        wrapT = texParams.wrapT;
    }
    else minFilter = texParams;

    this._setTexParameters(minFilter, magFilter, wrapS, wrapT);
};

cc.Texture2D.prototype.handleLoadedTexture = function (premultipled) {};

var _p = cc.MenuItemImage.prototype;
_p._setNormalSpriteFrame = _p.setNormalSpriteFrame;
_p._setSelectedSpriteFrame = _p.setSelectedSpriteFrame;
_p._setDisabledSpriteFrame = _p.setDisabledSpriteFrame;
_p.setNormalSpriteFrame = function(frame) {
    if (frame[0] == "#") 
        frame = cc.spriteFrameCache.getSpriteFrame(frame.substr(1));
    this._setNormalSpriteFrame(frame);
}
_p.setSelectedSpriteFrame = function(frame) {
    if (frame[0] == "#") 
        frame = cc.spriteFrameCache.getSpriteFrame(frame.substr(1));
    this._setSelectedSpriteFrame(frame);
}
_p.setDisabledSpriteFrame = function(frame) {
    if (frame[0] == "#") 
        frame = cc.spriteFrameCache.getSpriteFrame(frame.substr(1));
    this._setDisabledSpriteFrame(frame);
}

cc.MenuItemToggle.prototype.selectedItem = cc.MenuItemToggle.prototype.getSelectedItem;

cc.LabelTTF.prototype._setDimensions = cc.LabelTTF.prototype.setDimensions;
cc.LabelTTF.prototype.setDimensions = function (dim, height) {
    if (!isNaN(height)) {
        dim = {width: dim, height: height};
    }
    this._setDimensions(dim);
};

_p = cc.Label.prototype;
_p.enableStroke = _p.enableOutline;
_p.setBoundingWidth = _p.setWidth;
_p.setBoundingHeight = _p.setHeight;

_p = cc.Scheduler.prototype;
_p.unscheduleUpdateForTarget = _p.unscheduleUpdate;
_p.unscheduleAllCallbacksForTarget = _p.unscheduleAllForTarget;

cc.BlendFunc = function (src1, dst1) {
    this.src = src1;
    this.dst = dst1;
};

cc.BlendFunc._disable = function(){
    return new cc.BlendFunc(cc.ONE, cc.ZERO);
};
cc.BlendFunc._alphaPremultiplied = function(){
    return new cc.BlendFunc(cc.ONE, cc.ONE_MINUS_SRC_ALPHA);
};
cc.BlendFunc._alphaNonPremultiplied = function(){
    return new cc.BlendFunc(cc.SRC_ALPHA, cc.ONE_MINUS_SRC_ALPHA);
};
cc.BlendFunc._additive = function(){
    return new cc.BlendFunc(cc.SRC_ALPHA, cc.ONE);
};

cc.BlendFunc.DISABLE;
cc.defineGetterSetter(cc.BlendFunc, "DISABLE", cc.BlendFunc._disable);

cc.BlendFunc.ALPHA_PREMULTIPLIED;
cc.defineGetterSetter(cc.BlendFunc, "ALPHA_PREMULTIPLIED", cc.BlendFunc._alphaPremultiplied);

cc.BlendFunc.ALPHA_NON_PREMULTIPLIED;
cc.defineGetterSetter(cc.BlendFunc, "ALPHA_NON_PREMULTIPLIED", cc.BlendFunc._alphaNonPremultiplied);

cc.BlendFunc.ADDITIVE;
cc.defineGetterSetter(cc.BlendFunc, "ADDITIVE", cc.BlendFunc._additive);

jsb.BaseLight = cc.BaseLight;
delete cc.BaseLight;
jsb.DirectionLight = cc.DirectionLight;
delete cc.DirectionLight;
jsb.PointLight = cc.PointLight;
delete cc.PointLight;
jsb.SpotLight = cc.SpotLight;
delete cc.SpotLight;
jsb.AmbientLight = cc.AmbientLight;
delete cc.AmbientLight;