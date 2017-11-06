// Include React
var React = require("react");

// socket connection
var io = require("socket.io-client");
var socket = io('http://localhost:3000');

class Main extends React.Component {
  constructor() {
    super();

    this.state = {
      project: {},
      tasks: []
    };
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

                <a className='dropdown-button btn' data-beloworigin="true" href='#' data-activates='dropdown1'>Projects</a>
                <ul id='dropdown1' className='dropdown-content collapsible' data-collapsible="accordion">
                  <li>
                    <a href="#!">{this.state.project.name}</a>
                  </li>
                </ul>
              </li>
              <li>
                <a href="badges.html">New Task</a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="container">
          <div className="row">
            <div className="col s12">
              <div className="input-field col s12">
                <i className="material-icons prefix">search</i>
                <input id="search" type="search" className="validate"/>
                <label htmlFor="search">Search</label>
              </div>
            </div>
            <div className="col s1"></div>
            <div className="col s10">
              <table className="highlight">
                <thead>
                  <tr>
                      <th>Title</th>
                      <th>Developer</th>
                      <th>Status</th>
                      <th>Time Allotment</th>
                      <th>Time Spent</th>
                      <th>Date Created</th>
                      <th>Last Update</th>
                  </tr>
                </thead>

                <tbody>
                {/* this is where each task will populate */}

                {this.state.tasks.map(function(task, i) {
                  return (

                          <tr key={i}>
                            <td>{task.title}</td>
                            <td>{task.owner}</td>
                            <td>{task.status}</td>
                            <td>{task.timeEstimate}</td>
                            <td>{task.timeSpent}</td>
                            <td>{task.dateCreated}</td>
                            <td>{task.dateModified}</td>
                          </tr>

                        )
                  })}

                </tbody>
              </table>

            </div>
            <div className="col s1"></div>
          </div>
        </div>
      </div>
    );
  }
}

// Export the component back for use in other files
module.exports = Main;
