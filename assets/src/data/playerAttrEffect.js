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
        }
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