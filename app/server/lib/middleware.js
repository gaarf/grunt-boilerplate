var auth = require(__dirname + '/auth.js')

  , m = {

      setLocals: function (req, res, next) {
        res.locals({
            csrfToken: req.csrfToken.bind(req)
          , flashMessages: req.flash.bind(req)
        });
        next();
      }

    , renderContent: function (req, res) {
        res.render('content' + req.route.path);
      }


    , renderTodo: function (req, res) {
        res.render('todo');
      }


    }

  , base = [
      auth.passport.initialize()
    , auth.passport.session()

    , m.setLocals 

    ];


module.exports = {

    base: base

  , doContent: [base, m.renderContent]

  , doTodo: [base, m.renderTodo]


};
