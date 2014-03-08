/**
 * boot the app!
 */

var PROJECT_ROOT = require('path').normalize(__dirname + '/../..')
  , config = require(PROJECT_ROOT + '/etc/config.js')

  , express = require('express')
  , app = express()

  , controllers = require(__dirname + '/controllers')
  , DB = require(__dirname + '/models').call(config)

  , hbs = require(__dirname + '/lib/hbs.js');


/**
 * Handlebars templating
 */
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('views', __dirname + '/templates');


/**
 * global app settings
 */
app.set('pkg', config.get('pkg')); // {{settings.pkg}}
app.set('title', config.get('title')); // {{settings.title}}


/**
 * start building the middleware stack
 */
app.configure('development', function(){
    hbs.handlebars.logger.level = 0;
    app.use(express.logger('dev'));
});

app.configure('staging', 'production', function(){
    app.use(express.logger());
    app.use(express.compress());
});


/**
 * static assets
 */
app.use(express.favicon());
app.use('/public/fonts', controllers.restrictFonts);
app.use('/public', express.static(PROJECT_ROOT + '/public', { maxAge: 60 * 60 * 1000 }));


/**
 * request parsing
 */
app.use(express.query());
app.use(express.urlencoded());
app.use(express.json());
app.use(express.cookieParser());


/**
 * sessions
 */
var RedisStore = require('connect-redis')(express);
app.use(express.session({
  secret: config.get('sessions:secret')
// , store: (new RedisStore(config.get('redis'))).on('disconnect', function() {
//     throw new Error('Redis disconnected!');
//   })
}));

/**
 * flash messages & more middleware
 */
app.use(require('connect-flash')());
app.use(express.methodOverride());
app.use(express.csrf());


/**
 * the meat of the app routing
 */
controllers.index(app);
app.use(app.router);


/**
 * finally, error handling
 */
app.configure('development', function(){
    app.use(express.errorHandler());
});

app.configure('test', 'staging', 'production', function(){
    app.use(controllers.errorHandler);
});

app.use(function(req, res, next){
    var err = new Error('Not found');
    err.status = 404;
    controllers.errorHandler(err, req, res);
});




var server;

/**
 * a function to actually start the HTTP server
 * @return {net.Server}
 */
function up() {
    if(!server) {

      process.on('uncaughtException', function (exception) {
          // danger! see https://github.com/joyent/node/issues/2582
          console.error("\nuncaughtException", exception);
          console.log(exception.stack);
          process.exit(1);
      });

      var port = config.get('server:port')
        , name = config.get('pkg:name');

      server = app.listen(port, function() {
          console.log(
              "\n\x1B[7m %s \x1B[27m v%s Server listening on port %d in \x1B[1m%s mode\x1B[22m\n"
            , name
            , config.get('pkg:version')
            , port
            , app.settings.env
          );

          // PID file is used by livereload to detect server restart
          controllers.writePid(
            PROJECT_ROOT + '/var/' + name + '_' + port + '.pid'
          );
      });
    }
    return server;
}

if(!module.parent) {
    up();
}

module.exports = {
    up: up
  , app: app
  , config: config
  , DB: DB
};

