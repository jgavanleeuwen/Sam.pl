define([
	'underscore',
	'backbone',
	'collections/samples'
	], function( _, Backbone, SamplesCollection ) {
		var TrackModel = Backbone.Model.extend({

			defaults: {
				cover: '',
				height: 40
			},

			initialize: function( attributes ) {
				
			}

		});
		
		return TrackModel;
	});