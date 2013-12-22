// server.js
// Sets up the http and web socket servers

var WebSocketServer = require('ws').Server;
var express = require('express');
var http = require('http');
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
var wss = new WebSocketServer({server: server});
wss.on('connection', function(ws) {
  console.log('websocket open');
  ws.on('message', function(message) {
    console.log('received: %s', message);
  });
  var id = setInterval(function() {
    var data = {
      "date": new Date(),
      "ax": 1.0,
      "ay": 2.0,
      "az": 0.0
    };
    ws.send(JSON.stringify(data), function(error) {
      if (error != null) {
        console.log('websocket error: %s', error);
        clearInterval(id);
      }
    });
  }, 1000);
  ws.on('close', function() {
    console.log("websocket close");
    clearInterval(id);
  });
});

