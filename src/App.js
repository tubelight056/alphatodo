import React from "react";
import Login from "./screen/Login/LoginScreen.js";
import Home from "./screen/Home/Home.js";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Switch />
      <Route exact path="/" component={Login} />
      <Route path="/home/:name" component={Home} />
    </Router>
  );
};

export default App;
