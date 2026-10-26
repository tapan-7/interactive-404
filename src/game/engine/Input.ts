export class Input {
  leftPressed: boolean = false;
  rightPressed: boolean = false;

  // Edge triggers
  spacePressed: boolean = false;
  enterPressed: boolean = false;
  escapePressed: boolean = false;

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  init() {
    if (typeof window === "undefined") return;
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("touchstart", this.handleTouchStart);
    window.addEventListener("touchmove", this.handleTouchMove);
    window.addEventListener("touchend", this.handleTouchEnd);
  }

  destroy() {
    if (typeof window === "undefined") return;
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("touchstart", this.handleTouchStart);
    window.removeEventListener("touchmove", this.handleTouchMove);
    window.removeEventListener("touchend", this.handleTouchEnd);
  }

  consumeEdgeTriggers() {
    this.spacePressed = false;
    this.enterPressed = false;
    this.escapePressed = false;
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.code === "ArrowLeft" || e.code === "KeyA") {
      this.leftPressed = true;
      e.preventDefault();
    }
    if (e.code === "ArrowRight" || e.code === "KeyD") {
      this.rightPressed = true;
      e.preventDefault();
    }
    if (e.code === "Space") {
      this.spacePressed = true;
      e.preventDefault();
    }
    if (e.code === "Enter") {
      this.enterPressed = true;
      e.preventDefault();
    }
    if (e.code === "Escape") {
      this.escapePressed = true;
      e.preventDefault();
    }
  }

  private handleKeyUp(e: KeyboardEvent) {
    if (e.code === "ArrowLeft" || e.code === "KeyA") this.leftPressed = false;
    if (e.code === "ArrowRight" || e.code === "KeyD") this.rightPressed = false;
  }

  private handleTouchStart(e: TouchEvent) {
    const touch = e.touches[0];
    this.spacePressed = true;

    if (touch.clientX < window.innerWidth / 2) {
      this.leftPressed = true;
      this.rightPressed = false;
    } else {
      this.rightPressed = true;
      this.leftPressed = false;
    }
  }

  private handleTouchMove(e: TouchEvent) {
    const touch = e.touches[0];
    if (touch.clientX < window.innerWidth / 2) {
      this.leftPressed = true;
      this.rightPressed = false;
    } else {
      this.rightPressed = true;
      this.leftPressed = false;
    }
  }

  private handleTouchEnd() {
    this.leftPressed = false;
    this.rightPressed = false;
  }
}
