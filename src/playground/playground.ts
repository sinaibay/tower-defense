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

type Entity = {
  id: string;
  status: string;
  lat: number;
  lon: number
}

type EntityType = {
  id: string;
  type: string;
  speed: number
}

/**
 * Fonction qui est lancé à chaque lancement de partie.
 */
export default function* playground() {
  // Lecture des données de base du jeu :
  const baseData = yield* readLine(); // "<base latitude> <base longitude> <base attack range> <base energy>"
  const baseDataSplit = baseData.split(' ')
  const baseDataObject = {
    lat: parseFloat(baseDataSplit[0]),
    lon: parseFloat(baseDataSplit[1]),
    range: parseFloat(baseDataSplit[2]),
    energy: parseInt(baseDataSplit[3])
  }

  const nbActors = yield* readLine(); // "<nb actors>"
  console.log(nbActors);

  // @ts-ignore TODO possible de corriger l'erreur sur la ligne suivante ?
  const types: EntityType[] = []
  for (let i = 0; i < parseInt(nbActors); i++) {
    const actor = yield* readLine(); // "<actor id> <actor type (robot|rabbit)> <actor speed (km/h)>"
    const actorSplit = actor.split(' ')
    types.push({
      id: actorSplit[0],
      type: actorSplit[1],
      speed: parseFloat(actorSplit[2])
    })
  }

  // Code exécuté à chaque tour
  while (true) {
    // A chaque tour, on récupère les mises à jour de chaque entités (statut
    // vivant ou mort, nouvelle position, ...)
    // @ts-ignore TODO possible de corriger l'erreur sur la ligne suivante ?
    const entities: Entity[] = []
    for (let i = 0; i < parseInt(nbActors); i++) {
      const actor = yield* readLine(); // "<actor id> <actor status (alive|dead)> <actor latitude> <actor longitude>"
      const actorSplit = actor.split(' ')
      entities.push({
        id: actorSplit[0],
        status: actorSplit[1],
        lat: parseFloat(actorSplit[2]),
        lon: parseFloat(actorSplit[3])
      })
    }

    // Après avoir reçu les mises à jour, on doit effectuer une (ET UNE SEULE) action:
    // - `yield* wait()` : On ne fait rien (on passe notre tour)
    // - `yield* shotTarget('nemo');` : On décide de tirer sur l'entité qui a l'id "nemo"
    let target
    for (let i = 0; i < entities.length; i++) {
      const distance = calcDistance(entities[i].lat, entities[i].lon, baseDataObject.lat, baseDataObject.lon)
      const entityType = types.find(type => entities[i].id === type.id)
      if (distance < baseDataObject.range && entities[i].status === 'alive' && entityType && entityType.type === 'robot') {
        target = entities[i].id
        break
      } else {
        target = null
      }
    }

    if (target) {
      yield* shotTarget(target)
    } else {
      yield* wait();
    }
  }
}
