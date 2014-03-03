var DB = require('bookshelf').DB
  , Promise = require('bluebird')
  , bcrypt = Promise.promisifyAll(require('bcrypt'))
  , SALT_ROUNDS = 7;

/**
 * User
 *
 * @field id
 * @field created_at
 * @field updated_at
 * @field email (unique, index)
 * @field password
 * @field first_name
 * @field last_name
 */

var User = DB.ValidatingModel.extend({

  tableName: 'users'

, hasTimestamps: true

, hidden: ['password']

, validations: {
    email: ['required','email']
  , first_name: ['required']
  }

, initialize: function() {
    this.on('change', function(model, options) {
      var pwd = model.changed.password;
      if(pwd) {
        try {
          bcrypt.getRounds(pwd); // throws if pwd is not hashed
        }
        catch(e) {
          model.set('password', bcrypt.hashSync(pwd, SALT_ROUNDS));
        }
      }
    });
  }


, setPassword: function(pwd) {
    return bcrypt.hashAsync(pwd, SALT_ROUNDS).bind(this).then(function(hash) {
      this.set('password', hash);
    });
  }

, checkPassword: function(pwd) {
    return bcrypt.compareAsync(pwd, this.get('password'));
  }

, virtuals: {

    /**
     * @attribute full_name
     */
    "full_name": {
      get: function () {
        var last = this.get('last_name');
        return this.get('first_name') + (last ? ' '+last : '');
      }
    , set: function(value) {
        value = value.split(' ');
        this.set('first_name', value[0]);
        this.set('last_name', value[1]);
      }
    }

  }


});




module.exports = DB.model('User', User);
