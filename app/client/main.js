var $ = require('jquery')
  , Page = require('./views/pages')[document.body.className];

$(function () {

    if(Page) {
        (new Page()).render();
    }

});

