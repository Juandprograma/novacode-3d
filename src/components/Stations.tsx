"use client";

import { useRef, useState, useEffect } from "react";
import { Html, Cylinder, Torus } from "@react-three/drei";
import * as THREE from "three";
import { Rocket, Cpu, Sparkles, User, MessageCircle, LucideIcon } from "lucide-react";

interface StationsProps {
  vehiclePosition: THREE.Vector3;
  onStationActivate?: (stationId: string | null) => void;
}

interface StationConfig {
  id: string;
  position: THREE.Vector3;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  color: string;
  radius: number;
  phone?: string;
}

// 5 Stations Architecture - Definitive Content
const STATIONS: Record<string, StationConfig> = {
  hero: {
    id: "hero",
    position: new THREE.Vector3(0, 0, -30),
    title: "DESARROLLO DE ACTIVOS DIGITALES",
    subtitle: "Que escalan tu negocio",
    icon: Rocket,
    color: "#D4AF37",
    radius: 10,
  },
  diferencial: {
    id: "diferencial",
    position: new THREE.Vector3(0, 0, -60),
    title: "TECNOLOGÍA AVANZADA",
    subtitle: "Para problemas reales",
    icon: Cpu,
    color: "#9B59B6",
    radius: 10,
  },
  proyectos: {
    id: "proyectos",
    position: new THREE.Vector3(0, 0, -90),
    title: "PROYECTOS DESTACADOS",
    subtitle: "Soluciones que generan impacto",
    icon: Sparkles,
    color: "#3498DB",
    radius: 10,
  },
  perfil: {
    id: "perfil",
    position: new THREE.Vector3(0, 0, -120),
    title: "INGENIERÍA CON MENTALIDAD DE NEGOCIO",
    subtitle: "Más que código, estrategia digital",
    icon: User,
    color: "#E67E22",
    radius: 10,
  },
  cierre: {
    id: "cierre",
    position: new THREE.Vector3(0, 0, -150),
    title: "¿EMPEZAMOS A CONSTRUIR?",
    subtitle: "Tu proyecto merece tecnología de clase mundial",
    icon: MessageCircle,
    color: "#25D366",
    radius: 12,
    phone: "573006779183cd",
  },
};

// Beacon light effect component
function Beacon({ position, color = "#D4AF37", intensity = 2 }: { 
  position: [number, number, number]; 
  color?: string; 
  intensity?: number;
}) {
  const lightRef = useRef<THREE.PointLight>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (lightRef.current) {
        lightRef.current.intensity = intensity + Math.sin(Date.now() * 0.003) * 0.5;
      }
    }, 50);
    return () => clearInterval(interval);
  }, [intensity]);

  return (
    <group position={position}>
      <Cylinder args={[0.1, 0.1, 20, 8]} position={[0, 10, 0]}>
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </Cylinder>
      <pointLight ref={lightRef} position={[0, 10, 0]} color={color} intensity={intensity} distance={25} />
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// Content Station Component
function ContentStation({
  station,
  isActive,
}: {
  station: StationConfig;
  isActive: boolean;
}) {
  const Icon = station.icon;

  return (
    <group>
      {/* Platform */}
      <Cylinder args={[4, 4, 0.2, 64]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#0a0a0a" metalness={0.8} roughness={0.3} />
      </Cylinder>

      {/* Ring */}
      <Torus
        args={[4.3, 0.05, 8, 64]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0]}
      >
        <meshBasicMaterial color={station.color} transparent opacity={isActive ? 0.8 : 0.3} />
      </Torus>

      {/* Icon floating */}
      <Html
        transform
        occlude
        position={[0, 3, 0]}
        style={{
          transition: "all 0.3s ease",
          opacity: isActive ? 1 : 0.6,
          transform: `scale(${isActive ? 1.2 : 1})`,
        }}
      >
        <div 
          className="p-4 rounded-full"
          style={{ 
            background: `rgba(0, 0, 0, 0.8)`,
            border: `2px solid ${station.color}`,
            boxShadow: isActive ? `0 0 30px ${station.color}` : 'none'
          }}
        >
          <Icon className="w-8 h-8" style={{ color: station.color }} />
        </div>
      </Html>

      {/* Floating label */}
      <Html
        transform
        occlude
        position={[0, 6, 0]}
        style={{
          transition: "all 0.4s ease",
          opacity: isActive ? 1 : 0,
          transform: `scale(${isActive ? 1 : 0.9})`,
          pointerEvents: "none",
        }}
      >
        <div 
          className="p-4 rounded-lg text-center max-w-xs"
          style={{
            background: "rgba(0, 0, 0, 0.95)",
            border: `2px solid ${station.color}`,
            boxShadow: `0 0 40px ${station.color}40`,
          }}
        >
          <h2 
            className="text-lg font-bold mb-1 tracking-wider"
            style={{ color: station.color, fontFamily: "'JetBrains Mono', monospace" }}
          >
            {station.title}
          </h2>
          <p 
            className="text-xs"
            style={{ color: "rgba(255, 255, 255, 0.7)", fontFamily: "'Inter', sans-serif" }}
          >
            {station.subtitle}
          </p>
        </div>
      </Html>
    </group>
  );
}

// CTA Contact Station Component
function ContactStation({
  station,
  isActive,
  isNearby,
}: {
  station: StationConfig;
  isActive: boolean;
  isNearby: boolean;
}) {
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (isNearby && !triggered && station.phone) {
      setTriggered(true);
      window.open(`https://wa.me/${station.phone}`, "_blank");
    }
  }, [isNearby, triggered, station.phone]);

  return (
    <group>
      {/* Giant Arch */}
      <group position={[0, 8, 0]}>
        <Torus
          args={[12, 0.5, 16, 64, Math.PI]}
          rotation={[0, 0, 0]}
        >
          <meshStandardMaterial
            color={station.color}
            metalness={0.9}
            roughness={0.1}
            emissive={station.color}
            emissiveIntensity={isActive ? 0.5 : 0.2}
          />
        </Torus>
        
        <Cylinder args={[0.5, 0.5, 8, 16]} position={[-12, -4, 0]}>
          <meshStandardMaterial color={station.color} metalness={0.9} roughness={0.2} />
        </Cylinder>
        <Cylinder args={[0.5, 0.5, 8, 16]} position={[12, -4, 0]}>
          <meshStandardMaterial color={station.color} metalness={0.9} roughness={0.2} />
        </Cylinder>
      </group>

      {/* Main Text */}
      <Html
        transform
        occlude
        position={[0, 12, 0]}
        style={{
          transition: "all 0.5s ease",
          opacity: isActive ? 1 : 0.7,
        }}
      >
        <div 
          className="text-center cursor-pointer" 
          onClick={() => station.phone && window.open(`https://wa.me/${station.phone}`, "_blank")}
        >
          <h1 
            className="text-5xl md:text-7xl font-black tracking-tighter pulse-gold"
            style={{ 
              color: station.color,
              fontFamily: "'JetBrains Mono', monospace",
              textShadow: `0 0 60px ${station.color}`,
            }}
          >
            {station.title}
          </h1>
        </div>
      </Html>

      {/* Subtitle */}
      <Html
        transform
        occlude
        position={[0, 8, 0]}
        style={{
          transition: "all 0.4s ease",
          opacity: isActive ? 1 : 0,
        }}
      >
        <div 
          className="text-center max-w-lg p-4 rounded-lg"
          style={{
            background: "rgba(0, 0, 0, 0.9)",
            border: `2px solid ${station.color}`,
          }}
        >
          <p 
            className="text-lg mb-2"
            style={{ color: "#fff", fontFamily: "'Inter', sans-serif" }}
          >
            {station.subtitle}
          </p>
          <p 
            className="text-sm"
            style={{ color: station.color, fontFamily: "'JetBrains Mono', monospace" }}
          >
            Atraviesa el arco para contactar vía WhatsApp
          </p>
        </div>
      </Html>

      {/* Platform */}
      <Cylinder args={[14, 14, 0.2, 64]} position={[0, 0.1, 0]}>
        <meshStandardMaterial 
          color="#0a0a0a" 
          transparent 
          opacity={0.8}
          metalness={0.8} 
          roughness={0.3} 
        />
      </Cylinder>

      {/* Ring indicator */}
      <Torus
        args={[14, 0.1, 8, 64]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.05, 0]}
      >
        <meshBasicMaterial color={station.color} transparent opacity={isActive ? 0.8 : 0.3} />
      </Torus>
    </group>
  );
}

