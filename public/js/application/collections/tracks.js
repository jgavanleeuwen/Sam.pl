define([
	'underscore',
	'backbone',
	'models/track'
	], function( _, Backbone, TrackModel ) {

		var TracksCollection = Backbone.Collection.extend({

			model: TrackModel,

			urlRoot: "http://localhost:3000/tracks",

			url: function() {
				return this.urlRoot;
			}

		});

		return TracksCollection;

});