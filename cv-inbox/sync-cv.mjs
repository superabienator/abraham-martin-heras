#!/usr/bin/env node
/**
 * cv-inbox/sync-cv.mjs
 * Sistema local de ingesta incremental multimodal de documentos curriculares
 * con checkpoints SHA-256 y actualización automática de `src/data/cv-data.ts`
 * mediante Gemini 2.5 Flash REST API (0 dependencias externas).
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const INBOX_DIR = path.dirname(__filename);
const ROOT_DIR = path.resolve(INBOX_DIR, "..");

const CHECKPOINT_PATH = path.join(INBOX_DIR, ".checkpoint.json");
const CV_DATA_PATH = path.join(ROOT_DIR, "src", "data", "cv-data.ts");
const CV_BACKUP_PATH = path.join(ROOT_DIR, "src", "data", "cv-data.backup.ts");
const PUBLIC_DIR = path.join(ROOT_DIR, "public");
const ATS_MD_PATH = path.join(PUBLIC_DIR, "CV-Abraham-ATS.md");

const IGNORED_FILES = new Set([
  "sync-cv.mjs",
  "actualizar-cv.sh",
  "README-INBOX.md",
  ".checkpoint.json",
  ".DS_Store",
]);

const MIME_MAP = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".txt": "text/plain",
  ".md": "text/plain",
};

/**
 * Carga variables desde `.env.local` o `.env` sin dependencias externas (dotenv).
 */
function loadApiKey() {
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY.trim();
  }

  const envFiles = [
    path.join(ROOT_DIR, ".env.local"),
    path.join(ROOT_DIR, ".env"),
  ];

  for (const envPath of envFiles) {
    if (!fs.existsSync(envPath)) continue;
    const raw = fs.readFileSync(envPath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIndex = trimmed.indexOf("=");
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      let value = trimmed.slice(eqIndex + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (key === "GEMINI_API_KEY" && value) {
        return value;
      }
    }
  }

  return null;
}

/**
 * Lee o inicializa `cv-inbox/.checkpoint.json`.
 */
function loadOrInitCheckpoint() {
  if (!fs.existsSync(CHECKPOINT_PATH)) {
    const initial = {
      version: 1,
      updatedAt: new Date().toISOString(),
      processedHashes: {},
    };
    fs.writeFileSync(CHECKPOINT_PATH, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(CHECKPOINT_PATH, "utf8"));
    if (!parsed.processedHashes || typeof parsed.processedHashes !== "object") {
      parsed.processedHashes = {};
    }
    return parsed;
  } catch {
    const fallback = {
      version: 1,
      updatedAt: new Date().toISOString(),
      processedHashes: {},
    };
    fs.writeFileSync(CHECKPOINT_PATH, JSON.stringify(fallback, null, 2), "utf8");
    return fallback;
  }
}

/**
 * Calcula el hash SHA-256 de un Buffer.
 */
function sha256Buffer(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

/**
 * Escanea `cv-inbox/` y devuelve los archivos válidos junto con su hash y buffer.
 */
function scanInboxFiles() {
  const entries = fs.readdirSync(INBOX_DIR, { withFileTypes: true });
  const validFiles = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const fileName = entry.name;
    if (fileName.startsWith(".") || IGNORED_FILES.has(fileName)) continue;

    const ext = path.extname(fileName).toLowerCase();
    const mimeType = MIME_MAP[ext];
    if (!mimeType) {
      console.warn(`⚠️  Ignorando archivo con extensión no soportada: ${fileName}`);
      continue;
    }

    const fullPath = path.join(INBOX_DIR, fileName);
    const buffer = fs.readFileSync(fullPath);
    const hash = sha256Buffer(buffer);

    validFiles.push({
      fileName,
      fullPath,
      ext,
      mimeType,
      buffer,
      hash,
    });
  }

  return validFiles;
}

/**
 * Limpia posibles bloques markdown (```ts ... ```) de la respuesta del LLM.
 */
function extractCleanTypeScript(rawText) {
  let cleaned = rawText.trim();
  const fencedMatch = cleaned.match(/^```(?:typescript|ts)?\s*\r?\n([\s\S]*?)\r?\n```$/i);
  if (fencedMatch) {
    cleaned = fencedMatch[1].trim();
  }
  return cleaned + "\n";
}

