var $ = require('jquery')
  , $fixture = $( "#qunit-fixture" )
  , thing;

module('lib/base', {
    setup: function() { thing = require('../../app/client/lib/base'); }
  , teardown: function() { delete window.JST; }
});

test('Libraries', 5, function() { 
    equal(thing.$, $, 'jQuery is present');
    equal(thing._, require('underscore'), 'Underscore is present');
    equal(thing.Backbone.$, $, 'Backbone is hooked up to jQuery');
    equal(thing.Handlebars, require('handlebars'), 'Handlebars runtime is present');
    ok(!thing.Handlebars.compile, 'compile function is not present');
});


test('View', function() { 
    var view = new thing.View({className:'zomg-its-a-test'});

    ok(view instanceof thing.Backbone.View, 'instanceof Backbone.View');
    equal(typeof view.render, "function", 'has render() method');
    equal(typeof view.remove, "function", 'has remove() method');
    equal(typeof view.empty, "function", 'has empty() method');

    ok(!view.template, 'has no template property');

    view.render().$el.appendTo($fixture.empty());
    var $children = $fixture.children();

    equal($children.size(), 1, 'fixture contains one child');
    ok($children.is('div.zomg-its-a-test'), 'is div.zomg-its-a-test');

    view.remove();
    equal($fixture.children().size(), 0, 'fixture is now empty');
});



asyncTest('View with template', 6, function() { 
    var TestView = require('../../app/client/views/test')
      , view = new TestView();

    ok(!window.JST, 'JST properly torn-down');
    equal(view.template, 'test', 'template property is set');

    view.once('rendered', function() {
        start();

        ok(true, 'rendered event was triggered');
        equal(typeof window.JST.test, "function", 'template is in JST');

        ok(this.$el.text().indexOf('hello world')!=-1, 'text was rendered');

        this.empty();
        ok(!this.$el.text(), 'empty works');
    });

    view.render({foo: 'world'});
});



