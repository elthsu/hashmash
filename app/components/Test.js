var React = require("react");

// socket connection
var io = require("socket.io-client");
var socket = io('http://localhost:3000');

class Test extends React.Component {
	constructor() {
		super();

		this.state = {
			project: {}
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
			switch(data.type) {
				case "project":
					this.setState({
						project: data.data
					});

					break;
			}
		});
	}

	render() {
		return (
			<div>
				you are in project: {this.state.project.name}
				
				<p>{JSON.stringify(this.state.project)}</p>
			</div>
		);
	}
}

module.exports = Test;