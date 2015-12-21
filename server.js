var zetta = require('zetta');
var twitch = require('./scout');

zetta()
  .use(twitch)
  .listen(1337);
