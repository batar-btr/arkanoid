export default class Paddle {
  constructor(canvasSize) {
    this.w = canvasSize / 6;
    this.h = this.w;
    this.x = (canvasSize - this.w) / 2;
    this.y = canvasSize - this.h;
    this.color = 'orange';
    this.speed = 3;
    this.right = false;
    this.left = false;
    this.maxX = canvasSize - this.w;
    this.minX = 0;

    document.addEventListener('keydown', ({ key }) => {
      if (key === 'ArrowLeft') {
        this.left = true;
      }
      if (key === 'ArrowRight') {
        this.right = true;
      }
    });

    document.addEventListener('keyup', ({key}) => {
      if (key === 'ArrowLeft') {
        this.left = false;
      }
      if (key === 'ArrowRight') {
        this.right = false;
      }
    })

  }

  update() {
    if(this.right) {
      this.x += this.speed;
    } 
    if(this.left) {
      this.x -= this.speed;
    }
    if(this.x > this.maxX) this.x = this.maxX;
    if(this.x < this.minX) this.x = this.minX;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}