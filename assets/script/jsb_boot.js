var cc = cc || {};
var window = window || this;

cc.each = function (obj, iterator, context) {
    if (!obj)
        return;
    if (obj instanceof Array) {
        for (var i = 0, li = obj.length; i < li; i++) {
            if (iterator.call(context, obj[i], i) === false)
                return;
        }
    } else {
        for (var key in obj) {
            if (iterator.call(context, obj[key], key) === false)
                return;
        }
    }
};

cc.extend = function (target) {
    var sources = arguments.length >= 2 ? Array.prototype.slice.call(arguments, 1) : [];

    cc.each(sources, function (src) {
        for (var key in src) {
            if (src.hasOwnProperty(key)) {
                target[key] = src[key];
            }
        }
    });
    return target;
};

cc.isFunction = function (obj) {
    return typeof obj == 'function';
};

cc.isNumber = function (obj) {
    return typeof obj == 'number' || Object.prototype.toString.call(obj) == '[object Number]';
};

cc.isString = function (obj) {
    return typeof obj == 'string' || Object.prototype.toString.call(obj) == '[object String]';
};

cc.isArray = function (obj) {
    return Array.isArray(obj) ||
        (typeof obj === 'object' && objectToString(obj) === '[object Array]');
};

cc.isUndefined = function (obj) {
    return typeof obj === 'undefined';
};

cc.isObject = function (obj) {
    return obj.__nativeObj !== undefined ||
        ( typeof obj === "object" && Object.prototype.toString.call(obj) === '[object Object]' );
};

cc.isCrossOrigin = function (url) {
    return false;
};

cc.defineGetterSetter = function (proto, prop, getter, setter) {
    var desc = {enumerable: false, configurable: true};
    getter && (desc.get = getter);
    setter && (desc.set = setter);
    Object.defineProperty(proto, prop, desc);
};

cc.AsyncPool = function (srcObj, limit, iterator, onEnd, target) {
    var self = this;
    self._srcObj = srcObj;
    self._limit = limit;
    self._pool = [];
    self._iterator = iterator;
    self._iteratorTarget = target;
    self._onEnd = onEnd;
    self._onEndTarget = target;
    self._results = srcObj instanceof Array ? [] : {};
    self._isErr = false;

    cc.each(srcObj, function (value, index) {
        self._pool.push({index: index, value: value});
    });

    self.size = self._pool.length;
    self.finishedSize = 0;
    self._workingSize = 0;

    self._limit = self._limit || self.size;

    self.onIterator = function (iterator, target) {
        self._iterator = iterator;
        self._iteratorTarget = target;
    };

    self.onEnd = function (endCb, endCbTarget) {
        self._onEnd = endCb;
        self._onEndTarget = endCbTarget;
    };

    self._handleItem = function () {
        var self = this;
        if (self._pool.length == 0)
            return;                                                         
        if (self._workingSize >= self._limit)
            return;                                                         
        var item = self._pool.shift();
        var value = item.value, index = item.index;
        self._workingSize++;
        self._iterator.call(self._iteratorTarget, value, index, function (err) {
            if (self._isErr)
                return;

            self.finishedSize++;
            self._workingSize--;
            if (err) {
                self._isErr = true;
                if (self._onEnd)
                    self._onEnd.call(self._onEndTarget, err);
                return
            }

            var arr = Array.prototype.slice.call(arguments, 1);
            self._results[this.index] = arr[0];
            if (self.finishedSize == self.size) {
                if (self._onEnd)
                    self._onEnd.call(self._onEndTarget, null, self._results);
                return;
            }
            self._handleItem();
        }.bind(item), self);
    };

    self.flow = function () {
        var self = this;
        if (self._pool.length == 0) {
            if (self._onEnd)
                self._onEnd.call(self._onEndTarget, null, []);
            return;
        }
        for (var i = 0; i < self._limit; i++)
            self._handleItem();
    }
};

