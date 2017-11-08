// Include React
var React = require("react");

// socket connection
var io = require("socket.io-client");
var socket = io('http://localhost:3000');

import dummyData from '../../dummyData';

class Sort extends React.Component {
  constructor() {
    super();

    this.state = {
      project: "project1",
      tasks: [],

    };

    this.alphaSort = this.alphaSort.bind(this);
    this.timeSort = this.timeSort.bind(this);
    this.dateSort = this.dateSort.bind(this);

  }

  componentDidMount() {
    this.setState({tasks: dummyData})
  }

  alphaSort(e, name) {
    var toggle = e.target.getAttribute("value");
    if (toggle === "a") {
      var unSorted = this.state.tasks;
      var sorted = unSorted.sort((a, b) => a[name].localeCompare(b[name]));
      e.target.setAttribute("value", "b");
      this.setState({tasks: sorted})
    } else {
      var unSorted = this.state.tasks;
      var sorted = unSorted.sort((a, b) => b[name].localeCompare(a[name]));
      e.target.setAttribute("value", "a");
      this.setState({tasks: sorted})
    }

  }

  timeSort(e, time) {
    var unSorted = this.state.tasks;
    var toggle = e.target.getAttribute("value");
    if (toggle === "a") {
      var sorted = unSorted.sort(function(a, b) {
        a = parseInt(a[time]);
        b = parseInt(b[time]);
        console.log(a, b)
        return a - b;
      });
      e.target.setAttribute("value", "b");
      this.setState({tasks: sorted})
    } else {
      var sorted = unSorted.sort(function(a, b) {
        a = parseInt(a[time]);
        b = parseInt(b[time]);
        return b - a;
      });
      e.target.setAttribute("value", "a");
      this.setState({tasks: sorted})
    }

  }

  dateSort(e, date) {
    var unSorted = this.state.tasks;
    var toggle = e.target.getAttribute("value");
    if (toggle === "a") {
      var sorted = unSorted.sort(function(a, b) {
      a = new Date(a[date]);
      b = new Date(b[date]);
      return a>b ? 1 : a<b ? -1 : 0;
      });
      e.target.setAttribute("value", "b");
      this.setState({tasks: sorted})
    } else {
      var sorted = unSorted.sort(function(a, b) {
      a = new Date(a[date]);
      b = new Date(b[date]);
      return a>b ? -1 : a<b ? 1 : 0;
      });
      e.target.setAttribute("value", "a");
      this.setState({tasks: sorted})
    }


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
                    <a href="#!"></a>
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
                      <th value="a" onClick={(e)=>this.alphaSort(e, "title")}>Title</th>
                      <th value="a" onClick={(e)=>this.alphaSort(e, "owner")}>Developer</th>
                      <th value="a" onClick={(e)=>this.alphaSort(e, "status")}>Status</th>
                      <th value="a" onClick={(e)=>this.timeSort(e, "timeEstimate")}>Time Allotment</th>
                      <th value="a" onClick={(e)=>this.timeSort(e, "timeSpent")}>Time Spent</th>
                      <th value="a" onClick={(e)=>this.dateSort(e, "dateCreated")}>Date Created</th>
                      <th value="a" onClick={(e)=>this.dateSort(e, "dateModified")}>Last Update</th>
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
module.exports = Sort;
