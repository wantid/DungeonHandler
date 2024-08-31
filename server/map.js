const express = require('express');
const router = express.Router();
const fs = require('fs');

/* Получить текущую карту */
router.get('/current', (req, res) => {
    try {
        const rawData = fs.readFileSync('./DATA/json/GameData.json');
        var data = JSON.parse(rawData);

        const mapRawData = fs.readFileSync('./DATA/json/MapData.json');
        var mapData = JSON.parse(mapRawData);

        let _mapData = mapData[data["turn"]["currentMap"]];
        let result = _mapData.content;

        if (_mapData["image"]) {
            data["turn"]["currentImage"] = _mapData["image"];
            fs.writeFileSync('./DATA/json/GameData.json', JSON.stringify(data));
        }

        res.json(result);
    } catch (e) {
        res.status(500).json([]);
    }
});

/* Получить текущее изображение */
router.get('/image', (req, res) => {
    const rawData = fs.readFileSync('./DATA/json/GameData.json');
    var data = JSON.parse(rawData);

    const mapRawData = fs.readFileSync('./DATA/json/MapData.json');
    var mapData = JSON.parse(mapRawData);

    let _mapData = mapData[data["turn"]["currentMap"]];
    let fileLocation = `./DATA/images/${_mapData["src"]}.svg`;

    fs.readFile(fileLocation, (err, data) => {
        if (err) {
            res.status(500).send("none");
        } else {
            res.sendFile(`${fileLocation}`, { root: '.' });
        }
    })
});

/* Изменить текущую карту */
router.post('/set/:id', (req, res) => {
    let id = req.params.id;
    const rawData = fs.readFileSync('./DATA/json/GameData.json');
    var data = JSON.parse(rawData);

    data["turn"]["currentMap"] = id;

    fs.writeFileSync('./DATA/json/GameData.json', JSON.stringify(data));
    res.json({ text: "Карта изменена!" });
});

/* Список карт */
router.get('/list', (req, res) => {
    const rawData = fs.readFileSync('./DATA/json/MapData.json');
    var data = JSON.parse(rawData);

    let dataArray = data.map(item => item.name);

    res.json(dataArray);
});

module.exports = router;