cc.async = {

    series: function (tasks, cb, target) {
        var asyncPool = new cc.AsyncPool(tasks, 1, function (func, index, cb1) {
            func.call(target, cb1);
        }, cb, target);
        asyncPool.flow();
        return asyncPool;
    },

    parallel: function (tasks, cb, target) {
        var asyncPool = new cc.AsyncPool(tasks, 0, function (func, index, cb1) {
            func.call(target, cb1);
        }, cb, target);
        asyncPool.flow();
        return asyncPool;
    },

    waterfall: function (tasks, cb, target) {
        var args = [];
        var asyncPool = new cc.AsyncPool(tasks, 1,
            function (func, index, cb1) {
                args.push(function (err) {
                    args = Array.prototype.slice.call(arguments, 1);
                    cb1.apply(null, arguments);
                });
                func.apply(target, args);
            }, function (err, results) {
                if (!cb)
                    return;
                if (err)
                    return cb.call(target, err);
                cb.call(target, null, results[results.length - 1]);
            });
        asyncPool.flow();
        return asyncPool;
    },

    map: function (tasks, iterator, cb, target) {
        var locIterator = iterator;
        if (typeof(iterator) == "object") {
            cb = iterator.cb;
            target = iterator.iteratorTarget;
            locIterator = iterator.iterator;
        }
        var asyncPool = new cc.AsyncPool(tasks, 0, locIterator, cb, target);
        asyncPool.flow();
        return asyncPool;
    },

    mapLimit: function (tasks, limit, iterator, cb, target) {
        var asyncPool = new cc.AsyncPool(tasks, limit, iterator, cb, target);
        asyncPool.flow();
        return asyncPool;
    }
};

cc.path = {

    join: function () {
        var l = arguments.length;
        var result = "";
        for (var i = 0; i < l; i++) {
            result = (result + (result == "" ? "" : "/") + arguments[i]).replace(/(\/|\\\\)$/, "");
        }
        return result;
    },

    extname: function (pathStr) {
        var index = pathStr.indexOf("?");
        if (index > 0) pathStr = pathStr.substring(0, index);
        index = pathStr.lastIndexOf(".");
        if (index < 0) return null;
        return pathStr.substring(index, pathStr.length);
    },

    basename: function (pathStr, extname) {
        var index = pathStr.indexOf("?");
        if (index > 0) pathStr = pathStr.substring(0, index);
        var reg = /(\/|\\\\)([^(\/|\\\\)]+)$/g;
        var result = reg.exec(pathStr.replace(/(\/|\\\\)$/, ""));
        if (!result) return null;
        var baseName = result[2];
        if (extname && pathStr.substring(pathStr.length - extname.length).toLowerCase() == extname.toLowerCase())
            return baseName.substring(0, baseName.length - extname.length);
        return baseName;
    },

    dirname: function (pathStr) {
        return pathStr.replace(/(\/|\\\\)$/, "").replace(/(\/|\\\\)[^(\/|\\\\)]+$/, "");
    },

    changeExtname: function (pathStr, extname) {
        extname = extname || "";
        var index = pathStr.indexOf("?");
        var tempStr = "";
        if (index > 0) {
            tempStr = pathStr.substring(index);
            pathStr = pathStr.substring(0, index);
        }
        ;
        index = pathStr.lastIndexOf(".");
        if (index < 0) return pathStr + extname + tempStr;
        return pathStr.substring(0, index) + extname + tempStr;
    },

    changeBasename: function (pathStr, basename, isSameExt) {
        if (basename.indexOf(".") == 0) return this.changeExtname(pathStr, basename);
        var index = pathStr.indexOf("?");
        var tempStr = "";
        var ext = isSameExt ? this.extname(pathStr) : "";
        if (index > 0) {
            tempStr = pathStr.substring(index);
            pathStr = pathStr.substring(0, index);
        }
        ;
        index = pathStr.lastIndexOf("/");
        index = index <= 0 ? 0 : index + 1;
        return pathStr.substring(0, index) + basename + ext + tempStr;
    }
};

