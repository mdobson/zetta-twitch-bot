var argo = require('argo');
var router = require('argo-url-router');

argo()
  .get('/channel/{id}/bot/{botId}', function(handle) {
    handle('request', function(env, next) {
      var id = env.request.params.id;
      var botId = env.request.params.botId;  
    });  
  })
  .get('/channel/{id}', function(handle) {
    handle('request', function(env, next) {
      var id = env.request.params.id;
      
    });
  })
  .listen(1337)
