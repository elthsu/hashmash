import React from "react";
import router from "react-router";
import {Route} from "react-router";
import {Router} from "react-router";
import {Link} from "react-router";
import {IndexRoute} from "react-router";
import {browserHistory} from "react-router";


import Main from "../components/Main";
import Sort from "../components/Sort";
import Task from "../components/Task";
import Test from "../components/Test";
import Welcome from "../components/Welcome";

// Export the Routes
module.exports = (
  // High level component is the Router component.
  <Router history={browserHistory}>
    <Route path="/" component={Main} >

      {/* If user selects Search or Saved show the appropriate component */}

      <Route path="/:room" component={Sort} />
      <Route path="/:room/task/:id" component={Task} />

      {/* If user selects any other path... we get the Home Route */}
      <IndexRoute component={Welcome} />

    </Route>
  </Router>
);
