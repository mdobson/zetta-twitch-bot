//This zetta will serve as a proxy to all nodes that actually will run bots.
var zetta = require('zetta');

zetta()
  .name('bot-farm')
  .listen(1338);
