module('Browserify');

test('CommonJS', function() { 
    ok(typeof window.require === "function", 'require is a function');
});


test('jQuery', function() { 
    var jQuery = require('jquery');
    equal(jQuery, window.$, 'same as window.$');

    var v = jQuery().jquery;
    ok(v, 'v'+v);
});


test('Underscore', function() {
    var v = require('underscore').VERSION;
    ok(v, 'v'+v);
});


test('Backbone', function() {
    var v = require('backbone').VERSION;
    ok(v, 'v'+v);
});



test('Handlebars', function() {
    var v = require('handlebars').VERSION;
    ok(v, 'v'+v);
});