define([
	'underscore',
	'jquery',
	'backbone',
	'events/dispatcher'
	], function(_, $, Backbone, Dispatcher) {

		function initialize() {

			window.onExternalDataHandler = function( response ) {
				Dispatcher.trigger('external:' + response.event, response.data);
			};
		}

		return {
			init: initialize
		};


	});