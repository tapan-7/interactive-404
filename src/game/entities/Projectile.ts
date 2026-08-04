export class Projectile {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  active: boolean;

  constructor(x: number, y: number, width: number, height: number, speed: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.active = true;
  }
}
