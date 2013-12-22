var WebSocketServer = require('ws').Server;

var wsserver = new WebSocketServer({port: 8080});
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