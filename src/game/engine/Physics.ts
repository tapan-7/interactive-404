import { Ball } from "../entities/Ball";
import { Paddle } from "../entities/Paddle";
import { Modifier } from "../entities/Modifier";
import { Projectile } from "../entities/Projectile";
import { GAME_CONSTANTS } from "../constants/Constants";

export class Physics {
  updateBall(ball: Ball, dt: number) {
    ball.x += ball.dx * ball.speed * dt;
    ball.y += ball.dy * ball.speed * dt;
    
    if (ball.pierceTimer > 0) {
      ball.pierceTimer -= dt;
    }
  }

  updatePaddle(paddle: Paddle, dt: number, width: number) {
    paddle.x += paddle.dx * paddle.speed * dt;
    
    // Clamp to screen bounds
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > width) paddle.x = width - paddle.width;

    if (paddle.laserTimer > 0) {
      paddle.laserTimer -= dt;
      if (paddle.laserCooldown > 0) {
        paddle.laserCooldown -= dt;
      }
    }
  }

  updateModifiers(modifiers: Modifier[], dt: number) {
    for (const mod of modifiers) {
      if (mod.active) {
        mod.y += GAME_CONSTANTS.MODIFIER_SPEED * dt;
      }
    }
  }

  updateProjectiles(projectiles: Projectile[], dt: number) {
    for (const proj of projectiles) {
      if (proj.active) {
        proj.y -= proj.speed * dt;
      }
    }
  }
}
