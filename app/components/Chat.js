// Include React
var React = require("react");

// socket connection
import {socket} from "../config/socket.js";

class Chat extends React.Component {
  constructor() {
    super();
  }


  render() {
    return (
      <div id="chatWin" className="col l3 z-depth-5">
        {this.props.comments.map(function(chat, i) {
          return (
            <p key={i} className="chatMessage">{chat}</p>
          )
        })}
      </div>
    );
  }
}

// Export the component back for use in other files
module.exports = Chat;