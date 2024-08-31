const express = require('express');
const fs = require('fs');

var players = require('./players');
var templates = require('./templates');
var turn = require('./turn');
var info = require('./info');
var images = require('./images');
var map = require('./map');

const PORT = process.env.PORT || 3010;
const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

app.use('/api/players', players);
app.use('/api/templates', templates);
app.use('/api/turn', turn);
app.use('/api/info', info);
app.use('/api/images', images);
app.use('/api/map', map);

app.get('/api/data', (req, res) => {
    const rawData = fs.readFileSync('./DATA/json/GameData.json');
    const data = JSON.parse(rawData);
    res.json(data);
});

app.post('/api/data', (req, res) => {
    const newData = req.body;
    const rawData = fs.readFileSync('./DATA/json/GameData.json');
    var data = JSON.parse(rawData);
    data = newData;
    fs.writeFileSync('./DATA/json/GameData.json', JSON.stringify(data));
    res.json({ message: 'Data saved successfully' });
});