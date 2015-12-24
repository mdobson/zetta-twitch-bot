var qs = require('querystring');
var argo = require('argo');
var router = require('argo-url-router');


function targetPath() {
  return process.env.ZETTA_URL || 'http://localhost:1337'
}

function formatUrl(ql) {
  var query = {ql: ql, server: '*'};
  var url = targetPath();
  var queryString = qs.stringify(query);
  return url + '?' + queryString;
}


argo()
  .use(router)
  .get('/channel/{id}',function(handle) {
    handle('request', function(env, next) {
      var channel = env.route.params.id;
      var query = 'where type="twitch-chat-bot" and channel = "' + channel +'"'; 
      env.target.url = formatUrl(query);
      next(env);
    });
  })
  .get('/channel/{id}/bot/{botId}', function(handle) {
    handle('request', function(env, next) {
      var channel = env.route.params.id;
      var botId = env.route.params.botId; 
      var query = 'where type="twitch-chat-bot" and channel = "' + channel +'" and id="'+ botId +'"';
      env.target.url = formatUrl(query);
      next(env);
    });
  })
  .post('/bot/create', function(handle) {
    handle('request', function(env, next) {
      env.target.url = targetPath() + '/bot/create';  
    });  
  })
  .listen(1338);
