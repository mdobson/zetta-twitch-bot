var Scout = require('zetta').Scout;
var util = require('util');

var TwitchBotScout = module.exports = function() {
  Scout.call(this); 
};
util.inherits(TwitchBotScout, Scout);

TwitchBotScout.prototype.init = function(next) {
  
};

