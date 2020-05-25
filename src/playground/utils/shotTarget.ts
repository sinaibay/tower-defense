import { put } from "redux-saga/effects";
import { shotTargetAction } from "../../core/actions";

export function* shotTarget(id: string) {
  yield put(shotTargetAction(id));
}
