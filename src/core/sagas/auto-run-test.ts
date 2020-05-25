import { TGameEndedeAction } from "./../actions";
import { TRootState } from "../../../typings/rootstate";
import { select, put, delay, takeEvery } from "redux-saga/effects";
import { runTestAction, resetRunAllAction } from "../actions";
import { GAME_ENDED, RUN_ALL } from "../constants";
import { toast } from "react-toastify";

export function* runOnStartup() {
  const { tests }: TRootState = yield select();
  const index = Number(localStorage.getItem("test-last")) || 0;

  yield delay(100);
  yield put(runTestAction(tests[index] || tests[0]));
}

export function* runNextOnSuccess() {
  yield takeEvery(GAME_ENDED, function*(action: TGameEndedeAction) {
    const { currentGame, tests, runAll }: TRootState = yield select();
    const nextTest = tests[currentGame.index + 1];

    if (runAll) {
      if (action.success && nextTest) {
        yield delay(1000);
        yield put(runTestAction(nextTest));
      } else {
        yield put(resetRunAllAction());
      }
    } else if (action.success) {
      if (nextTest) {
        toast.success(`🎉 Bravo, un nouveau niveau vient d'être débloqué`);
      } else {
        toast(
          `🎉 Bravo, vous êtes arrivé à la fin du test ! N'oubliez pas de pusher vos modifications`,
          {
            type: "success",
            autoClose: false
          }
        );
      }
    }
  });
}

export function* runAll() {
  yield takeEvery(RUN_ALL, function*() {
    const { status, tests }: TRootState = yield select();
    if (status !== "running") {
      yield put(runTestAction(tests[0]));
    }
  });
}
