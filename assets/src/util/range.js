var Range = function (rangstr) {
    var array = rangstr.split(',');
    this.leftInclude = array[0].substr(0, 1) === '[';
    var leftNumStr = array[0].substr(1);
    this.leftNum = leftNumStr === '-' ? -Number.MAX_VALUE : Number(leftNumStr);

    this.rightInclude = array[1].substr(array[1].length - 1) === ']';
    var rightNumStr = array[1].substr(0, array[1].length - 1);
    this.rightNum = rightNumStr === '-' ? Number.MAX_VALUE : Number(rightNumStr);
};

Range.prototype.isInRange = function (value) {
    var leftRes = false;
    if (this.leftInclude) {
        leftRes = value >= this.leftNum;
    } else {
        leftRes = value > this.leftNum;
    }

    var rightRes = false;
    if (this.rightInclude) {
        rightRes = value <= this.rightNum;
    } else {
        rightRes = value < this.rightNum;
    }
    return leftRes && rightRes;
};