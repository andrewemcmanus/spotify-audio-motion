const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');

// passport "serializes" your info and makes it easier to log in
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

// passport "deserializes" takes your id and looks it up in the database
passport.deserializeUser((id, cb) => {
  db.user.findByPk(id).then(user => {
    if (user) {
      cb(null, user);
    }
  }).catch(err => {
    console.log(err)
  })
})

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, (email, password, cb) => {
  db.user.findOne({
    where: { email } // email: email
  }).then(user => {
    // if there's no user OR a user gives an invalid password:
    if (!user || !user.validPassword(password)) {
      cb(null, false);
    } else {
      cb(null, user); // ...otherwise, send up the user
    }
  }).catch(cb);
}));

module.exports = passport;
