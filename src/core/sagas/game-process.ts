import {
  takeEvery,
  put,
  take,
  delay,
  race,
  select,
  fork,
  cancel
} from "redux-saga/effects";
import { toast } from "react-toastify";

import { TRootState } from "../../../typings/rootstate";
import { GameRenderer } from "../GameRenderer";
import { RUN_TEST, SHOT_TARGET, WAIT } from "../constants";
import {
  TRunTestAction,
  startGame,
  endGame,
  consumeEnergy,
  startTurnAction
} from "../actions";
import { feedData } from "../utils/feedData";
import playground from "../../playground";
import { checkHasLost } from "../utils/checkHasLost";
import { removeSecuredRabbits } from "../utils/removeSecuredRabbits";
import { hasActiveEntities } from "../utils/hasActiveEntities";
import { checkActionsSent } from "../utils/checkActionsSent";

const GAME_TURN_TIME = 1000;

export function* gameProcessWatcher() {
  yield takeEvery(RUN_TEST, function*(action: TRunTestAction) {
    let hasError = false;
    const test = action.test.init;
    const renderer = GameRenderer.getSingleTon();
    const { timeSpeed, status }: TRootState = yield select();

    // Already running, do nothing
    if (status === "running") {
      return;
    }

    yield put(startGame(action.test));

    // Initialize map
    toast.dismiss();
    renderer.reset();
    renderer.setTimeSpeed(timeSpeed);
    renderer.setPosition(test.position);
    renderer.addTower(test.position, test.radius);

    // Initialize entities
    const entities = test.actors.map(actor => ({ ...actor }));
    if (test.randomize) {
      entities.reverse();
    }

    // Run playground in parralel and check for errors
    const playgroundTask: any = yield fork(function*() {
      try {
        yield playground();
      } catch (e) {
        console.error(e);
        renderer.stop();

        yield put(endGame(false));
        yield cancel(playgroundTask);
      }
    });

    try {
      // Base position
      yield feedData([
        test.position.lat,
        test.position.lng,
        test.radius,
        test.energy
      ]);

      // Actors
      yield feedData([entities.length]);
      for (const actor of entities) {
        renderer.spamActor(actor);
        yield feedData([actor.id, actor.type, actor.speed]);
      }

      renderer.start();

      // Start rendering loop
      while (true) {
        yield put(startTurnAction());

        // Feed actors updates
        for (const actor of entities) {
          const position = renderer.getActorPosition(actor.id);
          if (position) {
            actor.lat = position.lat();
            actor.lng = position.lng();
          }
          yield feedData([actor.id, actor.status, actor.lat, actor.lng]);
        }

        // Wait for action
        const { shot, wait } = yield race({
          shot: take(SHOT_TARGET),
          wait: take(WAIT),
          timeout: delay(GAME_TURN_TIME)
        });

        if (shot) {
          const actor = entities.find(actor => actor.id === shot.id);
          const { currentGame }: TRootState = yield select();
          const energy = currentGame.energy || 0;

          if (!actor || actor.status === "dead") {
            renderer.spamReaction(renderer.Reaction.WHAT);
            throw new Error(
              `shotTarget("${shot.id}") - Impossible de trouver la cible`
            );
          }

          if (energy < 1) {
            renderer.spamReaction(renderer.Reaction.HELP);
            console.error(
              `shotTarget("${shot.id}") - Vous n'avez plus assez d'énergie pour tirer !`
            );
            toast.warning(
              `shotTarget("${shot.id}") - Vous n'avez plus assez d'énergie pour tirer !`
            );
            hasError = true;
          } else {
            const killed = renderer.getActorDistance(actor.id) <= test.radius;
            if (killed) {
              actor.status = "dead";
            }

            renderer.shotActor(actor.id, killed);
            yield put(consumeEnergy());

            if (killed && actor.type === "rabbit") {
              throw new Error(
                `shotTarget("${shot.id}") - Vous ne devez pas tirer sur les lapins !`
              );
            }
          }
        } else if (wait) {
          // nothing to do
        } else {
          throw new Error(
            `Timeout, aucune action n'a été envoyée, utilisez "yield* wait();" ou "yield* shotTarget(<actor id>);"`
          );
        }

        checkHasLost(entities, renderer);
        removeSecuredRabbits(entities, renderer);
        if (yield* checkActionsSent()) {
          hasError = true;
        }

        if (!hasActiveEntities(entities, renderer)) {
          yield delay(100);

          // Check double action
          if (yield* checkActionsSent()) {
            hasError = true;
          }

          // End of game :houra:
          break;
        }

        yield delay(GAME_TURN_TIME / timeSpeed);

        checkHasLost(entities, renderer);
        removeSecuredRabbits(entities, renderer);
      }
    } catch (e) {
      toast.error(e.message);
      hasError = true;
      console.error(e);
    }

    renderer.stop();
    yield cancel(playgroundTask);
    yield put(endGame(!hasError));
  });
}
