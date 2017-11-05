// Include React
var React = require("react");

// Create the Main component
var Main = React.createClass({

  // Here we render the component
  render: function() {

    return (
      <div>
        <nav>
          <div className="nav-wrapper pad">
            <a href="#!" className="brand-logo logo">triloGira</a>
            <a href="#" data-activates="mobile-demo" className="button-collapse"><i className="material-icons">menu</i></a>
            <ul className="right hide-on-med-and-down">
              <li>

                <a className='dropdown-button btn' data-beloworigin="true" href='#' data-activates='dropdown1'>Projects</a>
                <ul id='dropdown1' className='dropdown-content collapsible' data-collapsible="accordion">
                  <li><a href="#!">Project 1</a></li>
                  <li className="divider"></li>
                  <li><a href="#!">Project 2</a></li>
                  <li className="divider"></li>
                  <li><a href="#!">Project 3</a></li>
                </ul>
              </li>
              <li><a href="badges.html">New Task</a></li>
            </ul>
            <ul className="side-nav" id="mobile-demo">
              <li><a href="sass.html">Sass</a></li>
              <li><a href="badges.html">Components</a></li>
              <li><a href="collapsible.html">Javascript</a></li>
              <li><a href="mobile.html">Mobile</a></li>
            </ul>
          </div>
        </nav>
        <div className="container">
            <div className="row">
              <div className="col s12">
                <div className="input-field col s12">
                  <i className="material-icons prefix">search</i>
                  <input id="search" type="search" className="validate" />
                  <label htmlFor="search">Search</label>
                </div>
              </div>
              <div className="col s1"></div>
              <div className="col s10">
                <ul className="collection">
                     <a href="#!" className="collection-item avatar">
                         <i className="material-icons circle red">priority_high</i>
                         <span className="title"><h4>Task Title</h4></span>
                         <p>Developer: Paige Pittman</p>
                         <p>Status: To-Do</p>
                         <p>Time Allotment: 04hr 00m</p>
                         <p>Time Spent: 00hr 00m</p>
                         <p>Date Created: 2017-11-04</p>
                         <p>Last Update: 2017-11-04</p>
                     </a>
               </ul>
              </div>
              <div className="col s1"></div>
            </div>
      	</div>
      </div>
    );
  }
});

// Export the component back for use in other files
module.exports = Main;
