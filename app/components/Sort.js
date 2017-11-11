// Include React
var React = require("react");

// socket connection
import {socket} from "../config/socket.js";

// Moment.js
var moment = require('moment');

import {Link} from 'react-router';
import dummyData from '../../dummyData';


class Sort extends React.Component {
  constructor() {
    super();

    this.state = {
      activeColumn: "",
      sortReverse: false,
      filter: ""
    };

    this.setSort = this.setSort.bind(this);
    this.searchFilter = this.searchFilter.bind(this);
  }

  searchFilter(e) {
    // get search input
    this.setState({
      filter: e.target.value
    });
  }

  setSort(e, name) {
    // toggle sort
    this.setState({
      activeColumn: name,
      sortReverse: name === this.state.activeColumn ? !this.state.sortReverse : false
    });
  }

  renderTasks() {
    var filter = this.state.filter.toLowerCase();
    var field = this.state.activeColumn;
    var reverse = this.state.sortReverse;

    // filter results first
    return this.props.tasks.filter((data) => {
      if (data.title.toLowerCase().indexOf(filter) > -1 || data.id.toString() === filter)
        return true;
      else
        return false;
    })
    // then sort based on selected field
    .sort((a, b) => {
      switch (field) {
        // by number
        case "timeEstimate":
        case "timeSpent":
        case "id":
          a = parseInt(a[field]);
          b = parseInt(b[field]);

          return (reverse ? b > a : a > b);

          break;
        // by letter
        case "title":
        case "owner":
        case "status":
          a = a[field].toLowerCase();
          b = b[field].toLowerCase();

          if (reverse) {
            if (b < a) return -1;
            else if (b > a) return 1;
            else return 0;
          }
          else {
            if (a < b) return -1;
            else if (a > b) return 1;
            else return 0;
         }

          break;
        // by date
        case "dateCreated":
        case "dateModified":
          a = new Date(a[field]);
          b = new Date(b[field]);

          return (reverse ? b - a : a - b);

          break;
      }
    })
    // then convert to jsx elements
    .map((task, i) => {
      let url = "/task/" + task.id;

      return (
        <tr key={i}>
          <td>{task.id}</td>
          <td><Link to={url}>{task.title}</Link></td>
          <td>{task.owner}</td>
          <td>{task.status}</td>
          <td>{task.timeEstimate}</td>
          <td>{task.timeSpent}</td>
          <td>{moment(task.dateCreated).format("YYYY-MM-DD hh:mm A")}</td>
          <td>{moment(task.dateModified).format("YYYY-MM-DD hh:mm A")}</td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div>
        <div className="container">
          <div id="searchBar" className="row z-depth-5">
            <div className="col s10 offset-s1">
              {console.log(this.props)}
              <div className="input-field">
                <i className="material-icons prefix">search</i>
                <input id="search" type="search" className="validate" onChange={this.searchFilter} />
                <label htmlFor="search">Search</label>
              </div>
            </div>
          </div>
          <div id="mainPageWrap" className="row z-depth-5">
            <div className="col s1"></div>
            <div className="col s10">
              <table className="highlight">
                <thead>
                  <tr>
                      <th value="b" id="id" onClick={(e)=>this.setSort(e, "id")}>ID</th>
                      <th value="a" id="title" onClick={(e)=>this.setSort(e, "title")}>Title</th>
                      <th value="a" id="owner" onClick={(e)=>this.setSort(e, "owner")}>Developer</th>
                      <th value="a" id="status" onClick={(e)=>this.setSort(e, "status")}>Status</th>
                      <th value="a" id="timeEstimate" onClick={(e)=>this.setSort(e, "timeEstimate")}>Time Allotment</th>
                      <th value="a" id="timeSpent" onClick={(e)=>this.setSort(e, "timeSpent")}>Time Spent</th>
                      <th value="a" id="dateCreated" onClick={(e)=>this.setSort(e, "dateCreated")}>Date Created</th>
                      <th value="a" id="dateModified" onClick={(e)=>this.setSort(e, "dateModified")}>Last Update</th>
                  </tr>
                </thead>

                <tbody>
                {/* this is where each task will populate */}

                {this.renderTasks()}

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
