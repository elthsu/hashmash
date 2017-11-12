// Include React
var React = require("react");

// socket connection
import {socket} from "../config/socket.js";

class Chat extends React.Component {
  constructor() {
    super();

    this.state = {
      message: ""
    };

    this.updateMessage = this.updateMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.checkSubmit = this.checkSubmit.bind(this);
    this.updateScroll = this.updateScroll.bind(this);
  }

  checkSubmit(e) {
    // user pressed enter key inside textarea
    if (e.which === 13)
      this.sendMessage(e);
  }

  updateMessage(e) {
    // link input box to state
    this.setState({
      message: e.target.value
    });
  }

  sendMessage(e) {
    e.preventDefault();

    if (this.state.message === "") {
      return;
    }

    // send chat to server
    socket.emit("chat", {
      id: this.props.taskId,
      message: this.state.message
    });

    // clear values
    this.setState({
      message: ""
    });
  }

  updateScroll(){
      var element = document.getElementById("chatWin");
      element.scrollTop = element.scrollHeight;

  }

  componentDidUpdate(){

    this.updateScroll();
  }

  render() {
    // dynamically grow/shrink textarea

    return (
      <div>
        <div id="chatWin" className="col l5 offset-1 z-depth-5">
          {this.props.comments.map(function(chat, i) {
            return (
              <div key={i}>
                <p className="chatMessage">{chat.message}</p>
                <p className="chatAuthor">{chat.name}</p>
              </div>
            )
          })}
        </div>
        <div id="chatInputWin" className="col l5 offset-1 z-depth-5">
          <form>
            <textarea
              id="chatInput"
              className="materialize-textarea"
              onChange={this.updateMessage}
              onKeyPress={this.checkSubmit}
              value={this.state.message}
              placeholder="Write a Comment">
            </textarea>

            <a id="chatBtn" className="btn-floating btn-large waves-effect waves-light"><i className="material-icons" onClick={this.sendMessage}>chat</i></a>
          </form>
        </div>
      </div>
    );
  }
}

// Export the component back for use in other files
module.exports = Chat;
