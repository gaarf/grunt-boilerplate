var $ = require('jquery');

$(function () {

    var Page = require('./views/pages')[document.body.className];
    
    // this is just set on window so u can play with it in the console
    window.FLASHMSGS = require('./lib/flashmsgs');

    setTimeout(function() {
      FLASHMSGS.info('I show up after 10 seconds.')
    }, 10 * 1000);


    if(Page) {
        // same here, explore with the console!
        window.PAGE = (new Page()).render();
    }

});

