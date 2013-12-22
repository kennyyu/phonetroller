$(document).ready(function() {
  var host = location.origin.replace(/^http/, 'ws');
  var ws = new WebSocket(host);
  ws.onmessage = function(event) {
    $("#yes").append("<p>" + event.data + "</p>");
  };
});