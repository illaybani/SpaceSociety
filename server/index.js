var app = require("./app");
var debug = require("debug")("server:server");
var http = require("http");
const chalk = require("chalk");
const connectToDBService = require("./model/connectToDBService");
const path = require("path");
const { fetchAndSaveCollections } = require('./persist.js');
const express = require("express");


connectToDBService()
  .then(() => {
    console.log(chalk.cyan.bold("connected to mongo"));

    // Fetch and save collections data to the filesystem
    return fetchAndSaveCollections();
  })
  .then(() => {
    console.log(chalk.cyan.bold("Collections fetched and saved to disk successfully!"));
    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);
  })
  .catch((err) => {
    console.log(chalk.redBright.bold(err));
    process.exit(1);
  });



/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "8181");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);


/**
 * Define route to serve the index.html file.
 */
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
  console.log(chalk.blue(`Server running on http://localhost:${port}/`));
}
