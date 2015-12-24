//Authenticate with twitch
Twitch.init({clientId: creds.clientId}, function(error, status) {
  if(status.authenticated) {
    $('.twitch-connect').hide(); 
    var token = Twitch.getToken();
    $('#token').html('Your token is: ' + token);
  } else {
    $('.twitch-connect').on('click', function() {
      console.log('clicked');
      Twitch.login({
        scope: ['user_read', 'channel_read', 'chat_login']
      });  
    });   
  }
});

