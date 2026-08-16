"use client";

import { useState, useEffect } from "react";
import { Code2, MessageCircle, Menu, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { ControlState } from "@/types";
interface UIProps {
  setMobileControl: (control: keyof ControlState, value: boolean) => void;
  onNavigate?: (target: "inicio" | "hero" | "diferencial" | "proyectos" | "perfil" | "cierre") => void;
}

export function UI({ setMobileControl, onNavigate }: UIProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {/* Navbar (z-300) */}
      <nav className="fixed top-0 left-0 right-0 z-[300] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Code2 className="w-6 h-6 text-novacode-gold" />
            <span
              className="text-xl font-bold tracking-tight text-white"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              {"NOVA_"}
              <span className="text-novacode-gold">CODE</span>
            </span>
          </div>

          {/* Desktop Menu - Functional */}
          <div className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate?.("hero")}
              className="text-sm text-white/70 hover:text-novacode-gold transition-colors"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              SERVICIOS
            </button>
            <button
              onClick={() => onNavigate?.("cierre")}
              className="text-sm text-white/70 hover:text-novacode-gold transition-colors"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              CONTACTO
            </button>
            <button
              onClick={() => window.open("https://wa.me/573123745133?text=Hola%20Juan%20Diego,%20vengo%20de%20tu%20web%20Novacode%20y%20quiero%20una%20consultor%C3%ADa", "_blank")}
              className="flex items-center gap-2 px-4 py-2 bg-novacode-gold text-black text-sm font-medium rounded hover:bg-novacode-goldLight transition-colors min-h-[44px]"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <MessageCircle className="w-4 h-4" />
              WHATSAPP
            </button>
          </div>

          {/* Mobile Menu Button - 44x44px mínimo táctil */}
          <button
            className="md:hidden w-11 h-11 flex items-center justify-center text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu - Functional */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-black/90 border border-novacode-gold/30 rounded-lg">
            <button
              onClick={() => {
                onNavigate?.("hero");
                setIsMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-white/70 hover:text-novacode-gold"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              SERVICIOS
            </button>
            <button
              onClick={() => {
                onNavigate?.("cierre");
                setIsMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-white/70 hover:text-novacode-gold"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              CONTACTO
            </button>
            <button
              onClick={() => window.open("https://wa.me/573123745133?text=Hola%20Juan%20Diego,%20vengo%20de%20tu%20web%20Novacode%20y%20quiero%20una%20consultor%C3%ADa", "_blank")}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-novacode-gold text-black text-sm font-medium rounded min-h-[44px]"
            >
              <MessageCircle className="w-4 h-4" />
              WHATSAPP
            </button>
          </div>
        )}
      </nav>

      {/* Instructions */}
      <div className="instructions hidden md:block">
        <span className="key">W</span>
        <span className="key">A</span>
        <span className="key">S</span>
        <span className="key">D</span>
        <span className="ml-2">o flechas para conducir</span>
        <span className="ml-4 key">ESPACIO</span>
        <span className="ml-2">para frenar</span>
      </div>

      {/* Mobile Controls - Corner positioned with low opacity */}
      {isMobile && (
        <>
          {/* Left side controls ( steering ) - z-400, bottom-24 para evitar footer */}
          <div className="fixed bottom-24 left-4 z-[400] flex items-end gap-3">
            <button
              className="mobile-control-btn"
              onTouchStart={(e) => {
                e.preventDefault();
                setMobileControl("left", true);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                setMobileControl("left", false);
              }}
              onMouseDown={() => setMobileControl("left", true)}
              onMouseUp={() => setMobileControl("left", false)}
              onMouseLeave={() => setMobileControl("left", false)}
              onContextMenu={(e) => e.preventDefault()}
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            <button
              className="mobile-control-btn"
              onTouchStart={(e) => {
                e.preventDefault();
                setMobileControl("right", true);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                setMobileControl("right", false);
              }}
              onMouseDown={() => setMobileControl("right", true)}
              onMouseUp={() => setMobileControl("right", false)}
              onMouseLeave={() => setMobileControl("right", false)}
              onContextMenu={(e) => e.preventDefault()}
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          </div>

          {/* Right side controls ( acceleration ) - z-400, bottom-24 para evitar footer */}
          <div className="fixed bottom-24 right-4 z-[400] flex items-end gap-3">
            <button
              className="mobile-control-btn"
              onTouchStart={(e) => {
                e.preventDefault();
                setMobileControl("brake", true);
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                setMobileControl("brake", false);
              }}
              onMouseDown={() => setMobileControl("brake", true)}
              onMouseUp={() => setMobileControl("brake", false)}
              onMouseLeave={() => setMobileControl("brake", false)}
              onContextMenu={(e) => e.preventDefault()}
            >
              <span className="text-xs font-bold tracking-wider">STOP</span>
            </button>
            <div className="flex flex-col gap-3">
              <button
                className="mobile-control-btn"
                onTouchStart={(e) => {
                  e.preventDefault();
                  setMobileControl("forward", true);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  setMobileControl("forward", false);
                }}
                onMouseDown={() => setMobileControl("forward", true)}
                onMouseUp={() => setMobileControl("forward", false)}
                onMouseLeave={() => setMobileControl("forward", false)}
                onContextMenu={(e) => e.preventDefault()}
              >
                <ChevronUp className="w-10 h-10" />
              </button>
              <button
                className="mobile-control-btn"
                onTouchStart={(e) => {
                  e.preventDefault();
                  setMobileControl("backward", true);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  setMobileControl("backward", false);
                }}
                onMouseDown={() => setMobileControl("backward", true)}
                onMouseUp={() => setMobileControl("backward", false)}
                onMouseLeave={() => setMobileControl("backward", false)}
                onContextMenu={(e) => e.preventDefault()}
              >
                <ChevronDown className="w-10 h-10" />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default UI;
