module('Browserify');

test('CommonJS', function() { 
    ok(typeof window.require === "function", 'require is a global function');

    propEqual(exports, {}, 'not exporting anything');

    var qunit = require('qunitjs');
    equal(module, qunit.module, 'in this context, module is from qunit');
    equal(equal, qunit.equal, 'inception');
});


test('Libraries', function() { 
    var jQuery = require('jquery');
    equal(jQuery, window.$, 'same as window.$');

    var v = jQuery().jquery;
    ok(v, 'v'+v);


    var libs = ['underscore','backbone','handlebars'];

    for (var i = 0; i < libs.length; i++) {
        v = require(libs[i]).VERSION;
        ok(v, libs[i]+' v'+v);
    }

});
