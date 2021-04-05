// This React app is the user interface for maintaining a simple inventory
// list. The design goal was to put all of the functions in a single file
// to help study how they work.

// Mongodb/Atlas storage is accessed via an api running on a Heroku server.
// Both Atlas and Heroku are free accounts.

// by John Phillips on 2021-02-24 revised 2021-02-25
// v2 on 2021-03-19 revised 2021-04-05

// This file contains the navbar and routing for the app.

import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";
import Home from "./home";
import Help from "./help";
import About from "./about";
import Print from "./print";

export default function App() {
    return (
      <Router>
        <ul className="navbar">
          <li className="nav-item">
            <NavLink className="nav-link" activeClassName="nav-active" to="/home">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className="nav-link"
              activeClassName="nav-active"
              to="/print"
            >
              Print
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" activeClassName="nav-active" to="/help">
              Help
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className="nav-link"
              activeClassName="nav-active"
              to="/about"
            >
              About
            </NavLink>
          </li>
        </ul>
        <Switch>
          <Route exact path="/print">
            <Print />
          </Route>
          <Route exact path="/help">
            <Help />
          </Route>
          <Route exact path="/about">
            <About />
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/inventory-ui-v2">
            <Redirect to="/home" />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </Switch>
      </Router>
    );
  }