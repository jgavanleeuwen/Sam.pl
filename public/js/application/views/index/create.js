define([
	'jquery',
	'underscore',
	'backbone',
	'waveform',
	'jdataview',
	'wavesurfer',
	'filesaver',
	'events/dispatcher',
	'views/tracks/sample'
], function( $, _, Backbone, WaveForm, jDataView, WaveSurfer, FileSaver, Dispatcher, SampleView) {

	var CreateView = Backbone.View.extend({

		el: "section#create",

		events: {
			"mousedown #samplebar": "onBarMouseDownHandler",
			"mousemove #samplebar": "onBarMouseMoveHandler",
			"mouseup  #samplebar": "onBarMouseUpHandler",
			"click #render": "onRenderClickHandler",
			"click #filters button": "onClickFilterHandler",
			"change #volume": "onVolumeChangeHandler"
		},

		initialize: function() {
			_.bindAll(this, 'writeUTFBytes', 'onClickFilterHandler', 'onInputKeyHandler', 'interleave', 'render', 'onStateChangeHandler', 'onVolumeChangeHandler', 'updateMessageCentre', 'onWaveReadyHandler', 'onWaveErrorHandler', 'onWaveID3DataHandler', 'onWaveProgressHandler', 'onWaveMarkHandler', 'onWaveBufferHandler', 'onBarMouseDownHandler', 'onBarMouseMoveHandler', 'onBarMouseUpHandler', 'onWaveLoadingHandler');

			this.model.on('change:state', this.onStateChangeHandler);

			Dispatcher.on('input:key', this.onInputKeyHandler);

			this.waveSurfer = Object.create(WaveSurfer);
			this.waveSurfer.on('ready',		this.onWaveReadyHandler);
			this.waveSurfer.on('buffer',	this.onWaveBufferHandler);
			this.waveSurfer.on('id3v1',		this.onWaveID3DataHandler);
			this.waveSurfer.on('loading',	this.onWaveLoadingHandler);
			this.waveSurfer.on('error',		this.onWaveErrorHandler);
			this.waveSurfer.on('mark',			this.onWaveMarkHandler);
			this.waveSurfer.on('progress',	this.onWaveProgressHandler);

			window.jDataView = jDataView;
			
			this.sampleBar = $('#samplebar');
			this.waveSurfer.bindDragNDrop($('.droparea').get(0));
			this.waveSurfer.init({
				container: $('#waveholder').get(0)
			});
		},

		onStateChangeHandler: function(model) {
			console.log(model.get('state'));
		},

		onInputKeyHandler: function(args) {
			if (args.key == 32) {
				this.waveSurfer.playPause();
			}
		},

		onBarMouseDownHandler: _.once(function(event) {
			this.sampling = true;
			var self = this;
			this.sampleBar.append(new SampleView({ left: event.clientX - self.sampleBar.offset().left }).render().el);

			this.waveSurfer.mark({
				id: 'x',
				position: (event.clientX - self.sampleBar.offset().left) / self.sampleBar.width() * self.model.get('duration')
			});
		}),

		onBarMouseMoveHandler: function(event) {
			var self = this;
			if(this.sampling) {
				Dispatcher.trigger('sample:update', { right: event.clientX - self.sampleBar.offset().left});
			}
		},

		onBarMouseUpHandler: function(event) {
			this.sampling = false;

			var self = this;

			this.waveSurfer.mark({
				id: 'y',
				position: (event.clientX - self.sampleBar.offset().left) / self.sampleBar.width() * self.model.get('duration')
			});

			var data = this.model.get('wave').slice(10,100);
			this.waveForm.update({
				data: data
			});
		},

		onClickFilterHandler: function(event) {
			this.lowpass = this.waveSurfer.backend.ac.createBiquadFilter();
			this.lowpass.type = this.lowpass[$(event.currentTarget).data('filter')];

			var self = this;

			this.waveSurfer.backend.setFilter(self.lowpass);
		},

		onVolumeChangeHandler: function(event) {
			this.lowpass.frequency.value = $(event.currentTarget).val();
		},

		onWaveLoadingHandler: function( progress ) {
			this.model.set({ state: 'loading' });
			if (progress < 100) { 
				this.updateMessageCentre({
					icon: 'fa-spinner fa-spin', 
					text: 'Uploaden bestand..',
				});
			} else {
				this.updateMessageCentre({
					icon: 'fa-cog fa-spin', 
					text: 'Genereren waveform..',
				});
			}
		},

		onWaveReadyHandler: function() {

			this.waveSurfer.play();
			this.model.set({ 
				duration: this.waveSurfer.getDuration(),
				state: 'ready'
			});

			var self = this;

			this.updateMessageCentre({
				icon: 'fa-music', 
				text: 'Playing ' + self.model.get('artist') + ' - ' + self.model.get('title'),
				cb: function() {
					$('#render').removeAttr('disabled');
				}
			});
		},

		onWaveBufferHandler: function(data) {

			var max = _.max(data);
			var self = this;

			this.wave = _.map(data, function(val) {
				return val / max;
			});

			this.model.set({ wave: self.wave });

			this.waveForm = new Waveform({
				container: $(".waveform").get(0),
				data: self.model.get('wave'),
				innerColor: '#AAA'
			});
		},

		onWaveID3DataHandler: function(data) {
			this.model.set({
				artist: data.artist,
				title: data.title
			});
		},

		onWaveProgressHandler: function(progress) {
		},

		onWaveMarkHandler: function(mark) {
			var markers = _.toArray(this.waveSurfer.getMarks());
			var self = this;
			if(mark.id == 'y') {
				this.waveSurfer.playAt(markers[0].position / self.model.get('duration'));
			}
		},

		onWaveErrorHandler: function(error) {
			console.log('Error loading wave');
		},

		updateMessageCentre: function( data ) {
			$('#dropinfo').html('<i class="fa ' + data.icon + '"></i> ' + data.text);

			if(typeof data.cb === 'function') {
				data.cb();
			}
		},

		writeUTFBytes: function(view, offset, string){ 
			var lng = string.length;
			for (var i = 0; i < lng; i++){
			view.setUint8(offset + i, string.charCodeAt(i));
			}
		},

		interleave: function(leftChannel, rightChannel) {
			var length = leftChannel.length + rightChannel.length;
			var result = new Float32Array(length);
		
			var inputIndex = 0;
		
			for (var index = 0; index < length; ){
				result[index++] = leftChannel[inputIndex];
				result[index++] = rightChannel[inputIndex];
				inputIndex++;
			}
			return result;
		},

		onRenderClickHandler: function(event) {
			event.preventDefault();
			console.log('render');

			var leftChannel = this.waveSurfer.backend.buffer.getChannelData(0).subarray(44000, 132000);
			var rightChannel = this.waveSurfer.backend.buffer.getChannelData(1).subarray(44000, 132000);


			var dualChannel = this.interleave(leftChannel, rightChannel);

			var buffer = new ArrayBuffer(44 + dualChannel.length * 2);
			var view = new DataView(buffer);

			this.writeUTFBytes(view, 0, 'RIFF');
			view.setUint32(4, 44 + dualChannel.length * 2, true);

			this.writeUTFBytes(view, 8, 'WAVE');
			// FMT sub-chunk
			this.writeUTFBytes(view, 12, 'fmt ');
			view.setUint32(16, 16, true);
			view.setUint16(20, 1, true);
			// stereo (2 channels)
			view.setUint16(22, 2, true);
			view.setUint32(24, 44100, true);
			view.setUint32(28, 44100 * 4, true);
			view.setUint16(32, 4, true);
			view.setUint16(34, 16, true);
			// data sub-chunk
			this.writeUTFBytes(view, 36, 'data');
			view.setUint32(40, dualChannel.length * 2, true);

			var lng = leftChannel.length;
			var index = 44;
			var volume = 1;
			for (var i = 0; i < lng; i++){
				view.setInt16(index, dualChannel[i] * (0x7FFF * volume), true);
				index += 2;
			}

			var blob = new Blob ( [ view ], { type : 'audio/wav' } );

			console.log(blob);
			saveAs(blob, 'audio.wav');

		}

	});

	return CreateView;

});
