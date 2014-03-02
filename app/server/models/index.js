var Bookshelf = require('bookshelf')
  , fs = require('fs');

/**
 * get a Bookshelf instance, initialized and with
 *   all models in current directory loaded in the registry
 *
 * @this {config} nconf
 * @return {Bookshelf}
 */
module.exports = function() {

  if(Bookshelf.DB) {
    return Bookshelf.DB;
  }

  Bookshelf.DB = Bookshelf.initialize({

    client: 'mysql'

  , connection: this.get('mysql') // nconf

  }).plugin(['registry', 'virtuals', 'visibility']);


  fs.readdirSync(__dirname).forEach(function (file) {

      if( file.indexOf('.model.js') > 0 ) {
          require(__dirname + '/' + file);
      }

  });

  return Bookshelf.DB;
}
