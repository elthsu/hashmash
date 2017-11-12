// Include React
var React = require("react");



class Welcome extends React.Component {

  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            <div id="welcomeText" className="col s10 offset-s1 z-depth-5">
              <h5>To get started, select a Project from the dropdown menu above.</h5>
              <br />
              <h5>If the dropdown is empty, make sure you are a collaborator or owner of a GitHub Repository.</h5>
              <br />
              <h5>-- Team #mash</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// Export the component back for use in other files
module.exports = Welcome;
