var u = require('./_util.js')(__filename)
  , expect = u.chai.expect

  , fs = require('fs')
  , childProcess = require('child_process')
  , phantomjs = require('phantomjs')
  , QUNIT_PATH = '/test/qunit/';


describe('Client-side', function(){

    before(u.startServer);
    after(u.stopServer);

    describe('QUnit', function(){

      it('could be opened in a browser', function(done){

        u.agentRequest('GET '+QUNIT_PATH)
          .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
            done();
          });

      });


      var maybe = fs.existsSync(__dirname + '/../public/generated/qunit-tests.js')
                ? it
                : it.skip;


      maybe('no errors via PhantomJS', function(done){
        this.timeout(9999);

        var url = u.absoluteUrl(QUNIT_PATH);

        childProcess.execFile(
          phantomjs.path
        , [
            __dirname + '/qunit/_phantom.js'
          , url
          ]
        , function(err, stdout, stderr) {
            if(err) {
              err.expected = "No errors on " + url;
              err.actual = stdout;
            }
            done(err);
          }
        );


      });

    });


});