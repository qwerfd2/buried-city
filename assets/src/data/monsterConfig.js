var monsterConfig = {
    "1": {
        "id": 1,
        "hp": 100,
        "speed": 1,
        "attackSpeed": 2,
        "attack": 10,
        "range": 0,
        "prefixType": 1
    },
    "2": {
        "id": 2,
        "hp": 100,
        "speed": 1,
        "attackSpeed": 1,
        "attack": 13,
        "range": 0,
        "prefixType": 2
    },
    "3": {
        "id": 3,
        "hp": 150,
        "speed": 1,
        "attackSpeed": 1,
        "attack": 16,
        "range": 0,
        "prefixType": 3
    },
    "4": {
        "id": 4,
        "hp": 50,
        "speed": 2,
        "attackSpeed": 0.5,
        "attack": 5,
        "range": 0,
        "prefixType": 4
    },
    "5": {
        "id": 5,
        "hp": 50,
        "speed": 2,
        "attackSpeed": 0.5,
        "attack": 7,
        "range": 0,
        "prefixType": 5
    },
    "6": {
        "id": 6,
        "hp": 70,
        "speed": 2,
        "attackSpeed": 0.5,
        "attack": 10,
        "range": 0,
        "prefixType": 6
    },
    "7": {
        "id": 7,
        "hp": 220,
        "speed": 1,
        "attackSpeed": 0.5,
        "attack": 16,
        "range": 0,
        "prefixType": 7
    },
    "8": {
        "id": 8,
        "hp": 160,
        "speed": 2,
        "attackSpeed": 0.5,
        "attack": 16,
        "range": 0,
        "prefixType": 8
    },
    "9": {
        "id": 9,
        "hp": 200,
        "speed": 2,
        "attackSpeed": 1,
        "attack": 20,
        "range": 0,
        "prefixType": 9
    },
    "10": {
        "id": 10,
        "hp": 260,
        "speed": 1,
        "attackSpeed": 1,
        "attack": 23,
        "range": 0,
        "prefixType": 10
    }
};

