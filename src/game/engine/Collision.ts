import { Ball } from "../entities/Ball";
import { Paddle } from "../entities/Paddle";
import { Brick } from "../entities/Brick";
import { Modifier } from "../entities/Modifier";
import { Projectile } from "../entities/Projectile";

export class Collision {
  resolveBallBounds(ball: Ball, width: number, height: number): boolean {
    let lost = false;
    
    // Left/Right
    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius;
      ball.dx = Math.abs(ball.dx);
    } else if (ball.x + ball.radius > width) {
      ball.x = width - ball.radius;
      ball.dx = -Math.abs(ball.dx);
    }

    // Top
    if (ball.y - ball.radius < 0) {
      ball.y = ball.radius;
      ball.dy = Math.abs(ball.dy);
    }

    // Bottom (Loss condition)
    if (ball.y + ball.radius > height) {
      lost = true;
    }

    return lost;
  }

  resolveBallPaddle(ball: Ball, paddle: Paddle) {
    if (
      ball.x + ball.radius > paddle.x &&
      ball.x - ball.radius < paddle.x + paddle.width &&
      ball.y + ball.radius > paddle.y &&
      ball.y - ball.radius < paddle.y + paddle.height
    ) {
      // Simple bounce, adjust dx based on where it hit the paddle
      const hitPoint = ball.x - (paddle.x + paddle.width / 2);
      const normalizedHitPoint = hitPoint / (paddle.width / 2);
      
      ball.dx = normalizedHitPoint * 0.8; 
      ball.dy = -Math.abs(ball.dy);
      
      // Normalize velocity vector
      const length = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
      ball.dx /= length;
      ball.dy /= length;
      
      // Push ball out of paddle
      ball.y = paddle.y - ball.radius;
    }
  }

  resolveBallBricks(ball: Ball, bricks: Brick[]): Brick | null {
    for (const brick of bricks) {
      if (!brick.active) continue;

      let testX = ball.x;
      let testY = ball.y;

      if (ball.x < brick.x) testX = brick.x;
      else if (ball.x > brick.x + brick.width) testX = brick.x + brick.width;

      if (ball.y < brick.y) testY = brick.y;
      else if (ball.y > brick.y + brick.height) testY = brick.y + brick.height;

      const distX = ball.x - testX;
      const distY = ball.y - testY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance <= ball.radius) {
        // Collision occurred!
        
        // Check which side we hit to reflect properly
        // If piercing, we do NOT reflect.
        if (ball.pierceTimer <= 0) {
          if (Math.abs(distX) > Math.abs(distY)) {
            // Hit left or right
            ball.dx = -ball.dx;
          } else {
            // Hit top or bottom
            ball.dy = -ball.dy;
          }
        }
        
        return brick;
      }
    }
    return null;
  }

  checkModifierPaddle(modifier: Modifier, paddle: Paddle): boolean {
    if (
      modifier.x + modifier.size > paddle.x &&
      modifier.x < paddle.x + paddle.width &&
      modifier.y + modifier.size > paddle.y &&
      modifier.y < paddle.y + paddle.height
    ) {
      return true;
    }
    return false;
  }

  resolveProjectileBricks(projectiles: Projectile[], bricks: Brick[]): Brick[] {
    const hitBricks: Brick[] = [];
    for (const proj of projectiles) {
      if (!proj.active) continue;

      for (const brick of bricks) {
        if (!brick.active) continue;

        if (
          proj.x + proj.width > brick.x &&
          proj.x < brick.x + brick.width &&
          proj.y + proj.height > brick.y &&
          proj.y < brick.y + brick.height
        ) {
          proj.active = false;
          hitBricks.push(brick);
          break; // Projectile can only hit one brick
        }
      }
    }
    return hitBricks;
  }
}
