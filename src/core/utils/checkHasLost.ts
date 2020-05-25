import { GameRenderer } from "./../GameRenderer";
import { TActor } from "../../../typings/actor";

export function checkHasLost(entities: TActor[], renderer: GameRenderer): void {
  const hasLost = entities.some(
    actor =>
      actor.type === "robot" &&
      actor.status === "alive" &&
      renderer.getActorDistance(actor.id) < 1
  );

  if (hasLost) {
    renderer.destroyTower();
    throw new Error(`Votre tour a été détruite`);
  }
}
