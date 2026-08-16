"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import * as THREE from "three";

interface CameraState {
  azimuth: number;
  elevation: number;
  distance: number;
  target: THREE.Vector3;
}

export function useOrbitalCamera(
  initialAzimuth: number = 0,
  initialElevation: number = Math.PI / 4,
  initialDistance: number = 15
) {
  const cameraStateRef = useRef<CameraState>({
    azimuth: initialAzimuth,
    elevation: Math.max(0.1, Math.min(Math.PI / 2 - 0.1, initialElevation)),
    distance: initialDistance,
    target: new THREE.Vector3(0, 0.5, 0),
  });

  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  const smoothCameraRef = useRef({
    position: new THREE.Vector3(),
    target: new THREE.Vector3(),
  });

  // Update target to follow vehicle
  const updateTarget = useCallback((position: THREE.Vector3) => {
    cameraStateRef.current.target.copy(position);
    // Keep target at vehicle height + offset
    cameraStateRef.current.target.y = 1.5;
  }, []);

  // Calculate camera position based on spherical coordinates
  const calculateCameraPosition = useCallback(() => {
    const { azimuth, elevation, distance, target } = cameraStateRef.current;
    
    const x = target.x + distance * Math.sin(elevation) * Math.sin(azimuth);
    const y = target.y + distance * Math.cos(elevation);
    const z = target.z + distance * Math.sin(elevation) * Math.cos(azimuth);
    
    return new THREE.Vector3(x, y, z);
  }, []);

  // Handle mouse down for drag
  const handleMouseDown = useCallback((e: MouseEvent | TouchEvent) => {
    isDraggingRef.current = true;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    lastMouseRef.current = { x: clientX, y: clientY };
  }, []);

  // Handle mouse move for drag
  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDraggingRef.current) return;
    
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - lastMouseRef.current.x;
    const deltaY = clientY - lastMouseRef.current.y;
    
    const sensitivity = 0.005;
    
    cameraStateRef.current.azimuth -= deltaX * sensitivity;
    cameraStateRef.current.elevation -= deltaY * sensitivity;
    
    // Clamp elevation to prevent flipping
    cameraStateRef.current.elevation = Math.max(
      0.1,
      Math.min(Math.PI / 2 - 0.1, cameraStateRef.current.elevation)
    );
    
    lastMouseRef.current = { x: clientX, y: clientY };
  }, []);

  // Handle mouse up to end drag
  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Handle wheel for zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    const zoomSpeed = 0.001;
    cameraStateRef.current.distance += e.deltaY * zoomSpeed * cameraStateRef.current.distance;
    cameraStateRef.current.distance = Math.max(5, Math.min(30, cameraStateRef.current.distance));
  }, []);

  // Setup event listeners
  useEffect(() => {
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleMouseDown, { passive: false });
    window.addEventListener("touchmove", handleMouseMove, { passive: false });
    window.addEventListener("touchend", handleMouseUp);
    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleMouseDown);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener("wheel", handleWheel);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleWheel]);

  // Get smoothed camera position for rendering
  const getCameraPosition = useCallback((lerpFactor: number = 0.08) => {
    const targetPosition = calculateCameraPosition();
    const targetLookAt = cameraStateRef.current.target.clone();
    
    smoothCameraRef.current.position.lerp(targetPosition, lerpFactor);
    smoothCameraRef.current.target.lerp(targetLookAt, lerpFactor);
    
    return {
      position: smoothCameraRef.current.position,
      target: smoothCameraRef.current.target,
    };
  }, [calculateCameraPosition]);

  // Reset camera to default position
  const resetCamera = useCallback(() => {
    cameraStateRef.current.azimuth = initialAzimuth;
    cameraStateRef.current.elevation = initialElevation;
    cameraStateRef.current.distance = initialDistance;
  }, [initialAzimuth, initialElevation, initialDistance]);

  return {
    updateTarget,
    getCameraPosition,
    resetCamera,
    isDragging: () => isDraggingRef.current,
    cameraState: cameraStateRef,
  };
}

export default useOrbitalCamera;
