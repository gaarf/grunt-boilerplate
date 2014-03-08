/*jshint loopfunc:true */

var u = require('./_util.js')(__filename)
  , expect = u.chai.expect
  , app = u.boot.app;

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

  before(u.startServer);
  after(u.stopServer);

  it('(control)', function(done){
    u.agentRequest('GET /'+testString)
      .end(function(err, res) {
        expect(res.body.session).to.be.an('object');
        expect(res.body.session.test).to.be.undefined;
        done();
      });
  });

  describe('persist', function(){
    before(u.agentInit);

    it('accross requests', function(done){

      u.agentRequest('GET /'+testString + '?setSession=1')
        .end(function(err1, res1) {
          expect(res1.body.session).to.be.an('object');
          expect(res1.body.session.test).to.equal(testString);


          u.agentRequest('GET /'+testString)
            .end(function(err2, res2) {
              expect(res2.body.session).to.be.an('object');
              expect(res2.body.session.test).to.equal(testString);
              done();
            });

        });
    });

  });

});


describe('CSRF', function() {

  before(u.startServer);
  after(u.stopServer);

  it('cannot plainly post to home', function(done){

    u.agentRequest('POST /')
      .end(function(err, res) {
        expect(res).to.have.status(403);
        done();
      });

  });


  describe('agentInit', function(done){
    before(u.agentInit);


    it('injects token', function(done){

      u.agentRequest('POST /')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        });

    });

  });

});


