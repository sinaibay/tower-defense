import { TGameState } from "../../../typings/game-state";

const test: TGameState = {
  name: "Economiser son énergie",
  description:
    'Pour ce niveau, vous ne pouvez tirer que 2 fois. Il faudra donc utiliser la fonction <strong><code>"yield* wait()"</code></strong> pour attendre que les ennemis soient dans la zone de tire avant de leur tirer dessus !',
  init: {
    radius: 30,
    energy: 2,
    position: {
      lat: 48.87810866590708,
      lng: 2.2982083106974187
    },
    randomize: true,
    actors: [
      {
        id: "terminator",
        type: "robot",
        speed: 45,
        lat: 48.87748749208476,
        lng: 2.2977000320890966,
        status: "alive"
      },
      {
        id: "caramel",
        type: "rabbit",
        speed: 80,
        lat: 48.87844544367027,
        lng: 2.2996044004896703,
        status: "alive"
      },
      {
        id: "quickie",
        type: "robot",
        speed: 60,
        lat: 48.878113655223835,
        lng: 2.2967988098600927,
        status: "alive"
      }
    ]
  }
};

export default test;
