import { TPosition } from "./../../typings/position";
import { TActor } from "../../typings/actor";
import { internalD } from "./utils/internalD";

const IMAGE_TOWER = require("../images/tower.gif");
const IMAGE_HELP = require("../images/help.gif");
const IMAGE_WTF = require("../images/wtf.gif");
const IMAGE_QUESTION = require("../images/question.gif");
const IMAGE_ENEMY = require("../images/robot.gif");
const IMAGE_PERSON = require("../images/person.gif");
const IMAGE_BOOM = require("../images/boom.gif");

interface TGameActor extends TActor {
  marker: google.maps.Marker;
  start: google.maps.LatLng;
  tick: number;
  distance: number;
}

/**
 * It's the class that play all animations
 */
export class GameRenderer {
  static _instance: null | GameRenderer;

  Reaction: { [key: string]: number } = {
    HELP: 1,
    WTF: 2,
    WHAT: 3,
    BOOM: 4
  };

  /**
   * Generic singleTon implementation
   */
  static getSingleTon(): GameRenderer {
    return this._instance || (this._instance = new GameRenderer());
  }

  /**
   * @private {google.maps.Map} google.map.Map instance
   */
  private map: google.maps.Map;

  /**
   * @private {google.maps.Marker | null} base marker
   */
  private tower: google.maps.Marker | null = null;

  /**
   * @private {google.maps.Marker | null} tower attack range
   */
  private towerRange: google.maps.Circle | null = null;

  /**
   * @private {number} the base attack range
   */
  private attackRange: number = 0;

  /**
   * @private {google.maps.Marker[]} tower reactions
   */
  private reactions: google.maps.Marker[] = [];

  /**
   * @private {TGameActor[]} list of actors in game
   */
  private actors: TGameActor[] = [];

  /**
   * @private {number} request animation frame id
   */
  private frameId: number = 0;

  /**
   * @private {number} timeSpeed
   */
  private timeSpeed: number = 1;

  constructor() {
    const element = document.getElementById("map");
    if (!element) {
      throw new Error("GameRender missing #map element");
    }

    this.map = new google.maps.Map(element, {
      zoom: 18.5,
      mapTypeId: "satellite",
      disableDefaultUI: true,
      scrollwheel: false,
      mapTypeControl: false,
      scaleControl: false,
      draggable: false
    });
  }

  /**
   * Reset the map context
   *
   * @public
   */
  reset(): void {
    if (this.tower) {
      this.tower.setMap(null);
      this.tower = null;
    }

    if (this.towerRange) {
      this.towerRange.setMap(null);
      this.towerRange = null;
    }

    this.reactions.forEach(reaction => {
      reaction.setMap(null);
    });

    this.actors.forEach(actor => {
      actor.marker.setMap(null);
    });

    this.actors.length = 0;
    this.reactions.length = 0;
  }

  /**
   * Set map position
   *
   * @param {TPosition} position
   * @public
   */
  public setPosition(position: TPosition): void {
    this.map.setCenter(position);
  }

  /**
   * Set time speed
   *
   * @param {TPosition} position
   * @public
   */
  public setTimeSpeed(timeSpeed: number): void {
    this.timeSpeed = timeSpeed;
  }

  /**
   * Request to add tower to the map
   *
   * @param {TPosition} position
   * @param {number} attackRange
   * @public
   */
  public addTower(position: TPosition, attackRange: number): void {
    this.attackRange = attackRange;

    this.tower =
      this.tower ||
      new google.maps.Marker({
        position,
        map: this.map,
        icon: {
          url: IMAGE_TOWER,
          scaledSize: new google.maps.Size(152 / 2, 300 / 2)
        }
      });

    if (this.towerRange) {
      this.towerRange.setMap(null);
      this.towerRange = null;
    }
  }

  /**
   * Just destroy the tower
   *
   * @public
   */
  destroyTower(): void {
    if (this.tower) {
      this.reactions.forEach(reaction => {
        reaction.setMap(null);
      });

      this.reactions.length = 0;
      this.spamReaction(this.Reaction.BOOM);
      this.tower.setMap(null);
      this.tower = null;
    }
  }

  /**
   * Request to spam an actor
   *
   * @param {TActor} actor
   * @public
   */
  public spamActor(actor: TActor): void {
    const basePosition = this.tower?.getPosition();
    if (!basePosition) {
      return;
    }

    const actorPosition = new google.maps.LatLng(actor.lat, actor.lng);
    const imageUrl = actor.type === "robot" ? IMAGE_ENEMY : IMAGE_PERSON;
    const scale =
      actor.type === "robot" ? [500 / 4, 500 / 4] : [600 / 5, 300 / 5];
    const degres =
      (Math.atan2(
        actorPosition.lat() - basePosition.lat(),
        actorPosition.lng() - basePosition.lng()
      ) *
        180) /
      Math.PI;

    const marker = new google.maps.Marker({
      position: actorPosition,
      map: this.map,
      icon: {
        url: imageUrl + (degres > -90 && degres < 90 ? "#reversed" : ""),
        scaledSize: new google.maps.Size(scale[0], scale[1])
      }
    });

    this.actors.push({
      ...actor,
      marker,
      tick: Date.now(),
      start: actorPosition,
      distance: internalD(actorPosition, basePosition)
    });
  }

  /**
   * Request to remove an actor
   *
   * @param {string} id
   * @public
   */
  removeActor(id: string): void {
    const index = this.actors.findIndex(actor => actor.id === id);
    if (index !== -1) {
      this.actors[index].marker.setMap(null);
      this.actors.splice(index, 1);
    }
  }

