"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/theme-context";
import { SunMedium, MoonStar } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDeepSpace = theme === "deep-space";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Cambiar a modo ${isDeepSpace ? "Holographic Pearl" : "Deep Space"}`}
      data-cursor="interactive"
      className={`group relative flex items-center rounded-full border border-slate-200/90 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 p-1 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all duration-300 hover:border-violet-300 dark:hover:border-indigo-400 cursor-pointer whitespace-nowrap shrink-0 ${className}`}
    >
      {/* Contenedor relativo para opciones y píldora deslizante */}
      <div className="relative flex items-center">
        {/* Opción Pearl */}
        <div
          className={`relative z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-200 whitespace-nowrap ${
            !isDeepSpace
              ? "text-slate-900 font-semibold"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <SunMedium className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span className="font-mono text-[11px] whitespace-nowrap">Pearl</span>
        </div>

        {/* Opción Deep Space */}
        <div
          className={`relative z-10 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors duration-200 whitespace-nowrap ${
            isDeepSpace
              ? "text-white font-semibold"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <MoonStar className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
          <span className="font-mono text-[11px] whitespace-nowrap">Deep Space</span>
        </div>

        {/* Píldora deslizante con spring physics */}
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 32,
          }}
          className={`absolute top-0 bottom-0 rounded-full ${
            !isDeepSpace
              ? "left-0 w-1/2 bg-holographic-pill border border-violet-200/80 shadow-xs"
              : "left-1/2 w-1/2 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 border border-indigo-400/30 shadow-xs"
          }`}
        />
      </div>
    </button>
  );
}