cc.loader = {
    _resPath: "",
    _audioPath: "",
    _register: {},
    cache: {},
    _langPathCache: {},

    getXMLHttpRequest: function () {
        return new XMLHttpRequest();
    },

    _jsCache: {},

    _getArgs4Js: function (args) {
        var a0 = args[0], a1 = args[1], a2 = args[2], results = ["", null, null];

        if (args.length == 1) {
            results[1] = a0 instanceof Array ? a0 : [a0];
        } else if (args.length == 2) {
            if (typeof a1 == "function") {
                results[1] = a0 instanceof Array ? a0 : [a0];
                results[2] = a1;
            } else {
                results[0] = a0 || "";
                results[1] = a1 instanceof Array ? a1 : [a1];
            }
        } else if (args.length == 3) {
            results[0] = a0 || "";
            results[1] = a1 instanceof Array ? a1 : [a1];
            results[2] = a2;
        } else throw "arguments error to load js!";
        return results;
    },

    loadJs: function (baseDir, jsList, cb) {
        var self = this, localJsCache = self._jsCache,
            args = self._getArgs4Js(arguments);
        baseDir = args[0];
        jsList = args[1];
        cb = args[2];
        var ccPath = cc.path;
        for (var i = 0, li = jsList.length; i < li; ++i) {
            require(ccPath.join(baseDir, jsList[i]));
        }
        if (cb) cb();
    },

    loadJsWithImg: function (baseDir, jsList, cb) {
        this.loadJs.apply(this, arguments);
    },

    loadTxt: function (url, cb) {
        cb(null, jsb.fileUtils.getStringFromFile(url));
    },

    loadJson: function (url, cb) {
        this.loadTxt(url, function (err, txt) {
            try {
                err ? cb(err) : cb(null, JSON.parse(txt));
            } catch (e) {
                throw e;
                cb("load json [" + url + "] failed : " + e);
            }
        });
    },

    loadImg: function (url, option, cb) {
        var l = arguments.length;
        if (l == 2) cb = option;

        var cachedTex = cc.textureCache.getTextureForKey(url);
        if (cachedTex) {
            cb && cb(null, cachedTex);
        }
        else if (url.match(jsb.urlRegExp)) {
            jsb.loadRemoteImg(url, function (succeed, tex) {
                if (succeed) {
                    cb && cb(null, tex);
                }
                else {
                    cb && cb("Load image failed");
                }
            });
        }
        else {
            cc.textureCache._addImageAsync(url, function (tex) {
                if (tex instanceof cc.Texture2D)
                    cb && cb(null, tex);
                else cb && cb("Load image failed");
            });
        }
    },

    loadBinary: function (url, cb) {
        cb(null, jsb.fileUtils.getDataFromFile(url));
    },
    loadBinarySync: function (url) {
        return jsb.fileUtils.getDataFromFile(url);
    },

    _loadResIterator: function (item, index, cb) {
        var self = this, url = null;
        var type = item.type;
        if (type) {
            type = "." + type.toLowerCase();
            url = item.src ? item.src : item.name + type;
        } else {
            url = item;
            type = cc.path.extname(url);
        }

        var obj = self.cache[url];
        if (obj)
            return cb(null, obj);
        var loader = null;
        if (type) {
            loader = self._register[type.toLowerCase()];
        }
        if (!loader) {
            cc.error("loader for [" + type + "] not exists!");
            return cb();
        }
        var basePath = loader.getBasePath ? loader.getBasePath() : self.resPath;
        var realUrl = self.getUrl(basePath, url);
        var data = loader.load(realUrl, url);
        if (data) {
            self.cache[url] = data;
            cb(null, data);
        } else {
            self.cache[url] = null;
            delete self.cache[url];
            cb();
        }
    },

    getUrl: function (basePath, url) {
        var self = this, langPathCache = self._langPathCache, path = cc.path;
        if (arguments.length == 1) {
            url = basePath;
            var type = path.extname(url);
            type = type ? type.toLowerCase() : "";
            var loader = self._register[type];
            if (!loader)
                basePath = self.resPath;
            else
                basePath = loader.getBasePath ? loader.getBasePath() : self.resPath;
        }
        url = cc.path.join(basePath || "", url);
        if (url.match(/[\/(\\\\)]lang[\/(\\\\)]/i)) {
            if (langPathCache[url])
                return langPathCache[url];
            var extname = path.extname(url) || "";
            url = langPathCache[url] = url.substring(0, url.length - extname.length) + "_" + cc.sys.language + extname;
        }
        return url;
    },

    load: function (resources, option, cb) {
        var self = this;
        var len = arguments.length;
        if (len == 0)
            throw "arguments error!";

        if (len == 3) {
            if (typeof option == "function") {
                if (typeof cb == "function")
                    option = {trigger: option, cb: cb};
                else
                    option = {cb: option, cbTarget: cb};
            }
        } else if (len == 2) {
            if (typeof option == "function")
                option = {cb: option};
        } else if (len == 1) {
            option = {};
        }

        if (!(resources instanceof Array))
            resources = [resources];
        var asyncPool = new cc.AsyncPool(resources, 0, function (value, index, cb1, aPool) {
            self._loadResIterator(value, index, function (err) {
                if (err)
                    return cb1(err);
                var arr = Array.prototype.slice.call(arguments, 1);
                if (option.trigger)
                    option.trigger.call(option.triggerTarget, arr[0], aPool.size, aPool.finishedSize); 
                cb1(null, arr[0]);
            });
        }, option.cb, option.cbTarget);
        asyncPool.flow();
        return asyncPool;
    },

    loadAliases: function (url, cb) {
        jsb.fileUtils.loadFilenameLookup(url);
        if (cb) cb();
    },

    register: function (extNames, loader) {
        if (!extNames || !loader) return;
        var self = this;
        if (typeof extNames == "string")
            return this._register[extNames.trim().toLowerCase()] = loader;
        for (var i = 0, li = extNames.length; i < li; i++) {
            self._register["." + extNames[i].trim().toLowerCase()] = loader;
        }
    },

    getRes: function (url) {
        var cached = this.cache[url];
        if (cached)
            return cached;
        var type = cc.path.extname(url);
        var loader = this._register[type.toLowerCase()];
        if (!loader) return cc.log("loader for [" + type + "] not exists!");
        var basePath = loader.getBasePath ? loader.getBasePath() : this.resPath;
        var realUrl = this.getUrl(basePath, url);
        return loader.load(realUrl, url);
    },

    release: function (url) {
    },

    releaseAll: function () {
    }

};
cc.defineGetterSetter(cc.loader, "resPath", function () {
    return this._resPath;
}, function (resPath) {
    this._resPath = resPath || "";
    jsb.fileUtils.addSearchPath(this._resPath);
});
cc.defineGetterSetter(cc.loader, "audioPath", function () {
    return this._audioPath;
}, function (audioPath) {
    this._audioPath = audioPath || "";
    jsb.fileUtils.addSearchPath(this._audioPath);
});

