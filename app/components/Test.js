var React = require("react");

// socket connection
var io = require("socket.io-client");
var socket = io('http://localhost:3000');

class Test extends React.Component {
	constructor() {
		super();

		this.state = {
			initialData: {}
		};

		this._getInfo = this._getInfo.bind(this);
		this._newTask = this._newTask.bind(this);
		this._updateTask = this._updateTask.bind(this);
		this._deleteTask = this._deleteTask.bind(this);
	}

	componentDidMount() {
		// when user connects to server, request initial data
		socket.on("connect", function(data) {
			socket.emit("login", "...");
		});

		// receive initial project list and task properties
		// will use this data to make drop-downs
		socket.once("init", (data) => {
			console.log(data);

			this.setState({
				initialData: data
			});
		});

		// client receives whole tasks array
		// triggered when user "joins" a project or tasks have been updated
		socket.on("tasks", (data) => {
			console.log("all tasks", data);
		});

		// client receives update related to a single task
		// triggered when individual task properties were updated
		socket.on("task #1", (data) => {
			// if data is null, we know it was deleted
			console.log("task #1", data);
		});
	}

	_getInfo() {
		// sets user up to start getting updates on this project
		socket.emit("join", "test1");
	}

	_newTask() {
		// won't work until user has joined a "room" (i.e. selected a project)
		socket.emit("new", {
			title: "New Task",
			priority: "critical",

		});
	}

	_updateTask() {
		// won't work until user has entered a "room" (i.e. selected a project)
		// id of task is required
		socket.emit("update", {
			id: 1,
			title: "New Name",
			description: "New description"
		});
	}

	_deleteTask() {
		// won't work until user has entered a "room" (i.e. selected a project)
		// id of task is required
		socket.emit("delete", {id: 1});
	}

	render() {
		return (
			<div>				
				<p>Initial data: {JSON.stringify(this.state.initialData)}</p>

				<p>Test buttons</p>

				<button onClick={this._getInfo}>join "test1" project channel</button>

				<button onClick={this._newTask}>make new task for "test1"</button>

				<button onClick={this._updateTask}>update task in "tes1"</button>

				<button onClick={this._deleteTask}>deletes task in "tes1"</button>
			</div>
		);
	}
}

module.exports = Test;