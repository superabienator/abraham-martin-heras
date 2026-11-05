export type AccentColor = "emerald" | "cyan" | "teal" | "indigo";

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  username: string;
  iconName: "github" | "linkedin" | "mail" | "terminal";
}

export interface HeroMetric {
  id: string;
  value: string;
  label: string;
  detail: string;
  accent: AccentColor;
}

export interface ProfileData {
  name: string;
  role: string;
  tagline: string;
  availabilityBadge: {
    statusText: string;
    subText: string;
    isAvailable: boolean;
  };
  executiveSummary: string;
  valueProposition: string;
  location: string;
  cvPdfUrl: string;
  socials: SocialLink[];
  metrics: HeroMetric[];
}

export interface SkillItem {
  name: string;
  level: "Core" | "Avanzado" | "Especialista";
  context: string;
}

export interface BentoCategory {
  id: string;
  title: string;
  subtitle: string;
  businessImpact: string;
  metricHighlight: string;
  iconName: "bot" | "workflow" | "code" | "shield";
  accent: AccentColor;
  gridSpan: "col-span-12 lg:col-span-7" | "col-span-12 lg:col-span-5";
  skills: SkillItem[];
  useCases: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
  category:
    | "Ciberseguridad"
    | "Inteligencia Artificial"
    | "Python & Datos"
    | "Automatización"
    | "Full Stack Moderno & Datos"
    | string;
  credentialCode: string;
  verified: boolean;
  skillsCovered: string[];
}

export interface PlaygroundTabConfig {
  id: "smart-cleaner" | "workflow-simulator" | "ask-my-cv";
  tabLabel: string;
  shortBadge: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: "file-spreadsheet" | "network" | "sparkles";
  accent: AccentColor;
  techStack: string[];
  sprintStatus: string;
  previewHighlights: {
    label: string;
    value: string;
  }[];
  mockTerminalLines: string[];
}

export interface TimelineEntry {
  id: string;
  period: string;
  role: string;
  organization: string;
  location: string;
  type: "tech-ai" | "automation-ops" | "logistics-ops" | "education";
  badgeText: string;
  summary: string;
  achievements: string[];
  technologies: string[];
  impactMetric?: string;
}

export interface LanguageSkill {
  id: string;
  language: string;
  level: string;
  cefr: string;
  description: string;
  fluencyPercent: number;
  badge: string;
}

export interface CVData {
  profile: ProfileData;
  bentoCategories: BentoCategory[];
  languages: LanguageSkill[];
  certifications: CertificationItem[];
  playgroundTabs: PlaygroundTabConfig[];
  timeline: TimelineEntry[];
}

