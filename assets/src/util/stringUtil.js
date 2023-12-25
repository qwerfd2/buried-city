var stringUtil = {
    getString: function (stringId) {
        if (string[stringId]) {
            if (arguments.length > 1) {
                var args = [];
                if (stringId == "site_502") {
                    args.push(string[stringId].des);
                } else {
                args.push(string[stringId]);
                }
                for (var i = 1; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                return cc.formatStr.apply(this, args);
            } else {
                return string[stringId];
            }
        } else {
            return "";
        }
    }
}
cc.formatStr = function () {
    var args = arguments;
    var l = args.length;
    if (l < 1)
        return "";

    var str = args[0];
    var needToFormat = true;
    if (typeof str === "object") {
        needToFormat = false;
    }
    for (var i = 1; i < l; ++i) {
        var arg = args[i];
        if (needToFormat) {
            while (true) {
                var result = null;
                if (typeof arg === "number") {
                    result = str.match(/(%d)|(%s)/);
                    if (result) {
                        str = str.replace(/(%d)|(%s)/, arg);
                        break;
                    }
                }
                result = str.match(/%s/);
                var result1 = str.match(/%1s/);
                var result2 = str.match(/%2s/);

                if (result)
                    str = str.replace(/%s/, arg);
                else if (result1)
                    str = str.replace(/%1s/, arg);
                else if (result2)
                    str = str.replace(/%2s/, arg);
                else
                    str += "    " + arg;

                break;
            }
        } else
            str += "    " + arg;
    }
    return str;
};