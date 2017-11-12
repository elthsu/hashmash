var express = require("express");
var cookieParser = require('cookie-parser');
var mongojs = require("mongojs");
var path = require("path");
var axios = require("axios");

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
		// who's got the cookie
		var cookie = decodeURIComponent(socket.request.headers.cookie.match(/github=(.*bearer)/)[1]);

		// get repo names from github
		axios.get("https://api.github.com/user/repos?" + cookie).then(function(data) {
			var repos = data.data;
			var obj = {
				projects: []
			};

			for (let i = 0; i < repos.length; i++) {
				obj.projects.push({
					name: repos[i].full_name
				});
			}

			// consolidate db queries into promise chain
			function promiseMe(type) {
				return new Promise(function(resolve, reject) {
					db[type].find({}, function(err, docs) {
						obj[type] = docs;
						resolve(true);
					});
				});
			}

			promiseMe("types").then(promiseMe("statuses").then(promiseMe("priorities").then(function() {
				// promise chain complete, send back to FE
				socket.emit("init", obj);
			})));
		}).catch(function(error) {
			console.log("login error");
		});
	});

	// client selected a project to "join"
	socket.on("join", function(data) {
		// who's got the cookie
		var cookie = decodeURIComponent(socket.request.headers.cookie.match(/github=(.*bearer)/)[1]);

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

		// also get list of contributors for drop-down
		axios.get(`https://api.github.com/repos/${socket.room}/collaborators?${cookie}`).then(function(data) {
			// send user list back to FE
			socket.emit("collaborators", data.data);
		}).catch(function(error) {
			console.log("failed to get collaborators");
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
							status: data.status || "open",
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
				// send new list to every other client in same room
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
			if (key !== "id")
				obj["tasks.$." + key] = data[key];
		}

		// update timestamp
		obj["tasks.$.dateModified"] = new Date();

		db.projects.findAndModify({
			query: {
				name: socket.room,
				tasks: {$elemMatch: {id: parseInt(data.id)}}
			},
			update: {$set: obj},
			new: true
		}, function(err, docs) {
			// if task no longer exists, cancel out
			if (!docs) return;

			// send new list to every other client in same room
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
			// send new list to every other client in same room
			io.to(socket.room).emit("tasks", docs.tasks);
		});
	});

	socket.on("chat", function(data) {
		// required
		if (!socket.room || !data.id) return;

		var name = "";

		// check for cookie
		if (socket.request.headers.cookie.indexOf("username=") > 0)
			name = socket.request.headers.cookie.match(/username=([^;]*)/)[1];

		// add comment to nested task object
		db.projects.findAndModify({
			query: {
				name: socket.room,
				"tasks.id": data.id
			},
			update: {
				$push: {
					"tasks.$.comments": {
						name: name,
						message: data.message,
						dateCreated: new Date()
					}
				}
			},
			new: true
		}, function(err, docs) {
			// send new list to every other client in same room
			io.to(socket.room).emit("tasks", docs.tasks);
		});
	});

	// clean up
	socket.once("disconnect", function(data) {
		if (socket.room)
			socket.leave(socket.room);

		socket.removeAllListeners();
	});
});

app.use(cookieParser());

app.get("/", function(req, res) {
	// redirected from github
	if (req.query && req.query.code) {
		axios.post("https://github.com/login/oauth/access_token", {
			code: req.query.code,
			client_id: "5e9ec4eec65e92a74459",
			client_secret: "fb7522788ea96b738012350f52c8d7259dead5ef"
		}).then(function(data) {
			// save for later
			res.cookie("github", data.data);

			res.redirect("/");
		});
	}
	// already authenticated
	else if (req.cookies && req.cookies.github) {
		// use existing token to verify login
		axios.get("https://api.github.com/user?" + req.cookies.github).then(function(data) {
			// save user's name
			res.cookie("username", data.data.login);

			res.sendFile(path.join(__dirname, "./app/public/index.html"));
		}).catch(function(error) {
			// auth failed, so get rid of cookie
			res.clearCookie("github");
			res.clearCookie("username");

			res.sendFile(path.join(__dirname, "./app/public/gitAuth.html"));
		});
	}
	else {
		// sploosh page
		res.sendFile(path.join(__dirname, "./app/public/gitAuth.html"));
	}
});

app.get("/logout", function(req, res) {
	// wipe cookies and redirect to login page
	res.clearCookie("github");
	res.clearCookie("username");

	res.redirect("/");
});

// public assets
app.use(express.static("app/public"));

// all other URLs should go to main page
app.get("*", function(req, res) {
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
