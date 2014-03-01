var $ = require('jquery')
  , Flashmsgs = require('./views/flashmsgs')
  , Page = require('./views/pages')[document.body.className];

$(function () {

    window.flash = (new Flashmsgs()).render();

    if(Page) {
        (new Page()).render();
    }

});

