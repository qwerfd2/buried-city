/**
 * Created by lancelot on 15/4/24.
 */
var buildActionConfig = {
    "5": [{
        "cost": [{"itemId": 1101011, "num": 1}],
        "makeTime": 240,
        "max": 6
    }],
    "8": [{
        "produce": [{"itemId": 1103041, "num": 4}],
        "cost": [{"itemId": 1103011, "num": 2}],
        "makeTime": 30,
        "placedTime": [2880, 4320]
    }],
    "9": [{
        "rate": 0.7
    }, {
        "rate": 1
    }],
    "10": [
        [{
            "cost": [{"itemId": 1105011, "num": 4}, {
                "itemId": 1101061,
                "num": 1
            }, {"itemId": 1101011, "num": 1}],
            "makeTime": 60,
            "effect": {"spirit": 60, "spirit_chance": 1}
        }, {
            "cost": [{"itemId": 1105022, "num": 3}],
            "makeTime": 60,
            "effect": {"spirit": 60, "spirit_chance": 1}
        }],
        [{
            "cost": [{"itemId": 1105011, "num": 4}, {
                "itemId": 1101061,
                "num": 1
            }, {"itemId": 1101011, "num": 1}],
            "makeTime": 60,
            "effect": {"spirit": 80, "spirit_chance": 1}
        }, {
            "cost": [{"itemId": 1105022, "num": 3}],
            "makeTime": 60,
            "effect": {"spirit": 80, "spirit_chance": 1}
        }],
        [{
            "cost": [{"itemId": 1105011, "num": 4}, {
                "itemId": 1101061,
                "num": 1
            }, {"itemId": 1101011, "num": 1}],
            "makeTime": 60,
            "effect": {"spirit": 100, "spirit_chance": 1}
        }, {
            "cost": [{"itemId": 1105022, "num": 3}],
            "makeTime": 60,
            "effect": {"spirit": 100, "spirit_chance": 1}
        }]
    ],
    "12": [{
        "cost": [{"itemId": 1103041, "num": 2}],
        "makeTime": 30
    }],
    "17": [{
        "cost": [{"itemId": 1303012, "num": 3}],
        "makeTime": 30
    }]
};
module.exports = buildActionConfig;