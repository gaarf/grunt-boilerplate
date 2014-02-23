module.exports = function (grunt) {

  // load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  grunt.initConfig(grunt.file.readJSON('etc/grunt.json'));

  grunt.config.set('handlebars.client.options.processName', function(filePath) {
    return filePath.replace(/^app.+templates\/|\.hbs$/g, '');
  });

  grunt.config.set('pkg', grunt.file.readJSON('package.json'));

  ////////////////////////////////////////////////////////////////////////////////

  grunt.registerTask('test', 'same as `npm test`: runs mocha test harness', function(){
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

  // grunt.registerTask('deploy', function(t) {
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

  // grunt.registerTask('stage', [ "build:prod", "imagemin", "deploy:staging"]);

  grunt.registerTask('dev', [ "build:dev", "concurrent:dev"]);

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

  grunt.registerTask('build', function(t) {
    t = t || 'dev';
    grunt.task.run([ "clean", "generate:qunit", "generate:hbs:"+t, "generate:css:"+t, "generate:js:"+t ]);
  });

  grunt.registerTask('qunit', [ "generate:qunit", "generate:hbs", "mochaTest:client" ]);

  grunt.registerTask('default', [ "jshint", "build", "test" ]);

}
