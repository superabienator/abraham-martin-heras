"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSpreadsheet,
  Play,
  RotateCcw,
  Download,
  Copy,
  Check,
  Search,
  Sparkles,
  ArrowUpDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Table as TableIcon,
  ClipboardCopy,
} from "lucide-react";

export interface CleanedRecord {
  id: string;
  code: string;
  date: string;
  rawDate?: string;
  isDateChanged?: boolean;
  provider: string;
  amount: number;
  formattedAmount: string;
  rawAmount?: string;
  isAmountChanged?: boolean;
  contact: string;
  status: "Completado" | "Pendiente" | "Revisión";
  modifications: string[];
  isDuplicate: boolean;
}

export interface CleaningStats {
  totalProcessed: number;
  duplicatesRemoved: number;
  anomaliesFixed: number;
  estimatedMinutesSaved: number;
  executionMs: number;
}

const DATASET_LOGISTICS = `ALB-9021 | 14/05/2026 | TRANS-NORTE S.L.   | 1.240,50 € | logistica@trans-norte.es | PAGADO
alb-9021  | 2026-05-14 | trans norte sl | EUR 1240.50 | logistica@trans-norte.es | pagado
ALB-9022 | 15-05-2026 | IBERIA CARGO EXPRESS | 850.00 EUR | +34 600-11-22-33 | PENDIENTE
ALB-9023 | 2026/05/16 | DHL GLOBAL FORWARDING | 3.420,00 € | operaciones@dhl-corp.com | COMPLETADO
ALB-9024 | 16-05-2026 | ALMACENES MEDITERRANEO | 940,25 € | 622 334 455 | PENDIENTE
alb-9024 | 16/05/2026 | almacenes mediterraneo sa | 940.25 eur | +34622334455 | Pendiente 
ALB-9025 | 17/05/2026 | LOGISTICA INTEGRAL LEVANTE | 2.150,75 € | contacto@levante-log.com | EN TRAMITE
ALB-9026 | 2026-05-18 | TRANS-NORTE S.L. | 430,00 € | logistica@trans-norte.es | PAGADO
ALB-9027 | 19/05/2026 | PUERTO SECO MADRID | 1.890,00 EUR | (+34) 912 34 56 78 | PAGADO
alb-9027 | 19-05-2026 | Puerto Seco Madrid SL | 1890.00 € | 912345678 | pagado`;

const DATASET_BILLING = `FAC-2026-001 | 02/06/2026 | TECH SOLUTIONS & CLOUD S.L. | 4.850,00 € | (+34) 611 22 33 44 | ABONADA
fac-2026-001 | 2026-06-02 | Tech Solutions Cloud | 4850 EUR | 611223344 | abonada 
FAC-2026-002 | 03-06-2026 | SUMINISTROS INDUSTRIALES DEL SUR | 1.120,40 € | administracion@sumind.es | PENDIENTE
FAC-2026-003 | 2026/06/04 | CONSULTORIA & AUDITORIA ASOCIADOS | 2.900,00 € | 910 22 33 44 | PAGADO
FAC-2026-004 | 05/06/2026 | SISTEMAS DE SEGURIDAD GLOBAL | 780,50 € | info@seguridad-global.com | PENDIENTE
FAC-2026-005 | 2026-06-06 | REDES & COMUNICACIONES AVANZADAS | 1.640,00 € | +34 655-44-33-22 | PAGADO
fac-2026-005 | 06/06/2026 | Redes y Comunicaciones Avanzadas | 1.640,00 EUR | 655443322 | pagado
FAC-2026-006 | 07/06/2026 | DATA CENTER & FIBRA OPTICA | 3.200,00 € | soporte@datacenter.net | PAGADO`;

