/*jshint loopfunc:true */

var u = require('./_util.js')(__filename)
  , expect = u.chai.expect
  , app = u.boot.app;

var _ = require('underscore')
  , controllers = require('../app/server/controllers')
  , URLS = (function(){
/*

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

  before(u.startServer);
  // before(u.agentInit);
  after(u.stopServer);

  for (var i = 0; i < URLS.length; i++) {
    var s = URLS[i].split(" => ");
    it(
      s[0]
    , (function(done){
        var url = this;

        u.agentRequest('GET '+url[0].replace(/(\:\w+)/g, 'test'))
          .redirects(0)
          .end(function(err, res) {
            if(url[1]) {
              expect(res).to.have.status(302);
              expect(res).to.have.header('location', url[1]);
            }
            else {
              expect(res).to.have.status(200);
              expect(res.text).to.include('body class="' + controllers.routeToBodyClass(url[0]));
            }
            done();
          });

      }).bind(s)
    );
  }

});


describe('errors', function(){

  before(u.startServer);
  after(u.stopServer);

  var calls = {

      '/error': function() {
          expect(this).to.have.status(404);
        }

    , '/error/404': function() {
          expect(this).to.have.status(404);
        }

    , '/error/403': function() {
          expect(this).to.have.status(403);
        }

    , '/error/500': function() {
          expect(this).to.have.status(500);
          expect(this.text).to.include('keyboard cat!');
        }

  };

  function doCall(done){
    var that = this;

    u.agentRequest('GET '+that.url)
      .set('accept', that.accept)
      .end(function (err, res) {
        calls[that.url].call(res);
        that.cb.call(res);
        done();
      });
  }

  describe('as text', function() {

    for (var k in calls) {
      it(k, doCall.bind({
        url: k
      , accept: 'text/plain'
      , cb: function() {
          expect(this).to.be.text;
        }
      }));
    }

  });

  describe('as JSON', function() {

    for (var k in calls) {
      it(k, doCall.bind({
        url: k
      , accept: 'application/json'
      , cb: function() {
          expect(this).to.be.json;
        }
      }));
    }

  });


  describe('as html', function() {

    for (var k in calls) {
      it(k, doCall.bind({
        url: k
      , accept: 'text/html'
      , cb: function() {
          expect(this).to.be.html;
        }
      }));
    }


  });

});


