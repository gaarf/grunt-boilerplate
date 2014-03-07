var base = require('../lib/base')
  , flash = require('../lib/flashmsgs')
  , Page = base.View.extend({
        el: 'main'
    });


var TestView = require('./test');

module.exports = {

    'homepage': Page.extend({


      insertTestView: function() {

        // make a new view, linked to this one
        var s = this.subview(new TestView())
         , $hero = this.$('.hero');

        console.log(__filename, $hero);

        // decide how it will be inserted
        s.on('rendered', function() {
          this.$el
            .hide()
            .prependTo($hero)
            .fadeIn();
        });

        s.render(); // triggers fetching of client side templates
      }



    , events: {
        'click section.hero button': function(e) {
          this.$(e.currentTarget).attr('disabled', true);
          this.insertTestView();
        }
  
      , 'click .flash-me-an-error': function(e) {
          e.preventDefault();
          flash.error('oh noes! this is an error flash message.')
        }
  
      }
    })


};


