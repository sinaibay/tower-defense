import { TGameState } from "../../../typings/game-state";

const test: TGameState = {
  name: "Prendre en compte la vitesse de déplacement !",
  description:
    "Certains ennemis vont plus vites que d'autres, il faut donc prendre en compte leur vitesse de déplacement pour éviter de se faire détruire !",
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
        speed: 50,
        lat: 48.87756981676969,
        lng: 2.2977094198206487,
        status: "alive"
      },
      {
        id: "megatron",
        type: "robot",
        speed: 130,
        lat: 48.876981067557864,
        lng: 2.2973365927675786,
        status: "alive"
      },
      {
        id: "C3-PO",
        type: "robot",
        speed: 40,
        lat: 48.87770951895527,
        lng: 2.2987393880823674,
        status: "alive"
      },
      {
        id: "decepticon",
        type: "robot",
        speed: 40,
        lat: 48.87856019705683,
        lng: 2.2985355401972356,
        status: "alive"
      },
      {
        id: "quickie",
        type: "rabbit",
        speed: 60,
        lat: 48.87909903552546,
        lng: 2.298876180742127,
        status: "alive"
      }
    ]
  }
};

export default test;
