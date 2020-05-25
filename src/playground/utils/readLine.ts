import { take, put } from "redux-saga/effects";
import { FEED_LINE } from "../../core/constants";
import { TFeedLineAction, feedLineAck } from "../../core/actions";

export function* readLine() {
  // Wait for line to be given
  const { line }: TFeedLineAction = yield take(FEED_LINE);

  // Send back that we got the line
  yield put(feedLineAck());

  // Returns line data
  return line;
}
