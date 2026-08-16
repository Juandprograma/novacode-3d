"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ControlState } from "@/types";

export function useControls() {
  const [controls, setControls] = useState<ControlState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
  });

  const controlsRef = useRef(controls);

  useEffect(() => {
    controlsRef.current = controls;
  }, [controls]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    
    switch (key) {
      case "w":
      case "arrowup":
        setControls((prev) => ({ ...prev, forward: true }));
        break;
      case "s":
      case "arrowdown":
        setControls((prev) => ({ ...prev, backward: true }));
        break;
      case "a":
      case "arrowleft":
        setControls((prev) => ({ ...prev, left: true }));
        break;
      case "d":
      case "arrowright":
        setControls((prev) => ({ ...prev, right: true }));
        break;
      case " ":
      case "b":
        setControls((prev) => ({ ...prev, brake: true }));
        break;
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    
    switch (key) {
      case "w":
      case "arrowup":
        setControls((prev) => ({ ...prev, forward: false }));
        break;
      case "s":
      case "arrowdown":
        setControls((prev) => ({ ...prev, backward: false }));
        break;
      case "a":
      case "arrowleft":
        setControls((prev) => ({ ...prev, left: false }));
        break;
      case "d":
      case "arrowright":
        setControls((prev) => ({ ...prev, right: false }));
        break;
      case " ":
      case "b":
        setControls((prev) => ({ ...prev, brake: false }));
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Mobile controls
  const setMobileControl = useCallback((control: keyof ControlState, value: boolean) => {
    setControls((prev) => ({ ...prev, [control]: value }));
  }, []);

  return { controls, setMobileControl };
}
