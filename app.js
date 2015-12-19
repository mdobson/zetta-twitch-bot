module.exports = function(server) {
  var twitchQuery = server.where({ type: 'twitch-chat-bot' });
  server.observe([twitchQuery], function(bot) {
    var botMessages = bot.createReadStream('messages');
    
    botMessages.on('data', function(message) {
    });  
  }):   
}
