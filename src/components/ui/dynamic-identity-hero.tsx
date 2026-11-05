"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import { Volume2, VolumeX, RotateCcw, Sparkles } from "lucide-react";

type AnimationStage = "words" | "collapsing" | "converging" | "fusing" | "settled";

export function DynamicIdentityHero() {
  const { language } = useLanguage();
  const [stage, setStage] = useState<AnimationStage>("words");
  const [isMuted, setIsMuted] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Sound playback helper
  const playAudio = useCallback(() => {
    if (audioRef.current && !isMuted) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.75;
      audioRef.current.play().then(() => {
        setAudioUnlocked(true);
      }).catch(() => {
        // Autoplay policy prevented playback until user interaction
        setAudioUnlocked(false);
      });
    }
  }, [isMuted]);

  // Clear pending timers
  const clearTimers = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  // Run the full sequence upon replay button click
  const handleReplay = useCallback(() => {
    clearTimers();
    setStage("words");

    const t1 = setTimeout(() => {
      setStage("collapsing");
    }, 1500);

    const t2 = setTimeout(() => {
      setStage("converging");
      playAudio();
    }, 2600);

    const t3 = setTimeout(() => {
      setStage("fusing");
    }, 3600);

    const t4 = setTimeout(() => {
      setStage("settled");
    }, 4400);

    timeoutsRef.current = [t1, t2, t3, t4];
  }, [playAudio]);

  // Schedule initial progression on mount without synchronous setState in effect body
  useEffect(() => {
    const t1 = setTimeout(() => {
      setStage("collapsing");
    }, 1500);

    const t2 = setTimeout(() => {
      setStage("converging");
      playAudio();
    }, 2600);

    const t3 = setTimeout(() => {
      setStage("fusing");
    }, 3600);

    const t4 = setTimeout(() => {
      setStage("settled");
    }, 4400);

    timeoutsRef.current = [t1, t2, t3, t4];

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [playAudio]);

  // Audio unlock on first user click if browser blocked autoplay
  useEffect(() => {
    const unlockOnGesture = () => {
      if (!audioUnlocked && audioRef.current) {
        audioRef.current.play().then(() => {
          setAudioUnlocked(true);
        }).catch(() => {});
      }
      window.removeEventListener("pointerdown", unlockOnGesture);
    };
    window.addEventListener("pointerdown", unlockOnGesture, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlockOnGesture);
    };
  }, [audioUnlocked]);

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

  const isCollapsed = stage === "collapsing" || stage === "converging" || stage === "fusing" || stage === "settled";
  const isMerged = stage === "fusing" || stage === "settled";
  const isEs = language === "es";

  return (
    <section aria-label="AMH Identity Formation" className="relative w-full pt-4 pb-8 flex flex-col items-center justify-center text-center">
      {/* Hidden Audio element pointing to original sound */}
      <audio
        ref={audioRef}
        src="/amh-formation.mp4"
        preload="auto"
        muted={isMuted}
      />

      {/* Main Kinetic Stage: Centered Formation Canvas */}
      <div className="relative flex flex-col items-center justify-center min-h-[160px] sm:min-h-[190px] w-full max-w-4xl px-4 select-none">
        <AnimatePresence mode="wait">
          {!isMerged ? (
            /* =========================================================================
               PHASE A: "Abraham  Martín  Heras" condensing into initials "A M H"
               ========================================================================= */
            <motion.div
              key="dynamic-words-container"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className={`flex items-center justify-center flex-wrap transition-all duration-700 ease-out ${
                stage === "converging" ? "gap-0.5" : "gap-4 sm:gap-7"
              }`}
            >
              {/* Word 1: Abraham (Initial A - Violet) */}
              <div className="inline-flex items-baseline overflow-hidden">
                <span className="font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight bg-gradient-to-br from-purple-600 to-violet-700 dark:from-purple-400 dark:to-violet-400 bg-clip-text text-transparent drop-shadow-sm">
                  A
                </span>
                <motion.span
                  initial={{ opacity: 1, maxWidth: "160px" }}
                  animate={{
                    opacity: isCollapsed ? 0 : 1,
                    maxWidth: isCollapsed ? "0px" : "160px",
                    letterSpacing: isCollapsed ? "-0.2em" : "0em",
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-slate-800 dark:text-slate-100 whitespace-nowrap overflow-hidden inline-block"
                >
                  braham
                </motion.span>
              </div>

              {/* Word 2: Martín (Initial M - Indigo / Royal Blue) */}
              <div className="inline-flex items-baseline overflow-hidden">
                <span className="font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight bg-gradient-to-br from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent drop-shadow-sm">
                  M
                </span>
                <motion.span
                  initial={{ opacity: 1, maxWidth: "160px" }}
                  animate={{
                    opacity: isCollapsed ? 0 : 1,
                    maxWidth: isCollapsed ? "0px" : "160px",
                    letterSpacing: isCollapsed ? "-0.2em" : "0em",
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                  className="font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-slate-800 dark:text-slate-100 whitespace-nowrap overflow-hidden inline-block"
                >
                  artín
                </motion.span>
              </div>

              {/* Word 3: Heras (Initial H - Cyan / Teal) */}
              <div className="inline-flex items-baseline overflow-hidden">
                <span className="font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight bg-gradient-to-br from-cyan-600 to-teal-600 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent drop-shadow-sm">
                  H
                </span>
                <motion.span
                  initial={{ opacity: 1, maxWidth: "160px" }}
                  animate={{
                    opacity: isCollapsed ? 0 : 1,
                    maxWidth: isCollapsed ? "0px" : "160px",
                    letterSpacing: isCollapsed ? "-0.2em" : "0em",
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-slate-800 dark:text-slate-100 whitespace-nowrap overflow-hidden inline-block"
                >
                  eras
                </motion.span>
              </div>
            </motion.div>
          ) : (
            /* =========================================================================
               PHASE B: Unified Official AMH Favicon / Logo as Central Title Anchor
               ========================================================================= */
            <motion.div
              key="settled-logo-container"
              initial={{ scale: 0.75, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="relative flex flex-col items-center justify-center group"
            >
              {/* Luminous Organic Glow Behind Logo */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-violet-500/25 via-blue-500/25 to-teal-400/25 blur-2xl opacity-75 dark:opacity-90 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Central Official AMH Logo Favicon Badge */}
              <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 items-center justify-center rounded-3xl border border-violet-200/90 dark:border-cyan-500/30 bg-white/95 dark:bg-slate-900/95 shadow-xl shadow-violet-500/10 dark:shadow-[0_15px_40px_rgba(6,182,212,0.15)] backdrop-blur-md overflow-hidden transform-gpu transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo-amh.png"
                  alt="Abraham Martín Heras AMH Logo"
                  width={128}
                  height={128}
                  className="h-full w-full object-contain p-2"
                  priority
                />

                {/* Subtle Iridescent Border Ring */}
                <div className="absolute inset-0 rounded-3xl border border-white/60 dark:border-white/10 pointer-events-none" />
              </div>

              {/* Status Pill on Settled Logo */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-3.5 inline-flex items-center gap-1.5 rounded-full border border-violet-200/80 dark:border-cyan-500/30 bg-white/80 dark:bg-slate-950/80 px-3 py-0.5 text-[11px] font-mono font-semibold text-slate-800 dark:text-slate-200 shadow-2xs"
              >
                <Sparkles className="h-3 w-3 text-cyan-500 animate-pulse" />
                <span className="tracking-wide">AMH · LOGO IDENTIDAD</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Discreet Interactive Controls Toolbar (Sound & Replay) */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {/* Replay Button */}
          <button
            type="button"
            onClick={handleReplay}
            title={isEs ? "Repetir animación de formación" : "Replay formation animation"}
            className="group flex items-center gap-1.5 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-violet-400 dark:hover:border-cyan-400 hover:text-violet-700 dark:hover:text-cyan-300 transition-all cursor-pointer shadow-2xs"
          >
            <RotateCcw className="h-3 w-3 text-slate-500 dark:text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-[11px]">{isEs ? "Repetir Formación" : "Replay Formation"}</span>
          </button>

          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={toggleSound}
            title={isMuted ? (isEs ? "Activar sonido" : "Unmute sound") : (isEs ? "Silenciar" : "Mute")}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all cursor-pointer shadow-2xs ${
              isMuted
                ? "border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 text-slate-500 dark:text-slate-400"
                : "border-cyan-300/80 dark:border-cyan-500/40 bg-cyan-50/70 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-300"
            }`}
          >
            {isMuted ? (
              <>
                <VolumeX className="h-3 w-3 text-slate-400" />
                <span className="text-[11px]">{isEs ? "Sin sonido" : "Muted"}</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3 w-3 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                <span className="text-[11px]">{isEs ? "Sonido ON" : "Sound ON"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
