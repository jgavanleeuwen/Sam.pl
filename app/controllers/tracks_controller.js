var locomotive = require('locomotive');
var Controller = locomotive.Controller;
var _	= require('underscore');

var elasticsearch = require('elasticsearch');
var config = { 
	_index: "tracks" 
};
var es = elasticsearch(config);

var TracksController = new Controller();
var output;

TracksController.before('index', function( next ) {

	output = [];

	es.search({
    query : {
      field : {
        type : 'track'
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



TracksController.index = function() {
  this.output = JSON.stringify(output);
  this.render();
};

TracksController.after('index', function(next) {
	output = null;
	next();
});

module.exports = TracksController;
