const express = require('express');
const router = express.Router();
const fs = require('fs');

/* Получить список шаблонов */
router.get('/', (req, res) => {
    const rawData = fs.readFileSync('./DATA/json/GameData.json');
    const data = JSON.parse(rawData);
    const templateData = [];
    for (var key in data["templates"]) templateData.push(key);
    res.json(templateData);
});

/* Получить шаблон по ключу */
router.get('/:key', (req, res) => {
    const templateKey = req.params.key;
    const rawData = fs.readFileSync('./DATA/json/GameData.json');
    const data = JSON.parse(rawData);
    const templateData = data["templates"][templateKey];
    res.json(templateData);
});

module.exports = router;