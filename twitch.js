var irc = require('tmi.js');
var Device = require('zetta').Device;
var util = require('util');

var TwitchChat = module.exports = function() {
  Device.call(this);  
}
util.inherits(TwitchChat, Device);

TwitchChat.prototype.init = function(config) {
  var self = this;
  config
    .type('twitch-chat-bot')
    .state('disconnected')
    .when('disconnected', { allow: ['connect']})
    .when('connected', { allow: ['disconnect', 'start']})
    .when('stopped', { allow: ['start', 'disconnect'] })
    .when('running', { allow: ['send', 'stop', 'disconnect', 'join'] })
    .map('connect', this.connect, [{type: 'text', name: 'username'}, {type: 'text', name: 'token'}, {type: 'text', name: 'channel'}])
    .map('disconnect', this.disconnect)
    .map('start', this.start)
    .map('stop', this.stop)
    .map('send', this.send, [{type: 'text', name: 'message'}, {type: 'text', name: 'channel'}])
    .map('join', this.join, [{type: 'text', name: 'channel'}])
    .stream('messages', function(stream) {
      self._messageStream = stream; 
    });
};

TwitchChat.prototype.connect = function(username, token, channel, cb) {
  var self = this;
  var options = {
    options: {
      debug: false
    },
    connection: {
      random: 'chat',
      reconnect: true  
    },
    identity: {
      username: username,
      password: token  
    },
    channels: ['#'+ channel]
  }
  this.channel = channel;
  this.username = username;
  this._client = new irc.client(options);

  this._chatListener = function(channel, user, message, self) {
    if(self === true) {
      user = this.username;  
      isOwnerOrMod = false;
    } else {
      if(user['display-name']) {
        user = user['display-name'];
        isOwnerOrMod = user['user-type'] === 'mod' || user['user-type'] === 'owner' ? true : false;
      } else {
        user = user;  
        isOwnerOrMod = false;
      }
    }
    if(this._messageStream) {
      this._messageStream.write({user: user, message: message});   
    } 
  };

  this._client.on('connected', function() {
    self.state = 'connected';
    cb();
    
  });


  this._client.connect(); 
};

TwitchChat.prototype.join = function(channel, cb) {
  var joinPromise = this._client.join(channel);
  joinPromise.then(function() {
    cb();
  }).catch(function(err) {
    cb(err);
  });  
};

TwitchChat.prototype.disconnect = function(cb) {
  this._client.removeListener('chat', this._chatListener);
  this.state = 'disconnected';
  cb(); 
};

TwitchChat.prototype.stop = function(cb) {
  this._client.removeListener('chat', this._chatListener);
  this.state = 'stopped';
  cb(); 
};

TwitchChat.prototype.start = function(cb) {
  this._client.on('chat', this._chatListener.bind(this));
  this.state = 'running';
  cb();
};

TwitchChat.prototype.send = function(message, cb) {
  this._client.say('#' + this.channel, message);
  cb();  
};



