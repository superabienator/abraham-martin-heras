"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "pearl" | "deep-space";

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "pearl",
  toggleTheme: () => {},
  setTheme: () => {},
});

const STORAGE_KEY = "portfolio_theme_mode";

function applyThemeToDOM(targetTheme: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-theme", targetTheme);
  if (targetTheme === "deep-space") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "pearl";
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      return saved === "deep-space" || saved === "pearl" ? saved : "pearl";
    } catch {
      return "pearl";
    }
  });

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const setTheme = (targetTheme: ThemeMode) => {
    setThemeState(targetTheme);
    try {
      localStorage.setItem(STORAGE_KEY, targetTheme);
    } catch {
      // Ignorar si el almacenamiento local está restringido
    }
  };

  const toggleTheme = () => {
    const next = theme === "pearl" ? "deep-space" : "pearl";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
