var WeaponReturn = {
    "1301011": ["1102011"],//handgun
    "1301022": ["1102022"],//Rifle
    "1301033": ["1102033"],//automatic rifle
    "1301041": ["1101021"],//Magnum
    "1301052": ["1101021", "1101041"],//M40
    "1301063": ["1101021", "1101041"],//FAMAS
    "1301071": ["1101051", "1102011"],//Ehandgun
    "1301082": ["1101021", "1101041", "1101051", "1101051", "1102022"],//Erifle
    "1301091": ["1101021", "1101041"],//flame
    "1302011": [],//crowbar
    "1302021": [],//axe
    "1302032": ["1102042"],//katana
    "1302043": ["1101021","1101041","1101051"],//chainsaw
    "1304012": [],//shirt
    "1304023": []//armor
};

var formulaConfig = {
    "1201061": {
        "id": "1201061",
        "produce": [{
            "itemId": 1101061,
            "num": 24
        }],
        "cost": [{
            "itemId": 1101011,
            "num": 6
        }],
        "makeTime": 30,
        "placedTime": [540]
    },
    "1202063": {
        "id": "1202063",
        "produce": [{
            "itemId": 1102063,
            "num": 1
        }],
        "cost": [{
            "itemId": 1101021,
            "num": 12
        }, {
            "itemId": 1101041,
            "num": 14
        }, {
            "itemId": 1101051,
            "num": 12
        }],
        "makeTime": 90
    },
    "1202073": {
        "id": "1202073",
        "produce": [{
            "itemId": 1102073,
            "num": 1
        }],
        "cost": [{
            "itemId": 1101021,
            "num": 4
        }, {
            "itemId": 1101031,
            "num": 8
        }, {
            "itemId": 1101041,
            "num": 6
        }, {
            "itemId": 1101071,
            "num": 2
        }],
        "makeTime": 90
    },
    "1203011": {
        "id": "1203011",
        "produce": [{
            "itemId": 1103011,
            "num": 12
        }],
        "cost": [{
            "itemId": 1105042,
            "num": 2
        }, {
            "itemId": 1101061,
            "num": 16
        }],
        "makeTime": 60,
        "placedTime": [2880]
    },
    "1203022": {
        "id": "1203022",
        "produce": [{
            "itemId": 1103022,
            "num": 1
        }],
        "cost": [{
            "itemId": 1103011,
            "num": 2
        }, {
            "itemId": 1101011,
            "num": 3
        }],
        "makeTime": 30
    },
    "1203033": {
        "id": "1203033",
        "produce": [{
            "itemId": 1103033,
            "num": 1
        }],
        "cost": [{
            "itemId": 1103011,
            "num": 2
        }, {
            "itemId": 1101061,
            "num": 2
        }, {
            "itemId": 1101011,
            "num": 1
        }],
        "makeTime": 30
    },
    "1203041": {
        "id": "1203041",
        "produce": [{
            "itemId": 1103041,
            "num": 4
        }],
        "cost": [{
            "itemId": 1103011,
            "num": 2
        }],
        "makeTime": 30
    },
    "1203052": {
        "id": "1203052",
        "produce": [{
            "itemId": 1103052,
            "num": 1
        }],
        "cost": [{
            "itemId": 1103041,
            "num": 1
        }, {
            "itemId": 1101061,
            "num": 2
        }, {
            "itemId": 1101011,
            "num": 2
        }],
        "makeTime": 30
    },
    "1203063": {
        "id": "1203063",
        "produce": [{
            "itemId": 1103063,
            "num": 1
        }],
        "cost": [{
            "itemId": 1103041,
            "num": 1
        }, {
            "itemId": 1101011,
            "num": 4
        }],
        "makeTime": 30
    },
    "1203074": {
        "id": "1203074",
        "produce": [{
            "itemId": 1103074,
            "num": 1
        }],
        "cost": [{
            "itemId": 1103041,
            "num": 1
        }, {
            "itemId": 1103011,
            "num": 2
        }, {
            "itemId": 1101061,
            "num": 2
        }, {
            "itemId": 1101011,
            "num": 1
        }, {
            "itemId": 1105051,
            "num": 1
        }, {
            "itemId": 1105022,
            "num": 1
        }],
        "makeTime": 45
    },
    "1204011": {
        "id": "1204011",
        "produce": [{
            "itemId": 1104011,
            "num": 1
        }],
        "cost": [{
            "itemId": 1105051,
            "num": 4
        }, {
            "itemId": 1101031,
            "num": 5
        }, {
            "itemId": 1105033,
            "num": 1
        }],
        "makeTime": 30
    },
    "1204021": {
        "id": "1204021",
        "produce": [{
            "itemId": 1104021,
            "num": 1
        }],
        "cost": [{
            "itemId": 1105051,
            "num": 4
        }, {
            "itemId": 1101061,
            "num": 2
        }, {
            "itemId": 1105033,
            "num": 1
        }],
        "makeTime": 30
    },
    "1204032": {
        "id": "1204032",
        "produce": [{
            "itemId": 1104032,
            "num": 1
        }],
        "cost": [{
            "itemId": 1105051,
            "num": 2
        }, {
            "itemId": 1101061,
            "num": 8
        }, {
            "itemId": 1105033,
            "num": 1
        }, {
            "itemId": 1105042,
            "num": 1
        }, {
            "itemId": 1103052,
            "num": 2
        }],
        "makeTime": 60
    },
    "1205022": {
        "id": "1205022",
        "produce": [{
            "itemId": 1105022,
            "num": 4
        }],
        "cost": [{
            "itemId": 1103011,
            "num": 8
        }, {
            "itemId": 1101061,
            "num": 8
        }, {
            "itemId": 1101011,
            "num": 4
        }],
        "makeTime": 60,
        "placedTime": [1440]
    },
    "1205033": {
        "id": "1205033",
        "produce": [{
            "itemId": 1105033,
            "num": 4
        }],
        "cost": [{
            "itemId": 1105022,
            "num": 8
        }, {
            "itemId": 1101011,
            "num": 8
        }],
        "makeTime": 30,
        "placedTime": [60]
    },
    "1205042": {
        "id": "1205042",
        "produce": [{
            "itemId": 1105042,
            "num": 2
        }],
        "cost": [{
            "itemId": 1103011,
            "num": 1
        }, {
            "itemId": 1101061,
            "num": 1
        }],
        "makeTime": 30
    },
    "1205051": {
        "id": "1205051",
        "produce": [{
            "itemId": 1105051,
            "num": 8
        }],
        "cost": [{
            "itemId": 1101061,
            "num": 16
        }],
        "makeTime": 30,
        "placedTime": [1440]
    },
    "1401011": {
        "id": "1401011",
        "produce": [{
            "itemId": 1301011,
            "num": 1
        }],
        "cost": [{
            "itemId": 1101021,
            "num": 5
        }, {
            "itemId": 1101041,
            "num": 2
        }, {
            "itemId": 1102011,
            "num": 2
        }],
        "makeTime": 60
    },
    "1401022": {
        "id": "1401022",
        "produce": [{
            "itemId": 1301022,
            "num": 1
        }],
        "cost": [{
            "itemId": 1101021,
            "num": 7
        }, {
            "itemId": 1101011,
            "num": 1
        }, {
            "itemId": 1101041,
            "num": 2
        }, {
            "itemId": 1102022,
            "num": 2
        }],
        "makeTime": 60
    },
    "1401033": {
        "id": "1401033",
        "produce": [{
            "itemId": 1301033,
            "num": 1
        }],
        "cost": [{
            "itemId": 1101021,
            "num": 12
        }, {
            "itemId": 1101011,
            "num": 1
        }, {
            "itemId": 1101041,
            "num": 6
        }, {
            "itemId": 1102033,
            "num": 3
        }],
        "makeTime": 60
    },
    "1401071": {
        "id": "1401071",
        "produce": [{
            "itemId": 1301071,
            "num": 1
        }],
        "cost": [{
            "itemId": 1101021,
            "num": 5
        }, {
            "itemId": 1101041,
            "num": 4
        }, {
            "itemId": 1102011,
            "num": 3
        }, {
            "itemId": 1101051,
            "num": 10
        }],
        "makeTime": 90
    },
    "1401082": {
        "id": "1401082",
        "produce": [{
            "itemId": 1301082,
            "num": 1
        }],
        "cost": [{
            "itemId": 1101021,
            "num": 10
        }, {
            "itemId": 1101011,
            "num": 1
        }, {
            "itemId": 1101041,
            "num": 8
        }, {
            "itemId": 1102022,
            "num": 3
        }, {
            "itemId": 1101051,
            "num": 20
        }],
        "makeTime": 90
    },
    "1401091": {
        "id": "1401091",
        "produce": [{
            "itemId": 1301091,
            "num": 1
        }],
        "cost": [{
            "itemId": 1101021,
            "num": 8
        }, {
            "itemId": 1101031,
            "num": 2
        }, {
            "itemId": 1101041,
            "num": 5
        }, {
            "itemId": 1101071,
            "num": 1
        }, {
            "itemId": 1101051,
            "num": 1
        }],
        "makeTime": 90
    },
    "1402011": {
        "id": "1402011",
        "produce": [{
            "itemId": 1302011,
            "num": 1
        }],
        "cost": [{
            "itemId": 1101021,
            "num": 2
        },
        {
            "itemId": 1101031,
            "num": 1
        }],
        "makeTime": 30
    },
    "1402021": {
        "id": "1402021",
        "produce": [{
            "itemId": 1302021,
            "num": 1
        }],
        "cost": [{
            "itemId": 1101021,
            "num": 1
        },{
            "itemId": 1101031,
            "num": 1
        }],
        "makeTime": 30
    },
    "1402032": {
        "id": "1402032",
        "produce": [{
            "itemId": 1302032,
            "num": 1
        }],
        "cost": [{
            "itemId": 1101021,
            "num": 2
        }, {
            "itemId": 1101011,
            "num": 1
        }, {
            "itemId": 1101031,
            "num": 1
        }, {
            "itemId": 1101041,
            "num": 1
        }, {
            "itemId": 1102042,
            "num": 2
        }],
        "makeTime": 60
    },
    "1402043": {
        "id": "1402043",
        "produce": [{
            "itemId": 1302043,
            "num": 1
        }],
        "cost": [{
            "itemId": 1101021,
            "num": 14
        }, {
            "itemId": 1101011,
            "num": 1
        }, {
            "itemId": 1101041,
            "num": 12
        }, {
            "itemId": 1101051,
            "num": 15
        }],
        "makeTime": 90
    },
    "1403012": {
        "id": 1403012,
        "produce": [{
            "itemId": 1303012,
            "num": 8
        }],
        "cost": [{
            "itemId": 1101071,
            "num": 4
        }, {
            "itemId": 1101021,
            "num": 4
        }, {
            "itemId": 1101041,
            "num": 4
        }, {
            "itemId": 1101031,
            "num": 2
        }],
        "makeTime": 60
    },
    "1403022": {
        "id": 1403022,
        "produce": [{
            "itemId": 1303022,
            "num": 1
        }],
        "cost": [{
            "itemId": 1103041,
            "num": 1
        }, {
            "itemId": 1101031,
            "num": 1
        }, {
            "itemId": 1101051,
            "num": 1
        }, {
            "itemId": 1101071,
            "num": 1
        }],
        "makeTime": 30
    },
    "1404012": {
        "id": "1404012",
        "produce": [{
            "itemId": 1304012,
            "num": 1
        }],
        "cost": [{
            "itemId": 1101021,
            "num": 1
        }, {
            "itemId": 1101031,
            "num": 4
        }, {
            "itemId": 1101041,
            "num": 2
        }],
        "makeTime": 30
    },
    "1404023": {
        "id": "1404023",
        "produce": [{
            "itemId": 1304023,
            "num": 1
        }],
        "cost": [{
            "itemId": 1101021,
            "num": 3
        }, {
            "itemId": 1101031,
            "num": 7
        }, {
            "itemId": 1101041,
            "num": 4
        }],
        "makeTime": 30
    },
    "1404024": {
        "id": "1404024",
        "produce": [{
            "itemId": 1306001,
            "num": 1
        }],
        "cost": [{
            "itemId": 1101021,
            "num": 2
        }, {
            "itemId": 1101031,
            "num": 4
        }, {
            "itemId": 1101041,
            "num": 4
        }],
        "makeTime": 30
    },
    "1405012": {
        "id": 1405012,
        "produce": [{
            "itemId": 1305012,
            "num": 24
        }],
        "cost": [{
            "itemId": 1101071,
            "num": 4
        }, {
            "itemId": 1101021,
            "num": 4
        }, {
            "itemId": 1101041,
            "num": 1
        }],
        "makeTime": 60
    },
    "1405023": {
        "id": "1405023",
        "produce": [{
            "itemId": 1305023,
            "num": 1
        }],
        "cost": [{
            "itemId": 1101021,
            "num": 2
        }, {
            "itemId": 1101031,
            "num": 6
        }, {
            "itemId": 1101041,
            "num": 2
        }],
        "makeTime": 60
    },
    "1405024": {
        "id": "1405024",
        "produce": [{
            "itemId": 1305024,
            "num": 1
        }],
        "cost": [{
            "itemId": 1101021,
            "num": 4
        }, {
            "itemId": 1101031,
            "num": 6
        }, {
            "itemId": 1101041,
            "num": 4
        }],
        "makeTime": 30
    },
    "1405053": {
        "id": "1405053",
        "produce": [{
            "itemId": 1305053,
            "num": 1
        }],
        "cost": [{
            "itemId": 1101073,
            "num": 10
        }, {
            "itemId": 1101051,
            "num": 15
        }, {
            "itemId": 1101031,
            "num": 6
        }, {
            "itemId": 1101041,
            "num": 8
        }],
        "makeTime": 60
    },
    "1305064": {
        "id": "1305064",
        "produce": [{
            "itemId": 1305064,
            "num": 1
        }],
        "cost": [{
            "itemId": 1101021,
            "num": 4
        }, {
            "itemId": 1101073,
            "num": 16
        }, {
            "itemId": 1101051,
            "num": 24
        }, {
            "itemId": 1101031,
            "num": 10
        }, {
            "itemId": 1101041,
            "num": 16
        }],
        "makeTime": 120
    },
    "1305075": {
        "id": "1305075",
        "produce": [{
            "itemId": 1305075,
            "num": 1
        }],
        "cost": [{
            "itemId": 1101031,
            "num": 4
        }, {
            "itemId": 1101021,
            "num": 1
        }],
        "makeTime": 30
    },
    "1305034": {
        "id": "1305034",
        "produce": [{
            "itemId": 1305034,
            "num": 1
        }],
        "cost": [{
            "itemId": 1102053,
            "num": 1
        }, {
            "itemId": 1101021,
            "num": 12
        }, {
            "itemId": 1101041,
            "num": 16
        }, {
            "itemId": 1101073,
            "num": 8
        }],
        "makeTime": 240
    },
    "1102053": {
        "id": "1102053",
        "produce": [{
            "itemId": 1102053,
            "num": 1
        }],
        "cost": [{
            "itemId": 1101021,
            "num": 4
        }, {
            "itemId": 1101041,
            "num": 8
        }, {
            "itemId": 1101051,
            "num": 4
        },{
            "itemId": 1101073,
            "num": 1
        }],
        "makeTime": 120
    }
};