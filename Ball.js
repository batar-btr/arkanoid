import { isWallCollision } from './utils.js';

export default class Ball {
  constructor(canvasw) {
    this.w = canvasw;
    this.h = canvasw;
    this.radius = Math.floor(canvasw / 30);
    this.x = canvasw / 2;
    this.y = canvasw / 2;
    this.color = '#1f1f1f';
    this.angle = Math.PI * 2 * 0.6; // angle in rad
    this.speed = 1;
    this.shift = {
      x: Math.cos(this.angle) * this.speed,
      y: Math.sin(this.angle) * this.speed
    };
  }
  draw(ctx, paddle) {
    const paddleCenter = paddle.x + paddle.w / 2;
    const legX = paddleCenter - this.x;
    const legY = this.h - this.y;
    const hypot = Math.hypot(legX, legY);
    const angle = Math.acos(legX / hypot);

    const eyeBall = this.radius / 3;
    const pupil = eyeBall * 0.6;
    const eyeShiftX = this.radius * 0.4;
    const eyeShiftY = eyeShiftX / 2;

    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'whitesmoke';
    ctx.translate(this.x, this.y); // center ball
    ctx.beginPath();
    ctx.arc(eyeShiftX, -eyeShiftY, eyeBall, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.translate(eyeShiftX, -eyeShiftY); // right eye
    ctx.rotate(angle);
    ctx.fillStyle = '#1f1f1f';
    ctx.beginPath();
    ctx.arc(eyeBall - pupil, 0, pupil, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.arc(-eyeShiftX, -eyeShiftY, eyeBall, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.translate(-eyeShiftX, -eyeShiftY); // left eye
    ctx.rotate(angle);
    ctx.fillStyle = '#1f1f1f';
    ctx.beginPath();
    ctx.arc(eyeBall - pupil, 0, pupil, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = 'whitesmoke';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0,0,this.radius * 0.7, Math.PI * 0.2, Math.PI * 0.8);
    ctx.stroke();
    // ctx.fillStyle = 'green'
    // ctx.font = '14px Arial';
    // ctx.textAlign = 'center';
    // ctx.textBaseline = 'middle';
    // ctx.fillText(angle, 0, 0);
    ctx.restore();
  }

  update() {
    this.x += this.shift.x;
    this.y += this.shift.y;

    if (isWallCollision(this.x, this.radius, this.w)) { // check side wall collision
      if (this.x > this.w / 2) {
        this.x = this.w - this.radius;
      }
      if (this.x < this.w / 2) {
        this.x = this.radius;
      }
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

      this.shift.x = Math.abs(Math.cos(newAngle) * this.speed);
      this.shift.y = Math.abs(Math.sin(newAngle) * this.speed);

      switch (collisionPeak) {
        case 'A':
          this.x = x - shiftX;
          this.y = y + h + shiftY;
          this.shift.x *= -1;
          console.log('A');
          break;
        case 'B':
          this.x = x - shiftX;
          this.y = y - shiftY;
          this.shift.x *= -1;
          this.shift.y *= -1;
          break;
        case 'C':
          this.x = x + w + shiftX;
          this.y = y - shiftY;
          this.shift.y *= -1;
          break;
        case 'D':
          this.x = x + w + shiftX;
          this.y = y + h + shiftY;
          break;
      }

      return true;
    }
    return false;

  }


}