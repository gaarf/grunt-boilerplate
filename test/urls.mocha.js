/*jshint loopfunc:true */

var _ = require('underscore')
  , chai = require('chai').use(require('chai-http'))
  , expect = chai.expect
  , app = require('../app/server/boot.js').app
  , controllers = require('../app/server/controllers')
  , URLS = (function(){
/*

/
/login
/login/forgot
/logout
/signup


*/
  return _(arguments.callee.toString().split("\n"))
    .chain()
    .map(function(line){ return line.match(/^\/[^\*]/) && line; })
    .compact()
    .value();
})();


describe('URLs', function() {

  for (var i = 0; i < URLS.length; i++) {
    var s = URLS[i].split(" => ");
    it(
      s[0]
    , (function(done){
        var u = this;
        chai.request(app)
          .get(u[0].replace(/(\:\w+)/g, 'test'))
          .req(function(req) {
            req.redirects(0);
          })
          .res(function(res){
            if(u[1]) {
              expect(res).to.have.status(302);
              expect(res).to.have.header('location', u[1]);
            }
            else {
              expect(res).to.have.status(200);
              expect(res.text).to.include('body class="' + controllers.routeToBodyClass(u[0]));
            }
            done();
          });
      }).bind(s)
    );
  }

});



