import { Renderer } from "./Renderer";
import { Physics } from "./Physics";
import { Collision } from "./Collision";
import { Input } from "./Input";
import { Level } from "./Level";
import { Ball } from "../entities/Ball";
import { Paddle } from "../entities/Paddle";
import { Brick } from "../entities/Brick";
import { Modifier } from "../entities/Modifier";
import { GAME_CONSTANTS } from "../constants/Constants";
import { ModifierEffects } from "../effects/ModifierEffects";

type GameState = "IDLE" | "PLAYING" | "GAMEOVER";

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
    if (this.state === "IDLE") {
      this.initLevel();
    } else {
      // Re-position paddle if resizing pushes it out
      if (this.paddle) {
        this.paddle.y = this.height - 40;
        if (this.paddle.x + this.paddle.width > this.width) {
          this.paddle.x = this.width - this.paddle.width;
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
        this.height - 60,
        GAME_CONSTANTS.BALL_RADIUS,
        GAME_CONSTANTS.BALL_SPEED,
        Math.cos(angle),
        Math.sin(angle)
      )
    ];

    this.bricks = Level.generateBricks(this.width, this.height);
    this.modifiers = [];
    
    // Just draw once
    this.renderer.clear(this.width, this.height);
    this.renderer.drawBricks(this.bricks);
    this.renderer.drawPaddle(this.paddle);
    this.renderer.drawBalls(this.balls);
  }

  start() {
    if (this.state === "IDLE") {
      // Wait for user to interact or we just start automatically after a delay
      setTimeout(() => {
        if (this.state === "IDLE") {
          this.setState("PLAYING");
          this.lastTime = performance.now();
          this.reqId = requestAnimationFrame(this.loop);
        }
      }, 1500); // 1.5 seconds delay before ball starts moving
    }
  }

  private setState(newState: GameState) {
    this.state = newState;
    this.onStateChange(newState);
  }

  private loop(timestamp: number) {
    if (this.state !== "PLAYING") {
      // Handle Game Over input
      if (this.state === "GAMEOVER" && this.input.spacePressed) {
        this.initLevel();
        this.setState("PLAYING");
        this.lastTime = timestamp;
      }
      this.reqId = requestAnimationFrame(this.loop);
      return;
    }

    const dt = (timestamp - this.lastTime) / 1000;
    this.lastTime = timestamp;

    this.update(dt);
    this.render();

    this.reqId = requestAnimationFrame(this.loop);
  }

  private update(dt: number) {
    // 1. Update Input
    if (this.input.leftPressed) {
      this.paddle.dx = -1;
    } else if (this.input.rightPressed) {
      this.paddle.dx = 1;
    } else {
      this.paddle.dx = 0;
    }

    // 2. Update Physics
    this.physics.updatePaddle(this.paddle, dt, this.width);
    
    for (const ball of this.balls) {
      if (ball.active) {
        this.physics.updateBall(ball, dt);
      }
    }
    
    this.physics.updateModifiers(this.modifiers, dt);

    // 3. Resolve Collisions
    let activeBalls = 0;

    for (const ball of this.balls) {
      if (!ball.active) continue;
      
      const lost = this.collision.resolveBallBounds(ball, this.width, this.height);
      if (lost) {
        ball.active = false;
        continue;
      }
      activeBalls++;

      this.collision.resolveBallPaddle(ball, this.paddle);
      
      const hitBrick = this.collision.resolveBallBricks(ball, this.bricks);
      if (hitBrick) {
        hitBrick.active = false;
        // Spawn modifier
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
          ModifierEffects.apply(mod.type, this.paddle, this.balls, this);
        } else if (mod.y > this.height) {
          mod.active = false; // off screen
        }
      }
    }

    // 4. Check Win/Loss conditions
    if (activeBalls === 0) {
      this.setState("GAMEOVER");
    }

    const activeBricks = this.bricks.filter(b => b.active).length;
    if (activeBricks === 0) {
      this.setState("GAMEOVER");
    }
  }

  private render() {
    this.renderer.clear(this.width, this.height);
    this.renderer.drawBricks(this.bricks);
    this.renderer.drawModifiers(this.modifiers);
    this.renderer.drawPaddle(this.paddle);
    this.renderer.drawBalls(this.balls);
  }

  destroy() {
    cancelAnimationFrame(this.reqId);
    this.input.destroy();
  }
}