cc.formatStr = function () {
    var args = arguments;
    var l = args.length;
    if (l < 1)
        return "";

    var str = args[0];
    var needToFormat = true;
    if (typeof str == "object") {
        needToFormat = false;
    }
    for (var i = 1; i < l; ++i) {
        var arg = args[i];
        if (needToFormat) {
            while (true) {
                var result = null;
                if (typeof arg == "number") {
                    result = str.match(/(%d)|(%s)/);
                    if (result) {
                        str = str.replace(/(%d)|(%s)/, arg);
                        break;
                    }
                }
                result = str.match(/%s/);
                if (result)
                    str = str.replace(/%s/, arg);
                else
                    str += "    " + arg;
                break;
            }
        } else
            str += "    " + arg;
    }
    return str;
};

cc.director = cc.Director.getInstance();

cc.winSize = cc.director.getWinSize();

cc.view = cc.director.getOpenGLView();
cc.view.getDevicePixelRatio = function () {
    var sys = cc.sys;
    return (sys.os == sys.OS_IOS || sys.os == sys.OS_OSX) ? 2 : 1;
};
cc.view.convertToLocationInView = function (tx, ty, relatedPos) {
    var _devicePixelRatio = cc.view.getDevicePixelRatio();
    return {
        x: _devicePixelRatio * (tx - relatedPos.left),
        y: _devicePixelRatio * (relatedPos.top + relatedPos.height - ty)
    };
};
cc.view.enableRetina = function (enabled) {
};
cc.view.isRetinaEnabled = function () {
    var sys = cc.sys;
    return (sys.os == sys.OS_IOS || sys.os == sys.OS_OSX) ? true : false;
};
cc.view.adjustViewPort = function () {
};
cc.view.resizeWithBrowserSize = function () {
    return;
};
cc.view.setResizeCallback = function () {
    return;
};
cc.view.enableAutoFullScreen = function () {
    return;
};
cc.view.isAutoFullScreenEnabled = function () {
    return true;
};
cc.view._setDesignResolutionSize = cc.view.setDesignResolutionSize;
cc.view.setDesignResolutionSize = function (width, height, resolutionPolicy) {
    cc.view._setDesignResolutionSize(width, height, resolutionPolicy);
    cc.winSize = cc.director.getWinSize();
    cc.visibleRect.init();
};
cc.view.setResolutionPolicy = function (resolutionPolicy) {
    var size = cc.view.getDesignResolutionSize();
    cc.view.setDesignResolutionSize(size.width, size.height, resolutionPolicy);
};
cc.view.setContentTranslateLeftTop = function () {
    return;
};
cc.view.getContentTranslateLeftTop = function () {
    return null;
};
cc.view.setFrameZoomFactor = function () {
    return;
};
cc.DENSITYDPI_DEVICE = "device-dpi";
cc.DENSITYDPI_HIGH = "high-dpi";
cc.DENSITYDPI_MEDIUM = "medium-dpi";
cc.DENSITYDPI_LOW = "low-dpi";
cc.view.setTargetDensityDPI = function () {
};
cc.view.getTargetDensityDPI = function () {
    return cc.DENSITYDPI_DEVICE;
};

