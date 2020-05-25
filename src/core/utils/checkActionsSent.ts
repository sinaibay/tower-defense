import { select } from "redux-saga/effects";
import { TRootState } from "../../../typings/rootstate";
import { toast } from "react-toastify";

export function* checkActionsSent() {
  const { currentGame }: TRootState = yield select();

  if (currentGame.actionSent > 1) {
    console.warn(`wait() - Une seule action peut être envoyée par tour.`);
    toast.warning(`wait() - Une seule action peut être envoyée par tour.`);
    return true;
  }

  return false;
}
