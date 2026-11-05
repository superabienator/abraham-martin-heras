"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";
import {
  Send,
  RotateCcw,
  User,
  Sparkles,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
}

const WELCOME_MESSAGES = {
  es: {
    id: "welcome-msg-es",
    role: "assistant" as const,
    content:
      "Soy el Asistente Ejecutivo de **Abraham Martín Heras**. Conozco al detalle su trayectoria en supervisión operativa y logística ferroviaria (Serveo), sus certificaciones oficiales (Google Cybersecurity 260h, Python 260h, Google AI, PAU +25 con 8,80) y su stack Full Stack IA.\n\nPuedes pulsar cualquiera de las **preguntas rápidas** o escribir directamente tu consulta sobre su perfil.",
    timestamp: "Ahora",
  },
  en: {
    id: "welcome-msg-en",
    role: "assistant" as const,
    content:
      "I am the Executive Assistant for **Abraham Martín Heras**. I have full context on his background leading critical operations and railway logistics (Serveo), his official credentials (Google Cybersecurity 260h, Python 260h, Google AI, PAU +25 with 8.80 GPA), and his Full Stack AI stack.\n\nClick any **suggested question** below or ask your own question regarding his profile.",
    timestamp: "Now",
  },
};

const SUGGESTED_QUESTIONS = {
  es: [
    "¿Qué tareas de oficina y empresa puede automatizar desde el día 1?",
    "¿Cómo combina su experiencia en operaciones reales con la IA?",
    "¿Qué certificaciones oficiales y herramientas domina?",
    "Resúmeme en 3 puntos por qué destaca para este puesto",
  ],
  en: [
    "What office and business processes can he automate from Day 1?",
    "How does he bridge real-world operations with AI engineering?",
    "What official certifications and tech tools does he master?",
    "Summarize in 3 bullet points why he stands out for this role",
  ],
};

