import { Brick } from "../entities/Brick";
import { ModifierType } from "../entities/Modifier";

const MODIFIER_POOL: ModifierType[] = [
  "BLANK",
  "BLANK",
  "BLANK",
  "EXTRA_BALL",
  "BLANK",
  "BLANK",
  "SPEED_BALL",
  "BLANK",
  "GROW_PADDLE",
  "BLANK",
  "SLOW_BALL",
  "BLANK",
  "SHRINK_PADDLE",
  "BLANK",
  "PIERCE_BALL",
  "BLANK",
  "LASER_PADDLE",
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
    // Max 92% screen width on mobile, 85% on desktop
    const maxPatternWidthRatio = screenWidth < 768 ? 0.95 : 0.85;
    const maxAvailableWidth = screenWidth * maxPatternWidthRatio - (cols - 1) * gap;
    const widthBasedSize = Math.floor(maxAvailableWidth / cols);
    
    // Max 50% screen height so it leaves comfortable room for paddle
    const maxAvailableHeight = screenHeight * 0.50 - (rows - 1) * gap;
    const heightBasedSize = Math.floor(maxAvailableHeight / rows);
    
    // Minimum 4px, comfortable sizing
    const brickSize = Math.max(Math.min(widthBasedSize, heightBasedSize), 4);
    
    const patternWidth = cols * brickSize + (cols - 1) * gap;
    const patternHeight = rows * brickSize + (rows - 1) * gap;
    
    const startX = (screenWidth - patternWidth) / 2;
    const startY = Math.max(screenHeight * 0.08, (screenHeight * 0.52 - patternHeight) / 2);
    
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
