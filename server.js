var express = require("express");
var mongojs = require("mongojs");
var q = require("q");

// mongo db
var db = require("./schema.js");

// initialize web socket & server
var app = express();
var PORT = 3000;
var server = require('http').createServer(app);  
var io = require('socket.io')(server);

io.on("connection", function(socket) {
	// client logged in
	socket.on("login", function(data) {
		var obj = {};

		// return list of projects for this user + task properties from db
		// TODO: make unique per user
		q.fcall(db.projects.find({}, {name: 1}, function(err, docs) {
			obj.projects = docs;
		})).then(db.types.find({}, function(err, docs) {
			obj.types = docs;
		})).then(db.statuses.find({}, function(err, docs) {
			obj.statuses = docs;
		})).then(db.priorities.find({}, function(err, docs) {
			obj.priorities = docs;

			// promise chain complete, send back to FE
			socket.emit("init", obj);
		}));
	});

	// client selected a project to "join"
	socket.on("join", function(data) {
		console.log(`client connected to project "${data}"`);

		socket.room = data;
		socket.join(data);

		// find room/project in db and send back to client
		db.projects.find({name: data}, (err, docs) => {
			if (docs[0] !== undefined) {
				socket.emit("project", docs[0]);
			}
			else {
				// make initial project in db
				var proj = {
					name: data,
					lastTaskId: 0,
					tasks: []
				};

				db.projects.insert(proj);

				socket.emit("project", proj);
			}
		});
	});

	// client sent a task object to server
	socket.on("update", function(data) {
		// if no id, treat as a new task
		if (data.id === undefined) {
			// increment task id counter in db
			db.projects.findAndModify({
				query: {name: socket.room},
				update: {$inc: {lastTaskId: 1}},
				new: true
			}, function(err, docs) {
				// add new task with new id
				db.projects.findAndModify({
					query: {name: socket.room},
					update: {
						$push: {
							"tasks": {
								// set defaults if not defined
								id: docs.lastTaskId,
								title: data.title || "Task",
								owner: data.owner || null,
								description: data.description || "",
								priority: data.priority || "normal",
								status: "open",
								type: data.type || "feature",
								dateCreated: new Date(),
								dateModified: new Date(),
								timeEstimate: data.timeEstimate || 0,
								timeSpent: 0,
								comments: []
							}
						}
					},
					new: true
				}, function(err, docs) {
					// send new project info to every other client in same room
					io.to(socket.room).emit("project", docs);
				});
			});
		}
		else {
			// re-map object to fit into mongo's janky syntax
			var obj = {};

			for (var key in data) {
				obj["tasks.$." + key] = data[key];
			}

			// update timestamp
			obj["tasks.$.dateModified"] = new Date();

			db.projects.findAndModify({
				query: {
					name: socket.room, 
					tasks: {$elemMatch: {id: data.id}}
				},
				update: {$set: obj},
				new: true
			}, function(err, docs) {
				// find the actual task that was updated, 'cause mongo too dumb to do it for me
				var task = docs.tasks.find((t) => {
					return t.id === data.id;
				});

				// send new task to every other client in same room
				io.to(socket.room).emit("task", task);
			});
		}
	});
});

// public files and routes
app.use(express.static("app/public"));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "./app/public/index.html"));
});

// start localhost
server.listen(PORT, function() {
  console.log("App running on port 3000!");
});

// workaround to gracefully shut down on windows
if (process.platform === "win32") {
	var rl = require("readline").createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rl.on("SIGINT", function () {
		process.emit("SIGINT");
	});
}

process.on("SIGINT", function() {
	// make sure port is closed when server is killed
	server.close();
	process.exit();
});