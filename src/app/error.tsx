"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log defensivo sin fugar tokens ni credenciales
    console.error("Application runtime error intercepted by ErrorBoundary:", error.message);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-md w-full rounded-3xl border border-rose-200 dark:border-rose-500/20 bg-white/90 dark:bg-slate-900/90 p-8 shadow-xl space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Interrupción Temporal en la Vista
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Se ha producido un error imprevisto en el renderizado cliente. Los datos de la candidatura y la información profesional están completamente seguros.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reintentar</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Inicio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
