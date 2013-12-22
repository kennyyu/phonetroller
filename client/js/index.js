$(document).ready(function() {
  var delay = 10;
  var vMultiplier = 0.15;
  var size = 20;
  var color = 'red';
  var ball = new Ball(size, color, vMultiplier,
    document.getElementById('content'));

  // update the position of the ball with current acceleration estimates
  setInterval(function() {
    ball.updatePosition();
  }, delay);

  // create a websocket connection to receive acceleration estimates
  var host = location.origin.replace(/^http/, 'ws');
  var ws = new WebSocket(host);
  ws.onopen = function() {
    console.log("websocket open to %s", host);
  };
  ws.onmessage = function(event) {
    $('#content').append('<p>' + event.data + '</p>');
    var motion = JSON.parse(event.data);
    ball.updateAcceleration(motion);
  };
  ws.onclose = function() {
    console.log("websocket closed");
  };

/*
  if (window.DeviceMotionEvent == undefined) {
    document.getElementById("no").style.display="block";
    document.getElementById("yes").style.display="none";
  } else {
    window.ondevicemotion = function(event) {
      var motion = {
        'ax': event.accelerationIncludingGravity.x,
        'ay': event.accelerationIncludingGravity.y,
        'az': event.accelerationIncludingGravity.z,
      };
      ball.updateAcceleration(motion);
    };

    setInterval(function() {
      ball.updatePosition();
    }, delay);
  }
  */
});