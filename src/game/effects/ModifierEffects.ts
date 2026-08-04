import { Ball } from "../entities/Ball";
import { Paddle } from "../entities/Paddle";
import { ModifierType } from "../entities/Modifier";
import { GAME_CONSTANTS } from "../constants/Constants";
import { Engine } from "../engine/Engine";

export class ModifierEffects {
  static apply(type: ModifierType, paddle: Paddle, balls: Ball[], engine: Engine) {
    switch (type) {
      case "GROW_PADDLE":
        paddle.width = Math.min(paddle.width + 50, window.innerWidth / 2);
        break;
      case "SHRINK_PADDLE":
        paddle.width = Math.max(paddle.width - 20, 50);
        break;
      case "SPEED_BALL":
        balls.forEach((ball) => {
          ball.speed = Math.min(ball.speed * 1.2, 1000);
        });
        break;
      case "SLOW_BALL":
        balls.forEach((ball) => {
          ball.speed = Math.max(ball.speed * 0.8, 200);
        });
        break;
      case "EXTRA_BALL":
        if (balls.length > 0) {
          const b = balls[0];
          // Spawn new ball at the same position but opposite horizontal velocity
          balls.push(
            new Ball(
              b.x,
              b.y,
              b.radius,
              b.speed,
              -b.dx,
              b.dy
            )
          );
        }
        break;
    }
  }
}
