import { TGameState } from "./game-state";

export interface TRootState {
  status: "running" | "success" | "failed" | "idle";
  tests: TGameState[];
  timeSpeed: number;
  runAll: boolean;
  soft: boolean;
  currentGame: {
    index: number;
    energy: number;
    actionSent: number;
  };
}
