sp.ANIMATION_EVENT_TYPE = {
	START: 0,
	END: 1,
	COMPLETE: 2,
	EVENT: 3
};

sp.SkeletonAnimation.prototype._ctor = function(skeletonDataFile, atlasFile, scale) {
	if(atlasFile) {
        if (isNaN(scale)) {
            scale = 1;
        }

        this.initWithFile(skeletonDataFile, atlasFile, scale);
        this.initialize();

        this._target = null;
        this._callback = null;
	}
};

sp.SkeletonAnimation.extend = cc.Class.extend;

sp.SkeletonAnimation.prototype.setAnimationListener = function (target, callback) {
    this._target = target;
    this._callback = callback;

    this.setStartListener(function (trackIndex) {
    	if (this._target && this._callback) {
            this._callback.call(this._target, this, trackIndex, sp.ANIMATION_EVENT_TYPE.START, null, 0);
        }
    });

    this.setEndListener(function (trackIndex) {
    	if (this._target && this._callback) {
            this._callback.call(this._target, this, trackIndex, sp.ANIMATION_EVENT_TYPE.END, null, 0);
        }
    });

    this.setCompleteListener(function (trackIndex, loopCount) {
    	if (this._target && this._callback) {
            this._callback.call(this._target, this, trackIndex, sp.ANIMATION_EVENT_TYPE.COMPLETE, null, loopCount);
        }
    });

    this.setEventListener(function (trackIndex, event) {
    	if (this._target && this._callback) {
            this._callback.call(this._target, this, trackIndex, sp.ANIMATION_EVENT_TYPE.EVENT, event, 0);
        }
    });
}