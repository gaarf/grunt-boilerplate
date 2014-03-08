var PROJECT_ROOT = require('path').normalize(__dirname + '/../../..');

var _ = require('underscore')
  , config = require(PROJECT_ROOT + '/etc/config.js')
  , ex3hbs = require('express3-handlebars')
  , Handlebars = ex3hbs.create().handlebars;


module.exports = ex3hbs.create({
    extname: '.hbs'
  , defaultLayout: 'default'
  , layoutsDir: PROJECT_ROOT + '/app/server/templates/layouts'
  , partialsDir: PROJECT_ROOT + '/app/server/templates/partials'
  , helpers: {


      /**
       * {{debug [optionalValue]}} prints context in the log
       * @param  {*} optionalValue to specifically log
       */
      debug: function(optionalValue) {
        console.log("Current Context");
        console.log("====================");
        console.log(this);
       
        if (optionalValue) {
          console.log("Value");
          console.log("====================");
          console.log(optionalValue);
        }
      }



      /**
       * {{#ifdev}} show the block in development environment
       */
    , ifdev: function(options) {
        var env = process.env.NODE_ENV;
        if(!env || env === 'development') {
          return options.fn(this);
        }
        else {
          return options.inverse(this);
        }
      }




      /**
       * {{#mailtoling [email]}} prints out a mailto: link with spam-bot countermeasures
       * @param  {String} email address to use instead of the default
       */
    , mailtolink: function(email, options) {
        if(!options) {
          options = email;
          email = config.get('contact:mailto');
        }
        var content = options.fn(this)
          , aChars = email.split('').reverse()
          , aBidi = aChars.join('').split('@')
          , sRtl = '<span style="unicode-bidi: bidi-override; direction: rtl;">'
          , out = "<scr" + "ipt>"+ "document.write('<a rel=\"nofollow\" hr' + 'ef=\"mail' + 'to:'";
        out += "+ " +  JSON.stringify(aChars) + ".reverse().join('') + '\">'";
        out += "+ \"" + content.replace(/"/g, '\\"') + "</a>\");</scr" + "ipt>";
        out += "<noscript>" + content + " (" + sRtl + aBidi[1] + "</span>[at]";
        out += sRtl + aBidi[0] + "</span>)</noscript>";
        return out;
      }




      /**
       * {{#repeat qty [separator]}} repeat the block
       * @param  {[type]} qty number of repeats
       * @param  {[type]} separator default to newline
       */
    , repeat: function(qty, separator, options) {
        if(typeof qty != 'number' || qty < 1) {
          return '';
        }
        if(!options) {
          options = separator;
          separator = "\n";
        } 
        var result = ''
          , str = options.fn(this) + separator;
        while (qty > 0) {
          if (qty & 1) {
            result += str;
          }
          qty >>= 1, str += str;
        }
        return result.slice(0, -separator.length);
      }



      /**
       * {{#for from to [incr]}} for loop, with @index private var
       * @param  {Number} from
       * @param  {Number} to
       * @param  {Number} incr defaults to 1
       */
    , "for": function(from, to, incr, options) {
        var accum = '', data;
        if(!options) {
          options = incr;
          incr = 1;
        }
        data = Handlebars.createFrame(options.data || {});
        for(var i = from; i <= to; i += incr) {
          data.index = i;
          accum += options.fn(this, {data: data}) + "\n";        
        }
        return accum;
      }




      /**
       * {add x y z} sums up the arguments
       * @param {Number} * 
       * @return {Number}
       */
    , "add": function() {
        return _.chain(arguments).initial().reduce(function(memo, num) {
          return memo + parseInt(num, 10);
        }, 0).value().toString();
      }


      /**
       * {json something} pretty-print json
       * @param {Mixed} * 
       * @return {String}
       */
    , "json": function() {
        return new Handlebars.SafeString(_.chain(arguments).initial().reduce(function(memo, obj) {
          return memo + '<pre>' + JSON.stringify(obj, null, '\t') + '</pre>';
        }, '').value().toString());
      }


      /**
       * {deflist something} definition list
       * @param {Mixed} * 
       * @return {String}
       */
    , "deflist": function() {
        return new Handlebars.SafeString(_.chain(arguments).initial().reduce(function(memo, obj) {
          return memo + "<dl>\n" + _.chain(obj).keys().sort().map(function(key){
            return "<dt>"+key+"</dt>\n<dd>"+obj[key]+"</dd>";
          }).value().join("\n") + "\n</dl>\n";
        }, '').value().toString());
      }


      // , block: function(name){
      //     var blocks = this._blocks
      //       , content = blocks && blocks[name];
      //     return content ? content.join('\n') : null;
      //   }

      // , contentFor: function(name, options){
      //     var blocks = this._blocks || (this._blocks = {})
      //       , block = blocks[name] || (blocks[name] = []);
      //     block.push(options.fn(this));
      //   }


    }
});

