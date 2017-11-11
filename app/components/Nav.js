// Include React
var React = require("react");

// socket connection
import {socket} from "../config/socket.js";

import {Modal, Button, Icon} from 'react-materialize';

import {Link} from "react-router";


class Nav extends React.Component {

  constructor() {
    super();

    this.state = {
      project: {},
      allProjects: [],
      collaborators: [],
      tasks: [],
      newTask: {},
      newTitle: "",
      newPriority: "",
      newDescription: "",
      newStatus: "",
      newType: "",
      newEstimate: "",
      newDeveloper: "",
      developerBtn: "Developer"
    };

    this.createTask = this.createTask.bind(this);
    this.chooseProject = this.chooseProject.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.resetModal = this.resetModal.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({allProjects: props.allProjects});
    this.setState({collaborators: props.collaborators});
  }

  componentDidUpdate(prevProps, prevState) {
  }

  createTask(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }



  handleSubmit() {
    socket.emit("new",
      {
        title: this.state.newTitle,
        description: this.state.newDescription,
        owner: this.state.developerBtn,
        priority: this.state.newPriority,
        status: this.state.newStatus,
        type: this.state.newType,
        timeEstimate: this.state.newEstimate
      }
    );
    document.getElementById("modalForm").reset();
    this.setState({
      developerBtn: "Developer"
    });
  }

  resetModal() {
    document.getElementById("modalForm").reset();
    this.setState({
      developerBtn: "Developer"
    });
  }

  chooseProject(event) {
    var project = event.target.getAttribute("value");
    this.props._selectProject(project);
  }

  chooseDeveloper(event) {
    var developer = event.target.getAttribute("value");
    console.log(developer);
    this.setState({
      developerBtn: developer
    });
  }




  render() {
    return (
      <div>
        <nav>
          <div className="nav-wrapper pad">
            <a href="/" className="brand-logo logo">#mash</a>
            <a href="#" data-activates="mobile-demo" className="button-collapse">
              <i className="material-icons">menu</i>
            </a>
            <ul className="right hide-on-med-and-down">
              <li>
                <a className='dropdown-button btn' data-beloworigin="true" href='#' data-activates='projectDrop'>Projects</a>
                <ul id='projectDrop' className='dropdown-content collapsible' data-collapsible="accordion" onClick={this.resetModal}>
                  {this.state.allProjects.map((project, i) => {
                    return (
                      <li key={i}>
                    <Link to="/sort" value={project.name} onClick={(event)=>this.chooseProject(event)} href="#!">{project.name}</Link>
                      </li>
                    )
                  })
                  }
                </ul>
              </li>
              <li>
                <Modal header='New Task' trigger={< a waves = 'light' > New Task < /a>} actions={< Button className = "btn waves-effect waves-light btn-flat modal-action modal-close z-depth-2" waves = 'light' id = "add-task" onClick = {
                  this.handleSubmit
                } > add task < /Button>}>

                  <div className="row">
                    <form id="modalForm" onSubmit={this.createTask} className="col s12">
                      <div className="row">
                        <div className="input-field col s6">
                          <input name="newTitle" placeholder="" id="new-title" type="text" className="validate"/>
                          <label htmlFor="new-title">Title</label>
                        </div>


                        <div className="input-field col s2">
                          <input placeholder="" name="newEstimate" id="new-estimate" type="number" className="validate"/>
                          <label htmlFor="new-number">Time Est. (Min)</label>
                        </div>

                        <div className="input-field col s2 offset-s1">
                          {/* <input name="newDeveloper" placeholder="" id="new-developer" type="text" className="validate"/>
                          <label htmlFor="new-developer">Developer</label> */}

                          <span>Developer: </span>
                          {/* <!-- Dropdown Trigger --> */}
                          <a id="devBtn" className='dropdown-button btn' href='#' data-activates='new-developer'>{this.state.developerBtn}</a>

                          {/* <!-- Dropdown Structure --> */}
                          <ul name="newDeveloper" id='new-developer' className='dropdown-content'>
                            {this.state.collaborators.map((collaborators, i) => {
                              return (
                                <li key={i}>
                                  <a id='new-developer' value={collaborators.login} onClick={(event) => this.chooseDeveloper(event)} href="#!">{collaborators.login}</a>
                                </li>
                              )
                            })
                            }
                            {/* <li><a href="#!" onClick={(event)=>this.chooseDeveloper(event)} value="clark" name="newDeveloper">Clark</a></li>
                            <li><a href="#!" onClick={(event)=>this.chooseDeveloper(event)} value="paige" name="newDeveloper">Paige</a></li>
                            <li><a href="#!" onClick={(event)=>this.chooseDeveloper(event)} value="elton" name="newDeveloper">Elton</a></li>
                            <li><a href="#!" onClick={(event)=>this.chooseDeveloper(event)} value="potato" name="newDeveloper">Potato</a></li> */}
                          </ul>


                        </div>
                      </div>
                      <div className="row">
                        <div className="input-field col s11">

                          <textarea name="newDescription" placeholder="" id="new-description" className="materialize-textarea validate"></textarea>
                          <label htmlFor="new-description">Description</label>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col s4" id="newTaskRadio1">
                          <span>Priority:
                          </span>

                          <br/>
                          <input value="critical" name="newPriority" type="radio" id="critical"/>

                          <label htmlFor="critical">Critical</label>
                          <br/>
                          <input value="normal" name="newPriority" type="radio" id="normal"/>
                          <label htmlFor="normal">Normal</label>
                          <br/>

                          <input value="backburner" name="newPriority" type="radio" id="backburner"/>
                          <label htmlFor="backburner">Backburner</label>

                        </div>

                        <div className="col s4" id="newTaskRadio2">
                          <span>Status:
                          </span>
                          <br/>

                          <input value="to do" name="newStatus" type="radio" id="to do"/>

                          <label htmlFor="to do">To Do</label>
                          <br/>

                          <input value="in progress" name="newStatus" type="radio" id="in progress"/>
                          <label htmlFor="in progress">In Progress</label>

                          <br/>

                          <input value="blocked" name="newStatus" type="radio" id="blocked"/>

                          <label htmlFor="blocked">Blocked</label>
                          <br/>

                          <input value="in review" name="newStatus" type="radio" id="in review"/>
                          <label htmlFor="in review">In Review</label>
                          <br/>

                          <input value="done" name="newStatus" type="radio" id="done"/>
                          <label htmlFor="done">Done</label>
                        </div>
                        <div className="col s4" id="newTaskRadio3">
                          <span>Type:
                          </span>

                          <br/>
                          <input value="feature" name="newType" type="radio" id="feature"/>

                          <label htmlFor="feature">Feature</label>
                          <br/>

                          <input value="bug" name="newType" type="radio" id="bug"/>
                          <label htmlFor="bug">Bug</label>
                          <br/>

                          <input value="research" name="newType" type="radio" id="research"/>
                          <label htmlFor="research">Research</label>

                          <br/>
                        </div>
                      </div>
                    </form>
                  </div>
                </Modal>
              </li>
              <li>
                <a id="logout" href="/logout" waves='light'> Log Out </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    )
  }
}

module.exports = Nav;
