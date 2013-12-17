define([
	'jquery',
	'underscore',
	'backbone',
	'events/dispatcher',
	'views/tracks/track'
], function( $, _, Backbone, Dispatcher, TrackView) {

	var FavouriteView = Backbone.View.extend({

		el: "section#favourite",

		events: {
		},

		initialize: function() {
			_.bindAll(this, 'render');

			this.render();
		},

		render: function() {
			var self = this;
			
			this.collection.each( function(model) {
				var h = $('<div class="' + model.get('_id') + ' row"></div>');
				$(self.el).find('.container').append(h);
				var t = new TrackView({ el: h, model: model });
			});

			return this;
		}

	});

	return FavouriteView;

});
