// Include React
var React = require("react");

// socket connection
var io = require("socket.io-client");
var socket = io('http://localhost:3000');

import {Modal, Button, Icon} from 'react-materialize';


class Task extends React.Component {
  constructor() {
    super();

    this.state = {
      project: {},
      tasks: [],
      currentTask: {},
      chat: []
    };
  }

  componentDidMount() {
    var taskId = this.props.params.id - 1;
    var currentTask = this.props.tasks[taskId];
    console.log(currentTask);
    this.setState({currentTask: currentTask});
    this.setState({chat: ["hurry up!", "are you almost done?"]});
    // when user connects to server, try to join room based on project name
    socket.on("connect", function(data) {
      socket.emit("join", "test");
    });

    // client receives an update from server
    socket.on("update", (data) => {
      // check type. update could be whole project or task level
      switch (data.type) {
        case "project":
          this.setState({project: data.data, tasks: data.data.tasks});

          break;
      }
    });
  }

  componentWillReceiveProps(props) {
    console.log(props)
  }


  render() {
    console.log(this.state.chat)
    console.log(Modal.actions)

    var calc = (30/180).toFixed(2);

    calc = ((calc * 100) + "%");

    var barTextChecker = parseInt(calc);
    if (barTextChecker > 20) {

    }
    var bar = {
      width: calc
    };



    return (
        <div className="container">
          <div className="row">
          <div className="col s12 pathing">
            <h5>PROJECT NAME > {this.state.currentTask.title}</h5>
          </div>
          </div>
          <div className="row">
            <div id="taskWin" className="col l8 z-depth-5">
              <h5 className="taskText">ID: {this.state.currentTask.id}</h5>
              <h5 className="taskText">{this.state.currentTask.title}</h5>
              <h5 className="taskText">Developer: {this.state.currentTask.owner}</h5>
              <h6 className="taskText">Description:<br />{this.state.currentTask.description}</h6>
              <div className="row center">
                <div className="col s4 taskDrop">
                  <a className='dropdown-button btn z-depth-1' href='#' data-activates='priorityDrop'>{this.state.currentTask.priority}</a>
                  <ul id='priorityDrop' className='dropdown-content'>
                    <li><a href="#!">Critical</a></li>
                    <li><a href="#!">Normal</a></li>
                    <li><a href="#!">Backburner</a></li>
                  </ul>
                </div>
                <div className="col s4 taskDrop">
                  <a className='dropdown-button btn z-depth-1' href='#' data-activates='statusDrop'>{this.state.currentTask.status}</a>
                  <ul id='statusDrop' className='dropdown-content'>
                    <li><a href="#!">To Do</a></li>
                    <li><a href="#!">In Progress</a></li>
                    <li><a href="#!">Blocked</a></li>
                    <li><a href="#!">In Review</a></li>
                    <li><a href="#!">Done</a></li>
                  </ul>
                </div>
                <div className="col s4 taskDrop">
                  <a className='dropdown-button btn z-depth-1' href='#' data-activates='typeDrop'>{this.state.currentTask.type}</a>
                  <ul id='typeDrop' className='dropdown-content'>
                    <li><a href="#!">Feature</a></li>
                    <li><a href="#!">Bug</a></li>
                    <li><a href="#!">Research</a></li>
                  </ul>
                </div>
              </div>
              <div id="timeBox" className="row">
                  <div className="col l6"><h5>Time Used: 02hr 41min</h5></div>
                  <div className="col l6 center"><h5>Time Allocated: {this.state.currentTask.timeEstimate}</h5></div>
              </div>
              <div className="row">
                <div className="col s12">
                  <div className="progress bar z-depth-1">
                      <div className="determinate" style={bar}>
                        <div className="barText">Time Used</div>
                      </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col l12">
                  <h6 className="taskText">Date Created: {this.state.currentTask.dateCreated}</h6>
                  <h6 className="taskText">Date Last Updated: {this.state.currentTask.dateModified}</h6>
                </div>
              </div>
            </div>
            <div className="col l1"></div>
            <div id="chatWin" className="col l3 z-depth-5">
              {this.state.chat.map(function(chat, i) {
                return (
                  <p className="chatMessage">{chat}</p>
                )
              })}
            </div>
          </div>
        </div>

    );
  }
}

// Export the component back for use in other files
module.exports = Task;
