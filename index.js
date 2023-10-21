import Ball from './Ball.js';
import Paddle from'./Paddle.js';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.append(canvas);

const { innerWidth: iw, innerHeight: ih } = window;

const minv = iw > ih ? ih / 100 : iw / 100;

const canvasSize = minv * 80;

canvas.width = canvasSize;
canvas.height = canvasSize;

const ball = new Ball(canvasSize);
const paddle = new Paddle(canvasSize);

function draw() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  requestAnimationFrame(draw);
  ball.update();
  paddle.update();
  ball.checkRectCollision(paddle);
  ball.draw(ctx);
  paddle.draw(ctx);
}

draw();