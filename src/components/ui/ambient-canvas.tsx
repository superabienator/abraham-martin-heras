"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "@/context/theme-context";

interface SandParticle {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  colorIndex: number;
  freqX: number;
  freqY: number;
  ampX: number;
  ampY: number;
  phase: number;
}

// Paleta Dual Relajante (Holographic Pearl vs. Deep Space)
const LIGHT_PALETTE = [
  "rgba(148, 163, 184, 0.32)", // Piedra perla
  "rgba(45, 212, 191, 0.26)",  // Aguamarina suave
  "rgba(167, 139, 250, 0.24)", // Lavanda etéreo
  "rgba(251, 146, 60, 0.18)",  // Melocotón suave
];

const DARK_PALETTE = [
  "rgba(56, 189, 248, 0.26)",  // Cian ártico
  "rgba(16, 185, 129, 0.24)",  // Esmeralda
  "rgba(129, 140, 248, 0.22)", // Índigo
];

export function AmbientCanvas() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef(theme);

  // Mantener themeRef sincronizado sin disparar re-renders ni reiniciar el bucle
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number | null = null;
    let isRunning = true;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Control del ratón mediante referencias mutables (0 re-renders)
    const mouse = {
      x: -9999,
      y: -9999,
      active: false,
      isOverInteractive: false,
    };

    let currentRadius = 130;
    let currentForce = 1.0;

    // Densidad adaptativa: ~900 en escritorio, ~350 en móvil
    let particles: SandParticle[] = [];

    const createParticles = (w: number, h: number) => {
      const isMobile = w < 768;
      const count = isMobile ? 350 : 900;
      const list: SandParticle[] = [];

      for (let i = 0; i < count; i++) {
        const originX = Math.random() * w;
        const originY = Math.random() * h;
        list.push({
          originX,
          originY,
          x: originX,
          y: originY,
          vx: 0,
          vy: 0,
          size: Math.random() * 1.3 + 0.8,
          colorIndex: i % 4,
          freqX: Math.random() * 0.0008 + 0.0004,
          freqY: Math.random() * 0.0010 + 0.0005,
          ampX: Math.random() * 18 + 8,
          ampY: Math.random() * 14 + 6,
          phase: Math.random() * Math.PI * 2,
        });
      }
      return list;
    };

    // Ajuste de tamaño limitando DPR a 1.5 para máxima eficiencia en 4K
    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      particles = createParticles(width, height);
    };

    handleResize();

    // Eventos de puntero no bloqueantes
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      const target = e.target as HTMLElement | null;
      mouse.isOverInteractive = Boolean(
        target &&
          typeof target.closest === "function" &&
          target.closest('a, button, [data-cursor="interactive"], .holographic-card, [role="button"]')
      );
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
      mouse.isOverInteractive = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    window.addEventListener("blur", handleMouseLeave, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // Bucle generativo 60 FPS
    const render = () => {
      if (!isRunning) return;

      const now = performance.now();
      const isDark =
        document.documentElement.classList.contains("dark") ||
        themeRef.current === "deep-space";

      // 1. Limpieza con fondo base correspondiente al tema activo
      ctx.fillStyle = isDark ? "#0B0F19" : "#F6F7FB";
      ctx.fillRect(0, 0, width, height);

      // 2. Transición elástica del radio y fuerza magnética al sobrevolar tarjetas o menús
      const targetRadius = mouse.isOverInteractive ? 180 : 130;
      const targetForce = mouse.isOverInteractive ? 1.65 : 1.0;
      currentRadius += (targetRadius - currentRadius) * 0.12;
      currentForce += (targetForce - currentForce) * 0.12;

      // 3. Simulación física por grano
      const spring = 0.035;
      const friction = 0.88;
      const count = particles.length;

      for (let i = 0; i < count; i++) {
        const p = particles[i];

        // Reposo orgánico sinusoidal (Dunas de seda en flujo continuo)
        const flowX =
          Math.sin(now * p.freqX + p.phase) * p.ampX +
          Math.cos(now * p.freqY * 0.5 + p.phase) * (p.ampX * 0.35);
        const flowY =
          Math.cos(now * p.freqY + p.phase) * p.ampY +
          Math.sin(now * p.freqX * 0.6 + p.phase) * (p.ampY * 0.35);

        const targetX = p.originX + flowX;
        const targetY = p.originY + flowY;

        // Repulsión y remolino magnético
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < currentRadius && dist > 0.001) {
            const normDist = dist / currentRadius;
            const intensity = Math.pow(1 - normDist, 1.8) * currentForce;

            // Empuje radial
            const angle = Math.atan2(dy, dx);
            const pushSpeed = intensity * 4.4;
            const rx = Math.cos(angle) * pushSpeed;
            const ry = Math.sin(angle) * pushSpeed;

            // Remolino tangencial suave
            const swirlSpeed = intensity * 2.8;
            const sx = -Math.sin(angle) * swirlSpeed;
            const sy = Math.cos(angle) * swirlSpeed;

            p.vx += rx + sx;
            p.vy += ry + sy;
          }
        }

        // Retorno elástico amortiguado
        const ax = (targetX - p.x) * spring;
        const ay = (targetY - p.y) * spring;
        p.vx = (p.vx + ax) * friction;
        p.vy = (p.vy + ay) * friction;
        p.x += p.vx;
        p.y += p.vy;
      }

      // 4. Renderizado optimizado por lotes de color (mínimos context switches)
      const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;
      const paletteLen = palette.length;

      for (let c = 0; c < paletteLen; c++) {
        ctx.fillStyle = palette[c];
        ctx.beginPath();
        for (let i = 0; i < count; i++) {
          const p = particles[i];
          if (p.colorIndex % paletteLen === c) {
            ctx.moveTo(p.x + p.size, p.y);
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          }
        }
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Control de visibilidad para suspender la CPU en segundo plano
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        isRunning = false;
        if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else {
        if (!isRunning) {
          isRunning = true;
          animationFrameId = requestAnimationFrame(render);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("blur", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      aria-hidden="true"
    />
  );
}
