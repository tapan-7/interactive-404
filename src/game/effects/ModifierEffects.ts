import { Ball } from "../entities/Ball";
import { Paddle } from "../entities/Paddle";
import { ModifierType } from "../entities/Modifier";
import { GAME_CONSTANTS } from "../constants/Constants";
import { soundManager } from "../audio/SoundManager";

export class ModifierEffects {
  static apply(type: ModifierType, paddle: Paddle, balls: Ball[]) {
    if (type !== "BLANK") {
      soundManager.playPowerup();
    }

    switch (type) {
      case "GROW_PADDLE":
        paddle.width = Math.min(
          paddle.width + 50,
          Math.min(GAME_CONSTANTS.PADDLE_WIDTH * 3, window.innerWidth * 0.6)
        );
        break;
      case "SHRINK_PADDLE":
        paddle.width = Math.max(paddle.width - 25, 60);
        break;
      case "SPEED_BALL":
        balls.forEach((ball) => {
          ball.speed = Math.min(ball.speed * 1.2, 900);
        });
        break;
      case "SLOW_BALL":
        balls.forEach((ball) => {
          ball.speed = Math.max(ball.speed * 0.8, 220);
        });
        break;
      case "EXTRA_BALL": {
        const currentBalls = [...balls];
        for (const b of currentBalls) {
          if (!b.active) continue;
          const newBall = new Ball(
            b.x,
            b.y,
            b.radius,
            b.speed,
            -b.dx,
            b.dy
          );
          newBall.pierceTimer = b.pierceTimer;
          balls.push(newBall);
        }
        break;
      }
      case "PIERCE_BALL":
        balls.forEach((ball) => {
          ball.pierceTimer = 3.5;
        });
        break;
      case "LASER_PADDLE":
        paddle.laserTimer = 4.0;
        break;
      case "BLANK":
        // Neutral token
        break;
    }
  }
}
