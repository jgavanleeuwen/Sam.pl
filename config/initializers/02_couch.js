var elasticsearch = require('elasticsearch');

module.exports = function( done ) {
  console.log('ElasticSearch init');

  var es = elasticsearch();
	
	es.exists({ _index : 'tracks' }, function (err, data) {
	  if (err) {
	  	console.log('ElasticSearch failed')
	  } else {
	  	console.log('ElasticSearch complete')
	  	done();
	  }
	});

}