// Renderizador robusto y limpio de formato Markdown (elimina asteriscos rotos y formatea negritas/listas)
function formatMessage(text: string) {
  let sanitized = text || "";
  // 1. Balancear asteriscos dobles desemparejados al final si la respuesta fue cortada
  const boldMatches = sanitized.match(/\*\*/g);
  if (boldMatches && boldMatches.length % 2 !== 0) {
    sanitized += "**";
  }

  const lines = sanitized.split("\n");

  return (
    <div className="space-y-2 leading-relaxed">
      {lines.map((line, idx) => {
        let trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Detectar si es elemento de lista (viñeta o número)
        const isBullet =
          trimmed.startsWith("•") ||
          trimmed.startsWith("-") ||
          trimmed.startsWith("*") ||
          /^\d+[\.\)]\s/.test(trimmed);

        // Limpiar el marcador inicial de viñeta para que no queden '* **' o '- **'
        if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
          trimmed = trimmed.replace(/^[\*\-•]\s*/, "");
        } else if (/^\d+[\.\)]\s/.test(trimmed)) {
          trimmed = trimmed.replace(/^\d+[\.\)]\s*/, "");
        }

        // Eliminar asteriscos sueltos huérfanos que no formen parte de **negrita**
        const cleanLine = trimmed.replace(/(^|[^\*])\*([^\*]|$)/g, "$1$2");

        // Dividir por etiquetas de negrita **texto**
        const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

        return (
          <div
            key={idx}
            className={isBullet ? "pl-2 flex items-start gap-2" : ""}
          >
            {isBullet && (
              <span className="text-violet-500 dark:text-cyan-400 font-bold shrink-0 mt-0.5 select-none">
                •
              </span>
            )}
            <span className="flex-1">
              {parts.map((part, pIdx) => {
                if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
                  return (
                    <strong
                      key={pIdx}
                      className="font-bold text-slate-900 dark:text-white"
                    >
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                return <span key={pIdx}>{part}</span>;
              })}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function FormattedMessageContent({ text }: { text: string }) {
  return formatMessage(text);
}

let globalMsgIdCounter = 0;

function createChatMessage(role: "user" | "assistant", content: string): ChatMessage {
  globalMsgIdCounter += 1;
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return {
    id: `${role}-${globalMsgIdCounter}`,
    role,
    content,
    timestamp: timeStr,
  };
}

export function CvChat() {
  const { language } = useLanguage();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Mensaje de bienvenida contextual según idioma activo (100% puro, sin cascading renders)
  const welcomeMessage = WELCOME_MESSAGES[language];
  const messages = [welcomeMessage, ...chatHistory];

  // Referencia estricta para scroll confinado dentro del chat (PROHIBIDO mover window)
  const chatMessagesBoxRef = useRef<HTMLDivElement | null>(null);

  const scrollChatToBottom = () => {
    // Usamos setTimeout para esperar al renderizado y scroll con scrollTop (NUNCA scrollIntoView)
    setTimeout(() => {
      if (chatMessagesBoxRef.current) {
        chatMessagesBoxRef.current.scrollTop = chatMessagesBoxRef.current.scrollHeight;
      }
    }, 40);
  };

  const handleSendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMessage = createChatMessage("user", trimmed);
    const updatedHistory = [...chatHistory, userMessage];
    setChatHistory(updatedHistory);
    setInputValue("");
    setIsLoading(true);
    scrollChatToBottom();

    try {
      const fullPayloadHistory = [welcomeMessage, ...updatedHistory];
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: fullPayloadHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          language,
        }),
      });

      const data = await response.json();
      const replyText =
        data?.response ||
        (language === "es"
          ? "Actualmente disponible para incorporación inmediata en proyectos de Full Stack AI y Automatización."
          : "Currently available for immediate start on Full Stack AI and Process Automation projects.");

      const assistantMessage = createChatMessage("assistant", replyText);
      setChatHistory((prev) => [...prev, assistantMessage]);
    } catch {
      const fallbackMessage = createChatMessage(
        "assistant",
        language === "es"
          ? "Abraham Martín Heras combina supervisión de operaciones logísticas reales (Serveo) con ingeniería Full Stack e IA. Está disponible para incorporación inmediata."
          : "Abraham Martín Heras bridges real-world operations leadership (Serveo) with modern Full Stack & AI software engineering. He is available for immediate hire."
      );
      setChatHistory((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
      scrollChatToBottom();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
  };

  const handleResetChat = () => {
    setChatHistory([]);
    setInputValue("");
    setIsLoading(false);
    scrollChatToBottom();
  };

  const currentQuestions = SUGGESTED_QUESTIONS[language];

  return (
    <div className="space-y-4">
      {/* 1. Cabecera del Agente de Entrevista */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-violet-200 dark:border-cyan-500/30 overflow-hidden shadow-sm shrink-0 bg-white dark:bg-slate-800">
            <Image
              src="/logo-amh.png"
              alt="Abraham Martín Heras AMH"
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-900" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === "es" ? "Asistente Ejecutivo del Candidato" : "Candidate Executive Assistant"}
              </h4>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                <CheckCircle2 className="h-2.5 w-2.5" />
                <span>{language === "es" ? "Activo · Verificado" : "Active · Verified"}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === "es"
                ? "Respuestas instantáneas sobre experiencia, automatización y encaje de perfil"
                : "Instant answers on background, automation, and role fit"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetChat}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{language === "es" ? "Reiniciar conversación" : "Reset conversation"}</span>
        </button>
      </div>

      {/* 2. Caja Confinada de Mensajes (Scroll Estrictamente Interno: h-[360px]) */}
      <div
        ref={chatMessagesBoxRef}
        className="h-[360px] overflow-y-auto rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-950/60 p-4 sm:p-5 space-y-4 shadow-inner"
      >
        {messages.map((msg) => {
          const isAssistant = msg.role === "assistant";
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                isAssistant ? "justify-start" : "justify-end"
              }`}
            >
              {isAssistant && (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-violet-200 dark:border-cyan-500/30 overflow-hidden shrink-0 mt-0.5 bg-white dark:bg-slate-900 shadow-2xs">
                  <Image
                    src="/logo-amh.png"
                    alt="AMH"
                    width={28}
                    height={28}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 text-xs shadow-xs ${
                  isAssistant
                    ? "bg-white/95 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 text-slate-700 dark:text-slate-200"
                    : "bg-slate-900 dark:bg-cyan-600 text-white dark:text-slate-950 font-medium"
                }`}
              >
                <FormattedMessageContent text={msg.content} />
                <div
                  className={`text-[10px] font-mono mt-2 text-right ${
                    isAssistant ? "text-slate-400" : "text-slate-300 dark:text-slate-900"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {!isAssistant && (
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 shrink-0 mt-0.5">
                  <User className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Indicador Suave de Escritura */}
        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 dark:bg-cyan-950/80 text-violet-700 dark:text-cyan-400 border border-violet-200 dark:border-cyan-500/30 shrink-0">
              <Sparkles className="h-3.5 w-3.5 animate-spin" />
            </div>
            <div className="rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-slate-200/80 dark:border-white/10 p-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 dark:bg-cyan-400 animate-pulse" />
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 dark:bg-cyan-400 animate-pulse delay-100" />
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 dark:bg-cyan-400 animate-pulse delay-200" />
              <span className="font-mono text-[11px] ml-1">
                {language === "es" ? "Analizando trayectoria y datos del perfil..." : "Analyzing background and candidate data..."}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Preguntas Rápidas en 1 Clic para Reclutadores */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-slate-400">
          <HelpCircle className="h-3 w-3 text-violet-500 dark:text-cyan-400" />
          <span>{language === "es" ? "Preguntas sugeridas en 1 clic:" : "1-Click suggested questions:"}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {currentQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSendMessage(q)}
              className="rounded-xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 p-2.5 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-violet-300 dark:hover:border-cyan-400/50 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer truncate disabled:opacity-50"
            >
              💬 {q}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Barra de Escritura */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isLoading}
          placeholder={
            language === "es"
              ? "Escribe una pregunta sobre la experiencia, certificaciones o disponibilidad de Abraham..."
              : "Ask anything about Abraham's background, certifications, tech stack or availability..."
          }
          className="w-full rounded-xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900 py-3 pl-4 pr-12 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/40 dark:focus:ring-cyan-500/40 shadow-xs"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          aria-label="Enviar mensaje"
          className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-cyan-500 dark:to-teal-500 text-white dark:text-slate-950 disabled:opacity-40 hover:brightness-110 transition-all cursor-pointer shadow-xs"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
