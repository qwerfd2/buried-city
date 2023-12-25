var MoonlightingConfig = {
    strength: [
        {day: [1, 5], strength: [1, 5], probability: 0.2},
        {day: [6, 10], strength: [1, 10], probability: 0.2},
        {day: [11, 15], strength: [5, 10], probability: 0.2},
        {day: [16, 20], strength: [5, 15], probability: 0.2},
        {day: [21, 25], strength: [10, 15], probability: 0.25},
        {day: [26, 30], strength: [10, 20], probability: 0.25},
        {day: [31, 35], strength: [15, 20], probability: 0.25},
        {day: [36, 40], strength: [15, 25], probability: 0.25},
        {day: [41, 45], strength: [20, 25], probability: 0.30},
        {day: [46, 50], strength: [20, 30], probability: 0.30},
        {day: [51, 55], strength: [25, 30], probability: 0.30},
        {day: [56, 60], strength: [25, 35], probability: 0.30},
        {day: [61, 65], strength: [30, 35], probability: 0.35},
        {day: [66, 70], strength: [30, 40], probability: 0.35},
        {day: [71, 75], strength: [35, 40], probability: 0.35},
        {day: [76, 80], strength: [35, 45], probability: 0.35},
        {day: [81, 85], strength: [40, 45], probability: 0.4},
        {day: [86, 90], strength: [40, 50], probability: 0.4},
        {day: [91, 95], strength: [45, 50], probability: 0.4},
        {day: [96, 100], strength: [45, 55], probability: 0.4},
        {day: [101, 105], strength: [50, 55], probability: 0.45},
        {day: [106, 110], strength: [50, 60], probability: 0.45},
        {day: [111, 115], strength: [55, 60], probability: 0.45},
        {day: [116, 120], strength: [55, 65], probability: 0.45},
        {day: [121, 125], strength: [60, 65], probability: 0.5},
        {day: [126, 130], strength: [60, 70], probability: 0.5},
        {day: [131, 135], strength: [65, 70], probability: 0.5},
        {day: [136], strength: [65, 75], probability: 0.5}
    ]
};
var RandomBattleConfig = {
    strength: [
        {
            time: [1, 10], distance: 100,
            day: {probability: 0.1, difficulty: [1, 2]},
            night: {probability: 0.2, difficulty: [1, 3]}
        },
        {
            time: [11, 20], distance: 100,
            day: {probability: 0.1, difficulty: [1, 2]},
            night: {probability: 0.2, difficulty: [2, 3]}
        },
        {
            time: [21, 30], distance: 100,
            day: {probability: 0.1, difficulty: [1, 3]},
            night: {probability: 0.2, difficulty: [2, 3]}
        },
        {
            time: [31, 40], distance: 100,
            day: {probability: 0.1, difficulty: [1, 3]},
            night: {probability: 0.2, difficulty: [2, 4]}
        },
        {
            time: [41, 50], distance: 100,
            day: {probability: 0.1, difficulty: [1, 3]},
            night: {probability: 0.2, difficulty: [3, 4]}
        },
        {
            time: [51, 60], distance: 100,
            day: {probability: 0.15, difficulty: [1, 3]},
            night: {probability: 0.2, difficulty: [3, 4]}
        },
        {
            time: [61, 70], distance: 100,
            day: {probability: 0.15, difficulty: [1, 3]},
            night: {probability: 0.2, difficulty: [3, 5]}
        },
        {
            time: [71, 80], distance: 100,
            day: {probability: 0.15, difficulty: [1, 3]},
            night: {probability: 0.25, difficulty: [3, 5]}
        },
        {
            time: [81, 90], distance: 100,
            day: {probability: 0.15, difficulty: [1, 3]},
            night: {probability: 0.25, difficulty: [3, 6]}
        },
        {
            time: [91], distance: 100,
            day: {probability: 0.15, difficulty: [1, 3]},
            night: {probability: 0.25, difficulty: [4, 6]}
        }
    ]
};