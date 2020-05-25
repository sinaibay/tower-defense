import { TActor } from "./actor";
import { TPosition } from "./position";

export interface TGameState {
  name: string;
  description: string;
  enabled?: boolean;
  init: {
    radius: number;
    energy: number;
    position: TPosition;
    actors: TActor[];
    randomize?: boolean;
  };
}
