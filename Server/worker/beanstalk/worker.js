const express = require("express");
const bodyParser = require('body-parser');
const config = require('../../config/config');
const path = require("path");

const app = express();

app.use(bodyParser.json());

app.set("views", path.join(__dirname, "..", "..", "views"));
app.set("view engine", "jade");

app.get('/', (req, res) => {
    res.render('index', {
        title: 'TechNoob Worker',
        environment: config.NODE_ENV,
        repo_link: "https://github.com/TechNoobNG/Technoob-Homebase",
    });
});

app.post('/work', (req, res) => {
    const payload = req.body;
    console.log('Received payload:', payload);
    res.status(200).send('Payload received successfully.');
});

module.exports = app;
