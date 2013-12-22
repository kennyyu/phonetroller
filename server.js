var WebSocketServer = require('ws').Server;
var express = require('express');

var WEBSOCKET_SERVER_PORT = 8080;
var HTTP_SERVER_PORT = 8000;

// Start the websocket server
var wsserver = new WebSocketServer({port: WEBSOCKET_SERVER_PORT});
wsserver.on('connection', function(ws) {
  ws.on('message', function(message) {
    console.log('received: %s', message);
  });
  ws.send('food', function(error) {
    if (error != null) {
      console.log('error: %s', error);
    }
  });
});

// Start the http server
var app = express();
app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});
app.use('/', express.static(__dirname + '/client'));
app.listen(HTTP_SERVER_PORT);
