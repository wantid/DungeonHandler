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

        if (_mapData["image"] && data["turn"]["currentImage"]) {
            data["turn"]["currentImage"] = _mapData["image"];
            fs.writeFileSync('./DATA/json/GameData.json', JSON.stringify(data));
        }

        res.json(result);
    } catch (e) {
        res.status(500).json("");
    }
});

/* Получить текущее изображение */
router.get('/image', (req, res) => {
    try {
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
    } catch (e) {
        res.status(500).json("");
    }
});

/* Получить изображение по id */
router.get('/image_id/:id', (req, res) => {
    let id = req.params.id;

    try {
        const mapRawData = fs.readFileSync('./DATA/json/MapData.json');
        var mapData = JSON.parse(mapRawData);

        let _mapData = mapData[id];
        let fileLocation = `./DATA/images/${_mapData["src"]}.svg`;

        fs.readFile(fileLocation, (err, data) => {
            if (err) {
                res.status(500).send("none");
            } else {
                res.sendFile(`${fileLocation}`, { root: '.' });
            }
        })
    } catch (e) {
        res.status(500).json([]);
    }
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

/* Получить карту по id */
router.get('/get/:id', (req, res) => {
    let id = req.params.id;

    try {
        const mapRawData = fs.readFileSync('./DATA/json/MapData.json');
        var mapData = JSON.parse(mapRawData);

        let _mapData = mapData[id];
        let result = _mapData.content;

        res.json(result);
    } catch (e) {
        res.status(500).json([]);
    }
});

/* Получить свойства карты по id */
router.get('/get_properties/:id', (req, res) => {
    let id = req.params.id;

    try {
        const mapRawData = fs.readFileSync('./DATA/json/MapData.json');
        var mapData = JSON.parse(mapRawData);

        let result = {};
        for (var key in mapData[id]) {
            if (key == "content") continue;
            result[key] = mapData[id][key];
        }

        res.json(result);
    } catch (e) {
        res.status(500).json([]);
    }
});

/* Изменить свойства карты по id */
router.post('/update_properties/:id', (req, res) => {
    let id = req.params.id;
    const newData = req.body;

    try {
        const mapRawData = fs.readFileSync('./DATA/json/MapData.json');
        var mapData = JSON.parse(mapRawData);

        for (var key in newData) {
            if (key == "content") continue;
            mapData[id][key] = newData[key];
        }

        fs.writeFileSync('./DATA/json/MapData.json', JSON.stringify(mapData));

        res.json({ text: "Карта изменена!" });
    } catch (e) {
        res.status(500).json([]);
    }
});

/* Обновить карту по id */
router.post('/update/:id', (req, res) => {
    let id = req.params.id;
    const newData = req.body;

    try {
        const mapRawData = fs.readFileSync('./DATA/json/MapData.json');
        var mapData = JSON.parse(mapRawData);

        mapData[id].content = newData;

        fs.writeFileSync('./DATA/json/MapData.json', JSON.stringify(mapData));

        res.json({ text: "Карта изменена!" });
    } catch (e) {
        res.status(500).json([]);
    }
});

/* Обновить атрибут контента карты по id */
router.post('/update/:key/:id', (req, res) => {
    let id = req.params.id;
    let key = req.params.key;
    const newData = req.body;

    try {
        const mapRawData = fs.readFileSync('./DATA/json/MapData.json');
        var mapData = JSON.parse(mapRawData);

        mapData[id]["content"][key] = newData;

        fs.writeFileSync('./DATA/json/MapData.json', JSON.stringify(mapData));

        res.json({ text: "Карта изменена!" });
    } catch (e) {
        res.status(500).json([]);
    }
});

/* Создать карту */
router.post('/create/', (req, res) => {
    const newData = req.body;

    try {
        const mapRawData = fs.readFileSync('./DATA/json/MapData.json');
        var mapData = JSON.parse(mapRawData);

        mapData.push(newData);
        mapData[mapData.length - 1].content = [];

        fs.writeFileSync('./DATA/json/MapData.json', JSON.stringify(mapData));

        res.json({ text: "Карта создана!" });
    } catch (e) {
        res.status(500).json([]);
    }
});

/* Удалить карту по id */
router.delete('/remove/:id', (req, res) => {
    let id = req.params.id;

    try {
        const mapRawData = fs.readFileSync('./DATA/json/MapData.json');
        var mapData = JSON.parse(mapRawData);

        mapData.splice(id, 1);

        fs.writeFileSync('./DATA/json/MapData.json', JSON.stringify(mapData));

        res.json({ text: "Карта удалена!" });
    } catch (e) {
        res.status(500).json([]);
    }
});

module.exports = router;