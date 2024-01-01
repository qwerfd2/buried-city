_forceExtend(ccui.Widget.prototype, {
    _getXPercent: function() {
        return this.getPositionPercent().x;
    },
    _getYPercent: function() {
        return this.getPositionPercent().y;
    },

    _setXPercent: function(x) {
        var p = cc.p(x, this.getPositionPercent().y);
        this.setPositionPercent(p);
    },
    _setYPercent: function(y) {
        var p = cc.p(this.getPositionPercent().x, y);
        this.setPositionPercent(p);
    },

    _getWidth: function() {
        return this.getContentSize().width;
    },
    _getHeight: function() {
        return this.getContentSize().height;
    },
    _getWidthPercent: function() {
        return this.getSizePercent().width;
    },
    _getHeightPercent: function() {
        return this.getSizePercent().height;
    },

    _setWidth: function(w) {
        var size = cc.size(w, this.getContentSize().height);
        this.setContentSize(size);
    },
    _setHeight: function(h) {
        var size = cc.size(this.getContentSize().width, h);
        this.setContentSize(size);
    },
    _setWidthPercent: function(w) {
        var size = cc.size(w, this.getSizePercent().height);
        this.setSizePercent(size);
    },
    _setHeightPercent: function(h) {
        var size = cc.size(this.getSizePercent().width, h);
        this.setSizePercent(size);
    }
});

_safeExtend(ccui.Button.prototype, {
    _fontStyleRE: /^(\d+)px\s+['"]?([\w\s\d]+)['"]?$/,

    _getTitleFont: function() {
        var size = this.getTitleFontSize();
        var name = this.getTitleFontName();
        return size + "px '" + name + "'";
    },

    _setTitleFont: function(fontStyle) {
        var res = this._fontStyleRE.exec(fontStyle);
        if(res) {
            this.setTitleFontSize(parseInt(res[1]));
            this.setTitleFontName(res[2]);
        }
    }
});

_safeExtend(ccui.Text.prototype, {
    _getBoundingWidth: function() {
        return this.getTextAreaSize().width;
    },
    _getBoundingHeight: function() {
        return this.getTextAreaSize().height;
    },

    _setBoundingWidth: function(w) {
        var size = cc.size(w, this.getTextAreaSize().height);
        this.setTextAreaSize(size);
    },
    _setBoundingHeight: function(h) {
        var size = cc.size(this.getTextAreaSize().width, h);
        this.setTextAreaSize(size);
    }
});

_safeExtend(ccui.TextField.prototype, {
    _fontStyleRE: /^(\d+)px\s+['"]?([\w\s\d]+)['"]?$/,

    _getFont: function() {
        var size = this.getFontSize();
        var name = this.getFontName();
        return size + "px '" + name + "'";
    },

    _setFont: function(fontStyle) {
        var res = this._fontStyleRE.exec(fontStyle);
        if(res) {
            this.setFontSize(parseInt(res[1]));
            this.setFontName(res[2]);
        }
    }
});

_safeExtend(ccui.ScrollView.prototype, {
    _getInnerWidth: function() {
        return this.getInnerContainerSize().width;
    },
    _getInnerHeight: function() {
        return this.getInnerContainerSize().height;
    },

    _setInnerWidth: function(w) {
        var size = cc.size(w, this.getInnerContainerSize().height);
        this.setInnerContainerSize(size);
    },
    _setInnerHeight: function(h) {
        var size = cc.size(this.getInnerContainerSize().width, h);
        this.setInnerContainerSize(size);
    }
});