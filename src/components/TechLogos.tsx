"use client";

import { useRef, useEffect } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface TechLogosProps {
  positions?: {
    nextjs?: [number, number, number];
    prisma?: [number, number, number];
    vercel?: [number, number, number];
  };
}

// SVG Icons for tech logos
const NextJsLogo = () => (
  <svg viewBox="0 0 180 180" className="w-12 h-12">
    <mask id="nextjs-mask">
      <circle cx="90" cy="90" r="90" fill="white" />
    </mask>
    <g mask="url(#nextjs-mask)">
      <circle cx="90" cy="90" r="90" fill="black" />
      <path d="M149.5 140.5L67.5 40H40v100h22V76l68.5 88.5c5.5-3.5 12.5-8 19-14z" fill="white" />
      <path d="M135 40h20v100h-20V40z" fill="white" />
    </g>
  </svg>
);

const PrismaLogo = () => (
  <svg viewBox="0 0 32 32" className="w-10 h-10">
    <path 
      d="M25.3 23.9L14.8 30.7c-.5.3-1.1.3-1.6-.1s-.6-.9-.4-1.4l4-14.3c.1-.2.1-.5-.1-.7l-3.3-6.2c-.3-.5-.2-1.1.2-1.5l.4-.4c.5-.4 1.2-.4 1.7 0l9.5 7.1c.4.3.6.8.5 1.3l-1.8 9.5c-.1.4-.3.8-.6 1z" 
      fill="white"
    />
  </svg>
);

const VercelLogo = () => (
  <svg viewBox="0 0 76 65" className="w-10 h-10">
    <path d="M37.5 0L75 65H0L37.5 0z" fill="white" />
  </svg>
);

function FloatingLogo({ 
  position, 
  Logo, 
  label,
  delay = 0 
}: { 
  position: [number, number, number]; 
  Logo: React.FC;
  label: string;
  delay?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    let frame: number;
    const animate = () => {
      if (groupRef.current) {
        const time = Date.now() * 0.001 + delay;
        groupRef.current.position.y = position[1] + Math.sin(time) * 0.3;
        groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
      }
      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, [position, delay]);

  return (
    <group ref={groupRef} position={position}>
      {/* Glow effect */}
      <mesh position={[0, 0, -0.5]}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial 
          color="#D4AF37" 
          transparent 
          opacity={0.1} 
        />
      </mesh>
      
      <Html
        transform
        occlude
        position={[0, 0, 0]}
        style={{
          transition: "all 0.3s ease",
        }}
      >
        <div 
          className="flex flex-col items-center gap-2 p-4 rounded-lg cursor-pointer tech-logo"
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            border: "1px solid rgba(212, 175, 55, 0.3)",
            backdropFilter: "blur(4px)",
          }}
        >
          <Logo />
          <span 
            className="text-xs font-medium tracking-wider"
            style={{ 
              color: "rgba(255, 255, 255, 0.8)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {label}
          </span>
        </div>
      </Html>
    </group>
  );
}

export function TechLogos({ 
  positions = {
    nextjs: [-15, 2, -45],
    prisma: [15, 2, -45],
    vercel: [0, 3, -55],
  }
}: TechLogosProps) {
  return (
    <>
      <FloatingLogo 
        position={positions.nextjs || [-15, 2, -45]} 
        Logo={NextJsLogo} 
        label="Next.js"
        delay={0}
      />
      <FloatingLogo 
        position={positions.prisma || [15, 2, -45]} 
        Logo={PrismaLogo} 
        label="Prisma"
        delay={1}
      />
      <FloatingLogo 
        position={positions.vercel || [0, 3, -55]} 
        Logo={VercelLogo} 
        label="Vercel"
        delay={2}
      />
    </>
  );
}

export default TechLogos;
