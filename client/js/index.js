$(document).ready(function() {
  var delay = 10;
  var vMultiplier = 0.8; //0.05;
  var size = 20;
  var color = 'red';
  var ball = new Ball(size, color, vMultiplier,
    document.getElementById('content'));

  // update the position of the ball with current acceleration estimates
//  setInterval(function() {
//    ball.updatePosition();
//  }, delay);

  // create a websocket connection to receive acceleration estimates
  var host = location.origin.replace(/^http/, 'ws');
  var ws = new WebSocket(host);
  ws.onopen = function() {
    console.log("websocket open to %s", host);
    var connectMessage = {
      "type": "BROWSER_CONNECT",
    };
    ws.send(JSON.stringify(connectMessage));
  };
  ws.onmessage = function(event) {
    console.log(event.data);
    var data = JSON.parse(event.data);
    switch (data["type"]) {
      case "BROWSER_CONNECT_RESPONSE":
        var link = location.origin + "/device.html?token=" + data["token"];
        $("#token").html("TOKEN: " + data["token"] + "<br>" +
                         "Visit on your device: <a href='" + link + "'>" + link + "</a>");
        new QRCode(document.getElementById("qrcode"), link);
        break;
      case "DEVICE_EVENT":
        ball.updateAcceleration(data["payload"]);
//        ball.updatePosition();
        break;
      default:
        console.log("unexpected message type: %s", data["type"]);
        ws.close();
        break;
    }
  };
  ws.onclose = function() {
    console.log("websocket closed");
  };

});