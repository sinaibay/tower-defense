import { TPosition } from "./position";

export interface TActor extends TPosition {
  id: string;
  type: "robot" | "rabbit";
  speed: number;
  lat: number;
  lng: number;
  status: "alive" | "dead";
}
