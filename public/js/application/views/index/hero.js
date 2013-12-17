define([
	'jquery',
	'underscore',
	'backbone',
	'events/dispatcher',
	'views/tracks/track'
], function( $, _, Backbone, Dispatcher, TrackView) {

	var HeroView = Backbone.View.extend({

		el: "section#hero",

		events: {
		},

		initialize: function() {
			_.bindAll(this, 'render');

			this.render();
		},

		render: function() {
			var self = this;

			//this.trackView = new TrackView({ el: $(this.el).find('.row'), model: self.model });

			this.waveForm = new Waveform({
				container: $("#herotrack").get(0),
				data: self.model.get('wave'),
				innerColor: function() {
					var ctx = this.context;
					var grad = ctx.createLinearGradient(0,0,0,170);
					grad.addColorStop(0,"ef6500");
					grad.addColorStop(1,"ff3a68");

					return grad;
				},
				height: 128
			});
			
			return this;
		}

	});

	return HeroView;

});
