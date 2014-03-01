var nconf = require('nconf')
  , _ = require('underscore')
  , pkg = require(__dirname + "/../package.json")
  , env = process.env.NODE_ENV;

/**
 * when running tests in OSX, we actually want to use dev settings
 */
if(!env || (env==='test' && process.platform==='darwin')) {
  env = 'development';
}

var IS_DEV = (env==='development');

module.exports = nconf

  .overrides({
    store: {
      "pkg": _.omit(pkg, 'main', 'scripts', 'dependencies', 'devDependencies')
    }
  })

  .argv()

  // .env({separator:'__'})

  .file('config', {
    file: __dirname + '/config.ini'
  , format: nconf.formats.ini
  })

  .file('config-env', {
    file: __dirname + '/config-' + env + '.ini'
  , format: nconf.formats.ini
  })

  .file('secrets', {
    file: __dirname + '/_secrets.ini'
  , format: nconf.formats.ini
  })

  .file('secrets-env', {
    file: __dirname + '/_secrets-' + env + '.ini'
  , format: nconf.formats.ini
  })

  .defaults({
    store: {

      "server": {
        "port": IS_DEV ? 3000 : 80
      }

    , "sessions": {
        "secret": IS_DEV && 's3cr3t'
      }

    , "title": pkg.name

    , "contact": {
        "mailto": (pkg.author && pkg.author.email) || 'nobody@localhost'
      }

    }

  });
