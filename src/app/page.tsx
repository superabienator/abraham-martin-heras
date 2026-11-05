"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import { type BentoCategory, type SocialLink, type TimelineEntry } from "@/data/cv-data";
import { PlaygroundTabs } from "@/components/PlaygroundTabs";
import { AmbientCanvas } from "@/components/ui/ambient-canvas";
import { HolographicCard } from "@/components/ui/holographic-card";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { RevealSection, RevealItem } from "@/components/ui/reveal-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { HeaderReveal, EditorialReveal } from "@/components/ui/editorial-reveal";
import { CertificationsCylinder } from "@/components/ui/certifications-cylinder";
import { DynamicIdentityHero } from "@/components/ui/dynamic-identity-hero";
import {
  Bot,
  Workflow,
  Code2,
  ShieldCheck,
  Globe,
  Mail,
  Download,
  Sparkles,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  MapPin,
  ArrowUpRight,
  Terminal,
  Zap,
} from "lucide-react";

function renderSocialIcon(iconName: SocialLink["iconName"]) {
  switch (iconName) {
    case "github":
      return <Code2 className="h-4 w-4 text-violet-600 dark:text-cyan-400" />;
    case "linkedin":
      return <Globe className="h-4 w-4 text-cyan-600 dark:text-violet-400" />;
    case "mail":
      return <Mail className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
    case "terminal":
      return <Terminal className="h-4 w-4 text-rose-500 dark:text-rose-400" />;
  }
}

function renderBentoIcon(iconName: BentoCategory["iconName"], accent: BentoCategory["accent"]) {
  const colorClass =
    accent === "emerald"
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-cyan-600 dark:text-cyan-400";
  switch (iconName) {
    case "bot":
      return <Bot className={`h-6 w-6 ${colorClass}`} />;
    case "workflow":
      return <Workflow className={`h-6 w-6 ${colorClass}`} />;
    case "code":
      return <Code2 className={`h-6 w-6 ${colorClass}`} />;
    case "shield":
      return <ShieldCheck className={`h-6 w-6 ${colorClass}`} />;
  }
}

function renderTimelineIcon(type: TimelineEntry["type"]) {
  switch (type) {
    case "tech-ai":
      return <Sparkles className="h-4 w-4 text-violet-600 dark:text-cyan-400" />;
    case "automation-ops":
      return <Workflow className="h-4 w-4 text-cyan-600 dark:text-violet-400" />;
    case "logistics-ops":
      return <Briefcase className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
    case "education":
      return <GraduationCap className="h-4 w-4 text-rose-500 dark:text-rose-400" />;
  }
}

