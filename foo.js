/**
 * PhysicsJS by Jasper Palfree <wellcaffeinated.net>
 * http://wellcaffeinated.net/PhysicsJS
 *
 * Simple "Hello world" example
 */

// Acceleration
var ax = 0;
var ay = 0;
var multiplier = 0.01;

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
                        restitution: 0.99,
                        cof: 0.99
                        }));

        // add a circle
        var circle = Physics.body('circle', {
                          x: 50, // x-coordinate
                              y: 30, // y-coordinate
                              vx: 0.2, // velocity in x-direction
                              vy: 0.01, // velocity in y-direction
                              radius: 20
                              })
        world.add(circle);

        // ensure objects bounce when edge collision is detected
        world.add( Physics.behavior('body-impulse-response') );

        // add some gravity
        //        world.add( Physics.behavior('constant-acceleration') );

        // subscribe to ticker to advance the simulation
        Physics.util.ticker.subscribe(function( time, dt ){

                circle.state.acc = Physics.vector(ax * multiplier, -ay * multiplier);
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
        //        ax = event.accelerationIncludingGravity.x;
        //        ay = event.accelerationIncludingGravity.y;
        ax = event.acceleration.x;
        ay = event.acceleration.y;
    }
    /*
    setInterval(function() {
            vy = vy + -(ay);
            vx = vx + ax;

            var ball = document.getElementById("ball");
            y = parseInt(y + vy * vMultiplier);
            x = parseInt(x + vx * vMultiplier);

            if (x<0) { x = 0; vx = 0; }
            if (y<0) { y = 0; vy = 0; }
            if (x>document.documentElement.clientWidth-20) { x = document.documentElement.clientWidth-20; vx = 0; }
            if (y>document.documentElement.clientHeight-20) { y = document.documentElement.clientHeight-20; vy = 0; }

            ball.style.top = y + "px";
            ball.style.left = x + "px";
        }, delay);
    */
}
