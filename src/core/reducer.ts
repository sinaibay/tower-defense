import { Reducer } from "redux";
import { TRootState } from "./../../typings/rootstate";
import { TActions } from "./actions";
import {
  initialRootState,
  RUN_ALL,
  GAME_START,
  CONSUME_ENERGY,
  GAME_ENDED,
  SET_TIME_SPEED,
  RESET_RUN_ALL,
  START_TURN,
  SHOT_TARGET,
  WAIT,
  TOGGLE_SOFT
} from "./constants";

export const rootState: Reducer<TRootState, TActions> = (
  state = initialRootState,
  action
) => {
  switch (action.type) {
    case RUN_ALL:
      return {
        ...state,
        runAll: true
      };
    case RESET_RUN_ALL:
      return {
        ...state,
        runAll: false
      };
    case GAME_START:
      return {
        ...state,
        status: "running",
        currentGame: {
          actionSent: 0,
          index: state.tests.indexOf(action.test),
          energy: action.test.init.energy
        }
      };
    case START_TURN:
      return {
        ...state,
        currentGame: {
          ...state.currentGame,
          actionSent: 0
        }
      };

    case SHOT_TARGET:
    case WAIT:
      return {
        ...state,
        currentGame: {
          ...state.currentGame,
          actionSent: state.currentGame.actionSent + 1
        }
      };
    case CONSUME_ENERGY:
      return {
        ...state,
        currentGame: {
          ...state.currentGame,
          energy: state.currentGame.energy - 1
        }
      };

    case GAME_ENDED:
      return {
        ...state,
        status: action.success ? "success" : "failed",
        tests: state.tests.map((test, i) => ({
          ...test,
          enabled:
            test.enabled ||
            (action.success && i === state.currentGame.index + 1)
        }))
      };
    case SET_TIME_SPEED:
      return {
        ...state,
        timeSpeed: action.speed
      };
    case TOGGLE_SOFT:
      return {
        ...state,
        soft: !state.soft
      };
    default:
      return state;
  }
};
