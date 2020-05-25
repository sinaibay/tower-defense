import { TGameState } from "../../../typings/game-state";

const test: TGameState = {
  name: "Epargner les lapins !",
  description:
    "Un nouveau type d'entité fait son apparition: les lapins. Il ne faut surtout pas leur tirer dessus !",
  init: {
    radius: 50,
    energy: 18,
    position: {
      lat: 48.87810866590708,
      lng: 2.2982083106974187
    },
    randomize: false,
    actors: [
      {
        id: "terminator",
        type: "robot",
        speed: 40,
        lat: 48.87748749208476,
        lng: 2.2977000320890966,
        status: "alive"
      },
      {
        id: "biscuit",
        type: "rabbit",
        speed: 70,
        lat: 48.87844544367027,
        lng: 2.2996044004896703,
        status: "alive"
      },
      {
        id: "megatron",
        type: "robot",
        speed: 60,
        lat: 48.87892191796553,
        lng: 2.2986857439020696,
        status: "alive"
      },
      {
        id: "vanille",
        type: "rabbit",
        speed: 60,
        lat: 48.8785951219483,
        lng: 2.2985409046152654,
        status: "alive"
      },
      {
        id: "quickie",
        type: "rabbit",
        speed: 50,
        lat: 48.877218064895885,
        lng: 2.2974411989191594,
        status: "alive"
      },
      {
        id: "igloo",
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
