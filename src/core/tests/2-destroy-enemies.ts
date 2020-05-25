import { TGameState } from "../../../typings/game-state";

const test: TGameState = {
  name: "Détruire plusieurs robots",
  description: `Le but ici est de pouvoir gérer plusieurs ennemis.
Dans les mises à jour des entités à chaque tour, on récupère le status <code>"dead" | "alive"</code> celui-ci peut nous aider pour décider sur quel ennemi tirer (uniquement celui qui est en vie).
`,
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
        lat: 48.878938132979485,
        lng: 2.2987273181418004,
        status: "alive"
      },
      {
        id: "megatron",
        type: "robot",
        speed: 40,
        lat: 48.877573558797614,
        lng: 2.2993710483053746,
        status: "alive"
      }
    ]
  }
};

export default test;
