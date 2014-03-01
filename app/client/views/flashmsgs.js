var base = require('../lib/base')
  , Backbone = base.Backbone
  , $ = base.$;


/**
 * view for the flash messages
 */

module.exports = base.View.extend({
    el: '#flashmsgs'

  , initialize: function() {
      this.$list = this.$('ul');
    }

  , info: function(msg) {
      console.info(msg);
      this.appendMessage('info', msg);
    }

  , error: function(msg) {
      console.error(msg);
      this.appendMessage('error', msg);
    }

  , appendMessage: function(className, msg) {
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
});


var MessageItem = base.View.extend({

  tagName: 'li'

});