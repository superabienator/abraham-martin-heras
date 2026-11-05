"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, useMotionValue, useSpring, animate, AnimatePresence } from "framer-motion";
import type { CertificationItem } from "@/data/cv-data";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Boxes,
  LayoutGrid,
  ExternalLink,
  ShieldCheck,
  Search,
} from "lucide-react";

interface CertificationsCylinderProps {
  certifications: CertificationItem[];
}

export function CertificationsCylinder({ certifications }: CertificationsCylinderProps) {
  const [viewMode, setViewMode] = useState<"3d" | "grid">("3d");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchGrid, setSearchGrid] = useState("");

  const containerRef = useRef<HTMLDivElement | null>(null);
  const dragStartXRef = useRef(0);
  const dragStartRotRef = useRef(0);
  const autoRotateTimerRef = useRef<number | null>(null);

  const total = certifications.length;
  const angleStep = 360 / Math.max(total, 1);

  // Dimensiones de las tarjetas optimizadas para el escenario 3D
  const cardWidth = 280;
  const cardHeight = 220;

  // Radio cilíndrico exacto según perímetro circular: radio = (cardWidth * total) / (2 * PI)
  // Garantiza que las tarjetas respiren sin colisionar ni solaparse en el centro
  const cylinderRadius = Math.max(380, Math.round((cardWidth * total) / (2 * Math.PI)));

  // Framer Motion motionValue & spring de inercia y amortiguación natural (300 stiffness, 30 damping)
  const rotation = useMotionValue(0);
  const smoothRotation = useSpring(rotation, {
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  });

  // Rotar hacia un índice específico por el camino más corto con inercia suave
  const rotateToIndex = useCallback(
    (targetIndex: number) => {
      const currentRot = rotation.get();
      const currentTurn = Math.round(currentRot / 360) * 360;
      let targetRot = currentTurn - targetIndex * angleStep;

      // Camino angular más corto (+/- 180 deg)
      while (targetRot - currentRot > 180) targetRot -= 360;
      while (targetRot - currentRot < -180) targetRot += 360;

      animate(rotation, targetRot, {
        type: "spring",
        stiffness: 300,
        damping: 30,
      });
      setActiveIndex(targetIndex);
    },
    [angleStep, rotation]
  );

  const handlePrev = useCallback(() => {
    const nextIdx = (activeIndex - 1 + total) % total;
    rotateToIndex(nextIdx);
  }, [activeIndex, total, rotateToIndex]);

  const handleNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % total;
    rotateToIndex(nextIdx);
  }, [activeIndex, total, rotateToIndex]);

  // Auto-rotación sutil y continua cuando no hay interacción activa
  useEffect(() => {
    if (viewMode !== "3d" || isHovered || isDragging) return;

    let lastTime = performance.now();
    const speed = 0.025; // Velocidad de órbita suave

    const loop = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      const current = rotation.get();
      const updated = current - speed * (delta / 16.67);
      rotation.set(updated);

      // Calcular qué tarjeta está actualmente en el frente (0 deg)
      const normalizedRot = ((-updated % 360) + 360) % 360;
      const nearestIdx = Math.round(normalizedRot / angleStep) % total;
      if (nearestIdx !== activeIndex) {
        setActiveIndex(nearestIdx);
      }

      autoRotateTimerRef.current = requestAnimationFrame(loop);
    };

    autoRotateTimerRef.current = requestAnimationFrame(loop);

    return () => {
      if (autoRotateTimerRef.current) {
        cancelAnimationFrame(autoRotateTimerRef.current);
      }
    };
  }, [viewMode, isHovered, isDragging, rotation, angleStep, total, activeIndex]);

  // Gestos de arrastre táctil / ratón (Drag / Swipe) con sensibilidad amortiguada 1:1
  const handlePointerDown = (e: React.PointerEvent) => {
    if (viewMode !== "3d") return;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartRotRef.current = rotation.get();
    if (autoRotateTimerRef.current) cancelAnimationFrame(autoRotateTimerRef.current);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartXRef.current;
    // Sensibilidad calibrada para seguimiento natural y fiel a la mano (delta * 0.25)
    const sensitivity = 0.25;
    const newRot = dragStartRotRef.current + deltaX * sensitivity;
    rotation.set(newRot);

    const normalizedRot = ((-newRot % 360) + 360) % 360;
    const nearestIdx = Math.round(normalizedRot / angleStep) % total;
    if (nearestIdx !== activeIndex) {
      setActiveIndex(nearestIdx);
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Snap suave con inercia y amortiguación natural al soltar
    const current = rotation.get();
    const nearestStep = Math.round(-current / angleStep);
    const snappedRot = -nearestStep * angleStep;

    animate(rotation, snappedRot, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });

    const normalizedIdx = ((nearestStep % total) + total) % total;
    setActiveIndex(normalizedIdx);
  };

  const activeCert = certifications[activeIndex] || certifications[0];

  // Helper para detectar insignias especiales (horas o notas)
  const getSpecialBadge = (cert: CertificationItem) => {
    if (cert.title.includes("260h")) return "⏱ 260 horas lectivas";
    if (cert.title.includes("8,80")) return "⭐ Nota PAU: 8,80";
    if (cert.title.includes("Responsive Web") || cert.id.includes("freecodecamp")) return "💻 Web Dev Certified";
    if (cert.id.includes("perplexity")) return "🔍 AI Search & Inferencia";
    if (cert.id.includes("toma-decisiones")) return "🎯 Dirección Estratégica";
    if (cert.credentialCode?.startsWith("HSM") || cert.issuer.includes("Google")) return "Google Verified";
    if (cert.category) return cert.category;
    return null;
  };

  // Categorías únicas para filtro en vista de cuadrícula
  const categories = useMemo(() => {
    const set = new Set<string>();
    certifications.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set);
  }, [certifications]);

  // Filtrado de cuadrícula
  const filteredGridCerts = useMemo(() => {
    return certifications.filter((c) => {
      const matchCat = filterCategory === "all" || c.category === filterCategory;
      const matchSearch =
        searchGrid.trim() === "" ||
        c.title.toLowerCase().includes(searchGrid.toLowerCase()) ||
        c.issuer.toLowerCase().includes(searchGrid.toLowerCase()) ||
        c.skillsCovered.some((s) => s.toLowerCase().includes(searchGrid.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [certifications, filterCategory, searchGrid]);

  return (
    <div className="space-y-6">
      {/* 1. Barra Superior con Título y Switch de Accesibilidad RRHH */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-200 dark:border-cyan-500/30 bg-holographic-pill shadow-xs shrink-0">
            <Award className="h-5 w-5 text-violet-700 dark:text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Certificaciones Oficiales Verificadas
              </h3>
              <span className="rounded-full border border-violet-200/80 dark:border-cyan-500/30 bg-holographic-pill px-2.5 py-0.5 font-mono text-[11px] font-semibold text-slate-800 dark:text-cyan-300">
                {total} títulos
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Ciberseguridad (260h), Programación Python (260h), IA Generativa y PAU +25 (8,80)
            </p>
          </div>
        </div>

        {/* Switch RRHH: Cilindro 3D vs Cuadrícula Compacta */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden sm:inline">
            Modo de visualización:
          </span>
          <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-white/10">
            <button
              type="button"
              onClick={() => setViewMode("3d")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "3d"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Vista 3D Cilíndrica Interactiva"
            >
              <Boxes className="h-3.5 w-3.5 text-violet-600 dark:text-cyan-400" />
              <span>Cilindro 3D</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Vista Cuadrícula Desplegada para RRHH"
            >
              <LayoutGrid className="h-3.5 w-3.5 text-cyan-600 dark:text-violet-400" />
              <span>Cuadrícula</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MODO A: CARRUSEL CILÍNDRICO 3D */}
      {viewMode === "3d" && (
        <div className="space-y-6">
          {/* Escenario 3D con Perspectiva CSS y Touch/Mouse Drag */}
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative h-[360px] sm:h-[390px] w-full overflow-hidden rounded-2xl border border-slate-200/80 dark:border-white/10 bg-gradient-to-b from-slate-50/70 via-white/80 to-slate-100/60 dark:from-slate-950/80 dark:via-slate-900/60 dark:to-slate-950/90 select-none cursor-grab active:cursor-grabbing transform-gpu"
            style={{
              perspective: "1200px",
              perspectiveOrigin: "center 50%",
            }}
          >
            {/* Halo sutil de iluminación en el fondo del escenario */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[260px] w-[500px] rounded-full bg-gradient-to-tr from-cyan-400/10 via-violet-500/15 to-emerald-400/10 blur-3xl opacity-70"
            />

            {/* Cilindro Giratorio 3D */}
            <motion.div
              style={{
                rotateY: smoothRotation,
                transformStyle: "preserve-3d",
                z: -cylinderRadius,
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none"
            >
              {certifications.map((cert, index) => {
                // Cálculo de distancia angular respecto al centro frontal
                const rawDiff = Math.abs(index - activeIndex);
                const shortestDist = Math.min(rawDiff, total - rawDiff);
                const relativeAngle = shortestDist * angleStep;
                const cardAngle = index * angleStep;

                // Las tarjetas cuyo ángulo relativo supere los 75 grados se ocultan totalmente
                const isHidden = relativeAngle > 75;
                const isFront = shortestDist === 0;
                const isImmediateNeighbor = shortestDist === 1;
                const isSecondNeighbor = shortestDist === 2;
                const isThirdNeighbor = shortestDist === 3;

                return (
                  <div
                    key={cert.id}
                    onClick={() => rotateToIndex(index)}
                    style={
                      {
                        width: `${cardWidth}px`,
                        height: `${cardHeight}px`,
                        transform: `rotateY(${cardAngle}deg) translateZ(${cylinderRadius}px)${isFront ? " scale(1)" : ""}`,
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        visibility: isHidden ? "hidden" : "visible",
                      } as React.CSSProperties
                    }
                    className={`absolute left-1/2 top-1/2 -ml-[140px] -mt-[110px] rounded-2xl p-5 transition-all duration-300 ${
                      isHidden
                        ? "opacity-0 pointer-events-none invisible z-0"
                        : isFront
                        ? "opacity-100 pointer-events-auto z-50 scale-100 border-2 border-violet-500/90 dark:border-cyan-400 bg-white dark:bg-slate-900 shadow-[0_14px_45px_rgba(139,92,246,0.25)] dark:shadow-[0_14px_45px_rgba(6,182,212,0.35)] cursor-pointer"
                        : isImmediateNeighbor
                        ? "opacity-80 pointer-events-auto z-40 scale-[0.98] border border-slate-200/90 dark:border-white/15 bg-white dark:bg-slate-900 hover:opacity-100 shadow-sm cursor-pointer"
                        : isSecondNeighbor
                        ? "opacity-50 pointer-events-auto z-30 scale-[0.95] border border-slate-200/60 dark:border-white/10 bg-white dark:bg-slate-900 hover:opacity-75 shadow-xs cursor-pointer"
                        : isThirdNeighbor
                        ? "opacity-25 pointer-events-auto z-20 scale-[0.92] border border-slate-200/40 dark:border-white/5 bg-white dark:bg-slate-900 cursor-pointer"
                        : "opacity-10 pointer-events-auto z-10 scale-[0.88] border border-slate-200/20 dark:border-white/5 bg-white dark:bg-slate-900 cursor-pointer"
                    }`}
                  >
                    <div className="flex h-full flex-col justify-between">
                      {/* Cabecera de la Tarjeta */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold truncate ${
                              isFront
                                ? "bg-violet-100 dark:bg-cyan-950/80 text-violet-800 dark:text-cyan-300 border border-violet-200 dark:border-cyan-500/30"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {cert.category}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            {cert.year}
                          </span>
                        </div>

                        <h4
                          className={`text-xs sm:text-sm font-bold line-clamp-2 leading-snug ${
                            isFront ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {cert.title}
                        </h4>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {cert.issuer}
                        </p>
                      </div>

                      {/* Pie de la Tarjeta con ID y Verificación */}
                      <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px]">
                        <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" />
                          <span>Verificado</span>
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          #{index + 1} / {total}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Controles de Navegación Superpuestos (Flechas de Precisión) */}
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="pointer-events-auto h-9 w-9 rounded-full border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer"
                title="Certificado Anterior"
                aria-label="Certificado Anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>

            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="pointer-events-auto h-9 w-9 rounded-full border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-center text-slate-700 dark:text-slate-200 hover:scale-110 active:scale-95 transition-all shadow-md cursor-pointer"
                title="Certificado Siguiente"
                aria-label="Certificado Siguiente"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Píldora inferior de ayuda al reclutador */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none flex items-center gap-2 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md px-3.5 py-1 text-[11px] font-mono text-slate-600 dark:text-slate-400 shadow-xs">
              <Sparkles className="h-3 w-3 text-violet-500 dark:text-cyan-400" />
              <span>Arrastra horizontalmente para girar suavemente</span>
            </div>
          </div>

          {/* 3. BARRA DE NAVEGACIÓN Y CONTADOR ACTIVO */}
          <div className="flex items-center justify-between px-2">
            <button
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Anterior</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                Certificado {activeIndex + 1} de {total}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="rounded-full bg-violet-100 dark:bg-cyan-950/80 text-violet-800 dark:text-cyan-300 px-2 py-0.5 font-mono text-[10px] font-semibold">
                {activeCert.category}
              </span>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <span>Siguiente</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* 4. FICHA EJECUTIVA DEL CERTIFICADO ACTIVO */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCert.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="rounded-2xl border border-violet-200/90 dark:border-cyan-500/30 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-5 sm:p-6 shadow-md shadow-violet-500/5 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-violet-200 dark:border-cyan-500/30 bg-holographic-pill px-2.5 py-0.5 font-mono text-xs font-semibold text-slate-800 dark:text-cyan-300">
                      {activeCert.category}
                    </span>
                    {getSpecialBadge(activeCert) && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                        <Clock className="h-3 w-3" />
                        <span>{getSpecialBadge(activeCert)}</span>
                      </span>
                    )}
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      Año: {activeCert.year}
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    {activeCert.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    Emisor Oficial: <strong className="font-semibold text-slate-800 dark:text-slate-200">{activeCert.issuer}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 px-3 py-1 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Acreditación Verificada</span>
                  </span>
                </div>
              </div>

              {/* Habilidades Validadas */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Competencias & Tecnologías Acreditadas:
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeCert.skillsCovered.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-slate-200/90 dark:border-white/10 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-2xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Código de Credencial o Enlace Oficial */}
              {activeCert.credentialCode && (
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-white/5">
                  <span className="truncate max-w-md">
                    Código de Registro: {activeCert.credentialCode}
                  </span>
                  {activeCert.credentialCode.startsWith("http") && (
                    <a
                      href={activeCert.credentialCode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-violet-600 dark:text-cyan-400 hover:underline"
                    >
                      <span>Verificar en plataforma oficial</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* 3. MODO B: CUADRÍCULA COMPACTA DESPLEGADA (ACCESIBILIDAD RRHH) */}
      {viewMode === "grid" && (
        <div className="space-y-4">
          {/* Filtros Rápidos de Categoría y Buscador */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/80 dark:border-white/10">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFilterCategory("all")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  filterCategory === "all"
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900"
                }`}
              >
                Todas ({certifications.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilterCategory(cat)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                    filterCategory === cat
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative min-w-[220px]">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchGrid}
                onChange={(e) => setSearchGrid(e.target.value)}
                placeholder="Buscar por título o emisor..."
                className="w-full rounded-lg border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-950 py-1.5 pl-8 pr-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Grid de Tarjetas Compactas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredGridCerts.map((cert) => (
              <div
                key={cert.id}
                className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-slate-900/80 p-4 space-y-3 shadow-xs hover:border-violet-300 dark:hover:border-cyan-400/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md border border-violet-200 dark:border-cyan-500/30 bg-holographic-pill px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-800 dark:text-cyan-300 truncate">
                      {cert.category}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {cert.year}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {cert.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                    {cert.issuer}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/5">
                  <div className="flex flex-wrap gap-1">
                    {cert.skillsCovered.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-600 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                    {cert.skillsCovered.length > 3 && (
                      <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-500">
                        +{cert.skillsCovered.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                    <span>✔ Verificado</span>
                    {cert.credentialCode && <span>ID: {cert.credentialCode.slice(0, 14)}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredGridCerts.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-500">
              No se han encontrado certificados con ese término de búsqueda.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
