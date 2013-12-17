define([
	'jquery',
	'underscore',
	'backbone',
	'events/dispatcher',
	'collections/samples',
	'models/sample',
	'views/tracks/sample',
	'text!views/tracks/helpers/track.html',
	'text!views/tracks/helpers/small.html'
], function( $, _, Backbone, Dispatcher, SamplesCollection, SampleModel, SampleView, TrackTemplate, SmallTemplate ) {

	var TrackView = Backbone.View.extend({

		template: TrackTemplate,
		className: 'row',

		initialize: function() {
			_.bindAll(this, 'render', 'onAddSampleHandler');

			var self = this;

			this.collection = new SamplesCollection();
			this.collection.url = function() {
				return 'tracks/' + self.model.get('_id') + '/samples';
			};
			this.collection.on('add', this.onAddSampleHandler);
			this.collection.fetch();

			this.render();
		},

		onAddSampleHandler: function(model) {
			var self = this;

			$(this.el).find('.waveholder').append( new SampleView({ model: model }).render().el);
	
			/*this.waveForm.innerColor = function(x, y){
				if (x < model.get('start') || x > model.get('end')) {
					return '#CCCCCC';
				} else {
					return '#EF6500';
				}
			};
			this.waveForm.update({
				data: self.model.get('wave')
			});*/

			var att = _.first(_.keys(model.get('_attachments')));
			console.log(att);
		},

		render: function() {
			var self = this;
			
			$(this.el).html(_.template(this.template, this.model.attributes));

			if (this.model.get('wave')) {
				this.waveForm = new Waveform({
					container: $(self.el).find(".waveholder").get(0),
					data: self.model.get('wave'),
					innerColor: '#CCC',
					height: self.model.get('height'),
				});
			}

			return this;
		}

	});

	return TrackView;

});
