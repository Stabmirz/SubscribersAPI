// first part
// var express = require("express");
// var app = express();
// var jsonData = { count: 12, message: "hey" };

// app.get("/", function(req, res) {
//   res.sendFile(__dirname + "/index.html", function(err) {
//     if (err) {
//       res.status(500).send(err);
//     }
//   });
// });

// app.get("/data", function(req, res) {
//     res.json(jsonData);
// });

// var port = 8080;
// app.listen(port, function() {
//   console.log("listening on port:" + port);
// });
///////////////////////////////

var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var lions = [];
var id = 0;

app.get("/lions", function(req, res) {
    res.json(lions);
});

app.post("/lions", function(req, res) {
    var lion = req.body;
    id++;
    lion.id = id + "";
  
    lions.push(lion);
  
    res.json(lion);
});

var port = 8080;
app.listen(port, function() {
  console.log("listening on port:" + port);
});