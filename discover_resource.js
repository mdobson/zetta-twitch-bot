var TwitchBot = require('./twitch');

var DiscoverResource = module.exports = function(scout) {
  this.scout = scout;
}

DiscoverResource.prototype.init = function(config) {
  config
    .path('/bot')
    .consumes('application/json')
    .produces('application/vnd.siren+json')
    .post('/create', this.create)
    .get('/', this.root);  
};

DiscoverResource.prototype.root = function(env, next) {
  var body = {
    class: ['scout', 'twitch-bot-scout'],
    actions: [
      {
        name: 'create-bot',
        method: 'POST',
        href: env.helpers.url.current(),
        type: 'application/json',
        fields: [
          {
            name: 'username',
            type: 'text'  
          },
          {
            name: 'token',
            type: 'text'  
          },
          {
            name: 'channel',
            type: 'text'  
          }

        ]  
      }
    ],
    links: [
      { rel: ['self'], href: env.helpers.url.current() }
    ]  
  }
  env.response.statusCode = 200;
  env.response.body = body;
  return next(env);  
}

DiscoverResource.prototype.create = function(env, next) {
  var self = this;
  env.request.getBody(function(err, body) {
    if(err) {
      env.response.statusCode = 500;
      return next(env);  
    }
    body = body.toString();
    var bodyObject = JSON.parse(body);  
    var botOpts = {
      username: bodyObject.username,
      token: bodyObject.token,
      channel: bodyObject.channel 
    }
    
    self.scout.discover(TwitchBot, botOpts);
    env.response.statusCode = 201;
    return next(env);
  });  
};
