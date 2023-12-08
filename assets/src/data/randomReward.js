//4 weight = 1%, total est payout 8.02122
var GachaponConfig = [
{"itemId":"1101061", "num": 1, "weight": 40},  //0.25
{"itemId":"1105051", "num": 1, "weight": 30},  //0.75
{"itemId":"1101071", "num": 1, "weight": 20},  //1.5
{"itemId":"1101011", "num": 1, "weight": 20}, //1
{"itemId":"1101021", "num": 1, "weight": 20},  //1
{"itemId":"1101031", "num": 1, "weight": 20},  //1
{"itemId":"1101041", "num": 1, "weight": 20},  //1
{"itemId":"1101051", "num": 1, "weight": 20},  //1
{"itemId":"1105011", "num": 1, "weight": 20},  //2
{"itemId":"1302011", "num": 1, "weight": 10},  //3.5
{"itemId":"1302021", "num": 1, "weight": 10},  //2.25
{"itemId":"1103022", "num": 1, "weight": 9},  //5.25
{"itemId":"1103033", "num": 1, "weight": 9},  //4
{"itemId":"1103052", "num": 1, "weight": 9},  //4.5
{"itemId":"1105022", "num": 1, "weight": 9},  //3.75
{"itemId":"1303022", "num": 1, "weight": 8},  //8
{"itemId":"1304012", "num": 1, "weight": 8},  //8.5
{"itemId":"1306001", "num": 1, "weight": 8},  //8
{"itemId":"1103063", "num": 1, "weight": 8},  //5.75
{"itemId":"1103074", "num": 1, "weight": 7},  //12
{"itemId":"1302032", "num": 1, "weight": 7},  //11
{"itemId":"1303012", "num": 1, "weight": 7},  //8
{"itemId":"1301041", "num": 1, "weight": 6},  //17
{"itemId":"1103094", "num": 1, "weight": 6},  //14
{"itemId":"1104021", "num": 1, "weight": 6},  //16.5
{"itemId":"1301011", "num": 1, "weight": 6},  //15
{"itemId":"1107032", "num": 1, "weight": 5},  //22
{"itemId":"1104011", "num": 1, "weight": 5},  //21.5
{"itemId":"1304023", "num": 1, "weight": 5},  //18.5
{"itemId":"1303033", "num": 1, "weight": 5},  //18
{"itemId":"1107042", "num": 1, "weight": 4},  //28
{"itemId":"1301022", "num": 1, "weight": 4},  //25.5
{"itemId":"1107052", "num": 1, "weight": 4},  //24
{"itemId":"1107012", "num": 1, "weight": 4},  //22
{"itemId":"1301071", "num": 1, "weight": 3},  //30
{"itemId":"1301052", "num": 1, "weight": 3},  //28
{"itemId":"1303044", "num": 1, "weight": 3},  //28
{"itemId":"1301063", "num": 1, "weight": 2},  //55
{"itemId":"1301033", "num": 1, "weight": 2},  //50
{"itemId":"1302043", "num": 1, "weight": 2},  //50
{"itemId":"1107022", "num": 1, "weight": 2},  //45
{"itemId":"1106054", "num": 1, "weight": 1},  //100
{"itemId":"1102063", "num": 1, "weight": 1},  //60
{"itemId":"1301082", "num": 1, "weight": 1},  //60
{"itemId":"1104043", "num": 1, "weight": 1}]; //60

var randomReward = {
    "1": {
        "probability": 0.2,
        "produceValue": "3",
        "produceList": [{
            "itemId": "1102**",
            "weight": 0
        }, {
            "itemId": "1301**",
            "weight": 0
        }, {
            "itemId": "1302*1",
            "weight": 1
        }, {
            "itemId": "1305011",
            "weight": 10
        }]
    },
    "2": {
        "probability": 0.18,
        "produceValue": "3",
        "produceList": [{
            "itemId": "1102**",
            "weight": 1
        }, {
            "itemId": "1301**",
            "weight": 0
        }, {
            "itemId": "1302*1",
            "weight": 0
        }, {
            "itemId": "1305011",
            "weight": 10
        }]
    },
    "3": {
        "probability": 0.16,
        "produceValue": "9",
        "produceList": [{
            "itemId": "1102**",
            "weight": 0
        }, {
            "itemId": "1301**",
            "weight": 1
        }, {
            "itemId": "1302*1",
            "weight": 0
        }, {
            "itemId": "1305011",
            "weight": 15
        }]
    },
    "4": {
        "probability": 0.15,
        "produceValue": "9",
        "produceList": [{
            "itemId": "1102**",
            "weight": 0
        }, {
            "itemId": "1301**",
            "weight": 1
        }, {
            "itemId": "1302*1",
            "weight": 0
        }, {
            "itemId": "1305011",
            "weight": 15
        }]
    },
    "5": {
        "probability": 0.15,
        "produceValue": "9",
        "produceList": [{
            "itemId": "1102**",
            "weight": 0
        }, {
            "itemId": "1301**",
            "weight": 1
        }, {
            "itemId": "1302*1",
            "weight": 0
        }, {
            "itemId": "1305011",
            "weight": 20
        }]
    },
    "6": {
        "probability": 0.15,
        "produceValue": "19",
        "produceList": [{
            "itemId": "1102**",
            "weight": 0
        }, {
            "itemId": "1301**",
            "weight": 1
        }, {
            "itemId": "1302*1",
            "weight": 0
        }, {
            "itemId": "1305011",
            "weight": 20
        }]
    },
    "7": {
        "probability": 0.15,
        "produceValue": "19",
        "produceList": [{
            "itemId": "1102**",
            "weight": 0
        }, {
            "itemId": "1301**",
            "weight": 1
        }, {
            "itemId": "1302*1",
            "weight": 0
        }, {
            "itemId": "1305011",
            "weight": 30
        }]
    },
    "8": {
        "probability": 0.15,
        "produceValue": "29",
        "produceList": [{
            "itemId": "1102**",
            "weight": 0
        }, {
            "itemId": "1301**",
            "weight": 1
        }, {
            "itemId": "1302*1",
            "weight": 0
        }, {
            "itemId": "1305011",
            "weight": 30
        }]
    }
};