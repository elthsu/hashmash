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
    allProjects: [],
    tasks: [],
    newTask: {},
    newTitle: "",
    newPriority: "",
    newDescription: "",
    newStatus: "",
    newType: "",
    newEstimate: ""
  };

  this.createTask = this.createTask.bind(this);
  this.chooseProject = this.chooseProject.bind(this);
}

componentWillReceiveProps(props) {
  this.setState({allProjects: props.allProjects});
}

componentDidUpdate(prevProps, prevState) {
  console.log(this.state.allProjects);
}

createTask(event) {

this.setState({[event.target.name]: event.target.value});

this.setState({newTask: {
  title: this.state.newTitle,
  description: this.state.newDescription,
  priority: this.state.newPriority,
  status: this.state.newStatus,
  type: this.state.newType,
  timeEstimate: this.state.newEstimate
  }
});

this.handleSubmit = this.handleSubmit.bind(this);
}

handleSubmit() {
  this.props._newTask(this.state.newTask);
}

chooseProject (event) {
  var project = event.target.getAttribute("value");
  this.props._selectProject(project)
}

render() {
  return (
  <div>
    <nav>
      <div className="nav-wrapper pad">
        <a href="#!" className="brand-logo logo">#mash</a>
        <a href="#" data-activates="mobile-demo" className="button-collapse">
          <i className="material-icons">menu</i>
        </a>
        <ul className="right hide-on-med-and-down">
          <li>
            <a className='dropdown-button btn' data-beloworigin="true" href='#' data-activates='projectDrop'>Projects</a>
            <ul id='projectDrop' className='dropdown-content collapsible' data-collapsible="accordion">
              {this.state.allProjects.map((project, i) => {
                return (
                  <li>
                    <a value={project.name} onClick={(event)=>this.chooseProject(event)} href="#!">{project.name}</a>
                  </li>
                )
              })
            }
            </ul>
          </li>
          <li>
            <Modal
            header='New Task'

            trigger={<a waves='light'>New Task</a>} actions={<Button className="btn waves-effect waves-light btn-flat modal-action modal-close" waves='light' id="add-task" onClick={this.handleSubmit}>add task</Button>}>

            <div className="row">
              <form onChange={this.createTask} className="col s12">
                <div className="row">
                  <div className="input-field col s4">
                    <input name="newTitle" placeholder="" id="new-title" type="text" className="validate"/>
                    <label htmlFor="new-title">Title</label>
                  </div>
                  <div className="input-field col s8">
                    <input name="newDescription" placeholder="" id="new-description" type="text" className="validate"/>
                    <label htmlFor="new-description">Description</label>
                  </div>
                </div>
                <div className="row">
                  <div className="col s3">
                    <span>Priority: </span>

                      <br />
                      <input value="critical" name="newPriority" type="radio" id="critical" />

                      <label htmlFor="critical">Critical</label>
                      <br />
                      <input value="normal" name="newPriority" type="radio" id="normal" />
                      <label htmlFor="normal">Normal</label>
                      <br />

                      <input value="backburner" name="newPriority" type="radio" id="backburner" />
                      <label htmlFor="backburner">Backburner</label>


                    </div>

                      <div className="col s3">
                        <span>Status: </span>
                        <br />



                          <input value="to do" name="newStatus" type="radio" id="to do" />

                          <label htmlFor="to do">To Do</label>
                          <br />

                          <input value="in progress" name="newStatus" type="radio" id="in progress" />
                          <label htmlFor="in progress">In Progress</label>


                          <br />

                          <input value="blocked" name="newStatus" type="radio" id="blocked" />

                          <label htmlFor="blocked">Blocked</label>
                          <br />

                          <input value="in review" name="newStatus" type="radio" id="in review" />
                          <label htmlFor="in review">In Review</label>
                          <br />

                          <input value="done" name="newStatus" type="radio" id="done" />
                          <label htmlFor="done">Done</label>


                        </div>


                      <div className="col s3">
                        <span>Type: </span>

                        <br />


                          <input value="feature" name="newType" type="radio" id="feature" />

                          <label htmlFor="feature">Feature</label>
                          <br />

                          <input value="bug" name="newType" type="radio" id="bug" />
                          <label htmlFor="bug">Bug</label>
                          <br />

                          <input value="research" name="newType" type="radio" id="research" />
                          <label htmlFor="research">Research</label>


                          <br />

                        </div>



                          <div className="input-field col s2">
                            <input placeholder="" name="newEstimate" id="new-estimate" type="number" className="validate"/>

                            <label htmlFor="new-number">Time Est. (Min)</label>

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
