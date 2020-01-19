let express = require('express');
let app = express();
let mongo = require("mongodb").MongoClient;
let config = require("./config.json")


let port = config.port;

let mongodb = require("mongodb");
// let cors = require('cors');

// app.use(cors());
app.listen(port);

console.log("serverhandmovements is running");

mongo.connect("mongodb://127.0.0.1:27017", { useNewUrlParser: true }, function (err, client) {
// mongoClient.connect("mongodb://127.0.0.1:27017",{ useNewUrlParser: true }, function(err,client){

    if (err) {
        console.log("error database");
        return;
    }

    let db = client.db(config.databaseName);
    let collection = db.collection("handMovements");


    app.get("/getStartingParams", function (req, res) {
        let startParams = {
            port: config.port
        };
        res.status(200).json(startParams);
    });

    app.get("/start/", function (req, res) {
        let hand_movements = require('./hand_movements.js');
        hand_movements.f();
    });

    //ROUTINGS



    //front-end make sliders availability for client , room , arrival, departure, their name

});// all your APIs must be before the closing of this bracket which connects to mongo database