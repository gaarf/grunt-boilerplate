/*jshint loopfunc:true */

var chai = require('chai').use(require('chai-http'))
  , expect = chai.expect
  , app = require('../app/server/boot.js').app;

describe('HTTP', function(){

  it('responds OK to home', function(done){

    chai.request(app)
      .get('/')
      .res(function (res) {

        expect(res).to.have.status(200);
        expect(res).to.be.html;

        done();
      });

  });


  describe('does errors', function(){

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



});


describe('Sessions', function() {
  var testString = Date.now() + 'testing';

  before(function() {
    app.get('/'+testString, function(req, res, next) {
      if(req.param('setSession')) {
        req.session.test = testString;
      }
      res.json({session:req.session});
    });
  });

  it('(control)', function(done){

    chai.request(app)
      .get('/'+testString)
      .res(function(res) {
        expect(res.body.session).to.be.an('object');
        expect(res.body.session.test).to.be.undefined;
        done();
      });

  });

  it('persist accross requests', function(done){
    
    chai.request(app)
      .get('/'+testString + '?setSession=1')
      .res(function(res1) {
        expect(res1.body.session).to.be.an('object');
        expect(res1.body.session.test).to.equal(testString);

        chai.request(app)
          .get('/'+testString)
          .req(function(req2) {
            setCookie(req2, res1);
          })
          .res(function(res2) {
            expect(res2.body.session).to.be.an('object');
            expect(res2.body.session.test).to.equal(testString);
            done();
          });

      });

  });

});


describe('CSRF', function() {

  it('cannot plainly post to home', function(done){

    chai.request(app)
      .post('/')
      .res(function(res) {
        expect(res).to.have.status(403);
        done();
      });

  });

  it('can post with token', function(done){
    
    chai.request(app)
      .get('/')
      .res(function(res1) {
        expect(res1).to.have.status(200);
        expect(res1).to.be.html;

        var token = res1.text.match(/<meta name="csrf-token" content="([^"]+)"/)[1];
        expect(token).to.be.ok;

        chai.request(app)
          .post('/')
          .req(function(req2) {
            setCookie(req2, res1);
            req2.set('X-CSRF-Token', token);
          })
          .res(function(res2) {
            expect(res2).to.have.status(200);
            done();
          });

      });

  });

});



function setCookie(req, res) {
  req.set('cookie', res.get('set-cookie')[0].split('; ')[0]);
}
