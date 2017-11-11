// Include React
var React = require("react");

// socket connection
import {socket} from "../config/socket.js";

// components
var Nav = require("./Nav");
var Sort = require("./Sort");
var Task = require("./Task");

class Main extends React.Component {
  constructor() {
    super();

    this.state = {
      project: {},
      tasks: [],
      allProjects: [],
      currentTask: {comments:[]}
    };

    this._selectProject = this._selectProject.bind(this);
    this.updateCurrentTask = this.updateCurrentTask.bind(this);
  }

  componentDidMount() {
		// when user connects to server, request initial data
		socket.on("connect", function(data) {
			socket.emit("login", "...");
		});

		// receive initial project list and task properties
		// will use this data to make drop-downs
		socket.once("init", (data) => {
			console.log(data.projects);

			this.setState({
				initialData: data,
        allProjects: data.projects
			});

		});

		// client receives whole tasks array
		// triggered when user "joins" a project or tasks have been updated
		socket.on("tasks", (data) => {
      this.setState({tasks: data})
      this.updateCurrentTask(this.props);
		});
	}

  componentWillReceiveProps(props) {
    this.updateCurrentTask(props);
  }

  updateCurrentTask(props) {
    if (props.params.id) {
      var id = props.params.id;
      var tasks = this.state.tasks;

      // find matching task in list
      for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id.toString() === id) {
          this.setState({currentTask: tasks[i]});
          break;
        }
      }
    }
  }

  _selectProject(event) {
    if (event) {
      // sets user up to start getting updates on this project
      socket.emit("join", event);
      this.setState({project: event});
    }
  }

  _updateTask() {
    // won't work until user has entered a "room" (i.e. selected a project)
    // id of task is required
    socket.emit("update", {
      id: 2,
      title: "Task 2 updated",
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
    console.log("props.id", this.state.currentTask);
    return (
      <div>
      <Nav _selectProject={this._selectProject}
      allProjects = {this.state.allProjects}/>

      {this.props.children && React.cloneElement(this.props.children, {
      tasks: this.state.tasks, _selectTask: this._selectTask, currentTask: this.state.currentTask
})}
    </div>
    );
  }
}
// Export the component back for use in other files
module.exports = Main;
