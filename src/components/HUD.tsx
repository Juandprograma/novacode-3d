"use client";

import { useMemo, useState, useEffect } from "react";
import { Radar, X } from "lucide-react";
import * as THREE from "three";

interface HUDProps {
  vehiclePosition: THREE.Vector3;
  vehicleRotation: number;
  onTeleport?: (targetName: keyof typeof MAP_STATIONS) => void;
}

// 5 Stations Architecture - Minimap
const MAP_STATIONS = {
  inicio: { x: 0, z: 0, label: "START", color: "#D4AF37", z3d: 0 },
  hero: { x: 0, z: -30, label: "HERO", color: "#D4AF37", z3d: -30 },
  diferencial: { x: 0, z: -60, label: "TECH", color: "#9B59B6", z3d: -60 },
  proyectos: { x: 0, z: -90, label: "WORK", color: "#3498DB", z3d: -90 },
  perfil: { x: 0, z: -120, label: "PERFIL", color: "#E67E22", z3d: -120 },
  cierre: { x: 0, z: -150, label: "CTA", color: "#25D366", z3d: -150 },
};

const MAP_SCALE = 0.6;
const MAP_OFFSET_X = 100;
const MAP_OFFSET_Z = 30;

export function HUD({ vehiclePosition, vehicleRotation, onTeleport }: HUDProps) {
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [radarRotation, setRadarRotation] = useState(0);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.innerHeight < 600);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Radar rotation animation
  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      setRadarRotation(prev => (prev + 1) % 360);
      animationFrame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Convert 3D position to map coordinates
  const mapVehiclePos = useMemo(() => ({
    x: vehiclePosition.x * MAP_SCALE + MAP_OFFSET_X,
    z: vehiclePosition.z * MAP_SCALE + MAP_OFFSET_Z,
  }), [vehiclePosition]);

  // Calculate rotation for vehicle arrow
  const rotationDeg = (-vehicleRotation * 180) / Math.PI;

  // Determine current zone
  const currentZone = useMemo(() => {
    const z = vehiclePosition.z;
    if (z > -15) return "INICIO";
    if (z > -45) return "HERO";
    if (z > -75) return "DIFERENCIAL";
    if (z > -105) return "PROYECTOS";
    if (z > -135) return "PERFIL";
    if (z > -165) return "CIERRE";
    return "RUTA";
  }, [vehiclePosition.z]);

  const handleStationClick = (stationId: keyof typeof MAP_STATIONS) => {
    onTeleport?.(stationId);
    if (isMobile) {
      setIsMapExpanded(false);
    }
  };

  // Mobile collapsed view - just the radar icon
  if (isMobile && !isMapExpanded) {
    return (
      <>
        {/* Radar Icon Button - top-20 para evitar solapamiento con header */}
        <button
          onClick={() => setIsMapExpanded(true)}
          className="fixed top-20 right-4 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: "rgba(0, 0, 0, 0.8)",
            border: "1px solid #D4AF37",
            boxShadow: "0 0 20px rgba(212, 175, 55, 0.3)",
          }}
        >
          <Radar className="w-6 h-6" style={{ color: "#D4AF37" }} />
          {/* Radar sweep effect on icon */}
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(from ${radarRotation}deg, transparent 0deg, rgba(212, 175, 55, 0.3) 30deg, transparent 60deg)`,
            }}
          />
        </button>

        {/* Minimal zone indicator for mobile - top-20 para evitar solapamiento */}
        <div 
          className="fixed top-20 left-4 z-40 px-3 py-2 rounded-lg"
          style={{
            background: "rgba(0, 0, 0, 0.8)",
            border: "1px solid rgba(212, 175, 55, 0.3)",
          }}
        >
          <div 
            className="text-[10px] tracking-wider"
            style={{ color: "rgba(255, 255, 255, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}
          >
            ZONA
          </div>
          <div 
            className="text-sm font-bold"
            style={{ color: "#D4AF37", fontFamily: "'JetBrains Mono', monospace" }}
          >
            {currentZone}
          </div>
        </div>
      </>
    );
  }

  // Mobile expanded or Desktop view
  return (
    <>
      {/* Mobile Expanded Map Overlay */}
      {isMobile && isMapExpanded && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsMapExpanded(false)}
        >
          <div 
            className="relative w-full max-w-sm"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsMapExpanded(false)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(0, 0, 0, 0.8)",
                border: "1px solid #D4AF37",
              }}
            >
              <X className="w-5 h-5" style={{ color: "#D4AF37" }} />
            </button>

            {/* Expanded Map */}
            <div 
              className="rounded-xl overflow-hidden"
              style={{
                background: "rgba(0, 0, 0, 0.9)",
                border: "2px solid #D4AF37",
                boxShadow: "0 0 40px rgba(212, 175, 55, 0.2)",
              }}
            >
              <MapContent 
                mapVehiclePos={mapVehiclePos}
                rotationDeg={rotationDeg}
                radarRotation={radarRotation}
                onStationClick={handleStationClick}
                isExpanded={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Floating Window - z-300, top-20 para evitar header */}
      {!isMobile && (
        <div 
          className="fixed top-20 right-4 z-[300] rounded-xl overflow-hidden"
          style={{
            background: "rgba(0, 0, 0, 0.85)",
            border: "1px solid #D4AF37",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(212, 175, 55, 0.1)",
            backdropFilter: "blur(10px)",
            width: "220px",
          }}
        >
          {/* Header */}
          <div 
            className="px-3 py-2 flex items-center gap-2"
            style={{ borderBottom: "1px solid rgba(212, 175, 55, 0.3)" }}
          >
            <Radar className="w-4 h-4" style={{ color: "#D4AF37" }} />
            <span 
              className="text-xs font-bold tracking-wider"
              style={{ color: "#D4AF37", fontFamily: "'JetBrains Mono', monospace" }}
            >
              RADAR
            </span>
          </div>

          <MapContent 
            mapVehiclePos={mapVehiclePos}
            rotationDeg={rotationDeg}
            radarRotation={radarRotation}
            onStationClick={handleStationClick}
            isExpanded={false}
          />
        </div>
      )}

      {/* Zone indicator - Desktop z-300 */}
      {!isMobile && (
        <div 
          className="fixed bottom-20 left-4 z-[300] px-4 py-3 rounded-lg"
          style={{
            background: "rgba(0, 0, 0, 0.85)",
            border: "1px solid rgba(212, 175, 55, 0.3)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div 
            className="text-[10px] tracking-wider mb-1"
            style={{ color: "rgba(255, 255, 255, 0.5)", fontFamily: "'JetBrains Mono', monospace" }}
          >
            ZONA ACTUAL
          </div>
          <div 
            className="text-lg font-bold"
            style={{ color: "#D4AF37", fontFamily: "'JetBrains Mono', monospace" }}
          >
            {currentZone}
          </div>
        </div>
      )}
    </>
  );
}

// Map SVG Component
interface MapContentProps {
  mapVehiclePos: { x: number; z: number };
  rotationDeg: number;
  radarRotation: number;
  onStationClick: (id: keyof typeof MAP_STATIONS) => void;
  isExpanded: boolean;
}

function MapContent({ mapVehiclePos, rotationDeg, radarRotation, onStationClick, isExpanded }: MapContentProps) {
  const height = isExpanded ? 350 : 200;
  const width = isExpanded ? 280 : 200;
  const scale = isExpanded ? 0.9 : 0.6;
  const offsetX = isExpanded ? 140 : 100;
  const offsetZ = isExpanded ? 40 : 30;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="cursor-pointer">
      {/* Background */}
      <rect width={width} height={height} fill="transparent" />

      {/* Radar sweep effect - rotating light line */}
      <g transform={`translate(${offsetX}, ${offsetZ})`}>
        <circle r={80 * scale} fill="none" stroke="rgba(212, 175, 55, 0.2)" strokeWidth={1} />
        <circle r={50 * scale} fill="none" stroke="rgba(212, 175, 55, 0.15)" strokeWidth={1} />
        <circle r={20 * scale} fill="none" stroke="rgba(212, 175, 55, 0.3)" strokeWidth={1} />
        
        {/* Rotating radar sweep line */}
        <line
          x1={0}
          y1={0}
          x2={0}
          y2={-80 * scale}
          stroke="#D4AF37"
          strokeWidth={2}
          opacity={0.8}
          transform={`rotate(${radarRotation})`}
          style={{
            filter: "drop-shadow(0 0 4px rgba(212, 175, 55, 0.8))",
          }}
        />
        
        {/* Radar glow at center */}
        <circle r={4} fill="#D4AF37" opacity={0.6}>
          <animate attributeName="opacity" values="0.6;1;0.6" dur="1s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Route line */}
      <line
        x1={offsetX}
        y1={offsetZ}
        x2={offsetX}
        y2={offsetZ - 180 * scale}
        stroke="#D4AF37"
        strokeWidth={1}
        opacity={0.3}
        strokeDasharray="4,4"
      />

      {/* Station markers - Clickable */}
      {Object.entries(MAP_STATIONS).map(([id, station]) => (
        <g 
          key={id} 
          onClick={() => onStationClick(id as keyof typeof MAP_STATIONS)}
          className="hover:opacity-100 transition-opacity cursor-pointer"
        >
          {/* Hit area */}
          <circle
            cx={offsetX}
            cy={station.z * scale + offsetZ}
            r={isExpanded ? 20 : 12}
            fill="transparent"
          />
          {/* Visible marker */}
          <circle
            cx={offsetX}
            cy={station.z * scale + offsetZ}
            r={isExpanded ? 6 : 4}
            fill={station.color}
            opacity={0.9}
            stroke="#fff"
            strokeWidth={1}
          />
          {/* Pulse effect for active stations */}
          <circle
            cx={offsetX}
            cy={station.z * scale + offsetZ}
            r={isExpanded ? 10 : 6}
            fill="none"
            stroke={station.color}
            strokeWidth={1}
            opacity={0.5}
          >
            <animate attributeName="r" values={`${isExpanded ? 6 : 4};${isExpanded ? 12 : 8};${isExpanded ? 6 : 4}`} dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite" />
          </circle>
          {/* Label */}
          <text
            x={offsetX + (isExpanded ? 15 : 10)}
            y={station.z * scale + offsetZ + (isExpanded ? 5 : 3)}
            fill={station.color}
            fontSize={isExpanded ? 12 : 9}
            fontFamily="'JetBrains Mono', monospace"
            fontWeight="bold"
            opacity="0.9"
          >
            {station.label}
          </text>
        </g>
      ))}

      {/* Vehicle marker */}
      <g
        transform={`translate(${mapVehiclePos.x * (scale / 0.6)}, ${mapVehiclePos.z * (scale / 0.6) + (offsetZ - MAP_OFFSET_Z)}) rotate(${rotationDeg})`}
      >
        <polygon
          points={`0,-${isExpanded ? 8 : 5} -${isExpanded ? 5 : 3},${isExpanded ? 7 : 4} 0,${isExpanded ? 4 : 2} ${isExpanded ? 5 : 3},${isExpanded ? 7 : 4}`}
          fill="#D4AF37"
          stroke="#000"
          strokeWidth={1}
        />
        <circle
          cx={0}
          cy={0}
          r={isExpanded ? 12 : 8}
          fill="none"
          stroke="#D4AF37"
          strokeWidth={2}
          opacity={0.7}
        >
          <animate
            attributeName="r"
            values={`${isExpanded ? 12 : 8};${isExpanded ? 16 : 11};${isExpanded ? 12 : 8}`}
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      {/* Info text */}
      {isExpanded && (
        <text
          x={width / 2}
          y={height - 15}
          textAnchor="middle"
          fill="rgba(212, 175, 55, 0.6)"
          fontSize={10}
          fontFamily="'JetBrains Mono', monospace"
        >
          Toca un punto para teletransportarte
        </text>
      )}
    </svg>
  );
}

export default HUD;
export { MAP_STATIONS };
