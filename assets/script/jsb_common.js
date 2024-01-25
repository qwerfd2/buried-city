cc.KEY = {
    none:0,

    back:6,
    menu:18,

    backspace:8,
    tab:9,

    enter:13,

    shift:16, 
    ctrl:17, 
    alt:18, 
    pause:19,
    capslock:20,

    escape:27,
    space:32,
    pageup:33,
    pagedown:34,
    end:35,
    home:36,
    left:37,
    up:38,
    right:39,
    down:40,
    select:41,

    insert:45,
    Delete:46,
    0:48,
    1:49,
    2:50,
    3:51,
    4:52,
    5:53,
    6:54,
    7:55,
    8:56,
    9:57,
    a:65,
    b:66,
    c:67,
    d:68,
    e:69,
    f:70,
    g:71,
    h:72,
    i:73,
    j:74,
    k:75,
    l:76,
    m:77,
    n:78,
    o:79,
    p:80,
    q:81,
    r:82,
    s:83,
    t:84,
    u:85,
    v:86,
    w:87,
    x:88,
    y:89,
    z:90,

    num0:96,
    num1:97,
    num2:98,
    num3:99,
    num4:100,
    num5:101,
    num6:102,
    num7:103,
    num8:104,
    num9:105,
    '*':106,
    '+':107,
    '-':109,
    'numdel':110,
    '/':111,
    f1:112, 
    f2:113,
    f3:114,
    f4:115,
    f5:116,
    f6:117,
    f7:118,
    f8:119,
    f9:120,
    f10:121,
    f11:122,
    f12:123,

    numlock:144,
    scrolllock:145,

    ';':186,
    semicolon:186,
    equal:187,
    '=':187,
    ',':188,
    comma:188,
    dash:189,
    '.':190,
    period:190,
    forwardslash:191,
    grave:192,
    '[':219,
    openbracket:219,
    backslash:220,
    ']':221,
    closebracket:221,
    quote:222,

    dpadLeft:1000,
    dpadRight:1001,
    dpadUp:1003,
    dpadDown:1004,
    dpadCenter:1005
};

