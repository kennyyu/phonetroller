var WebSocketServer = require('ws').Server;
var express = require('express');
var http = require('http');
var port = process.env.PORT || 5000;
var app = express();

// Create an express application
var app = express();
app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});
app.use('/', express.static(__dirname + '/client'));

// Create an HTTP server
var server = http.createServer(app);
server.listen(port);
console.log("http server listening on port %d", port);

// Start the websocket server
var wss = new WebSocketServer({server: server});
wss.on('connection', function(ws) {
  ws.on('message', function(message) {
    console.log('received: %s', message);
  });
  ws.send('food', function(error) {
    if (error != null) {
      console.log('error: %s', error);
    }
  });
});

