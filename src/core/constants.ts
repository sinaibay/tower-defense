import { TRootState } from "../../typings/rootstate";
import tests from "./tests";

export const RUN_TEST = "RUN_TEST";
export const RUN_ALL = "RUN_ALL";
export const RESET_RUN_ALL = "RESET_RUN_ALL";
export const FEED_LINE = "FEED_LINE";
export const FEED_LINE_ACK = "FEED_LINE_ACK";
export const GAME_START = "GAME_START";
export const SHOT_TARGET = "SHOT_TARGET";
export const WAIT = "WAIT_ACTION";
export const CONSUME_ENERGY = "CONSUME_ENERGY";
export const GAME_ENDED = "GAME_ENDED";
export const SPAM_ACTOR = "SPAM_ACTOR";
export const SET_TIME_SPEED = "SET_TIME_SPEED";
export const START_TURN = "START_TURN";

const testProgress = Number(localStorage.getItem("test-progress")) || 0;

export const initialRootState: TRootState = {
  status: "idle",
  timeSpeed: Number(localStorage.getItem("test-speed")) || 1,
  runAll: false,
  tests: tests.map((test, i) => ({
    ...test,
    enabled: i <= testProgress
  })),
  currentGame: {
    actionSent: 0,
    index: 0,
    energy: 0
  }
};
