// server.js
// Sets up the http and web socket servers

var WebSocketServer = require('ws').Server;
var express = require('express');
var http = require('http');
var manager = require('./lib/manager.js');
var port = process.env.PORT || 5000;

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

// Start the websocket server on the same port
var tokenGenerator = new manager.TokenGenerator();
var appmanager = new manager.ApplicationManager(tokenGenerator);
var wss = new WebSocketServer({server: server});
wss.on('connection', function(ws) {
  console.log('websocket open');

  ws.on('message', function(message) {
    console.log('received: %s', message);
    appmanager.handleMessage(ws, message);
  });

  ws.on('close', function() {
    console.log("websocket close");
  });
});
