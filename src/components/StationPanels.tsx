"use client";

import { useState, useEffect } from "react";
import { X, Rocket, ExternalLink, MessageCircle, Code2, Cpu, Image as ImageIcon, Brain, Sparkles, LucideIcon } from "lucide-react";
import * as THREE from "three";

interface StationPanelsProps {
  vehiclePosition: THREE.Vector3;
  activeStation: string | null;
  onClose: () => void;
}

interface ButtonConfig {
  label: string;
  icon: LucideIcon;
  url: string;
  primary: boolean;
}

interface TechConfig {
  name: string;
  icon: string;
  desc: string;
}

interface ProjectConfig {
  name: string;
  desc: string;
  tags: string[];
  highlight: boolean;
}

interface ProfileConfig {
  name: string;
  role: string;
  semestre: string;
  location: string;
}

interface EcosystemItem {
  name: string;
  role: string;
}

interface CTAConfig {
  text: string;
  url: string;
}

interface StationContent {
  id: string;
  title: string;
  subtitle: string;
  style: string;
  description?: string;
  buttons?: ButtonConfig[];
  techs?: TechConfig[];
  projects?: ProjectConfig[];
  profile?: ProfileConfig;
  ecosystem?: EcosystemItem[];
  cta?: CTAConfig;
  benefits?: string[];
}

// Station content definitions
const STATION_CONTENT: Record<string, StationContent> = {
  hero: {
    id: "hero",
    title: "DESARROLLO DE ACTIVOS DIGITALES",
    subtitle: "Que escalan tu negocio",
    description: "Ingeniería de sistemas aplicada al desarrollo web. Arquitecturas robustas para soportar crecimiento exponencial.",
    buttons: [
      { label: "CONSULTORÍA GRATIS", icon: MessageCircle, url: "https://wa.me/573006779183?text=Hola%20Juan%20Diego,%20vengo%20de%20tu%20web%20Novacode%20y%20quiero%20una%20consultor%C3%ADa", primary: true },
      { label: "VER PROYECTOS", icon: Rocket, url: "#proyectos", primary: false },
    ],
    style: "gold",
  },
  diferencial: {
    id: "diferencial",
    title: "TECNOLOGÍA AVANZADA",
    subtitle: "Para problemas reales",
    description: "Stack moderno diseñado para rendimiento, escalabilidad y experiencias excepcionales.",
    techs: [
      { name: "Next.js", icon: "▲", desc: "React framework para producción" },
      { name: "Prisma", icon: "◈", desc: "ORM type-safe para bases de datos" },
      { name: "WebP Optimizer", icon: "🖼️", desc: "Compresión inteligente de imágenes" },
      { name: "IA Integration", icon: "🤖", desc: "Modelos de visión y NLP" },
    ],
    style: "purple",
  },
  proyectos: {
    id: "proyectos",
    title: "PROYECTOS DESTACADOS",
    subtitle: "Soluciones que generan impacto",
    projects: [
      { 
        name: "Mi Subsidio Ya", 
        desc: "Portal líder en simulaciones de subsidio de vivienda en Colombia. 50K+ usuarios mensuales.",
        tags: ["Next.js", "PostgreSQL", "AWS"],
        highlight: false,
      },
      { 
        name: "Next Nurse Go", 
        desc: "Plataforma web enfocada en el sector de salud y educación médica, desarrollada con alto rendimiento y SEO optimizado.",
        tags: ["Next.js", "Tailwind CSS", "SEO"],
        highlight: true,
      },
      { 
        name: "Novacode Engine", 
        desc: "Marca y ecosistema de desarrollo web independiente enfocado en ingeniería de sistemas y arquitecturas robustas.",
        tags: ["Next.js", "TypeScript", "Fullstack"],
        highlight: false,
      },
      { 
        name: "Personal Shortener", 
        desc: "Gestión inteligente de enlaces con analytics avanzado y API REST.",
        tags: ["Node.js", "Redis", "Vercel"],
        highlight: false,
      },
    ],
    style: "blue",
  },
  perfil: {
    id: "perfil",
    title: "INGENIERÍA CON MENTALIDAD DE NEGOCIO",
    subtitle: "Más que código, estrategia digital",
    profile: {
      name: "Juan Diego Mahecha",
      role: "Founder & Lead Developer",
      semestre: "Noveno Semestre Ing. Sistemas",
      location: "Bogotá, Colombia",
    },
    ecosystem: [
      { name: "Novacode", role: "Desarrollo Web & software" },
      { name: "Dukes", role: "Perfumería Virtual" },
    ],
    style: "orange",
  },
  cierre: {
    id: "cierre",
    title: "¿EMPEZAMOS A CONSTRUIR?",
    subtitle: "Tu proyecto merece tecnología de clase mundial",
    cta: {
      text: "🚀 INICIAR MI PROYECTO AHORA",
      url: "https://wa.me/573006779183?text=Hola%20Juan%20Diego,%20vengo%20de%20tu%20web%20Novacode%20y%20quiero%20una%20consultor%C3%ADa",
    },
    benefits: [
      "Primera consultoría gratuita",
      "Presupuesto en 24 horas",
      "Garantía de satisfacción",
    ],
    style: "green",
  },
};

