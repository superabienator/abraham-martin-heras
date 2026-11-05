"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { getCVData, type LanguageSkill } from "@/data/cv-data";
import { Printer, ArrowLeft, Globe, Copy, Check, ShieldCheck, Mail, MapPin, Award } from "lucide-react";

function CVPrintContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryLang = searchParams.get("lang");
  const lang: "es" | "en" = queryLang === "en" ? "en" : "es";
  const [copied, setCopied] = useState(false);

  const cv = getCVData(lang);
  const { profile, certifications, timeline, languages } = cv;

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const switchLanguage = (newLang: "es" | "en") => {
    router.replace(`/cv-print?lang=${newLang}`);
  };

  const copyAtsText = () => {
    const text = `===================================================================
${profile.name.toUpperCase()}
${profile.role}
Ubicación / Location: ${profile.location}
Email: contacto@abraham.dev | LinkedIn: in/abraham-martin-heras | GitHub: @superabienator
Disponibilidad: ${profile.availabilityBadge.statusText}
===================================================================

RESUMEN PROFESIONAL / EXECUTIVE SUMMARY:
${profile.executiveSummary}

PROPUESTA DE VALOR / VALUE PROPOSITION:
${profile.valueProposition}

CORE SKILLS & TECH STACK (ATS KEYWORDS):
- Desarrollo: TypeScript, JavaScript, Python, Next.js (App Router), React 19, FastAPI, Tailwind CSS, SQL, Git, Linux.
- Inteligencia Artificial & Agentes: Gemini 2.5 Flash, OpenAI API, Claude, Structured Output (JSON Schema), Prompt Engineering, RAG Contextual, Vibe Coding.
- Automatización & Ofimática: n8n, Playwright Headless, Pandas, OpenPyXL, Automatización Excel/CSV/PDF, Webhooks.
- Operaciones & Especialización: Supervisión logística crítica, Sistemas WMS/SGA, PostGIS, MapLibre, Ciberseguridad Defensiva (260h), SIEM.

EXPERIENCIA LABORAL / PROFESSIONAL EXPERIENCE:
${timeline
  .map(
    (t) => `
* ${t.role.toUpperCase()}
  Empresa / Org: ${t.organization} | Período: ${t.period} | Ubicación: ${t.location}
  ${t.summary}
  Logros clave:
  ${t.achievements.map((a) => `  - ${a}`).join("\n")}
  Tecnologías: ${t.technologies.join(", ")}
`
  )
  .join("\n")}

CERTIFICACIONES OFICIALES VERIFICADAS / OFFICIAL CERTIFICATIONS:
${certifications
  .slice(0, 8)
  .map(
    (c) =>
      `* ${c.title} — ${c.issuer} (${c.year}) [Credencial: ${c.credentialCode || "Verificada"}]`
  )
  .join("\n")}

IDIOMAS / LANGUAGES:
${languages
  .map((l: LanguageSkill) => `* ${l.language}: ${l.level} (${l.cefr}) — ${l.description}`)
  .join("\n")}
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Top certifications filter (most prominent 6)
  const topCertifications = certifications.filter(
    (c) =>
      c.title.includes("260h") ||
      c.title.includes("8,80") ||
      c.title.includes("8.80") ||
      c.title.includes("Google AI") ||
      c.credentialCode === "HSMUZE4U1VDR" ||
      c.id.includes("cybersecurity")
  ).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 py-6 px-4 print:p-0 print:bg-white print:text-black">
      {/* TOOLBAR FLOTANTE DE ACCIÓN (Oculto al imprimir) */}
      <div className="print:hidden max-w-[210mm] mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{lang === "es" ? "Volver al Portfolio" : "Back to Portfolio"}</span>
          </button>

          {/* Selector de Idioma para el CV */}
          <div className="inline-flex items-center rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-xs">
            <Globe className="h-3.5 w-3.5 text-slate-400 mx-1.5" />
            <button
              type="button"
              onClick={() => switchLanguage("es")}
              className={`px-2.5 py-1 rounded font-mono font-bold text-xs cursor-pointer ${
                lang === "es"
                  ? "bg-white dark:bg-slate-700 text-violet-700 dark:text-cyan-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => switchLanguage("en")}
              className={`px-2.5 py-1 rounded font-mono font-bold text-xs cursor-pointer ${
                lang === "en"
                  ? "bg-white dark:bg-slate-700 text-violet-700 dark:text-cyan-400 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              EN
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={copyAtsText}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 transition-all cursor-pointer"
            title="Copiar texto plano estructurado para pegar en formularios ATS de InfoJobs o LinkedIn"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? (lang === "es" ? "¡Copiado!" : "Copied!") : (lang === "es" ? "Copiar Formato ATS" : "Copy ATS Format")}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-slate-900 dark:bg-cyan-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-cyan-400 px-4 py-2 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>{lang === "es" ? "Imprimir / Guardar en PDF" : "Print / Save as PDF"}</span>
          </button>
        </div>
      </div>

      {/* HOJA A4 EJECUTIVA ATS-FRIENDLY */}
      <article
        id="cv-document"
        className="max-w-[210mm] mx-auto bg-white text-slate-900 p-8 sm:p-12 shadow-2xl rounded-xl print:shadow-none print:rounded-none print:p-0 print:max-w-none print:w-full print:border-none print:bg-white print:text-black font-sans leading-relaxed"
        style={{ minHeight: "297mm" }}
      >
        {/* 1. CABECERA EJECUTIVA */}
        <header className="border-b-2 border-slate-900 pb-4 mb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl border border-slate-300 overflow-hidden shrink-0 shadow-xs">
                <Image
                  src="/logo-amh.png"
                  alt="Abraham Martín Heras AMH"
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 uppercase">
                  {profile.name}
                </h1>
                <p className="text-sm sm:text-base font-bold text-violet-900 mt-0.5">
                  {profile.role}
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-slate-600 font-mono">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{profile.availabilityBadge.statusText}</span>
              </span>
            </div>
          </div>

          {/* Datos de Contacto y Enlaces */}
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-700 border-t border-slate-200 pt-2 font-mono">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-500" />
              <span>{profile.location}</span>
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5 text-slate-500" />
              <a href="mailto:contacto@abraham.dev" className="underline font-medium">
                contacto@abraham.dev
              </a>
            </span>
            <span>
              LinkedIn:{" "}
              <a href="https://linkedin.com/" target="_blank" rel="noreferrer" className="underline font-medium">
                linkedin.com/in/abraham-martin-heras
              </a>
            </span>
            <span>
              GitHub:{" "}
              <a href="https://github.com/superabienator/abraham-martin-heras" target="_blank" rel="noreferrer" className="underline font-medium">
                github.com/superabienator/abraham-martin-heras
              </a>
            </span>
          </div>
        </header>

        {/* 2. RESUMEN EJECUTIVO & PROPUESTA DE VALOR */}
        <section className="mb-5">
          <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-900 bg-slate-100 px-2.5 py-1 rounded mb-2 border-l-4 border-violet-700">
            {lang === "es" ? "Resumen Profesional & Perfil Híbrido" : "Professional Summary & Hybrid Profile"}
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed text-justify mb-2">
            {profile.executiveSummary}
          </p>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            <strong className="font-semibold text-slate-900">
              {lang === "es" ? "Propuesta de Valor:" : "Value Proposition:"}
            </strong>{" "}
            {profile.valueProposition}
          </p>
        </section>

        {/* 3. MATRIZ DE COMPETENCIAS & KEYWORDS ATS */}
        <section className="mb-5">
          <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-900 bg-slate-100 px-2.5 py-1 rounded mb-2.5 border-l-4 border-violet-700">
            {lang === "es" ? "Competencias Clave & Stack Tecnológico (ATS Keywords)" : "Core Competencies & Tech Stack (ATS Keywords)"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-800">
            <div className="bg-slate-50/80 p-2.5 rounded border border-slate-200/80">
              <div className="font-bold text-slate-950 mb-1">
                {lang === "es" ? "Ingeniería de Software & IA:" : "Software Engineering & AI:"}
              </div>
              <p className="text-[11px] text-slate-700 leading-snug">
                TypeScript, Python, Next.js (App Router), React 19, FastAPI, LLM API Integration (Gemini 2.5 Flash, OpenAI), Structured Outputs (JSON Schema), Prompt Engineering Sistemático, RAG Contextual, Vibe Coding, Tailwind CSS.
              </p>
            </div>

            <div className="bg-slate-50/80 p-2.5 rounded border border-slate-200/80">
              <div className="font-bold text-slate-950 mb-1">
                {lang === "es" ? "Automatización Ofimática & Operaciones:" : "Office Automation & Operations:"}
              </div>
              <p className="text-[11px] text-slate-700 leading-snug">
                n8n (Workflows Autónomos), Playwright Headless, Pandas (Data Wrangling), OpenPyXL, Automatización Excel/CSV/PDF, Webhooks, Supervisión Logística Crítica, PostGIS / MapLibre (Sistemas Geoespaciales), Ciberseguridad Defensiva (260h).
              </p>
            </div>
          </div>
        </section>

        {/* 4. EXPERIENCIA PROFESIONAL RELEVANTE */}
        <section className="mb-5">
          <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-900 bg-slate-100 px-2.5 py-1 rounded mb-3 border-l-4 border-violet-700">
            {lang === "es" ? "Experiencia Profesional Relevante" : "Relevant Professional Experience"}
          </h2>
          <div className="space-y-4">
            {timeline.slice(0, 3).map((item) => (
              <div key={item.id} className="border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-950">
                      {item.role}
                    </h3>
                    <p className="text-xs font-semibold text-violet-900">
                      {item.organization}
                    </p>
                  </div>
                  <div className="text-right text-[11px] font-mono text-slate-600 font-semibold">
                    <span>{item.period}</span> · <span>{item.location}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-700 leading-relaxed mb-1.5 text-justify">
                  {item.summary}
                </p>

                <ul className="space-y-1 list-disc list-inside text-[11px] text-slate-800 mb-1.5">
                  {item.achievements.slice(0, 3).map((ach, idx) => (
                    <li key={idx} className="leading-snug">
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                    {lang === "es" ? "Tecnologías:" : "Tech:"}
                  </span>
                  {item.technologies.slice(0, 6).map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-800 border border-slate-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. CERTIFICACIONES OFICIALES Y EDUCACIÓN */}
        <section className="mb-5">
          <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-900 bg-slate-100 px-2.5 py-1 rounded mb-2.5 border-l-4 border-violet-700">
            {lang === "es" ? "Certificaciones Oficiales Destacadas & Educación" : "Featured Official Certifications & Education"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-800">
            {topCertifications.map((cert) => (
              <div key={cert.id} className="border border-slate-200 rounded p-2 bg-slate-50/50">
                <div className="flex items-start justify-between gap-1">
                  <span className="font-bold text-[11px] text-slate-950 flex items-center gap-1">
                    <Award className="h-3 w-3 text-violet-700 shrink-0" />
                    <span>{cert.title}</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 shrink-0">{cert.year}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-600 mt-1">
                  <span>{cert.issuer}</span>
                  <span className="font-mono font-semibold text-emerald-800">
                    {cert.credentialCode || "Verificado"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. COMPETENCIAS LINGÜÍSTICAS */}
        <section>
          <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-slate-900 bg-slate-100 px-2.5 py-1 rounded mb-2 border-l-4 border-violet-700">
            {lang === "es" ? "Competencias Lingüísticas" : "Language Competencies"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            {languages.map((l: LanguageSkill) => (
              <div key={l.id} className="border border-slate-200 rounded p-2 bg-slate-50/60">
                <div className="flex items-center justify-between font-bold text-slate-950 text-[11px] mb-0.5">
                  <span>{l.language}</span>
                  <span className="font-mono text-[10px] text-violet-800 bg-violet-50 px-1 rounded border border-violet-200">
                    {l.cefr}
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 leading-snug">
                  {l.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </article>

      {/* ESTILOS ESPECÍFICOS DE IMPRESIÓN A4 */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
          }
          html, body {
            background: white !important;
            color: black !important;
            font-size: 11pt;
            width: 100%;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          nav, footer, .print\\:hidden, #ambient-canvas, .ambient-canvas {
            display: none !important;
          }
          #cv-document {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: auto !important;
          }
          a {
            text-decoration: none !important;
            color: inherit !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function CVPrintPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center font-mono text-sm">Cargando CV Ejecutivo...</div>}>
      <CVPrintContent />
    </Suspense>
  );
}
