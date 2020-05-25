import { put } from "redux-saga/effects";
import { waitAction } from "../../core/actions";

export function* wait() {
  yield put(waitAction());
}
