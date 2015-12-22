var http = require('http');

var opts = {
  host: 'localhost',
  port: '1337',
  path: '/bot/create',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'  
  }  
};

var req = http.request(opts, function(response) {
  console.log('StatusCode: ', response.statusCode);
  if(response.statusCode === 201) {
    return console.log('created');
  }
});

var body = {
  username: 'mdobs',
  token: process.env.TOKEN,
  channel: 'mdobs'  
}
console.log(body);
req.write(JSON.stringify(body));
req.end();
