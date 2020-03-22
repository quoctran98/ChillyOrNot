const express = require("express");
const app = express();

const request = require('request');
const path = require('path');
const fs = require("fs"); // This is a Node.js module, not an NPM package

let config = JSON.parse(fs.readFileSync("server_config.json"));
console.log("ChillyOrNot server started with config: ");
console.log(config);

const port = process.env.PORT || 3000

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + '/pages/index.html'));
})

app.get("/chillyCheck", function (req, res) {
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    let url = "https://api.darksky.net/forecast/" + config.darkskyAPI + "/" + latitude + "," + longitude + "?exclude=minutely,hourly,daily,alerts,flags";
    request(url, (err, res1, body) => {
        if (err) { return console.log(err); }
        let darkskyJSON = JSON.parse(body);
        if (darkskyJSON.currently.apparentTemperature < 70) {
            res.send("chilly");
        } else {
            res.send("not chilly");
        }
    });
});

app.listen(port);
