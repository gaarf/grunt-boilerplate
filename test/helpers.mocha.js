var expect = require('chai').expect
  , _ = require('underscore');

var HandlebarHelpers = require('../app/server/helpers.js')
  , Handlebars = require('express3-handlebars').create().handlebars;

_.each(HandlebarHelpers, function(fn, name) {
  Handlebars.registerHelper(name, fn);
});

describe('Handlebars Helpers', function(){

  describe('{{#repeat}}', function(){


      it('{{#repeat 2}} repeats the content', function(){
        expect(
          Handlebars.compile('{{#repeat 2}}test{{/repeat}}')()
        ).to.equal('test\ntest');
      });

      it('{{#repeat 1}} outputs the content only once', function(){
        expect(
          Handlebars.compile('{{#repeat 1}}test{{/repeat}}')()
        ).to.equal('test');
      });

      it('{{#repeat 0}} outputs no content', function(){
        expect(
          Handlebars.compile('{{#repeat 0}}test{{/repeat}}')()
        ).to.equal('');
      });


      it('{{#repeat 2 "-"}} repeats the content without whitespace', function(){
        expect(
          Handlebars.compile('{{#repeat 2 "-"}}test{{/repeat}}')()
        ).to.equal('test-test');
      });

      it('{{#repeat}} doesnt crash', function(){
        expect(
          Handlebars.compile('{{#repeat}}test{{/repeat}}')()
        ).to.equal('');
      });

  });


  describe('{{#for}}', function(){


      it('by default increment = 1', function(){
        expect(
          Handlebars.compile('{{#for 0 2}}test{{/for}}')()
        ).to.equal('test\ntest\ntest\n');
      });

      it('can specify increment', function(){
        expect(
          Handlebars.compile('{{#for 0 3 2}}test{{/for}}')()
        ).to.equal('test\ntest\n');
      });

      it('subs and @index private var is present', function(){
        expect(
          Handlebars.compile('{{#for 0 2}}{{foo}}{{@index}}{{/for}}')({foo:'bar'})
        ).to.equal('bar0\nbar1\nbar2\n');
      });

  });


  describe('{{add}}', function(){

      it('sums up the arguments', function(){
        expect(Handlebars.compile('{{add 1 2}}')()).to.equal("3");
      });

      it('supports negative number', function(){
        expect(Handlebars.compile('{{add 0 -5}}')()).to.equal("-5");
      });

      it('can parse to integer', function(){
        expect(Handlebars.compile('{{add "1.foo" 9}}')()).to.equal("10");
      });

      it('can generate NaN', function(){
        expect(Handlebars.compile('{{add null}}')()).to.equal("NaN");
      });
  });

  describe('{{#block}} & {{#contentFor}}', function(){


      it('{{#block}} is commented out for now', function(){
        expect(HandlebarHelpers.block).to.be.undefined;
      });

      it('{{#contentFor}} is commented out for now', function(){
        expect(HandlebarHelpers.contentFor).to.not.exist; // null or undefined
      });

  });

  describe('{{#mailtolink}}', function(){


      it('does mangling', function(){
        var email = 'spambot@protect.com'
          , tpl = Handlebars.compile("{{#mailtolink '"+email+"'}}contact{{/mailtolink}}")();
        expect(tpl).to.not.include('mailto:');
        expect(tpl).to.not.include(email);
        expect(tpl).to.include('contact');
      });

  });


});