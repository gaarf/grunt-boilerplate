var _ = require('underscore');

var todo = function (req, res) {
    res.render('todo');
};

module.exports = {

    '/': {

        all: function (req, res) {
            res.locals('page', _.extend(res.locals.page, {
                bodyClass: 'homepage'
            }));
            res.render('home');
        }

    }


  , '/login': {

        get: todo

      , '/forgot': {

            get: todo

        }

    }

  , '/logout': {

        get: todo

    }

  , '/signup': {

        get: todo

    }



};