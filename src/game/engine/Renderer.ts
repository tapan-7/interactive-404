import { Ball } from "../entities/Ball";
import { Paddle } from "../entities/Paddle";
import { Brick } from "../entities/Brick";
import { Modifier } from "../entities/Modifier";
import { GAME_CONSTANTS } from "../constants/Constants";

export class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  clear(width: number, height: number) {
    this.ctx.clearRect(0, 0, width, height);
  }

  drawBricks(bricks: Brick[]) {
    this.ctx.fillStyle = GAME_CONSTANTS.BRICK_COLOR;
    for (const brick of bricks) {
      if (brick.active) {
        this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
      }
    }
  }

  drawPaddle(paddle: Paddle) {
    this.ctx.fillStyle = GAME_CONSTANTS.PADDLE_COLOR;
    if (this.ctx.roundRect) {
      this.ctx.beginPath();
      this.ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, paddle.height / 2);
      this.ctx.fill();
    } else {
      this.ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }
  }

  drawBalls(balls: Ball[]) {
    this.ctx.fillStyle = GAME_CONSTANTS.BALL_COLOR;
    for (const ball of balls) {
      if (ball.active) {
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.closePath();
      }
    }
  }

  drawModifiers(modifiers: Modifier[]) {
    // Basic rectangle rendering
    for (const mod of modifiers) {
      if (mod.active) {
        this.ctx.fillStyle = this.getModifierColor(mod.type);
        this.ctx.fillRect(mod.x, mod.y, mod.size, mod.size);
      }
    }
  }

  private getModifierColor(type: string): string {
    switch (type) {
      case "GROW_PADDLE": return "#10b981"; // green
      case "SHRINK_PADDLE": return "#ef4444"; // red
      case "SPEED_BALL": return "#f59e0b"; // orange
      case "SLOW_BALL": return "#3b82f6"; // blue
      case "EXTRA_BALL": return "#8b5cf6"; // purple
      default: return "#1d1d1d";
    }
  }

  private getModifierSymbol(type: string): string {
    switch (type) {
      case "GROW_PADDLE": return "+";
      case "SHRINK_PADDLE": return "-";
      case "SPEED_BALL": return ">>";
      case "SLOW_BALL": return "<<";
      case "EXTRA_BALL": return "x2";
      default: return "?";
    }
  }
}
