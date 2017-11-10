// Include React
var React = require("react");

// socket connection
var io = require("socket.io-client");
var socket = io('http://localhost:3000');

import {Link} from 'react-router';
import dummyData from '../../dummyData';


class Sort extends React.Component {
  constructor() {
    super();

    this.state = {
      project: {},
      tasks: [],
      activeColumn: "",
      sortDirection: ""

    };

    this.alphaSort = this.alphaSort.bind(this);
    this.timeSort = this.timeSort.bind(this);
    this.dateSort = this.dateSort.bind(this);

  }

  componentWillReceiveProps(props) {
    this.setState({tasks: props.tasks});
  }

  componentWillUnmount() {

  }


  alphaSort(e, name) {
    var toggle = e.target.getAttribute("value");
    var id = e.target.getAttribute("id");
    if (toggle === "a") {
      var unSorted = this.state.tasks;
      var sorted = unSorted.sort((a, b) => a[name].localeCompare(b[name]));
      e.target.setAttribute("value", "b");
      this.setState({activeColumn: id});
      this.setState({sortDirection: "b"});
      this.setState({tasks: sorted});
    } else {
      var unSorted = this.state.tasks;
      var sorted = unSorted.sort((a, b) => b[name].localeCompare(a[name]));
      e.target.setAttribute("value", "a");
      this.setState({activeColumn: id});
      this.setState({sortDirection: "a"});
      this.setState({tasks: sorted});
    }

  }

  timeSort(e, time) {
    var unSorted = this.state.tasks;
    var toggle = e.target.getAttribute("value");
    if (toggle === "a") {
      var sorted = unSorted.sort(function(a, b) {
        a = parseInt(a[time]);
        b = parseInt(b[time]);
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
      this.setState({tasks: sorted});
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
      this.setState({tasks: sorted});
    }


  }




  render() {
    return (
      <div>
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
                      <th value="b" id="id" onClick={(e)=>this.timeSort(e, "id")}>ID</th>
                      <th value="a" id="title" onClick={(e)=>this.alphaSort(e, "title")}>Title</th>
                      <th value="a" id="owner" onClick={(e)=>this.alphaSort(e, "owner")}>Developer</th>
                      <th value="a" id="status" onClick={(e)=>this.alphaSort(e, "status")}>Status</th>
                      <th value="a" id="timeEstimate" onClick={(e)=>this.timeSort(e, "timeEstimate")}>Time Allotment</th>
                      <th value="a" id="timeSpent" onClick={(e)=>this.timeSort(e, "timeSpent")}>Time Spent</th>
                      <th value="a" id="dateCreated" onClick={(e)=>this.dateSort(e, "dateCreated")}>Date Created</th>
                      <th value="a" id="dateModified" onClick={(e)=>this.dateSort(e, "dateModified")}>Last Update</th>
                  </tr>
                </thead>

                <tbody>
                {/* this is where each task will populate */}

                {this.state.tasks.map(function(task, i) {
                  //console.log(this.state.tasks);
                  let url = "/task/" + task.id;
                  return (

                          <tr key={i}>
                            <td>{task.id}</td>
                            <td><Link to={url}>{task.title}</Link></td>
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
