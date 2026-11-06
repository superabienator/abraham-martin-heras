"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PlaygroundTabConfig } from "@/data/cv-data";
import { HolographicCard } from "@/components/ui/holographic-card";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { DataCleaner } from "@/components/apps/data-cleaner";
import { PipelineSimulator } from "@/components/apps/pipeline-simulator";
import { CvChat } from "@/components/apps/cv-chat";
import {
  FileSpreadsheet,
  Network,
  Sparkles,
  Cpu,
  Layers,
  Activity,
} from "lucide-react";

interface PlaygroundTabsProps {
  tabs: PlaygroundTabConfig[];
}

export function PlaygroundTabs({ tabs }: PlaygroundTabsProps) {
  const [activeTabId, setActiveTabId] = useState<PlaygroundTabConfig["id"]>(
    tabs[0]?.id ?? "smart-cleaner"
  );

  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];

  const getTabIcon = (iconName: PlaygroundTabConfig["iconName"], isActive: boolean) => {
    const className = `h-4 w-4 transition-colors ${
      isActive
        ? "text-violet-600 dark:text-cyan-400"
        : "text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200"
    }`;
    switch (iconName) {
      case "file-spreadsheet":
        return <FileSpreadsheet className={className} />;
      case "network":
        return <Network className={className} />;
      case "sparkles":
        return <Sparkles className={className} />;
    }
  };

  return (
    <HolographicCard maxTilt={2.5} className="p-0">
      {/* Top Window Bar + Liquid Tabs Navigation */}
      <div className="border-b border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-950/70 px-4 pt-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="h-3 w-3 rounded-full bg-rose-400/90 shadow-xs" />
            <span className="h-3 w-3 rounded-full bg-amber-300/90" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/90" />
            <span className="ml-2 font-mono text-xs text-slate-500 dark:text-slate-400">
              kinetic-ai-playground://live-runtime
            </span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 dark:border-cyan-500/30 bg-holographic-pill px-3.5 py-1 text-xs font-medium text-slate-800 dark:text-cyan-300">
            <Cpu className="h-3.5 w-3.5 text-violet-600 dark:text-cyan-400" />
            <span>{activeTab.sprintStatus}</span>
          </div>
        </div>

        {/* 3 Liquid Interactive Tabs with layoutId="activeTab" & Magnetic Pull */}
        <div
          role="tablist"
          aria-label="Interactive AI and Automation Playground"
          className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 pb-3.5"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab.id;
            return (
              <div key={tab.id} role="presentation" className="relative">
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                    className="pointer-events-none absolute inset-0 rounded-xl border border-violet-300/90 dark:border-cyan-400/50 bg-holographic-pill shadow-[0_4px_20px_rgba(139,92,246,0.12)] dark:shadow-[0_4px_25px_rgba(6,182,212,0.18)]"
                  />
                )}
                <MagneticButton
                  strength={0.14}
                  role="tab"
                  ariaSelected={isActive}
                  id={`tab-${tab.id}`}
                  ariaControls={`tabpanel-${tab.id}`}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`group relative z-10 flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors duration-200 cursor-pointer ${
                    isActive
                      ? "border-transparent text-slate-900 dark:text-white font-semibold"
                      : "border-slate-200/70 dark:border-white/5 bg-white/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/15 hover:bg-white/80 dark:hover:bg-slate-900/80 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {getTabIcon(tab.iconName, isActive)}
                    <span className="truncate text-xs sm:text-sm">
                      {tab.tabLabel}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                      isActive
                        ? "bg-white/90 dark:bg-slate-800 text-violet-700 dark:text-cyan-300 border border-violet-200 dark:border-cyan-500/30 shadow-2xs"
                        : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {tab.shortBadge}
                  </span>
                </MagneticButton>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Tab Content Area with Animated Transition */}
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab.id}`}
        aria-labelledby={`tab-${activeTab.id}`}
        tabIndex={0}
        className="p-6 sm:p-8 lg:p-10 bg-white/60 dark:bg-slate-950/50 min-h-[500px] focus:outline-none focus-visible:ring-1 focus-visible:ring-violet-400"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeTab.id === "smart-cleaner" ? (
              /* Miniaplicación Interactiva en Vivo (Pestaña 1): Smart Data Cleaner */
              <div className="space-y-8">
                {/* Cabecera Descriptiva del Módulo */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                      <Layers className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>Motor Activo en Vivo · Demostrador Ofimático con IA</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {activeTab.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                      {activeTab.subtitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {activeTab.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-1 font-mono text-xs font-medium text-slate-700 dark:text-cyan-300 shadow-2xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Componente del Motor de Limpieza */}
                <DataCleaner />
              </div>
            ) : activeTab.id === "workflow-simulator" ? (
              /* Miniaplicación Interactiva en Vivo (Pestaña 2): Pipeline Simulator */
              <div className="space-y-8">
                {/* Cabecera Descriptiva del Módulo */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-400">
                      <Activity className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                      <span>Simulador de Orquestación E2E · Nodos & Telemetría en Vivo</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {activeTab.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                      {activeTab.subtitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {activeTab.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-1 font-mono text-xs font-medium text-slate-700 dark:text-cyan-300 shadow-2xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Componente del Simulador de Pipeline */}
                <PipelineSimulator />
              </div>
            ) : (
              /* Miniaplicación Interactiva en Vivo (Pestaña 3): Ask My CV - Entrevista Interactiva */
              <div className="space-y-8">
                {/* Cabecera Descriptiva del Módulo */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-violet-700 dark:text-cyan-400">
                      <Sparkles className="h-3.5 w-3.5 text-violet-600 dark:text-cyan-400" />
                      <span>Asistente Ejecutivo con IA · Entrevista Interactiva en Vivo</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                      {activeTab.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                      {activeTab.subtitle}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {activeTab.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900 px-3 py-1 font-mono text-xs font-medium text-slate-700 dark:text-cyan-300 shadow-2xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Componente del Chat Interactivo */}
                <CvChat />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </HolographicCard>
  );
}
