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
	}

	componentDidMount() {
		// when user connects to server, request initial data
		socket.on("connect", function(data) {
			socket.emit("login", "...");
		});

		// receive initial project list and task properties
		socket.once("init", (data) => {
			console.log(data);

			this.setState({
				initialData: data
			});
		});

		// client receives whole project object
		socket.on("project", (data) => {
			console.log("project", data);
		});

		// client receives update related to a single task
		socket.on("task", (data) => {
			console.log("task", data);
		});
	}

	_getInfo() {
		// sets user up to start getting updates on this project
		socket.emit("join", "test1");
	}

	_newTask() {
		// won't work until user has entered a "room" (i.e. selected a project)
		// if you don't send an id, this becomes a new task
		socket.emit("update", {
			title: "New Task",
			priority: "critical",

		});
	}

	_updateTask() {
		// won't work until user has entered a "room" (i.e. selected a project)
		socket.emit("update", {
			id: 1,
			title: "New Name",
			description: "New description"
		});
	}

	render() {
		return (
			<div>				
				<p>Initial data: {JSON.stringify(this.state.initialData)}</p>

				<p>Test buttons</p>

				<button onClick={this._getInfo}>get "test1" info</button>

				<button onClick={this._newTask}>make new test for "test1"</button>

				<button onClick={this._updateTask}>update task in "tes1"</button>
			</div>
		);
	}
}

module.exports = Test;