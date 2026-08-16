"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Grid, Stars } from "@react-three/drei";
import * as THREE from "three";
import { useOrbitalCamera } from "@/hooks/useOrbitalCamera";
import { NovacodeSign } from "./NovacodeSign";

function FogEffect() {
  const { scene } = useThree();
  
  useMemo(() => {
    scene.fog = new THREE.FogExp2("#000000", 0.015);
    scene.background = new THREE.Color("#000000");
  }, [scene]);

  return null;
}

function InfiniteGrid() {
  const gridRef = useRef<THREE.GridHelper>(null);
  
  useFrame(({ camera }) => {
    if (gridRef.current) {
      const x = Math.round(camera.position.x / 10) * 10;
      const z = Math.round(camera.position.z / 10) * 10;
      gridRef.current.position.x = x;
      gridRef.current.position.z = z;
    }
  });

  return (
    <Grid
      ref={gridRef}
      position={[0, 0, 0]}
      args={[100, 100]}
      cellSize={2}
      cellThickness={0.5}
      cellColor="#1a1a1a"
      sectionSize={10}
      sectionThickness={1}
      sectionColor="#333333"
      fadeDistance={80}
      fadeStrength={1}
      infiniteGrid
    />
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[500, 500]} />
      <meshStandardMaterial color="#000000" roughness={1} metalness={0} />
    </mesh>
  );
}

function StarField() {
  return (
    <Stars
      radius={150}
      depth={50}
      count={2000}
      factor={4}
      saturation={0}
      fade
      speed={0.3}
    />
  );
}

// Road system with glowing lines - Updated for new station layout
function Roads() {
  const roadPath = useMemo(() => {
    // Main highway going through all stations (straight line)
    const points = [];
    for (let z = 20; z >= -130; z -= 5) {
      points.push(new THREE.Vector3(0, 0.02, z));
    }
    const curve = new THREE.CatmullRomCurve3(points);
    return curve;
  }, []);

  const points = useMemo(() => roadPath.getPoints(100), [roadPath]);

  return (
    <>
      {/* Main road glow */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#D4AF37" linewidth={3} transparent opacity={0.8} />
      </line>

      {/* Side markers */}
      {points.filter((_, i) => i % 10 === 0).map((point, i) => (
        <mesh key={i} position={[point.x + 1.5, 0.05, point.z]}>
          <boxGeometry args={[0.1, 0.1, 0.3]} />
          <meshBasicMaterial color="#D4AF37" />
        </mesh>
      ))}
      {points.filter((_, i) => i % 10 === 0).map((point, i) => (
        <mesh key={`left-${i}`} position={[point.x - 1.5, 0.05, point.z]}>
          <boxGeometry args={[0.1, 0.1, 0.3]} />
          <meshBasicMaterial color="#D4AF37" />
        </mesh>
      ))}
    </>
  );
}

interface WorldProps {
  children: React.ReactNode;
  cameraTarget: React.MutableRefObject<THREE.Vector3>;
  cameraFocus?: React.MutableRefObject<THREE.Vector3 | null>;
}

export function World({ children, cameraTarget, cameraFocus }: WorldProps) {
  return (
    <div className="canvas-container">
      <Canvas
        shadows
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        <FogEffect />
        <ambientLight intensity={0.2} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={0.8}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        
        <InfiniteGrid />
        <Ground />
        <StarField />
        <Roads />
        <NovacodeSign />
        
        {children}
        
        <OrbitalCameraController target={cameraTarget} focus={cameraFocus} />
      </Canvas>
    </div>
  );
}

function OrbitalCameraController({ 
  target, 
  focus 
}: { 
  target: React.MutableRefObject<THREE.Vector3>;
  focus?: React.MutableRefObject<THREE.Vector3 | null>;
}) {
  const { camera } = useThree();
  const { updateTarget, getCameraPosition } = useOrbitalCamera(0, Math.PI / 3, 18);
  const currentFocusRef = useRef<THREE.Vector3 | null>(null);
  const transitionProgressRef = useRef(0);

  useFrame(() => {
    // Check for new focus target
    if (focus?.current && currentFocusRef.current !== focus.current) {
      currentFocusRef.current = focus.current.clone();
      transitionProgressRef.current = 0;
    }

    // Calculate target position
    let targetPos = target.current.clone();
    
    // If transitioning to a focus point, lerp towards it
    if (currentFocusRef.current && transitionProgressRef.current < 1) {
      transitionProgressRef.current += 0.02;
      const t = Math.min(transitionProgressRef.current, 1);
      // Smooth easing
      const easeT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      targetPos.lerp(currentFocusRef.current, easeT);
    }

    updateTarget(targetPos);
    const { position, target: lookAt } = getCameraPosition(0.06);
    
    camera.position.copy(position);
    camera.lookAt(lookAt);
  });

  return null;
}

export default World;
