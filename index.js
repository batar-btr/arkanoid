import Ball from './Ball.js';
import Brick from './Brick.js';
import Paddle from './Paddle.js';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.append(canvas);

const { innerWidth: iw, innerHeight: ih } = window;

const minv = iw > ih ? ih / 100 : iw / 100;

const canvasSize = minv * 80;

canvas.width = canvasSize;
canvas.height = canvasSize;

let pause = false;
const bricksRow = 20;
const bricksColumn = 10;
const bricksGap = 3;

const ball = new Ball(canvasSize);
const paddle = new Paddle(canvasSize);

const bricks = [];

function initBricks() {

  const brickWidth = (canvasSize - bricksGap * (bricksRow + 1)) / bricksRow;
  const brickHeight = brickWidth / 2;

  for (let column = 0; column < bricksColumn; column++) {
    bricks[column] = [];
    for (let row = 0; row < bricksRow; row++) {
      const x = (row + 1) * bricksGap + row * brickWidth;
      const y = (column + 1) * bricksGap + column * brickHeight;
      bricks[column][row] = new Brick(x, y, brickWidth, brickHeight);
    }
  }
  console.log(bricks);
}

initBricks();

function drawBricks() {
  for (let column = 0; column < bricksColumn; column++) {
    for (let row = 0; row < bricksRow; row++) {
      bricks[column][row].draw(ctx);
    }
  }
}

function checkBricksCollision() {
  for (let column = 0; column < bricksColumn; column++) {
    for (let row = 0; row < bricksRow; row++) {
      const brick = bricks[column][row];
      if(!brick.alive) continue;
      const isCollision = ball.checkRectCollision(brick);
      if (isCollision) {
        brick.alive = false;
      }
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  if (!pause) requestAnimationFrame(draw);
  ball.update();
  paddle.update();
  ball.checkRectCollision(paddle);
  checkBricksCollision();
  drawBricks();
  ball.draw(ctx);
  paddle.draw(ctx);
}

draw();

canvas.addEventListener('click', () => {
  pause = !pause;
  if(!pause) draw();
});

document.addEventListener('keydown', ({key}) => {
  console.log(ball.shift.x, ball.shift.y);
})