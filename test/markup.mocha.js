/*jshint loopfunc:true */

var tidy = require('htmltidy').tidy
  , fs = require('fs')
  , _ = require('underscore')

  , FILES = require('glob').sync("app/*/templates/**/*.hbs")

  , IGNORES = [
      'Warning: trimming empty <i>'
    // , "Warning: plain text isn't allowed in <tbody> elements"
    // , "Info: <tbody> previously mentioned"
    // , 'Warning: <img> lacks "alt" attribute'
    ];

describe('Markup', function(){

    describe('is tidy', function(){


        for (var i = 0; i < FILES.length; i++) {
            it(
                FILES[i]
              , (function(done){
                    var file = FILES[this];
                    fs.readFile(file, function(err, data) {
                        data = data.toString();

                        var doctype = '<!DOCTYPE html>';
                        if(data.indexOf(doctype)!==0) {
                            data = doctype + "<html><head><title></title></head><body>" 
                                + data + "</body></html>";
                        }

                        tidy(
                            data.replace(/{{[#\/][^}]+}}/g, '') // remove block mustaches, keep their content
                          , { showWarnings: true, quiet: true }
                          , function(result) {
                                var errors = _.chain(result.split("\n")).compact().filter(function(msg) {
                                    return !_.find(IGNORES, function(ignore) {
                                        return msg.indexOf(ignore) !== -1;
                                    });
                                }).value();

                                if(errors.length) {
                                    var ex = new Error(file);
                                    ex.expected = "";
                                    ex.actual = errors.join("\n");
                                    done(ex);
                                }
                                else {
                                    done();
                                }
                            }
                        );
                    });

                }).bind(i)
            );
        }


    });



});

