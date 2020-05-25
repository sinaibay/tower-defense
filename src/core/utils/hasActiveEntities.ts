import { GameRenderer } from "./../GameRenderer";
import { TActor } from "../../../typings/actor";

export function hasActiveEntities(
  entities: TActor[],
  renderer: GameRenderer
): boolean {
  return entities.some(
    actor =>
      (actor.type === "robot" && actor.status === "alive") ||
      (actor.type === "rabbit" && renderer.getActorDistance(actor.id) > 1)
  );
}
