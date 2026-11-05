"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

function subscribePointerFine(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(pointer: fine)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getPointerFineSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}

function getPointerFineServerSnapshot() {
  return false;
}

export function CustomCursor() {
  const isPointerFine = useSyncExternalStore(
    subscribePointerFine,
    getPointerFineSnapshot,
    getPointerFineServerSnapshot
  );

  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Coordenadas en tiempo real sin re-renderizar React (60 FPS puros)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Física de muelles calibrada: respuesta ágil y fluida sin desalinearse del objetivo
  const springConfig = { stiffness: 450, damping: 28, mass: 0.35 };
  const haloX = useSpring(mouseX, springConfig);
  const haloY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (!isPointerFine) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Detección contextual de elementos interactivos
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactiveEl = target.closest(
        'a, button, input, textarea, select, [role="button"], [role="tab"], [data-cursor="interactive"]'
      );

      setIsHovered(Boolean(interactiveEl));
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isPointerFine, mouseX, mouseY]);

  if (!isPointerFine) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none"
    >
      {/* 
        1. Anillo Seguidor de Alta Precisión (Precision Reticle Ring)
        - 100% Transparente por dentro (CERO difuminación, CERO pérdida de nitidez en textos como ES / EN)
        - Borde fino y luminoso que encuadra el objetivo con elegancia arquitectónica
      */}
      <motion.div
        style={{
          x: haloX,
          y: haloY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isPressed ? 0.75 : isHovered ? 1.35 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          scale: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.15 },
        }}
        className={`fixed top-0 left-0 h-7 w-7 rounded-full bg-transparent transition-colors duration-150 ${
          isHovered
            ? "border-[1.5px] border-violet-500 dark:border-cyan-400 shadow-[0_0_12px_rgba(139,92,246,0.4)] dark:shadow-[0_0_12px_rgba(6,182,212,0.45)]"
            : "border border-slate-400/50 dark:border-white/25"
        }`}
      />

      {/* 
        2. Micro-Punto Central de Apuntado (Instant Lead Dot)
        - Sigue al cursor 1:1 sin retardo para garantizar máxima precisión de cliqueo
        - Nitidez absoluta y contraste constante
      */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isPressed ? 0.6 : isHovered ? 1.15 : 1,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          scale: { duration: 0.12 },
          opacity: { duration: 0.12 },
        }}
        className={`fixed top-0 left-0 h-1.5 w-1.5 rounded-full transition-colors duration-150 ${
          isHovered
            ? "bg-violet-600 dark:bg-cyan-300 ring-2 ring-violet-400/40 dark:ring-cyan-400/40"
            : "bg-slate-900 dark:bg-white ring-1 ring-white/60 dark:ring-slate-900/60"
        }`}
      />
    </div>
  );
}
