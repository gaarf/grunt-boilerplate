var _ROOT = __dirname + '/../..'
  , config = require(_ROOT + '/etc/config.js')
  , controllers = require(__dirname + '/controllers')

  , express = require('express')
  , app = express()
  , hbs = require('express3-handlebars').create({
        extname: '.hbs'
      , defaultLayout: 'default'
      , helpers: require(__dirname + '/helpers.js')
      , layoutsDir: __dirname + '/templates/layouts'
      , partialsDir: __dirname + '/templates/partials'
    });

app.engine('.hbs', hbs.engine);

app.set('view engine', '.hbs');
app.set('views', __dirname + '/templates');

app.set('pkg', config.get('pkg')); // {{settings.pkg}}
app.set('title', config.get('title')); // {{settings.title}}

app.configure('development', function(){
    hbs.handlebars.logger.level = 0;
    app.use(express.logger('dev'));
});

app.configure('production', function(){
    app.use(express.logger());
    app.use(express.compress());
});

app.use(express.favicon());

app.use('/public/fonts', controllers.restrictFonts);
app.use('/public', express.static(_ROOT + '/public'));

app.use(express.query());
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({secret: config.get('sessions:secret')}));
app.use(express.csrf());

controllers.index(app);
app.use(app.router);

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.configure('test', 'production', function(){
    app.use(controllers.errorHandler);
});

app.use(function(req, res, next){
    var err = new Error('Not found');
    err.status = 404;
    controllers.errorHandler(err, req, res);
});



var server;

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
              "\n[%s] v%s listening on port %d in %s mode\n"
            , name
            , config.get('pkg:version')
            , port
            , app.settings.env
          );

          // PID file is used by livereload to detect server restart
          controllers.writePid(
            _ROOT + '/var/' + name + '_' + port + '.pid'
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
};

