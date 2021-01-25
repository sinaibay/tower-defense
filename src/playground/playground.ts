// Bonjour ! Si vous ne connaissez pas la syntaxe "yield* xxx", imaginez que se
// sont des "await". Dans notre cas pratique cela fonctionne de la même manière.

import {
  /**
   * Function pour récupérer une ligne d'input.
   * Comme c'est un générateur, on l'appelle de la manière suivante:
   *
   * const line = yield* readLine();
   * console.log(line); // affiche le texte
   */
  readLine,

  /**
   * Function qui permet de passer son tour.
   * Cela veut dire que pour ce tour on décide de ne tirer sur personne.
   *
   * C'est également un générateur, on l'utilise de cette manière:
   *
   * yield* wait();
   */
  wait,

  /**
   * Function qui permet de tirer sur une cible.
   * Pour se faire, on lui envoie l'id de l'ennemi en paramètre.
   *
   * Exemple:
   *
   * yield* shotTarget('terminator');
   */
  shotTarget
} from "./utils";

const calcDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return d
}

/**
 * Fonction qui est lancé à chaque lancement de partie.
 */
export default function* playground() {
  // Lecture des données de base du jeu :
  const baseData = yield* readLine(); // "<base latitude> <base longitude> <base attack range> <base energy>"
  const baseDataArray = baseData.split(' ')
  console.log(baseData);

  const nbActors = yield* readLine(); // "<nb actors>"
  console.log(nbActors);

  // @ts-ignore TODO possible de corriger l'erreur sur la ligne suivante ?
  for (let i = 0; i < parseInt(nbActors); i++) {
    const actor = yield* readLine(); // "<actor id> <actor type (robot|rabbit)> <actor speed (km/h)>"
    console.log("init", actor);
  }

  // Code exécuté à chaque tour
  while (true) {
    // A chaque tour, on récupère les mises à jour de chaque entités (statut
    // vivant ou mort, nouvelle position, ...)
    // @ts-ignore TODO possible de corriger l'erreur sur la ligne suivante ?
    const entities = []
    for (let i = 0; i < parseInt(nbActors); i++) {
      const actor = yield* readLine(); // "<actor id> <actor status (alive|dead)> <actor latitude> <actor longitude>"
      //console.log("update", actor);
      entities.push(actor)

    }

    // Après avoir reçu les mises à jour, on doit effectuer une (ET UNE SEULE) action:
    // - `yield* wait()` : On ne fait rien (on passe notre tour)
    // - `yield* shotTarget('nemo');` : On décide de tirer sur l'entité qui a l'id "nemo"
    for (let i = 0; i < entities.length; i++) {
      const actorArray = entities[i].split(' ')
      const lat1 = parseFloat(actorArray[2])
      const lon1 = parseFloat(actorArray[3])
      const lat2 = parseFloat(baseDataArray[0])
      const lon2 = parseFloat(baseDataArray[1])
      const distance = calcDistance(lat1, lon1, lat2, lon2)
      if (distance < parseFloat(baseDataArray[2])) {
        if (actorArray[1] === 'alive') yield* shotTarget(actorArray[0])
      } else {
        yield* wait();
      }
    }
  }
}
