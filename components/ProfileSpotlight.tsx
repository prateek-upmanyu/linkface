"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface ProfileSpotlightProps {
  accentColor: string;
  className?: string;
  radius?: number; // default 320px
  opacity?: number; // default 0.10 (10%)
}

/**
 * 60fps hardware-accelerated interactive spotlight that follows
 * the mouse cursor (desktop) or finger touch (mobile).
 * Pointer-events none, placed strictly behind content layers.
 */
export function ProfileSpotlight({
  accentColor,
  className = "",
  radius = 320,
  opacity = 0.1,
}: ProfileSpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const updatePosition = (clientX: number, clientY: number) => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = requestAnimationFrame(() => {
        const rect = parent.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        setCoords({ x, y });
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleMouseLeave = () => {
      setCoords(null);
    };

    parent.addEventListener("mousemove", handleMouseMove, { passive: true });
    parent.addEventListener("touchmove", handleTouchMove, { passive: true });
    parent.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("touchmove", handleTouchMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion || !coords) {
    return <div ref={containerRef} className="pointer-events-none absolute inset-0 z-0" />;
  }

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ease-out overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(${radius}px circle at ${coords.x}px ${coords.y}px, ${hexToRgba(accentColor, opacity)} 0%, transparent 80%)`,
      }}
    />
  );
}

/**
 * Safely converts hex or css color to rgba with specific opacity.
 */
function hexToRgba(color: string, alpha: number): string {
  if (color.startsWith("#")) {
    let hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }
  return color;
}
