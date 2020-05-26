import { TGameState } from "./../../typings/game-state";
import {
  RUN_TEST,
  RUN_ALL,
  FEED_LINE,
  FEED_LINE_ACK,
  GAME_START,
  GAME_ENDED,
  CONSUME_ENERGY,
  WAIT,
  SHOT_TARGET,
  SET_TIME_SPEED,
  RESET_RUN_ALL,
  START_TURN,
  TOGGLE_SOFT
} from "./constants";

export type TActions =
  | TRunAllAction
  | TGameStartAction
  | TConsumeEnergy
  | TGameEndedeAction
  | TSetTimeSpeedAction
  | TResetRunAllAction
  | TShotTargetAction
  | TWaitAction
  | TStartTurnAction
  | TToggleSoftAction;

export interface TRunTestAction {
  type: typeof RUN_TEST;
  test: TGameState;
}

export interface TRunAllAction {
  type: typeof RUN_ALL;
}

export interface TResetRunAllAction {
  type: typeof RESET_RUN_ALL;
}

export interface TStartTurnAction {
  type: typeof START_TURN;
}

export interface TFeedLineAction {
  type: typeof FEED_LINE;
  line: string;
}

export interface TFeedLineAckAction {
  type: typeof FEED_LINE_ACK;
}

export interface TGameStartAction {
  type: typeof GAME_START;
  test: TGameState;
}

export interface TGameEndedeAction {
  type: typeof GAME_ENDED;
  success: boolean;
  message?: string;
}

export interface TConsumeEnergy {
  type: typeof CONSUME_ENERGY;
}

export interface TWaitAction {
  type: typeof WAIT;
}

export interface TShotTargetAction {
  type: typeof SHOT_TARGET;
  id: string;
}

export interface TSetTimeSpeedAction {
  type: typeof SET_TIME_SPEED;
  speed: number;
}

export interface TToggleSoftAction {
  type: typeof TOGGLE_SOFT;
}

export const runTestAction = (test: TGameState): TRunTestAction => ({
  type: RUN_TEST,
  test
});

export const runAllAction = (): TRunAllAction => ({
  type: RUN_ALL
});

export const resetRunAllAction = (): TResetRunAllAction => ({
  type: RESET_RUN_ALL
});

export const feedLine = (line: Array<string | number>): TFeedLineAction => ({
  type: FEED_LINE,
  line: line.join(" ")
});

export const feedLineAck = (): TFeedLineAckAction => ({
  type: FEED_LINE_ACK
});

export const startGame = (test: TGameState): TGameStartAction => ({
  type: GAME_START,
  test
});

export const waitAction = (): TWaitAction => ({
  type: WAIT
});

export const startTurnAction = (): TStartTurnAction => ({
  type: START_TURN
});

export const shotTargetAction = (id: string): TShotTargetAction => ({
  type: SHOT_TARGET,
  id
});

export const endGame = (
  success: boolean,
  message?: string
): TGameEndedeAction => ({
  type: GAME_ENDED,
  success,
  message
});

export const consumeEnergy = (): TConsumeEnergy => ({ type: CONSUME_ENERGY });

export const setTimeSpeed = (speed: number): TSetTimeSpeedAction => ({
  type: SET_TIME_SPEED,
  speed
});

export const toggleSoftAction = (): TToggleSoftAction => ({
  type: TOGGLE_SOFT
});
