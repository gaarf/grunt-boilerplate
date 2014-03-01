var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , User = require('bookshelf').DB.model('User');


passport.use(new LocalStrategy(
  function(username, password, done) {

    done(null, false, { message: 'LocalStrategy not configured.' });

    // User.findOne({ username: username }, function (err, user) {

    //   if (err) { 
    //     return done(err);
    //   }
    //   if (!user) {
    //     return done(null, false, { message: 'Incorrect username.' });
    //   }
    //   if (!user.validPassword(password)) {
    //     return done(null, false, { message: 'Incorrect password.' });
    //   }
    //   return done(null, user);

    // });

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