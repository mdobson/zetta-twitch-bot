var http = require('http');

var opts = {
  host: 'localhost',
  port: '1338',
  path: '/channel/mdobs/bot/603297d5-6b8c-42b6-8278-085b905f835d',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'  
  }  
};

var req = http.request(opts, function(response) {
  console.log('StatusCode: ', response.statusCode);
  if(response.statusCode === 201) {
    return console.log('created');
  }
});

var body = 'action=start';

req.write(new Buffer(body));
req.end();
