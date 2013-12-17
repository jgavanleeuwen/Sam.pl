define([
	'underscore',
	'backbone'
	], function( _, Backbone) {
		var SampleModel = Backbone.Model.extend({
			initialize: function(options, attributes) {
				console.log(this);
			},

			parse: function(attributes) {
				attributes.att = _.first(_.keys(attributes._attachments));

				return attributes;
			}
		});
		
		return SampleModel;
	});