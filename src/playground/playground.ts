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

/**
 * Fonction qui est lancé à chaque lancement de partie.
 */
export default function* playground() {
  // Lecture des données de base du jeu :
  const baseData = yield* readLine(); // "<base latitude> <base longitude> <base attack range> <base energy>"
  console.log(baseData);

  const nbActors = yield* readLine(); // "<nb actors>"
  console.log(nbActors);

  // @ts-ignore TODO possible de corriger l'erreur sur la ligne suivante ?
  for (let i = 0; i < nbActors; ++i) {
    const actor = yield* readLine(); // "<actor id> <actor type (robot|rabbit)> <actor speed (km/h)>"
    console.log("init", actor);
  }

  // Code exécuté à chaque tour
  while (true) {
    // A chaque tour, on récupère les mises à jour de chaque entités (statut
    // vivant ou mort, nouvelle position, ...)
    // @ts-ignore TODO possible de corriger l'erreur sur la ligne suivante ?
    for (let i = 0; i < nbActors; ++i) {
      const actor = yield* readLine(); // "<actor id> <actor status (alive|dead)> <actor latitude> <actor longitude>"
      console.log("update", actor);
    }

    // Après avoir reçu les mises à jour, on doit effectuer une (ET UNE SEULE) action:
    // - `yield* wait()` : On ne fait rien (on passe notre tour)
    // - `yield* shotTarget('nemo');` : On décide de tirer sur l'entité qui a l'id "nemo"
    yield* wait();
    //yield* shotTarget('the actor id');
  }
}
