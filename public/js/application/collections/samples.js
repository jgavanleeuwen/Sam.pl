define([
	'jquery',
	'underscore',
	'backbone',
	'models/sample'
], function( $, _, Backbone, SampleModel ) {

	var SamplesCollection = Backbone.Collection.extend({

		model: SampleModel
		
	});

	return SamplesCollection;
});