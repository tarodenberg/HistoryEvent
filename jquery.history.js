/**
 * jQuery history event v0.2
 * Copyright (c) 2011 Tom Rodenberg <tarodenberg gmail com>
 * Licensed under the GPL (http://www.gnu.org/licenses/gpl.html) license.
 */
(function($) {
  var currentHash,
  previousNav,
  timer,
  hashTrim = /^.*#/,
  msie_iframe,
  history = 'history',
  historyadd = 'historyadd';
	
  function msie_getDoc() {
    return msie_iframe.contentWindow.document;
  }
	
  function msie_getHash() {
    return msie_getDoc().location.hash;
  }

  function msie_setHash(hash) {
    var d = msie_getDoc();
    d.open();
    d.close();
    d.location.hash = hash;
  }
	
  function historycheck() {
    var hash = msie_iframe ? msie_getHash() : location.hash;
    if (hash != currentHash) {
      currentHash = hash;
            
      if (msie_iframe) {
        location.hash = currentHash;
      }

      var current = $.history.getCurrent();

      $.event.trigger(history, [current, previousNav]);
      previousNav = current;
    }
  }

  $.history = {
    add: function(hash) {
      hash = '#' + hash.replace(hashTrim, '');
            
      if (currentHash != hash) {
        var previous = $.history.getCurrent();
            
        location.hash = currentHash = hash;
            
        if (msie_iframe) {
          msie_setHash(currentHash);
        }

        $.event.trigger(historyadd, [$.history.getCurrent(), previous]);
      }
            
      if (!timer) {
        timer = setInterval(historycheck, 100);
      }
    },
        
    getCurrent: function() {
      return currentHash.replace(hashTrim, '');
    }
  };

  $.fn.history = function(fn) {
    $(this).bind(history, fn);
  };

  $.fn.historyadd = function(fn) {
    $(this).bind(historyadd, fn);
  };

  $(function() {
    currentHash = location.hash;
    if ($.browser.msie) {
      msie_iframe = $('<iframe style="display:none" src="javascript:false;"></iframe>').prependTo('body')[0];
      msie_setHash(currentHash);
      currentHash = msie_getHash();
    }
  });
})(jQuery);