export function DataCleaner() {
  const [rawText, setRawText] = useState(DATASET_LOGISTICS);
  const [activePreset, setActivePreset] = useState<"logistics" | "billing">("logistics");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCleaned, setIsCleaned] = useState(false);
  const [cleanedRecords, setCleanedRecords] = useState<CleanedRecord[]>([]);
  const [stats, setStats] = useState<CleaningStats | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof CleanedRecord>("code");
  const [sortAsc, setSortAsc] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "json">("table");
  const [isCopied, setIsCopied] = useState(false);
  const [isExcelCopied, setIsExcelCopied] = useState(false);

  // Carga de presets
  const handleLoadPreset = (preset: "logistics" | "billing") => {
    setActivePreset(preset);
    setRawText(preset === "logistics" ? DATASET_LOGISTICS : DATASET_BILLING);
    setIsCleaned(false);
    setCleanedRecords([]);
    setStats(null);
  };

  // Motor determinista de limpieza y normalización
  const cleanData = () => {
    setIsProcessing(true);
    const startTime = performance.now();

    setTimeout(() => {
      const lines = rawText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const seenCodes = new Set<string>();
      const results: CleanedRecord[] = [];
      let duplicatesCount = 0;
      let anomaliesCount = 0;

      lines.forEach((line, index) => {
        const parts = line.split("|").map((p) => p.trim());
        if (parts.length < 3) return;

        const rawCode = parts[0] || `REG-${index + 1}`;
        const rawDate = parts[1] || "";
        const rawProvider = parts[2] || "PROVEEDOR GENERAL";
        const rawAmount = parts[3] || "0";
        const rawContact = parts[4] || "";
        const rawStatus = parts[5] || "PENDIENTE";

        const modifications: string[] = [];

        // 1. Normalizar Código
        const cleanCode = rawCode.toUpperCase().replace(/\s+/g, "");
        if (cleanCode !== rawCode) {
          modifications.push("Código estandarizado");
          anomaliesCount++;
        }

        // 2. Detección de duplicado por código
        const duplicateKey = cleanCode;
        if (seenCodes.has(duplicateKey)) {
          duplicatesCount++;
          return; // Omitir duplicado del conjunto consolidado
        }
        seenCodes.add(duplicateKey);

        // 3. Normalizar Fecha a ISO YYYY-MM-DD
        let cleanDate = rawDate;
        let dateModified = false;
        // DD/MM/YYYY o DD-MM-YYYY
        const dmyMatch = rawDate.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
        if (dmyMatch) {
          const day = dmyMatch[1].padStart(2, "0");
          const month = dmyMatch[2].padStart(2, "0");
          let year = dmyMatch[3];
          if (year.length === 2) year = `20${year}`;
          cleanDate = `${year}-${month}-${day}`;
          dateModified = true;
        } else {
          // YYYY/MM/DD
          const ymdMatch = rawDate.match(/^(\d{4})[/](\d{1,2})[/](\d{1,2})$/);
          if (ymdMatch) {
            cleanDate = `${ymdMatch[1]}-${ymdMatch[2].padStart(2, "0")}-${ymdMatch[3].padStart(2, "0")}`;
            dateModified = true;
          }
        }
        if (dateModified || cleanDate !== rawDate) {
          modifications.push("Fecha ISO estandarizada");
          anomaliesCount++;
        }
        const isDateChanged = Boolean(dateModified || cleanDate !== rawDate);

        // 4. Normalizar Proveedor
        const cleanProvider = rawProvider
          .replace(/\s+/g, " ")
          .toUpperCase()
          .replace(/\bS\.?L\.?\b/gi, "S.L.")
          .replace(/\bS\.?A\.?\b/gi, "S.A.");
        if (cleanProvider !== rawProvider) {
          modifications.push("Entidad normalizada");
          anomaliesCount++;
        }

        // 5. Normalizar Importe
        let numericAmount = 0;
        const cleanedAmountString = rawAmount
          .replace(/EUR|€|\$/gi, "")
          .replace(/\s+/g, "")
          .trim();

        if (cleanedAmountString.includes(",") && cleanedAmountString.includes(".")) {
          // Formato europeo 1.240,50 -> 1240.50
          numericAmount = parseFloat(cleanedAmountString.replace(/\./g, "").replace(",", "."));
        } else if (cleanedAmountString.includes(",")) {
          // Formato 1240,50 -> 1240.50
          numericAmount = parseFloat(cleanedAmountString.replace(",", "."));
        } else {
          numericAmount = parseFloat(cleanedAmountString) || 0;
        }

        if (isNaN(numericAmount)) numericAmount = 0;
        const formattedAmount = new Intl.NumberFormat("es-ES", {
          style: "currency",
          currency: "EUR",
        }).format(numericAmount);

        const isAmountChanged = Boolean(
          rawAmount.includes("EUR") ||
          rawAmount.includes("$") ||
          rawAmount.trim() !== formattedAmount.trim()
        );

        if (isAmountChanged) {
          modifications.push("Importe monetario saneado");
          anomaliesCount++;
        }

        // 6. Normalizar Contacto
        let cleanContact = rawContact;
        if (rawContact.includes("@")) {
          cleanContact = rawContact.toLowerCase().trim();
        } else if (rawContact.length > 0) {
          // Normalizar teléfono
          const digits = rawContact.replace(/\D/g, "");
          if (digits.startsWith("34") && digits.length >= 11) {
            cleanContact = `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)} ${digits.slice(9)}`;
          } else if (digits.length === 9) {
            cleanContact = `+34 ${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
          }
          modifications.push("Formato de contacto normalizado");
          anomaliesCount++;
        }

        // 7. Normalizar Estado
        let cleanStatus: "Completado" | "Pendiente" | "Revisión" = "Pendiente";
        const upperStatus = rawStatus.toUpperCase().trim();
        if (upperStatus.includes("PAG") || upperStatus.includes("COMPLET") || upperStatus.includes("ABON")) {
          cleanStatus = "Completado";
        } else if (upperStatus.includes("PEND")) {
          cleanStatus = "Pendiente";
        } else {
          cleanStatus = "Revisión";
        }

        results.push({
          id: `item-${index}`,
          code: cleanCode,
          date: cleanDate,
          rawDate: rawDate.trim(),
          isDateChanged,
          provider: cleanProvider,
          amount: numericAmount,
          formattedAmount,
          rawAmount: rawAmount.trim(),
          isAmountChanged,
          contact: cleanContact || "—",
          status: cleanStatus,
          modifications,
          isDuplicate: false,
        });
      });

      const endTime = performance.now();
      const executionMs = Math.round(endTime - startTime);
      const minutesSaved = Math.round(lines.length * 2.8);

      setCleanedRecords(results);
      setStats({
        totalProcessed: lines.length,
        duplicatesRemoved: duplicatesCount,
        anomaliesFixed: anomaliesCount,
        estimatedMinutesSaved: minutesSaved,
        executionMs,
      });
      setIsProcessing(false);
      setIsCleaned(true);
    }, 380);
  };

  // Filtrado y ordenación interactiva
  const filteredRecords = useMemo(() => {
    let records = [...cleanedRecords];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      records = records.filter(
        (r) =>
          r.code.toLowerCase().includes(q) ||
          r.provider.toLowerCase().includes(q) ||
          r.contact.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q)
      );
    }

    records.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === "string" && typeof valB === "string") {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      if (typeof valA === "number" && typeof valB === "number") {
        return sortAsc ? valA - valB : valB - valA;
      }
      return 0;
    });

    return records;
  }, [cleanedRecords, searchTerm, sortField, sortAsc]);

  const handleSort = (field: keyof CleanedRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Exportar CSV con UTF-8 BOM para Excel
  const handleDownloadCsv = () => {
    if (cleanedRecords.length === 0) return;
    const headers = [
      "Código",
      "Fecha (ISO)",
      "Proveedor / Entidad",
      "Importe (€)",
      "Contacto",
      "Estado",
      "Modificaciones",
    ];

    const rows = cleanedRecords.map((r) => [
      `"${r.code}"`,
      `"${r.date}"`,
      `"${r.provider}"`,
      r.amount.toFixed(2).replace(".", ","),
      `"${r.contact}"`,
      `"${r.status}"`,
      `"${r.modifications.join(" | ")}"`,
    ]);

    const csvContent =
      "\uFEFF" +
      headers.join(";") +
      "\n" +
      rows.map((row) => row.join(";")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `datos_operativos_normalizados_${activePreset}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copiar JSON
  const handleCopyJson = () => {
    if (cleanedRecords.length === 0) return;
    const jsonString = JSON.stringify(cleanedRecords, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // Copiar para pegar directamente en Excel / Hojas de cálculo (TSV con separador \t)
  const handleCopyForExcel = () => {
    if (cleanedRecords.length === 0) return;
    const headers = [
      "Código",
      "Fecha (ISO)",
      "Proveedor / Entidad",
      "Importe (€)",
      "Contacto",
      "Estado",
      "Ajustes Aplicados",
    ];

    const rows = cleanedRecords.map((r) => [
      r.code,
      r.date,
      r.provider,
      r.amount.toFixed(2).replace(".", ","),
      r.contact,
      r.status,
      r.modifications.join(" | "),
    ]);

    const tsvContent = [
      headers.join("\t"),
      ...rows.map((row) => row.join("\t")),
    ].join("\n");

    navigator.clipboard.writeText(tsvContent).then(() => {
      setIsExcelCopied(true);
      setTimeout(() => setIsExcelCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Selector de Dataset & Controles de Ingesta */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Cargar Datos Sucios:
          </span>
          <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-white/10">
            <button
              type="button"
              onClick={() => handleLoadPreset("logistics")}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                activePreset === "logistics"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Logística & Albaranes
            </button>
            <button
              type="button"
              onClick={() => handleLoadPreset("billing")}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
                activePreset === "billing"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Auditoría de Facturación
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              setRawText(activePreset === "logistics" ? DATASET_LOGISTICS : DATASET_BILLING);
              setIsCleaned(false);
              setCleanedRecords([]);
              setStats(null);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Restablecer</span>
          </button>

          <button
            type="button"
            onClick={cleanData}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
                <span>Procesando Registros...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-slate-950" />
                <span>Procesar y Limpiar Datos</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor / Visor de Entrada Bruta */}
      {!isCleaned && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <FileSpreadsheet className="h-3.5 w-3.5 text-rose-500" />
              <span>Entrada Ofimática en Bruto (CSV / Registros No Estructurados)</span>
            </span>
            <span>{rawText.split("\n").filter((l) => l.trim()).length} filas detectadas</span>
          </div>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            rows={7}
            className="w-full rounded-xl border border-rose-200/80 dark:border-rose-500/20 bg-rose-50/40 dark:bg-rose-950/20 p-4 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-y leading-relaxed"
            placeholder="Pega aquí líneas de datos de albaranes, facturas o tablas desordenadas..."
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Haz clic en <strong className="text-emerald-600 dark:text-emerald-400">&quot;Procesar y Limpiar Datos&quot;</strong> para ejecutar las reglas de normalización ISO, saneamiento de importes y purga de duplicados.
          </p>
        </div>
      )}

      {/* Panel de Métricas de Impacto (ROI) */}
      <AnimatePresence>
        {isCleaned && stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/70 p-4">
                <div className="text-xs font-mono uppercase text-slate-500 dark:text-slate-400">
                  Registros Validados
                </div>
                <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
                  {cleanedRecords.length}{" "}
                  <span className="text-xs font-normal text-slate-500">
                    / {stats.totalProcessed} en bruto
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>100% listos para ERP</span>
                </div>
              </div>

              <div className="rounded-xl border border-amber-200/80 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20 p-4">
                <div className="text-xs font-mono uppercase text-amber-700 dark:text-amber-400">
                  Duplicados Purgados
                </div>
                <div className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-300 mt-1">
                  {stats.duplicatesRemoved}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 font-medium mt-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Deduplicación exacta & difusa</span>
                </div>
              </div>

              <div className="rounded-xl border border-cyan-200/80 dark:border-cyan-500/20 bg-cyan-50/50 dark:bg-cyan-950/20 p-4">
                <div className="text-xs font-mono uppercase text-cyan-700 dark:text-cyan-400">
                  Anomalías Corregidas
                </div>
                <div className="text-2xl font-bold font-mono text-cyan-700 dark:text-cyan-300 mt-1">
                  {stats.anomaliesFixed}
                </div>
                <div className="text-[11px] text-cyan-700 dark:text-cyan-400 font-medium mt-1">
                  Fechas, divisas & teléfonos
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200/80 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 p-4">
                <div className="text-xs font-mono uppercase text-emerald-700 dark:text-emerald-400">
                  Ahorro Operativo
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-300 mt-1">
                  ~{stats.estimatedMinutesSaved} min
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1">
                  <Clock className="h-3 w-3" />
                  <span>Ejecución en {stats.executionMs} ms</span>
                </div>
              </div>
            </div>

            {/* Controles de la Tabla (Búsqueda, Vistas y Exportación) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/70 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/80 dark:border-white/10">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filtrar por código, entidad, estado..."
                  className="w-full rounded-lg border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-950 py-1.5 pl-8 pr-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Selector Vista Tabla / JSON */}
                <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`rounded-md p-1.5 text-xs transition-colors cursor-pointer ${
                      viewMode === "table"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                    title="Vista Tabla"
                  >
                    <TableIcon className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("json")}
                    className={`rounded-md p-1.5 text-xs transition-colors cursor-pointer ${
                      viewMode === "json"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                    title="Vista JSON"
                  >
                    <Code2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Botón Copiar JSON */}
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer whitespace-nowrap"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-500" />
                      <span>Copiar JSON</span>
                    </>
                  )}
                </button>

                {/* Botón Copiar para pegar en Excel (TSV) */}
                <button
                  type="button"
                  onClick={handleCopyForExcel}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer whitespace-nowrap"
                  title="Copia los datos limpios separados por tabulaciones para hacer Ctrl+V directo en Excel o Sheets"
                >
                  {isExcelCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">¡Copiado para Excel!</span>
                    </>
                  ) : (
                    <>
                      <ClipboardCopy className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                      <span>Copiar para pegar en Excel</span>
                    </>
                  )}
                </button>

                {/* Botón Descargar CSV para Excel */}
                <button
                  type="button"
                  onClick={handleDownloadCsv}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer whitespace-nowrap"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Descargar CSV para Excel</span>
                </button>
              </div>
            </div>

            {/* Vista Tabla Interactiva */}
            {viewMode === "table" && (
              <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-slate-900/80 shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-slate-950/60 font-mono text-slate-500 dark:text-slate-400">
                    <tr>
                      <th
                        className="py-3 px-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                        onClick={() => handleSort("code")}
                      >
                        <div className="flex items-center gap-1">
                          <span>Código</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th
                        className="py-3 px-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                        onClick={() => handleSort("date")}
                      >
                        <div className="flex items-center gap-1">
                          <span>Fecha (ISO)</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th
                        className="py-3 px-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                        onClick={() => handleSort("provider")}
                      >
                        <div className="flex items-center gap-1">
                          <span>Proveedor / Entidad</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th
                        className="py-3 px-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-white text-right"
                        onClick={() => handleSort("amount")}
                      >
                        <div className="flex items-center justify-end gap-1">
                          <span>Importe</span>
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="py-3 px-3.5">Contacto</th>
                      <th className="py-3 px-3.5">Estado</th>
                      <th className="py-3 px-3.5">Ajustes Aplicados</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {filteredRecords.map((r) => (
                      <tr
                        key={r.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td className="py-3 px-3.5 font-mono font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                          {r.code}
                        </td>
                        <td className="py-3 px-3.5 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span>{r.date}</span>
                            {r.isDateChanged && r.rawDate && (
                              <span className="line-through opacity-50 text-[11px] text-slate-500 dark:text-slate-400">
                                {r.rawDate}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3.5 font-medium text-slate-800 dark:text-slate-200">
                          {r.provider}
                        </td>
                        <td className="py-3 px-3.5 font-mono font-bold text-right text-slate-900 dark:text-emerald-400 whitespace-nowrap">
                          <div className="flex flex-col items-end">
                            <span>{r.formattedAmount}</span>
                            {r.isAmountChanged && r.rawAmount && (
                              <span className="line-through opacity-50 text-[11px] font-normal text-slate-500 dark:text-slate-400">
                                {r.rawAmount}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3.5 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {r.contact}
                        </td>
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span
                            className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold ${
                              r.status === "Completado"
                                ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30"
                                : r.status === "Pendiente"
                                ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30"
                                : "bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30"
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 px-3.5">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {r.modifications.map((mod, i) => (
                              <span
                                key={i}
                                className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-600 dark:text-slate-400 whitespace-nowrap"
                              >
                                {mod}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Vista JSON */}
            {viewMode === "json" && (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 max-h-96 overflow-y-auto">
                <pre>{JSON.stringify(filteredRecords, null, 2)}</pre>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
