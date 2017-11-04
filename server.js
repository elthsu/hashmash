var express = require("express");
var path = require("path");
var mongojs = require("mongojs");

var db = require("./schema.js");

// Initialize Express
var app = express();
var PORT = 3000;

app.use(express.static("app/public"));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "./app/public/index.html"));
});

// Listen on port 3000
app.listen(PORT, function() {
  console.log("App running on port 3000!");
});