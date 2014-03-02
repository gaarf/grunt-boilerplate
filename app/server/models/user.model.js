var DB = require('bookshelf').DB;


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
    email: ['required', 'email']
  , first_name: ['required']
  }

, virtuals: {

    /**
     * @attribute full_name
     */
    "full_name": {
      get: function () {
        var last = this.get('last_name');
        return this.get('first_name') + (last ? ' ' + last : '');
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
