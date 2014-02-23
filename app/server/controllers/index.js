var fs = require('fs');

module.exports = {
    /**
     * loads all controller maps located in the directory, and sets default page locals
     */
    index: function (app) {

        var map = _getMap(app);

        fs.readdirSync(__dirname).forEach(function (file) {

            if( file.indexOf('.controller.js') > 0 ) {
                map( require(__dirname + '/' + file) );
            }

        });

        app.configure('test', 'development', function(){
            app.get('/test/qunit', function(req, res, next){
                res.render('home', {layout:'qunit'});
            });
        });

    }

  , errorHandler: function (err, req, res, next) {
        if (process.env.NODE_ENV != 'test') { console.error(err.stack); }
        if (err.status) { res.statusCode = err.status; }
        if (res.statusCode < 400) { res.statusCode = 500; }
        var accept = req.headers.accept || ''
          , error = { message: err.message, status: res.statusCode };
        // html
        if (~accept.indexOf('html')) {
            _pageDefaults.call('error error'+res.statusCode, req, res, function(){
                res.render('error', { error: error});
            });
        // json
        } else if (~accept.indexOf('json')) {
            res.json({ error: error });
        // plain text
        } else {
            res.type('text').end(err.message);
        }
    }

  , routeToBodyClass: routeToBodyClass


  , writePid: function(path) {
      fs.writeFile(
        path
      , process.pid
      );
    }

  , restrictFonts: function(req, res, next){
      if(7>(req.get('referer')||'').indexOf(req.get('host'))) {
        var err = new Error('Access to fonts is restricted!');
        err.status = 403;
        return next(err);
      }
      next();
    }
};


function routeToBodyClass(route) {
    return route.replace(/^\/|\:|-/g,'').split('/').join('-').toLowerCase();
}


function _getMap(app) {
    return function map(a, route){
        route = route || '';
        for (var key in a) {
            switch (typeof a[key]) {
                case 'object':
                    map(a[key], route + key);
                    break;
                case 'function':
                    app[key](route, [
                        _pageDefaults.bind(route)
                      , a[key]
                      ]
                    );
                    break;
            }
        }
    };
} 

function _pageDefaults(req, res, next){
    res.locals({
        page: {
          scripts: ['main']
        , stylesheets: ['base', 'main']
        , bodyClass: routeToBodyClass(this)
        }
    });
    next();
}


