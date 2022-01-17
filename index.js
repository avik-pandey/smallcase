const bodyParser = require('body-parser');
const express = require('express');
require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const {DEFAULT_PORT,MONGO_URI} = require('./config');

const tradeRouter = require("./routes/tradeRouter");
const securityRouter = require("./routes/securityRouter");
const portfolioRouter = require("./routes/portfolioRouter");

//connecting the application to the mongoDB

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: 3000,
    keepAlive: true 
}).then(
    () => {
        console.log("MongoDB connected");
    },
    (err) => {
        console.log(err);
    }
);

const app = express();

//middlewares
app.use(bodyParser.json());

//displays home.html on hitting the base API
app.get('/',(req,res) => {
    res.sendFile(
        path.join(__dirname + "/home.html")
    );
});

app.use("/api/trade", tradeRouter);
app.use("/api/security", securityRouter);
app.use("/api/portfolio", portfolioRouter);

//defining the port
let PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random*1000);

const PORT = DEFAULT_PORT || PEER_PORT;

//app starts listening at the defined port
app.listen(PORT, () => {
    console.log(`Listening at localhost : ${PORT}`);
});

console.log("Starting....");
