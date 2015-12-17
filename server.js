var zetta = require('zetta');
var twitch = require('./twitch');

zetta()
  .use(twitch)
  .listen(1337);
