$(document).ready(function() {
  if (window.DeviceMotionEvent == undefined) {
    document.getElementById("no").style.display="block";
    document.getElementById("yes").style.display="none";
    return;
  }

  // create a websocket connection to send acceleration estimates
  var host = location.origin.replace(/^http/, 'ws');
  var ws = new WebSocket(host);
  ws.onopen = function() {
    console.log("websocket open to %s", host);

    // catch motion events and send them on the websocket
    window.ondevicemotion = function(event) {
      var motion = {
        'ax': event.accelerationIncludingGravity.x,
        'ay': event.accelerationIncludingGravity.y,
        'az': event.accelerationIncludingGravity.z,
      };
      ws.send(JSON.stringify(motion));
    };
  };
  ws.onmessage = function(event) {
    $('#content').append('<p>' + event.data + '</p>');
  };
  ws.onclose = function() {
    console.log("websocket closed");
  };

});