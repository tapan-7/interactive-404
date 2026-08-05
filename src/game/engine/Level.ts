import { Brick } from "../entities/Brick";
import { ModifierType } from "../entities/Modifier";
import { GAME_CONSTANTS } from "../constants/Constants";

const MODIFIER_POOL: ModifierType[] = [
  "BLANK",
  "BLANK",
  "BLANK",
  "BLANK",
  "BLANK",
  "EXTRA_BALL",
  "BLANK",
  "BLANK",
  "BLANK",
  "SPEED_BALL",
  "BLANK",
  "BLANK",
  "GROW_PADDLE",
  "BLANK",
  "BLANK",
  "SLOW_BALL",
  "BLANK",
  "BLANK",
  "SHRINK_PADDLE",
  "BLANK",
  "BLANK",
  "PIERCE_BALL",
  "BLANK",
  "BLANK",
  "BLANK",
  "LASER_PADDLE",
  "BLANK",
  "BLANK",
  "BLANK",
];

const PATTERN = [
  "                      XXXXXXX                      ",
  "                   XXX       XXX                   ",
  "                 XX             XX                 ",
  "               XX                 XX               ",
  "              XX                   XX              ",
  "             XX  XX   XX   XX   XX  XX             ",
  "            XX   XX   XX   XX   XX   XX            ",
  "            XX    XXXXX     XXXXX    XX            ",
  "            XX                       XX            ",
  "            XX                       XX            ",
  "            XX       XXXXXXXXX       XX            ",
  "             XX     X         X     XX             ",
  "              XX     XXXXXXXXX     XX              ",
  "               XX                 XX               ",
  "                 XX             XX                 ",
  "                   XXX       XXX                   ",
  "                      XXXXXXX                      ",
  "                                                   ",
  "                                                   ",
  "                                                   ",
  "                                                   ",
  "   XXXX   XXXX      XXXXXXXXXXX      XXXX   XXXX   ",
  "   XXXX   XXXX     XXXXXXXXXXXXX     XXXX   XXXX   ",
  "   XXXX   XXXX    XXXX       XXXX    XXXX   XXXX   ",
  "   XXXX   XXXX    XXXX       XXXX    XXXX   XXXX   ",
  "   XXXX   XXXX    XXXX       XXXX    XXXX   XXXX   ",
  "   XXXX   XXXX    XXXX       XXXX    XXXX   XXXX   ",
  "   XXXXXXXXXXX    XXXX       XXXX    XXXXXXXXXXX   ",
  "   XXXXXXXXXXX    XXXX       XXXX    XXXXXXXXXXX   ",
  "          XXXX    XXXX       XXXX           XXXX   ",
  "          XXXX    XXXX       XXXX           XXXX   ",
  "          XXXX    XXXX       XXXX           XXXX   ",
  "          XXXX     XXXXXXXXXXXXX            XXXX   ",
  "          XXXX      XXXXXXXXXXX             XXXX   "
];

export class Level {
  static generateBricks(screenWidth: number, screenHeight: number): Brick[] {
    const bricks: Brick[] = [];
    const rows = PATTERN.length;
    const cols = PATTERN[0].length;
    
    const gap = 1;
    // We want the total pattern width to be at most 95% of screen width.
    const maxAvailableWidth = screenWidth * 0.95 - (cols - 1) * gap;
    const widthBasedSize = Math.floor(maxAvailableWidth / cols);
    
    // We want the total pattern height to be at most 55% of screen height so it doesn't cover the paddle
    const maxAvailableHeight = screenHeight * 0.55 - (rows - 1) * gap;
    const heightBasedSize = Math.floor(maxAvailableHeight / rows);
    
    // Choose the smaller of the two, with a minimum size of 4px
    const brickSize = Math.max(Math.min(widthBasedSize, heightBasedSize), 4);
    
    const patternWidth = cols * brickSize + (cols - 1) * gap;
    const patternHeight = rows * brickSize + (rows - 1) * gap;
    
    const startX = (screenWidth - patternWidth) / 2;
    // Center it somewhat vertically in the top 55% of the screen, or at least 8% from top
    const startY = Math.max(screenHeight * 0.08, (screenHeight * 0.55 - patternHeight) / 2);
    
    let brickIndex = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (PATTERN[r][c] === "X") {
          const x = startX + c * (brickSize + gap);
          const y = startY + r * (brickSize + gap);
          
          const modifier = MODIFIER_POOL[brickIndex % MODIFIER_POOL.length];
          bricks.push(new Brick(x, y, brickSize, brickSize, modifier));
          brickIndex++;
        }
      }
    }

    return bricks;
  }
}
