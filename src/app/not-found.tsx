import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-md w-full rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 p-8 shadow-xl space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 dark:bg-cyan-500/10 text-violet-600 dark:text-cyan-400 border border-violet-500/20 dark:border-cyan-500/20">
          <Compass className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-cyan-400">
            HTTP 404 · Ruta no localizada
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Página No Encontrada
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            La coordenada o recurso solicitado no existe o ha sido reubicado en la nueva arquitectura del portfolio.
          </p>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Volver a la Portada</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
