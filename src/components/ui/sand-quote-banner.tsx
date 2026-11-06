"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/theme-context";
import { useLanguage } from "@/context/language-context";

// Paletas cromáticas de alto contraste y fidelidad para el Tema Dual
// Modo Holographic Pearl (Fondo claro): colores profundos y nítidos con pizarra, esmeralda oscuro, índigo y destello violeta
const PEARL_PALETTE = [
  "#0F172A", // Pizarra profundo
  "#0D9488", // Esmeralda oscuro
  "#4338CA", // Índigo intenso
  "#6D28D9", // Violeta profundo
  "#1E293B", // Grafito pizarra
];

// Modo Deep Space (Fondo oscuro): luminiscentes blanco puro, cian ártico, verde agua y lavanda brillante
const DEEP_SPACE_PALETTE = [
  "#FFFFFF", // Blanco puro
  "#38BDF8", // Cian ártico brillante
  "#34D399", // Verde agua luminiscente
  "#C084FC", // Lavanda neón
  "#E0F2FE", // Cian hielo
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

  // Referencias mutables para animación continua a 60 FPS sin desincronización
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

  // Selección de frase bilingüe
  const isEn = language === "en";
  const quoteLine1 = isEn ? "Curiosity and creativity" : "La curiosidad y la creatividad";
  const quoteLine2 = isEn ? "are intelligence having fun." : "son la inteligencia divirtiéndose.";
  const fullQuote = `${quoteLine1} ${quoteLine2}`;
  const authorName = "Albert Einstein";

  // Muestreo preciso de coordenadas en memoria (Offscreen Canvas Sampling)
  const generateTargetCoordinates = useCallback(
    (cssWidth: number, cssHeight: number) => {
      if (typeof window === "undefined" || cssWidth <= 0 || cssHeight <= 0) return [];

      const w = Math.round(cssWidth);
      const h = Math.round(cssHeight);

      const offscreen = document.createElement("canvas");
      offscreen.width = w;
      offscreen.height = h;
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return [];

      // Tamaño de tipografía proporcional para que las letras tengan gran presencia y nunca se desborden
      // En móvil: 16px - 20px en 2 líneas
      // En desktop: 24px - 34px en 2 líneas
      const isMobile = w < 640;
      let fontSize = isMobile
        ? Math.max(15, Math.min(20, Math.floor(w / 20)))
        : Math.max(22, Math.min(32, Math.floor(w / 38)));

      // Verificación de ajuste de ancho: si la línea más larga excede el 90% del ancho, escalamos hacia abajo
      offCtx.font = `800 ${fontSize}px "Montserrat", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      const m1 = offCtx.measureText(quoteLine1).width;
      const m2 = offCtx.measureText(quoteLine2).width;
      const maxTextWidth = Math.max(m1, m2);
      const availableWidth = w * 0.88;

      if (maxTextWidth > availableWidth && maxTextWidth > 0) {
        fontSize = Math.floor(fontSize * (availableWidth / maxTextWidth));
      }

      // Dibujar texto blanco sobre fondo transparente en el offscreen canvas con tipografía ultra-bold 800
      offCtx.font = `800 ${fontSize}px "Montserrat", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "#ffffff";

      // Centrado vertical: bloque tipográfico centrado en el tercio superior/medio para dar aire a la firma
      const lineHeight = Math.round(fontSize * 1.38);
      const centerY = Math.round(h * 0.40);
      const lineY1 = centerY - Math.round(lineHeight / 2);
      const lineY2 = centerY + Math.round(lineHeight / 2);

      offCtx.fillText(quoteLine1, Math.round(w / 2), lineY1);
      offCtx.fillText(quoteLine2, Math.round(w / 2), lineY2);

      // Muestreo con paso denso (2.0 a 2.4 px) para formar caracteres continuos y legibles
      const step = isMobile ? 2.0 : 2.2;
      const imgData = offCtx.getImageData(0, 0, w, h);
      const data = imgData.data;
      const targets: { x: number; y: number }[] = [];

      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const px = Math.floor(x);
          const py = Math.floor(y);
          const index = (py * w + px) * 4;
          const alpha = data[index + 3];

          // Canal alfa superior al umbral
          if (alpha > 110) {
            targets.push({
              x: px + (Math.random() - 0.5) * 0.3,
              y: py + (Math.random() - 0.5) * 0.3,
            });
          }
        }
      }

      return targets;
    },
    [quoteLine1, quoteLine2]
  );

  // Inicialización y actualización de partículas
  const initParticles = useCallback(
    (w: number, h: number) => {
      const targets = generateTargetCoordinates(w, h);
      if (targets.length === 0) return;

      const currentParticles = particlesRef.current;
      const newParticles: SandGrain[] = [];

      for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        const existing = currentParticles[i];

        // Posición dispersa distribuida por el lienzo del banner
        const originX = existing ? existing.originX : Math.random() * w;
        const originY = existing ? existing.originY : Math.random() * h;

        newParticles.push({
          x: existing ? existing.x : originX,
          y: existing ? existing.y : originY,
          targetX: target.x,
          targetY: target.y,
          originX,
          originY,
          vx: existing ? existing.vx : (Math.random() - 0.5) * 0.8,
          vy: existing ? existing.vy : (Math.random() - 0.5) * 0.8,
          // Tamaño de grano entre 1.0px y 1.7px para que solapen suavemente formando letras continuas
          size: Math.random() * 0.6 + 1.1,
          spring: 0.052 + Math.random() * 0.035,
          friction: 0.83 + Math.random() * 0.04,
          wanderAngle: Math.random() * Math.PI * 2,
          wanderSpeed: (Math.random() - 0.5) * 0.02 + 0.01,
          wanderRadius: Math.random() * 25 + 10,
          colorIndex: i % 5,
          alpha: Math.random() * 0.15 + 0.85,
        });
      }

      particlesRef.current = newParticles;
    },
    [generateTargetCoordinates]
  );

  // Detección de visibilidad con IntersectionObserver + chequeo inmediato
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let timeoutId: NodeJS.Timeout | null = null;

    const checkVisibility = (isVis: boolean) => {
      if (isVis) {
        setIsConverging(true);
        if (!showAuthor) {
          timeoutId = setTimeout(() => {
            setShowAuthor(true);
          }, 1100);
        }
      } else {
        setIsConverging(false);
        setShowAuthor(false);
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    // Comprobación inicial directa por si el usuario ya está al fondo de la página
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      checkVisibility(true);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          checkVisibility(entry.isIntersecting);
        });
      },
      {
        threshold: [0.08, 0.25],
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showAuthor]);

  // Manejador de redimensionado con sincronización de fuentes y debounce
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
        const w = Math.round(rect.width);
        const h = Math.round(rect.height);

        dimensionsRef.current = { width: w, height: h, dpr };
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;

        initParticles(w, h);
      }, 120);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Asegurar métricas tipográficas una vez que las fuentes web estén completamente listas
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

  // Re-muestrear si el usuario cambia el idioma (es / en)
  useEffect(() => {
    const { width: w, height: h } = dimensionsRef.current;
    if (w > 0 && h > 0) {
      initParticles(w, h);
    }
  }, [language, initParticles]);

  // Bucle de física e iluminación Canvas 2D
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
            // Fuerza magnética de resorte hacia la coordenada esculpida
            const dx = p.targetX - p.x;
            const dy = p.targetY - p.y;
            p.vx += dx * p.spring;
            p.vy += dy * p.spring;
            p.vx *= p.friction;
            p.vy *= p.friction;

            // Repulsión interactiva si el cursor se acerca a las letras
            if (mouse.active) {
              const mx = p.x - mouse.x;
              const my = p.y - mouse.y;
              const distSq = mx * mx + my * my;

              if (distSq < repulsionRadiusSq && distSq > 0) {
                const dist = Math.sqrt(distSq);
                const force = (1 - dist / repulsionRadius) * 5.2;
                p.vx += (mx / dist) * force;
                p.vy += (my / dist) * force;
              }
            }

            p.x += p.vx;
            p.y += p.vy;
          } else {
            // Movimiento relajado flotante cuando no está en pantalla
            p.wanderAngle += p.wanderSpeed;
            const targetWanderX = p.originX + Math.cos(p.wanderAngle) * p.wanderRadius;
            const targetWanderY = p.originY + Math.sin(p.wanderAngle) * (p.wanderRadius * 0.7);

            p.x += (targetWanderX - p.x) * 0.05;
            p.y += (targetWanderY - p.y) * 0.05;
          }

          // Dibujar el grano de arena
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

  // Eventos de ratón y táctiles
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

      {/* Resplandor ambiental cinematográfico sutil de fondo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08),transparent_70%)]"
      />

      {/* Firma Editorial del Autor (Fade-in suave con Framer Motion) */}
      <div className="absolute bottom-6 md:bottom-8 z-20 pointer-events-none">
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
              className="flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-slate-300/40 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs shadow-2xs"
            >
              <span className="w-4 h-[1px] bg-slate-400 dark:bg-slate-600" />
              <span className="text-xs md:text-sm font-medium tracking-widest uppercase text-slate-600 dark:text-slate-400 font-mono">
                — {authorName}
              </span>
              <span className="w-4 h-[1px] bg-slate-400 dark:bg-slate-600" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