export const cvDataEs: CVData = {
  profile: {
    name: "Abraham Martín Heras",
    role: "Full Stack AI · Automatización de Procesos Operativos/Ofimática · Vibe Coding",
    tagline:
      "Transformo cuellos de botella operativos, hojas de cálculo caóticas y tareas manuales repetitivas en sistemas autónomos, agentes de IA y aplicaciones web de alto rendimiento.",
    availabilityBadge: {
      statusText: "Disponible para proyectos e incorporación inmediata",
      subText: "Remoto / Híbrido · Full Stack AI & Process Automation",
      isAvailable: true,
    },
    executiveSummary:
      "Perfil híbrido único que une años de liderazgo en operaciones críticas y logística real (Serveo, Cremonini, Wagons-Lits) con ingeniería de software moderna (Next.js, TypeScript, Python), orquestación de agentes LLM, sistemas geoespaciales (PostGIS/MapLibre) y automatización ofimática avanzada.",
    valueProposition:
      "No solo escribo código rápido mediante Vibe Coding con criterio arquitectónico y seguridad; entiendo cómo funciona una operación por dentro, dónde se pierde el tiempo y cómo automatizarlo con retorno de inversión medible desde la primera semana.",
    location: "España · Operativa Global / Remoto",
    cvPdfUrl: "/cv-abraham-martin-heras-fullstack-ai.pdf",
    socials: [
      {
        id: "github",
        label: "GitHub",
        url: "https://github.com/superabienator/abraham-martin-heras",
        username: "@superabienator",
        iconName: "github",
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        url: "https://linkedin.com/",
        username: "in/abraham-martin-heras",
        iconName: "linkedin",
      },
      {
        id: "email",
        label: "Contacto Directo",
        url: "mailto:contacto@abraham.dev",
        username: "contacto@abraham.dev",
        iconName: "mail",
      },
    ],
    metrics: [
      {
        id: "hours-saved",
        value: "-75%",
        label: "Tiempo en Procesos Ofimáticos",
        detail: "Automatización de reportes, cruces de Excel/CSV y validación documental con Python e IA.",
        accent: "emerald",
      },
      {
        id: "workflows",
        value: "+40",
        label: "Flujos & Bots en Producción",
        detail: "Pipelines en n8n, scrapers resilientes en Playwright y agentes RAG conectados a APIs.",
        accent: "cyan",
      },
      {
        id: "vibe-coding",
        value: "10x",
        label: "Velocidad de Entrega (Vibe Coding)",
        detail: "Prototipado y despliegue Full Stack asistido por IA con tipado estricto y auditoría de seguridad.",
        accent: "emerald",
      },
      {
        id: "ops-reliability",
        value: "99.8%",
        label: "Trazabilidad Operativa",
        detail: "Mentalidad de supervisión logística y ciberseguridad aplicada a cada flujo de datos.",
        accent: "cyan",
      },
    ],
  },

  bentoCategories: [
    {
      id: "ai-agents",
      title: "IA Generativa, LLMs & Arquitectura de Agentes",
      subtitle: "Sistemas inteligentes orientados a resultados de negocio",
      businessImpact:
        "Diseño e integración de agentes autónomos capaces de razonar sobre documentos empresariales, extraer datos estructurados (JSON Schema) desde fuentes no estructuradas y ejecutar acciones sobre ERPs o APIs internas.",
      metricHighlight: "Extracción semántica con 99% de precisión estructural",
      iconName: "bot",
      accent: "emerald",
      gridSpan: "col-span-12 lg:col-span-7",
      skills: [
        {
          name: "Integración de APIs LLM (Gemini / OpenAI / Claude)",
          level: "Especialista",
          context: "Function calling, salidas estructuradas, caching y control de costes/latencia",
        },
        {
          name: "Arquitectura de Agentes & RAG Contextual",
          level: "Avanzado",
          context: "Inyección de contexto dinámico, memoria conversacional y herramientas seguras",
        },
        {
          name: "Vibe Coding & AI-Augmented Engineering",
          level: "Especialista",
          context: "Desarrollo acelerado con agentes de código manteniendo arquitectura limpia y tipado",
        },
        {
          name: "Prompt Engineering Sistemático & Evaluaciones",
          level: "Especialista",
          context: "Diseño determinista de prompts para clasificación, limpieza y auditoría operativa",
        },
      ],
      useCases: [
        "Asistentes internos que consultan manuales operativos y normativas en segundos",
        "Clasificación y enrutamiento inteligente de incidencias, albaranes y correos críticos",
        "Normalización automática de catálogos e inventarios multiformato mediante LLMs",
      ],
    },
    {
      id: "automation-office",
      title: "Automatización & Ofimática Inteligente",
      subtitle: "Eliminación radical de trabajo manual repetitivo",
      businessImpact:
        "Orquestación end-to-end que conecta hojas de cálculo complejas, portales web sin API y sistemas heredados mediante flujos autónomos en n8n, scripts en Python y navegadores headless con Playwright.",
      metricHighlight: "De horas de copiar/pegar en Excel a ejecución en 4 segundos",
      iconName: "workflow",
      accent: "cyan",
      gridSpan: "col-span-12 lg:col-span-5",
      skills: [
        {
          name: "Orquestación Visual & Híbrida con n8n",
          level: "Especialista",
          context: "Webhooks, nodos de código JS/Python, manejo de errores, reintentos y alertas",
        },
        {
          name: "Playwright (Web Scraping & E2E Automation)",
          level: "Avanzado",
          context: "Automatización de portales de proveedores, descargas desatendidas y testing",
        },
        {
          name: "Transformación Avanzada de Excel / CSV / Docs",
          level: "Especialista",
          context: "Limpieza programática con Pandas/OpenPyXL, cruces masivos y generación de PDFs",
        },
        {
          name: "Integración de Ecosistemas Ofimáticos",
          level: "Avanzado",
          context: "Conexión automática entre Google Workspace, Microsoft 365, Notion, Slack y Telegram",
        },
      ],
      useCases: [
        "Consolidación diaria automática de reportes logísticos desde múltiples portales externos",
        "Saneamiento instantáneo de hojas de cálculo con formatos rotos, duplicados y errores",
        "Bots de extracción y conciliación automática de facturas, pedidos y tarifas",
      ],
    },
    {
      id: "fullstack-data",
      title: "Desarrollo Full Stack Moderno & Datos",
      subtitle: "Interfaces rápidas, limpias y listas para producción",
      businessImpact:
        "Construcción de herramientas internas, dashboards operativos y aplicaciones SaaS con estética ejecutiva, tipado estricto de extremo a extremo y despliegue serverless optimizado.",
      metricHighlight: "0 dependencias innecesarias · Rendimiento instantáneo en Edge/Vercel",
      iconName: "code",
      accent: "cyan",
      gridSpan: "col-span-12 lg:col-span-5",
      skills: [
        {
          name: "Next.js (App Router) & React 19",
          level: "Avanzado",
          context: "Server Components, Route Handlers, streaming UI y estado reactivo fluido",
        },
        {
          name: "TypeScript Estricto & Arquitectura Modular",
          level: "Avanzado",
          context: "Contratos de datos tipados, separación clara UI/Datos y mantenibilidad a largo plazo",
        },
        {
          name: "Python Backend & Procesamiento de Datos",
          level: "Especialista",
          context: "FastAPI, scripts CLI de alto rendimiento, ETLs ligeros y automatización del sistema",
        },
        {
          name: "Sistemas Geoespaciales & Mapas (PostGIS / MapLibre)",
          level: "Avanzado",
          context: "Modelado espacial, capas vectoriales, optimización de consultas geográficas y visualización",
        },
        {
          name: "Tailwind CSS & Diseño UI/UX (Estilo Linear/Vercel)",
          level: "Especialista",
          context: "Interfaces Dark Mode sobrias, Bento Grids responsivos y micro-interacciones claras",
        },
      ],
      useCases: [
        "Paneles de control internos a medida que reemplazan hojas de cálculo compartidas frágiles",
        "Micro-herramientas web interactivas para equipos de operaciones y atención al cliente",
        "APIs ligeras que sirven como puente entre modelos de IA y bases de datos SQL/NoSQL",
      ],
    },
    {
      id: "cybersecurity-ops",
      title: "Ciberseguridad Aplicada & Gestión Operativa Crítica",
      subtitle: "Visión de negocio real, control de riesgos y liderazgo de campo",
      businessImpact:
        "A diferencia de un perfil puramente teórico, combino formación certificada en Ciberseguridad con experiencia real supervisando operaciones y cadenas logísticas donde un fallo o brecha detiene la operativa.",
      metricHighlight: "Security-by-Design + Mentalidad de Cero Fricción Operativa",
      iconName: "shield",
      accent: "emerald",
      gridSpan: "col-span-12 lg:col-span-7",
      skills: [
        {
          name: "Ciberseguridad & Protección de Datos en Automatizaciones",
          level: "Avanzado",
          context: "Gestión segura de credenciales, sanitización de inputs/prompts y mínimo privilegio",
        },
        {
          name: "Supervisión de Operaciones & Logística Crítica",
          level: "Especialista",
          context: "Coordinación de equipos, control de SLAs, trazabilidad de rutas/stock y resolución de crisis",
        },
        {
          name: "Auditoría de Procesos & Detección de Cuellos de Botella",
          level: "Especialista",
          context: "Traducción directa de problemas de planta/oficina a especificaciones técnicas",
        },
        {
          name: "Gobernanza de IA & Prevención de Fugas de Información",
          level: "Avanzado",
          context: "Anonimización de PII antes de inferencia LLM y validación determinista de salidas",
        },
      ],
      useCases: [
        "Diseño de flujos automatizados que cumplen políticas de seguridad y trazabilidad de auditoría",
        "Digitalización de partes de trabajo, control de incidencias y métricas de turno en tiempo real",
        "Puente efectivo entre dirección operativa, personal administrativo y equipo de desarrollo",
      ],
    },
  ],

  languages: [
    {
      id: "lang-spanish",
      language: "Castellano / Español",
      level: "Nativo",
      cefr: "C2 (Nativo)",
      description:
        "Lengua materna. Dominio total para comunicación ejecutiva, redacción técnica, negociación y liderazgo de equipos de operaciones.",
      fluencyPercent: 100,
      badge: "Nativo (C2)",
    },
    {
      id: "lang-valencian",
      language: "Valenciano / Catalán",
      level: "Medio-Alto",
      cefr: "B2 - C1",
      description:
        "Competencia profesional completa y administrativa fluida tanto en comunicación oral y escrita como en tramitación documental.",
      fluencyPercent: 85,
      badge: "Competencia Profesional Fluida",
    },
    {
      id: "lang-english",
      language: "Inglés (Technical English)",
      level: "Medio General / Alto Técnico",
      cefr: "B2 (Technical English)",
      description:
        "Nivel Alto en asimilación y lectura de documentación técnica, RFCs, papers de IA y APIs internacionales; Nivel Medio en conversación general.",
      fluencyPercent: 80,
      badge: "Inglés Técnico Avanzado",
    },
  ],

  certifications: [
    {
      id: "cert-cybersecurity-google",
      title: "Google Cybersecurity Certificate (260h)",
      issuer: "Google (via Coursera)",
      year: "2025 - 2026",
      category: "Ciberseguridad",
      credentialCode: "GOOG-SEC-260H-VERIFIED",
      verified: true,
      skillsCovered: [
        "Ciberseguridad Defensiva & SIEM (260h)",
        "Seguridad en APIs y Automatizaciones",
        "Protección de Datos & Prevención de Fugas",
        "Análisis de Riesgos Operativos & Hardening",
      ],
    },
    {
      id: "cert-python-260h",
      title: "Curso Profesional de Programación en Python (260h)",
      issuer: "Formación Oficial / Especialización en Python & Automatización",
      year: "2024 - 2025",
      category: "Python & Datos",
      credentialCode: "PY-260H-AUTO-DATA",
      verified: true,
      skillsCovered: [
        "Programación Python Avanzada (260h)",
        "Transformación de Excel/CSV & ETL con Pandas",
        "Web Scraping con Playwright",
        "Automatización de Tareas Ofimáticas",
      ],
    },
    {
      id: "cert-coursera-google-ai-pro",
      title: "Google AI Professional Certificate",
      issuer: "Google (via Coursera)",
      year: "2026",
      category: "Inteligencia Artificial",
      credentialCode: "HSMUZE4U1VDR",
      verified: true,
      skillsCovered: [
        "Fundamentos de IA & LLMs",
        "Agentes Autónomos & RAG",
        "Prompt Engineering Sistemático",
        "Vibe Coding & Desarrollo de Apps con IA",
      ],
    },
    {
      id: "cert-pau-25",
      title: "Prueba de Acceso a la Universidad PAU +25 (Nota: 8,80)",
      issuer: "Universitat de València",
      year: "2025 - 2026",
      category: "Educación Superior",
      credentialCode: "UV-PAU25-880-APTO",
      verified: true,
      skillsCovered: [
        "Calificación Sobresaliente APTO (8,802)",
        "Rigor Analítico y Metodológico",
        "Habilidades de Comunicación Escrita y Síntesis",
      ],
    },
    // --- Nuevas Certificaciones ---
    {
      id: "cert-udemy-ai-negocios-no-code",
      title: "Agentes de IA para Negocios: Automatiza sin Programar",
      issuer: "Udemy",
      year: "2026",
      category: "Inteligencia Artificial",
      credentialCode: "UC-a4ec4b2f-c3ab-42a6-9c9e-cb6e6e680052",
      verified: true,
      skillsCovered: ["Agentes de IA", "Automatización No-Code", "Optimización de Procesos", "Estrategia de Negocio con IA"],
    },
    {
      id: "cert-udemy-ai-transformacion-negocios",
      title: "Agentes de IA: Transformando Negocios y Procesos Complejos",
      issuer: "Udemy",
      year: "2026",
      category: "Inteligencia Artificial",
      credentialCode: "UC-9a8fc5df-66fe-4a49-9f57-57da88abdfbf",
      verified: true,
      skillsCovered: ["Agentes de IA", "Transformación Digital", "Automatización de Procesos", "Estrategia de Negocio con IA"],
    },
    {
      id: "cert-udemy-chatgpt-prompt-engineering",
      title: "ChatGPT: Productividad y Creatividad con Prompt Engineering",
      issuer: "Udemy",
      year: "2026",
      category: "Inteligencia Artificial",
      credentialCode: "UC-7a6f5890-35cc-4987-b1c9-a612062938f3",
      verified: true,
      skillsCovered: ["Prompt Engineering", "ChatGPT", "Productividad con IA", "Creatividad Asistida por IA"],
    },
    {
      id: "cert-coursera-google-ai-pro",
      title: "Google AI Professional Certificate",
      issuer: "Google (via Coursera)",
      year: "2026",
      category: "Inteligencia Artificial",
      credentialCode: "HSMUZE4U1VDR",
      verified: true,
      skillsCovered: [
        "Fundamentos de IA",
        "Brainstorming con IA",
        "Investigación con IA",
        "Escritura y Comunicación con IA",
        "Creación de Contenido con IA",
        "Análisis de Datos con IA",
        "Desarrollo de Apps con IA",
        "Prompt Engineering",
        "Vibe Coding",
      ],
    },
    {
      id: "cert-freecodecamp-responsive-web-design",
      title: "Responsive Web Design Developer Certification",
      issuer: "freeCodeCamp.org",
      year: "2026",
      category: "Full Stack Moderno & Datos",
      credentialCode: "https://freecodecamp.org/certification/abraham_martin_heras/responsive-web-design-v9",
      verified: true,
      skillsCovered: ["HTML5", "CSS3", "Diseño Web Responsivo", "Accesibilidad Web", "Desarrollo Frontend"],
    },
    {
      id: "cert-serveo-conductas-prohibidas",
      title: "Conductas prohibidas",
      issuer: "SERVEO Campus",
      year: "2025",
      category: "Ciberseguridad",
      credentialCode: "",
      verified: false,
      skillsCovered: ["Ética Empresarial", "Integridad Moral", "Prevención de Delitos", "Cumplimiento Normativo"],
    },
    {
      id: "cert-conduccion-eficiente-ve",
      title: "Conducción Eficiente Vehículos Eléctricos con Semirremolque",
      issuer: "ACADEMIA DE CONOCIMIENTOS TÉCNICOS",
      year: "2025",
      category: "Automatización",
      credentialCode: "",
      verified: false,
      skillsCovered: ["Conducción Eficiente", "Vehículos Eléctricos", "Manejo de Semirremolques", "Logística Sostenible"],
    },
    {
      id: "cert-serveo-codigo-etica",
      title: "Código de ética empresarial",
      issuer: "SERVEO Campus",
      year: "2025",
      category: "Ciberseguridad",
      credentialCode: "",
      verified: false,
      skillsCovered: ["Ética Empresarial", "Comportamiento Profesional", "Cumplimiento Legal", "Responsabilidad Social Corporativa"],
    },
    {
      id: "cert-udemy-gemini-productividad",
      title: "Gemini desde cero: Aumenta productividad con la IA de Google",
      issuer: "Udemy",
      year: "2026",
      category: "Inteligencia Artificial",
      credentialCode: "UC-901ead25-65bf-464a-9fc1-bc977b71262d",
      verified: true,
      skillsCovered: ["Google Gemini", "Productividad con IA", "Herramientas de IA"],
    },
    {
      id: "cert-udemy-perplexity-ai",
      title: "Perplexity Desde Cero: La IA que Supera a Google y ChatGPT",
      issuer: "Udemy",
      year: "2026",
      category: "Inteligencia Artificial",
      credentialCode: "UC-9d8e45cb-107d-4942-b25e-b4dc8915fd06",
      verified: true,
      skillsCovered: ["Perplexity AI", "Búsqueda con IA", "Análisis de Información", "Comparativa de LLMs"],
    },
    {
      id: "cert-udemy-prompt-engineering-definitiva",
      title: "Prompt Engineering con ChatGPT - La guía definitiva.",
      issuer: "Udemy",
      year: "2026",
      category: "Inteligencia Artificial",
      credentialCode: "UC-04abd915-6d04-477e-a0c0-b4a7f3cfa674",
      verified: true,
      skillsCovered: ["Prompt Engineering Avanzado", "ChatGPT", "Diseño de Prompts", "Optimización de Interacciones con LLMs"],
    },
    {
      id: "cert-serveo-proteccion-datos",
      title: "Protección de Datos",
      issuer: "SERVEO Campus",
      year: "2025",
      category: "Ciberseguridad",
      credentialCode: "",
      verified: false,
      skillsCovered: ["GDPR", "Privacidad de Datos", "Seguridad de la Información", "Cumplimiento Normativo"],
    },
    {
      id: "cert-liderazgo-motivacion",
      title: "Liderazgo y Motivación Dirigido a Supervisores y Encargados",
      issuer: "ACADEMIA DE HABILIDADES",
      year: "2024",
      category: "Automatización",
      credentialCode: "",
      verified: false,
      skillsCovered: ["Liderazgo de Equipos", "Motivación", "Gestión de Personal", "Supervisión Operativa"],
    },
    {
      id: "cert-toma-decisiones-resolucion",
      title: "Toma de Decisiones y Resolución de Problemas",
      issuer: "Grupo Hedima",
      year: "2024",
      category: "Automatización",
      credentialCode: "837/8103",
      verified: false,
      skillsCovered: ["Toma de Decisiones", "Resolución de Problemas", "Análisis Estratégico", "Gestión de Riesgos"],
    },
    {
      id: "cert-primeros-auxilios",
      title: "Primeros Auxilios",
      issuer: "Hediprev",
      year: "2024",
      category: "Ciberseguridad",
      credentialCode: "",
      verified: false,
      skillsCovered: ["Soporte Vital Básico", "Gestión de Emergencias", "Seguridad Laboral"],
    },
    {
      id: "cert-prl-cultura-seguridad",
      title: "PRL Cultura Seguridad. Responsable de equipos_Escuela de encargados",
      issuer: "SERVEO Campus",
      year: "2024",
      category: "Ciberseguridad",
      credentialCode: "",
      verified: false,
      skillsCovered: ["Prevención de Riesgos Laborales", "Cultura de Seguridad", "Gestión de Equipos", "Auditoría de Seguridad"],
    },
    {
      id: "cert-plan-emergencias",
      title: "Plan de Emergencias: Actuación en Caso de Evacuación e Incendios",
      issuer: "Hediprev",
      year: "2023",
      category: "Ciberseguridad",
      credentialCode: "",
      verified: false,
      skillsCovered: ["Gestión de Emergencias", "Evacuación", "Extinción de Incendios", "Seguridad Industrial"],
    },
    {
      id: "cert-manejo-seguridad-carretillas",
      title: "FSEBON - Manejo y Seguridad en el Uso de Carretillas",
      issuer: "ACADEMIA DE SOSTENIBILIDAD",
      year: "2022",
      category: "Automatización",
      credentialCode: "",
      verified: false,
      skillsCovered: ["Manejo de Carretillas", "Seguridad Operativa", "Logística de Almacén"],
    },
    {
      id: "cert-prl-puesto-trabajo",
      title: "PRL en el Puesto de Trabajo",
      issuer: "ACADEMIA DE SOSTENIBILIDAD",
      year: "2022",
      category: "Ciberseguridad",
      credentialCode: "",
      verified: false,
      skillsCovered: ["Prevención de Riesgos Laborales", "Salud Ocupacional", "Seguridad en el Trabajo"],
    },
    {
      id: "cert-calidad-medioambiente-seguridad-alimentaria",
      title: "FSEINT - Formación en Calidad, Medioambiente y Seguridad Alimentaria",
      issuer: "ACADEMIA DE SOSTENIBILIDAD",
      year: "2019",
      category: "Automatización",
      credentialCode: "",
      verified: false,
      skillsCovered: ["Gestión de Calidad", "Normativa Medioambiental", "Seguridad Alimentaria", "APPCC"],
    },
    {
      id: "cert-uso-tractores",
      title: "FSEINT - Uso de Tractores",
      issuer: "ACADEMIA DE SOSTENIBILIDAD",
      year: "2015",
      category: "Automatización",
      credentialCode: "",
      verified: false,
      skillsCovered: ["Operación de Maquinaria Pesada", "Seguridad Agrícola", "Manejo de Tractores"],
    },
    {
      id: "cert-formacion-codisys-logistica",
      title: "FSEINT - Formación Codisys Logística",
      issuer: "ACADEMIA DE SOSTENIBILIDAD",
      year: "2015",
      category: "Automatización",
      credentialCode: "",
      verified: false,
      skillsCovered: ["Sistema Codisys", "Gestión Logística", "Software de Almacén"],
    },
  ],

  playgroundTabs: [
    {
      id: "smart-cleaner",
      tabLabel: "1. Smart Data Cleaner (Ofimática IA)",
      shortBadge: "Excel / CSV + IA",
      title: "Smart Data Cleaner & Normalizador Ofimático con IA",
      subtitle:
        "Convierte tablas desordenadas de Excel/CSV con fechas inconsistentes, NIFs/teléfonos mal formateados y duplicados en datos limpios listos para ERP.",
      description:
        "Motor de procesamiento interactivo: carga lotes de registros operativos, aplica reglas deterministas combinadas con inferencia semántica y exporta el resultado validado en tiempo real.",
      iconName: "file-spreadsheet",
      accent: "emerald",
      techStack: ["TypeScript", "Python ETL Pattern", "Schema Validation", "AI Normalization"],
      sprintStatus: "Demostrador Activo · Entorno Interactivo",
      previewHighlights: [
        { label: "Detección de Anomalías", value: "Fechas, Monedas, Duplicados y Campos Huérfanos" },
        { label: "Salida Estandarizada", value: "JSON Tipado / CSV Limpio / Resumen Ejecutivo" },
        { label: "Ahorro Operativo Estimado", value: "45 min de revisión manual → 1.2 segundos" },
      ],
      mockTerminalLines: [
        "[INPUT]  Cargando 'reporte_almacen_turnos_bruto.csv' (1,420 filas)...",
        "[SCAN]   Detectadas 84 fechas mixtas (DD/MM/YY vs YYYY-MM-DD) y 19 registros duplicados.",
        "[AI-FIX] Normalizando nombres de proveedores y categorías operativas con esquema estricto...",
        "[OUTPUT] 1,401 registros 100% validados y listos para exportación a ERP.",
      ],
    },
    {
      id: "workflow-simulator",
      tabLabel: "2. Workflow Pipeline Simulator (n8n / Python)",
      shortBadge: "n8n + Playwright",
      title: "Simulador de Pipeline de Automatización End-to-End",
      subtitle:
        "Visualiza cómo se orquesta un flujo autónomo real combinando Webhooks en n8n, extracción con Playwright, análisis con IA y notificación ejecutiva.",
      description:
        "Lienzo de simulación que permite trazar el recorrido paso a paso de flujos operativos reales (recepción de albaranes, scraping de portales logísticos y alertas de seguridad), inspeccionando el payload JSON en cada nodo.",
      iconName: "network",
      accent: "cyan",
      techStack: ["n8n Workflows", "Playwright Headless", "Python Worker", "Webhook JSON"],
      sprintStatus: "Demostrador Activo · Telemetría en Vivo",
      previewHighlights: [
        { label: "Nodo 1 · Trigger & Ingesta", value: "Webhook / Correo entrante con adjunto operativo" },
        { label: "Nodo 2 · Extracción & Scraping", value: "Playwright verifica estado en portal externo" },
        { label: "Nodo 3 · Decisión IA & Acción", value: "Clasifica urgencia, actualiza hoja maestra y notifica" },
      ],
      mockTerminalLines: [
        "▶ [NODE 01: n8n Webhook]     Evento recibido: nuevo_parte_incidencia #8841",
        "▶ [NODE 02: Playwright Bot]  Verificando SLA de ruta en portal logístico (240ms)...",
        "▶ [NODE 03: LLM Classifier]  Prioridad asignada: ALTA · Categoría: Retraso Aduana",
        "✔ [NODE 04: Sheets & Slack]  Fila consolidada en Master Tracker + Alerta enviada.",
      ],
    },
    {
      id: "ask-my-cv",
      tabLabel: "3. Ask My CV (Agente IA Contextual)",
      shortBadge: "RAG CV Agent",
      title: "Ask My CV — Agente Contextual sobre Perfil, Stack y Casos de Éxito",
      subtitle:
        "Pregunta en lenguaje natural cómo encaja mi experiencia híbrida (IA + Automatización + Operaciones + Ciberseguridad) en los retos de tu empresa.",
      description:
        "Agente conversacional especializado en mi perfil técnico, stack tecnológico y casos de éxito reales para resolver consultas sobre arquitectura, automatización y encaje de proyectos.",
      iconName: "sparkles",
      accent: "emerald",
      techStack: ["Contextual Agent", "Typed Knowledge Base", "Next.js App Router", "Prompt Guardrails"],
      sprintStatus: "Demostrador Activo · Base de Conocimiento Conectada",
      previewHighlights: [
        { label: "Base de Conocimiento Verificada", value: "Respuestas ancladas en datos curriculares y proyectos reales" },
        { label: "Prompts Sugeridos", value: "«¿Cómo automatizarías nuestros reportes en Excel con n8n?»" },
        { label: "Enfoque Ejecutivo", value: "Respuestas orientadas a ROI, seguridad y entrega rápida" },
      ],
      mockTerminalLines: [
        "USER > ¿Qué aporta tu experiencia en operaciones logísticas al desarrollo con IA?",
        "AGENT> Mi experiencia supervisando operaciones críticas me permite detectar rápido dónde",
        "       fallan los procesos reales en planta u oficina y diseñar automatizaciones (n8n, Python,",
        "       Playwright) robustas, seguras y fáciles de adoptar por el equipo.",
      ],
    },
  ],

  timeline: [
    {
      id: "exp-fullstack-ai",
      period: "2025 — Presente",
      role: "Full Stack AI Developer & Especialista en Automatización de Procesos",
      organization: "Proyectos de Ingeniería de Software, Automatización & Vibe Coding",
      location: "España · Remoto",
      type: "tech-ai",
      badgeText: "Full Stack AI & Automation",
      summary:
        "Diseño y desarrollo de aplicaciones web modernas (Next.js, TypeScript, Tailwind) y arquitecturas de automatización operativa con Python, n8n, Playwright y modelos de lenguaje (LLMs).",
      achievements: [
        "Desarrollo de flujos automatizados en n8n y scripts en Python para transformar, limpiar y consolidar hojas de cálculo operativas complejas sin intervención humana.",
        "Automatización de navegación, extracción de datos y validación E2E mediante Playwright para conectar portales sin API pública.",
        "Aplicación de metodologías de Vibe Coding con control estricto de tipos (TypeScript) y buenas prácticas de ciberseguridad para acelerar el ciclo de idea a producción.",
      ],
      technologies: ["Next.js", "TypeScript", "Python", "n8n", "Playwright", "LLMs / Agents", "Tailwind CSS"],
      impactMetric: "Reducción drástica de tiempos de procesamiento documental y reporting",
    },
    {
      id: "cert-milestone-cyber-ai",
      period: "2024 — 2026",
      role: "Especialización Intensiva Certificada: Ciberseguridad, IA & Python",
      organization: "Certificaciones Oficiales & Formación Técnica Continua",
      location: "España",
      type: "education",
      badgeText: "Certificaciones Oficiales",
      summary:
        "Consolidación formal de competencias técnicas en programación con Python, Inteligencia Artificial aplicada, automatización de sistemas y principios de Ciberseguridad defensiva y operativa.",
      achievements: [
        "Obtención de certificaciones oficiales en Ciberseguridad, Inteligencia Artificial y desarrollo con Python.",
        "Implementación de laboratorios prácticos de limpieza de datos ofimáticos, seguridad en APIs y orquestación de agentes inteligentes.",
        "Integración de estándares de seguridad desde el diseño (Security-by-Design) en cada script y flujo de trabajo automatizado.",
      ],
      technologies: ["Ciberseguridad", "Python", "IA Generativa", "Automatización Segura", "Data Wrangling"],
      impactMetric: "3 bloques de certificación técnica completados con enfoque práctico",
    },
    // --- Nuevas entradas en Timeline ---
    {
      id: "edu-pau-25",
      period: "2025 — 2026",
      role: "Pruebas de Acceso a la Universidad para Mayores de 25 años",
      organization: "Universitat de València",
      location: "València, España",
      type: "education",
      badgeText: "Acceso Universidad",
      summary:
        "Superación de las pruebas de acceso a la universidad para mayores de 25 años, demostrando aptitudes académicas en diversas materias.",
      achievements: [
        "Obtención de calificación APTO con nota media de 8.802",
        "Consolidación de conocimientos en Lengua, Inglés, Geografía e Historia",
      ],
      technologies: [],
      impactMetric: "Acceso a estudios superiores",
    },
    {
      id: "exp-serveo-supervision-digitalization",
      period: "2013 — 2026",
      role: "Supervisor de Operativa, Optimización de Procesos y Digitalización Ofimática",
      organization: "SERVEO SERVICIOS, S.A.U. (anteriormente Ferrovial)",
      location: "España",
      type: "automation-ops",
      badgeText: "Supervisión & Digitalización",
      summary:
        "Liderazgo en la gestión de servicios operativos, coordinación de equipos y transición hacia la digitalización de flujos de trabajo. Implementación de herramientas digitales para control y facturación, y automatización de reportes.",
      achievements: [
        "Supervisión directa de personal operativo y cumplimiento de objetivos de servicio y cohesión del equipo.",
        "Gestión de inventarios, registro de movimientos y facturación mediante plataformas digitales (Salesforce, Codysis, Active).",
        "Estandarización de registros operativos, control de incidencias y seguimiento de KPIs reduciendo errores humanos de transcripción.",
        "Diseño de herramientas ofimáticas avanzadas y primeros pipelines de automatización para agilizar el cierre de turnos y conciliación de datos.",
      ],
      technologies: ["Salesforce", "Codysis", "Microsoft Office Suite", "Sistemas de Gestión de Almacén (SGA/WMS)", "Automatización Ofimática"],
      impactMetric: "Estandarización del flujo de información y reducción de errores operativos",
    },
    {
      id: "exp-logistics-specialist",
      period: "2006 — 2013",
      role: "Especialista en Operaciones de Servicio y Logística",
      organization: "CREMONINI CHEF IBERICA, S.A. / COMPAGNIE INTERNATIONALE WAGONS LITS ET D",
      location: "España",
      type: "logistics-ops",
      badgeText: "Logística Ferroviaria",
      summary:
        "Ejecución y supervisión de procesos de preparación y entrega de servicios en el sector transporte-hostelería, con foco en el control de carga, descarga y optimización de tiempos de respuesta.",
      achievements: [
        "Coordinación integral de flujos de mercancías, rutas, inventarios y cumplimiento estricto de plazos operativos bajo presión.",
        "Control de carga y descarga de mercancías, asegurando la rentabilidad y el correcto estado de los equipos frigoríficos y de almacenamiento.",
        "Colaboración en la optimización de tiempos de respuesta para garantizar la satisfacción del cliente.",
      ],
      technologies: ["Sistemas de Gestión Logística", "Control de Inventarios", "Gestión de Rutas"],
    },
    {
      id: "exp-early-ops-production",
      period: "1999 — 2006",
      role: "Operario de Producción, Auxiliar de Logística y Técnico de Micro-reparación",
      organization: "Diversas empresas (Aznar Textil, Jume-Mafesa, Salavert Serra, A. Perez y Cia, Liñana Segundo, Liderlab ETT, etc.)",
      location: "España",
      type: "logistics-ops",
      badgeText: "Base Industrial & Logística",
      summary:
        "Experiencia temprana en entornos industriales y logísticos, incluyendo producción, gestión de stocks, operativa portuaria y reparación de micro-electrónica, sentando las bases para una comprensión profunda de las operaciones.",
      achievements: [
        "Manejo de maquinaria industrial y logística en diversos sectores.",
        "Gestión de inventarios, stocks y atención técnica en suministros.",
        "Diagnóstico y reparación de micro-circuitería y sistemas electrónicos.",
        "Adaptación a diversos entornos operativos y equipos, desarrollando una sólida base técnica y de resolución de problemas.",
      ],
      technologies: ["Sistemas de Producción", "Gestión de Stocks", "Electrónica Básica", "Herramientas de Taller", "Operativa Portuaria"],
    },
  ],
};

