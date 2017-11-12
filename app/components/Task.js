// Include React
var React = require("react");

// socket connection
import {socket} from "../config/socket.js";

import {Modal, Button, Icon} from 'react-materialize';

var Chat = require("./Chat");

class Task extends React.Component {
  constructor(props) {
    console.log(props);
    super();

    this.state = {
      project: {},
      tasks: [],
      currentTask: {},
      chat: []
    };

    this.update = this.update.bind(this);
    this.editMode = this.editMode.bind(this);
  }



componentDidMount() {
  $('.dropdown-button').dropdown();
}


//this function is called when the drop-downs are changed
update(e) {

let newVal = e.target.getAttribute("value");
let taskKey = e.target.parentElement.parentElement.getAttribute("data-task");

let id = this.props.params.id
// won't work until user has entered a "room" (i.e. selected a project)
// id of task is required
socket.emit("update", {
  id: id,
  [taskKey]: newVal
});
}


//this function is called when the user clicks on the "edit" icon beside each key in the task and changes the text to an editable field to update task keys. Still needs to be sent to the backend with the socket.emit("update") and add a trigger to save the change and remove the text field 
editMode(e) {
 let updateKey = e.target.getAttribute("data-update");
 let currentVal = this.props.currentTask[updateKey];

 e.target.parentElement.innerHTML = "<div className='row'><div className='input-field col s6'><input value=" + "'" + currentVal + "'" + "id='first_name2' type='text' className='validate'><label className='active' for='first_name2'>First Name</label></div></div>";
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
            <h5> {this.props.project}>{this.props.currentTask.title}</h5>
          </div>
          </div>
          <div className="row">
            <div id="taskWin" className="col l8 z-depth-5">
              <h5 className="taskText">ID: {this.props.currentTask.id}</h5>
              <h5 className="taskText"><i data-update="title" className="tiny material-icons" onClick={this.editMode}>edit</i>{this.props.currentTask.title}</h5>
              <h5 className="taskText"><i data-update="owner" className="tiny material-icons" onClick={this.editMode}>edit</i>Developer: {this.props.currentTask.owner}</h5>
              <h6 className="taskText">Description:<br /><i data-update="description" className="tiny material-icons" onClick={this.editMode}>edit</i>{this.props.currentTask.description}</h6>
              <div className="row center">
                <div className="col s4 taskDrop">
                  <a className='dropdown-button btn' data-beloworigin="true"  data-activates='updatepriority'>{this.props.currentTask.priority}</a>
                  <ul name='updatepriority' data-task="priority" id='updatepriority' className='dropdown-content collapsible' data-collapsible="accordion">
                    <li><a value="critical" onClick={this.update}>Critical</a></li>
                    <li><a value="normal" onClick={this.update}>Normal</a></li>
                    <li><a value="backburner" onClick={this.update}>Backburner</a></li>
                  </ul>
                </div>
                <div className="col s4 taskDrop">
                  <a className='dropdown-button btn z-depth-1' href='#' data-activates='statusDrop'>{this.props.currentTask.status}</a>
                  <ul id='statusDrop' data-task="status" className='dropdown-content '>
                    <li><a value="to do" onClick={this.update}>To Do</a></li>
                    <li><a value="in progress" onClick={this.update}>In Progress</a></li>
                    <li><a value="blocked" onClick={this.update}>Blocked</a></li>
                    <li><a value="in review" onClick={this.update}>In Review</a></li>
                    <li><a value="done" onClick={this.update}>Done</a></li>
                  </ul>
                </div>
                <div className="col s4 taskDrop">
                  <a className='dropdown-button btn z-depth-1' href='#' data-activates='typeDrop'>{this.props.currentTask.type}</a>
                  <ul id='typeDrop' data-task="type" className='dropdown-content'>
                    <li><a value="feature" onClick={this.update}>Feature</a></li>
                    <li><a value="bug" onClick={this.update}>Bug</a></li>
                    <li><a value="research" onClick={this.update}>Research</a></li>
                  </ul>
                </div>
              </div>
              <div id="timeBox" className="row">
                  <div className="col l6"><h5><i data-update="timeSpent" className="tiny material-icons" onClick={this.editMode}>edit</i>Time Used: 02hr 41min</h5></div>
                  <div className="col l6 center"><h5>Time Allocated: {this.props.currentTask.timeEstimate}</h5></div>
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
                  <h6 className="taskText">Date Created: {this.props.currentTask.dateCreated}</h6>
                  <h6 className="taskText">Date Last Updated: {this.props.currentTask.dateModified}</h6>
                </div>
              </div>
            </div>
            <div className="col l1"></div>
            <Chat taskId={this.props.currentTask.id} comments={this.props.currentTask.comments} />
          </div>
        </div>
    );
  }
}

// Export the component back for use in other files
module.exports = Task;
