// Local imports
import { PowerUpType } from 'src/game/enum/power-up-type.enum';

export type PowerUp = {
  id: string;
  type: PowerUpType;
  x: number;
  y: number;
  radius: number;
};
