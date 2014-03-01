var Bookshelf = require('bookshelf').DB;


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

var User = Bookshelf.Model.extend({

  tableName: 'users'

, hasTimestamps: true

, hidden: ['password']

, virtuals: {

    /**
     * @attribute full_name
     */
    "full_name": {
      get: function () {
          return this.get('first_name') + ' ' + this.get('last_name');
      }
    , set: function(value) {
          value = value.split(' ');
          this.set('first_name', value[0]);
          this.set('last_name', value[1]);
      }
    }

  }


});




module.exports = Bookshelf.model('User', User);
