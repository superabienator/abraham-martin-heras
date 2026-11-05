"use client";

import React, { createContext, useContext, useMemo, useCallback, useSyncExternalStore } from "react";
import { getCVData, uiDictionary, type CVData } from "@/data/cv-data";

export type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  cv: CVData;
  t: typeof uiDictionary["es"];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

let currentLang: Language = "es";
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Language {
  return currentLang;
}

function getServerSnapshot(): Language {
  return "es";
}

if (typeof window !== "undefined") {
  try {
    const saved = localStorage.getItem("preferred_lang");
    if (saved === "es" || saved === "en") {
      currentLang = saved;
    } else if (navigator.language?.toLowerCase().startsWith("en")) {
      currentLang = "en";
    }
  } catch {
    // Ignore storage errors
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLanguage = useCallback((lang: Language) => {
    if (currentLang !== lang) {
      currentLang = lang;
      try {
        localStorage.setItem("preferred_lang", lang);
      } catch {
        // Ignore storage errors
      }
      emitChange();
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    const next: Language = currentLang === "es" ? "en" : "es";
    setLanguage(next);
  }, [setLanguage]);

  const cv = useMemo(() => getCVData(language), [language]);
  const t = useMemo(() => uiDictionary[language], [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      cv,
      t,
    }),
    [language, setLanguage, toggleLanguage, cv, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
