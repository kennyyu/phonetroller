// manager.js
// Backend for linking devices with the browsers that they
// control.

// Class that generates globally unique ids
module.exports.TokenGenerator = function() {
  this.tokens = {}; // acts like a set
};

var TokenGenerator = module.exports.TokenGenerator;

// Generate a unique ID
TokenGenerator.prototype.generate = function() {
  var token;
  do {
    // hack taken from: http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    token = 'xxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  } while (token in this.tokens);
  this.tokens[token] = true;
  return token;
};

// Frees the ID if it was allocated
TokenGenerator.prototype.free = function(token) {
  delete this.tokens[token];
};

// Manages all relationships between browser and device websockets.
// Maintains a map from token -> object with these fields
// 'browser' -> ws
// 'device' -> ws
module.exports.DeviceManager = function(tokenGenerator) {
  this.applications = {};
  this.tokenGenerator = tokenGenerator;
};

var DeviceManager = module.exports.DeviceManager

// Handles the given message sent from the websocket
DeviceManager.prototype.handleMessage = function(ws, message) {
  var data = JSON.parse(message);
  switch (data["type"]) {
    case "BROWSER_CONNECT":
      this.handleBrowserConnect(ws);
      break;
    case "DEVICE_CONNECT":
      var token = data["token"];
      this.handleDeviceConnect(ws, token);
      break;
    case "DEVICE_EVENT":
      var token = data["token"];
      var payload = data["payload"];
      this.handleDeviceEvent(token, payload);
      break;
    default:
      console.log("unexpected message type: %s", data["type"]);
      break;
  }
};

// Cleans up the resources for this token. If onlyDevice is true,
// this will only cleanup the device with that token.
DeviceManager.prototype.cleanupApplication = function(token, onlyDevice) {
  if (token === undefined) {
    return;
  }
  var application = this.applications[token];
  if (application === undefined) {
    return;
  }
  if ("device" in application) {
    application["device"].close();
  }
  if (!onlyDevice) {
    if ("browser" in application) {
      application["browser"].close();
    }
    delete this.applications[token];
    this.tokenGenerator.free(token);
  }
};

// Handles BROWSER_CONNECT messages.
// This will generate a token and send it back along the browser
// websocket.
DeviceManager.prototype.handleBrowserConnect = function(ws) {
  var token = this.tokenGenerator.generate();
  this.applications[token] = {"browser": ws};
  var response = {
    "type": "BROWSER_CONNECT_RESPONSE",
    "token": token,
  };
  var manager = this;
  ws.send(JSON.stringify(response), function(error) {
    if (error != null) {
      console.log(error);
      manager.cleanupApplication(token, false);
    }
  });
};

// Handles DEVICE_CONNECT messages.
// This verifies that the token sent along the device websocket
// is legal.
DeviceManager.prototype.handleDeviceConnect = function(ws, token) {
  var type;
  if (token === undefined || !(token in this.applications)) {
    type = "ERROR";
  } else {
    type = "DEVICE_CONNECT_RESPONSE";
    this.applications[token]["device"] = ws;
  }
  var response = {"type": type};
  var manager = this;
  ws.send(JSON.stringify(response), function(error) {
    if (error != null) {
      console.log(error);
      manager.cleanupApplication(token, true);
    }
  });
};

// Handles DEVICE_EVENT messages.
// This forwards it to the browser websocket with the given token.
DeviceManager.prototype.handleDeviceEvent = function(token, payload) {
  if (token === undefined || payload === undefined) {
    return;
  }
  var response = {
    "type": "DEVICE_EVENT",
    "token": token,
    "payload": payload,
  };
  var manager = this;
  this.applications[token]["browser"].send(JSON.stringify(response), function(error) {
    if (error != null) {
      console.log(error);
      manager.cleanupApplication(token, true);
    }
  });
  return true;
};
