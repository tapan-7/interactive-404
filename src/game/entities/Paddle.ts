export class Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  dx: number = 0;

  constructor(x: number, y: number, width: number, height: number, speed: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }
}
