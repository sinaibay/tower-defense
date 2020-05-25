import { TGameState } from "../../../typings/game-state";

const test: TGameState = {
  name: "Prioriser les robots les plus proches",
  description:
    "Les ennemis arrivent à la queuleuleu, il faut alors tirer sur l'ennemi le plus proche de la tour !",
  init: {
    radius: 50,
    energy: 4,
    position: {
      lat: 48.87810866590708,
      lng: 2.2982083106974187
    },
    randomize: true,
    actors: [
      {
        id: "terminator",
        type: "robot",
        speed: 75,
        lat: 48.87885456323589,
        lng: 2.2987152482012334,
        status: "alive"
      },
      {
        id: "megatron",
        type: "robot",
        speed: 75,
        lat: 48.8786125843849,
        lng: 2.29855431566034,
        status: "alive"
      },
      {
        id: "robocop",
        type: "robot",
        speed: 75,
        lat: 48.878724842760306,
        lng: 2.2986347819307866,
        status: "alive"
      },
      {
        id: "goldorak",
        type: "robot",
        speed: 75,
        lat: 48.87852277750318,
        lng: 2.2984872604349675,
        status: "alive"
      },
      {
        id: "biscuit",
        type: "rabbit",
        speed: 40,
        lat: 48.8784354651025,
        lng: 2.298774256799561,
        status: "alive"
      }
    ]
  }
};

export default test;
