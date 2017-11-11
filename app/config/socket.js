// socket library
var io = require("socket.io-client");

class Socket {
	constructor() {
		// connect to server
		this.socket = io(window.location.origin);
	}
}

// export single instance of socket
export let socket = new Socket().socket;