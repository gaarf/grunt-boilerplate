var nconf = require('nconf')
  , pkg = require(__dirname + "/../package.json")
  , NODE_ENV = process.env.NODE_ENV
  , IS_PROD = NODE_ENV==='production';


module.exports = nconf

  .overrides({
    store: {
      "pkg": pkg
    }
  })

  .argv()

  // .env({separator:'__'})

  .file('secrets-env', {
    file: __dirname + '/_secrets-' + NODE_ENV + '.ini'
  , format: nconf.formats.ini
  })

  .file('secrets', {
    file: __dirname + '/_secrets.ini'
  , format: nconf.formats.ini
  })

  .file('config', {
    file: __dirname + '/config.ini'
  , format: nconf.formats.ini
  })

  .defaults({
    store: {

      "server": {
        "port": IS_PROD ? 80 : 3000
      }

    , "sessions": {
        "secret": !IS_PROD && 's3cr3t'
      }

    , "title": pkg.name

    , "contact": {
        "mailto": (pkg.author && pkg.author.email) || 'nobody@localhost'
      }

    }

  });