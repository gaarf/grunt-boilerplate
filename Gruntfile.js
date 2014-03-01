module.exports = function (grunt) {

  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  grunt.initConfig(grunt.file.readJSON('etc/grunt.json'));

  grunt.config.set('handlebars.client.options.processName', function(filePath) {
    return filePath.replace(/^app.+templates\/|\.hbs$/g, '');
  });

  grunt.config.set('pkg', grunt.file.readJSON('package.json'));

  ////////////////////////////////////////////////////////////////////////////////

  grunt.registerTask('test', 'Same as `npm test`: runs mocha test harness.', function(){
    grunt.util.spawn({
          cmd: 'npm'
        , args: ['test']
        , opts: {
            stdio: 'inherit'
          }
        }
      , this.async()
    );
  });

  grunt.registerTask('migrate', 'Knex migrations', function(command, name) {
    var args = ['--config', 'etc/knexmigrate.js', 'migrate:'+command];
    if(command==='make') {
      args.push(name);
    }
    grunt.util.spawn({
          cmd: 'node_modules/.bin/knex'
        , args: args
        , opts: {
            stdio: 'inherit'
          }
        }
      , this.async()
    );
  });


  // grunt.registerTask('deploy', 'Delegates to `etc/deploy.sh` script.', function(t) {
  //   grunt.util.spawn({
  //         cmd: 'etc/deploy.sh'
  //       , args: [t || 'staging']
  //       , opts: {
  //           stdio: 'inherit'
  //         }
  //       }
  //     , this.async()
  //   );
  // });

  grunt.registerTask('redis', "Ensure Redis is running.", function() {
    var async = this.async();
    grunt.util.spawn({
          cmd: 'redis-cli'
        , args: ['ping']
        }
      , function(err) {
          if(!err) {
            return async();
          }
          grunt.util.spawn({
                cmd: 'redis-server'
              , args: [ '/usr/local/etc/redis.conf', '--daemonize yes' ]
              }
            , async
          );
        }
    );
  });


  grunt.registerTask('mysql', "Ensure MySQL is running.", function() {
    grunt.util.spawn({
          cmd: 'mysql.server'
        , args: ["start"]
        }
      , this.async()
    );
  });

  grunt.registerTask('db', [ "mysql", "redis", "migrate:latest" ]);

  grunt.registerTask('dev', [ "db", "build:dev", "concurrent:dev"]);

  grunt.registerTask('stage', [ "build:prod", "deploy:staging"]);

  grunt.registerTask('generate', function(s, t, o) {
    t = t || 'dev';
    switch(s) {
      case 'css':
        grunt.task.run([ "less:all", "autoprefixer:all" ]);
        if(t!=='dev') {
          grunt.task.run([ "cssmin:all" ]);
        }
      break;

      case 'js':
        grunt.task.run([ "browserify:client", "uglify:dev" ]);
        if(t!=='dev') {
          grunt.task.run([ "uglify:prod" ]);
        }
      break;

      case 'hbs':
        grunt.task.run([ "handlebars:client", "uglify:dev" ]);
        if(t!=='dev') {
          grunt.task.run([ "uglify:prod" ]);
        }
      break;

      case 'qunit':
        grunt.task.run([ "concat:qunit", "browserify:qunit" ]);
      break;
    }

    grunt.task.run([ "clean:tmp" ]);
  });

  grunt.registerTask('build', "Build all static assets.", function(t) {
    t = t || 'dev';
    grunt.task.run([ "clean", "generate:qunit", "generate:hbs:"+t, "generate:css:"+t, "generate:js:"+t ]);
  });

  grunt.registerTask('qunit', [ "db", "generate:qunit", "generate:hbs", "mochaTest:client" ]);

  grunt.registerTask('default', [ "db", "jshint", "build", "test" ]);

}
