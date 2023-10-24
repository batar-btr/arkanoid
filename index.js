import Ball from './Ball.js';
import Brick from './Brick.js';
import Paddle from './Paddle.js';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const canvasWrap = document.querySelector('#canvas-wrap');
const bricksWrap = document.querySelector('.bricks');
canvasWrap.append(canvas);

const { innerWidth: iw, innerHeight: ih } = window;

const minv = iw > ih ? ih / 100 : iw / 100;

const canvasSize = minv * 80;

canvas.width = canvasSize;
canvas.height = canvasSize;

let pause = false;
const bricksRow = 10;
const bricksColumn = 4;
const bricksGap = 3;

bricksWrap.style.gridTemplateColumns = `repeat(${bricksRow}, 1fr)`;

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
      const brick = new Brick(x, y, brickWidth, brickHeight);
      bricksWrap.append(brick.elem);
      bricks[column][row] = brick;
    }
  }
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
        brick.hide();
        break;
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
  ball.draw(ctx, paddle);
  paddle.draw(ctx);
}

draw();

canvas.addEventListener('click', () => {
  pause = !pause;
  if(!pause) draw();
});

document.addEventListener('keydown', ({key}) => {
  if(key !== 'ArrowUp' && key !== 'ArrowDown') return;
  if(key === 'ArrowUp') {
    ball.speed += 0.1;
  }
  if(key === 'ArrowDown') {
    ball.speed -= 0.1;
  }

  const shiftXMinus = Math.sign(ball.shift.x) === -1 ? -1 : 1;
  const shiftYMinus = Math.sign(ball.shift.y) === -1 ? -1 : 1;
  console.log(shiftXMinus, shiftYMinus);

  ball.shift.x = Math.cos(ball.angle) * ball.speed;
  ball.shift.y = Math.sin(ball.angle) * ball.speed;
})

console.dir(function() {})
console.dir(() => {})