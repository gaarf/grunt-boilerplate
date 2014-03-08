var chai = require('chai').use(require('chai-http'))
  , harbor = require('harbor')(2222,2999)
  , superagent = require('superagent')

  , boot = require('../app/server/boot.js')
  , server = require('http').createServer(boot.app);


module.exports = function(namespace) {
  namespace = namespace || module.parent.filename;

  var scopeToken
    , scopeAgent;

  function agentRequest(def) {
    var b = def.split(' ')
      , url = absoluteUrl(b[1])
      , method = b[0].toLowerCase()
      , agent = scopeAgent || new superagent.agent(server);
    return agent[method](url).set('X-CSRF-Token', scopeToken);
  }


  function absoluteUrl(path) {
    var a = server.address();
    return 'http://' + a.address + ':' + a.port + path;
  }



  return {
    chai: chai
  , superagent: superagent

  , boot: boot

  , server: server
  , absoluteUrl: absoluteUrl
  , agentRequest: agentRequest

  , agentInit: function(done) {
      scopeAgent = new superagent.agent(server);
      agentRequest('GET /')
        .end(function(err, res) {
          scopeToken = res.text.match(/<meta name="csrf-token" content="([^"]+)"/)[1];
          done();
        });
    }


  , startServer: function(done) {
      harbor.claim(namespace, function(err, port) {
        server.listen(port, done);
      });
    }

  , stopServer: function(done) {
      harbor.release(namespace);

      scopeToken = null;
      scopeAgent = null;

      server.close(done);
    }

  }
}
