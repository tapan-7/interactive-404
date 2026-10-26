import { Renderer } from "./Renderer";
import { Physics } from "./Physics";
import { Collision } from "./Collision";
import { Input } from "./Input";
import { Level } from "./Level";
import { Ball } from "../entities/Ball";
import { Paddle } from "../entities/Paddle";
import { Brick } from "../entities/Brick";
import { Modifier } from "../entities/Modifier";
import { Projectile } from "../entities/Projectile";
import { GAME_CONSTANTS } from "../constants/Constants";
import { ModifierEffects } from "../effects/ModifierEffects";
import { soundManager } from "../audio/SoundManager";

export type GameState = "IDLE" | "PLAYING" | "PAUSED" | "GAMEOVER";

export class Engine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private renderer: Renderer;
  private physics: Physics;
  private collision: Collision;
  private input: Input;

  private width: number = 0;
  private height: number = 0;

  private paddle!: Paddle;
  private balls: Ball[] = [];
  private bricks: Brick[] = [];
  private modifiers: Modifier[] = [];
  private projectiles: Projectile[] = [];

  private lastTime: number = 0;
  private reqId: number = 0;
  private state: GameState = "IDLE";
  private onStateChange: (state: GameState) => void;

  constructor(canvas: HTMLCanvasElement, onStateChange: (state: GameState) => void) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not get 2D context");
    this.ctx = context;

    this.onStateChange = onStateChange;

    this.renderer = new Renderer(this.ctx);
    this.physics = new Physics();
    this.collision = new Collision();
    this.input = new Input();
    this.input.init();

    this.loop = this.loop.bind(this);
  }

  handleResize(width: number, height: number) {
    this.width = width;
    this.height = height;

    if (this.state === "IDLE" || this.state === "GAMEOVER") {
      this.initLevel();
    } else {
      if (this.paddle) {
        this.paddle.y = this.height - 40;
        if (this.paddle.x + this.paddle.width > this.width) {
          this.paddle.x = Math.max(0, this.width - this.paddle.width);
        }
      }
    }
  }

  initLevel() {
    this.paddle = new Paddle(
      this.width / 2 - GAME_CONSTANTS.PADDLE_WIDTH / 2,
      this.height - 40,
      GAME_CONSTANTS.PADDLE_WIDTH,
      GAME_CONSTANTS.PADDLE_HEIGHT,
      GAME_CONSTANTS.PADDLE_SPEED
    );

    // Initial velocity upward and slightly right
    const angle = -Math.PI / 3;
    this.balls = [
      new Ball(
        this.width / 2,
        this.height - 40 - GAME_CONSTANTS.BALL_RADIUS,
        GAME_CONSTANTS.BALL_RADIUS,
        GAME_CONSTANTS.BALL_SPEED,
        Math.cos(angle),
        Math.sin(angle)
      ),
    ];

    this.bricks = Level.generateBricks(this.width, this.height);
    this.modifiers = [];
    this.projectiles = [];

    this.render();
  }

  start() {
    if (this.state === "IDLE") {
      this.lastTime = performance.now();
      this.reqId = requestAnimationFrame(this.loop);
    }
  }

  private setState(newState: GameState) {
    this.state = newState;
    this.onStateChange(newState);

    if (newState === "GAMEOVER") {
      soundManager.playGameOver();
    }
  }

  private loop(timestamp: number) {
    const rawDt = (timestamp - this.lastTime) / 1000;
    const dt = Math.min(Math.max(rawDt, 0.001), 0.05);
    this.lastTime = timestamp;

    if (this.state === "IDLE") {
      this.updateIdle(dt);
      if (this.input.spacePressed || this.input.enterPressed) {
        this.setState("PLAYING");
      }
    } else if (this.state === "GAMEOVER") {
      this.updateIdle(dt);
      if (this.input.spacePressed || this.input.enterPressed) {
        this.initLevel();
        this.setState("PLAYING");
      }
    } else if (this.state === "PAUSED") {
      if (this.input.spacePressed || this.input.escapePressed) {
        this.setState("PLAYING");
      }
    } else if (this.state === "PLAYING") {
      if (this.input.spacePressed || this.input.escapePressed) {
        this.setState("PAUSED");
      } else {
        this.update(dt);
      }
    }

    this.render();
    this.input.consumeEdgeTriggers();
    this.reqId = requestAnimationFrame(this.loop);
  }

  private updateIdle(dt: number) {
    if (this.input.leftPressed) {
      this.paddle.dx = -1;
    } else if (this.input.rightPressed) {
      this.paddle.dx = 1;
    } else {
      this.paddle.dx = 0;
    }

    this.physics.updatePaddlePosition(this.paddle, dt, this.width);

    // Keep ball locked to the center of the paddle before launch
    if (this.balls.length > 0) {
      this.balls[0].x = this.paddle.x + this.paddle.width / 2;
      this.balls[0].y = this.paddle.y - this.balls[0].radius;
    }
  }

  private update(dt: number) {
    // 1. Keyboard paddle movement
    if (this.input.leftPressed) {
      this.paddle.dx = -1;
    } else if (this.input.rightPressed) {
      this.paddle.dx = 1;
    } else {
      this.paddle.dx = 0;
    }

    this.physics.updatePaddlePosition(this.paddle, dt, this.width);
    this.physics.updatePaddleTimers(this.paddle, dt);

    // 2. Physics update
    for (const ball of this.balls) {
      if (ball.active) {
        this.physics.updateBall(ball, dt);
      }
    }

    this.physics.updateModifiers(this.modifiers, dt);
    this.physics.updateProjectiles(this.projectiles, dt);

    // Laser firing logic
    if (this.paddle.laserTimer > 0 && this.paddle.laserCooldown <= 0) {
      this.paddle.laserCooldown = 0.35;
      this.projectiles.push(
        new Projectile(this.paddle.x + 3, this.paddle.y - 8, 3, 10, 700)
      );
      this.projectiles.push(
        new Projectile(this.paddle.x + this.paddle.width - 6, this.paddle.y - 8, 3, 10, 700)
      );
      soundManager.playLaser();
    }

    // 3. Resolve Collisions
    let activeBalls = 0;

    for (const ball of this.balls) {
      if (!ball.active) continue;

      const bounds = this.collision.resolveBallBounds(ball, this.width, this.height);
      if (bounds.lost) {
        ball.active = false;
        continue;
      }
      if (bounds.bounced) {
        soundManager.playWallHit();
      }

      activeBalls++;

      const paddleHit = this.collision.resolveBallPaddle(ball, this.paddle);
      if (paddleHit !== null) {
        soundManager.playPaddleHit(paddleHit);
      }

      const hitBrick = this.collision.resolveBallBricks(ball, this.bricks);
      if (hitBrick) {
        hitBrick.active = false;
        soundManager.playBrickHit();

        this.modifiers.push(
          new Modifier(
            hitBrick.x + hitBrick.width / 2 - GAME_CONSTANTS.MODIFIER_SIZE / 2,
            hitBrick.y + hitBrick.height / 2 - GAME_CONSTANTS.MODIFIER_SIZE / 2,
            hitBrick.modifier,
            GAME_CONSTANTS.MODIFIER_SIZE
          )
        );
      }
    }

    // Modifier collisions
    for (const mod of this.modifiers) {
      if (mod.active) {
        if (this.collision.checkModifierPaddle(mod, this.paddle)) {
          mod.active = false;
          ModifierEffects.apply(mod.type, this.paddle, this.balls);
        } else if (mod.y > this.height) {
          mod.active = false;
        }
      }
    }

    // Projectile collisions
    const hitBricksByProjectiles = this.collision.resolveProjectileBricks(this.projectiles, this.bricks);
    for (const brick of hitBricksByProjectiles) {
      soundManager.playBrickHit();
      this.modifiers.push(
        new Modifier(
          brick.x + brick.width / 2 - GAME_CONSTANTS.MODIFIER_SIZE / 2,
          brick.y + brick.height / 2 - GAME_CONSTANTS.MODIFIER_SIZE / 2,
          brick.modifier,
          GAME_CONSTANTS.MODIFIER_SIZE
        )
      );
    }

    // 4. Check loss condition
    const activeBricks = this.bricks.filter((b) => b.active).length;
    if (activeBalls === 0 || activeBricks === 0) {
      this.setState("GAMEOVER");
    }
  }

  private render() {
    this.renderer.clear(this.width, this.height);
    this.renderer.drawBricks(this.bricks);
    this.renderer.drawModifiers(this.modifiers);
    this.renderer.drawProjectiles(this.projectiles);
    this.renderer.drawPaddle(this.paddle);
    this.renderer.drawBalls(this.balls);
  }

  destroy() {
    cancelAnimationFrame(this.reqId);
    this.input.destroy();
  }
}
