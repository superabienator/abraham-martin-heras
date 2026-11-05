"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { RotateCcw, Sparkles, Terminal } from "lucide-react";

export function GenesisBanner() {
  const { language } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isEnded, setIsEnded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setIsEnded(true);
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    video.addEventListener("ended", handleEnded);
    video.addEventListener("play", handlePlay);

    // Auto-trigger playback on mount
    video.play().catch(() => {
      // If browser blocked autoplay without user interaction
      setIsPlaying(false);
    });

    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("play", handlePlay);
    };
  }, []);

  const handleReplay = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
      setIsEnded(false);
      setIsPlaying(true);
    }
  };

  const isEs = language === "es";

  return (
    <section aria-label="AMH Welcome Genesis" className="relative w-full pt-4 pb-2">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl border border-violet-200/80 dark:border-cyan-500/30 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md shadow-lg shadow-violet-500/5 dark:shadow-[0_10px_35px_rgba(6,182,212,0.08)] transition-all">
        {/* IDE & Blueprint Header Bar (Encuadre Técnico y Programación) */}
        <div className="flex h-9 items-center justify-between border-b border-slate-200/80 dark:border-white/10 bg-slate-50/90 dark:bg-slate-900/90 px-3.5 sm:px-4 text-[11px] font-mono">
          {/* Left: Window Control Indicators */}
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 ring-1 ring-rose-500/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 ring-1 ring-amber-500/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 ring-1 ring-emerald-500/30" />
            <span className="ml-2 hidden text-slate-400 dark:text-slate-600 sm:inline">|</span>
            <span className="hidden items-center gap-1.5 text-slate-600 dark:text-slate-400 sm:inline-flex">
              <Terminal className="h-3 w-3 text-violet-600 dark:text-cyan-400" />
              <span>amh-genesis.sys // identity-core</span>
            </span>
          </div>

          {/* Center: Monogram & State Microcopy */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isEnded ? "bg-cyan-400" : "animate-ping bg-emerald-400"
                }`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  isEnded ? "bg-cyan-500" : "bg-emerald-500"
                }`}
              />
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[10px] sm:text-[11px]">
              {isEnded
                ? isEs
                  ? "Identidad Consolidada"
                  : "Identity Initialized"
                : isPlaying
                ? isEs
                  ? "Generando AMH..."
                  : "Synthesizing AMH..."
                : isEs
                ? "AMH Listo"
                : "AMH Ready"}
            </span>
          </div>

          {/* Right: Replay Action & Engine Tag */}
          <div className="flex items-center gap-2.5">
            <span className="hidden lg:inline-block rounded border border-slate-200 dark:border-white/10 px-1.5 py-0.5 text-[9px] text-slate-500 dark:text-slate-400">
              GPU ACCELERATED
            </span>
            <button
              onClick={handleReplay}
              title={isEs ? "Repetir animación de bienvenida" : "Replay welcome animation"}
              aria-label={isEs ? "Repetir animación" : "Replay animation"}
              className="group flex items-center gap-1 rounded-md border border-slate-200/90 dark:border-white/10 bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-300 hover:border-violet-400 dark:hover:border-cyan-400 hover:text-violet-700 dark:hover:text-cyan-300 transition-colors"
            >
              <RotateCcw className="h-3 w-3 text-slate-500 dark:text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
              <span className="hidden sm:inline">{isEs ? "Repetir" : "Replay"}</span>
            </button>
          </div>
        </div>

        {/* Video Viewport (Formato Panorámico Ultra-Achatado y Centrado) */}
        <div className="relative h-32 sm:h-44 md:h-52 lg:h-60 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
          {/* Subtle Blueprint Crosshairs (Esquinas de Diseño de Software) */}
          <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-2 sm:p-3 select-none">
            <div className="flex justify-between font-mono text-[9px] text-violet-400/40 dark:text-cyan-400/40">
              <span>+ [X: 0, Y: 0]</span>
              <span>[1280 x 720 · 60 FPS] +</span>
            </div>
            <div className="flex justify-between font-mono text-[9px] text-violet-400/40 dark:text-cyan-400/40">
              <span>+ AMH // BRAND IDENTITY</span>
              <span>VECTOR MATRICES +</span>
            </div>
          </div>

          {/* HTML5 Autoplay Video (Formation sequence) */}
          <video
            ref={videoRef}
            src="/amh-formation.mp4"
            poster="/logo-amh.png"
            autoPlay
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover object-center transform-gpu"
          />

          {/* Static Final State Overlay with AMH Monogram when finished */}
          {isEnded && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/5 dark:bg-black/20 backdrop-blur-[0.5px] transition-opacity duration-700">
              <div className="relative flex items-center justify-center">
                {/* Subtle luminous halo behind logo */}
                <div className="absolute h-28 w-28 rounded-full bg-gradient-to-r from-violet-500/20 via-cyan-500/20 to-teal-500/20 blur-xl" />
                <div className="relative flex items-center gap-2 rounded-full border border-white/20 bg-slate-950/60 backdrop-blur-md px-3.5 py-1 text-white shadow-xl">
                  <Image
                    src="/logo-amh.png"
                    alt="Abraham Martín Heras AMH"
                    width={20}
                    height={20}
                    className="rounded-md object-contain"
                  />
                  <span className="font-mono text-[11px] font-semibold tracking-wider text-cyan-300">
                    AMH · SYSTEM READY
                  </span>
                  <Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
                </div>
              </div>
            </div>
          )}

          {/* Soft vignette gradient for cinematic letterbox edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-black/50 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-black/50 to-transparent z-10" />
        </div>
      </div>
    </section>
  );
}
