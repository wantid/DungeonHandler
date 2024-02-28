const express = require('express');
const router = express.Router();
const fs = require('fs');

/* Отсортировать персонажей по параметру */
router.get('/sort/:key', (req, res) => {
    const keyName = req.params.key;
    const rawData = fs.readFileSync('GameData.json');
    var data = JSON.parse(rawData);
    const playersKeys = data["players"].map((item, itemId) => {
        for (var i = 0; i < item.length; i++) {
            if (item[i]["name"] === keyName) return itemId;
        }
    });

    data["turn"]["turnOrder"] = playersKeys;
    data["turn"]["currentPlayer"] = 0;
    fs.writeFileSync('GameData.json', JSON.stringify(data));
    res.json(playersKeys[0]);
});

/* Получить айди текущего игрока */
router.get('/', (req, res) => {
    const rawData = fs.readFileSync('GameData.json');
    var data = JSON.parse(rawData);
    var currentPlayer = data["turn"]["currentPlayer"];
    const currentPlayerId = data["turn"]["turnOrder"][currentPlayer];
    res.json(currentPlayerId);
});

/* Следующий ход */
router.get('/next', (req, res) => {
    const rawData = fs.readFileSync('GameData.json');
    var data = JSON.parse(rawData);
    var currentPlayer = data["turn"]["currentPlayer"];
    const currentPlayerId = data["turn"]["turnOrder"][currentPlayer];

    currentPlayer = currentPlayer + 1 >= data["turn"]["turnOrder"].length ? 0 : currentPlayer + 1;
    data["turn"]["currentPlayer"] = currentPlayer;
    fs.writeFileSync('GameData.json', JSON.stringify(data));
    res.json(currentPlayerId);
});

module.exports = router;