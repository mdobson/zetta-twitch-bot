var zetta = require('zetta');
var twitch = require('./scout');
var app = require('./app');

zetta()
  .use(twitch)
  .use(app)
  .listen(1337);