export const cvDataEn: CVData = {
  profile: {
    name: "Abraham Martín Heras",
    role: "Full Stack AI · Operational & Office Automation · Vibe Coding",
    tagline:
      "I turn operational bottlenecks, chaotic spreadsheets, and repetitive manual tasks into autonomous systems, AI agents, and high-performance web applications.",
    availabilityBadge: {
      statusText: "Available for projects and immediate start",
      subText: "Remote / Hybrid · Full Stack AI & Process Automation",
      isAvailable: true,
    },
    executiveSummary:
      "A unique hybrid profile combining over a decade of leadership in critical logistics and operations (Serveo, Cremonini, Wagons-Lits) with modern software engineering (Next.js, TypeScript, Python), LLM agent orchestration, geospatial systems (PostGIS/MapLibre), and advanced office automation.",
    valueProposition:
      "I don't just ship fast software through AI-augmented Vibe Coding with architectural rigor and cybersecurity; I understand operations from the inside out, spot real-world friction, and automate it with tangible ROI from week one.",
    location: "Spain · Global Operations / Remote",
    cvPdfUrl: "/cv-abraham-martin-heras-fullstack-ai.pdf",
    socials: [
      {
        id: "github",
        label: "GitHub",
        url: "https://github.com/superabienator/abraham-martin-heras",
        username: "@superabienator",
        iconName: "github",
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        url: "https://linkedin.com/",
        username: "in/abraham-martin-heras",
        iconName: "linkedin",
      },
      {
        id: "email",
        label: "Direct Contact",
        url: "mailto:contacto@abraham.dev",
        username: "contacto@abraham.dev",
        iconName: "mail",
      },
    ],
    metrics: [
      {
        id: "hours-saved",
        value: "-75%",
        label: "Time Spent in Office Tasks",
        detail: "Automating reporting, Excel/CSV joins, and document validation via Python scripts and AI.",
        accent: "emerald",
      },
      {
        id: "workflows",
        value: "+40",
        label: "Pipelines & Bots in Production",
        detail: "Autonomous n8n workflows, resilient Playwright scrapers, and API-connected RAG agents.",
        accent: "cyan",
      },
      {
        id: "vibe-coding",
        value: "10x",
        label: "Delivery Speed (Vibe Coding)",
        detail: "Rapid AI-assisted prototyping and full-stack deployment with strict typing and security guardrails.",
        accent: "emerald",
      },
      {
        id: "ops-reliability",
        value: "99.8%",
        label: "Operational Traceability",
        detail: "Logistical supervision mindset and certified cybersecurity hygiene applied to every workflow.",
        accent: "cyan",
      },
    ],
  },

  languages: [
    {
      id: "lang-spanish",
      language: "Spanish / Castellano",
      level: "Native",
      cefr: "C2 (Native)",
      description:
        "Mother tongue. Complete executive command, technical documentation, stakeholder negotiation, and team leadership.",
      fluencyPercent: 100,
      badge: "Native (C2)",
    },
    {
      id: "lang-valencian",
      language: "Valencian / Catalan",
      level: "Upper-Intermediate",
      cefr: "B2 - C1",
      description:
        "Full professional and administrative proficiency across oral discussions, written reports, and official documentation.",
      fluencyPercent: 85,
      badge: "Professional Working Fluency",
    },
    {
      id: "lang-english",
      language: "English (Technical English)",
      level: "Professional Technical",
      cefr: "B2 (Technical English)",
      description:
        "Advanced proficiency in assimilating technical documentation, RFCs, AI research papers, and international APIs; intermediate conversational command.",
      fluencyPercent: 80,
      badge: "Advanced Technical English",
    },
  ],

  bentoCategories: [
    {
      id: "ai-agents",
      title: "Generative AI, LLMs & Agent Architecture",
      subtitle: "Intelligent systems tailored for real business outcomes",
      businessImpact:
        "Designing and embedding autonomous agents capable of reasoning over business docs, extracting structured schemas (JSON) from unstructured files, and acting on internal ERPs and APIs.",
      metricHighlight: "Semantic extraction with 99% structural precision",
      iconName: "bot",
      accent: "emerald",
      gridSpan: "col-span-12 lg:col-span-7",
      skills: [
        {
          name: "LLM API Integration (Gemini / OpenAI / Claude)",
          level: "Especialista",
          context: "Function calling, structured output schemas, prompt caching, and cost/latency budgeting",
        },
        {
          name: "Agent Architectures & Contextual RAG",
          level: "Avanzado",
          context: "Dynamic context injection, session memory, and deterministic guardrails",
        },
        {
          name: "Vibe Coding & AI-Augmented Engineering",
          level: "Especialista",
          context: "Accelerated development with code agents while maintaining clean architecture and typing",
        },
        {
          name: "Systematic Prompt Engineering & Evals",
          level: "Especialista",
          context: "Deterministic prompt design for operational classification, sanitization, and auditing",
        },
      ],
      useCases: [
        "Internal assistants querying operational SOPs and compliance guidelines in sub-second time",
        "Intelligent triaging and routing of critical tickets, logistics waybills, and emails",
        "Automated multi-format catalog and inventory normalization powered by LLMs",
      ],
    },
    {
      id: "automation-office",
      title: "Intelligent Automation & Office Systems",
      subtitle: "Radical elimination of repetitive manual workloads",
      businessImpact:
        "End-to-end orchestration connecting complex spreadsheets, legacy software, and web portals lacking APIs via autonomous n8n workflows, Python workers, and headless Playwright browsers.",
      metricHighlight: "From hours of copying and pasting in Excel to 4-second runs",
      iconName: "workflow",
      accent: "cyan",
      gridSpan: "col-span-12 lg:col-span-5",
      skills: [
        {
          name: "Visual & Hybrid Orchestration in n8n",
          level: "Especialista",
          context: "Webhooks, custom JS/Python nodes, robust error handling, retries, and proactive alerts",
        },
        {
          name: "Playwright (Web Scraping & E2E Automation)",
          level: "Avanzado",
          context: "Supplier portal automation, headless background downloads, and automated testing",
        },
        {
          name: "Advanced Excel / CSV / Document Wrangling",
          level: "Especialista",
          context: "Programmatic cleaning with Pandas/OpenPyXL, massive reconciliation, and PDF generation",
        },
        {
          name: "Office Ecosystem Integration",
          level: "Avanzado",
          context: "Direct integration across Google Workspace, Microsoft 365, Notion, Slack, and Telegram",
        },
      ],
      useCases: [
        "Daily automated consolidation of logistics reports across disparate vendor portals",
        "Instant sanitization of spreadsheets with broken date formats, duplicates, and missing IDs",
        "Automated extraction and reconciliation bots for invoices, purchase orders, and price lists",
      ],
    },
    {
      id: "fullstack-data",
      title: "Modern Full Stack & Data Engineering",
      subtitle: "Fast, elegant, and production-ready web interfaces",
      businessImpact:
        "Building bespoke internal tools, operational command centers, and SaaS products with executive-grade aesthetics, end-to-end TypeScript safety, and serverless edge deployment.",
      metricHighlight: "0 unnecessary bloat · Instant performance on Edge & Vercel",
      iconName: "code",
      accent: "cyan",
      gridSpan: "col-span-12 lg:col-span-5",
      skills: [
        {
          name: "Next.js (App Router) & React 19",
          level: "Avanzado",
          context: "Server Components, Route Handlers, streaming UI, and optimistic reactive state",
        },
        {
          name: "Strict TypeScript & Modular Architecture",
          level: "Avanzado",
          context: "Strict typed data contracts, clear UI/Data separation, and long-term maintainability",
        },
        {
          name: "Python Backend & High-Throughput Processing",
          level: "Especialista",
          context: "FastAPI, high-performance CLI utilities, lightweight ETLs, and system automation",
        },
        {
          name: "Geospatial Systems & Maps (PostGIS / MapLibre)",
          level: "Avanzado",
          context: "Spatial modeling, vector tiles, spatial query indexing, and interactive rendering",
        },
        {
          name: "Tailwind CSS & UI/UX Design (Linear/Vercel Aesthetic)",
          level: "Especialista",
          context: "Sober dark-mode glassmorphism, responsive Bento Grids, and kinetic interactions",
        },
      ],
      useCases: [
        "Custom operational dashboards replacing fragile shared Excel sheets",
        "Interactive micro-tools for operations, warehouse controllers, and support reps",
        "Lightweight serverless APIs bridging AI models with SQL/PostgreSQL databases",
      ],
    },
    {
      id: "cybersecurity-ops",
      title: "Applied Cybersecurity & Critical Operations Management",
      subtitle: "Real-world business acumen, risk governance, and plant leadership",
      businessImpact:
        "Unlike purely theoretical developers, I combine certified cybersecurity training with over 10 years of direct supervision in mission-critical logistics, where downtime carries severe financial penalties.",
      metricHighlight: "Security-by-Design + Zero Operational Friction Mindset",
      iconName: "shield",
      accent: "emerald",
      gridSpan: "col-span-12 lg:col-span-7",
      skills: [
        {
          name: "Cybersecurity & Data Privacy in Automation",
          level: "Avanzado",
          context: "Secure secrets management, prompt input sanitization, SIEM basics, and least privilege",
        },
        {
          name: "Critical Operations & Logistics Leadership",
          level: "Especialista",
          context: "Team leadership, SLA enforcement, inventory tracking, and crisis resolution",
        },
        {
          name: "Process Auditing & Bottleneck Detection",
          level: "Especialista",
          context: "Directly translating floor and office pain points into crisp technical specifications",
        },
        {
          name: "AI Governance & Data Leakage Prevention",
          level: "Avanzado",
          context: "PII anonymization prior to LLM inference and deterministic output verification",
        },
      ],
      useCases: [
        "Designing automated pipelines compliant with strict corporate audit logs and data hygiene",
        "Digitizing shift logs, incident tracking, and real-time operational telemetry",
        "Effective bridge between executive directors, administrative staff, and technical engineers",
      ],
    },
  ],

  certifications: cvDataEs.certifications,

  playgroundTabs: [
    {
      id: "smart-cleaner",
      tabLabel: "1. Smart Data Cleaner (AI Office Tools)",
      shortBadge: "Excel / CSV + AI",
      title: "Smart Data Cleaner & AI-Powered Office Normalizer",
      subtitle:
        "Transforms messy Excel/CSV tables with mixed dates, unformatted Tax IDs/phone numbers, and duplicates into ERP-ready datasets.",
      description:
        "Interactive processing engine: loads operational batches, applies deterministic rules combined with semantic normalization, and exports validated records in real time.",
      iconName: "file-spreadsheet",
      accent: "emerald",
      techStack: ["TypeScript", "Python ETL Pattern", "Schema Validation", "AI Normalization"],
      sprintStatus: "Active Demo · Live Interactive Sandbox",
      previewHighlights: [
        { label: "Anomaly Detection", value: "Dates, Currencies, Duplicates, and Orphaned Fields" },
        { label: "Standardized Output", value: "Typed JSON / Clean CSV / Executive Summary" },
        { label: "Estimated Time Saved", value: "45 minutes manual audit → 1.2 seconds" },
      ],
      mockTerminalLines: [
        "[INPUT]  Loading 'raw_shift_warehouse_report.csv' (1,420 rows)...",
        "[SCAN]   Found 84 mixed dates (DD/MM/YY vs YYYY-MM-DD) and 19 duplicate entries.",
        "[AI-FIX] Normalizing vendor names and categories with strict JSON schema...",
        "[OUTPUT] 1,401 records 100% validated and ready for ERP import.",
      ],
    },
    {
      id: "workflow-simulator",
      tabLabel: "2. Workflow Pipeline Simulator (n8n / Python)",
      shortBadge: "n8n + Playwright",
      title: "End-to-End Autonomous Pipeline Simulator",
      subtitle:
        "Visualize how an autonomous operational pipeline coordinates n8n Webhooks, Playwright web extraction, AI reasoning, and executive notifications.",
      description:
        "Simulation canvas tracing step-by-step real operational journeys (waybill ingestion, logistics portal scraping, and security triaging) while inspecting live JSON payloads.",
      iconName: "network",
      accent: "cyan",
      techStack: ["n8n Workflows", "Playwright Headless", "Python Worker", "Webhook JSON"],
      sprintStatus: "Active Demo · Real-time Telemetry",
      previewHighlights: [
        { label: "Node 1 · Trigger & Ingestion", value: "Webhook / Incoming email with shipment PDF attachment" },
        { label: "Node 2 · Scraping & Verification", value: "Playwright queries carrier portal status in real-time" },
        { label: "Node 3 · AI Decision & Action", value: "Classifies urgency, reconciles master sheet, and alerts team" },
      ],
      mockTerminalLines: [
        "▶ [NODE 01: n8n Webhook]     Event received: new_incident_ticket #8841",
        "▶ [NODE 02: Playwright Bot]  Checking route SLA on external tracking portal (240ms)...",
        "▶ [NODE 03: LLM Classifier]  Priority assigned: HIGH · Category: Customs Delay",
        "✔ [NODE 04: Sheets & Slack]  Row logged to Master Tracker + Alert broadcasted.",
      ],
    },
    {
      id: "ask-my-cv",
      tabLabel: "3. Ask My CV (Contextual AI Agent)",
      shortBadge: "RAG CV Agent",
      title: "Ask My CV — Contextual Agent for Background, Tech Stack & Impact",
      subtitle:
        "Ask in natural language how my hybrid background (AI + Automation + Operations + Cybersecurity) addresses your company's operational challenges.",
      description:
        "Conversational AI agent trained on my verified professional background, tech stack, and real use cases to answer questions regarding architecture, tooling, and team fit.",
      iconName: "sparkles",
      accent: "emerald",
      techStack: ["Contextual Agent", "Typed Knowledge Base", "Next.js App Router", "Prompt Guardrails"],
      sprintStatus: "Active Demo · Connected Knowledge Base",
      previewHighlights: [
        { label: "Verified Knowledge Base", value: "Answers strictly anchored in actual career data and projects" },
        { label: "Sample Queries", value: "«How would you automate our Excel reporting using n8n?»" },
        { label: "Executive Focus", value: "Concise answers centered around business ROI, security, and speed" },
      ],
      mockTerminalLines: [
        "USER > How does your logistics background benefit AI software development?",
        "AGENT> Having spent over a decade leading critical plant and transit operations, I",
        "       immediately spot where real-world processes break down and engineer automated",
        "       solutions (n8n, Python, Playwright) that teams adopt effortlessly.",
      ],
    },
  ],

  timeline: [
    {
      id: "exp-fullstack-ai",
      period: "2025 — Present",
      role: "Full Stack AI Developer & Process Automation Specialist",
      organization: "Software Engineering, Autonomous Pipelines & Vibe Coding",
      location: "Spain · Remote",
      type: "tech-ai",
      badgeText: "Full Stack AI & Automation",
      summary:
        "Designing and shipping modern web applications (Next.js, TypeScript, Tailwind) and operational automation architectures with Python, n8n, Playwright, and LLM integrations.",
      achievements: [
        "Built automated n8n workflows and Python scripts to transform, sanitize, and reconcile complex operational spreadsheets without manual touchpoints.",
        "Engineered headless web navigation and data validation bots via Playwright to bridge internal systems with supplier portals lacking APIs.",
        "Applied Vibe Coding methodologies backed by strict TypeScript types and cybersecurity best practices to compress development cycles from concept to production.",
      ],
      technologies: ["Next.js", "TypeScript", "Python", "n8n", "Playwright", "LLMs / Agents", "Tailwind CSS"],
      impactMetric: "Drastic reduction in manual document processing and reporting turnaround",
    },
    {
      id: "cert-milestone-cyber-ai",
      period: "2024 — 2026",
      role: "Intensive Certified Specialization: Cybersecurity, AI & Python",
      organization: "Official Certifications & Advanced Technical Training",
      location: "Spain",
      type: "education",
      badgeText: "Official Certifications",
      summary:
        "Formal mastery of advanced Python programming, applied Generative AI, system automation, and defensive/operational cybersecurity principles.",
      achievements: [
        "Earned verified official credentials in Google Cybersecurity (260h), Professional Python (260h), and Google AI Professional.",
        "Implemented hands-on labs covering office data cleaning, API hardening, and agent orchestration.",
        "Embedded Security-by-Design standards into all automated workflows and codebases.",
      ],
      technologies: ["Cybersecurity", "Python", "Generative AI", "Secure Automation", "Data Wrangling"],
      impactMetric: "3 intensive certification programs completed with rigorous practical capstones",
    },
    {
      id: "edu-pau-25",
      period: "2025 — 2026",
      role: "University Entrance Examination for Over 25s (PAU +25)",
      organization: "Universitat de València",
      location: "Valencia, Spain",
      type: "education",
      badgeText: "Higher Education",
      summary:
        "Successfully passed the official Spanish University Entrance Examination for Adults with honors.",
      achievements: [
        "Achieved Outstanding APTO grade with an 8.802 GPA",
        "Demonstrated high academic analytical rigor in Language, English, Geography, and History",
      ],
      technologies: [],
      impactMetric: "Official qualification for higher university degrees",
    },
    {
      id: "exp-serveo-supervision-digitalization",
      period: "2013 — 2026",
      role: "Operations Supervisor, Process Optimization & Office Digitalization",
      organization: "SERVEO SERVICIOS, S.A.U. (formerly Ferrovial Servicios)",
      location: "Spain",
      type: "automation-ops",
      badgeText: "Supervision & Digitalization",
      summary:
        "Led on-site operational service delivery, coordinated teams under strict SLAs, and spearheaded the transition toward digital workflows, automated shift reporting, and billing controls.",
      achievements: [
        "Direct supervision of operational staff, ensuring service continuity and high team cohesion under intense operational schedules.",
        "Managed inventory turnover, stock tracking, and billing via enterprise digital platforms (Salesforce, Codysis, Active).",
        "Standardized shift logs, incident registers, and KPI tracking, slashing human transcription errors.",
        "Engineered advanced office utilities and first-generation automation scripts to accelerate shift handovers and data reconciliation.",
      ],
      technologies: ["Salesforce", "Codysis", "Microsoft Office Suite", "WMS / Logistics Software", "Office Automation"],
      impactMetric: "Streamlined operational data flow and eliminated reporting delays",
    },
    {
      id: "exp-logistics-specialist",
      period: "2006 — 2013",
      role: "Service Operations & Railway Logistics Specialist",
      organization: "CREMONINI CHEF IBERICA, S.A. / COMPAGNIE INTERNATIONALE WAGONS-LITS",
      location: "Spain",
      type: "logistics-ops",
      badgeText: "Railway Logistics",
      summary:
        "Executed and supervised logistics and replenishment operations across high-speed transport networks, focusing on cargo control, cold-chain integrity, and rapid turnaround times.",
      achievements: [
        "Coordinated end-to-end freight distribution, routes, inventories, and time-critical deliveries under strict departure windows.",
        "Monitored cargo loading and unloading, ensuring regulatory compliance and refrigeration unit integrity.",
        "Streamlined turnaround operations to maintain top passenger service satisfaction.",
      ],
      technologies: ["Logistics Management Systems", "Inventory Control", "Fleet Route Planning"],
    },
    {
      id: "exp-early-ops-production",
      period: "1999 — 2006",
      role: "Production Operator, Logistics Assistant & Micro-Repair Technician",
      organization: "Various industrial and supply chain firms (Aznar Textil, Jume-Mafesa, Salavert Serra, etc.)",
      location: "Spain",
      type: "logistics-ops",
      badgeText: "Industrial & Logistics Core",
      summary:
        "Early background across manufacturing plants, warehousing, port logistics, and electronics repair, forging a deep practical understanding of operational ground realities.",
      achievements: [
        "Operated industrial machinery across manufacturing and textile plants.",
        "Managed stock, incoming inventory, and equipment maintenance.",
        "Diagnosed and repaired micro-circuitry and electronic assemblies.",
        "Developed adaptability and robust hands-on problem-solving across fast-paced environments.",
      ],
      technologies: ["Production Systems", "Stock Control", "Basic Electronics", "Workshop Tools", "Port Operations"],
    },
  ],
};

