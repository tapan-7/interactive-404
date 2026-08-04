import { Brick } from "../entities/Brick";
import { ModifierType } from "../entities/Modifier";
import { GAME_CONSTANTS } from "../constants/Constants";

const MODIFIER_POOL: ModifierType[] = [
  "GROW_PADDLE",
  "SHRINK_PADDLE",
  "SPEED_BALL",
  "SLOW_BALL",
  "EXTRA_BALL",
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
    
    const brickSize = Math.min(Math.floor(screenWidth / cols * 0.7), 16);
    const gap = 1;
    
    const patternWidth = cols * brickSize + (cols - 1) * gap;
    
    const startX = (screenWidth - patternWidth) / 2;
    const startY = screenHeight * 0.08;
    
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
