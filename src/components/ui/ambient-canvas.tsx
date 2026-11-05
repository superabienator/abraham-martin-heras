"use client";

import { useTheme } from "@/context/theme-context";

export function AmbientCanvas() {
  const { theme } = useTheme();
  const isDeepSpace = theme === "deep-space";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none transition-colors duration-500 bg-[#F6F7FB] dark:bg-[#0B0F19]"
    >
      {/* Subtle architectural editorial grid */}
      <div className="absolute inset-0 bg-editorial-grid opacity-80" />

      {/* 3 Large Pastel / Cosmic Nebulae animated via GPU translate3d() + scale() */}
      <div
        className="animate-halo-cyan absolute -top-32 -left-24 h-[580px] w-[580px] rounded-full blur-3xl transition-opacity duration-700"
        style={{
          opacity: isDeepSpace ? 0.35 : 0.6,
          background: isDeepSpace
            ? "radial-gradient(circle, rgba(14,165,233,0.35) 0%, rgba(99,102,241,0.18) 48%, transparent 72%)"
            : "radial-gradient(circle, rgba(34,211,238,0.26) 0%, rgba(56,189,248,0.10) 50%, transparent 72%)",
        }}
      />

      <div
        className="animate-halo-lavender absolute top-[14%] -right-28 h-[640px] w-[640px] rounded-full blur-3xl transition-opacity duration-700"
        style={{
          opacity: isDeepSpace ? 0.38 : 0.6,
          background: isDeepSpace
            ? "radial-gradient(circle, rgba(139,92,246,0.32) 0%, rgba(236,72,153,0.15) 50%, transparent 72%)"
            : "radial-gradient(circle, rgba(167,139,250,0.24) 0%, rgba(251,113,133,0.12) 48%, transparent 72%)",
        }}
      />

      <div
        className="animate-halo-mint absolute -bottom-36 left-[22%] h-[600px] w-[600px] rounded-full blur-3xl transition-opacity duration-700"
        style={{
          opacity: isDeepSpace ? 0.3 : 0.6,
          background: isDeepSpace
            ? "radial-gradient(circle, rgba(16,185,129,0.25) 0%, rgba(6,182,212,0.12) 50%, transparent 72%)"
            : "radial-gradient(circle, rgba(52,211,153,0.22) 0%, rgba(45,212,191,0.10) 50%, transparent 72%)",
        }}
      />

      {/* Tactile Creative Studio SVG Noise Overlay */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.035] dark:opacity-[0.045] mix-blend-multiply dark:mix-blend-screen"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="holographic-studio-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#holographic-studio-noise)" />
      </svg>
    </div>
  );
}
