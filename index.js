var express = require("express");
var app = express();
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL,{ useNewUrlParser: true })

const db = mongoose.connection;

app.use(express.json());

const apiRoute = require('./routes/api');
app.use("/api", apiRoute);


app.listen(3000, () => {
    console.log("App listening on port: 3000");
});