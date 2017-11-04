var express = require("express");
var mongojs = require("mongojs");

// mongo db
var db = require("./schema.js");

// initialize web socket & server
var app = express();
var PORT = 3000;
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

io.on("connection", function(socket) {
	// client tried to join a room
	socket.on("join", function(data) {
		console.log(`client connected to "${data}"`);

		if (data) {
			socket.room = data;
			socket.join(data);

			// shake hands
			socket.emit("message", `welcome to room "${data}"`);
		}
	});

	// client sent a message to server
	socket.on("message", function(data) {
		console.log(data);

		// pass change onto every other client in same room
		io.to(socket.room).emit("message", data);
	});
});

app.use(express.static("app/public"));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "./app/public/index.html"));
});

// start localhost
server.listen(PORT, function() {
  console.log("App running on port 3000!");
});