var jsbKeyArr = [
    cc.KEY["none"],
    cc.KEY["pause"],
    cc.KEY["scrolllock"],
    cc.KEY["none"],
    cc.KEY["none"],
    cc.KEY["none"],
    cc.KEY["back"],
    cc.KEY["backspace"],
    cc.KEY["tab"],
    cc.KEY["none"],
    cc.KEY["none"],
    cc.KEY["capslock"],
    cc.KEY["shift"],
    cc.KEY["shift"],
    cc.KEY["ctrl"],
    cc.KEY["ctrl"],
    cc.KEY["alt"],
    cc.KEY["alt"],
    cc.KEY["menu"],
    cc.KEY["none"],
    cc.KEY["insert"],
    cc.KEY["home"],
    cc.KEY["pageup"],
    cc.KEY["Delete"],
    cc.KEY["end"],
    cc.KEY["pagedown"],
    cc.KEY["left"],
    cc.KEY["right"],
    cc.KEY["up"],
    cc.KEY["down"],
    cc.KEY["numlock"],
    cc.KEY["+"],
    cc.KEY["-"],
    cc.KEY["*"],
    cc.KEY["none"],
    cc.KEY["enter"],
    cc.KEY["home"],
    cc.KEY["up"],
    cc.KEY["pageup"],
    cc.KEY["left"],
    cc.KEY["num5"],
    cc.KEY["right"],
    cc.KEY["end"],
    cc.KEY["down"],
    cc.KEY["pagedown"],
    cc.KEY["insert"],
    cc.KEY["Delete"],
    cc.KEY["f1"],
    cc.KEY["f2"],
    cc.KEY["f3"],
    cc.KEY["f4"],
    cc.KEY["f5"],
    cc.KEY["f6"],
    cc.KEY["f7"],
    cc.KEY["f8"],
    cc.KEY["f9"],
    cc.KEY["f10"],
    cc.KEY["f11"],
    cc.KEY["f12"],
    cc.KEY["space"],
    cc.KEY["none"],
    cc.KEY["quote"],
    cc.KEY["none"],
    cc.KEY["none"],
    cc.KEY["none"],
    cc.KEY["none"],
    cc.KEY["none"],
    cc.KEY["quote"],
    cc.KEY["none"],
    cc.KEY["none"],
    cc.KEY["none"],
    cc.KEY["none"],
    cc.KEY["comma"],
    cc.KEY["-"],
    cc.KEY["period"],
    cc.KEY["forwardslash"],
    cc.KEY["num0"],
    cc.KEY["num1"],
    cc.KEY["num2"],
    cc.KEY["num3"],
    cc.KEY["num4"],
    cc.KEY["num5"],
    cc.KEY["num6"],
    cc.KEY["num7"],
    cc.KEY["num8"],
    cc.KEY["num9"],
    cc.KEY["none"],
    cc.KEY["semicolon"],
    cc.KEY["none"],
    cc.KEY["equal"],
    cc.KEY["none"],
    cc.KEY["none"],
    cc.KEY["none"],
    cc.KEY["a"],
    cc.KEY["b"],
    cc.KEY["c"],
    cc.KEY["d"],
    cc.KEY["e"],
    cc.KEY["f"],
    cc.KEY["g"],
    cc.KEY["h"],
    cc.KEY["i"],
    cc.KEY["j"],
    cc.KEY["k"],
    cc.KEY["l"],
    cc.KEY["m"],
    cc.KEY["n"],
    cc.KEY["o"],
    cc.KEY["p"],
    cc.KEY["q"],
    cc.KEY["r"],
    cc.KEY["s"],
    cc.KEY["t"],
    cc.KEY["u"],
    cc.KEY["v"],
    cc.KEY["w"],
    cc.KEY["x"],
    cc.KEY["y"],
    cc.KEY["z"],
    cc.KEY["openbracket"],
    cc.KEY["backslash"],
    cc.KEY["closebracket"],
    cc.KEY["none"],
    cc.KEY["grave"],
    cc.KEY["a"],
    cc.KEY["b"],
    cc.KEY["c"],
    cc.KEY["d"],
    cc.KEY["e"],
    cc.KEY["f"],
    cc.KEY["g"],
    cc.KEY["h"],
    cc.KEY["i"],
    cc.KEY["j"],
    cc.KEY["k"],
    cc.KEY["l"],
    cc.KEY["m"],
    cc.KEY["n"],
    cc.KEY["o"],
    cc.KEY["p"],
    cc.KEY["q"],
    cc.KEY["r"],
    cc.KEY["s"],
    cc.KEY["t"],
    cc.KEY["u"],
    cc.KEY["v"],
    cc.KEY["w"],
    cc.KEY["x"],
    cc.KEY["y"],
    cc.KEY["z"],
    cc.KEY["none"],
    cc.KEY["none"],
    cc.KEY["none"],
    cc.KEY["none"],
    cc.KEY["none"],
    cc.KEY["none"],
    cc.KEY["none"],
    cc.KEY["none"],
    cc.KEY["none"],
    cc.KEY["dpadLeft"],
    cc.KEY["dpadRight"],
    cc.KEY["dpadUp"],
    cc.KEY["dpadDown"],
    cc.KEY["dpadCenter"],
    cc.KEY["enter"],
    cc.KEY["none"]

];

if (cc.sys.os != cc.sys.OS_ANDROID)
{
    jsbKeyArr[6] = cc.KEY["escape"];
}

var parseKeyCode = function (keycode)
{
    var keyIndex = jsbKeyArr.indexOf(keycode);
    var jsbKeyCode = keyIndex == -1 ? cc.KEY.none : keyIndex;
    return jsbKeyCode;
}