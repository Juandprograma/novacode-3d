"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

interface IdleArrowProps {
  position: THREE.Vector3;
}

export function IdleArrow({ position }: IdleArrowProps) {
  const arrowRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);

  useEffect(() => {
    // Pulsing animation
    let frame: number;
    const animate = () => {
      if (materialRef.current) {
        const opacity = 0.4 + Math.sin(Date.now() * 0.003) * 0.4;
        materialRef.current.opacity = opacity;
      }
      if (arrowRef.current) {
        const scale = 1 + Math.sin(Date.now() * 0.002) * 0.2;
        arrowRef.current.scale.setScalar(scale);
      }
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  // Position ahead of vehicle
  const arrowPosition = new THREE.Vector3(position.x, 0.1, position.z - 8);

  return (
    <group position={arrowPosition.toArray()}>
      {/* Arrow base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} ref={arrowRef}>
        <coneGeometry args={[1, 3, 3]} />
        <meshBasicMaterial 
          ref={materialRef}
          color="#D4AF37" 
          transparent 
          opacity={0.6}
        />
      </mesh>
      
      {/* Glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ringGeometry args={[2, 2.3, 32]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0.3} />
      </mesh>

      {/* Direction text hint */}
      <mesh position={[0, 0.5, 0]}>
        <planeGeometry args={[2, 0.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
