"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/theme-context";
import { useLanguage } from "@/context/language-context";

// Paletas cromáticas del Tema Dual
// Modo Holographic Pearl (Claro): mayor densidad cromática con pizarra profundo, esmeralda oscuro, índigo y destellos violetas
const PEARL_PALETTE = [
  "#0F172A", // Pizarra profundo (Slate 900)
  "#0D9488", // Esmeralda oscuro (Teal 600)
  "#4F46E5", // Índigo profundo (Indigo 600)
  "#7C3AED", // Destello violeta (Violet 600)
  "#1E293B", // Pizarra grafito (Slate 800)
];

// Modo Deep Space (Oscuro): luminiscente combinando blanco perla, cian ártico, verde agua y lavanda brillante
const DEEP_SPACE_PALETTE = [
  "#F8FAFC", // Blanco perla luminoso (Slate 50)
  "#38BDF8", // Cian ártico (Sky 400)
  "#34D399", // Verde agua luminiscente (Emerald 400)
  "#C084FC", // Lavanda brillante (Purple 400)
  "#E0F2FE", // Hielo perla (Sky 100)
];

interface SandGrain {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  spring: number;
  friction: number;
  wanderAngle: number;
  wanderSpeed: number;
  wanderRadius: number;
  colorIndex: number;
  alpha: number;
}

