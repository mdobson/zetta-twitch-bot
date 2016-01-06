var rules = {};

var RulesResource = module.exports = function() {
  this.path = '/rules';  
}

RulesResource.prototype.init = function(config) {
  config
    .path(this.path)
    .produces('application/vnd.siren+json')
    .consumes('application/json')
    .get('/{channel}', this.list)
    .post('/{channel}', this.create);  
}

RulesResource.prototype.list = function(env, next) {
  var channel = env.route.params.channel;
  var response = {
    class: ['rules'],
    entities: [],
    actions: [
      {
        name: 'create-rule',
        method: 'POST',
        href: env.helpers.url.current(),
        type: 'application/json',
        fields: [
          {
            name: 'key',
            type: 'text'  
          },
          {
            name: 'message',
            type: 'text'  
          }
        ]
      }
    ],
    links: [
      {
        rel: ['self'],
        href: env.helpers.url.current()  
      }
    ]  
  }

  env.response.body = response;
  env.response.statusCode = 200;
  next(env);
};

RulesResource.prototype.create = function(env, next) {
  var channel = env.route.params.channel;
};

RulesResource.create = function(channel, key, message) {
    
};
