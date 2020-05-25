import { TGameState } from "../../../typings/game-state";

const test: TGameState = {
  name: "Détruire le robot",
  description: `1. Récupérer et traiter les données reçus de : <strong><code>yield* readLine()</code></strong>
2. Utiliser <strong><code>yield* shotTarget(&lt;actor id&gt;)</code></strong> en donnant en paramètre l'id de l'ennemi sur lequel on tire.`,
  init: {
    radius: 50,
    energy: 18,
    position: {
      lat: 48.87810866590708,
      lng: 2.2982083106974187
    },
    actors: [
      {
        id: "terminator",
        type: "robot",
        speed: 40,
        lat: 48.87748749208476,
        lng: 2.2977000320890966,
        status: "alive"
      }
    ]
  }
};

export default test;
