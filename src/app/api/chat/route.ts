import { NextResponse } from "next/server";
import { cvData } from "@/data/cv-data";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Motor de Fallback Local Rico y Completo (Zero-Error Guarantee con los datos reales de Abraham)
function generateLocalFallbackResponse(
  query: string,
  history: ChatMessage[] = [],
  language: "es" | "en" = "es"
): string {
  const q = query.toLowerCase();

  if (language === "en") {
    // English Local Fallback
    if (
      q.includes("office") ||
      q.includes("automat") ||
      q.includes("excel") ||
      q.includes("csv") ||
      q.includes("n8n") ||
      q.includes("day 1") ||
      q.includes("tasks") ||
      q.includes("pipeline")
    ) {
      return (
        "Abraham can automate critical office workflows and operations from Day 1:\n\n" +
        "- **Excel/CSV data sanitization & merging:** High-throughput Python scripts with Pandas to remove duplicates, reconcile mismatched schemas, and standardize records in seconds.\n" +
        "- **Autonomous orchestration via n8n:** Connecting inboxes, processing invoice/waybill attachments, and syncing directly with enterprise ERPs without manual input.\n" +
        "- **Web automation & scrapers with Playwright:** Extracting supplier catalogs, real-time rates, and logistics telemetry from web portals lacking public APIs.\n" +
        "- **Geospatial & routing maps:** PostGIS and MapLibre integrations for delivery routes, warehouse geofencing, and operational tracking.\n\n" +
        "Measurable outcome: up to 75% reduction in repetitive manual office workloads."
      );
    }

    if (
      q.includes("operat") ||
      q.includes("logistic") ||
      q.includes("hybrid") ||
      q.includes("serveo") ||
      q.includes("cremonini") ||
      q.includes("wagons") ||
      q.includes("background")
    ) {
      return (
        "Abraham's key differentiator is his extensive frontline leadership in critical operations:\n\n" +
        "- **Over 10 years leading critical operations (Serveo):** Direct supervision of high-speed railway logistics, catering replenishment, SLA enforcement, and real-time incident resolution.\n" +
        "- **Proven background in transport supply chains (Cremonini / Wagons-Lits):** Inventory turnover, cargo loading, and cold-chain compliance under strict timetable pressure.\n" +
        "- **Business-first engineering:** He doesn't build software in a vacuum; he identifies real operational bottlenecks and engineers exact tools (Next.js, FastAPI, n8n, Python) with immediate adoption."
      );
    }

    if (
      q.includes("certif") ||
      q.includes("degree") ||
      q.includes("stack") ||
      q.includes("python") ||
      q.includes("security") ||
      q.includes("cyber") ||
      q.includes("hours")
    ) {
      return (
        "Abraham holds rigorous verified official credentials alongside a modern full stack:\n\n" +
        "- **Google Cybersecurity Certificate (260h):** Official specialization in defensive security, vulnerability triage, SIEM, and data protection in automation.\n" +
        "- **Professional Python Programming (260h):** Advanced Python scripting, ETL pipelines, Pandas data wrangling, and web automation.\n" +
        "- **Google AI Professional Certificate:** LLM agent architectures, systematic prompt engineering, and AI-augmented software development.\n" +
        "- **Official University Entrance Exam (PAU +25):** Passed with an Outstanding 8.80 GPA (Universitat de València)."
      );
    }

    return (
      "Abraham Martín Heras combines 10+ years of frontline logistics supervision (Serveo) with modern Full Stack AI software engineering (Next.js, TypeScript, Python, n8n, Playwright).\n\n" +
      "He specializes in eliminating office friction and building high-performance internal tools. Available immediately for remote or hybrid positions."
    );
  }

  // 1. Tareas de oficina, automatización y día 1
  if (
    q.includes("oficina") ||
    q.includes("automatiz") ||
    q.includes("excel") ||
    q.includes("albarán") ||
    q.includes("albaran") ||
    q.includes("factura") ||
    q.includes("n8n") ||
    q.includes("día 1") ||
    q.includes("dia 1") ||
    q.includes("tareas") ||
    q.includes("primer día") ||
    q.includes("primer dia")
  ) {
    return (
      "Abraham puede asumir y automatizar desde el primer día tareas clave de oficina y operaciones:\n\n" +
      "- **Limpieza y consolidación de Excel/CSV:** Scripts en Python con Pandas para eliminar duplicados, cruzar tablas heterogéneas y formatear datos en segundos.\n" +
      "- **Orquestación desatendida con n8n:** Conexión de bandejas de entrada, lectura de adjuntos en PDF y sincronización directa con ERPs sin picar datos a mano.\n" +
      "- **Scraping y robots web con Playwright:** Extracción automatizada de tarifas, pedidos y datos operativos desde portales de proveedores que carecen de API pública.\n" +
      "- **Sistemas geoespaciales y mapas:** Integración de PostGIS y MapLibre para geolocalizar rutas de reparto, almacenes o incidencias operativas.\n\n" +
      "Resultado medible: reducción de hasta un 75% del tiempo manual invertido en tareas administrativas repetitivas."
    );
  }

  // 2. Experiencia operativa real + IA (Perfil híbrido: Serveo, Cremonini, Wagons-Lits)
  if (
    q.includes("operacion") ||
    q.includes("logístic") ||
    q.includes("logistic") ||
    q.includes("híbrido") ||
    q.includes("hibrido") ||
    q.includes("combina") ||
    q.includes("real") ||
    q.includes("experiencia") ||
    q.includes("serveo") ||
    q.includes("cremonini") ||
    q.includes("wagons") ||
    q.includes("ferroviari") ||
    q.includes("almacén") ||
    q.includes("almacen") ||
    q.includes("turno")
  ) {
    return (
      "El valor diferencial de Abraham radica en su experiencia real en planta y logística crítica:\n\n" +
      "- **Más de una década en operaciones críticas (Serveo):** Supervisión y coordinación de operativa y aprovisionamiento logístico ferroviario, cumpliendo estrictos SLAs y gestionando incidencias en tiempo real.\n" +
      "- **Trayectoria previa contrastada (Cremonini / Wagons-Lits):** Control de carga, inventarios y rutas bajo presión en el sector del transporte.\n" +
      "- **Criterio de negocio para la IA:** No diseña código aislado de la realidad; identifica el cuello de botella físico u ofimático y construye la herramienta exacta (FastAPI, React, Next.js, n8n) para resolverlo con adopción inmediata."
    );
  }

  // 3. Certificaciones oficiales y stack técnico (260h Python, 260h Google Cybersecurity, Google AI, PAU 8.80)
  if (
    q.includes("certific") ||
    q.includes("título") ||
    q.includes("titulo") ||
    q.includes("estudio") ||
    q.includes("herramienta") ||
    q.includes("stack") ||
    q.includes("python") ||
    q.includes("seguridad") ||
    q.includes("ciberseguridad") ||
    q.includes("pau") ||
    q.includes("horas")
  ) {
    return (
      "Abraham cuenta con certificaciones oficiales de alto rigor técnico y un stack full stack consolidado:\n\n" +
      "- **Google Cybersecurity Certificate (260h):** Especialización oficial en seguridad defensiva, gestión de vulnerabilidades, SIEM y protección de datos en flujos automatizados.\n" +
      "- **Curso Profesional de Programación en Python (260h):** Formación exhaustiva en desarrollo backend, scripting operativo, ETLs con Pandas y automatización con Playwright.\n" +
      "- **Google AI Professional Certificate:** Dominio de agentes autónomos, RAG contextual, Prompt Engineering y Vibe Coding asistido por LLMs.\n" +
      "- **Prueba de Acceso a la Universidad PAU +25 (Universitat de València):** Calificación de APTO con nota media de **8,80**.\n" +
      "- **Stack tecnológico principal:** React, Next.js, TypeScript, Python (FastAPI/Pandas), PostGIS/MapLibre, n8n, Playwright, Tailwind CSS y Docker."
    );
  }

  // 4. Por qué contratar a Abraham / Resumen en 3 puntos
  if (
    q.includes("3 puntos") ||
    q.includes("tres puntos") ||
    q.includes("destaca") ||
    q.includes("por qué") ||
    q.includes("por que") ||
    q.includes("contrat") ||
    q.includes("puesto") ||
    q.includes("fichar")
  ) {
    return (
      "Tres razones clave por las que Abraham destaca para incorporarse al equipo:\n\n" +
      "- **1. Retorno de inversión inmediato:** Automatiza cuellos de botella en hojas de cálculo y procesos operativos desde la primera semana con Python, n8n y Playwright.\n" +
      "- **2. Perfil híbrido único:** Une más de 10 años supervisando operativa logística real (Serveo) con desarrollo Full Stack IA moderno (Next.js, TypeScript, Python, PostGIS).\n" +
      "- **3. Rigor técnico y seguridad:** Doble certificación de 260 horas en Python y Google Cybersecurity, además de Google AI y PAU +25 con nota 8,80."
    );
  }

  // 5. Disponibilidad y contacto
  if (
    q.includes("disponib") ||
    q.includes("remoto") ||
    q.includes("incorpor") ||
    q.includes("contacto") ||
    q.includes("sueldo") ||
    q.includes("ubicación") ||
    q.includes("ubicacion") ||
    q.includes("donde vive")
  ) {
    return (
      "**Disponibilidad actual:** Disponible para proyectos e incorporación inmediata.\n\n" +
      "- **Modalidad:** Remoto o híbrido con flexibilidad total.\n" +
      "- **Ubicación:** España (operativa global).\n" +
      "- **Contacto directo:** Puede descargarse su CV en PDF desde la barra superior o escribir a **contacto@abraham.dev**."
    );
  }

  // Si hay historial previo y la pregunta es de seguimiento
  if (history.length > 1) {
    const lastUserTurn = history[history.length - 2]?.content?.toLowerCase() || "";
    if (lastUserTurn.includes("certific") || lastUserTurn.includes("estudio")) {
      return (
        "Completando la información académica de Abraham:\n\n" +
        "- Dispone de 260 horas lectivas en Python y 260 horas oficiales de Google en Ciberseguridad.\n" +
        "- Ha superado la PAU +25 en la Universitat de València con un 8,80 de media.\n" +
        "- Cuenta con la acreditación profesional Google AI en desarrollo de agentes y automatización."
      );
    }
  }

  // Respuesta general contextualizada directa y sin relleno
  return (
    "**Abraham Martín Heras** es especialista en **Full Stack AI, Automatización de Procesos Operativos y Vibe Coding**.\n\n" +
    "- **Operaciones y Logística:** Supervisión de operaciones y aprovisionamiento en Serveo y Cremonini / Wagons-Lits.\n" +
    "- **Certificaciones Clave:** Google Cybersecurity (260h), Programación en Python (260h), Google AI y PAU +25 (8,80).\n" +
    "- **Desarrollo e IA:** Next.js, React, TypeScript, Python, n8n, Playwright y sistemas geoespaciales (PostGIS/MapLibre).\n\n" +
    "Está disponible para incorporación inmediata en modalidad remota o híbrida."
  );
}

