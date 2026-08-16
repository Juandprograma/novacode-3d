"use client";

import { useRef, useCallback } from "react";
import { Vector3 } from "three";
import { ControlState, VehicleState } from "@/types";

const BASE_ACCELERATION = 0.05;
const MAX_SPEED = 8;
const MAX_REVERSE_SPEED = 4;
const FRICTION = 0.94;
const TURN_SPEED = 0.03; // Aumentado para mayor agilidad
const BRAKE_FORCE = 0.75;
const IDLE_FRICTION = 0.92;

export function useVehiclePhysics() {
  const stateRef = useRef<VehicleState>({
    position: new Vector3(0, 0.5, 0),
    rotation: Math.PI, // Mirando hacia los items (180°)
    velocity: new Vector3(0, 0, 0),
  });

  const updatePhysics = useCallback((controls: ControlState, delta: number) => {
    const state = stateRef.current;
    const velocity = state.velocity;
    const speed = velocity.length();

    // Calculate speed factor for progressive acceleration curve
    const speedFactor = Math.max(0, 1 - speed / MAX_SPEED);
    const currentAcceleration = BASE_ACCELERATION * (0.5 + 0.5 * speedFactor);

    // Acceleration with curve
    if (controls.forward) {
      const accelVector = new Vector3(
        Math.sin(state.rotation) * currentAcceleration,
        0,
        Math.cos(state.rotation) * currentAcceleration
      );
      velocity.add(accelVector);
    }

    if (controls.backward) {
      const reverseAccel = currentAcceleration * 0.6;
      const reverseVector = new Vector3(
        -Math.sin(state.rotation) * reverseAccel,
        0,
        -Math.cos(state.rotation) * reverseAccel
      );
      velocity.add(reverseVector);
    }

    // Immediate hard braking with space
    if (controls.brake) {
      velocity.multiplyScalar(BRAKE_FORCE);
    }

    // Steering - FIXED: removed direction flip for natural steering
    // Now A always turns left, D always turns right regardless of velocity
    // At low speeds, allow sharper turns (up to 45 degrees) for better control in tight curves
    if (speed > 0.05) {
      let turnMultiplier;
      if (speed < 2) {
        // At low speeds, allow sharper turns for tight curves
        turnMultiplier = 1.5; // Boosted steering at low speeds
      } else {
        // At higher speeds, limit turn radius for safety
        turnMultiplier = Math.min(1, speed / 2);
      }
      if (controls.left) {
        state.rotation += TURN_SPEED * turnMultiplier;
      }
      if (controls.right) {
        state.rotation -= TURN_SPEED * turnMultiplier;
      }
    }

    // Speed limits
    const currentSpeed = velocity.length();
    const forwardSpeed = velocity.z;
    
    if (forwardSpeed > 0 && currentSpeed > MAX_SPEED) {
      velocity.normalize().multiplyScalar(MAX_SPEED);
    } else if (forwardSpeed < 0 && currentSpeed > MAX_REVERSE_SPEED) {
      velocity.normalize().multiplyScalar(MAX_REVERSE_SPEED);
    }

    // Dynamic friction - higher when not accelerating
    const isAccelerating = controls.forward || controls.backward;
    const appliedFriction = isAccelerating ? FRICTION : IDLE_FRICTION;
    velocity.multiplyScalar(appliedFriction);

    // Update position
    state.position.add(velocity.clone().multiplyScalar(delta * 60));

    // Keep vehicle on ground
    state.position.y = 0.5;

    return {
      position: state.position.clone(),
      rotation: state.rotation,
      velocity: state.velocity.clone(),
    };
  }, []);

  const resetPosition = useCallback(() => {
    stateRef.current = {
      position: new Vector3(0, 0.5, 0),
      rotation: Math.PI,
      velocity: new Vector3(0, 0, 0),
    };
  }, []);

  const teleportTo = useCallback((position: Vector3) => {
    stateRef.current.position.copy(position);
    stateRef.current.velocity.set(0, 0, 0);
  }, []);

  return { stateRef, updatePhysics, resetPosition, teleportTo };
}
