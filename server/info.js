const express = require('express');
const router = express.Router();
const fs = require('fs');

/* Чтение массива правил */
router.get('/rules', (req, res) => {
    const rawData = fs.readFileSync('DATA/json/InfoData.json');
    const data = JSON.parse(rawData);
    const resData = data["rules"];
    res.json(resData);
});

/* Чтение массива истории */
router.get('/story', (req, res) => {
    const rawData = fs.readFileSync('DATA/json/InfoData.json');
    const data = JSON.parse(rawData);
    const resData = data["story"];
    res.json(resData);
});

module.exports = router;