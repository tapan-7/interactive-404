import { ModifierType } from "./Modifier";

export class Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  modifier: ModifierType;
  active: boolean = true;

  constructor(x: number, y: number, width: number, height: number, modifier: ModifierType) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.modifier = modifier;
  }
}
