var express = require("express");
var path = require("path");

// Initialize Express
var app = express();

app.use(express.static("app/public"));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "./app/public/index.html"));
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
