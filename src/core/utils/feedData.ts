import { put, take, race, delay } from "redux-saga/effects";
import { feedLine } from "../actions";
import { FEED_LINE_ACK } from "../constants";

export function* feedData(lines: Array<string | number>) {
  yield put(feedLine(lines));

  const { ack } = yield race({
    ack: take(FEED_LINE_ACK),
    timeout: delay(100)
  });

  if (!ack) {
    throw new Error(
      "Des données ont été envoyées, mais `yield* readLine()` n'a jamais été appelé"
    );
  }
}