export function SandQuoteBanner() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const { language } = useLanguage();

  const [isConverging, setIsConverging] = useState(false);
  const [showAuthor, setShowAuthor] = useState(false);

  // Referencias mutables para animación continua a 60 FPS sin re-renders
  const themeRef = useRef(theme);
  const isConvergingRef = useRef(false);
  const particlesRef = useRef<SandGrain[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animFrameIdRef = useRef<number | null>(null);
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 });

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    isConvergingRef.current = isConverging;
  }, [isConverging]);

  // Selección de frase bilingüe según contexto
  const isEn = language === "en";
  const quoteLine1 = isEn ? "Curiosity and creativity" : "La curiosidad y la creatividad";
  const quoteLine2 = isEn ? "are intelligence having fun." : "son inteligencia divirtiéndose.";
  const fullQuote = isEn
    ? "Curiosity and creativity are intelligence having fun."
    : "La curiosidad y la creatividad son inteligencia divirtiéndose.";
  const authorName = "Albert Einstein";

  // Muestreo de coordenadas en memoria (Offscreen Canvas Sampling)
  const generateTargetCoordinates = useCallback(
    (cssWidth: number, cssHeight: number) => {
      if (typeof window === "undefined" || cssWidth <= 0 || cssHeight <= 0) return [];

      const offscreen = document.createElement("canvas");
      offscreen.width = cssWidth;
      offscreen.height = cssHeight;
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return [];

      // Detección responsive de escala de fuente y disposición (1 línea vs 2 líneas)
      const isMobile = cssWidth < 640;
      const isTablet = cssWidth >= 640 && cssWidth < 1024;
      
      let fontSize: number;
      let lines: string[];

      if (isMobile) {
        // En móviles siempre en 2 líneas
        fontSize = Math.max(15, Math.min(20, Math.floor(cssWidth / 19)));
        lines = [quoteLine1, quoteLine2];
      } else if (isTablet) {
        // En tablet evaluamos si cabe en 1 o 2 líneas
        fontSize = Math.max(18, Math.min(24, Math.floor(cssWidth / 36)));
        lines = cssWidth < 880 ? [quoteLine1, quoteLine2] : [fullQuote];
      } else {
        // Desktop: tipografía amplia y proporcionada
        fontSize = Math.max(22, Math.min(32, Math.floor(cssWidth / 42)));
        lines = cssWidth < 1180 ? [quoteLine1, quoteLine2] : [fullQuote];
      }

      offCtx.font = `700 ${fontSize}px var(--font-montserrat), Montserrat, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "#ffffff";

      // Centrado vertical ligeramente desplazado hacia arriba para dar espacio natural a la firma
      const lineHeight = fontSize * 1.35;
      const totalBlockHeight = lines.length * lineHeight;
      const baseY = (cssHeight - 48) / 2 - totalBlockHeight / 2 + lineHeight / 2;

      lines.forEach((line, index) => {
        const lineY = baseY + index * lineHeight;
        offCtx.fillText(line, cssWidth / 2, lineY);
      });

      // Muestreo de píxeles con paso adaptativo para garantizar nitidez óptima y ligereza (1.200 a 2.300 partículas)
      const step = isMobile ? 2.2 : isTablet ? 2.5 : 2.8;
      const imgData = offCtx.getImageData(0, 0, cssWidth, cssHeight);
      const data = imgData.data;
      const targets: { x: number; y: number }[] = [];

      for (let y = 0; y < cssHeight; y += step) {
        for (let x = 0; x < cssWidth; x += step) {
          const pixelX = Math.floor(x);
          const pixelY = Math.floor(y);
          const index = (pixelY * cssWidth + pixelX) * 4;
          const alpha = data[index + 3];

          if (alpha > 128) {
            targets.push({
              x: pixelX + (Math.random() - 0.5) * 0.4,
              y: pixelY + (Math.random() - 0.5) * 0.4,
            });
          }
        }
      }

      return targets;
    },
    [quoteLine1, quoteLine2, fullQuote]
  );

  // Inicialización y reconstrucción de partículas
  const initParticles = useCallback(
    (w: number, h: number) => {
      const targets = generateTargetCoordinates(w, h);
      if (targets.length === 0) return;

      const currentParticles = particlesRef.current;
      const newParticles: SandGrain[] = [];

      for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        const existing = currentParticles[i];

        // Posición inicial dispersa orgánica por todo el banner
        const originX = existing ? existing.originX : Math.random() * w;
        const originY = existing ? existing.originY : Math.random() * h;

        newParticles.push({
          x: existing ? existing.x : originX,
          y: existing ? existing.y : originY,
          targetX: target.x,
          targetY: target.y,
          originX,
          originY,
          vx: existing ? existing.vx : (Math.random() - 0.5) * 0.6,
          vy: existing ? existing.vy : (Math.random() - 0.5) * 0.6,
          size: Math.random() * 0.7 + 0.9, // 0.9px a 1.6px para grano fino de cuarzo
          // Variación individual de resorte para convergencia orgánica y fluida
          spring: 0.045 + Math.random() * 0.04,
          friction: 0.84 + Math.random() * 0.04,
          wanderAngle: Math.random() * Math.PI * 2,
          wanderSpeed: (Math.random() - 0.5) * 0.02 + 0.008,
          wanderRadius: Math.random() * 28 + 12,
          colorIndex: i % 5,
          alpha: Math.random() * 0.35 + 0.65,
        });
      }

      particlesRef.current = newParticles;
    },
    [generateTargetCoordinates]
  );

  // IntersectionObserver para Scroll Trigger al 25%
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsConverging(true);
            // Hacer aparecer suavemente la firma editorial a los ~1.2s de la convergencia
            if (!showAuthor) {
              timeoutId = setTimeout(() => {
                setShowAuthor(true);
              }, 1200);
            }
          } else {
            // Si el usuario vuelve a subir lejos, se relajan los granos
            setIsConverging(false);
            setShowAuthor(false);
            if (timeoutId) clearTimeout(timeoutId);
          }
        });
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showAuthor]);

  // Manejador de redimensionado con debounce
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout | null = null;

    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const rect = container.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = rect.width;
        const h = rect.height;

        dimensionsRef.current = { width: w, height: h, dpr };
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;

        initParticles(w, h);
      }, 150);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Si las fuentes web tardan unos milisegundos en cargar, re-muestrear para métricas perfectas
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        handleResize();
      });
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimer) clearTimeout(resizeTimer);
    };
  }, [initParticles]);

  // Re-muestreo al cambiar de idioma
  useEffect(() => {
    const { width: w, height: h } = dimensionsRef.current;
    if (w > 0 && h > 0) {
      initParticles(w, h);
    }
  }, [language, initParticles]);

  // Bucle de Física y Renderizado Canvas 2D
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      const { width: w, height: h, dpr } = dimensionsRef.current;
      if (w > 0 && h > 0) {
        ctx.save();
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, w, h);

        const isDark = themeRef.current === "deep-space";
        const palette = isDark ? DEEP_SPACE_PALETTE : PEARL_PALETTE;
        const mouse = mouseRef.current;
        const converging = isConvergingRef.current;
        const particles = particlesRef.current;
        const len = particles.length;

        // Repulsión radial corta (55px)
        const repulsionRadius = 55;
        const repulsionRadiusSq = repulsionRadius * repulsionRadius;

        for (let i = 0; i < len; i++) {
          const p = particles[i];

          if (converging) {
            // Física de atracción elástica magnética hacia la posición esculpida
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            p.vx += dx * p.spring;
            p.vy += dy * p.spring;
            p.vx *= p.friction;
            p.vy *= p.friction;

            // Repulsión por proximidad al cursor
            if (mouse.active) {
              const mx = p.x - mouse.x;
              const my = p.y - mouse.y;
              const distSq = mx * mx + my * my;

              if (distSq < repulsionRadiusSq && distSq > 0) {
                const dist = Math.sqrt(distSq);
                const force = (1 - dist / repulsionRadius) * 4.8;
                p.vx += (mx / dist) * force;
                p.vy += (my / dist) * force;
              }
            }

            p.x += p.vx;
            p.y += p.vy;
          } else {
            // Flotación relajada orgánica mientras no converge
            p.wanderAngle += p.wanderSpeed;
            const targetWanderX = p.originX + Math.cos(p.wanderAngle) * p.wanderRadius;
            const targetWanderY = p.originY + Math.sin(p.wanderAngle) * (p.wanderRadius * 0.7);

            p.x += (targetWanderX - p.x) * 0.05;
            p.y += (targetWanderY - p.y) * 0.05;
          }

          // Renderizado del grano
          const color = palette[p.colorIndex % palette.length];
          ctx.fillStyle = color;
          ctx.globalAlpha = p.alpha;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Manejo de eventos de ratón y táctiles
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -9999, y: -9999, active: false };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
      active: true,
    };
  };

  const handleTouchEnd = () => {
    mouseRef.current = { x: -9999, y: -9999, active: false };
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Cita inspiracional de cierre"
      className="w-full h-[260px] md:h-[300px] relative overflow-hidden select-none flex flex-col items-center justify-center border-t border-slate-200/60 dark:border-white/5 bg-radial from-slate-500/[0.03] via-transparent to-transparent"
    >
      {/* Canvas Interactivo de Alta Resolución */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-10"
      />

      {/* Capa de Accesibilidad Semántica y SEO (100% Indexable) */}
      <blockquote className="sr-only">
        <p>"{fullQuote}"</p>
        <cite>— {authorName}</cite>
      </blockquote>

      {/* Resplandor ambiental sutil de fondo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08),transparent_70%)]"
      />

      {/* Firma Editorial del Autor (Fade-in suave con Framer Motion) */}
      <div className="absolute bottom-8 md:bottom-10 z-20 pointer-events-none">
        <AnimatePresence>
          {showAuthor && (
            <motion.div
              initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(2px)" }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-slate-300/40 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xs shadow-2xs"
            >
              <span className="w-4 h-[1px] bg-slate-400 dark:bg-slate-600" />
              <span className="text-xs md:text-sm font-medium tracking-widest uppercase text-slate-600 dark:text-slate-400 font-mono">
                {authorName}
              </span>
              <span className="w-4 h-[1px] bg-slate-400 dark:bg-slate-600" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
