// Include React
var React = require("react");

// socket connection
var io = require("socket.io-client");
var socket = io('http://localhost:3000');

import {Modal, Button, Icon} from 'react-materialize';

class Nav extends React.Component {

  constructor() {
    super();

    this.state = {
    project: {},
    tasks: []
  };

  this.createTask = this.createTask.bind(this);
}

createTask() {
  console.log("here")
}

render() {
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
          <li>
            <Modal
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
        </div>
      )
    }
}



module.exports = Nav;
