var React = require("react");
var ReactDOM = require("react-dom");
var Main = require("./components/Main")
var Task = require("./components/Task")
//var Test = require("./components/Test")
var Sort = require("./components/Sort")
var routes = require("./config/routes")


ReactDOM.render(routes, document.getElementById("app"));