// Default backward-compatible export
export const cvData: CVData = cvDataEs;

// Language getter
export function getCVData(lang: "es" | "en" = "es"): CVData {
  return lang === "en" ? cvDataEn : cvDataEs;
}

export const uiDictionary = {
  es: {
    nav: {
      overview: "Resumen",
      bento: "Bento Stack & Certs",
      playground: "AI Playground",
      timeline: "Trayectoria",
      downloadCv: "CV PDF",
    },
    hero: {
      titlePrefix: "Ingeniería Full Stack & IA con",
      titleHighlight: "mentalidad de operaciones reales.",
      hybridCardTitle: "Perfil Híbrido Diferencial",
      businessCardTitle: "Impacto Directo en Negocio",
      ctaDownloadCv: "Descargar CV Tradicional (PDF)",
      location: "España · Operativa Global / Remoto",
    },
    bento: {
      tagline: "Arquitectura de Competencias · Holographic Bento Grid",
      title: "Habilidades Agrupadas por Impacto de Negocio",
      subtitle:
        "Combinación de ingeniería Full Stack, agentes de IA, automatización de procesos ofimáticos y supervisión operativa certificada en ciberseguridad.",
      useCasesTitle: "Casos de Uso Reales Resueltos:",
      languagesTitle: "Competencias Lingüísticas & Comunicación",
      languagesSubtitle:
        "Capacidad de interlocución fluida en entornos operativos locales, corporativos y de documentación técnica internacional.",
    },
    certifications: {
      title: "Certificaciones Oficiales Verificadas",
      subtitle: "Ciberseguridad (260h), Programación Python (260h), IA Generativa y PAU +25 (8,80)",
      dragHint: "Arrastra horizontalmente para girar suavemente",
    },
    playground: {
      tagline: "Interactive AI & Automation Playground",
      title: "Demostrador Técnico en Vivo",
      subtitle:
        "Explora las miniaplicaciones interactivas donde convergen herramientas de Ofimática IA, simulación de pipelines n8n/Playwright y el Asistente Contextual.",
    },
    timeline: {
      tagline: "Evolución Profesional & Académica",
      title: "De la Supervisión Operativa Crítica a la Automatización con IA",
      subtitle:
        "Una trayectoria coherente: conocer primero el terreno logístico y operativo para después automatizarlo con software moderno, agentes de IA y seguridad.",
    },
    footer: {
      subtitle: "Arquitectura Full Stack & Interfaces Cinéticas",
    },
  },
  en: {
    nav: {
      overview: "Overview",
      bento: "Bento Stack & Certs",
      playground: "AI Playground",
      timeline: "Experience",
      downloadCv: "Executive CV (PDF)",
    },
    hero: {
      titlePrefix: "Full Stack & AI Engineering with a",
      titleHighlight: "real-world operations mindset.",
      hybridCardTitle: "Differential Hybrid Profile",
      businessCardTitle: "Direct Business Impact",
      ctaDownloadCv: "Download Executive CV (PDF)",
      location: "Spain · Global Operations / Remote",
    },
    bento: {
      tagline: "Skills Architecture · Holographic Bento Grid",
      title: "Competencies Grouped by Business Impact",
      subtitle:
        "Unique blend of Full Stack engineering, AI agents, office process automation, and certified operational cybersecurity oversight.",
      useCasesTitle: "Real Business Use Cases Solved:",
      languagesTitle: "Language Competencies & Communication",
      languagesSubtitle:
        "Fluent communication across local operations, executive environments, and global technical documentation.",
    },
    certifications: {
      title: "Verified Official Certifications",
      subtitle: "Cybersecurity (260h), Python Programming (260h), Generative AI, and PAU +25 (8.80 GPA)",
      dragHint: "Drag horizontally to orbit smoothly in 3D",
    },
    playground: {
      tagline: "Interactive AI & Automation Playground",
      title: "Live Technical Demonstrator",
      subtitle:
        "Explore interactive tools where AI office automation, n8n/Playwright pipelines, and the Contextual AI Assistant converge.",
    },
    timeline: {
      tagline: "Professional & Academic Evolution",
      title: "From Critical Operational Leadership to AI Automation",
      subtitle:
        "A coherent progression: mastering plant logistics and operations before automating them with modern software, AI agents, and security.",
    },
    footer: {
      subtitle: "Full Stack Architecture & Kinetic Interfaces",
    },
  },
};
