var locomotive = require('locomotive');
var Controller = locomotive.Controller;

var IndexController = new Controller();

IndexController.main = function() {
  this.render();
};

module.exports = IndexController;
