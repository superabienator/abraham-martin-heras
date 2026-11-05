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
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRafRef = useRef<number | null>(null);
  const fallbackStartRef = useRef<number>(0);

  // Derive visual stage from exact time in seconds
  const updateStageFromTime = useCallback((t: number) => {
    if (t < 1.8) {
      setStage("words");
    } else if (t < 2.7) {
      setStage("collapsing");
    } else if (t < 3.4) {
      setStage("converging");
    } else if (t < 4.3) {
      setStage("nebula");
    } else {
      setStage("settled");
    }
  }, []);

  // Fallback timer loop when audio is muted or blocked by browser policy
  const runFallbackLoop = useCallback(() => {
    if (timerRafRef.current) cancelAnimationFrame(timerRafRef.current);
    const loop = () => {
      if (typeof window === "undefined") return;
      const elapsed = (performance.now() - fallbackStartRef.current) / 1000;
      updateStageFromTime(elapsed);
      if (elapsed < 4.8) {
        timerRafRef.current = requestAnimationFrame(loop);
      } else {
        setStage("settled");
      }
    };
    timerRafRef.current = requestAnimationFrame(loop);
  }, [updateStageFromTime]);

  // Attempt to start audio playback from beginning
  const startAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      fallbackStartRef.current = performance.now();
      runFallbackLoop();
      return;
    }

    audio.currentTime = 0;
    audio.volume = 0.85;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setAutoplayBlocked(false);
        })
        .catch(() => {
          // Browser Autoplay Policy blocked audio until a real user gesture
          setAutoplayBlocked(true);
          // Run visual progression smoothly anyway so screen is never frozen
          fallbackStartRef.current = performance.now();
          runFallbackLoop();
        });
    }
  }, [isMuted, runFallbackLoop]);

  // Replay sequence triggered by user
  const handleReplay = useCallback(() => {
    setStage("words");
    setAutoplayBlocked(false);
    startAudio();
  }, [startAudio]);

  // Start sequence on initial mount
  useEffect(() => {
    startAudio();
    return () => {
      if (timerRafRef.current) cancelAnimationFrame(timerRafRef.current);
    };
  }, [startAudio]);

  // If autoplay was initially blocked by Chrome/Safari, listen for the FIRST user gesture
  // (click, touch, keypress) to instantly unlock and synchronize audio with zero friction
  useEffect(() => {
    if (!autoplayBlocked) return;

    const unlockOnGesture = () => {
      const audio = audioRef.current;
      if (audio && audio.paused && !isMuted) {
        audio.currentTime = 0;
        audio.play().then(() => {
          setAutoplayBlocked(false);
          setStage("words");
        }).catch(() => {});
      }
    };

    const gestureEvents = ["pointerdown", "touchstart", "click", "keydown"];
    gestureEvents.forEach((ev) => window.addEventListener(ev, unlockOnGesture, { once: true }));

    return () => {
      gestureEvents.forEach((ev) => window.removeEventListener(ev, unlockOnGesture));
    };
  }, [autoplayBlocked, isMuted]);

  // Synchronize visual stage directly from the audio element's own timeupdate event!
  // This guarantees 0ms drift / mathematically impossible to desynchronize!
  const handleAudioTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    updateStageFromTime(audio.currentTime);
  };

  const handleAudioEnded = () => {
    setStage("settled");
  };

  const toggleSound = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.currentTime = 0;
        audioRef.current.play().then(() => {
          setAutoplayBlocked(false);
        }).catch(() => {});
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
      {/* Hidden audio element tied 1:1 to visual stage progression */}
      <audio
        ref={audioRef}
        src="/amh-audio.mp4"
        preload="auto"
        muted={isMuted}
        onTimeUpdate={handleAudioTimeUpdate}
        onEnded={handleAudioEnded}
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

          {/* Sound Toggle Button (Pulses if browser blocked cold autoplay to invite user to activate sound) */}
          <button
            type="button"
            onClick={toggleSound}
            title={isMuted ? (isEs ? "Activar sonido" : "Unmute sound") : (isEs ? "Silenciar" : "Mute")}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all cursor-pointer shadow-2xs ${
              autoplayBlocked
                ? "border-violet-400/90 dark:border-cyan-400/80 bg-violet-50/90 dark:bg-cyan-950/70 text-violet-800 dark:text-cyan-200 animate-bounce"
                : isMuted
                ? "border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-slate-900/75 text-slate-500 dark:text-slate-400"
                : "border-cyan-300/80 dark:border-cyan-500/40 bg-cyan-50/80 dark:bg-cyan-950/50 text-cyan-800 dark:text-cyan-300"
            }`}
          >
            {autoplayBlocked ? (
              <>
                <Volume2 className="h-3 w-3 text-violet-600 dark:text-cyan-400" />
                <span className="text-[11px] font-sans font-semibold">{isEs ? "Activar Sonido" : "Enable Sound"}</span>
              </>
            ) : isMuted ? (
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
