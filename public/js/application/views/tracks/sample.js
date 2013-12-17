define([
	'jquery',
	'underscore',
	'backbone',
	'events/dispatcher',
	'text!views/tracks/helpers/sample.html',
	'text!views/tracks/helpers/small.html',
	], function( $, _, Backbone, Dispatcher, SampleTemplate, SmallTemplate ) {

	var SampleView = Backbone.View.extend({

		template: SampleTemplate,
		className: "sample",

		events: {
			"mousedown .handler": "onMouseDownHandler",
			"mousemove .handler": "onMouseMoveHandler",
			"mouseup .handler": "onMouseUpHandler",
			"click .play": "onPlaySampleHandler"
		},

		initialize: function() {
			_.bindAll(this, 'render', 'onSampleUpdateHandler', 'onMouseDownHandler', 'onPlaySampleHandler');

			Dispatcher.on('sample:update', this.onSampleUpdateHandler);
		},

		render: function() {
			
			var self = this;

			if (this.model) {
				$(this.el).html(_.template(SmallTemplate));
				$(this.el).css({
					position: 'absolute',
					height: '103%',
					bottom: '5px',
					left: self.model.get('start') + 15 + 'px',
					width: self.model.get('duration') + 15 + 'px',
					zIndex: '3'
				});

			} else {
				$(this.el).html(_.template(this.template));
				$(this.el).css({
					position: 'absolute',
					height: '103%',
					bottom: '5px',
					left: self.options.left + 15 + 'px',
					zIndex: '3'
				});
			}
			
			return this;
		},

		onPlaySampleHandler: function() {
			var self = this;

			var audioElement = document.createElement('audio');
			audioElement.setAttribute('src', 'http://localhost:5984/tracks/' + self.model.get('_id') + '/' + self.model.get('att'));
			audioElement.addEventListener('canplaythrough', function( prog ) {
				audioElement.play();

			});
		},

		onSampleUpdateHandler: function(args){
			var self = this;
			$(this.el).css({
				width: args.right - self.options.left + 'px'
			});
		},

		onMouseDownHandler: function(event) {
			event.stopPropagation();
			this.moving = true;
			this.sp = event.clientX - $(this.el).offset().left - 15;
		},

		onMouseMoveHandler: function(event) {
			var self = this;
			if (this.moving) {
				$(this.el).css({
					left: event.clientX - $(self.el).parent().offset().left - self.sp
				});
			}
		},

		onMouseUpHandler: function(event) {
			this.moving = false;
		}

	});

	return SampleView;

});