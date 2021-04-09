//imports
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs')

// initiate express app
const app = express();

//accept urlencoded requests
app.use(bodyParser.urlencoded());
//enabling signed cookies
app.use(cookieParser(process.env.SECRET || 'testSecret'));

//set css & imgs as a public folder
app.use('/css',express.static(path.join(__dirname + '/css')));
app.use('/imgs',express.static(path.join(__dirname + '/imgs')));

/**
 * @endpoint POST authentication 
 * @param password:strung the user input for password
 * @param group:string the user input for password
 * @sets auth cockle
 * @redirects to /schedule upon success and to /error upon failure
 */
app.post('/auth', (req, res) => {
  const {password, group} = req.body;

  console.log(req.body)

  // one password for all users
  const authPhrase = 'ce-hub';

  if(password !== authPhrase){
    res.sendFile(path.join(__dirname + '/html/login-error.html'));
    return;
  }

  res.cookie('qid', group, {httpOnly: true, signed: true});

  res.redirect('/schedule');

});

// custom middleware to check if user is authenticated
const checkAuth = (req, res, next) => {
  const {qid} = req.signedCookies;
  console.log(qid)
  if(qid){
    next();
  }else{
    res.redirect('/auth');
  }
};


/**
 * @endpoint GET authentication
 * @returns login page html
 */
app.get('/auth', (req,res) =>{
  const {qid} = req.signedCookies;
  qid ? res.redirect('/') : res.sendFile(path.join(__dirname + '/html/index.html'));
});


/**
 * @endpoint GET schedule
 * @authenticated
 * @returns html page based on day of week
 * @redirects to /auth for unauthenticated users
 */
app.get('/schedule', checkAuth, (req, res) => {
  //getting group from cookie
  const {qid:group} = req.signedCookies;

  const weekday = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const day = new Date().getDay();

  //construct a path to the correct file from date and group
  const pathToFile = path.join(__dirname + `/html/${group}${weekday[day]}.html`);

  //check if that file exists to send it or the free page
  if(fs.existsSync(pathToFile)){
    res.sendFile(pathToFile);
  }else{
    res.sendFile(path.join(__dirname + '/html/free.html'));
  }

});


/**
 * @endpoint GET home
 * @returns home page html
 */
app.get('/', checkAuth, (_, res) => {
  res.sendFile(path.join(__dirname + '/html/home.html'));
});


app.use('*', (_, res) => {
  res.send('<h1>404</h1>');
});

//start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT,() =>{
  console.log(`server started at http://localhost:${PORT}`);
});