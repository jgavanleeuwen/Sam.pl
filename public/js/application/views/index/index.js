define([
	'jquery',
	'underscore',
	'backbone',
	'getbootstrap',
	'modernizr',
	'scrollto',
	'waveform',
	'events/dispatcher',
	'events/keyinput',
	'models/track',
	'views/index/favourite',
	'views/index/create',
	'views/index/hero',
	'collections/tracks'
], function($, _, Backbone, TwitBootstrap, Modernizr, ScrollTo, WaveForm, Dispatcher, KeyInput, TrackModel, FavouriteView, CreateView, HeroView, TracksCollection) {
		var indexView = Backbone.View.extend({
			el: 'body',

			initialize: function() {

				_.bindAll(this);
				this.template = this.$el.html();

				var self = this;

				this.tracksCollection = new TracksCollection();

				this.tracksCollection.fetch({
					success: function(collection, response, options) {

						var heroView = new HeroView({ model: collection.pop() });
						var favouriteView = new FavouriteView({ collection: self.tracksCollection });
						var createView = new CreateView({ model: new TrackModel() });
						
					},
					error: function(collection, error, options) {
						console.log(error);
					}
				});

				KeyInput.init();
			},

			render: function() {
				$(this.el).html(_.template(this.template));

				// Bootstrap UI goodies
				$("ul.nav a[href^='#']").click( function(e) {
					e.preventDefault();
					$.scrollTo($(this).attr('href'), 500, {axis: 'y', offset: {top: -50} });
				});

				// Waypoints
			}

		});
		
		return new indexView();
	});