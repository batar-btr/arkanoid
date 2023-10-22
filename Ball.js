import { isWallCollision } from './utils.js';

export default class Ball {
  constructor(canvasw) {
    this.w = canvasw;
    this.h = canvasw;
    this.radius = Math.floor(canvasw / 60);
    this.x = canvasw / 2;
    this.y = canvasw / 2;
    this.color = 'green';
    this.angle = Math.PI * 2 * 0.6; // angle in rad
    this.speed = 3;
    this.shift = {
      x: Math.cos(this.angle) * this.speed,
      y: Math.sin(this.angle) * this.speed
    };
  }
  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  update() {
    this.x += this.shift.x;
    this.y += this.shift.y;

    if (isWallCollision(this.x, this.radius, this.w)) { // check side wall collision
      this.shift.x *= -1;
    }

    if (this.y < this.radius) { // check roof collision
      this.shift.y *= -1;
      this.y = this.radius;
    }

    if (this.y > this.h - this.radius) { // check losing game
      this.shift.y *= -1;
      this.y = this.h - this.radius;
    }
    // console.log('Update:',this.x, this.y);
  }

  checkRectCollision(rect) {
    const { x, y, w, h } = rect;

    const centerRectX = x + w / 2;
    const centerRectY = y + h / 2;

    const distX = Math.abs(this.x - x - w / 2); // X distance between rect and circle centers
    const distY = Math.abs(this.y - y - h / 2); // Y distance between rect and circle centers

    if (distX > (w / 2 + this.radius)) { // not collision
      return false;
    }
    if (distY > (h / 2 + this.radius)) { // not collision
      return false;
    }

    if (distX < (w / 2)) { // hit top or bottom side
      this.shift.y *= -1;
      return true;
    }

    if (distY < (h / 2)) { // hit left or right side
      if (this.x < centerRectX) { // hit left side
        this.x = x - this.radius;
      }
      if (this.x > centerRectX) { //hit right side
        this.x = x + w + this.radius;
      }
      this.shift.x *= -1;
      return true;
    }
    ////////////peak collision!!!!!!!!!!!!!!!!!
    const legX = distX - w / 2;
    const legY = distY - h / 2;

    const hypot = Math.hypot(legX, legY);

    if (hypot < this.radius) { // peak collision detected

      const rectPeaks = {
        A: { x, y: y + h },
        B: { x, y },
        C: { x: x + w, y },
        D: { x: x + w, y: y + h }
      };

      const collisionPeak = Object.entries(rectPeaks).map(([key, { x, y }]) => { // Give a peak A || B || C || D
        const legX = this.x - x;
        const legY = this.y - y;
        const hypot = Math.hypot(legX, legY);
        return [key, hypot];
      }).sort((a, b) => a[1] - b[1])[0][0]; // Get smallest hypot => get peak

      const newAngle = Math.acos(legX / hypot);

      const shiftX = Math.cos(newAngle) * this.radius;
      const shiftY = Math.sin(newAngle) * this.radius;



      this.angle = newAngle;

      const isMinusX = Math.sign(this.shift.x) === 1 ? 1 : -1;
      const isMinusY = Math.sign(this.shift.y) === 1 ? 1 : -1;
      this.shift.x = Math.cos(newAngle) * this.speed * isMinusX;
      this.shift.y = Math.sin(newAngle) * this.speed * isMinusY;

      switch (collisionPeak) {
        case 'A':
          this.x = x - shiftX;
          this.y = y + shiftY;
          break;
        case 'B':
          this.x = x - shiftX;
          this.y = y - shiftY;
          console.log('Hit B');
          break;
        case 'C':
          this.x = x + w + shiftX;
          this.y = y - shiftY;
          console.log('Hit C');
          break;
        case 'D':
          this.x = x + w + shiftX;
          this.y = y + h + shiftY;
          break;
      }


      this.shift.x *= -1;
      this.shift.y *= -1;
      return true;
    }
    return false;

  }


}