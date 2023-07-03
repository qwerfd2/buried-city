/**
 * Created by lancelot on 15/7/10.
     "3014": ["多云", "晴朗", "下雨", "下雪", "大雾"],
 */
var Weather = {
    CLOUDY: 0,
    SUNSHINY: 1,
    RAIN: 2,
    SNOW: 3,
    FOG: 4
};
var WeatherSystem = cc.Class.extend({
    ctor: function() {
        this.weatherId = Weather.CLOUDY;
        this.Tomorrow = [0, 0];
        this.Random = this.getStr(0);
        this.lastDays = 0;
        this.aa= true;

        this.changeWeather(this.weatherId);
    },
    save: function() {
        var saveObj = {};
        saveObj.weatherId = this.weatherId;
        saveObj.Tomorrow = this.Tomorrow;
        saveObj.Random = this.Random;
        saveObj.lastDays = this.lastDays;
        saveObj.aa = this.aa
        return saveObj;
    },
    restore: function(saveObj) {
        if (saveObj) {
            this.weatherId = saveObj.weatherId;
            this.Tomorrow = saveObj.Tomorrow;
            this.Random = saveObj.Random;
            this.aa = saveObj.aa;
            
            this.lastDays = saveObj.lastDays;

            this.changeWeather(this.weatherId);
        }
    },
    checkWeather: function() {
        if (this.weatherId == 0) {
            var season = cc.timer.getSeason({
                d: (cc.timer.formatTime().d + 1)
            });
            var randomWeather = weatherSystemConfig[season];
            var weatherInfo = utils.getRoundRandom(randomWeather);
            this.Tomorrow.push(weatherInfo.weatherId);
            this.Tomorrow.shift();
        
            this.weatherId = this.Tomorrow[0];
            this.changeWeather(this.weatherId, true);
          
        } else {
            this.lastDays++;
            if (this.lastDays >= this.weatherConfig.lastDays) {  
            this.Tomorrow.push(0)
            this.Tomorrow.shift();
        
        this.weatherId = this.Tomorrow[0];
        this.changeWeather(this.weatherId, true);
            }
        }
    },
    
    changeWeather: function (weatherId, sendLog) {
        this.weatherId = weatherId;
        this.weatherConfig = weatherConfig[this.weatherId];
        this.lastDays = 0;
        this.Notice();
        cc.d("change weather " + this.weatherId);
        utils.emitter.emit("weather_change", weatherId);

        if (sendLog) {
            player.log.addMsg(stringUtil.getString(3015)[this.weatherId]);
        }
    },

    Notice: function() {
        var str;
        if (Math.random() >= 0.2) {
            str = this.getStr(this.Tomorrow[1])
          } else {
            str = this.getStr(utils.getRandomInt(0, 4));
        }
        this.Random = str;
    },
    
    getValue: function(key) {
        if (this.weatherConfig[key]) {
            return this.weatherConfig[key];
        } else {
            return 0;
        }
    },
    getWeatherName: function() {
        return stringUtil.getString(3014)[this.weatherId];
    },

    getStr: function(c) {
        return stringUtil.getString(3014)[c];
    }
});