  /**
   * Spam a reaction
   *
   * @param {number} type
   * @public
   */
  spamReaction(type: number, id?: string): void {
    const actor = !id
      ? this.tower
      : this.actors.find(actor => actor.id === id)?.marker;
    const position = actor ? actor.getPosition() : null;
    if (!position) {
      return;
    }

    let size: google.maps.Size;
    let image: any;
    let delay = 700;
    let pos = position;
    const map = document.getElementById("map");

    switch (type) {
      default:
        return;

      case this.Reaction.HELP:
        const exists = this.reactions.some(
          // @ts-ignore
          reaction => reaction.getIcon()?.url === IMAGE_HELP
        );
        if (exists) {
          return;
        }
        size = new google.maps.Size(200 / 1.5, 200 / 1.5);
        image = IMAGE_HELP;
        delay = Infinity;
        break;

      case this.Reaction.WHAT:
        size = new google.maps.Size(200 / 4, 200 / 4);
        image = IMAGE_QUESTION;
        pos = new google.maps.LatLng(48.8784, 2.2981);
        break;

      case this.Reaction.WTF:
        size = new google.maps.Size(200 / 4, 200 / 4);
        image = IMAGE_WTF;
        pos = new google.maps.LatLng(48.8784, 2.2981);
        break;

      case this.Reaction.BOOM:
        size = new google.maps.Size(157, 229);
        image = IMAGE_BOOM;
        delay = 1000;

        if (map) {
          map.style.animation = "";
          requestAnimationFrame(() => {
            map.style.animation = "seism 30ms 10";
          });
        }
        break;
    }

    const marker = new google.maps.Marker({
      position: pos,
      map: this.map,
      icon: {
        url: image,
        scaledSize: size
      }
    });

    this.reactions.push(marker);

    if (isFinite(delay)) {
      setTimeout(() => {
        marker.setMap(null);
        const index = this.reactions.indexOf(marker);
        if (index !== -1) {
          this.reactions.splice(index, 1);
        }
      }, delay);
    }
  }

  /**
   * Show visual effect when shotting a target
   *
   * @param {string} id
   * @public
   */
  shotActor(id: string, killed: boolean) {
    const actor = this.actors.find(actor => actor.id === id);
    if (!actor) {
      this.spamReaction(this.Reaction.WHAT);
      return;
    }

    const position = actor.marker.getPosition() as google.maps.LatLng;
    const laser = new google.maps.Polyline({
      path: [
        { lat: 48.87841800260405, lng: 2.2981922174433294 },
        { lat: position.lat(), lng: position.lng() }
      ],
      geodesic: false,
      strokeColor: "#FF0000",
      strokeOpacity: killed ? 1 : 0.2,
      strokeWeight: 10
    });

    laser.setMap(this.map);

    if (killed) {
      this.spamReaction(this.Reaction.BOOM, id);
      this.removeActor(id);
    }

    setTimeout(() => laser.setMap(null), 500);
  }

  /**
   * Update attack range zone
   *
   * @param {Boolean} danger (change the style color)
   * @public
   */
  renderAttackZone(danger: boolean): void {
    const basePosition = this.tower?.getPosition();
    if (!basePosition) {
      return;
    }

    const color = danger ? "#FF0000" : "#00AAAA";

    // We cannot update fillColor, so we need to remove it and add
    // a new one
    if (this.towerRange) {
      // @ts-ignore Typescript doesn't seems to know about circle.fillStyle
      if (this.towerRange.fillColor === color) {
        return;
      }

      this.towerRange.setMap(null);
    }

    this.towerRange = new google.maps.Circle({
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      map: this.map,
      center: basePosition,
      radius: this.attackRange
    });
  }

  /**
   * Request to get actor current position
   *
   * @param {string} id
   * @returns {google.maps.LatLng | null | void}
   * @public
   */
  getActorPosition(id: string): google.maps.LatLng | null | void {
    const actor = this.actors.find(actor => actor.id === id);
    return actor ? actor.marker.getPosition() : null;
  }

  /**
   * Get distance in meters
   *
   * @param {string} id
   * @returns {Number}
   * @private
   */
  public getActorDistance(id: string): number {
    const p0 = this.actors.find(actor => actor.id === id)?.marker.getPosition();
    const p1 = this.tower?.getPosition();
    return !p0 || !p1 ? 0 : internalD(p0, p1);
  }

  /**
   * Start rendering
   *
   * @public
   */
  start(): void {
    this.stop();
    this.render();
  }

  /**
   * Stop rendering
   *
   * @public
   */
  stop(): void {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = 0;
    }
  }

  /**
   * Rendering loop
   *
   * @public
   */
  render(): void {
    const tower = this.tower;
    const tick = Date.now();

    if (!tower) {
      this.frameId = 0;
      return;
    }

    this.actors.forEach(actor => {
      const timePassed = ((tick - actor.tick) / 1000) * this.timeSpeed;
      const timeForDist = actor.distance / ((actor.speed / 60 / 60) * 1000);
      const f = Math.max(0, Math.min(1, timePassed / timeForDist));
      const basePosition = tower.getPosition() as google.maps.LatLng;

      actor.marker.setPosition(
        new google.maps.LatLng(
          actor.start.lat() + (basePosition.lat() - actor.start.lat()) * f,
          actor.start.lng() + (basePosition.lng() - actor.start.lng()) * f
        )
      );
    });

    // Render circle
    this.renderAttackZone(
      this.actors.some(
        actor =>
          actor.type === "robot" &&
          actor.status === "alive" &&
          this.getActorDistance(actor.id) <= this.attackRange
      )
    );

    this.frameId = requestAnimationFrame(() => this.render());
  }
}
