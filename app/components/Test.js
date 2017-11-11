var React = require("react");

// socket connection
import {socket} from "../config/socket.js";

class Test extends React.Component {
	constructor() {
		super();

		this.state = {
			initialData: {}
		};

		this._selectProject = this._selectProject.bind(this);
		this._newTask = this._newTask.bind(this);
		this._updateTask = this._updateTask.bind(this);
		this._deleteTask = this._deleteTask.bind(this);
		this._sendChat = this._sendChat.bind(this);
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

		// client receives new list of users for drop-down
		// triggered once when joining/switching projects
		socket.on("contributors", (data) => {
			console.log("contributors", data);
		});
	}

	_selectProject(event) {
		if (event.target.value) {
			// sets user up to start getting updates on this project
			socket.emit("join", event.target.value);
		}
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

	_sendChat() {
		// normally, this would be tied to state, but since we're testing and all...
		var txt = document.getElementById("chat").value;

		// chat message should include id of task
		socket.emit("chat", {
			id: 1,
			user: "elton bo belton",
			message: txt
		});
	}

	render() {
		return (
			<div>
				<p>Initial data: {JSON.stringify(this.state.initialData)}</p>

				Select a project:

				<select style={{display:"block"}} onChange={this._selectProject}>
					<option></option>
					<option value="elthsu/triloGira">elthsu/triloGira</option>
					<option value="clarknielsen/clarknielsen.github.io">clarknielsen/clarknielsen.github.io</option>
				</select>

				<button onClick={this._newTask}>make new task for this project</button>

				<button onClick={this._updateTask}>update task in this project</button>

				<button onClick={this._deleteTask}>delete task in this project</button>

				<p>
					<input type="text" id="chat" />
					<button onClick={this._sendChat}>Send Chat</button>
				</p>
			</div>
		);
	}
}

module.exports = Test;
