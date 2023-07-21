var RandomBattleConfig = {
    distance: 100,
    day: {probability: 0.1, difficulty: [1, 3]},
    night: {probability: 0.3, difficulty: [2, 4]}
};

var playerConfig = {
    "changeByTime": [
        [-4],
        [-3],
        [-1],
        [-2],
        [-2],
        [-4]
    ],
    "temperature": [
        [15, 2, -2],
        [0, 2, -2],
        [10, 2, -2],
        [18, 5, 0],
        [13]
    ]
};

var playerAttrEffect = {
    "starve": {
        "1": {
            "effect": {
                "spirit": -5,
                "infect": 1.5
            },
            "id": 1,
            "range": "[-,25]"
        },
        "2": {
            "effect": {
                "spirit": -2
            },
            "id": 2,
            "range": "(25,50]"
        },
        "3": {
            "effect": {},
            "id": 3,
            "range": "(50,75]"
        },
        "4": {
            "effect": {},
            "id": 4,
            "range": "(75,-]"
        }
    },
    "infect": {
        "1": {
            "effect": {},
            "id": 1,
            "range": "[-,0]"
        },
        "2": {
            "effect": {},
            "id": 2,
            "range": "(0,25]"
        },
        "3": {
            "effect": {
                "hp": -6
            },
            "id": 3,
            "range": "(25,50]"
        },
        "4": {
            "effect": {
                "spirit": -1,
                "infect": 1,
                "hp": -12
            },
            "id": 4,
            "range": "(50,75]"
        },
        "5": {
            "effect": {
                "spirit": -1,
                "infect": 1,
                "hp": -16
            },
            "id": 5,
            "range": "(75,-]"
        }
    },
    "vigour": {
        "1": {
            "effect": {
                "spirit": -2
            },
            "id": 1,
            "range": "[-,25]"
        },
        "2": {
            "effect": {
                "spirit": -1
            },
            "id": 2,
            "range": "(25,50]"
        },
        "3": {
            "effect": {},
            "id": 3,
            "range": "(50,75]"
        },
        "4": {
            "effect": {},
            "id": 4,
            "range": "(75,-]"
        },

    },
    "injury": {
        "1": {
            "effect": {},
            "id": 1,
            "range": "[-,0]"
        },
        "2": {
            "effect": {},
            "id": 2,
            "range": "(0,25]"
        },
        "3": {
            "effect": {},
            "id": 3,
            "range": "(25,50]"
        },
        "4": {
            "effect": {
                "spirit": -1,
                "infect": 1
            },
            "id": 4,
            "range": "(50,75]"
        },
        "5": {
            "effect": {
                "spirit": -1,
                "infect": 2
            },
            "id": 5,
            "range": "(75,-]"
        }
    },
    "spirit": {
        "1": {
            "effect": {},
            "id": 1,
            "range": "[-,25]"
        },
        "2": {
            "effect": {},
            "id": 2,
            "range": "(25,50]"
        },
        "3": {
            "effect": {},
            "id": 3,
            "range": "(50,75]"
        },
        "4": {
            "effect": {},
            "id": 4,
            "range": "(75,-]"
        }
    },
    "water": {
        "1": {
            "effect": {
                "hp": -10
            },
            "id": 1,
            "range": "[-,25]"
        },
        "2": {
            "effect": {},
            "id": 2,
            "range": "(25,50]"
        },
        "3": {
            "effect": {},
            "id": 3,
            "range": "(50,75]"
        },
        "4": {
            "effect": {},
            "id": 4,
            "range": "(75,-]"
        }
    },
    "virus": {
        "1": {
            "effect": {},
            "id": 1,
            "range": "[-,25]"
        },
        "2": {
            "effect": {},
            "id": 2,
            "range": "(25,50]"
        },
        "3": {
            "effect": {},
            "id": 3,
            "range": "(50,75]"
        },
        "4": {
            "effect": {},
            "id": 4,
            "range": "(75,-]"
        }
    },
    "temperature": {
        "1": {
            "effect": {},
            "id": 1,
            "range": "[-,-10)"
        },
        "2": {
            "effect": {
                "infect": 1
            },
            "id": 2,
            "range": "[-10,10]"
        },
        "3": {
            "effect": {},
            "id": 3,
            "range": "(10,-]"
        }
    }
};