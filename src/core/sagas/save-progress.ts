import { takeEvery, select } from "redux-saga/effects";
import { TSetTimeSpeedAction } from "./../actions";
import { GAME_START, GAME_ENDED, SET_TIME_SPEED } from "./../constants";
import { TRootState } from "./../../../typings/rootstate";
import { TGameEndedeAction } from "../actions";

export function* saveLastRun() {
  yield takeEvery(GAME_START, function*() {
    const { currentGame }: TRootState = yield select();
    localStorage.setItem("test-last", String(currentGame.index));
  });
}

export function* saveSuccess() {
  yield takeEvery(GAME_ENDED, function*(action: TGameEndedeAction) {
    const { tests }: TRootState = yield select();
    if (action.success) {
      localStorage.setItem(
        "test-progress",
        tests.filter(test => test.enabled).length.toString()
      );
    }
  });
}

export function* saveSpeed() {
  yield takeEvery(SET_TIME_SPEED, function(action: TSetTimeSpeedAction) {
    localStorage.setItem("test-speed", action.speed.toString());
  });
}
