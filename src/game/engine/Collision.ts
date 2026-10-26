import { Ball } from "../entities/Ball";
import { Paddle } from "../entities/Paddle";
import { Brick } from "../entities/Brick";
import { Modifier } from "../entities/Modifier";
import { Projectile } from "../entities/Projectile";

export interface BoundsResult {
  lost: boolean;
  bounced: boolean;
}

export class Collision {
  resolveBallBounds(ball: Ball, width: number, height: number): BoundsResult {
    let lost = false;
    let bounced = false;

    // Left/Right
    if (ball.x - ball.radius < 0) {
      ball.x = ball.radius;
      ball.dx = Math.abs(ball.dx);
      bounced = true;
    } else if (ball.x + ball.radius > width) {
      ball.x = width - ball.radius;
      ball.dx = -Math.abs(ball.dx);
      bounced = true;
    }

    // Top
    if (ball.y - ball.radius < 0) {
      ball.y = ball.radius;
      ball.dy = Math.abs(ball.dy);
      bounced = true;
    }

    // Bottom (Loss condition)
    if (ball.y - ball.radius > height) {
      lost = true;
    }

    return { lost, bounced };
  }

  resolveBallPaddle(ball: Ball, paddle: Paddle): number | null {
    // Only bounce if ball is moving downwards towards paddle
    if (ball.dy <= 0) return null;

    if (
      ball.x + ball.radius >= paddle.x &&
      ball.x - ball.radius <= paddle.x + paddle.width &&
      ball.y + ball.radius >= paddle.y &&
      ball.y - ball.radius <= paddle.y + paddle.height
    ) {
      // Calculate hit point from -1 (far left) to 1 (far right)
      const paddleCenter = paddle.x + paddle.width / 2;
      const hitPoint = (ball.x - paddleCenter) / (paddle.width / 2);
      const normalizedHitPoint = Math.max(-1, Math.min(1, hitPoint));

      // Steer ball based on hit position (up to 60 degrees tilt)
      const maxBounceAngle = (60 * Math.PI) / 180;
      const bounceAngle = normalizedHitPoint * maxBounceAngle;

      ball.dx = Math.sin(bounceAngle);
      ball.dy = -Math.cos(bounceAngle);

      // Normalize speed vector
      const len = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
      if (len > 0) {
        ball.dx /= len;
        ball.dy /= len;
      }

      // Keep strictly moving upwards and push out of paddle
      ball.dy = -Math.abs(ball.dy);
      ball.y = paddle.y - ball.radius;

      return normalizedHitPoint;
    }

    return null;
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
      const distanceSq = distX * distX + distY * distY;

      if (distanceSq <= ball.radius * ball.radius) {
        // Collision occurred!
        if (ball.pierceTimer <= 0) {
          const overlapLeft = ball.x + ball.radius - brick.x;
          const overlapRight = brick.x + brick.width - (ball.x - ball.radius);
          const overlapTop = ball.y + ball.radius - brick.y;
          const overlapBottom = brick.y + brick.height - (ball.y - ball.radius);

          const minOverlapX = Math.min(overlapLeft, overlapRight);
          const minOverlapY = Math.min(overlapTop, overlapBottom);

          if (minOverlapX < minOverlapY) {
            // Hit horizontal edge
            if (overlapLeft < overlapRight) {
              ball.x = brick.x - ball.radius;
              ball.dx = -Math.abs(ball.dx);
            } else {
              ball.x = brick.x + brick.width + ball.radius;
              ball.dx = Math.abs(ball.dx);
            }
          } else {
            // Hit vertical edge
            if (overlapTop < overlapBottom) {
              ball.y = brick.y - ball.radius;
              ball.dy = -Math.abs(ball.dy);
            } else {
              ball.y = brick.y + brick.height + ball.radius;
              ball.dy = Math.abs(ball.dy);
            }
          }
        }

        return brick;
      }
    }
    return null;
  }

  checkModifierPaddle(modifier: Modifier, paddle: Paddle): boolean {
    return (
      modifier.x + modifier.size > paddle.x &&
      modifier.x < paddle.x + paddle.width &&
      modifier.y + modifier.size > paddle.y &&
      modifier.y < paddle.y + paddle.height
    );
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
