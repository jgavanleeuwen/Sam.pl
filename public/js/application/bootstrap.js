require.config({
	paths: {
		// Libs
		jquery: 'http://code.jquery.com/jquery-latest.min',
		underscore: '../libs/underscore/underscore.min',
		backbone: '../libs/backbone/backbone.min',

		// Plugins
		waveform: '../plugins/waveform/waveform',
		wavesurfer: '../plugins/wavesurfer/wavesurfer.min',
		scrollto: '../plugins/scrollto/scrollto.min',
		jdataview: '../plugins/dataview/jdataview',
		filesaver: '../plugins/filesaver/filesaver',

		// Twitter Bootstrap
		getbootstrap: '../plugins/bootstrap/bootstrap.min',

		// Modernizr
		modernizr: 'http://modernizr.com/downloads/modernizr-latest'

	},
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		wavesurfer: {
			exports: 'WaveSurfer',
			deps: ['jdataview']
		},
		getbootstrap: {
			deps: ['jquery']
		},
		scrollto: {
			deps: ['jquery']
		}
	},
	deps: ["main"]
});