// ball.js
// Defines a ball class to react to acceleration changes.

// Create a ball
// - size (int)
// - color (string)
// - vMulitplier (float)
var Ball = function(size, color, vMultiplier, element) {
  this.size = size;
  this.color = color;
  this.x = 0;
  this.y = 0;
  this.vx = 0.0;
  this.vy = 0.0;
  this.ax = 0.0;
  this.ay = 0.0;
  this.vMultiplier = vMultiplier;

  var div = document.createElement('div');
  div.style["width"] = this.size + "px";
  div.style["height"] = this.size + "px";
  div.style["border-radius"] = (this.size / 2) + "px";
  div.style["-webkit-radius"] = (this.size / 2) + "px";
  div.style["background-color"] = this.color;
  div.style["position"] = "absolute";
  div.style["top"] = this.y + "px";
  div.style["left"] = this.x + "px";
  element.appendChild(div);
  this.div = div;
};

// Update the ball's acceleration, but don't update position
// - ax (float)
// - ay (float)
// - az (float)
Ball.prototype.updateAcceleration = function(motion) {
  this.div.style["top"] = parseInt($(document).height() * motion.y * 1.0 / motion.height);
  this.div.style["left"] = parseInt($(document).width() * motion.x * 1.0 / motion.width);
  console.log("%d, %d", this.div.style["left"], this.div.style["top"]);
//  this.ax = motion.ax;
//  this.ay = motion.ay;
};

// Update the ball's position
Ball.prototype.updatePosition = function() {
  this.vx = this.vx + this.ax;
  this.vy = this.vy + -(this.ay);
  this.x = parseInt(this.x + this.vx * this.vMultiplier);
  this.y = parseInt(this.y + this.vy * this.vMultiplier);

  if (this.x < 0) {
    this.x = 0;
    this.vx = 0;
  }
  if (this.y < 0) {
    this.y = 0;
    this.vy = 0;
  }
  if (this.x > document.documentElement.clientWidth - 20) {
    this.x = document.documentElement.clientWidth - 20;
    this.vx = 0;
  }
  if (this.y > document.documentElement.clientHeight - 20) {
    this.y = document.documentElement.clientHeight-20;
    this.vy = 0;
  }
  var jdiv = $(this.div);
  jdiv.animate({
    left: this.x + "px",
    top: this.y + "px",
  }, 1);
//  this.div.style["top"] = this.y + "px";
//  this.div.style["left"] = this.x + "px";
};
