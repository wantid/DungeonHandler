const express = require('express');
const router = express.Router();
const fs = require('fs');

/* Чтение игрока по id */
router.get('/id=:id', (req, res) => {
    const playerId = parseInt(req.params.id);
    const rawData = fs.readFileSync('DATA/json/GameData.json');
    const data = JSON.parse(rawData);
    const playerData = data["players"][playerId];
    res.json(playerData ? playerData : []);
});

/* Запись игрока по id */
router.post('/id=:id', (req, res) => {
    const playerId = parseInt(req.params.id);
    const newData = req.body;
    const rawData = fs.readFileSync('DATA/json/GameData.json');
    var data = JSON.parse(rawData);
    data["players"][playerId] = newData;
    fs.writeFileSync('DATA/json/GameData.json', JSON.stringify(data));
    res.json({ message: 'Data saved successfully' });
});

/* Удаление игрока по id */
router.post('/remove/id=:id', (req, res) => {
    const playerId = parseInt(req.params.id);
    const rawData = fs.readFileSync('DATA/json/GameData.json');
    var data = JSON.parse(rawData);
    data["players"].splice(playerId, 1);
    fs.writeFileSync('DATA/json/GameData.json', JSON.stringify(data));
    res.json({ message: 'Data saved successfully' });
});


/* Чтение массива игроков */
router.get('/', (req, res) => {
    const rawData = fs.readFileSync('DATA/json/GameData.json');
    const data = JSON.parse(rawData);
    const playerData = data["players"];
    res.json(playerData);
});

/* Очистка массива игроков */
router.get('/reset', (req, res) => {
    const rawData = fs.readFileSync('DATA/json/GameData.json');
    var data = JSON.parse(rawData);

    data["players"] = [];
    fs.writeFileSync('DATA/json/GameData.json', JSON.stringify(data));
    res.json({ message: 'Data reset successfully' });
});

/* Создание нового игрока */
router.post('/create/', (req, res) => {
    const rawData = fs.readFileSync('DATA/json/GameData.json');
    const newData = req.body;
    var data = JSON.parse(rawData);

    data["players"].push(newData);
    fs.writeFileSync('DATA/json/GameData.json', JSON.stringify(data));
    res.json({ message: 'Data saved successfully' });
});

module.exports = router;