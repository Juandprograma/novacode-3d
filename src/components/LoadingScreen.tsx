"use client";

import { useState, useEffect } from "react";
import { Code2 } from "lucide-react";

interface LoadingScreenProps {
  onStart: () => void;
}

export function LoadingScreen({ onStart }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoaded(true);
          return 100;
        }
        // Random increment for realistic loading feel
        const increment = Math.random() * 3 + 1;
        return Math.min(prev + increment, 100);
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    onStart();
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Code2 className="w-10 h-10" style={{ color: "#D4AF37" }} />
          <span 
            className="text-3xl font-bold tracking-tight"
            style={{ 
              color: "#fff",
              fontFamily: "'JetBrains Mono', monospace"
            }}
          >
            NOVA<span style={{ color: "#D4AF37" }}>CODE</span>
          </span>
        </div>
        <p 
          className="text-sm tracking-widest"
          style={{ 
            color: "rgba(255, 255, 255, 0.5)",
            fontFamily: "'JetBrains Mono', monospace"
          }}
        >
          ENGINE v2.0
        </p>
      </div>

      {/* Loading State */}
      {!isLoaded ? (
        <div className="w-full max-w-md px-8">
          {/* Progress Text */}
          <div className="flex justify-between mb-2">
            <span 
              className="text-xs tracking-wider"
              style={{ 
                color: "rgba(255, 255, 255, 0.7)",
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              Cargando infraestructura de Novacode...
            </span>
            <span 
              className="text-xs tabular-nums"
              style={{ 
                color: "#D4AF37",
                fontFamily: "'JetBrains Mono', monospace"
              }}
            >
              {Math.floor(progress)}%
            </span>
          </div>

          {/* Progress Bar Container */}
          <div 
            className="h-1 w-full rounded-full overflow-hidden"
            style={{ background: "rgba(255, 255, 255, 0.1)" }}
          >
            {/* Progress Bar */}
            <div 
              className="h-full rounded-full transition-all duration-100 ease-out"
              style={{ 
                width: `${progress}%`,
                background: "linear-gradient(90deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%)",
                boxShadow: "0 0 10px rgba(212, 175, 55, 0.5)"
              }}
            />
          </div>

          {/* Technical details */}
          <div className="mt-4 flex justify-between text-[10px]" style={{ color: "rgba(255, 255, 255, 0.3)", fontFamily: "'JetBrains Mono', monospace" }}>
            <span>INIT_ASSETS...</span>
            <span>LOADING_MODULES...</span>
            <span>READY</span>
          </div>
        </div>
      ) : (
        /* Start Button */
        <button
          onClick={handleStart}
          className="group relative px-12 py-4 overflow-hidden rounded-sm transition-all duration-300"
          style={{
            background: "transparent",
            border: "1px solid #D4AF37",
          }}
        >
          {/* Glow effect */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: "radial-gradient(circle at center, rgba(212, 175, 55, 0.3) 0%, transparent 70%)"
            }}
          />
          
          {/* Button text */}
          <span 
            className="relative z-10 text-sm font-medium tracking-widest transition-all duration-300 group-hover:tracking-[0.3em]"
            style={{ 
              color: "#D4AF37",
              fontFamily: "'JetBrains Mono', monospace",
              textShadow: "0 0 20px rgba(212, 175, 55, 0.5)"
            }}
          >
            INICIAR EXPERIENCIA
          </span>

          {/* Animated border glow */}
          <div 
            className="absolute inset-0 rounded-sm opacity-50"
            style={{
              boxShadow: "inset 0 0 20px rgba(212, 175, 55, 0.3), 0 0 20px rgba(212, 175, 55, 0.2)",
              animation: "pulseGlow 2s ease-in-out infinite"
            }}
          />
        </button>
      )}

      {/* Decorative elements */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between text-[10px]" style={{ color: "rgba(255, 255, 255, 0.2)", fontFamily: "'JetBrains Mono', monospace" }}>
        <span>COORDS: 4.7110° N, 74.0721° W</span>
        <span>BOGOTÁ, COLOMBIA</span>
        <span>v2.0.2026</span>
      </div>
    </div>
  );
}

export default LoadingScreen;