export function Stations({ vehiclePosition, onStationActivate }: StationsProps) {
  const [activeStation, setActiveStation] = useState<string | null>(null);

  useEffect(() => {
    // Check distance to each station
    const stationList = Object.values(STATIONS);
    let nearestStation: string | null = null;
    let minDistance = Infinity;

    stationList.forEach(station => {
      const dist = vehiclePosition.distanceTo(station.position);
      if (dist < station.radius && dist < minDistance) {
        minDistance = dist;
        nearestStation = station.id;
      }
    });

    if (nearestStation !== activeStation) {
      setActiveStation(nearestStation);
      onStationActivate?.(nearestStation);
    }
  }, [vehiclePosition, activeStation, onStationActivate]);

  return (
    <>
      {/* Hero Station */}
      <group position={STATIONS.hero.position.toArray()}>
        <Beacon position={[0, 0, 0]} color={STATIONS.hero.color} intensity={2.5} />
        <ContentStation station={STATIONS.hero} isActive={activeStation === "hero"} />
      </group>

      {/* Diferencial Station */}
      <group position={STATIONS.diferencial.position.toArray()}>
        <Beacon position={[0, 0, 0]} color={STATIONS.diferencial.color} intensity={2.5} />
        <ContentStation station={STATIONS.diferencial} isActive={activeStation === "diferencial"} />
      </group>

      {/* Proyectos Station */}
      <group position={STATIONS.proyectos.position.toArray()}>
        <Beacon position={[0, 0, 0]} color={STATIONS.proyectos.color} intensity={2.5} />
        <ContentStation station={STATIONS.proyectos} isActive={activeStation === "proyectos"} />
      </group>

      {/* Perfil Station */}
      <group position={STATIONS.perfil.position.toArray()}>
        <Beacon position={[0, 0, 0]} color={STATIONS.perfil.color} intensity={2.5} />
        <ContentStation station={STATIONS.perfil} isActive={activeStation === "perfil"} />
      </group>

      {/* CTA Contact Station */}
      <group position={STATIONS.cierre.position.toArray()}>
        <Beacon position={[0, 0, 0]} color={STATIONS.cierre.color} intensity={4} />
        <ContactStation 
          station={STATIONS.cierre} 
          isActive={activeStation === "cierre"}
          isNearby={vehiclePosition.distanceTo(STATIONS.cierre.position) < 10}
        />
      </group>
    </>
  );
}

export { STATIONS };
export default Stations;