var monsterList = {
    "10": {
        "id": 10,
        "difficulty": 1,
        "list": ["1", "1"]
    },
    "11": {
        "id": 11,
        "difficulty": 1,
        "list": ["4", "4"]
    },
    "20": {
        "id": 20,
        "difficulty": 2,
        "list": ["1", "1", "1"]
    },
    "21": {
        "id": 21,
        "difficulty": 2,
        "list": ["4", "1", "1"]
    },
    "22": {
        "id": 22,
        "difficulty": 2,
        "list": ["2", "1"]
    },
    "23": {
        "id": 23,
        "difficulty": 2,
        "list": ["4", "5"]
    },
    "30": {
        "id": 30,
        "difficulty": 3,
        "list": ["1", "1", "1", "1"]
    },
    "31": {
        "id": 31,
        "difficulty": 3,
        "list": ["4", "1", "1", "1"]
    },
    "32": {
        "id": 32,
        "difficulty": 3,
        "list": ["4", "4", "4", "4"]
    },
    "33": {
        "id": 33,
        "difficulty": 3,
        "list": ["1", "1", "2"]
    },
    "34": {
        "id": 34,
        "difficulty": 3,
        "list": ["5", "5", "4"]
    },
    "40": {
        "id": 40,
        "difficulty": 4,
        "list": ["1", "1", "1", "1", "1", "1"]
    },
    "41": {
        "id": 41,
        "difficulty": 4,
        "list": ["4", "4", "4", "1", "1", "1"]
    },
    "42": {
        "id": 42,
        "difficulty": 4,
        "list": ["1", "1", "2", "1", "2"]
    },
    "43": {
        "id": 43,
        "difficulty": 4,
        "list": ["2", "2", "2"]
    },
    "44": {
        "id": 44,
        "difficulty": 4,
        "list": ["5", "4", "1", "1", "1"]
    },
    "45": {
        "id": 45,
        "difficulty": 4,
        "list": ["5", "5", "2"]
    },
    "50": {
        "id": 50,
        "difficulty": 5,
        "list": ["1", "1", "1", "1", "1", "1", "1", "1"]
    },
    "51": {
        "id": 51,
        "difficulty": 5,
        "list": ["4", "4", "1", "1", "4", "1", "1", "1"]
    },
    "52": {
        "id": 52,
        "difficulty": 5,
        "list": ["1", "1", "1", "1", "2", "2", "2"]
    },
    "53": {
        "id": 53,
        "difficulty": 5,
        "list": ["4", "4", "4", "4", "5", "5", "5"]
    },
    "54": {
        "id": 54,
        "difficulty": 5,
        "list": ["1", "1", "1", "2", "2", "3"]
    },
    "55": {
        "id": 55,
        "difficulty": 5,
        "list": ["4", "4", "4", "5", "5", "6"]
    },
    "56": {
        "id": 56,
        "difficulty": 5,
        "list": ["6", "6", "3"]
    },
    "60": {
        "id": 60,
        "difficulty": 6,
        "list": ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1"]
    },
    "61": {
        "id": 61,
        "difficulty": 6,
        "list": ["4", "1", "4", "1", "1", "4", "4", "1", "1", "1"]
    },
    "62": {
        "id": 62,
        "difficulty": 6,
        "list": ["1", "1", "2", "2", "2", "2"]
    },
    "63": {
        "id": 63,
        "difficulty": 6,
        "list": ["2", "2", "2", "3", "3"]
    },
    "64": {
        "id": 64,
        "difficulty": 6,
        "list": ["4", "4", "4", "5", "5", "5", "5"]
    },
    "65": {
        "id": 65,
        "difficulty": 6,
        "list": ["4", "4", "5", "5", "5", "6"]
    },
    "66": {
        "id": 66,
        "difficulty": 6,
        "list": ["5", "5", "2", "2", "3"]
    },
    "67": {
        "id": 67,
        "difficulty": 6,
        "list": ["6", "6", "3", "3"]
    },
    "70": {
        "id": 70,
        "difficulty": 7,
        "list": ["1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"]
    },
    "71": {
        "id": 71,
        "difficulty": 7,
        "list": ["4", "1", "1", "4", "1", "4", "1", "4", "1", "1", "1"]
    },
    "72": {
        "id": 72,
        "difficulty": 7,
        "list": ["1", "1", "2", "2", "3", "3", "3"]
    },
    "73": {
        "id": 73,
        "difficulty": 7,
        "list": ["4", "4", "5", "5", "6", "6"]
    },
    "74": {
        "id": 74,
        "difficulty": 7,
        "list": ["4", "4", "6", "1", "1", "2", "3"]
    },
    "75": {
        "id": 75,
        "difficulty": 7,
        "list": ["1", "1", "2", "4", "4", "5", "6"]
    },
    "76": {
        "id": 76,
        "difficulty": 7,
        "list": ["4", "4", "5", "6", "7"]
    },
    "77": {
        "id": 77,
        "difficulty": 7,
        "list": ["1", "1", "7", "7", "7", "2", "1"]
    },
    "78": {
        "id": 78,
        "difficulty": 7,
        "list": ["7", "7", "7", "7"]
    },
    "80": {
        "id": 80,
        "difficulty": 8,
        "list": ["6", "6", "6", "7", "7", "7", "7"]
    },
    "81": {
        "id": 81,
        "difficulty": 8,
        "list": ["6", "6", "6", "6", "6", "6", "6", "6", "6", "6"]
    },
    "82": {
        "id": 82,
        "difficulty": 8,
        "list": ["7", "7", "7", "7", "7", "7", "7", "7"]
    },
    "90": {
        "id": 90,
        "difficulty": 9,
        "list": ["7", "7", "7", "7", "7", "7", "7", "7", "6", "6", "6", "6", "6"]
    },
    "91": {
        "id": 91,
        "difficulty": 9,
        "list": ["6", "6", "6", "6", "6", "6", "7", "7", "7", "7", "7", "7", "7"]
    },
    "92": {
        "id": 92,
        "difficulty": 9,
        "list": ["6", "6", "7", "7", "6", "6", "7", "7", "6", "6", "7", "7", "6", "6", "7", "7"]
    },
    "93": {
        "id": 93,
        "difficulty": 10,
        "list": ["7", "7", "7", "8", "8", "8", "8", "8", "8", "9", "9"]
    },
    "94": {
        "id": 94,
        "difficulty": 10,
        "list": ["7", "8", "8", "8", "8", "8", "9", "9"]
    },
    "95": {
        "id": 95,
        "difficulty": 10,
        "list": ["7", "7", "8", "8", "8", "8", "8", "7", "8", "8", "7", "8"]
    },
    "96": {
        "id": 96,
        "difficulty": 10,
        "list": ["8", "8", "8", "8", "9", "8", "9", "9"]
    },
    "97": {
        "id": 97,
        "difficulty": 11,
        "list": ["7", "8", "7", "8", "9", "8", "9", "9", "9", "8", "9", "9"]
    },
    "98": {
        "id": 98,
        "difficulty": 11,
        "list": ["8", "8", "9", "8", "8", "9", "8", "9", "9"]
    },
    "99": {
        "id": 99,
        "difficulty": 11,
        "list": ["8", "8", "9", "9", "9", "9", "9"]
    },
    "100": {
        "id": 100,
        "difficulty": 11,
        "list": ["7", "8", "8", "8", "8", "8", "8", "9", "9", "9", "9", "9"]
    },
    "101": {
        "id": 101,
        "difficulty": 12,
        "list": ["7", "8", "8", "8", "9", "9", "8", "9", "10", "10", "10", "9", "10", "10"]
    },
    "102": {
        "id": 102,
        "difficulty": 12,
        "list": ["8", "8", "9", "9", "10", "10", "9", "7", "10", "10", "10", "9", "9", "10"]
    },
    "103": {
        "id": 103,
        "difficulty": 12,
        "list": ["8", "9", "9", "8", "10", "10", "10", "9", "8", "10", "9", "9", "9", "10", "10"]
    },
    "104": {
        "id": 104,
        "difficulty": 12,
        "list": ["7", "10", "10", "9", "10", "9", "9", "10", "10", "10", "8", "10", "9", "10", "10"]
    },
    "105": {
        "id": 105,
        "difficulty": 12,
        "list": ["8", "8", "10", "9", "9", "10", "9", "10", "8", "10", "10", "9", "9", "10", "10"]
    },
    "106": {
        "id": 106,
        "difficulty": 12,
        "list": ["9", "10", "9", "10", "10", "10", "10", "9", "10", "10", "10", "9", "10", "10"]
    }
};