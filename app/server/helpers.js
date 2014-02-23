var Handlebars = require('express3-handlebars').create().handlebars
  , config = require('../../etc/config.js')
  , _ = require('underscore');


module.exports = {


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

  , ifdev: function(options) {
      var env = process.env.NODE_ENV;
      if(!env || env === 'development') {
        return options.fn(this);
      }
      else {
        return options.inverse(this);
      }
    }

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

  , "for": function(from, to, incr, options) {
      if(!options) {
        options = incr;
        incr = 1;
      }
      var accum = ''
        , data = Handlebars.createFrame(options.data || {});
      for(var i = from; i <= to; i += incr) {
        data.index = i;
        accum += options.fn(this, {data: data});        
      }
      return accum;
    }

  , "add": function() {
      return _.chain(arguments).initial().reduce(function(memo, num) {
        return memo + parseInt(num, 10);
      }, 0).value().toString();
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

};

