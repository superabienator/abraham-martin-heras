"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import { Volume2, VolumeX, RotateCcw } from "lucide-react";

type AnimationStage = "words" | "collapsing" | "converging" | "nebula" | "settled";

export function DynamicIdentityHero() {
  const { language } = useLanguage();
  const [stage, setStage] = useState<AnimationStage>("words");
  const [isMuted, setIsMuted] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const startTimeRef = useRef<number>(0);

  // Sound playback helper: starts synchronized from given offset (or 0.0s)
  const playAudio = useCallback((offsetSeconds = 0) => {
    if (audioRef.current && !isMuted) {
      audioRef.current.currentTime = Math.max(0, offsetSeconds);
      audioRef.current.volume = 0.85;
      audioRef.current.play().then(() => {
        setAudioUnlocked(true);
      }).catch(() => {
        // Autoplay policy prevented playback until user interaction
        setAudioUnlocked(false);
      });
    }
  }, [isMuted]);

  const clearTimers = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  // Replay sequence: starts sound and animation simultaneously from 0.0s
  const handleReplay = useCallback(() => {
    clearTimers();
    if (typeof window !== "undefined") {
      startTimeRef.current = performance.now();
    }
    setStage("words");

    // 0.0s: Start sound immediately with the visual intro
    playAudio(0);

    // 1.8s: Suffixes gently dissolve while preserving full word legibility
    const t1 = setTimeout(() => {
      setStage("collapsing");
    }, 1800);

    // 2.7s: Initials slide inwards towards center
    const t2 = setTimeout(() => {
      setStage("converging");
    }, 2700);

    // 3.4s: Chromatic Nebula Cloud erupts at audio impact
    const t3 = setTimeout(() => {
      setStage("nebula");
    }, 3400);

    // 4.3s: Cloud clears, revealing the user's original AMH Logo
    const t4 = setTimeout(() => {
      setStage("settled");
    }, 4300);

    timeoutsRef.current = [t1, t2, t3, t4];
  }, [playAudio]);

  // Initial progression on mount: attempt immediate sound playback at 0.0s
  useEffect(() => {
    startTimeRef.current = performance.now();
    playAudio(0);

    const t1 = setTimeout(() => {
      setStage("collapsing");
    }, 1800);

    const t2 = setTimeout(() => {
      setStage("converging");
    }, 2700);

    const t3 = setTimeout(() => {
      setStage("nebula");
    }, 3400);

    const t4 = setTimeout(() => {
      setStage("settled");
    }, 4300);

    timeoutsRef.current = [t1, t2, t3, t4];

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [playAudio]);

  // Natural gesture unlock: any micro-movement (mouse move, hover, scroll, touch)
  // immediately activates and synchronizes the audio if browser blocked initial autoplay
  useEffect(() => {
    const unlockOnNaturalGesture = () => {
      if (audioRef.current && audioRef.current.paused && !isMuted) {
        const elapsed = (performance.now() - startTimeRef.current) / 1000;
        if (elapsed < 6) {
          audioRef.current.currentTime = Math.max(0, elapsed);
          audioRef.current.play().then(() => {
            setAudioUnlocked(true);
          }).catch(() => {});
        }
      }
    };

    const naturalEvents = [
      "pointermove",
      "mousemove",
      "pointerenter",
      "scroll",
      "wheel",
      "pointerdown",
      "touchstart",
      "keydown",
    ];

    naturalEvents.forEach((ev) =>
      window.addEventListener(ev, unlockOnNaturalGesture, { passive: true, once: true })
    );

    return () => {
      naturalEvents.forEach((ev) =>
        window.removeEventListener(ev, unlockOnNaturalGesture)
      );
    };
  }, [isMuted]);

  const toggleSound = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.play().catch(() => {});
      }
    } else {
      setIsMuted(true);
      if (audioRef.current) {
        audioRef.current.muted = true;
        audioRef.current.pause();
      }
    }
  };

  const isCollapsed = stage === "collapsing" || stage === "converging" || stage === "nebula" || stage === "settled";
  const isCloudActive = stage === "nebula";
  const isSettled = stage === "settled";
  const isEs = language === "es";

  return (
    <section aria-label="AMH Identity Formation" className="relative w-full pt-4 pb-6 flex flex-col items-center justify-center text-center">
      {/* Hidden audio element loading the formation sound track */}
      <audio
        ref={audioRef}
        src="/amh-audio.mp4"
        preload="auto"
        muted={isMuted}
      />

      {/* Main Kinetic Stage: Centered Formation Canvas */}
      <div className="relative flex flex-col items-center justify-center min-h-[160px] sm:min-h-[190px] w-full max-w-4xl px-2 sm:px-4 select-none">
        
        {/* =========================================================================
            CHROMATIC NEBULA CLOUD (Nube de Color Cósmica)
            Erupts at the collision center and parts to reveal the user's original AMH Logo
           ========================================================================= */}
        <AnimatePresence>
          {(isCloudActive || isSettled) && (
            <motion.div
              key="chromatic-nebula"
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{
                scale: isCloudActive ? [0.3, 1.45, 1.15] : 1.0,
                opacity: isCloudActive ? [0, 0.95, 0.8] : 0.45,
                rotate: isCloudActive ? [0, 45, 90] : 0,
              }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{
                duration: isCloudActive ? 0.9 : 0.7,
                ease: "easeOut",
              }}
              className="pointer-events-none absolute inset-0 m-auto h-44 w-44 sm:h-64 sm:w-64 rounded-full"
            >
              {/* Outer Cyan / Emerald Bloom */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 via-teal-500 to-emerald-400 blur-3xl opacity-75 animate-pulse" />
              {/* Mid Layer Royal / Indigo Mist */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 blur-2xl opacity-80" />
              {/* Core Deep Violet Flame */}
              <div className="absolute inset-6 rounded-full bg-gradient-to-b from-purple-500 via-violet-700 to-indigo-800 blur-xl opacity-90" />
              
              {/* Expanding Shockwave Ring */}
              {isCloudActive && (
                <motion.div
                  initial={{ scale: 0.6, opacity: 0.9 }}
                  animate={{ scale: 2.2, opacity: 0 }}
                  transition={{ duration: 0.85, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full border-2 border-cyan-300 dark:border-cyan-400"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* =========================================================================
            PHASE 1 & 2: "Abraham  Martín  Heras" -> Converging Initials "A M H"
            Full words clearly visible with zero clipping!
           ========================================================================= */}
        <AnimatePresence mode="wait">
          {!isSettled && (
            <motion.div
              key="words-letters-stage"
              initial={{ opacity: 0, y: 12 }}
              animate={{
                opacity: isCloudActive ? 0 : 1,
                scale: isCloudActive ? 0.85 : 1,
                y: 0,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className={`flex items-center justify-center flex-wrap transition-all duration-700 ease-out ${
                stage === "converging" || stage === "nebula" ? "gap-1.5 sm:gap-2.5" : "gap-3 sm:gap-6 md:gap-8"
              }`}
            >
              {/* WORD 1: Abraham (Full word visible, initial A in Violet) */}
              <div className="inline-flex items-baseline font-brand">
                <span className="font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 dark:from-violet-400 dark:via-purple-400 dark:to-indigo-300 bg-clip-text text-transparent drop-shadow-xs shrink-0">
                  A
                </span>
                <motion.span
                  initial={{ opacity: 1, scaleX: 1 }}
                  animate={{
                    opacity: isCollapsed ? 0 : 1,
                    scaleX: isCollapsed ? 0 : 1,
                    width: isCollapsed ? 0 : "auto",
                  }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  style={{ originX: 0 }}
                  className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-slate-800 dark:text-slate-100 whitespace-nowrap overflow-hidden inline-block"
                >
                  braham
                </motion.span>
              </div>

              {/* WORD 2: Martín (Full word visible, initial M in Indigo / Cobalt Blue) */}
              <div className="inline-flex items-baseline font-brand">
                <span className="font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-300 bg-clip-text text-transparent drop-shadow-xs shrink-0">
                  M
                </span>
                <motion.span
                  initial={{ opacity: 1, scaleX: 1 }}
                  animate={{
                    opacity: isCollapsed ? 0 : 1,
                    scaleX: isCollapsed ? 0 : 1,
                    width: isCollapsed ? 0 : "auto",
                  }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.04 }}
                  style={{ originX: 0 }}
                  className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-slate-800 dark:text-slate-100 whitespace-nowrap overflow-hidden inline-block"
                >
                  artín
                </motion.span>
              </div>

              {/* WORD 3: Heras (Full word visible, initial H in Ocean Cyan / Teal) */}
              <div className="inline-flex items-baseline font-brand">
                <span className="font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600 dark:from-cyan-400 dark:via-teal-400 dark:to-emerald-300 bg-clip-text text-transparent drop-shadow-xs shrink-0">
                  H
                </span>
                <motion.span
                  initial={{ opacity: 1, scaleX: 1 }}
                  animate={{
                    opacity: isCollapsed ? 0 : 1,
                    scaleX: isCollapsed ? 0 : 1,
                    width: isCollapsed ? 0 : "auto",
                  }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                  style={{ originX: 0 }}
                  className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-slate-800 dark:text-slate-100 whitespace-nowrap overflow-hidden inline-block"
                >
                  eras
                </motion.span>
              </div>
            </motion.div>
          )}

          {/* =========================================================================
              PHASE 3: User's Original AMH Logo Emerges from Parted Nebula
             ========================================================================= */}
          {isSettled && (
            <motion.div
              key="settled-logo"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 18,
              }}
              className="relative flex items-center justify-center group"
            >
              {/* Luminous Organic Glow Behind Logo */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-violet-500/25 via-blue-500/25 to-teal-400/25 blur-xl opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Centered User's Original AMH Logo Card Badge */}
              <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 items-center justify-center rounded-3xl border border-slate-200/90 dark:border-cyan-500/30 bg-white/95 dark:bg-slate-900/95 shadow-xl shadow-violet-500/10 dark:shadow-[0_15px_40px_rgba(6,182,212,0.15)] backdrop-blur-md overflow-hidden transform-gpu transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/amh-logo-card.png"
                  alt="Abraham Martín Heras AMH Logo"
                  width={128}
                  height={128}
                  className="h-full w-full object-contain p-1"
                  priority
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Discreet Interactive Controls Toolbar (Sound & Replay) */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {/* Replay Button */}
          <button
            type="button"
            onClick={handleReplay}
            title={isEs ? "Repetir animación de formación" : "Replay formation animation"}
            className="group flex items-center gap-1.5 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-slate-900/75 backdrop-blur-md px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-violet-400 dark:hover:border-cyan-400 hover:text-violet-700 dark:hover:text-cyan-300 transition-all cursor-pointer shadow-2xs"
          >
            <RotateCcw className="h-3 w-3 text-slate-500 dark:text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-[11px] font-sans">{isEs ? "Repetir Formación" : "Replay Formation"}</span>
          </button>

          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={toggleSound}
            title={isMuted ? (isEs ? "Activar sonido" : "Unmute sound") : (isEs ? "Silenciar" : "Mute")}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all cursor-pointer shadow-2xs ${
              isMuted
                ? "border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-slate-900/75 text-slate-500 dark:text-slate-400"
                : "border-cyan-300/80 dark:border-cyan-500/40 bg-cyan-50/80 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-300"
            }`}
          >
            {isMuted ? (
              <>
                <VolumeX className="h-3 w-3 text-slate-400" />
                <span className="text-[11px] font-sans">{isEs ? "Sin sonido" : "Muted"}</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3 w-3 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                <span className="text-[11px] font-sans">{isEs ? "Sonido ON" : "Sound ON"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
