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

function SubviewContainer(self) {
  this.views = [];
  this.self = self;
  return this;
}
_.extend(SubviewContainer.prototype, {
  clear: function(){
    _.invoke(this.views, 'remove');
    this.views = [];
    this.stopListening();  
  }
, add: function(view) {
    if(!(view instanceof BaseView)) {
      throw new TypeError("invalid subview");
    }
    view._sub.parent = this.self;
    this.views.push(view);
    var that = this;
    view.on('all', function() {
      that.trigger.apply(that, _(arguments).push(this));
    });
  }
}, Backbone.Events)



var BaseView = Backbone.View.extend({

  constructor: function() {
    this._sub = new SubviewContainer(this);
    return Backbone.View.apply(this, arguments);
  }

  /**
   * attach a subview
   * @param  {BaseView} view
   * @return {BaseView} 
   */
, subview: function(view) {
    this._sub.add(view);
    return view;
  }

  /**
   * renders a view using the specified template
   * @param  {Object} optional context to use in addition to the model
   * @return {View}
   */
, render: function(ctxt) {
    if(this.template) {
      getTpl(this.template, _.bind(function(tpl){
        if(tpl) {
          ctxt = ctxt || {};
          if(this.model) {
            _.extend(ctxt, this.model.toJSON());
          }
          this.$el.html(
            _.isFunction(tpl) ? tpl(ctxt) : tpl.toString()
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

, empty: function() {
    this._sub.clear();
    this.$el.empty().removeClass();
    this.trigger('emptied');
  }

, remove: function() {
    this.empty();
    Backbone.View.prototype.remove.call(this);
  }

});

module.exports = {
    _: _
  , $: $
  , Backbone: Backbone
  , Handlebars: Handlebars

  , View: BaseView
};