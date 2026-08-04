export class Ball {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  speed: number;
  active: boolean = true;
  pierceTimer: number = 0;

  constructor(x: number, y: number, radius: number, speed: number, dx: number, dy: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.dx = dx;
    this.dy = dy;
  }
}
