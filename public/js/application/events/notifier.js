define([    
  'underscore',    
  'backbone'
], function(_, Backbone) {    
  
  var notifier;

	function hasSupport() {
		if (window.webkitNotifications) {
      return true;
    } else {
      return false;
    }
	}

	function requestPermission(callbackfn) {
		window.webkitNotifications.requestPermission(function() {
      if (callbackfn) { 
				callbackfn(window.webkitNotifications.checkPermission() === 0); 
      }
    });
	}

	function notify(object) {
		if (window.webkitNotifications.checkPermission() === 0) {
      
      var popup = window.webkitNotifications.createNotification(object.icon, object.title, object.body);
			
			popup.onclick = function(x) { 
				window.focus();
				if( typeof object.onclick === 'function') {
					object.onclick();
				}
				this.cancel(); 
			};

			popup.ondisplay = function(x) {
				if( typeof object.ondisplay === 'function') {
					object.ondisplay();
				}
			};
        
      popup.show();

      return true;
    }

    return false;
	}

	return {
		hasSupport: hasSupport,
		requestPermission: requestPermission,
		notify: notify
	};  
});