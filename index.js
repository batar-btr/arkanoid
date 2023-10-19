const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.append(canvas);

const { innerWidth: iw, innerHeight: ih } = window;

const minv = iw > ih ? ih / 100 : iw / 100;

const canvasSize = minv * 80;

canvas.width = canvasSize;
canvas.height = canvasSize;

class Ball {
  constructor(canvasWidth) {
    this.width = canvasWidth;
    this.height = canvasWidth;
    this.radius = Math.floor(canvasWidth / 40);
    this.x = canvasWidth / 2;
    this.y = canvasWidth / 2;
    this.color = 'green';
    this.angle = Math.PI*2*0.6;
    this.speed = 1;
    this.shift = {
      x: Math.cos(this.angle) * this.speed,
      y: Math.sin(this.angle) * this.speed
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update() {
    this.x += this.shift.x;
    this.y += this.shift.y;

    if(this.x <= this.radius || this.x >= this.width - this.r ) {
      this.shift.x *= -1;
    }

    console.log(this.x)

  }
}

const settings = {

};

const ball = new Ball(canvasSize);
console.log(ball);


function draw() {
  ctx.clearRect(0,0, canvasSize, canvasSize);
  requestAnimationFrame(draw);
  ball.update();
  ball.draw(ctx);
}

draw();