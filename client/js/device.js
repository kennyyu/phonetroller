$(document).ready(function() {
  if (window.DeviceMotionEvent == undefined) {
    document.getElementById("no").style.display="block";
    document.getElementById("yes").style.display="none";
    return;
  }

  // taken from: http://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) == variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return null;
  }

  // create a websocket connection to send acceleration estimates
  var token = getQueryVariable("token");
  if (token == null) {
    $("#yes").html("NO TOKEN PROVIDED");
    return;
  }
  $("#yes").html("TOKEN PROVIDED: " + token);
  var host = location.origin.replace(/^http/, 'ws');
  var ws = new WebSocket(host);
  ws.onopen = function() {
    console.log("websocket open to %s", host);
    var connectMessage = {
      "type": "DEVICE_CONNECT",
      "token": token,
    }
    ws.send(JSON.stringify(connectMessage));
  };
  ws.onmessage = function(event) {
    console.log(event.data);
    var data = JSON.parse(event.data);
    switch (data["type"]) {
      case "DEVICE_CONNECT_RESPONSE":
        // catch motion events and send them on the websocket
        window.ondevicemotion = function(event) {
          var motion = {
            "type": "DEVICE_EVENT",
            "token": token,
            "payload": {
              "ax": event.accelerationIncludingGravity.x,
              "ay": event.accelerationIncludingGravity.y,
              "az": event.accelerationIncludingGravity.z,
            }
          };
          ws.send(JSON.stringify(motion));
        };
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