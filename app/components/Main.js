// Include React
var React = require("react");

// socket connection
var io = require("socket.io-client");
var socket = io('http://localhost:3000');

var Nav = require("./Nav");
var Sort = require("./Sort");
var Task = require("./Task");

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
      <Nav />
      {this.props.children}
    </div>
    );
  }
}

// Export the component back for use in other files
module.exports = Main;
