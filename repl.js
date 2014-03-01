var repl = require("repl")
  , boot = require(__dirname + '/app/server/boot.js')
  , name = boot.config.get('pkg:name');


console.log(
  "\n\x1B[7m %s \x1B[27m v%s REPL in \x1B[1m%s mode\x1B[22m\n"
, name
, boot.config.get('pkg:version')
, boot.app.settings.env
);

var context = repl.start("\n▶ ").context;

context.boot = boot;

context.logargs = function() { console.log(arguments) };
