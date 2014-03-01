var $ = require('jquery');

$(function () {

    var Page = require('./views/pages')[document.body.className]
      , flash = require('./lib/flashmsgs');


    setTimeout(function() {
      flash.info('I show up after 10 seconds.')
    }, 10 * 1000);


    if(Page) {
        (new Page()).render();
    }

});

