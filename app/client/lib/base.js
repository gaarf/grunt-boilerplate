var $ = require('jquery')
  , _ = require('underscore')
  , Backbone = require('backbone')
  , Handlebars = require('handlebars');

Backbone.$ = $;

function getJST(callback) {
  if(window.JST) {
    return callback();
  }
  console.log('fetching JST...');
  $.ajax({
    url: '/public/generated/templates.js'
  , dataType: "script"
  , cache: true
  , complete: callback
  , error: function(xhr, status, err) {
      throw err;
    }
  });
}

module.exports = {
    _: _
  , $: $
  , Backbone: Backbone
  , Handlebars: Handlebars
  , View: Backbone.View.extend({
      render: function(subs) {
        if(this.template) {
          getJST(_.bind(function(){
            var tpl = window.JST[this.template];
            if(tpl) {
              subs = subs || {};
              if(this.model) {
                _.extend(subs, this.model.toJSON());
              }
              this.$el.html(
                _.isFunction(tpl) ? tpl(subs) : tpl.toString()
              );
              this.trigger('rendered');
            }
            else {
              console.error('missing JST', this.template);
            }
          }, this));
        }
        return this;
      }

    , empty: function() {
        _.invoke(this._subviews || [], 'remove');
        this.$el.empty().removeClass();
        this.trigger('emptied');
      }

    , remove: function() {
        this.empty();
        Backbone.View.prototype.remove.call(this);
      }

    })
};