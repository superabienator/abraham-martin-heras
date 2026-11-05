#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

echo "================================================================"
echo "🚀 Ingesta Incremental de CV & Certificaciones (Gemini 2.5 Flash)"
echo "================================================================"
echo "📂 Directorio del proyecto: ${PROJECT_ROOT}"
echo "📥 Bandeja de entrada:      ${SCRIPT_DIR}"
echo "----------------------------------------------------------------"

cd "${PROJECT_ROOT}"

echo "▶ Paso 1: Ejecutando motor de sincronización (cv-inbox/sync-cv.mjs)..."
node "${SCRIPT_DIR}/sync-cv.mjs"

echo "----------------------------------------------------------------"
echo "▶ Paso 2: Verificando integridad de tipos TypeScript (tsc --noEmit)..."
npx tsc --noEmit
echo "✔ Verificación TypeScript superada sin errores."

echo "================================================================"
echo "✨ Proceso finalizado correctamente."
echo "================================================================"
