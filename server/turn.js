const express = require('express');
const router = express.Router();
const fs = require('fs');

/* Отсортировать персонажей по параметру */
router.get('/sort/:key', (req, res) => {
    const keyName = req.params.key;
    const rawData = fs.readFileSync('DATA/json/GameData.json');
    var data = JSON.parse(rawData);

    /* Функция поиска параметра по названию */
    function findKeyByName(in_Struct, in_Name) {
        try {
            for (var i = 0; i < in_Struct.length; i++) {
                if (in_Struct[i]["name"] === in_Name) {
                    return in_Struct[i]["value"];
                }
            }
        } catch (e) { return -1; }
    }

    /* Получение массива игроков */
    let playersKeys = data["players"].map((item, itemId) => {
        const _ingame = findKeyByName(item, "В игре");
        return _ingame ? itemId : -1;
    });
    playersKeys = playersKeys.filter((item) => item > -1);

    /* Сортировка по параметру */
    playersKeys = playersKeys.sort((a, b) => {
        let _aValue = findKeyByName(data["players"][a], keyName),
            _bValue = findKeyByName(data["players"][b], keyName);

        return _bValue - _aValue;
    });

    data["turn"]["turnOrder"] = playersKeys;
    data["turn"]["currentPlayer"] = 0;
    fs.writeFileSync('GameData.json', JSON.stringify(data));
    res.json(playersKeys[0]);
});

/* Получить айди текущего игрока */
router.get('/', (req, res) => {
    const rawData = fs.readFileSync('DATA/json/GameData.json');
    var data = JSON.parse(rawData);
    var currentPlayer = data["turn"]["currentPlayer"];
    const currentPlayerId = data["turn"]["turnOrder"].length > 0 ? data["turn"]["turnOrder"][currentPlayer] : -1;
    res.json(currentPlayerId);
});

/* Следующий ход */
router.get('/next', (req, res) => {
    const rawData = fs.readFileSync('DATA/json/GameData.json');
    var data = JSON.parse(rawData);
    var currentPlayer = data["turn"]["currentPlayer"];
    const currentPlayerId = data["turn"]["turnOrder"][currentPlayer];

    currentPlayer = currentPlayer + 1 >= data["turn"]["turnOrder"].length ? 0 : currentPlayer + 1;
    data["turn"]["currentPlayer"] = currentPlayer;
    fs.writeFileSync('GameData.json', JSON.stringify(data));
    res.json(currentPlayerId);
});

/* Завершить бой */
router.get('/end', (req, res) => {
    const rawData = fs.readFileSync('DATA/json/GameData.json');
    var data = JSON.parse(rawData);

    data["turn"]["turnOrder"] = [];
    data["turn"]["currentPlayer"] = 0;

    fs.writeFileSync('GameData.json', JSON.stringify(data));
    res.json({ text: "Бой завершен!" });
});

module.exports = router;