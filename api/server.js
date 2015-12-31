var qs = require('querystring');
var argo = require('argo');
var router = require('argo-url-router');
var urlHelper = require('argo-url-helper');
var http = require('http');


function targetPath() {
  return process.env.ZETTA_URL || 'http://localhost:1337'
}

function formatUrl(ql) {
  var query = {ql: ql, server: '*'};
  var url = targetPath();
  var queryString = qs.stringify(query);
  return url + '?' + queryString;
}

function formatBotUrl(channel, botId, env) {
  return env.helpers.url.path('/channel/'+channel+'/bot/'+botId); 
}

argo()
  .use(router)
  .use(urlHelper)
  .get('/channel/{id}',function(handle) {
    handle('request', function(env, next) {
      var channel = env.route.params.id;
      var query = 'where type="twitch-chat-bot" and channel = "' + channel +'"'; 
      env.target.url = formatUrl(query);
      next(env);
    });

    handle('response', function(env, next) {
      var response = {
        class: ['root'],
        entities: [],
        links: [
          {
            rel: ['self'],
            href: env.helpers.url.current()  
          }
        ]  
      }
      env.target.response.getBody(function(err, body) {
        body = JSON.parse(body.toString());
        if(body.entities.length) {
          body.entities.forEach(function(bot) {
            var entity = {
              class: ['bot'],
              rel: [
                'http://rels.zork.io/bot'
              ],
              properties: bot.properties,
              links: [
                {
                  rel: ['self'],
                  href: formatBotUrl(bot.properties.channel, bot.properties.id, env)  
                }
              ]
            }  
            response.entities.push(entity);
          });  
        } 
        env.response.body = response;
        env.response.statusCode = 200;
        return next(env);
      });  
    });
  })
  .get('/channel/{id}/bot/{botId}', function(handle) {
    handle('request', function(env, next) {
      var channel = env.route.params.id;
      var botId = env.route.params.botId; 
      var query = 'where type="twitch-chat-bot" and channel = "' + channel +'" and id="'+ botId +'"';
      var targetUrl = formatUrl(query);
      http.get(targetUrl, function(response) {
        var buf = [];
        if(response.statusCode === 200) {
          response.on('data', function(d) {
            buf += d;  
          });

          response.on('end', function() {
            var body = JSON.parse(buf.toString()); 
            if(body.entities.length) {
              var entity = body.entities[0];
              entity.links.forEach(function(link) {
                if(link.rel.indexOf('self') > -1) {
                  env.target.url = link.href;  
                  return next(env);
                }  
              });  
            }
            else {
              env.response.statusCode = 404;
              return next(env); 
            }
          });  
        }
        else {
          env.response.statusCode = 404;
          next(env);  
        }  
      });
    });

    handle('response', function(env, next) {
      if(env.target.response.statusCode === 200) {
        var entity = {
          class: ['bot'],
          properties: {},
          actions: [],
          links: [
            {
              rel: ['self'],
              href: env.helpers.url.current()
            }
          ]  
        }  

        env.target.response.getBody(function(err, body) {
          body = JSON.parse(body.toString());  
         
          entity.properties = body.properties;
          
          if(body.actions.length) {
            body.actions.forEach(function(action) {
              action.href = formatBotUrl(body.properties.channel, body.properties.id, env);
              entity.actions.push(action);   
            }); 
          } 

          if(body.links.length) {
            body.links.forEach(function(link) {
              if(link.title === 'messages') {
                var linkEntity = {
                  title: 'messages',
                  rel: [
                    'monitor',
                    'http://rels.zork.io/chat'
                  ],
                  href: formatBotUrl(body.properties.channel, body.properties.id, env).replace(/^http/, 'ws')
                }  
                entity.links.push(linkEntity);
              }  
            });  
          }

          env.response.statusCode = 200;
          env.response.body = entity;
          return next(env);
        });
      } else {
        return next(env);
      }
      
    });
  })
  .post('/bot/create', function(handle) {
    handle('request', function(env, next) {
      env.target.url = targetPath() + '/bot/create';  
    });  
  })
  .listen(1338);
