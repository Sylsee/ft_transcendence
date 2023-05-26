// Local imports
import { PaddleDirection } from 'src/game/enum/paddle-direction.enum';

export type Paddle = {
  x: number;
  y: number;
  width: number;
  height: number;
  velocity: {
    y: number;
  };
  direction: PaddleDirection;
};
