//start dotenv
const dotenv = require("dotenv");
dotenv.config();

//imports
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const mongoose = require('mongoose');

const Slot= require('./models/timetable');

mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true});

// initiate express app
const app = express();

//accept urlencoded requests
app.use(bodyParser.urlencoded({ extended: true }));
//enabling signed cookies
app.use(cookieParser(process.env.SECRET || "testSecret"));

//set css & imgs as a public folder
app.use("/css", express.static(path.join(__dirname + "/css")));
app.use("/imgs", express.static(path.join(__dirname + "/imgs")));

/**
 * @endpoint POST authentication
 * @param password:strung the user input for password
 * @param group:string the user input for password
 * @sets auth cockle
 * @redirects to /schedule upon success and to /error upon failure
 */
app.post("/auth", (req, res) => {
  const { password, group } = req.body;

  // one password for all users
  const authPhrase = process.env.PASSWORD || "ce-hub";

  if (password !== authPhrase) {
    res.sendFile(path.join(__dirname + "/html/login-error.html"));
    return;
  }

  res.cookie("qid", group, { httpOnly: true, signed: true });

  res.redirect("/schedule");
});

// custom middleware to check if user is authenticated
const checkAuth = (req, res, next) => {
  const { qid } = req.signedCookies;
  if (qid) {
    next();
  } else {
    res.redirect("/auth");
  }
};

/**
 * @endpoint GET authentication
 * @returns login page html
 */
app.get("/auth", (req, res) => {
  const { qid } = req.signedCookies;
  qid
    ? res.redirect("/")
    : res.sendFile(path.join(__dirname + "/html/index.html"));
});

/**
 * @endpoint GET schedule
 * @authenticated
 * @returns html page based on day of week
 * @redirects to /auth for unauthenticated users
 */
app.get("/schedule", checkAuth, (req, res) => {
  res.sendFile(path.join(__dirname + "/html/template.html"));
});

app.post('/schedule', async (req, res) => {
  const { qid: group } = req.signedCookies;
  const time = new Date();

  const slots = await Slot.findOne({group, day: time.getDay()});

  res.status(200).json( slots.timetable || []);
});

/**
 * @endpoint Logout
 * @removes auth cookie
 * @redirects /auth
 */
app.get("/logout", (req, res) => {
  res.clearCookie("qid");
  res.redirect("/auth");
});

/**
 * @endpoint GET announcements
 * @returns home page html
 */
app.get("/announcements", checkAuth, (_, res) => {
  res.sendFile(path.join(__dirname + "/html/home.html"));
});

/**
 * @endpoint GET home
 * @returns home page html
 */
app.get("/", checkAuth, (_, res) => {
  res.redirect("/schedule");
});

app.use("*", (_, res) => {
  res.send("<h1>404</h1>");
});

// connecting to database
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  //start the server
  console.log('Connected to Database');
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`server started at http://localhost:${PORT}`);
  });
});

