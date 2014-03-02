var Bookshelf = require('bookshelf')
  , Checkit = require('checkit')
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

  var DB = Bookshelf.initialize({

    client: 'mysql'

  , connection: this.get('mysql') // nconf

  }).plugin(['registry', 'virtuals', 'visibility']);



  DB.ValidatingModel = DB.Model.extend({
    constructor: function() {
      DB.Model.apply(this, arguments);
      this.on('saving', this.validate, this);
    }
  , validations: {}
  , validate: function() { 
      return new Checkit(this.validations).run(this.toJSON());
    }
  });


  Bookshelf.DB = DB;


  fs.readdirSync(__dirname).forEach(function (file) {

      if( file.indexOf('.model.js') > 0 ) {
          require(__dirname + '/' + file);
      }

  });

  return Bookshelf.DB;
}
