/*
fillcalc v0.0.1 - (c) Robert Weber, freely distributable under the terms of the MIT license.
*/

(function(win, doc){

  'use strict';

  // We need document.querySelectorAll as we do not want depend on any lib
  if(!doc.querySelectorAll) {
    return;
  }
  
  // Vars

  var elements = {
    onwinresize: [],
    ontextresize: []
  };
  
  // Constants

  var EMPTY              = "";
  var CSS_COMMENT        = /(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)\s*?/g;
  var NEW_LINE           = /\n/g;
  var CALC_RULE          = /\s?(\-webkit\-)?calc/;
  var CALC_EXTR_RULE     = /\s?(\-webkit\-)?calc\((.*?)\)/;
  var MATH_EXP           = /[+-/*]?\d+(px|%|em|rem)?/g;
  var PERCENT            = /\d+%/;
  var PIXEL              = /(\d+)px/;
  var REMEM              = /\d+r?em/;
  var REM                = /\d+rem/;
  var EM                 = /\d+em/;
  var PLACEHOLDER        = "$1";
  var ONLYNUMBERS        = /[\s\-0-9]/g;

  // Utilities

  var util = {
    // http://stackoverflow.com/questions/2790001/fixing-javascript-array-functions-in-internet-explorer-indexof-foreach-etc
    arr: {
      forEach: function(arr, fn, opt) {
        if (!('forEach' in Array.prototype)) {
          for (var i= 0, n= arr.length; i<n; i++) {
            if (i in arr) {
              fn.call(opt, arr[i], i, arr); 
            }
          }
        } else {
          arr.forEach(fn, opt);
        }
      }
    },
    // http://www.quirksmode.org/dom/getstyles.html
    // http://stackoverflow.com/questions/1955048/get-computed-font-size-for-dom-element-in-js
    string: {
      camelize : function (str) {
        return str.replace(/\-(\w)/g, function(str, letter){
          return letter.toUpperCase();
        });
      }
    },
    
    style: {

      getty: function elementCurrentStyle(element, styleName){
    if (element.currentStyle){
        var i = 0, temp = "", changeCase = false;
        for (i = 0; i < styleName.length; i++)
            if (styleName[i] != '-'){
                temp += (changeCase ? styleName[i].toUpperCase() : styleName[i]);
                changeCase = false;
            } else {
                changeCase = true;
            }
        styleName = temp;
        return element.currentStyle[styleName];
    } else {
        return getComputedStyle(element, null).getPropertyValue(styleName);
    }
},
      get: function(el, prop) {
        if (el.currentStyle) {
          return el.currentStyle[util.string.camelize(prop)];
        } else if (document.defaultView && document.defaultView.getComputedStyle) {
          return document.defaultView.getComputedStyle(el,null).getPropertyValue(prop);
        } else {
          return el.style[util.string.camelize(prop)];
        }        
      }
    },

    xhr: (function() {
      if (win.XMLHttpRequest) {
        return new XMLHttpRequest;
      }
      try {
        return new ActiveXObject('Microsoft.XMLHTTP');
      } catch(e) {
        return null;
      }      
    })(),

    event :  {
      add: function(el, type, fn){
        if(doc.addEventListener){
          el.addEventListener(type, fn, false);
        } else {
          el.attachEvent('on' + type, fn);
        }
      },
      remove: function(el, type, fn){
        if(document.removeEventListener){
          el.removeEventListener(type, fn, false);
        } else {
          el.detachEvent('on' + type, fn);
        }
      },
      /*!
       * contentloaded.js
       *
       * Author: Diego Perini (diego.perini at gmail.com)
       * Summary: cross-browser wrapper for DOMContentLoaded
       * Updated: 20101020
       * License: MIT
       * Version: 1.2
       *
       * URL:
       * http://javascript.nwbox.com/ContentLoaded/
       * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
       *
       */

      // @win window reference
      // @fn function reference
      content_loaded: function(win, fn) {

        var done = false, top = true,

        doc = win.document, root = doc.documentElement,

        add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
        rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
        pre = doc.addEventListener ? '' : 'on',

        init = function(e) {
          if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
          (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
          if (!done && (done = true)) fn.call(win, e.type || e);
        },

        poll = function() {
          try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
          init('poll');
        };

        if (doc.readyState == 'complete') fn.call(win, 'lazy');
        else {
          if (doc.createEventObject && root.doScroll) {
            try { top = !win.frameElement; } catch(e) { }
            if (top) poll();
          }
          doc[add](pre + 'DOMContentLoaded', init, false);
          doc[add](pre + 'readystatechange', init, false);
          win[add](pre + 'load', init, false);
        }
      }
    },
    
    // http://alistapart.com/article/fontresizing
    // http://www.truerwords.net/articles/web-tech/custom_events.html
    // https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent

    text_resize: (function(){
      var el, current_size, interval, e;
      var detect_delay = 200;

      var create_control_element = function(){
        el = doc.createElement('span');
        el.id='text-resize-control';
        el.innerHTML='&nbsp;';
        el.style.position="absolute";
        el.style.left="-9999px";
        el.style.lineHeight="1";
        el.style.fontSize="1em";
        doc.body.insertBefore(el, doc.body.firstChild);
        current_size = el.offsetHeight;
      };

      var detect_change = function() {
        var new_size = el.offsetHeight;
        if( new_size !== current_size ) {
          current_size = new_size;

          if(e) {
            doc.body.dispatchEvent(e);
          }          
        }
      };

      var create_event = function() {
        if(!e) {
          if (doc.createEvent) {
            e = doc.createEvent('Event');
            e.initEvent('textresize', true, true);
          } else if (typeof Event === 'function') {
            e = new Event('textresize');
          }          
        }
      };

      var start_detection = function(){
        if (!interval) {
          interval = win.setInterval(detect_change,detect_delay);
        }        
      }

      var stop_detection = function() {
        win.clearInterval(interval);        
        interval = null;
      }


      return {
        init: function() {
          create_control_element();
          create_event();
        },
        start: function() {
          start_detection();
        },
        stop: function() {
          stop_detection();
        }
      }
    })()
  }

  var load_stylesheet = function(url) {

    util.xhr.open("GET", url, false);
    util.xhr.send();

    return ( util.xhr.status==200 ) ? util.xhr.responseText : EMPTY;
  }

  var parse_stylesheet = function(css_text) {
    var rules = [];

    css_text = css_text.replace(CSS_COMMENT, EMPTY).replace(NEW_LINE, EMPTY);

    rules = css_text.split('}');

    util.arr.forEach(rules, function(rule){
      
      var selector = rule.split('{')[0];

      var dom_elements = selector.length > 1 ? doc.querySelectorAll(selector) : '';

      var declarations = [];
      var prop = "";
      var values = "";

      if(rule.match(CALC_RULE) && dom_elements.length !== 0) {

        declarations = rule.split('{')[1].split(';');

        util.arr.forEach(declarations, function(declaration){
          if( declaration.match(CALC_RULE) ) {
            prop = declaration.split(':')[0];
            values = declaration.split(':')[1];
          }
        });

        for(var i = 0; i < dom_elements.length; i++) {

          if( values.match(CALC_EXTR_RULE)[2].match(PERCENT) ) {
            elements.onwinresize.push({
              element: dom_elements[i],
              prop: prop,
              values: values
            });
          }

          if( values.match(CALC_EXTR_RULE)[2].match(REMEM) ) {
            elements.ontextresize.push({
              element: dom_elements[i],
              prop: prop,
              values: values
            });
          }

        }
      }

    });
  }

  var calc = function(obj){
    var formula = obj.values.match(CALC_EXTR_RULE)[2].replace(PIXEL, PLACEHOLDER);
    var matches = formula.match(MATH_EXP);
    var result;

    if(matches) {
      util.arr.forEach(matches, function(match){
        var reference_value, modifier, fontsize;
        
        if( match.match(PERCENT) ) {
          reference_value = obj.element.parentNode.clientWidth;
          modifier = parseInt(match.replace(/%/, EMPTY), 10) / 100;
          
          formula = formula.replace(match, reference_value * modifier)
        }

        if( match.match(EM) ) {

          if( util.style.get( obj.element , "font-size").match(PERCENT) ) {
            reference_value = 16 * parseInt(util.style.get( obj.element , "font-size").replace(/%/, EMPTY), 10) / 100
          } else {
            reference_value = parseInt( util.style.get( obj.element, "font-size").replace(/px/, EMPTY ), 10)  
          }

          modifier = parseInt(match.replace(/EM/, EMPTY), 10);
          
          formula = formula.replace(match, reference_value * modifier)
        }

        if( match.match(REM) ) {
          if( util.style.get( doc.body , "font-size").match(PERCENT) ) {
            reference_value = 16 * parseInt(util.style.get( doc.body , "font-size").replace(/%/, EMPTY), 10) / 100
          } else {
            reference_value = parseInt( util.style.get( doc.body , "font-size").replace(/px/, EMPTY ), 10)
          }
          
          modifier = parseInt(match.replace(/REM/, EMPTY), 10);

          formula = formula.replace(match, reference_value * modifier)
        }
      });
    }

    try {
      if( formula.match(ONLYNUMBERS) ) {
        result = eval( formula );
      }

      obj.element.style[util.string.camelize(obj.prop)] = obj.values.replace(CALC_EXTR_RULE, " " + result + "px");
    } catch(e) {}
  }

  var get_style_sheets = function() {
    var url, stylesheet;
    for (var c = 0; c < doc.styleSheets.length; c++) {
      stylesheet = doc.styleSheets[c];
      if (stylesheet.href && stylesheet.href != EMPTY) {
        parse_stylesheet( load_stylesheet(stylesheet.href) );
      }
    }
  };


  util.event.content_loaded(win, function(){
    
    get_style_sheets();
      
    if(elements.onwinresize.length !== 0) {

      util.arr.forEach(elements.onwinresize, function(element){
        calc(element);

        util.event.add(win, 'resize', function(){
          calc(element);
        });

      });      
    }

    if(elements.ontextresize.length !== 0) {

      util.arr.forEach(elements.ontextresize, function(element){
        calc(element);

        util.event.add(doc.body, 'textresize', function(){
          calc(element);
        });

        util.text_resize.init();
        util.text_resize.start();        
        
      });      
    }    

  });

})(window, document);