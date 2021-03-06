var Scout = require('zetta').Scout;
var util = require('util');
var DiscoverResource = require('./discover_resource');

var TwitchBotScout = module.exports = function() {
  Scout.call(this); 
};
util.inherits(TwitchBotScout, Scout);

TwitchBotScout.prototype.init = function(next) {
  this.server.httpServer.cloud.add(DiscoverResource, this);
  next(); 
};

