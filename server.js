require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('./config/ppConfig');
const flash = require('connect-flash');
const SECRET_SESSION = process.env.SECRET_SESSION;
// console.log(SECRET_SESSION);
const app = express();
// add the isLoggedIn middleware here:
const isLoggedIn = require('./middleware/isLoggedIn');

app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

const sessionObject = {
  // secret: what we actually will be giving the user on our site as a session cookie
  secret: SECRET_SESSION,
  // resave: save the session even if it's modified, so we make this false from the start
  resave: false,
  // saveUninitialized: if we have a new session, we save it, thus making it true
  saveUninitialized: true
}

app.use(session(sessionObject));

// initialize Passport and run through middleware
app.use(passport.initialize());
app.use(passport.session());

// FLASH
// using Flash throughout app to send temp messages to users
app.use(flash());
// messages that will be accessible to every view
app.use((req, res, next) => {
  // before every route, we will attach a user to res.local
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

app.get('/', (req, res) => {
  console.log(res.locals.alerts);
  res.render('index', { alerts: res.locals.alerts });
});

app.get('/profile', isLoggedIn, (req, res) => {
  res.render('profile');
});

app.use('/auth', require('./routes/auth'));


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🎧 You're listening to the smooth sounds of port ${PORT} 🎧`);
});

module.exports = server;
