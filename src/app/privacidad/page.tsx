import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ShieldCheck, ArrowLeft, Lock, Database, Globe, Mail } from "lucide-react";
import { cvData } from "@/data/cv-data";

export const metadata: Metadata = {
  title: "Política de Privacidad y Protección de Datos (RGPD) | Abraham Martín Heras",
  description:
    "Información sobre el tratamiento de datos personales, uso de almacenamiento técnico local y transferencia de datos a la API de Google Gemini conforme al RGPD.",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://abraham-martin-heras.dev/privacidad",
  },
};

export default function PrivacyPage() {
  const lastUpdated = "6 de noviembre de 2026";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Navegación de retorno */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-cyan-400 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Volver al Portfolio / Return to Portfolio</span>
          </Link>
        </div>

        {/* Cabecera */}
        <header className="space-y-3 border-b border-slate-200 dark:border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Cumplimiento RGPD (UE 2016/679) & LOPD-GDD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Política de Privacidad & Aviso Legal
          </h1>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
            Última actualización: {lastUpdated}
          </p>
        </header>

        {/* Secciones Legales */}
        <div className="space-y-6 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {/* 1. Responsable */}
          <section className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 p-6 space-y-3 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="h-4 w-4 text-violet-600 dark:text-cyan-400" />
              1. Responsable del Tratamiento
            </h2>
            <p>
              En cumplimiento del artículo 13 del Reglamento (UE) 2016/679 (RGPD) y de la Ley Orgánica 3/2018 (LOPD-GDD), se informa de que el responsable del tratamiento de los datos que pudieran facilitarse a través de este sitio web es:
            </p>
            <ul className="list-disc pl-5 space-y-1 font-mono text-xs text-slate-700 dark:text-slate-300">
              <li><strong>Titular:</strong> {cvData.profile.name}</li>
              <li><strong>Especialidad:</strong> {cvData.profile.role}</li>
              <li><strong>Correo de Contacto / DPO:</strong> contacto@abraham.dev</li>
              <li><strong>Ubicación:</strong> España (Operativa Remota y Presencial)</li>
            </ul>
          </section>

          {/* 2. Finalidades y Base Jurídica */}
          <section className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 p-6 space-y-3 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="h-4 w-4 text-violet-600 dark:text-cyan-400" />
              2. Finalidad del Tratamiento y Base Jurídica
            </h2>
            <p>
              Este sitio web opera como un demostrador técnico y portfolio profesional. Las finalidades para las cuales se procesa información son:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                <strong>Atención de consultas profesionales y de reclutamiento:</strong> Facilitar a reclutadores, directores técnicos y empresas colaboradoras la evaluación de la trayectoria, certificaciones oficiales y competencias de Abraham Martín Heras. Base jurídica: Consentimiento expreso del interesado al formular una consulta o contactar por correo electrónico (Art. 6.1.a RGPD) e interés legítimo mutuo (Art. 6.1.f RGPD).
              </li>
              <li>
                <strong>Demostrador interactivo &quot;Ask My CV&quot; (IA Conversacional):</strong> Procesar en tiempo real las preguntas que el usuario escribe sobre el perfil profesional mediante modelos de lenguaje (LLM).
              </li>
            </ol>
          </section>

          {/* 3. Proveedores y Transferencias Internacionales */}
          <section className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 p-6 space-y-3 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-violet-600 dark:text-cyan-400" />
              3. Proveedores Tecnológicos y Transferencia Internacional de Datos
            </h2>
            <p>
              Para el funcionamiento de la inferencia del asistente interactivo, las consultas formuladas en el módulo de chat se transmiten de forma cifrada a través de HTTPS a la API de <strong>Google Gemini (Google LLC)</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Subencargado:</strong> Google LLC (1600 Amphitheatre Parkway, Mountain View, CA 94043, EE. UU.).
              </li>
              <li>
                <strong>Garantías de Transferencia:</strong> Google LLC está adherida al Marco de Privacidad de Datos UE-EE. UU. (Data Privacy Framework) y opera bajo Cláusulas Contractuales Tipo (SCC) aprobadas por la Comisión Europea.
              </li>
              <li>
                <strong>Recomendación al Usuario:</strong> Se ruega expresamente a los usuarios no introducir datos personales sensibles, credenciales, secretos comerciales ni información corporativa confidencial en la barra de consulta del asistente.
              </li>
            </ul>
          </section>

          {/* 4. Almacenamiento Técnico Local (localStorage) */}
          <section className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 p-6 space-y-3 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="h-4 w-4 text-violet-600 dark:text-cyan-400" />
              4. Ausencia de Rastreo Publicitario y Almacenamiento Técnico Local
            </h2>
            <p>
              Este sitio web <strong>no utiliza cookies publicitarias, píxeles de seguimiento ni herramientas de analítica invasiva de terceros</strong> (como Google Analytics o Meta Pixel).
            </p>
            <p>
              Únicamente se emplean dos identificadores estrictamente técnicos en el almacenamiento local del navegador (<code>localStorage</code>), los cuales se encuentran legalmente exentos de la obligación de recabar consentimiento previo al amparo del artículo 22.2 de la LSSI-CE y de la Guía sobre el uso de cookies de la AEPD:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 font-mono text-xs">
                <span className="font-bold text-violet-600 dark:text-cyan-400">portfolio_theme_mode</span>
                <p className="mt-1 text-slate-600 dark:text-slate-400 font-sans">
                  Almacena el tema visual elegido (&quot;pearl&quot; o &quot;deep-space&quot;) para evitar destellos blancos al recargar.
                </p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 font-mono text-xs">
                <span className="font-bold text-violet-600 dark:text-cyan-400">preferred_lang</span>
                <p className="mt-1 text-slate-600 dark:text-slate-400 font-sans">
                  Guarda la preferencia lingüística (&quot;es&quot; o &quot;en&quot;) elegida voluntariamente por el visitante.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Derechos ARCO-POL */}
          <section className="rounded-2xl border border-slate-200/90 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 p-6 space-y-3 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              5. Derechos del Usuario (ARCO-POL)
            </h2>
            <p>
              Cualquier usuario puede ejercitar en cualquier momento sus derechos reconocidos en el RGPD:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Acceso:</strong> Conocer si sus datos están siendo tratados y con qué fin.</li>
              <li><strong>Rectificación:</strong> Corregir cualquier dato inexacto o incompleto.</li>
              <li><strong>Supresión (&quot;Derecho al Olvido&quot;):</strong> Solicitar la eliminación inmediata de sus datos.</li>
              <li><strong>Limitación del Tratamiento y Portabilidad:</strong> Solicitar la limitación o copia estructurada de su información.</li>
              <li><strong>Oposición:</strong> Oponerse al tratamiento basado en interés legítimo.</li>
            </ul>
            <p className="pt-2">
              Para ejercitar cualquiera de estos derechos, basta con enviar un correo electrónico con el asunto <em>&quot;Protección de Datos / Derechos RGPD&quot;</em> a:{" "}
              <a href="mailto:contacto@abraham.dev" className="text-violet-600 dark:text-cyan-400 underline font-semibold">
                contacto@abraham.dev
              </a>.
            </p>
            <p className="text-xs text-slate-500">
              Asimismo, se le asiste el derecho a presentar una reclamación ante la autoridad de control competente, en España la Agencia Española de Protección de Datos (<a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="underline">www.aepd.es</a>).
            </p>
          </section>
        </div>

        {/* Footer de la página de privacidad */}
        <footer className="pt-6 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>&copy; 2026 {cvData.profile.name}. Todos los derechos reservados.</span>
          <Link href="/" className="hover:text-slate-800 dark:hover:text-white underline">
            Volver a la portada principal
          </Link>
        </footer>
      </div>
    </div>
  );
}
