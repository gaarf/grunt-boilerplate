var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , User = require('bookshelf').DB.model('User')
  , Promise = require('bluebird');


passport.use(new LocalStrategy({
    usernameField: 'email'
  }
, function(email, password, done) {
    User
      .forge({email:email})
      .fetch()
      .then(
        function(user) {
          if(!user) {
            return Promise.reject('Unknown account.');
          }
          return user.checkPassword(password).bind(user);
        }
      )
      .then(
        function(valid) {
          if(!valid) {
            return Promise.reject('Incorrect password.');
          }
          return Promise.resolve(this);
        }
      )
      .done(
        function(user) {
          done(null, user); // passwords match!
        }
      , function(message) {
          done(null, false, { message: message });
        }
      )
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.forge({id:id}).fetch().exec(done);
});


module.exports = {

  passport: passport

};