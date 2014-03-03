var middleware = require('../lib/middleware.js')
  , auth = require('../lib/auth.js');

module.exports = {

    '/login': {

        get: middleware.doContent

      , post: auth.passport.authenticate('local', { 
          successRedirect: '/'
        , failureRedirect: '/login'
        , failureFlash: true 
        , successFlash: 'Welcome!'
        })



      , '/forgot': {

            get: middleware.doTodo

        }

    }

  , '/logout': {

        get: middleware.doTodo

    }

  , '/signup': {

        get: middleware.doTodo

    }



};