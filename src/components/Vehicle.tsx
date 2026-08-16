"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Box, Trail } from "@react-three/drei";
import * as THREE from "three";
import { ControlState } from "@/types";
import { useVehiclePhysics } from "@/hooks/useVehiclePhysics";

interface VehicleProps {
  controls: ControlState;
  onPositionUpdate: (position: THREE.Vector3) => void;
  onRotationUpdate?: (rotation: number) => void;
  teleportTarget?: THREE.Vector3 | null;
  onTeleportComplete?: () => void;
}

export function Vehicle({ 
  controls, 
  onPositionUpdate, 
  onRotationUpdate,
  teleportTarget,
  onTeleportComplete 
}: VehicleProps) {
  const meshRef = useRef<THREE.Group>(null);
  const { updatePhysics, stateRef, teleportTo } = useVehiclePhysics();
  const trailRef = useRef<THREE.Mesh>(null);
  
  // Handle teleport
  useEffect(() => {
    if (teleportTarget) {
      teleportTo(teleportTarget);
      onTeleportComplete?.();
    }
  }, [teleportTarget, teleportTo, onTeleportComplete]);

  useFrame((state, delta) => {
    const vehicleState = updatePhysics(controls, delta);

    if (meshRef.current) {
      meshRef.current.position.copy(vehicleState.position);
      meshRef.current.rotation.y = vehicleState.rotation;
      
      // Tilt when turning
      const tiltAmount = (controls.left ? 1 : 0) - (controls.right ? 1 : 0);
      meshRef.current.rotation.z = tiltAmount * 0.1;
      
      // Pitch when accelerating/braking
      const pitchAmount = (controls.forward ? -1 : 0) + (controls.backward ? 1 : 0);
      meshRef.current.rotation.x = pitchAmount * 0.05;
    }

    onPositionUpdate(vehicleState.position);
    onRotationUpdate?.(vehicleState.rotation);
  });

  return (
    <group ref={meshRef}>
      {/* Main body */}
      <Box
        args={[1.2, 0.6, 2.5]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.9}
          roughness={0.2}
          emissive="#B8960C"
          emissiveIntensity={0.2}
        />
      </Box>

      {/* Cockpit */}
      <Box
        args={[0.8, 0.4, 1]}
        position={[0, 0.5, -0.3]}
        castShadow
      >
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.3}
        />
      </Box>

      {/* Glow strips */}
      <Box
        args={[1.22, 0.05, 2.3]}
        position={[0, 0.1, 0]}
      >
        <meshBasicMaterial color="#E5C76B" />
      </Box>

      {/* Headlights */}
      <Box
        args={[0.3, 0.15, 0.05]}
        position={[-0.35, 0, 1.25]}
      >
        <meshBasicMaterial color="#ffffff" />
      </Box>
      <Box
        args={[0.3, 0.15, 0.05]}
        position={[0.35, 0, 1.25]}
      >
        <meshBasicMaterial color="#ffffff" />
      </Box>

      {/* Tail lights */}
      <Box
        args={[0.25, 0.1, 0.05]}
        position={[-0.35, 0.1, -1.25]}
      >
        <meshBasicMaterial color="#ff3333" />
      </Box>
      <Box
        args={[0.25, 0.1, 0.05]}
        position={[0.35, 0.1, -1.25]}
      >
        <meshBasicMaterial color="#ff3333" />
      </Box>

      {/* Engine glow */}
      <pointLight
        position={[0, 0.5, -1.5]}
        color="#D4AF37"
        intensity={2}
        distance={5}
      />

      {/* Speed trail */}
      <Trail
        width={0.5}
        length={4}
        color="#D4AF37"
        attenuation={(t) => t * t}
      >
        <mesh ref={trailRef} position={[0, 0, -2]} visible={false}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
        </mesh>
      </Trail>
    </group>
  );
}

export default Vehicle;