async function main() {
  console.log("🔍 [1/3] Escaneando carpeta cv-inbox/ y verificando checkpoints SHA-256...");

  const checkpoint = loadOrInitCheckpoint();
  const allValidFiles = scanInboxFiles();

  const newFiles = allValidFiles.filter(
    (file) => !checkpoint.processedHashes[file.hash]
  );

  if (newFiles.length === 0) {
    console.log("✅ Todo sincronizado. 0 archivos nuevos (0 tokens consumidos).");
    return;
  }

  console.log(
    `📄 Detectados ${newFiles.length} documento(s) nuevo(s) o modificado(s):`
  );
  for (const file of newFiles) {
    console.log(`   • ${file.fileName} [${file.mimeType}] (sha256: ${file.hash.slice(0, 12)}...)`);
  }

  const apiKey = loadApiKey();
  if (!apiKey) {
    console.error(
      "❌ Error: No se encontró GEMINI_API_KEY en el entorno, `.env.local` ni `.env`."
    );
    console.error(
      "   Añade GEMINI_API_KEY=\"tu_api_key\" en `.env.local` y vuelve a ejecutar."
    );
    process.exit(1);
  }

  if (!fs.existsSync(CV_DATA_PATH)) {
    console.error(`❌ Error: No se encontró el archivo objetivo en ${CV_DATA_PATH}`);
    process.exit(1);
  }

  const currentCvCode = fs.readFileSync(CV_DATA_PATH, "utf8");

  console.log("🤖 [2/3] Ejecutando extracción multimodal con Gemini 2.5 Flash...");

  const systemPrompt = `Eres un Arquitecto Full Stack Senior y Especialista en Extracción Documental Curricular.
Tu tarea es analizar nuevos certificados, diplomas, cursos o notas de experiencia laboral/académica adjuntos y actualizar el archivo \`src/data/cv-data.ts\` de un Portfolio y CV Interactivo.

REGLAS ESTRICTAS E INQUEBRANTABLES:
1. Analiza cada documento adjunto (PDF, imagen o texto) y extrae:
   - Nombre oficial del certificado, curso o puesto.
   - Entidad emisora u organización.
   - Fecha o período de realización y horas lectivas si constan (ej. "260h", "120h").
   - Competencias clave cubiertas y categoría correspondiente ("Ciberseguridad" | "Inteligencia Artificial" | "Python & Datos" | "Automatización").
2. PRIVACIDAD Y FILTRADO PII (CRÍTICO):
   - Filtra y OMITE ESTRICTAMENTE cualquier dato sensible privado que aparezca en los diplomas o documentos: DNI/NIE/Pasaporte, dirección postal o domicilio, teléfono personal, fecha/lugar de nacimiento, firmas manuscritas o códigos QR privados de verificación nominal.
3. INTEGRIDAD BILINGÜE Y DE TYPESCRIPT:
   - Respeta al 100% todas las interfaces TypeScript existentes en \`src/data/cv-data.ts\` (\`AccentColor\`, \`SocialLink\`, \`HeroMetric\`, \`ProfileData\`, \`LanguageSkill\`, \`SkillItem\`, \`BentoCategory\`, \`CertificationItem\`, \`PlaygroundTabConfig\`, \`TimelineEntry\`, \`CVData\`).
   - Integra la nueva información en \`certifications\`, \`bentoCategories\` y/o \`timeline\` tanto en \`cvDataEs\` como en su versión traducida \`cvDataEn\`, SIN borrar ni duplicar la información previa.
   - Conserva obligatoriamente los exports \`export const cvDataEs\`, \`export const cvDataEn\`, \`export const cvData\`, \`export function getCVData\` y \`export const uiDictionary\`.
   - Devuelve ÚNICAMENTE el código fuente TypeScript completo y válido de \`src/data/cv-data.ts\`, sin explicaciones adicionales ni bloques markdown envolventes.`;

  const userParts = [
    {
      text: `Aquí tienes el contenido actual de \`src/data/cv-data.ts\`:\n\n\`\`\`typescript\n${currentCvCode}\n\`\`\`\n\nA continuación se adjuntan ${newFiles.length} nuevo(s) documento(s) para integrar en \`src/data/cv-data.ts\`:`,
    },
  ];

  for (const file of newFiles) {
    userParts.push({
      text: `Documento adjunto: "${file.fileName}" (SHA-256: ${file.hash})`,
    });
    userParts.push({
      inlineData: {
        mimeType: file.mimeType,
        data: file.buffer.toString("base64"),
      },
    });
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
    apiKey
  )}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: "user",
          parts: userParts,
        },
      ],
      generationConfig: {
        temperature: 0.1,
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      `❌ Error en la petición a Gemini 2.5 Flash (HTTP ${response.status}):\n${errorBody}`
    );
    process.exit(1);
  }

  const payload = await response.json();
  const generatedText =
    payload?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("\n") || "";

  if (!generatedText.trim()) {
    console.error("❌ Error: Gemini devolvió una respuesta vacía.");
    process.exit(1);
  }

  const updatedCvCode = extractCleanTypeScript(generatedText);

  if (
    !updatedCvCode.includes("export interface CVData") ||
    (!updatedCvCode.includes("export const cvData") && !updatedCvCode.includes("export const cvDataEs"))
  ) {
    console.error(
      "❌ Error de validación: El código generado no conserva la estructura esperada (`export interface CVData` / `export const cvData`). No se ha modificado `src/data/cv-data.ts`."
    );
    process.exit(1);
  }

  console.log("💾 [3/3] Guardando backup de seguridad, actualizando src/data/cv-data.ts y regenerando ATS...");

  // 1. Copia de seguridad
  fs.writeFileSync(CV_BACKUP_PATH, currentCvCode, "utf8");

  // 2. Escritura del nuevo cv-data.ts
  fs.writeFileSync(CV_DATA_PATH, updatedCvCode, "utf8");

  // 3. Regeneración de public/CV-Abraham-ATS.md
  try {
    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }
    const stamp = new Date().toISOString().split("T")[0];
    const atsHeader = `# ABRAHAM MARTÍN HERAS\n**Full Stack AI · Automatización de Procesos Operativos · Vibe Coding**\n*Última sincronización automática cv-inbox: ${stamp}*\n\n`;
    let atsContent = atsHeader;
    if (fs.existsSync(ATS_MD_PATH)) {
      const existing = fs.readFileSync(ATS_MD_PATH, "utf8");
      atsContent = existing.replace(/# ABRAHAM MARTÍN HERAS[\s\S]*?\n\n---\n/, atsHeader + "---\n");
    }
    fs.writeFileSync(ATS_MD_PATH, atsContent, "utf8");
    console.log(`   • Respaldo ATS actualizado en: public/CV-Abraham-ATS.md`);
  } catch (atsErr) {
    console.warn(`   ⚠️ Advertencia: No se pudo actualizar public/CV-Abraham-ATS.md: ${atsErr.message}`);
  }

  // 3. Actualización del checkpoint SHA-256
  const processedAt = new Date().toISOString();
  for (const file of newFiles) {
    checkpoint.processedHashes[file.hash] = {
      fileName: file.fileName,
      mimeType: file.mimeType,
      processedAt,
    };
  }
  checkpoint.updatedAt = processedAt;
  fs.writeFileSync(CHECKPOINT_PATH, JSON.stringify(checkpoint, null, 2), "utf8");

  const usage = payload?.usageMetadata;
  const totalTokens = usage?.totalTokenCount ?? "N/A";

  console.log(
    `✅ Sincronización completada con éxito (${newFiles.length} archivo(s) procesado(s), tokens: ${totalTokens}).`
  );
  console.log(`   • Backup guardado en: src/data/cv-data.backup.ts`);
  console.log(`   • Archivo actualizado: src/data/cv-data.ts`);
  console.log(`   • Checkpoint actualizado: cv-inbox/.checkpoint.json`);
}

main().catch((err) => {
  console.error("❌ Error inesperado durante la sincronización del CV:", err);
  process.exit(1);
});
