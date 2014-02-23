var base = require('../lib/base')
  , $ = base.$
  , _ = base._;

module.exports = base.View.extend({
  template: 'test'

, className: 'pull-right text-right'

, initialize: function() {

    this.model = new base.Backbone.Model({
      timestamp: (new Date()).toLocaleTimeString()
    // , foo: 'world'
    });

  }

});

