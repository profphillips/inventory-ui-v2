// This React app is the user interface for maintaining a simple inventory
// list.

// Mongodb/Atlas storage is accessed via an api running on a Heroku server.
// Both Atlas and Heroku are free accounts.

// by John Phillips on 2021-02-24 revised 2021-02-25
// v2 on 2021-03-19 revised 2021-04-05

import React from "react";
import ReactDOM from "react-dom";

import App from "./app";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
