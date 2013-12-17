define([    
  'underscore',    
  'backbone'
], function(_, Backbone) {    
  
  var dispatcher = _.extend({}, Backbone.Events);    
  
  return dispatcher;  
});