cc.eventManager = cc.director.getEventDispatcher();

cc.audioEngine = cc.AudioEngine.getInstance();
cc.audioEngine.end = function () {
    this.stopMusic();
    this.stopAllEffects();
};

cc.configuration = cc.Configuration.getInstance();

cc.textureCache = cc.director.getTextureCache();
cc.TextureCache.prototype._addImageAsync = cc.TextureCache.prototype.addImageAsync;
cc.TextureCache.prototype.addImageAsync = function (url, cb, target) {
    var localTex = null;
    cc.loader.loadImg(url, function (err, tex) {
        if (err) tex = null;
        if (cb) {
            cb.call(target, tex);
        }
        localTex = tex;
    });
    return localTex;
};

cc.TextureCache.prototype._addImage = cc.TextureCache.prototype.addImage;
cc.TextureCache.prototype.addImage = function (url, cb, target) {
    if (typeof cb === "function") {
        return this.addImageAsync(url, cb, target);
    }
    else {
        if (cb) {
            return this._addImage(url, cb)
        }
        else {
            return this._addImage(url);
        }
    }
};

cc.shaderCache = cc.ShaderCache.getInstance();

cc.animationCache = cc.AnimationCache.getInstance();

cc.spriteFrameCache = cc.SpriteFrameCache.getInstance();

cc.plistParser = cc.PlistParser.getInstance();

cc.fileUtils = cc.FileUtils.getInstance();
cc.fileUtils.setPopupNotify(false);

cc.screen = {
    init: function () {
    },
    fullScreen: function () {
        return true;
    },
    requestFullScreen: function (element, onFullScreenChange) {
        onFullScreenChange.call();
    },
    exitFullScreen: function () {
        return false;
    },
    autoFullScreen: function (element, onFullScreenChange) {
        onFullScreenChange.call();
    }
};

var jsb = jsb || {};

jsb.fileUtils = cc.fileUtils;
delete cc.FileUtils;
delete cc.fileUtils;

jsb.reflection = {
    callStaticMethod: function () {
        cc.log("not supported on current platform");
    }
};

cc.winEvents = {
    hiddens: [],
    shows: []
};

