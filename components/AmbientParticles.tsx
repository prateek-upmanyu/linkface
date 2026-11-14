"use client";

import React, { useEffect, useRef } from "react";

interface AmbientParticlesProps {
  themeId?: string;
  className?: string;
}

export function AmbientParticles({ themeId = "luxury-craft", className = "" }: AmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const isGold = themeId.includes("luxury") || themeId.includes("gold");
    const isPurple = themeId.includes("obsidian") || themeId.includes("dark");

    const particleColors = isGold
      ? ["#f5d77f", "#ffd95c", "#c59b27", "#ffe57f"]
      : isPurple
      ? ["#b388ff", "#7c4dff", "#ea80fc", "#8c9eff"]
      : ["#ffffff", "#e0e7ff", "#fef08a"];

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      color: string;
      alpha: number;
    }

    const particles: Particle[] = [];
    const count = 28;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() > 0.8 ? 3 : 2, // crisp pixel squares
        speedY: -(Math.random() * 0.4 + 0.15),
        speedX: (Math.random() - 0.5) * 0.2,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < -10) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, [themeId]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none w-full h-full z-0 overflow-hidden ${className}`}
    />
  );
}
