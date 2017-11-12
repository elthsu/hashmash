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
      project: "",
      tasks: [],
      collaborators: [],
      allProjects: [],
      currentTask: {comments:[]}
    };

    this._selectProject = this._selectProject.bind(this);
    this.updateCurrentTask = this.updateCurrentTask.bind(this);
    this._updateTask = this._updateTask.bind(this);
  }

  componentDidMount() {
		// when user connects to server, request initial data
		socket.on("connect", function(data) {
			socket.emit("login", "...");
		});

		// receive initial project list and task properties
		// will use this data to make drop-downs
		socket.once("init", (data) => {

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

    //listen for contributors to populate for each project
    socket.on("collaborators", (data) => {
      this.setState({collaborators: data})

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

  _updateTask(value, taskEdit) {
    console.log(value, taskEdit)
    let id = this.props.params.id
    // won't work until user has entered a "room" (i.e. selected a project)
    // id of task is required
    socket.emit("update", {
      id: id,
      [taskEdit]: value
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
      <Nav _selectProject={this._selectProject}
      allProjects = {this.state.allProjects} collaborators = {this.state.collaborators} project={this.state.project}/>

      {this.props.children && React.cloneElement(this.props.children, {_updateTask: this._updateTask,
      project: this.state.project, tasks: this.state.tasks, _selectTask: this._selectTask, currentTask: this.state.currentTask
})}
  
      <footer className="page-footer">
            <div className="container">
              <div className="row">
                <div className="col l9 s12">
                  <div className="grey-text text-lighten-4">
                    <div className="row">
                      <div className="col s6">
                        <h5 className="white-text">Thank You For Using #mash!</h5>
                        <div className="white-text">
                          We hope you have enjoyed using #mash! If you feel #mash has helped you out and want to support the team, send us over a donation! Any amount would help support and continue development on this project and is greatly appreciated.
                          <p><a className="waves-effect waves-light btn" href="https://paypal.me/HashMash" target="_blank">Donate</a></p>

                        </div>
                      </div>
                      <div className="col s6">
                        <h5 className="white-text">Talk to Us!</h5>
                        <div className="white-text">
                          Talk to us directly about new features, future goals, general problems or questions, or anything else you can think of.
                          <p><a className="waves-effect waves-light btn" href="https://gitter.im/hash-mash/Lobby" target="_blank">Talk to Us!</a></p>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
                <div className="col l3 s12">
                  <h5 className="white-text">Connect</h5>
                  <ul>
                    <li className="footerLi"><a className="grey-text text-lighten-3" href="https://github.com/elthsu/triloGira" target="_blank"><img className="footerGitLogo" src="img/gitLogo.png" />  #mash</a></li>
                    <li className="footerLi"><a className="grey-text text-lighten-3" href="https://github.com/clarknielsen" target="_blank"><img className="gitAvatarImg" src="https://avatars3.githubusercontent.com/u/26048346?s=460&v=4" />  Clark Nielsen</a></li>
                    <li><a className="grey-text text-lighten-3" href="https://github.com/paigepittman" target="_blank"><img className="gitAvatarImg" src="https://avatars1.githubusercontent.com/u/25652409?s=460&v=4" />  Paige Pittman</a></li>
                    <li><a className="grey-text text-lighten-3" href="https://github.com/elthsu" target="_blank"><img className="gitAvatarImg" src="https://avatars3.githubusercontent.com/u/29214773?s=460&v=4" />  Elton Hsu</a></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="footer-copyright">
              <div className="container">
                <div className="white-text">© {new Date().getFullYear()} Copyright #mash</div>
              </div>
            </div>
          </footer>

    </div>
    );
  }
}
// Export the component back for use in other files
module.exports = Main;
