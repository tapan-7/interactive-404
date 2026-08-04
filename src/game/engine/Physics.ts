import { Ball } from "../entities/Ball";
import { Paddle } from "../entities/Paddle";
import { Modifier } from "../entities/Modifier";
import { GAME_CONSTANTS } from "../constants/Constants";

export class Physics {
  updateBall(ball: Ball, dt: number) {
    ball.x += ball.dx * ball.speed * dt;
    ball.y += ball.dy * ball.speed * dt;
  }

  updatePaddle(paddle: Paddle, dt: number, width: number) {
    paddle.x += paddle.dx * paddle.speed * dt;
    
    // Clamp to screen bounds
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > width) paddle.x = width - paddle.width;
  }

  updateModifiers(modifiers: Modifier[], dt: number) {
    for (const mod of modifiers) {
      if (mod.active) {
        mod.y += GAME_CONSTANTS.MODIFIER_SPEED * dt;
      }
    }
  }
}
