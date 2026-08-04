import { Ball } from "../entities/Ball";
import { Paddle } from "../entities/Paddle";
import { Brick } from "../entities/Brick";
import { Modifier } from "../entities/Modifier";
import { Projectile } from "../entities/Projectile";
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
    for (const ball of balls) {
      if (ball.active) {
        this.ctx.fillStyle = GAME_CONSTANTS.BALL_COLOR;
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.closePath();

        // Visual indicator for piercing ball (white center)
        if (ball.pierceTimer > 0) {
          this.ctx.fillStyle = "#ffffff";
          this.ctx.beginPath();
          this.ctx.arc(ball.x, ball.y, ball.radius * 0.4, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.closePath();
        }
      }
    }
  }

  drawModifiers(modifiers: Modifier[]) {
    for (const mod of modifiers) {
      if (mod.active) {
        this.ctx.fillStyle = "#1d1d1d";
        this.ctx.font = `${mod.size * 1.4}px serif`;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText("♣", mod.x + mod.size / 2, mod.y + mod.size / 2);
      }
    }
  }

  drawProjectiles(projectiles: Projectile[]) {
    this.ctx.fillStyle = "#1d1d1d"; // Match premium look
    for (const proj of projectiles) {
      if (proj.active) {
        this.ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
      }
    }
  }
}
