var cc = cc || {};

(function() {

    ccui.Text.prototype.setText = function(text){
        logW("ccui.Text.setText", "ccui.Text.setString");
        this.setString(text);
    };

    ccui.Text.prototype.getStringValue = function(){
        logW("ccui.Text.getStringValue", "ccui.Text.getString");
        return this.getString();
    };

})();
