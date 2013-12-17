importScripts('../../libs/require/require.js');

require({
	baseUrl: "../../libs"
}, ["underscore/underscore.min"],
  function(_) {
		
		var self = this;

		this.addEventListener('message', function(event) {
			self.postMessage(event);
		});

	});