export function StationPanels({ vehiclePosition, activeStation, onClose }: StationPanelsProps) {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState<StationContent | null>(null);

  useEffect(() => {
    if (activeStation && STATION_CONTENT[activeStation as keyof typeof STATION_CONTENT]) {
      setContent(STATION_CONTENT[activeStation as keyof typeof STATION_CONTENT]);
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [activeStation]);

  const handleClose = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setVisible(false);
    setTimeout(onClose, 300);
  };

  if (!visible || !content) return null;

  const getStyleColors = (style: string) => {
    switch (style) {
      case "gold": return { primary: "#D4AF37", bg: "rgba(212, 175, 55, 0.1)", border: "#D4AF37" };
      case "purple": return { primary: "#9B59B6", bg: "rgba(155, 89, 182, 0.1)", border: "#9B59B6" };
      case "blue": return { primary: "#3498DB", bg: "rgba(52, 152, 219, 0.1)", border: "#3498DB" };
      case "orange": return { primary: "#E67E22", bg: "rgba(230, 126, 34, 0.1)", border: "#E67E22" };
      case "green": return { primary: "#25D366", bg: "rgba(37, 211, 102, 0.1)", border: "#25D366" };
      default: return { primary: "#D4AF37", bg: "rgba(212, 175, 55, 0.1)", border: "#D4AF37" };
    }
  };

  const colors = getStyleColors(content.style);

  return (
    <div 
      className="station-panel"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "100%",
        maxWidth: "480px",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.95)",
        borderLeft: `2px solid ${colors.border}`,
        backdropFilter: "blur(20px)",
        zIndex: 100,
        pointerEvents: "auto" as const,
        padding: "80px 30px 30px",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        transform: visible ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Close button - Posicionado con mayor separación y aislamiento táctil total */}
      <button
        onClick={(e) => handleClose(e)}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleClose();
        }}
        className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-black/60 border border-white/20 hover:bg-white/20 transition-colors cursor-pointer"
        style={{ zIndex: 9999, pointerEvents: "auto" as const }}
        aria-label="Cerrar panel"
      >
        <X className="w-6 h-6" style={{ color: colors.primary, pointerEvents: "none" }} />
      </button>

      {/* Content */}
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 
            className="text-2xl font-bold tracking-tight mb-2"
            style={{ color: colors.primary, fontFamily: "'JetBrains Mono', monospace" }}
          >
            {content.title}
          </h2>
          <p 
            className="text-sm uppercase tracking-widest"
            style={{ color: "rgba(255, 255, 255, 0.6)", fontFamily: "'JetBrains Mono', monospace" }}
          >
            {content.subtitle}
          </p>
        </div>

        {/* Description */}
        {content.description && (
          <p className="text-base leading-relaxed" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
            {content.description}
          </p>
        )}

        {/* HERO Buttons */}
        {/* TODO: Añadir enlace a sección de proyectos cuando esté disponible */}
        {content.buttons && (
          <div className="flex flex-col gap-3">
            {content.buttons.map((button, i) => (
              <a
                key={i}
                href={button.url === "#proyectos" ? "#" : button.url}
                target={button.url.startsWith("http") ? "_blank" : undefined}
                rel={button.url.startsWith("http") ? "noopener noreferrer" : undefined}
                onClick={button.url === "#proyectos" ? (e) => { e.preventDefault(); e.stopPropagation(); } : undefined}
                className={`flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-medium transition-all cursor-pointer ${
                  button.primary
                    ? "hover:scale-105 hover:shadow-lg"
                    : "border border-white/30 hover:border-white/60 hover:bg-white/5"
                }`}
                style={{
                  background: button.primary ? colors.primary : "transparent",
                  color: button.primary ? "#000" : "#fff",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                <button.icon className="w-5 h-5" />
                {button.label}
              </a>
            ))}
          </div>
        )}

        {/* DIFERENCIAL Tech Stack */}
        {content.techs && (
          <div className="grid grid-cols-2 gap-4">
            {content.techs.map((tech: TechConfig, i: number) => (
              <div 
                key={i}
                className="p-4 rounded-lg border border-white/10 hover:border-white/30 transition-all"
                style={{ background: "rgba(255, 255, 255, 0.05)" }}
              >
                <div 
                  className="text-2xl mb-2"
                  style={{ color: colors.primary }}
                >
                  {tech.icon}
                </div>
                <h4 className="font-bold text-sm mb-1" style={{ color: "#fff" }}>
                  {tech.name}
                </h4>
                <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                  {tech.desc}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* PROYECTOS Cards */}
        {content.projects && (
          <div className="space-y-4">
            {content.projects.map((project: ProjectConfig, i: number) => (
              <div 
                key={i}
                className={`p-4 rounded-lg border transition-all cursor-pointer project-card ${
                  project.highlight ? "ai-highlight" : ""
                }`}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderColor: project.highlight ? colors.primary : "rgba(255, 255, 255, 0.1)",
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold" style={{ color: "#fff" }}>
                    {project.name}
                  </h4>
                  {project.highlight && (
                    <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
                  )}
                </div>
                <p className="text-sm mb-3" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  {project.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag: string, j: number) => (
                    <span 
                      key={j}
                      className="px-2 py-1 text-xs rounded"
                      style={{ 
                        background: colors.bg,
                        color: colors.primary,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PERFIL Profile */}
        {content.profile && (
          <div className="space-y-6">
            <div 
              className="p-6 rounded-lg text-center"
              style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
            >
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold"
                style={{ background: colors.primary, color: "#000" }}
              >
                JM
              </div>
              <h3 className="text-xl font-bold mb-1" style={{ color: "#fff" }}>
                {content.profile.name}
              </h3>
              <p className="text-sm mb-1" style={{ color: colors.primary }}>
                {content.profile.role}
              </p>
              <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                {content.profile.semestre} • {content.profile.location}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold mb-3 uppercase tracking-wider" style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                Ecosistema
              </h4>
              <div className="space-y-2">
                {content.ecosystem?.map((item: EcosystemItem, i: number) => (
                  <div 
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: "rgba(255, 255, 255, 0.05)" }}
                  >
                    <span className="font-medium" style={{ color: "#fff" }}>
                      {item.name}
                    </span>
                    <span className="text-xs" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                      {item.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CIERRE CTA */}
        {content.cta && (
          <div className="space-y-6">
            <div 
              className="p-6 rounded-lg text-center"
              style={{ background: colors.bg, border: `2px solid ${colors.border}` }}
            >
              <p className="text-sm mb-4" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                Agenda una llamada gratuita y hablemos sobre tu proyecto. Sin compromisos, solo soluciones.
              </p>
              <a
                href={content.cta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-lg font-bold text-lg transition-all hover:scale-105"
                style={{
                  background: colors.primary,
                  color: "#000",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                <MessageCircle className="w-6 h-6" />
                {content.cta.text}
              </a>
            </div>

            <div className="space-y-2">
              {content.benefits?.map((benefit: string, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <span style={{ color: colors.primary }}>✓</span>
                  <span className="text-sm" style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StationPanels;
