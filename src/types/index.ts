import { Vector3 } from "three";

export interface VehicleState {
  position: Vector3;
  rotation: number;
  velocity: Vector3;
}

export interface ControlState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  brake: boolean;
}

export interface Station {
  id: string;
  position: [number, number, number];
  title: string;
  description: string;
  type: "start" | "services" | "contact";
}

export interface ServiceInfo {
  title: string;
  items: string[];
}
