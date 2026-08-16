"use client";

import { useRef, useEffect } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export function NovacodeSign() {
  const groupRef = useRef<THREE.Group>(null);

  // Floating animation
  useEffect(() => {
    let frame: number;
    const animate = () => {
      if (groupRef.current) {
        const y = 5 + Math.sin(Date.now() * 0.001) * 0.3;
        groupRef.current.position.y = y;
      }
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <group ref={groupRef} position={[0, 5, 0]}>
      {/* Neon glow effect */}
      <pointLight
        position={[0, 0, 0]}
        color="#D4AF37"
        intensity={3}
        distance={15}
        decay={2}
      />
      
      {/* Glow spheres behind */}
      <mesh position={[-3, 0, -0.5]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0.1} />
      </mesh>
      <mesh position={[3, 0, -0.5]}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="#D4AF37" transparent opacity={0.1} />
      </mesh>

      {/* Main text */}
      <Html
        transform
        occlude
        position={[0, 0, 0]}
        style={{
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        <div className="text-center">
          <h1
            className="text-7xl md:text-9xl font-black tracking-tighter"
            style={{
              color: "#D4AF37",
              fontFamily: "'JetBrains Mono', monospace",
              textShadow: `
                0 0 10px #D4AF37,
                0 0 20px #D4AF37,
                0 0 40px #D4AF37,
                0 0 80px rgba(212, 175, 55, 0.8),
                0 0 120px rgba(212, 175, 55, 0.6)
              `,
              animation: "flicker 3s infinite alternate",
            }}
          >
            NOVACODE
          </h1>
          <p
            className="text-sm mt-3 tracking-[0.3em] uppercase"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              fontFamily: "'JetBrains Mono', monospace",
              textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
            }}
          >
            Agencia de Desarrollo Web - Bogotá
          </p>
        </div>
      </Html>

      {/* Decorative line under */}
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[6, 0.05, 0.05]} />
        <meshBasicMaterial color="#D4AF37" />
      </mesh>
    </group>
  );
}
