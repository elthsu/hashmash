// Include React
var React = require("react");
var moment = require("moment");

// socket connection
import {socket} from "../config/socket.js";

import {Link} from 'react-router';

import {Modal, Button, Icon} from 'react-materialize';

var Chat = require("./Chat");

class Task extends React.Component {
  constructor(props) {
    console.log(props);
    super();

    this.state = {
      editing: false
    };

    this.update = this.update.bind(this);
    this.editMode = this.editMode.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
  }

  componentDidMount() {
    $('.dropdown-button').dropdown();
  }

  componentDidUpdate(prevProps, prevState) {
    // auto focus editable field
    if (prevState.editing !== this.state.editing && this.state.editing !== false) {
      $("#edit-" + this.state.editing).focus();
    }
  }

  //this function is called when the drop-downs are changed
  update(e) {
    let newVal = e.target.getAttribute("value");
    let taskKey = e.target.parentElement.parentElement.getAttribute("data-task");

    socket.emit("update", {
      id: this.props.currentTask.id,
      [taskKey]: newVal
    });
  }

  //this function is called when the user clicks on the "edit" icon beside each key in the task and changes the text to an editable field to update task keys
  editMode(e) {
    this.setState({
      editing: e.target.getAttribute("data-update")
    });
  }

  // on blur, save last edit box to db
  saveChanges(e) {
    socket.emit("update", {
      id: this.props.currentTask.id,
      [this.state.editing]: e.target.value
    });

    this.setState({
      editing: false
    });
  }

  render() {

    // url of project
    var url = `/${this.props.project.replace("/", ">")}`;
    // editable text fields
    var title, description, timeSpent, timeEstimate;

    // toggle 'em up
    if (this.state.editing === "title") {
      title = (<input id="edit-title" defaultValue={this.props.currentTask.title} onBlur={this.saveChanges} type='text' className='validate' />);
    }
    else {
      title = (<span>{this.props.currentTask.title} <i data-update="title" className="tiny material-icons" onClick={this.editMode}>edit</i> </span>);
    }

    if (this.state.editing === "description") {
      description = (<textarea id="edit-description" defaultValue={this.props.currentTask.description} onBlur={this.saveChanges} className='materialize-textarea'></textarea>);
    }
    else {
      description = (<div>{this.props.currentTask.description} <i data-update="description" className="tiny material-icons" onClick={this.editMode}>edit</i></div>);
    }

    if (this.state.editing === "timeSpent") {
      timeSpent = (<input id="edit-timeSpent" defaultValue={this.props.currentTask.timeSpent} onBlur={this.saveChanges} className='materialize-textarea' type="number" />);
    }
    else {
      timeSpent = (<span>{this.props.currentTask.timeSpent} min. <i data-update="timeSpent" className="tiny material-icons" onClick={this.editMode}>edit</i></span>);
    }

    if (this.state.editing === "timeEstimate") {
      timeEstimate = (<input id="edit-timeEstimate" defaultValue={this.props.currentTask.timeEstimate} onBlur={this.saveChanges} className='materialize-textarea' type="number" />);
    }
    else {
      timeEstimate = (<span>{this.props.currentTask.timeEstimate} min. <i data-update="timeEstimate" className="tiny material-icons" onClick={this.editMode}>edit</i></span>);
    }

    // calculate width of time bar
    var calc = (this.props.currentTask.timeSpent/this.props.currentTask.timeEstimate*100);

    var bar = {
      width: calc + "%"
    };

    return (
        <div className="container">
          <div className="row">
          <div className="col s12 pathing">
            <h5> <Link id="projPath" to={url}>{this.props.project}</Link> &gt; {this.props.currentTask.title}</h5>
          </div>
          </div>
          <div className="row">
            <div id="taskWin" className="col l6 z-depth-5">
              <h5 className="taskText">Task ID#: {this.props.currentTask.id}</h5>
              <h5 className="taskText">Title: {title}</h5>
              <h5 className="taskText">
                Developer:
                <a id="developerDrop" className='dropdown-button btn' data-activates='change-developer' data-beloworigin="true"> {this.props.currentTask.owner || "N/A"}</a>

                <ul id='change-developer' data-task="owner" className='dropdown-content'>
                  {this.props.collaborators.map((user, i) => {
                    return (
                      <li key={i}>
                        <a value={user.login} onClick={this.update}>{user.login}</a>
                      </li>
                    );
                  })}
                </ul>
              </h5>
              <h6 className="taskText">Description: <br/> {description}</h6>
              <div className="row taskBtns">
                <div className="col l4"><span>Priority: </span>
                  <a className='dropdown-button btn taskDrop' data-beloworigin="true"  data-activates='updatepriority'>{this.props.currentTask.priority}</a>
                  <ul name='updatepriority' data-task="priority" id='updatepriority' className='dropdown-content collapsible' data-collapsible="accordion">
                    <li><a value="critical" onClick={this.update}>Critical</a></li>
                    <li><a value="normal" onClick={this.update}>Normal</a></li>
                    <li><a value="backburner" onClick={this.update}>Backburner</a></li>
                  </ul>
                </div>
              </div>
                <div className="row taskBtns">
                <div className="col l4">Status:
                  <a className='dropdown-button btn taskDrop' data-beloworigin="true" href='#' data-activates='statusDrop'>{this.props.currentTask.status}</a>
                  <ul id='statusDrop' data-task="status" className='dropdown-content '>
                    <li><a value="to do" onClick={this.update}>To Do</a></li>
                    <li><a value="in progress" onClick={this.update}>In Progress</a></li>
                    <li><a value="blocked" onClick={this.update}>Blocked</a></li>
                    <li><a value="in review" onClick={this.update}>In Review</a></li>
                    <li><a value="done" onClick={this.update}>Done</a></li>
                  </ul>
                </div>
              </div>
                <div className="row taskBtns">
                <div className="col l4">Type:
                  <a className='dropdown-button btn taskDrop' data-beloworigin="true" href='#' data-activates='typeDrop'>{this.props.currentTask.type}</a>
                  <ul id='typeDrop' data-task="type" className='dropdown-content'>
                    <li><a value="feature" onClick={this.update}>Feature</a></li>
                    <li><a value="bug" onClick={this.update}>Bug</a></li>
                    <li><a value="research" onClick={this.update}>Research</a></li>
                  </ul>
                </div>
              </div>
              <div id="timeBox" className="row">
                  <div className="col l6"><h5>Time Used: {timeSpent}</h5></div>
                  <div className="col l6 center"><h5>Time Est: {timeEstimate}</h5></div>
              </div>
              <div className="row">
                <div className="col s12">
                  <div className="progress bar z-depth-1">
                      <div className="determinate" style={bar}>
                        <div className="barText"></div>
                      </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col l12">
                  <h6 className="taskText">Date Created: {moment(this.props.currentTask.dateCreated).format("YYYY-MM-DD hh:mm A")}</h6>
                  <h6 className="taskText">Date Last Updated: {moment(this.props.currentTask.dateModified).format("YYYY-MM-DD hh:mm A")}</h6>
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
