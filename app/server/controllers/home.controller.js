var middleware = require('../lib/middleware.js')

module.exports = {

    '/': {

        all: [
          middleware.base
        , function (req, res) {
              res.locals.page.bodyClass = 'homepage';
              res.render('home');
          }
        ]

    }


  , '/login': {

        get: middleware.doTodo

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