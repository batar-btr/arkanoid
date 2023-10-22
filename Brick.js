import { randomColor } from './utils.js';

export default class Brick {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = 'gray';
    this.alive = true;
  }
  draw(ctx) {
    if (this.alive) {
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.w, this.h);
      ctx.restore();
    }
  }
}