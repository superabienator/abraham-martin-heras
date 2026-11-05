"use client";

import React from "react";
import { useLanguage } from "@/context/language-context";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="inline-flex items-center rounded-xl p-0.5 bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-white/10 shadow-2xs whitespace-nowrap"
      role="group"
      aria-label="Selector de idioma / Language selector"
    >
      <div className="hidden sm:flex items-center pl-1.5 pr-1 text-slate-400 dark:text-slate-500">
        <Globe className="h-3 w-3" />
      </div>
      <button
        type="button"
        onClick={() => setLanguage("es")}
        aria-pressed={language === "es"}
        className={`px-2 py-1 text-[11px] font-mono font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
          language === "es"
            ? "bg-white dark:bg-slate-800 text-violet-700 dark:text-cyan-400 shadow-xs border border-slate-200/60 dark:border-white/10"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
        title="Cambiar idioma a Español"
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={`px-2 py-1 text-[11px] font-mono font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
          language === "en"
            ? "bg-white dark:bg-slate-800 text-violet-700 dark:text-cyan-400 shadow-xs border border-slate-200/60 dark:border-white/10"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
        title="Switch language to English"
      >
        EN
      </button>
    </div>
  );
}
