define([
	'underscore',
	'jquery',
	'backbone',
	'events/dispatcher'
	], function(_, $, Backbone, Dispatcher) {

		function initialize() {

			$(window).bind('keypress', function(event) {

				event.preventDefault();

				var code = (event.keyCode ? event.keyCode : event.which);
				Dispatcher.trigger('input:key', { key: code });
			
			});
		}

		return {
			init: initialize
		};


	});