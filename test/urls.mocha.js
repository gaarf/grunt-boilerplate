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


describe('errors', function(){

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
    chai.request(app)
      .get(that.url)
      .req(function (req) {
          req.set('accept', that.accept);
        })
      .res(function(res){
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