export default function HomePage() {
  const { cv, language, t } = useLanguage();
  const { profile, bentoCategories, languages, certifications, playgroundTabs, timeline } = cv;

  // Garantizar que la recarga de página (F5) NUNCA salte al medio de la web ni a submenús residuales
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
      window.scrollTo(0, 0);
    }
  }, []);

  const githubSocial = profile.socials.find((s) => s.id === "github") ?? profile.socials[0];
  const linkedinSocial = profile.socials.find((s) => s.id === "linkedin") ?? profile.socials[1];

  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-clip text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Organic Moving Pastel / Cosmic Halos + Architectural Grid + SVG Noise Overlay */}
      <AmbientCanvas />

      {/* Sticky Luminous Glassmorphism Header con Transición Editorial y 3 Zonas Claras */}
      <HeaderReveal className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-slate-950/75 backdrop-blur-md transform-gpu transition-colors duration-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* Zona 1: Identidad (Izquierda) */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-violet-300/80 dark:border-cyan-400/50 bg-white/90 dark:bg-slate-900/90 shadow-2xs shrink-0 overflow-hidden">
              <Image
                src="/amh-logo-card.png"
                alt="AMH"
                width={32}
                height={32}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white truncate max-w-[125px] xs:max-w-[170px] sm:max-w-none">
                {profile.name}
              </span>
              <span className="hidden xl:inline-block rounded-full border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 px-2 py-0.5 font-mono text-[10px] text-slate-600 dark:text-slate-400 whitespace-nowrap">
                Vibe Coding · Automation · Ops
              </span>
            </div>
          </div>

          {/* Zona 2: Navegación Centrada (Centro) */}
          <nav className="hidden md:flex items-center mx-auto px-5 py-1.5 rounded-full bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/70 dark:border-white/10 gap-6 lg:gap-7 shadow-2xs backdrop-blur-md">
            <a
              href="#hero"
              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap"
            >
              {t.nav.overview}
            </a>
            <a
              href="#bento-skills"
              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap"
            >
              {t.nav.bento}
            </a>
            <a
              href="#playground"
              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-violet-700 dark:hover:text-cyan-400 transition-colors whitespace-nowrap"
            >
              {t.nav.playground}
            </a>
            <a
              href="#timeline"
              className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors whitespace-nowrap"
            >
              {t.nav.timeline}
            </a>
          </nav>

          {/* Zona 3: Acciones, Idioma y Tema (Derecha compacta y flexible para móvil) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 shrink-0 ml-auto pl-2">
            <LanguageToggle />
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden xs:block" />
            <ThemeToggle />

            <MagneticButton
              href={`/cv-print?lang=${language}`}
              target="_blank"
              rel="noopener noreferrer"
              strength={0.2}
              className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl border border-violet-300/80 dark:border-cyan-400/40 bg-holographic-pill px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white shadow-2xs hover:border-violet-400 dark:hover:border-cyan-300 transition-all shrink-0"
              title={language === "es" ? "Abrir CV imprimible en PDF (ATS-Friendly)" : "Open printable executive CV (ATS-Friendly)"}
            >
              <Download className="h-3.5 w-3.5 text-violet-700 dark:text-cyan-400 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">{t.nav.downloadCv}</span>
              <span className="sm:hidden text-[11px] font-bold">CV</span>
            </MagneticButton>
          </div>
        </div>
      </HeaderReveal>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16 py-6 sm:py-10">
        {/* =====================================================================
            0. DYNAMIC AMH IDENTITY FORMATION (Kinetic Typography & Audio Fusion)
        ===================================================================== */}
        <DynamicIdentityHero />

        {/* =====================================================================
            1. HERO SECTION (Luminous Holographic & Kinetic Editorial)
        ===================================================================== */}
        <RevealSection id="hero" className="relative pt-2">
          <EditorialReveal delay={0.06}>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8 space-y-6">
              {/* Animated Iridescent Availability Badge */}
              <RevealItem>
                <div className="inline-flex flex-wrap items-center gap-2.5 rounded-full border border-violet-200/90 dark:border-cyan-500/30 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md transform-gpu px-4 py-1.5 text-xs text-slate-800 dark:text-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.4)]">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {profile.availabilityBadge.statusText}
                  </span>
                  <span className="hidden sm:inline text-slate-400 dark:text-slate-600">•</span>
                  <span className="hidden sm:inline text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                    {profile.availabilityBadge.subText}
                  </span>
                </div>
              </RevealItem>

              {/* Role & Executive Headline */}
              <RevealItem className="space-y-4">
                <p className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-widest text-violet-700 dark:text-cyan-400">
                  {profile.role}
                </p>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
                  {t.hero.titlePrefix}{" "}
                  <span className="text-holographic">
                    {t.hero.titleHighlight}
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                  {profile.tagline}
                </p>
              </RevealItem>

              {/* Executive Summary & Value Proposition */}
              <RevealItem className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <HolographicCard maxTilt={3} className="p-5">
                  <div className="text-xs font-mono font-semibold uppercase tracking-wider text-violet-700 dark:text-cyan-400 mb-1.5">
                    {t.hero.hybridCardTitle}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {profile.executiveSummary}
                  </p>
                </HolographicCard>

                <HolographicCard maxTilt={3} className="p-5">
                  <div className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-700 dark:text-violet-400 mb-1.5">
                    {t.hero.businessCardTitle}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {profile.valueProposition}
                  </p>
                </HolographicCard>
              </RevealItem>

              {/* Magnetic CTAs: Download CV PDF + Social Quick Links */}
              <RevealItem className="flex flex-wrap items-center gap-3 pt-2">
                <MagneticButton
                  href={`/cv-print?lang=${language}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  strength={0.22}
                  className="inline-flex items-center gap-2.5 rounded-xl bg-slate-900 dark:bg-white px-5 py-3 text-sm font-semibold text-white dark:text-slate-950 shadow-[0_10px_25px_rgba(15,23,42,0.18)] dark:shadow-[0_10px_30px_rgba(255,255,255,0.15)] hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
                >
                  <Download className="h-4 w-4 text-cyan-300 dark:text-violet-700" />
                  <span>{t.hero.ctaDownloadCv}</span>
                </MagneticButton>

                {profile.socials.map((social) => (
                  <MagneticButton
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    strength={0.22}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200/90 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transform-gpu px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:border-violet-300 dark:hover:border-cyan-400/50 hover:bg-white dark:hover:bg-slate-800 transition-all"
                  >
                    {renderSocialIcon(social.iconName)}
                    <span>{social.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                  </MagneticButton>
                ))}
              </RevealItem>

              <RevealItem className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 pt-1">
                <MapPin className="h-3.5 w-3.5 text-violet-600 dark:text-cyan-400" />
                <span>{profile.location}</span>
              </RevealItem>
            </div>

            {/* Right Column: High-Impact Holographic Metrics Grid */}
            <div className="lg:col-span-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3.5">
                {profile.metrics.map((metric) => (
                  <RevealItem key={metric.id}>
                    <HolographicCard maxTilt={4} className="p-5">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-3xl font-bold tracking-tight font-mono text-holographic">
                          {metric.value}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                          {metric.label}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {metric.detail}
                      </p>
                    </HolographicCard>
                  </RevealItem>
                ))}
              </div>
            </div>
          </div>
        </EditorialReveal>
      </RevealSection>

        {/* =====================================================================
            2. BENTO GRID DE HABILIDADES Y CERTIFICACIONES
        ===================================================================== */}
        <RevealSection id="bento-skills" className="space-y-10 scroll-mt-24">
          <RevealItem className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-violet-700 dark:text-cyan-400">
                <Zap className="h-3.5 w-3.5 text-violet-600 dark:text-cyan-400" />
                <span>{t.bento.tagline}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t.bento.title}
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
              {t.bento.subtitle}
            </p>
          </RevealItem>

          {/* 4 Main Holographic Bento Cards */}
          <div className="grid grid-cols-12 gap-5">
            {bentoCategories.map((category) => {
              const isEmerald = category.accent === "emerald";
              return (
                <RevealItem key={category.id} className={category.gridSpan}>
                  <HolographicCard
                    as="article"
                    maxTilt={3.5}
                    className="h-full p-6 sm:p-8 flex flex-col justify-between"
                  >
                    <div className="flex h-full flex-col justify-between">
                      {/* Top Header */}
                      <div className="space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3.5">
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-xl border ${
                                isEmerald
                                  ? "border-emerald-200 dark:border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/40"
                                  : "border-cyan-200 dark:border-cyan-500/30 bg-cyan-50/80 dark:bg-cyan-950/40"
                              }`}
                            >
                              {renderBentoIcon(category.iconName, category.accent)}
                            </div>
                            <div>
                              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                                {category.title}
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{category.subtitle}</p>
                            </div>
                          </div>

                          <span className="rounded-full border border-violet-200/80 dark:border-cyan-500/30 bg-holographic-pill px-3 py-1 font-mono text-[11px] font-medium text-slate-800 dark:text-cyan-300">
                            {category.metricHighlight}
                          </span>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                          {category.businessImpact}
                        </p>

                        {/* Skills Matrix inside Card */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {category.skills.map((skill) => (
                            <div
                              key={skill.name}
                              className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/85 dark:bg-slate-950/60 p-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-none"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                                  {skill.name}
                                </span>
                                <span
                                  className={`shrink-0 rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold ${
                                    skill.level === "Especialista"
                                      ? "bg-violet-100 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30"
                                      : "bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30"
                                  }`}
                                >
                                  {skill.level}
                                </span>
                              </div>
                              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                {skill.context}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Use Cases */}
                      <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-white/10">
                        <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                          {t.bento.useCasesTitle}
                        </div>
                        <ul className="space-y-1.5">
                          {category.useCases.map((useCase) => (
                            <li
                              key={useCase}
                              className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                            >
                              <CheckCircle2
                                className={`h-4 w-4 shrink-0 mt-0.5 ${
                                  isEmerald
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-cyan-600 dark:text-cyan-400"
                                }`}
                              />
                              <span>{useCase}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </HolographicCard>
                </RevealItem>
              );
            })}

            {/* Bloque Visual Destacado de Competencias Lingüísticas */}
            <RevealItem className="col-span-12">
              <HolographicCard maxTilt={2.5} className="p-6 sm:p-8">
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-200 dark:border-cyan-500/30 bg-holographic-pill shadow-xs shrink-0">
                        <Globe className="h-5 w-5 text-violet-700 dark:text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {t.bento.languagesTitle}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {t.bento.languagesSubtitle}
                        </p>
                      </div>
                    </div>
                    <span className="self-start sm:self-auto rounded-full border border-violet-200 dark:border-cyan-500/30 bg-holographic-pill px-3 py-1 font-mono text-[11px] font-semibold text-slate-800 dark:text-cyan-300">
                      {language === "es" ? "3 Idiomas Operativos" : "3 Working Languages"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {languages.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 flex flex-col justify-between shadow-2xs hover:border-violet-300 dark:hover:border-cyan-400/40 transition-all"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {item.language}
                            </span>
                            <span className="rounded-md bg-violet-50 dark:bg-cyan-950/70 border border-violet-200 dark:border-cyan-500/30 px-2 py-0.5 font-mono text-[10px] font-semibold text-violet-800 dark:text-cyan-300">
                              {item.cefr}
                            </span>
                          </div>

                          {/* Barra de Fluidez Visual */}
                          <div className="space-y-1 pt-1">
                            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                              <span>{item.level}</span>
                              <span className="font-semibold text-violet-700 dark:text-cyan-400">{item.fluencyPercent}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                                style={{ width: `${item.fluencyPercent}%` }}
                              />
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pt-1">
                            {item.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-slate-500 dark:text-slate-400">{language === "es" ? "Acreditación:" : "Level:"}</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {item.badge}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </HolographicCard>
            </RevealItem>
          </div>

          {/* Official Certifications 3D Cylinder & Compact Grid */}
          <RevealItem>
            <CertificationsCylinder certifications={certifications} />
          </RevealItem>
        </RevealSection>

        {/* =====================================================================
            3. INTERACTIVE AI & AUTOMATION PLAYGROUND
        ===================================================================== */}
        <RevealSection id="playground" className="space-y-8 scroll-mt-24">
          <RevealItem className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-cyan-700 dark:text-cyan-400">
                <Sparkles className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>{t.playground.tagline}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t.playground.title}
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
              {t.playground.subtitle}
            </p>
          </RevealItem>

          <RevealItem>
            <PlaygroundTabs tabs={playgroundTabs} />
          </RevealItem>
        </RevealSection>

        {/* =====================================================================
            4. TIMELINE DE EXPERIENCIA Y EDUCACIÓN
        ===================================================================== */}
        <RevealSection id="timeline" className="space-y-10 scroll-mt-24">
          <RevealItem className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-white/10 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-violet-700 dark:text-cyan-400">
                <Briefcase className="h-3.5 w-3.5 text-violet-600 dark:text-cyan-400" />
                <span>{t.timeline.tagline}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t.timeline.title}
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
              {t.timeline.subtitle}
            </p>
          </RevealItem>

          <div className="relative pl-6 sm:pl-8 before:absolute before:top-2 before:bottom-2 before:left-2.5 sm:before:left-3.5 before:w-0.5 before:bg-gradient-to-b before:from-cyan-400 before:via-violet-400 before:to-emerald-400 space-y-8">
            {timeline.map((item) => (
              <RevealItem key={item.id} className="relative group">
                {/* Timeline Node Dot */}
                <div className="absolute -left-6 sm:-left-8 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-violet-300 dark:border-cyan-400/50 bg-white dark:bg-slate-900 shadow-sm">
                  {renderTimelineIcon(item.type)}
                </div>

                {/* Holographic Timeline Card */}
                <HolographicCard maxTilt={3} className="p-6 sm:p-7">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-violet-700 dark:text-cyan-400">
                          {item.period}
                        </span>
                        <span className="rounded-full border border-violet-200/80 dark:border-white/10 bg-holographic-pill px-3 py-0.5 font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                          {item.badgeText}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{item.location}</span>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{item.role}</h3>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                        {item.organization}
                      </p>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.summary}</p>

                    <ul className="space-y-2 pt-1">
                      {item.achievements.map((achievement) => (
                        <li
                          key={achievement}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200/80 dark:border-white/10">
                      <div className="flex flex-wrap gap-1.5">
                        {item.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-950 px-2.5 py-1 font-mono text-[11px] font-medium text-slate-700 dark:text-slate-300 shadow-2xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {item.impactMetric && (
                        <span className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                          ⚡ {item.impactMetric}
                        </span>
                      )}
                    </div>
                  </div>
                </HolographicCard>
              </RevealItem>
            ))}
          </div>
        </RevealSection>
      </main>

      {/* Footer Ejecutivo y Saneado (Cero fugas técnicas) */}
      <footer className="border-t border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-slate-950/75 backdrop-blur-md transform-gpu py-10 mt-20 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 shadow-xs shrink-0 overflow-hidden">
              <Image
                src="/amh-logo-card.png"
                alt="AMH"
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="font-bold text-slate-900 dark:text-white">{profile.name}</span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-600 dark:text-slate-400">{profile.role}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{profile.availabilityBadge.statusText}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <a
                href={githubSocial.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-violet-600 dark:hover:text-cyan-400 transition-colors"
              >
                {githubSocial.label}
              </a>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <a
                href={linkedinSocial.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-violet-600 dark:hover:text-cyan-400 transition-colors"
              >
                {linkedinSocial.label}
              </a>
            </div>

            <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-white/10 pt-2 sm:pt-0 sm:pl-6 text-center sm:text-left">
              {t.footer.subtitle}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
