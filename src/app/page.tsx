"use client";

import { useRef, useState, useCallback, Suspense, useEffect } from "react";
import * as THREE from "three";
import { World } from "@/components/World";
import { Vehicle } from "@/components/Vehicle";
import { Stations } from "@/components/Stations";
import { StationPanels } from "@/components/StationPanels";
import { TechLogos } from "@/components/TechLogos";
import { UI } from "@/components/UI";
import { HUD } from "@/components/HUD";
import { IdleArrow } from "@/components/IdleArrow";
import { useControls } from "@/hooks/useControls";
import { LoadingScreen } from "@/components/LoadingScreen";
import { PolicyModal } from "@/components/PolicyModal";
import { Github, Instagram, MapPin } from "lucide-react";
import { NAV_TARGETS } from "@/constants/navTargets";

export default function Home() {
  const { controls, setMobileControl } = useControls();
  const vehiclePositionRef = useRef(new THREE.Vector3(0, 0.5, 0));
  const [vehiclePosition, setVehiclePosition] = useState(new THREE.Vector3(0, 0.5, 0));
  const [vehicleRotation, setVehicleRotation] = useState(Math.PI);
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0.5, 0));
  const cameraFocusRef = useRef<THREE.Vector3 | null>(null);
  const vehicleTeleportRef = useRef<THREE.Vector3 | null>(null);
  const lastInputTimeRef = useRef(Date.now());
  const [showIdleArrow, setShowIdleArrow] = useState(false);

  // Track user input for idle detection
  useEffect(() => {
    const hasInput = controls.forward || controls.backward || controls.left || controls.right;
    if (hasInput) {
      lastInputTimeRef.current = Date.now();
      setShowIdleArrow(false);
    }
  }, [controls]);

  // Idle detection timer
  useEffect(() => {
    const interval = setInterval(() => {
      const idleTime = Date.now() - lastInputTimeRef.current;
      if (idleTime > 10000 && vehiclePosition.z > -5) {
        setShowIdleArrow(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [vehiclePosition.z]);

  const handlePositionUpdate = useCallback((position: THREE.Vector3) => {
    vehiclePositionRef.current.copy(position);
    cameraTargetRef.current.copy(position);
    setVehiclePosition(position.clone());
  }, []);

  const handleRotationUpdate = useCallback((rotation: number) => {
    setVehicleRotation(rotation);
  }, []);

  // Navigation handlers
  const navigateTo = useCallback((targetName: keyof typeof NAV_TARGETS) => {
    const target = NAV_TARGETS[targetName];
    cameraFocusRef.current = target.clone();
    setTimeout(() => { cameraFocusRef.current = null; }, 2000);
  }, []);

  const teleportTo = useCallback((targetName: keyof typeof NAV_TARGETS) => {
    const target = NAV_TARGETS[targetName];
    vehicleTeleportRef.current = target.clone();
    setTimeout(() => { vehicleTeleportRef.current = null; }, 100);
  }, []);

  const handleTeleportComplete = useCallback(() => {
    vehicleTeleportRef.current = null;
  }, []);

  // Station activation handler for panels
  const [activeStation, setActiveStation] = useState<string | null>(null);
  const handleStationActivate = useCallback((stationId: string | null) => {
    setActiveStation(stationId);
  }, []);

  const handleClosePanel = useCallback(() => {
    setActiveStation(null);
  }, []);

  // Loading screen state
  const [experienceStarted, setExperienceStarted] = useState(false);
  const handleStartExperience = useCallback(() => {
    setExperienceStarted(true);
  }, []);

  // Policy modal state
  const [activePolicy, setActivePolicy] = useState<'legal' | 'privacy' | null>(null);
  const handleOpenPolicy = useCallback((policy: 'legal' | 'privacy') => {
    setActivePolicy(policy);
  }, []);
  const handleClosePolicy = useCallback(() => {
    setActivePolicy(null);
  }, []);

  if (!experienceStarted) {
    return <LoadingScreen onStart={handleStartExperience} />;
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D World */}
      <World 
        cameraTarget={cameraTargetRef} 
        cameraFocus={cameraFocusRef}
      >
        <Suspense fallback={null}>
          <Vehicle
            controls={controls}
            onPositionUpdate={handlePositionUpdate}
            onRotationUpdate={handleRotationUpdate}
            teleportTarget={vehicleTeleportRef.current}
            onTeleportComplete={handleTeleportComplete}
          />
          <Stations 
            vehiclePosition={vehiclePosition} 
            onStationActivate={handleStationActivate}
          />
          <TechLogos />
          {showIdleArrow && <IdleArrow position={vehiclePosition} />}
        </Suspense>
      </World>

      {/* HUD */}
      <HUD 
        vehiclePosition={vehiclePosition} 
        vehicleRotation={vehicleRotation}
        onTeleport={teleportTo}
      />

      {/* UI Overlay */}
      <UI 
        setMobileControl={setMobileControl}
        onNavigate={navigateTo}
      />

      {/* Station Panels - Side Panel UI (z-500) */}
      <div className="fixed inset-0 z-[500] pointer-events-none">
        <StationPanels 
          vehiclePosition={vehiclePosition}
          activeStation={activeStation}
          onClose={handleClosePanel}
        />
      </div>

      {/* Fixed Footer (z-200) */}
      <footer className="fixed bottom-0 left-0 right-0 z-[200] px-6 py-4 bg-black/80 backdrop-blur-md border-t border-white/10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm" style={{ color: "rgba(255, 255, 255, 0.6)", fontFamily: "'JetBrains Mono', monospace" }}>
            <MapPin className="w-4 h-4" style={{ color: "#D4AF37" }} />
            <span>Bogotá, Colombia</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="https://github.com/Juandprograma" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm hover:text-novacode-gold transition-colors"
              style={{ color: "rgba(255, 255, 255, 0.6)", fontFamily: "'JetBrains Mono', monospace" }}
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a 
              href="https://www.instagram.com/el_juaandii/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm hover:text-novacode-gold transition-colors"
              style={{ color: "rgba(255, 255, 255, 0.6)", fontFamily: "'JetBrains Mono', monospace" }}
            >
              <Instagram className="w-4 h-4" />
              <span className="hidden sm:inline">Instagram</span>
            </a>
          </div>
        </div>

        {/* Policy Links */}
        <div className="flex items-center justify-center gap-8 mt-3 pt-3 border-t border-white/5">
          <button
            onClick={() => handleOpenPolicy('legal')}
            className="text-xs hover:text-[#d4af37] transition-colors cursor-pointer"
            style={{ color: "#a1a1a1", fontFamily: "'JetBrains Mono', monospace" }}
          >
            Aviso Legal
          </button>
          <button
            onClick={() => handleOpenPolicy('privacy')}
            className="text-xs hover:text-[#d4af37] transition-colors cursor-pointer"
            style={{ color: "#a1a1a1", fontFamily: "'JetBrains Mono', monospace" }}
          >
            Política de Privacidad
          </button>
          <button
            onClick={() => handleOpenPolicy('cookie')}
            className="text-xs hover:text-[#d4af37] transition-colors cursor-pointer"
            style={{ color: "#a1a1a1", fontFamily: "'JetBrains Mono', monospace" }}
          >
            Cookies
          </button>
        </div>
      </footer>

      {/* Policy Modals */}
      <PolicyModal
        isOpen={activePolicy === 'legal'}
        onClose={handleClosePolicy}
        title="Aviso Legal"
        content="<p>1. Aviso Legal
NovaCode, operado por Juan Diego Mahecha Camargo en Bogotá, Colombia,
ofrece servicios de desarrollo web, software y diseño interactivo. Al acceder a
este sitio, el usuario acepta los términos aquí descritos.
<br>
2. Propiedad Intelectual
Todo el contenido, diseño, código fuente, gráficos y elementos interactivos
presentes en los sitios web desarrollados por NovaCode son propiedad
exclusiva de sus respectivos dueños o de Juan Diego Mahecha Camargo, bajo
las leyes de propiedad intelectual vigentes.</p>"
      />
      <PolicyModal
        isOpen={activePolicy === 'privacy'}
        onClose={handleClosePolicy}
        title="Política de Privacidad"
        content="<p>
Su privacidad es importante. NovaCode se compromete a proteger cualquier dato personal recopilado a través de formularios de contacto o herramientas interactivas. Estos datos se utilizan exclusivamente para:
Gestionar solicitudes de servicios y consultas.
Mejorar la experiencia del usuario en nuestras plataformas.
Enviar información relevante sobre servicios contratados.
No compartimos, vendemos ni alquilamos su información personal a terceros sin su consentimiento explícito, salvo requerimiento legal.
<br> "
      />
      <PolicyModal
        isOpen={activePolicy === 'cookie'}
        onClose={handleClosePolicy}
        title="Cookies"
        content="<p>
4. Cookies y Tecnologías de Seguimiento
NovaCode puede utilizar tecnologías estándar de análisis web para entender
cómo se utilizan nuestras plataformas y optimizar el rendimiento técnico.
<br>
5. Modificaciones
NovaCode se reserva el derecho de modificar estos términos en cualquier
momento. La versión vigente será publicada directamente en este espacio.
Contacto: Para cualquier consulta sobre estas políticas, puede ponerse en
contacto a través de los medios oficiales dispuestos en el sitio web."
      />
      
    </main>
  );
}