// Rate Limiting en Memoria y Guardrails de AppSec
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const MAX_REQUESTS_PER_MINUTE = 12;
const WINDOW_MS = 60 * 1000;
const MAX_MESSAGE_LENGTH = 500;
const MAX_HISTORY_TURNS = 6;

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }
  return "127.0.0.1";
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();

  // Limpieza periódica de entradas expiradas para prevenir memory leaks en contenedores serverless cálidos
  if (rateLimitMap.size > 200) {
    for (const [key, entry] of rateLimitMap.entries()) {
      if (entry.resetTime <= now) {
        rateLimitMap.delete(key);
      }
    }
  }

  const existing = rateLimitMap.get(ip);
  if (!existing || existing.resetTime <= now) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + WINDOW_MS,
    });
    return { allowed: true, remaining: MAX_REQUESTS_PER_MINUTE - 1, retryAfterSec: 0 };
  }

  if (existing.count >= MAX_REQUESTS_PER_MINUTE) {
    const retryAfterSec = Math.max(1, Math.ceil((existing.resetTime - now) / 1000));
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_MINUTE - existing.count,
    retryAfterSec: 0,
  };
}

export async function POST(req: Request) {
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error:
          "Límite de peticiones alcanzado (máx. 12 mensajes/minuto). Por favor, espera unos segundos antes de enviar otro mensaje.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSec),
          "X-RateLimit-Limit": String(MAX_REQUESTS_PER_MINUTE),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  let userMessage = "";
  let conversationHistory: ChatMessage[] = [];
  let language: "es" | "en" = "es";

  try {
    const body = await req.json();

    if (typeof body?.message !== "string") {
      return NextResponse.json(
        { error: "Formato de mensaje no válido (debe ser una cadena de texto)" },
        { status: 400 }
      );
    }

    // Sanitización de caracteres de control nulos o no imprimibles
    userMessage = body.message
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "")
      .trim();

    language = body?.language === "en" ? "en" : "es";

    if (!userMessage) {
      return NextResponse.json(
        { error: "El mensaje no puede estar vacío" },
        { status: 400 }
      );
    }

    // Limitación estricta de longitud contra ataques de Token Exhaustion / Prompt Overflow
    if (userMessage.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        {
          error:
            language === "en"
              ? `Message exceeds maximum length (${MAX_MESSAGE_LENGTH} characters).`
              : `El mensaje excede el límite máximo permitido de ${MAX_MESSAGE_LENGTH} caracteres.`,
        },
        { status: 400 }
      );
    }

    const rawHistory = Array.isArray(body?.history)
      ? body.history
      : Array.isArray(body?.messages)
      ? body.messages
      : [];

    // Validar, sanitizar y limitar el historial a los últimos 6 turnos
    const validTurns: ChatMessage[] = [];
    for (const item of rawHistory) {
      if (
        typeof item === "object" &&
        item !== null &&
        "role" in item &&
        "content" in item &&
        typeof (item as ChatMessage).content === "string" &&
        ((item as ChatMessage).role === "user" || (item as ChatMessage).role === "assistant")
      ) {
        const trimmedContent = (item as ChatMessage).content.slice(0, MAX_MESSAGE_LENGTH).trim();
        if (trimmedContent.length > 0) {
          validTurns.push({
            role: (item as ChatMessage).role,
            content: trimmedContent,
          });
        }
      }
    }
    conversationHistory = validTurns.slice(-MAX_HISTORY_TURNS);

    const apiKey = process.env.GEMINI_API_KEY?.trim();

    // Si no hay API key definida, usamos el motor local enriquecido de respaldo
    if (!apiKey) {
      const fallbackReply = generateLocalFallbackResponse(userMessage, conversationHistory, language);
      return NextResponse.json({
        response: fallbackReply,
        source: "local_engine_no_key",
      });
    }

    // System instruction directa y sin relleno basada en los datos reales de Abraham Martín Heras
    const systemInstruction = `Eres el Asistente Ejecutivo de Abraham Martín Heras (Abraham).
Tu misión es presentar su candidatura a reclutadores de RRHH, CTOs y directores de operaciones.

IDIOMA OBLIGATORIO:
${language === "en" ? "CRITICAL: The user is browsing in ENGLISH. You MUST answer strictly in fluent, professional, executive English." : "El usuario está navegando en ESPAÑOL. Responde en un español ejecutivo, claro y profesional."}

REGLAS DE COMUNICACIÓN OBLIGATORIAS:
1. PROHIBIDO empezar con muletillas de relleno como '¡Claro!', '¡Excelente pregunta!', 'Por supuesto' o '¡Hola!'. Ve DIRECTO al grano desde la primera palabra.
2. Cita siempre datos concretos y cifras reales:
   - Certificaciones oficiales: Google Cybersecurity Certificate (260h), Curso Profesional de Programación en Python (260h), Google AI Professional Certificate, Prueba de Acceso a la Universidad PAU +25 (nota 8,80).
   - Experiencia operativa: Supervisión y coordinación logística ferroviaria y aprovisionamiento en Serveo (y trayectoria previa en Cremonini / Wagons-Lits).
   - Stack técnico y proyectos: Desarrollo Full Stack IA (React, Next.js, TypeScript, Python), automatización de procesos ofimáticos con n8n y Playwright, y sistemas geoespaciales (PostGIS / MapLibre).
3. Formato limpio: Usa viñetas simples con guion (-) y cierra SIEMPRE las etiquetas de negrita con **.
4. Mantén memoria del hilo de conversación. Si te preguntan detalles sobre un tema ya hablado, responde de forma contextualizada.
5. Longitud: Entre 70 y 140 palabras. Sintético, profesional y convincente.

BASE DE DATOS COMPLETA DE ABRAHAM (FUENTE DE VERDAD):
${JSON.stringify(cvData, null, 2)}`;

    // Construir historial multi-turn para Gemini API a partir del historial ya sanitizado
    const contents = conversationHistory.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // Asegurar que el último turno es el mensaje actual del usuario
    const lastTurn = contents[contents.length - 1];
    if (!lastTurn || lastTurn.role !== "user" || lastTurn.parts[0]?.text !== userMessage) {
      contents.push({
        role: "user",
        parts: [{ text: userMessage }],
      });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
      apiKey
    )}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000); // 9 segundos de timeout

    const geminiRes = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents,
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048,
          thinkingConfig: {
            thinkingBudget: 0,
          },
        },
      }),
    });

    clearTimeout(timeoutId);

    if (!geminiRes.ok) {
      // Fallback transparente si la API de Gemini devuelve error (ej. límite de cuota HTTP 429)
      const fallbackReply = generateLocalFallbackResponse(userMessage, conversationHistory, language);
      return NextResponse.json({
        response: fallbackReply,
        source: "local_engine_after_api_error",
      });
    }

    const data = await geminiRes.json();
    const replyText =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text || "")
        .join("\n")
        .trim() || "";

    if (!replyText) {
      const fallbackReply = generateLocalFallbackResponse(userMessage, conversationHistory, language);
      return NextResponse.json({
        response: fallbackReply,
        source: "local_engine_empty_reply",
      });
    }

    return NextResponse.json({
      response: replyText,
      source: "gemini",
    });
  } catch (err) {
    console.error("Chat API fallback activated due to:", err);
    // Garantía Cero Errores: si hay timeout o fallo de conexión, devolvemos respuesta enriquecida sin 500
    try {
      const fallbackReply = generateLocalFallbackResponse(userMessage, conversationHistory, language);
      return NextResponse.json({
        response: fallbackReply,
        source: "local_engine_exception",
      });
    } catch {
      return NextResponse.json(
        {
          response:
            language === "en"
              ? "Abraham Martín Heras specializes in Full Stack AI, n8n/Playwright automation, and operations leadership (Serveo). Certified in Google Cybersecurity (260h), Python (260h), Google AI, and PAU +25 (8.80 GPA). Available immediately."
              : "Abraham Martín Heras es especialista en Full Stack AI, automatización con n8n/Playwright y supervisión operativa (Serveo). Certificado en Google Cybersecurity (260h), Python (260h), Google AI y PAU +25 (8,80). Disponible para incorporación inmediata.",
          source: "emergency_fallback",
        },
        { status: 200 }
      );
    }
  }
}
