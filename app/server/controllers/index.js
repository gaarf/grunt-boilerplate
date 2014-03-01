var fs = require('fs')
  , _ = require('underscore');

module.exports = {

    /**
     * loads all controller maps located in the current directory
     * @param  {Express} app
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

    /**
     * handle errors and present a pretty page
     * @param  {Error}      err
     * @param  {Request}    req
     * @param  {Response}   res
     * @param  {Function}   next
     */
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


    /**
     * write the PID of the process to a file
     * @param  {String} path to be written to
     */
  , writePid: function(path) {
      fs.writeFile(
        path
      , process.pid
      );
    }


    /**
     * trigger a 403 error if request referer does not match the host
     * @param  {Request}    req
     * @param  {Response}   res
     * @param  {Function}   next
     */
  , restrictFonts: function(req, res, next){
      if(7>(req.get('referer')||'').indexOf(req.get('host'))) {
        var err = new Error('Access to fonts is restricted!');
        err.status = 403;
        return next(err);
      }
      next();
    }

  , routeToBodyClass: routeToBodyClass
};


/**
 * converte a route (with slashes) to a CSS class (with dashes)
 * @param  {String} route
 * @return {String}
 */
function routeToBodyClass(route) {
    return route.replace(/^\/|\:|-/g,'').split('/').join('-').toLowerCase();
}


/**
 * higher-order function to generate a map() bound to the app
 * @param  {Express} app
 * @return {Function}
 */
function _getMap(app) {
    return function map(a, route){
        route = route || '';
        for (var key in a) {
          if(_.isArray(a[key]) || _.isFunction(a[key])) {
            app[key](route, [
                _pageDefaults.bind(route)
              , a[key]
              ]
            );
          }
          else {
            map(a[key], route + key);
          }
        }
    };
} 


/**
 * Set the response's default scripts, stylesheets, and bodyClass
 * @param  {Request}    req
 * @param  {Response}   res
 * @param  {Function}   next
 */
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


