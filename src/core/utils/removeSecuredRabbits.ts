import { GameRenderer } from "./../GameRenderer";
import { TActor } from "../../../typings/actor";

export function removeSecuredRabbits(
  entities: TActor[],
  renderer: GameRenderer
): void {
  entities
    .filter(
      actor =>
        actor.type === "rabbit" && renderer.getActorDistance(actor.id) <= 1
    )
    .forEach(actor => {
      renderer.removeActor(actor.id);
    });
}
