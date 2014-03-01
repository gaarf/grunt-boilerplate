var $ = require('jquery')
  , _ = require('underscore')
  , Backbone = require('backbone')
  , Handlebars = require('handlebars');

Backbone.$ = $;


/**
 * fetches client-side templates if needed
 * @param  {Function} callback
 */
function getTpl(template, callback) {
  if(_.isFunction(template)) {
    return callback(template);
  }
  var complete = function() {
    callback(window.JST[template]);
  }
  if(window.JST) {
    return complete();
  }
  console.log('fetching JST...');
  $.ajax({
    url: '/public/generated/templates.js'
  , dataType: "script"
  , cache: true
  , complete: complete
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

      subview: function(view) {
        this._subviews = this._subviews || [];
        this._subviews.push(view);
        return view;
      }

      /**
       * renders a view using the specified template
       * @param  {Object} optional context to use in addition to the model
       * @return {View}
       */
    , render: function(subs) {
        if(this.template) {
          getTpl(this.template, _.bind(function(tpl){
            if(tpl) {
              console.log(tpl);
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
              console.error('missing template', this.template);
            }
          }, this));
        }
        return this;
      }

      /**
       * remove all subviews
       */
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