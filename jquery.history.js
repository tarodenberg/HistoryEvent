/**
 * jQuery history event v0.4
 * Copyright (c) 2014 Tom Rodenberg <tarodenberg gmail com>
 * jQuery history event is released under two licenses: new BSD, and MIT. 
 * You may pick the license that best suits your development needs.
 */
(function($) {
  var currentHash,
  previousNav,
  timer,
  hashTrim = /^.*#/,
  isLoaded = false,
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
    if(currentHash) {
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
  }

  $.history = {
    add: function(hash) {
      if(currentHash || isLoaded) {
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
          setTimeout(function() {
            timer = setInterval(historycheck, 250);
          }, 1000);
        }
      }
    },
        
    getCurrent: function() {
      var hash = currentHash ? currentHash : location.hash;
      return hash ? hash.replace(hashTrim, '') : '';
    }
  };

  $.fn.history = function(fn) {
    $(this).bind(history, fn);
  };

  $.fn.historyadd = function(fn) {
    $(this).bind(historyadd, fn);
  };

  $(function() {
    isLoaded = true;
    currentHash = location.hash;
    if ($.browser.msie) {
      msie_iframe = $('<iframe style="display:none" src="javascript:false;"></iframe>').prependTo('body')[0];
      msie_setHash(currentHash);
      currentHash = msie_getHash();
    }
  });
})(jQuery);
