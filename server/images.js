const express = require('express');
const router = express.Router();
const fs = require('fs');

/* Получить текущее изображение */
router.get('/current', (req, res, next) => {
    const rawData = fs.readFileSync('DATA/json/GameData.json');
    var data = JSON.parse(rawData);

    let file = data["turn"]["currentImage"];
    let fileLocation = '/DATA/images/' + file;

    fs.readFile("."+fileLocation, (err, data) => {
        if (err) {
            res.status(500).send("none");
        } else {
            res.sendFile(`${fileLocation}`, { root: '.' });
        }
    })
});

/* Получить любое изображение */
router.get('/get/:file(*)', (req, res) => {
    let file = req.params.file;
    let fileLocation = '/DATA/images/' + file;
    res.sendFile(`${fileLocation}`, { root: '.' });
});

/* Поменять текущее изображение */
router.post('/set/:file(*)', (req, res) => {
    let file = req.params.file;
    const rawData = fs.readFileSync('DATA/json/GameData.json');
    var data = JSON.parse(rawData);

    data["turn"]["currentImage"] = file;

    fs.writeFileSync('DATA/json/GameData.json', JSON.stringify(data));
    res.json({ text: "Изображение изменено!" });
});

/* Получить список всех изображений */
router.get('/list/', (req, res) => {
    const directoryPath = 'DATA/images/';
    const fileList = fs.readdirSync(directoryPath);
    const filteredList = fileList.filter(item => item.split(".png").length > 1);
    res.json(filteredList);
});

module.exports = router;