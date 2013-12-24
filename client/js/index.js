$(document).ready(function() {
/**
 * PhysicsJS by Jasper Palfree <wellcaffeinated.net>
 * http://wellcaffeinated.net/PhysicsJS
 *
 * Simple "Hello world" example
 */

// Acceleration
var ax = 0;
var ay = 0;
var multiplier = 0.001;

Physics(function(world){

        var viewWidth = 1000;
        var viewHeight = 600;

        var renderer = Physics.renderer('canvas', {
                el: 'viewport',
                width: viewWidth,
                height: viewHeight,
                meta: false, // don't display meta data
                styles: {
                    // set colors for the circle bodies
                    'circle' : {
                        strokeStyle: 'hsla(60, 37%, 17%, 1)',
                        lineWidth: 1,
                        fillStyle: 'hsla(60, 37%, 57%, 0.8)',
                        angleIndicator: 'hsla(60, 37%, 17%, 0.4)'
                    }
                }
            });

        // add the renderer
        world.add( renderer );
        // render on each step
        world.subscribe('step', function(){
                world.render();
            });

        // bounds of the window
        var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);

        // constrain objects to these bounds
        world.add(Physics.behavior('edge-collision-detection', {
                    aabb: viewportBounds,
                        restitution: 0.0,
                        cof: 0.99
                        }));

        // add a circle
        var circle = Physics.body('circle', {
                          x: 50, // x-coordinate
                              y: 30, // y-coordinate
                              vx: 0.0, // velocity in x-direction
                              vy: 0.0, // velocity in y-direction
                              radius: 20,
                              })
        world.add(circle);

        // ensure objects bounce when edge collision is detected
        world.add( Physics.behavior('body-impulse-response') );

        // add some gravity
        //        world.add( Physics.behavior('constant-acceleration') );

        // subscribe to ticker to advance the simulation
        Physics.util.ticker.subscribe(function( time, dt ){

                circle.state.acc = Physics.vector(-ax * multiplier, -ay * multiplier);
                //console.log("%f %f %f %f", ax, ay, ax * multiplier, -ay * multiplier);
                //.vector(0.0, 0.0);
                circle.recalc();
                world.step( time );

            });

        // start the ticker
        Physics.util.ticker.start();

    });

 // Position Variables
var x = 0;
var y = 0;

// Speed - Velocity
var vx = 0;
var vy = 0;


var delay = 10;
var vMultiplier = 0.01;

if (window.DeviceMotionEvent==undefined) {
    return;
} else {
    window.ondevicemotion = function(event) {
        //ax = event.accelerationIncludingGravity.x;
        //ay = event.accelerationIncludingGravity.y;
        //ax = event.acceleration.x;
        //ay = event.acceleration.y;
    }
}


  var delay = 10;
  var vMultiplier = 0.8; //0.05;
  var size = 20;
  var color = 'red';
//  var ball = new Ball(size, color, vMultiplier,
//    document.getElementById('content'));

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
        //ball.updateAcceleration(data["payload"]);
        //ball.updatePosition();
        ax = data["payload"]["ax"];
        ay = data["payload"]["ay"];
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