// Include React
var React = require("react");

// socket connection
import {socket} from "../config/socket.js";

class Chat extends React.Component {
  constructor() {
    super();

    this.state = {
      message: "",
      height: "0px"
    };

    this.updateMessage = this.updateMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.checkSubmit = this.checkSubmit.bind(this);
  }

  checkSubmit(e) {
    // user pressed enter key inside textarea
    if (e.which === 13)
      this.sendMessage(e);
  }

  updateMessage(e) {
    // link input box to state
    this.setState({
      message: e.target.value,
      height: document.getElementById("chatInput").scrollHeight + "px"
    });
  }

  sendMessage(e) {
    e.preventDefault();

    // send chat to server
    socket.emit("chat", {
      id: this.props.taskId,
      message: this.state.message
    });

    // clear values
    this.setState({
      message: "",
      height: "0px"
    });
  }

  render() {
    // dynamically grow/shrink textarea
    var styles = {
      height: this.state.height
    };

    return (
      <div id="chatWin" className="col l3 z-depth-5">
        {this.props.comments.map(function(chat, i) {
          return (
            <div key={i}>
              <p className="chatMessage">{chat.message}</p>
              <p className="chatAuthor">{chat.name}</p>
            </div>
          )
        })}

        <form onSubmit={this.sendMessage}>
          <textarea 
            id="chatInput"
            style={styles}
            onChange={this.updateMessage} 
            onKeyPress={this.checkSubmit}
            value={this.state.message}
            placeholder="Write a Message">
          </textarea>

          <button>Send</button>
        </form>
      </div>
    );
  }
}

// Export the component back for use in other files
module.exports = Chat;