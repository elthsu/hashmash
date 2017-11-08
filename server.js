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

		// leave original room, if in one
		if (socket.room) 
			socket.leave(socket.room);

		socket.room = data;
		socket.join(data);

		// find room/project in db and send tasks back to client
		db.projects.find({name: data}, (err, docs) => {
			if (docs[0] !== undefined) {
				socket.emit("tasks", docs[0].tasks);
			}
			else {
				// make initial project in db
				var proj = {
					name: data,
					lastTaskId: 0,
					tasks: []
				};

				db.projects.insert(proj);
			}
		});
	});

	// client tried to make a new task object
	socket.on("new", function(data) {
		// need to be in a room first, buddy
		if (!socket.room) return;

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
				// send new task list to every other client in same room
				io.to(socket.room).emit("tasks", docs.tasks);
			});
		});
	});

	// client sent update properties for task
	socket.on("update", function(data) {
		// required
		if (!socket.room || !data.id) return;

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
			// if task no longer exists, cancel out
			if (!docs) return;

			// find the actual task that was updated, 'cause mongo too dumb to do it for me
			var task = docs.tasks.find((t) => {
				return t.id === data.id;
			});

			// send new task to every other client in same room
			io.to(socket.room).emit("task #" + data.id, task);

			// also send entire list to separate channel
			io.to(socket.room).emit("tasks", docs.tasks);
		});
	});

	// client sent a delete request
	socket.on("delete", function(data) {
		// required
		if (!socket.room || !data.id) return;

		db.projects.findAndModify({
			query: {name: socket.room},
			update: {$pull: {tasks: {id: data.id}}},
			new: true
		}, function(err, docs) {
			console.log(docs)

			io.to(socket.room).emit("tasks", docs.tasks);

			// broadcast delete flag
			io.to(socket.room).emit("task #" + data.id, null);
		});
	});

	socket.on("chat", function(data) {
		// required
		if (!socket.room || !data.id) return;

		// add comment to nested task object
		db.projects.findAndModify({
			query: {
				name: socket.room, 
				"tasks.id": data.id
			},
			update: {
				$push: {
					"tasks.$.comments": {
						user: data.user,
						message: data.message,
						dateCreated: new Date()
					}
				}
			},
			new: true
		}, function(err, docs) {
			console.log(docs);
			// find the actual task that was updated, 'cause mongo too dumb to do it for me
			var task = docs.tasks.find((t) => {
				return t.id === data.id;
			});

			// send new task to every other client in same room
			io.to(socket.room).emit("task #" + data.id, task);
		});
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