cc._initSys = function (config, CONFIG_KEY) {

    var locSys = cc.sys = sys || {};

    locSys.LANGUAGE_ENGLISH = "en";

    locSys.LANGUAGE_CHINESE = "zh";

    locSys.LANGUAGE_FRENCH = "fr";

    locSys.LANGUAGE_ITALIAN = "it";

    locSys.LANGUAGE_GERMAN = "de";

    locSys.LANGUAGE_SPANISH = "es";

    locSys.LANGUAGE_DUTCH = "nl";

    locSys.LANGUAGE_DUTCH = "du";

    locSys.LANGUAGE_RUSSIAN = "ru";

    locSys.LANGUAGE_KOREAN = "ko";

    locSys.LANGUAGE_JAPANESE = "ja";

    locSys.LANGUAGE_HUNGARIAN = "hu";

    locSys.LANGUAGE_PORTUGUESE = "pt";

    locSys.LANGUAGE_ARABIC = "ar";

    locSys.LANGUAGE_NORWEGIAN = "no";

    locSys.LANGUAGE_POLISH = "pl";

    locSys.LANGUAGE_TURKISH = "tr";
    locSys.LANGUAGE_UKRAINIAN = "uk";
    locSys.LANGUAGE_ROMANIAN = "ro";
    locSys.LANGUAGE_BULGARIAN = "bg";
    locSys.LANGUAGE_VIETNAMESE = "vi";

    sys.OS_IOS = "iOS";

    sys.OS_ANDROID = "Android";

    sys.OS_WINDOWS = "Windows";

    sys.OS_MARMALADE = "Marmalade";

    sys.OS_LINUX = "Linux";

    sys.OS_BADA = "Bada";

    sys.OS_BLACKBERRY = "Blackberry";

    sys.OS_OSX = "OS X";

    sys.OS_WP8 = "WP8";

    sys.OS_WINRT = "WINRT";

    sys.OS_UNKNOWN = "Unknown";

    sys.UNKNOWN = 0;

    sys.IOS = 1;

    sys.ANDROID = 2;

    sys.WIN32 = 3;

    sys.MARMALADE = 4;

    sys.LINUX = 5;

    sys.BADA = 6;

    sys.BLACKBERRY = 7;

    sys.MACOS = 8;

    sys.NACL = 9;

    sys.EMSCRIPTEN = 10;

    sys.TIZEN = 11;

    sys.QT5 = 12;

    sys.WP8 = 13;

    sys.WINRT = 14;

    locSys.MOBILE_BROWSER = 100;

    locSys.DESKTOP_BROWSER = 101;

    locSys.BROWSER_TYPE_WECHAT = "wechat";
    locSys.BROWSER_TYPE_ANDROID = "androidbrowser";
    locSys.BROWSER_TYPE_IE = "ie";
    locSys.BROWSER_TYPE_QQ = "qqbrowser";
    locSys.BROWSER_TYPE_MOBILE_QQ = "mqqbrowser";
    locSys.BROWSER_TYPE_UC = "ucbrowser";
    locSys.BROWSER_TYPE_360 = "360browser";
    locSys.BROWSER_TYPE_BAIDU_APP = "baiduboxapp";
    locSys.BROWSER_TYPE_BAIDU = "baidubrowser";
    locSys.BROWSER_TYPE_MAXTHON = "maxthon";
    locSys.BROWSER_TYPE_OPERA = "opera";
    locSys.BROWSER_TYPE_MIUI = "miuibrowser";
    locSys.BROWSER_TYPE_FIREFOX = "firefox";
    locSys.BROWSER_TYPE_SAFARI = "safari";
    locSys.BROWSER_TYPE_CHROME = "chrome";
    locSys.BROWSER_TYPE_UNKNOWN = "unknown";

    locSys.isNative = true;

    locSys.os = __getOS();

    locSys.platform = __getPlatform();

    locSys.garbageCollect = function () {
        __jsc__.garbageCollect();
    };

    locSys.dumpRoot = function () {
        __jsc__.dumpRoot();
    };

    locSys.restartVM = function () {
        __restartVM();
    };

    locSys.cleanScript = function (jsFile) {
        __cleanScript(jsFile);
    };

    locSys.isObjectValid = function (obj) {
        return __isObjectValid(obj);
    };

    locSys.dump = function () {
        var self = this;
        var str = "";
        str += "isMobile : " + self.isMobile + "\r\n";
        str += "language : " + self.language + "\r\n";
        str += "browserType : " + self.browserType + "\r\n";
        str += "capabilities : " + JSON.stringify(self.capabilities) + "\r\n";
        str += "os : " + self.os + "\r\n";
        str += "platform : " + self.platform + "\r\n";
        cc.log(str);
    }

    locSys.isMobile = (locSys.os == locSys.OS_ANDROID || locSys.os == locSys.OS_IOS || locSys.os == locSys.OS_WP8 || locSys.os == locSys.OS_WINRT) ? true : false;

    locSys.language = (function () {
        var language = cc.Application.getInstance().getCurrentLanguage();
        switch (language) {
            case 0:
                return locSys.LANGUAGE_ENGLISH;
            case 1:
                return locSys.LANGUAGE_CHINESE;
            case 2:
                return locSys.LANGUAGE_FRENCH;
            case 3:
                return locSys.LANGUAGE_ITALIAN;
            case 4:
                return locSys.LANGUAGE_GERMAN;
            case 5:
                return locSys.LANGUAGE_SPANISH;
            case 6:
                return locSys.LANGUAGE_DUTCH;
            case 7:
                return locSys.LANGUAGE_RUSSIAN;
            case 8:
                return locSys.LANGUAGE_KOREAN;
            case 9:
                return locSys.LANGUAGE_JAPANESE;
            case 10:
                return locSys.LANGUAGE_HUNGARIAN;
            case 11:
                return locSys.LANGUAGE_PORTUGUESE;
            case 12:
                return locSys.LANGUAGE_ARABIC;
            case 13:
                return locSys.LANGUAGE_NORWEGIAN;
            case 14:
                return locSys.LANGUAGE_POLISH;
            case 15:
                return locSys.LANGUAGE_TURKISH;
            case 16:
                return locSys.LANGUAGE_UKRAINIAN;
            case 17:
                return locSys.LANGUAGE_ROMANIAN;
            case 18:
                return locSys.LANGUAGE_BULGARIAN;
            case 19:
                return locSys.LANGUAGE_VIETNAMESE;
            default :
                return locSys.LANGUAGE_ENGLISH;
        }
    })();

    locSys.browserType = null;

    var capabilities = locSys.capabilities = {"opengl": true};
    if (locSys.isMobile) {
        capabilities["accelerometer"] = true;
        capabilities["touches"] = true;
    } else {

        capabilities["keyboard"] = true;
        capabilities["mouse"] = true;
    }

    locSys.openURL = function (url) {
        cc.Application.getInstance().openURL(url);
    }
};

