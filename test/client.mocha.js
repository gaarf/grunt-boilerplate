var chai = require('chai').use(require('chai-http'))
  , expect = chai.expect
  , harbor = require('harbor')(2222,2999)
  , http = require('http')
  , fs = require('fs')
  , app = require('../app/server/boot.js').app

  , childProcess = require('child_process')
  , phantomjs = require('phantomjs')
  , qunitPath = '/test/qunit/';


describe('Client-side', function(){

    var server = http.createServer(app);

    before(function(done) {
      harbor.claim(__filename, function(err, port) {
        server.listen(port, done);
      });
    });

    after(function(done) {
      harbor.release(__filename);
      server.close(done);
    });


    describe('QUnit', function(){

      it('could be opened in a browser', function(done){

        chai.request(server)
          .get(qunitPath)
          .res(function (res) {

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

        var a = server.address()
          , url = 'http://' + a.address + ':' + a.port + qunitPath;

        childProcess.execFile(
          phantomjs.path
        , [
            __dirname + '/../node_modules/phantomjs/lib/phantom/examples/run-qunit.js'
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