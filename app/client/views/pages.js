var base = require('../lib/base')
  , flash = require('../lib/flashmsgs')
  , Page = base.View.extend({
        el: 'main'
    });


var TestView = require('./test');

module.exports = {

    'homepage': Page.extend({

      events: {
        'click section.hero button': function(e) {
          $(e.currentTarget).attr('disabled', true);

          var $hero = this.$('.hero');

          console.log(__filename, $hero);

          (new TestView())
            .on('rendered', function() {
              this.$el
                .hide()
                .prependTo($hero)
                .fadeIn();
            })
            .render() // triggers fetching of client side templates
        }
  
      , 'click .flash-me-an-error': function(e) {
          e.preventDefault();
          flash.error('oh noes! this is an error flash message.')
        }
  
      }
    })


};


