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
      tasks: []
    };
    this.createTask = this.createTask.bind(this);
  }

  componentDidMount() {
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

  createTask() {
    console.log("here")
  }

  render() {
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
      <div>
        <nav>
          <div className="nav-wrapper pad">
            <a href="#!" className="brand-logo logo">triloGira</a>
            <a href="#" data-activates="mobile-demo" className="button-collapse">
              <i className="material-icons">menu</i>
            </a>
            <ul className="right hide-on-med-and-down">
              <li>

                <a className='dropdown-button btn' data-beloworigin="true" href='#' data-activates='projectDrop'>Projects</a>
                <ul id='projectDrop' className='dropdown-content collapsible' data-collapsible="accordion">
                  <li>
                    <a href="#!">{this.state.project.name}</a>
                  </li>
                </ul>
              </li>
              <li><Modal
                header='New Task'
                trigger={<Button waves='light'>New Task</Button>} actions={<Button className="btn waves-effect waves-light btn-flat modal-action modal-close" waves='light' id="add-task" onClick={this.createTask}> add task</Button>}>
                <div className="row">
                  <form className="col s12">
                    <div className="row">
                      <div className="input-field col s4">
                        <input placeholder="" id="new-title" type="text" className="validate"/>
                        <label htmlFor="new-title">Title</label>
                      </div>
                      <div className="input-field col s8">
                        <input placeholder="" id="new-description" type="text" className="validate"/>
                        <label htmlFor="new-description">Description</label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col s3">
                        <span>Priority: </span>

                          <br />
                          <input name="new-priority" type="radio" id="critical" />
                          <label htmlFor="critical">critical</label>
                          <br />
                          <input name="new-priority" type="radio" id="normal" />
                          <label htmlFor="normal">normal</label>
                          <br />

                          <input name="new-priority" type="radio" id="backburner" />
                          <label htmlFor="backburner">backburner</label>

                        </div>

                          <div className="col s3">
                            <span>Status: </span>
                            <br />



                              <input name="new-priority" type="radio" id="to do" />
                              <label htmlFor="to do">to do</label>
                              <br />

                              <input name="new-priority" type="radio" id="in progress" />
                              <label htmlFor="in progress">in progress</label>

                              <br />

                              <input name="new-priority" type="radio" id="blocked" />
                              <label htmlFor="blocked">blocked</label>
                              <br />

                              <input name="new-priority" type="radio" id="in review" />
                              <label htmlFor="in review">in review</label>
                              <br />

                              <input name="new-priority" type="radio" id="done" />
                              <label htmlFor="done">done</label>

                            </div>


                          <div className="col s3">
                            <span>Type: </span>

                            <br />


                              <input name="new-type" type="radio" id="feature" />
                              <label htmlFor="feature">feature</label>
                              <br />

                              <input name="new-type" type="radio" id="bug" />
                              <label htmlFor="bug">bug</label>
                              <br />

                              <input name="new-type" type="radio" id="research" />
                              <label htmlFor="research">research</label>

                              <br />

                            </div>



                              <div className="input-field col s2">
                                <input placeholder="" id="new-estimate" type="number" className="validate"/>
                                <label htmlFor="new-number">time est. (min)</label>
                              </div>

                              </div>
                      </form>
                  </div>
              </Modal>
              </li>
            </ul>
          </div>
        </nav>
        <div className="container">
          <div className="row">
          <div className="col s12 pathing">
            <h5>PROJECT NAME > TASK NAME</h5>
          </div>
          </div>
          <div className="row">
            <div id="taskWin" className="col l8 z-depth-5">
              <h5 className="taskText">ID: #1</h5>
              <h5 className="taskText">FINISH EVERYTHING</h5>
              <h5 className="taskText">Developer: Paige Pittman</h5>
              <h6 className="taskText">Description:<br />Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Donec sollicitudin molestie malesuada. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Sed porttitor lectus nibh. Pellentesque in ipsum id orci porta dapibus. Sed porttitor lectus nibh. Cras ultricies ligula sed magna dictum porta. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Cras ultricies ligula sed magna dictum porta. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</h6>
              <div className="row center">
                <div className="col s4 taskDrop">
                  <a className='dropdown-button btn z-depth-1' href='#' data-activates='priorityDrop'>Priority</a>
                  <ul id='priorityDrop' className='dropdown-content'>
                    <li><a href="#!">Critical</a></li>
                    <li><a href="#!">Normal</a></li>
                    <li><a href="#!">Backburner</a></li>
                  </ul>
                </div>
                <div className="col s4 taskDrop">
                  <a className='dropdown-button btn z-depth-1' href='#' data-activates='statusDrop'>Status</a>
                  <ul id='statusDrop' className='dropdown-content'>
                    <li><a href="#!">To Do</a></li>
                    <li><a href="#!">In Progress</a></li>
                    <li><a href="#!">Blocked</a></li>
                    <li><a href="#!">In Review</a></li>
                    <li><a href="#!">Done</a></li>
                  </ul>
                </div>
                <div className="col s4 taskDrop">
                  <a className='dropdown-button btn z-depth-1' href='#' data-activates='typeDrop'>Type</a>
                  <ul id='typeDrop' className='dropdown-content'>
                    <li><a href="#!">Feature</a></li>
                    <li><a href="#!">Bug</a></li>
                    <li><a href="#!">Research</a></li>
                  </ul>
                </div>
              </div>
              <div id="timeBox" className="row">
                  <div className="col l6"><h5>Time Used: 02hr 41min</h5></div>
                  <div className="col l6 center"><h5>Time Allocated: 03hr 00min</h5></div>
              </div>
              <div className="row">
                <div className="col l12">
                  <div className="progress bar z-depth-1">
                      <div className="determinate" style={bar}>
                        <div className="barText">Time Used</div>
                      </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col l12">
                  <h6 className="taskText">Date Created: 2017-11-06 08:00:00</h6>
                  <h6 className="taskText">Date Last Updated: 2017-11-06 10:00:00</h6>
                </div>
              </div>
            </div>
            <div className="col l1"></div>
            <div id="chatWin" className="col l3 z-depth-5">
              <p className="chatMessage">Paige, why aren't you done with this yet?</p>
              <p className="chatMessage">We don't have all day!!!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Export the component back for use in other files
module.exports = Task;
