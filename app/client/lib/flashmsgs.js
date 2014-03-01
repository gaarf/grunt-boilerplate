var base = require('./base')
  , $ = base.$;


/**
 * view for the flash messages
 */

module.exports = new (base.View.extend({
    el: '#flashmsgs'

  , initialize: function() {
      this.$list = this.$('ul');
      console.log('initialize', this);
    }

  , info: function(msg) {
      console.info(msg);
      this.append('info', msg);
    }

  , error: function(msg) {
      console.error(msg);
      this.append('error', msg);
    }

  , append: function(className, msg) {
      var item = this.subview(new MessageItem());
      item.$el
        .addClass(msg ? className : 'info')
        .text(msg || className);
      this.$list
        .append( item.$el )
        .show();
      this.$el.show();
    }

  , events: {

      'click li': function(e) {
        e.preventDefault();
        $(e.currentTarget).slideUp('fast');
      }


    }
}));


var MessageItem = base.View.extend({

  tagName: 'li'

});