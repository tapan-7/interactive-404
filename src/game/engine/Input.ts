import { GAME_CONSTANTS } from "../constants/Constants";

export class Input {
  leftPressed: boolean = false;
  rightPressed: boolean = false;
  spacePressed: boolean = false;

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  init() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("touchstart", this.handleTouchStart);
    window.addEventListener("touchend", this.handleTouchEnd);
  }

  destroy() {
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("touchstart", this.handleTouchStart);
    window.removeEventListener("touchend", this.handleTouchEnd);
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.code === "ArrowLeft" || e.code === "KeyA") this.leftPressed = true;
    if (e.code === "ArrowRight" || e.code === "KeyD") this.rightPressed = true;
    if (e.code === "Space" || e.code === "Enter") this.spacePressed = true;
  }

  private handleKeyUp(e: KeyboardEvent) {
    if (e.code === "ArrowLeft" || e.code === "KeyA") this.leftPressed = false;
    if (e.code === "ArrowRight" || e.code === "KeyD") this.rightPressed = false;
    if (e.code === "Space" || e.code === "Enter") this.spacePressed = false;
  }

  private handleTouchStart(e: TouchEvent) {
    const touch = e.touches[0];
    if (touch.clientX < window.innerWidth / 2) {
      this.leftPressed = true;
    } else {
      this.rightPressed = true;
    }
  }

  private handleTouchEnd() {
    this.leftPressed = false;
    this.rightPressed = false;
  }
}
