"use client";

import React, { useRef, useState } from "react";

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "section";
  maxTilt?: number;
}

export function HolographicCard({
  children,
  className = "",
  as: Component = "div",
  maxTilt = 4,
}: HolographicCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pctX = Math.max(0, Math.min(1, x / rect.width));
    const pctY = Math.max(0, Math.min(1, y / rect.height));

    // Rotate subtle 3D up to maxTilt degrees
    const rotateY = (pctX - 0.5) * (maxTilt * 2);
    const rotateX = (0.5 - pctY) * (maxTilt * 2);

    el.style.setProperty("--rx", `${rotateX.toFixed(2)}deg`);
    el.style.setProperty("--ry", `${rotateY.toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(pctX * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(pctY * 100).toFixed(1)}%`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "50%");
  };

  return (
    <Component
      ref={cardRef as React.RefObject<HTMLDivElement>}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-cursor="interactive"
      style={
        {
          "--rx": "0deg",
          "--ry": "0deg",
          "--mx": "50%",
          "--my": "50%",
          transform:
            "perspective(1000px) rotateX(var(--rx)) rotateY(var(--ry)) translate3d(0, 0, 0)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transition: isHovered
            ? "transform 120ms cubic-bezier(0.22, 1, 0.36, 1), border-color 250ms ease, box-shadow 250ms ease"
            : "transform 500ms cubic-bezier(0.22, 1, 0.36, 1), border-color 300ms ease, box-shadow 300ms ease",
          willChange: "transform",
        } as React.CSSProperties
      }
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/85 dark:border-white/10 bg-white/75 dark:bg-slate-900/60 backdrop-blur-md transform-gpu shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)] hover:border-violet-300/80 dark:hover:border-indigo-400/40 hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_18px_50px_rgba(0,0,0,0.6)] ${className}`}
    >
      {/* Multicolor Iridescent Foil Glare Layer (Light Pearl mode) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 dark:hidden"
        style={{
          opacity: isHovered ? 0.22 : 0,
          background: `
            radial-gradient(
              480px circle at var(--mx) var(--my),
              rgba(6, 182, 212, 0.42) 0%,
              rgba(139, 92, 246, 0.34) 28%,
              rgba(16, 185, 129, 0.28) 54%,
              rgba(251, 113, 133, 0.22) 74%,
              transparent 100%
            )
          `,
          mixBlendMode: "multiply",
        }}
      />

      {/* Cosmic Luminescent Glare Layer (Deep Space mode) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 hidden dark:block"
        style={{
          opacity: isHovered ? 0.35 : 0,
          background: `
            radial-gradient(
              480px circle at var(--mx) var(--my),
              rgba(56, 189, 248, 0.4) 0%,
              rgba(167, 139, 250, 0.35) 28%,
              rgba(52, 211, 153, 0.25) 54%,
              transparent 100%
            )
          `,
          mixBlendMode: "screen",
        }}
      />

      {/* Specular Foil Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 0.45 : 0,
          background: `
            radial-gradient(
              280px circle at var(--mx) var(--my),
              rgba(255, 255, 255, 0.65) 0%,
              transparent 75%
            )
          `,
        }}
      />

      {/* Top Iridescent Hairline Accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[1.5px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, transparent 5%, rgba(6,182,212,0.7) 25%, rgba(139,92,246,0.75) 50%, rgba(16,185,129,0.7) 75%, transparent 95%)",
        }}
      />

      {/* Content Container */}
      <div className="relative z-20 h-full">{children}</div>
    </Component>
  );
}
