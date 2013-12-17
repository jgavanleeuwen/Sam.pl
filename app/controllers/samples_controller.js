var locomotive = require('locomotive');
var Controller = locomotive.Controller;
var _	= require('underscore');

var elasticsearch = require('elasticsearch');
var config = { 
	_index: "tracks" 
};
var es = elasticsearch(config);

var SamplesController = new Controller();
var output;

SamplesController.before('index', function( next ) {

	var self = this;
	output = [];

	es.search({
    query : {
      field : {
        track: self.params('track_id').toString()
      }
    }
  }, function (err, data) {
		if (err) {
			console.log(err);
		} else {
			output = _.pluck(data.hits.hits, '_source');
		}
		next();
  });

	
});


SamplesController.index = function() {
  this.output = JSON.stringify(output);
  this.render();
};

SamplesController.after('index', function(next) {
	output = null;
	next();
});

module.exports = SamplesController;
