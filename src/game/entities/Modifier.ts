export type ModifierType = "GROW_PADDLE" | "SHRINK_PADDLE" | "SPEED_BALL" | "SLOW_BALL" | "EXTRA_BALL";

export class Modifier {
  x: number;
  y: number;
  type: ModifierType;
  active: boolean = true;
  size: number;

  constructor(x: number, y: number, type: ModifierType, size: number) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = size;
  }
}
