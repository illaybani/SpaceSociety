const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const apiRouter = require("./routes/api");
const morgan = require('morgan');
const chalk = require('chalk');
const session = require('express-session');
const CustomError = require('./utils/CustomError.js')


const app = express();

app.use(cors());

// Custom log format
const logFormat = (tokens, req, res) => {
  const timestamp = new Date().toISOString();
  return [
    chalk.gray(`[${timestamp}]`),
    chalk.cyan(tokens.method(req, res)),
    chalk.yellow(tokens.url(req, res)),
    chalk.green(tokens.status(req, res)),
    chalk.white(tokens['response-time'](req, res) + ' ms')
  ].join(' ');
};

app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1800000 }
  })
);

//  custom log format with Morgan
app.use(morgan(logFormat));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/admin", express.static(path.join(__dirname, "admin")));
app.use("/api", apiRouter);


// for readme.html and other static
app.use(express.static(path.join(__dirname, "public")));


// If no route matched till here, then it must be 404
app.use((req, res, next) => {
  const error = new CustomError(404, 'Not Found');
  error.status = 404;
  next(error);
});


// Error handling middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});


module.exports = app;
