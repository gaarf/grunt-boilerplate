module.exports = {
    '/error': {
        '/403': {
            'all': function(req, res, next) {
                var err = new Error('not allowed!');
                err.status = 403;
                next(err);
            }
        }
      , '/404': {
            'all': function(req, res, next) {
               next();
            }
        }
      , '/500': {
            'all': function(req, res, next) {
               next(new Error('keyboard cat!'));
            }
        }

    }
};