cc._initDebugSetting = function (mode) {
    var ccGame = cc.game;
    var bakLog = cc._cocosplayerLog || cc.log || log;
    cc.log = cc.warn = cc.error = cc.assert = function () {
    };
    if (mode == ccGame.DEBUG_MODE_NONE) {
    } else {
        cc.error = function () {
            bakLog.call(this, "ERROR :  " + cc.formatStr.apply(cc, arguments));
        };
        cc.assert = function (cond, msg) {
            if (!cond && msg) {
                var args = [];
                for (var i = 1; i < arguments.length; i++)
                    args.push(arguments[i]);
                bakLog("Assert: " + cc.formatStr.apply(cc, args));
            }
        };
        if (mode != ccGame.DEBUG_MODE_ERROR && mode != ccGame.DEBUG_MODE_ERROR_FOR_WEB_PAGE) {
            cc.warn = function () {
                bakLog.call(this, "WARN :  " + cc.formatStr.apply(cc, arguments));
            };
        }
        if (mode == ccGame.DEBUG_MODE_INFO || mode == ccGame.DEBUG_MODE_INFO_FOR_WEB_PAGE) {
            cc.log = function () {
                bakLog.call(this, cc.formatStr.apply(cc, arguments));
            };
        }
    }
};

cc.game = {
    DEBUG_MODE_NONE: 0,
    DEBUG_MODE_INFO: 1,
    DEBUG_MODE_WARN: 2,
    DEBUG_MODE_ERROR: 3,
    DEBUG_MODE_INFO_FOR_WEB_PAGE: 4,
    DEBUG_MODE_WARN_FOR_WEB_PAGE: 5,
    DEBUG_MODE_ERROR_FOR_WEB_PAGE: 6,

    EVENT_HIDE: "game_on_hide",
    EVENT_SHOW: "game_on_show",

    CONFIG_KEY: {
        engineDir: "engineDir",
        dependencies: "dependencies",
        debugMode: "debugMode",
        showFPS: "showFPS",
        frameRate: "frameRate",
        id: "id",
        renderMode: "renderMode",
        jsList: "jsList",
        classReleaseMode: "classReleaseMode"
    },

    _prepareCalled: false,
    _prepared: false,
    _paused: true,

    _intervalId: null,

    config: null,

    onStart: null,

    onExit: null,

    onBeforeResume: null,

    onAfterResume: null,

    onBeforePause: null,

    onAfterPause: null,

    setFrameRate: function (frameRate) {
        var self = this, config = self.config, CONFIG_KEY = self.CONFIG_KEY;
        config[CONFIG_KEY.frameRate] = frameRate;
        cc.director.setAnimationInterval(1.0 / frameRate);
    },

    restart: function () {
        __restartVM();
    },

    run: function () {
        var self = this;
        if (!self._prepareCalled) {
            self.prepare(function () {
                self.onStart();
            });
        } else {
            self.onStart();
        }
    },

    _initConfig: function () {
        cc._initDebugSetting(1);
        var self = this, CONFIG_KEY = self.CONFIG_KEY;
        var _init = function (cfg) {
            cfg[CONFIG_KEY.engineDir] = cfg[CONFIG_KEY.engineDir] || "frameworks/cocos2d-html5";
            cfg[CONFIG_KEY.debugMode] = cfg[CONFIG_KEY.debugMode] || 0;
            cfg[CONFIG_KEY.frameRate] = cfg[CONFIG_KEY.frameRate] || 60;
            cfg[CONFIG_KEY.renderMode] = cfg[CONFIG_KEY.renderMode] || 0;
            cfg[CONFIG_KEY.showFPS] = cfg[CONFIG_KEY.showFPS] === false ? false : true;
            return cfg;
        };
        var data = {
            "project_type": "javascript",
            "debugMode": 1,
            "showFPS": false,
            "frameRate": 60,
            "id": "gameCanvas",
            "renderMode": 0,
            "engineDir": "frameworks/cocos2d-html5",
            "modules": ["cocos2d", "extensions"],
            "jsList": [
                "src/util/preloading.js"
            ]
        }
        this.config = _init(data || {});
        cc._initDebugSetting(this.config[CONFIG_KEY.debugMode]);
        cc.director.setDisplayStats(this.config[CONFIG_KEY.showFPS]);
        cc.director.setAnimationInterval(1.0 / this.config[CONFIG_KEY.frameRate]);
        cc._initSys(this.config, CONFIG_KEY);
    },

    _jsAddedCache: {},
    _getJsListOfModule: function (moduleMap, moduleName, dir) {
        var jsAddedCache = this._jsAddedCache;
        if (jsAddedCache[moduleName]) return null;
        dir = dir || "";
        var jsList = [];
        var tempList = moduleMap[moduleName];
        if (!tempList) throw "can not find module [" + moduleName + "]";
        var ccPath = cc.path;
        for (var i = 0, li = tempList.length; i < li; i++) {
            var item = tempList[i];
            if (jsAddedCache[item]) continue;
            var extname = ccPath.extname(item);
            if (!extname) {
                var arr = this._getJsListOfModule(moduleMap, item, dir);
                if (arr) jsList = jsList.concat(arr);
            } else if (extname.toLowerCase() == ".js") jsList.push(ccPath.join(dir, item));
            jsAddedCache[item] = true;
        }
        return jsList;
    },

    prepare: function (cb) {
        var self = this, config = self.config, CONFIG_KEY = self.CONFIG_KEY, loader = cc.loader;
        require("script/jsb.js");
        self._prepareCalled = true;
        loader.loadJsWithImg("", config[CONFIG_KEY.jsList] || [], function (err) {
            if (err) throw err;
            self._prepared = true;
            if (cb) cb();
        });
    }
};
cc.game._initConfig();

if (window.JavascriptJavaBridge && cc.sys.os == cc.sys.OS_ANDROID) {
    jsb.reflection = new JavascriptJavaBridge();
    cc.sys.capabilities["keyboard"] = true;
}
else if (window.JavaScriptObjCBridge && (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX)) {
    jsb.reflection = new JavaScriptObjCBridge();
}

jsb.urlRegExp = new RegExp(
    "^" +

    "(?:(?:https?|ftp)://)" +

    "(?:\\S+(?::\\S*)?@)?" +
    "(?:" +

    "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
    "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
    "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
    "|" +

    "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +

    "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +

    "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
    ")" +

    "(?::\\d{2,5})?" +

    "(?:/\\S*)?" +
    "$", "i"
);

