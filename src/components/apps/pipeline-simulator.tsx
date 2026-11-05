"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  TrendingDown,
  Sparkles,
  Zap,
  Activity,
} from "lucide-react";

export type PipelineId = "pdf-to-erp" | "web-monitoring" | "inbox-triage";

export interface BusinessStep {
  stepNumber: number;
  title: string;
  humanSubtitle: string;
  iconType: "file" | "ai" | "database" | "action" | "globe" | "mail";
  executionMs: number;
  narrativeText: string;
  // Vista Negocio
  inputProblemTitle: string;
  inputProblemBadge: string;
  inputProblemItems: string[];
  outputSuccessTitle: string;
  outputSuccessBadge: string;
  outputSuccessRows: { label: string; value: string; badge: string }[];
  impactRoiPill: string;
  // Vista Técnica (Opcional)
  inputPayload: Record<string, unknown>;
  outputPayload: Record<string, unknown>;
  codeSnippet: string;
  codeLang: "python" | "javascript";
}

export interface BusinessPipeline {
  id: PipelineId;
  title: string;
  subtitle: string;
  badge: string;
  timeBeforeVsAfter: string;
  totalDurationMs: number;
  steps: BusinessStep[];
}

const BUSINESS_PIPELINES: BusinessPipeline[] = [
  {
    id: "pdf-to-erp",
    title: "Facturas y Albaranes PDF a Excel/ERP sin picar datos",
    subtitle: "De 15 minutos revisando PDFs a 3 segundos con 0 errores humanos.",
    badge: "Ofimática Inteligente",
    timeBeforeVsAfter: "15 min manuales → 1.4 segundos automatizados",
    totalDurationMs: 1450,
    steps: [
      {
        stepNumber: 1,
        title: "1. Recepción del PDF",
        humanSubtitle: "El sistema recoge albaranes y facturas adjuntas al instante",
        iconType: "file",
        executionMs: 250,
        narrativeText: "Paso 1/4: Recepción automática del documento PDF desde correo o portal de proveedores...",
        inputProblemTitle: "Documento en Bruto Entrante",
        inputProblemBadge: "Antes: Manual",
        inputProblemItems: [
          "PDF escaneado con formato irregular y tablas desalineadas",
          "Riesgo de pasar por alto páginas adicionales o notas manuscritas",
          "Pérdida de tiempo descargando y renombrando archivos a mano",
        ],
        outputSuccessTitle: "Archivo Digital Capturado",
        outputSuccessBadge: "Ingesta Inmediata",
        outputSuccessRows: [
          { label: "Documento:", value: "albaran_transporte_441.pdf", badge: "Capturado" },
          { label: "Canal:", value: "Recepción Automática Proveedores", badge: "24/7 Activo" },
          { label: "Validación:", value: "Firma digital y checksum verificado", badge: "Seguro" },
        ],
        impactRoiPill: "Ahorro: 100% de la descarga manual · Tiempo: 0.1s",
        inputPayload: {
          event: "supplier_document_received",
          source: "email_attachment",
          fileName: "albaran_transporte_441.pdf",
          sizeKb: 342,
        },
        outputPayload: {
          status: "DIGITIZED",
          documentId: "DOC-2026-9021",
          checksumValid: true,
        },
        codeLang: "javascript",
        codeSnippet: `// Ingesta automática desatendida
export async function onDocumentReceived(event) {
  const file = await downloadAttachment(event.messageId);
  return {
    documentId: generateTrackingId(),
    status: 'READY_FOR_AI_READING',
    buffer: file.data
  };
}`,
      },
      {
        stepNumber: 2,
        title: "2. Lectura Inteligente IA",
        humanSubtitle: "La IA lee artículos, cantidades e importes sin fallar",
        iconType: "ai",
        executionMs: 600,
        narrativeText: "Paso 2/4: La Inteligencia Artificial analiza el PDF y extrae todas las líneas de factura...",
        inputProblemTitle: "Revisión Visual en Pantalla",
        inputProblemBadge: "Antes: 10 min/albarán",
        inputProblemItems: [
          "Copiar y pegar código por código de producto a una hoja de cálculo",
          "Dificultad para detectar faltas de mercancía o recargos ocultos",
          "Fatiga visual y errores de tecleo en números con decimales",
        ],
        outputSuccessTitle: "Extracción 100% Estructurada",
        outputSuccessBadge: "99.8% Precisión",
        outputSuccessRows: [
          { label: "Nº Albarán:", value: "ALB-8921 (TRANS-NORTE S.L.)", badge: "Identificado" },
          { label: "Línea 1:", value: "118 Pallets recibidos (de 120 previstos)", badge: "Discrepancia (-2)" },
          { label: "Línea 2:", value: "50 Cajas de protección M4", badge: "Exacto (50/50)" },
          { label: "Total Facturado:", value: "1.240,50 €", badge: "Validado" },
        ],
        impactRoiPill: "Detección inmediata de faltas de mercancía antes de pagar",
        inputPayload: {
          model: "gemini-2.5-flash",
          task: "extract_line_items_and_discrepancies",
        },
        outputPayload: {
          supplier: "TRANS-NORTE S.L.",
          itemsReceived: 118,
          itemsExpected: 120,
          discrepancyUnits: -2,
          totalEur: 1240.5,
        },
        codeLang: "python",
        codeSnippet: `# Extracción semántica con esquema estructurado
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[pdf_data, "Extrae líneas, importes y calcula descuadres."],
    config={"response_mime_type": "application/json", "response_schema": AlbaranSchema}
)`,
      },
      {
        stepNumber: 3,
        title: "3. Cruce con Pedido",
        humanSubtitle: "Comprueba si coincide con lo pactado en compras",
        iconType: "database",
        executionMs: 350,
        narrativeText: "Paso 3/4: Cotejando precios y albarán contra el pedido de compra del ERP...",
        inputProblemTitle: "Comprobación Manual Lenta",
        inputProblemBadge: "Cuello de botella",
        inputProblemItems: [
          "Abrir el ERP, buscar el pedido original y contrastar cada línea a ojo",
          "Riesgo de aceptar facturas con precios superiores a los acordados",
          "Llamadas y correos innecesarios para consultar el estado del lote",
        ],
        outputSuccessTitle: "Conciliación Automática Confirmada",
        outputSuccessBadge: "Cruce Transaccional",
        outputSuccessRows: [
          { label: "Pedido Original:", value: "PO-2026-7840", badge: "Localizado" },
          { label: "Precio Pactado:", value: "Coincide con tarifa acordada", badge: "Tarifa OK" },
          { label: "Acción Contable:", value: "Stock sumado + Reclamación por las 2 unidades faltantes", badge: "Auto-gestionado" },
        ],
        impactRoiPill: "Cero descuadres entre almacén y contabilidad",
        inputPayload: {
          query: "SELECT * FROM purchase_orders WHERE code = 'PO-2026-7840'",
        },
        outputPayload: {
          inventoryUpdated: true,
          claimGenerated: "REC-2026-091",
          stockDelta: "+118",
        },
        codeLang: "python",
        codeSnippet: `# Conciliación ACID directa en la base de datos
async with db.transaction():
    await update_inventory(sku="PALLET-A1", qty=+118)
    if discrepancy_detected:
        await generate_supplier_claim(albaran_id="ALB-8921", missing_units=2)`,
      },
      {
        stepNumber: 4,
        title: "4. Excel / ERP Actualizado",
        humanSubtitle: "Inventario sumado, alerta enviada y listo para pagar",
        iconType: "action",
        executionMs: 250,
        narrativeText: "Paso 4/4: ¡Proceso completado! Hoja maestra actualizada y alerta enviada al equipo.",
        inputProblemTitle: "Cierre Manual del Turno",
        inputProblemBadge: "Fin de turno tedioso",
        inputProblemItems: [
          "Actualizar hojas de cálculo compartidas que se desconfiguran",
          "Redactar correos avisando a compras de que faltan 2 unidades",
          "Incertidumbre de la dirección sobre el stock real en planta",
        ],
        outputSuccessTitle: "Entregables Finales Listos",
        outputSuccessBadge: "Proceso Cerrado",
        outputSuccessRows: [
          { label: "Hoja de Control:", value: "Línea añadida y clasificada en el ERP", badge: "Actualizado" },
          { label: "Aviso a Compras:", value: "Notificación con borrador de abono listo", badge: "Enviado" },
          { label: "Trazabilidad:", value: "Registro con fecha y hora para auditoría", badge: "Auditado" },
        ],
        impactRoiPill: "Ahorro: 95% de tiempo · Precisión: 99,9%",
        inputPayload: {
          channel: "slack_operations",
          dashboardSync: true,
        },
        outputPayload: {
          notificationDelivered: true,
          erpSynced: true,
          completedInSeconds: 1.45,
        },
        codeLang: "javascript",
        codeSnippet: `// Notificación al canal de operaciones
await notifySlack({
  channel: '#almacen-alertas',
  message: '✔ Albarán ALB-8921 procesado. Reclamadas 2 unidades no entregadas.'
});`,
      },
    ],
  },
  {
    id: "web-monitoring",
    title: "Vigilancia Automática de Precios, Stock y Portales Web",
    subtitle: "Un robot navega, extrae tablas actualizadas y avisa por email si hay cambios.",
    badge: "Web Scraping & Playwright",
    timeBeforeVsAfter: "2 horas de navegación diaria → 1.8 segundos",
    totalDurationMs: 1820,
    steps: [
      {
        stepNumber: 1,
        title: "1. Disparo Programado",
        humanSubtitle: "El robot se activa cada mañana a primera hora",
        iconType: "action",
        executionMs: 200,
        narrativeText: "Paso 1/4: Activando la revisión automática matinal de 15 portales de proveedores...",
        inputProblemTitle: "Trabajo Rutinario de Primera Hora",
        inputProblemBadge: "Antes: Manual",
        inputProblemItems: [
          "Un empleado tiene que entrar web por web cada mañana",
          "Recordar claves, saltar avisos de cookies y buscar enlaces escondidos",
          "Falta de seguimiento en fines de semana o vacaciones",
        ],
        outputSuccessTitle: "Lanzamiento Desatendido",
        outputSuccessBadge: "Puntualidad 100%",
        outputSuccessRows: [
          { label: "Hora de Inicio:", value: "06:00 AM (Sin intervención humana)", badge: "Programado" },
          { label: "Objetivos:", value: "15 portales de tarifas de transporte y suministros", badge: "Listos" },
          { label: "Conexión:", value: "Navegador silencioso de alta velocidad", badge: "Optimizado" },
        ],
        impactRoiPill: "Ahorro: 2 horas de navegación repetitiva cada mañana",
        inputPayload: {
          cron: "0 6 * * 1-5",
          portalsCount: 15,
        },
        outputPayload: {
          sessionStarted: true,
          targetQueue: "FREIGHT_MARKET_MONITOR",
        },
        codeLang: "python",
        codeSnippet: `@cron_scheduler.daily(at="06:00")
def trigger_market_audit():
    targets = load_monitoring_targets()
    return launch_browser_workers(targets)`,
      },
      {
        stepNumber: 2,
        title: "2. Navegación Silenciosa",
        humanSubtitle: "Abre las webs, acepta cookies y extrae las tablas",
        iconType: "globe",
        executionMs: 850,
        narrativeText: "Paso 2/4: El robot (Playwright) abre las webs, navega por los menús y lee las tablas de tarifas...",
        inputProblemTitle: "Páginas Web Lentas y Complejas",
        inputProblemBadge: "Fricción diaria",
        inputProblemItems: [
          "Páginas que tardan en cargar o exigen rellenar filtros una y otra vez",
          "Copiar y pegar columnas de tablas que se pegan desconfiguradas",
          "Riesgo de errores al transcribir precios o códigos de ruta",
        ],
        outputSuccessTitle: "Extracción Automática Exitosa",
        outputSuccessBadge: "84 Tarifas Leídas",
        outputSuccessRows: [
          { label: "Portales Auditados:", value: "15 páginas web de operadores logísticos", badge: "Completado" },
          { label: "Tarifas Extraídas:", value: "84 cotizaciones de rutas actualizadas", badge: "Capturado" },
          { label: "Bypass:", value: "Cookies y avisos gestionados automáticamente", badge: "Fluido" },
        ],
        impactRoiPill: "De copiar 84 números a mano a extracción en 800 milisegundos",
        inputPayload: {
          browser: "Chromium Headless (Playwright)",
          headless: true,
        },
        outputPayload: {
          ratesExtracted: 84,
          errors: 0,
          timeMs: 840,
        },
        codeLang: "python",
        codeSnippet: `async with async_playwright() as p:
    browser = await p.chromium.launch(headless=True)
    page = await browser.new_page()
    await page.goto(portal_url)
    rates = await page.locator("tr.pricing-row").all_text_contents()`,
      },
      {
        stepNumber: 3,
        title: "3. Detección de Cambios",
        humanSubtitle: "Compara con ayer y encuentra oportunidades de ahorro",
        iconType: "database",
        executionMs: 450,
        narrativeText: "Paso 3/4: Comparando precios de hoy contra el histórico para detectar ofertas o subidas...",
        inputProblemTitle: "Comparativa Manual Imposible",
        inputProblemBadge: "Falta de visión",
        inputProblemItems: [
          "Imposible acordarse de memoria de los precios de la semana pasada",
          "No detectar a tiempo cuando un competidor o proveedor baja precios",
          "Decisiones de compra tomadas a ciegas sin datos históricos",
        ],
        outputSuccessTitle: "Oportunidad Comercial Detectada",
        outputSuccessBadge: "Alerta de Negocio",
        outputSuccessRows: [
          { label: "Ruta Madrid-Lyon:", value: "Precio actual: 710 € (Antes: 820 €)", badge: "Bajada -13,4%" },
          { label: "Impacto Estimado:", value: "Ahorro de ~2.200 € en los envíos de esta semana", badge: "Oportunidad" },
          { label: "Calidad de Datos:", value: "84 registros formateados y sin valores nulos", badge: "Validado" },
        ],
        impactRoiPill: "Capacidad de renegociar contratos con datos en tiempo real",
        inputPayload: {
          dataset: "daily_freight_rates",
          analysis: "detect_price_drops",
        },
        outputPayload: {
          priceDropFound: true,
          route: "MADRID-LYON",
          discountPct: -13.4,
        },
        codeLang: "python",
        codeSnippet: `df['delta'] = df['current_price'] - df['historical_avg']
opportunities = df[df['delta'] < -0.10]
logger.info(f"Oportunidad de ahorro detectada: {len(opportunities)} rutas")`,
      },
      {
        stepNumber: 4,
        title: "4. Informe por Email",
        humanSubtitle: "Envía el resumen listo para dirección antes de las 08:00",
        iconType: "ai",
        executionMs: 320,
        narrativeText: "Paso 4/4: ¡Listo! El informe comparativo ha sido enviado al buzón de dirección de compras.",
        inputProblemTitle: "Elaborar Informes Tarda Horas",
        inputProblemBadge: "Pérdida de tiempo",
        inputProblemItems: [
          "Armar gráficos y tablas en Excel para enseñárselos al jefe",
          "El informe llega a media tarde cuando la oportunidad ya pasó",
          "Falta de estandarización entre los miembros del equipo",
        ],
        outputSuccessTitle: "Resumen Ejecutivo en Bandeja",
        outputSuccessBadge: "Entregado a Tiempo",
        outputSuccessRows: [
          { label: "Destinatarios:", value: "Dirección de Operaciones & Compras", badge: "Recibido" },
          { label: "Formato:", value: "Tabla comparativa limpia + Gráfico de tendencia", badge: "PDF & Email" },
          { label: "Estado:", value: "Base de datos actualizada para el resto del año", badge: "Almacenado" },
        ],
        impactRoiPill: "Ahorro: 98% de tiempo · Decisión inmediata con datos reales",
        inputPayload: {
          recipient: "direccion_operaciones@empresa.com",
          reportType: "EXECUTIVE_DAILY_PRICING",
        },
        outputPayload: {
          emailSent: true,
          rowsArchived: 84,
        },
        codeLang: "javascript",
        codeSnippet: `await sendExecutiveReport({
  to: 'direccion_operaciones@empresa.com',
  subject: '📊 Resumen Matinal: Detección de rebajas en tarifas de transporte'
});`,
      },
    ],
  },
  {
    id: "inbox-triage",
    title: "Clasificación y Respuesta Inteligente de Incidencias",
    subtitle: "Lee bandejas de entrada saturadas, prioriza urgencias y redacta borradores.",
    badge: "Agente IA de Triaje",
    timeBeforeVsAfter: "30 min de espera en colas → Respuesta en 45 segundos",
    totalDurationMs: 1320,
    steps: [
      {
        stepNumber: 1,
        title: "1. Ingesta del Correo",
        humanSubtitle: "El correo llega con un parte de avería urgente",
        iconType: "mail",
        executionMs: 200,
        narrativeText: "Paso 1/4: Recepción de un correo de conductor con un parte de avería en carretera...",
        inputProblemTitle: "Buzón de Soporte Inundado",
        inputProblemBadge: "Buzón colapsado",
        inputProblemItems: [
          "Cientos de correos de turnos anteriores sin abrir",
          "Una avería urgente se queda sepultada entre facturas o publicidad",
          "El cliente o conductor espera horas a que alguien lea su mensaje",
        ],
        outputSuccessTitle: "Mensaje Identificado en 1 Segundo",
        outputSuccessBadge: "Cero Esperas",
        outputSuccessRows: [
          { label: "Asunto:", value: "URGENTE: Avería semirremolque en autovía A-4", badge: "Captado" },
          { label: "Remitente:", value: "chofer.turno3@flota-central.es", badge: "Conductor en ruta" },
          { label: "Recepción:", value: "Analizado en milisegundos tras entrar al buzón", badge: "Instantáneo" },
        ],
        impactRoiPill: "Cero correos críticos perdidos en la bandeja",
        inputPayload: {
          channel: "EMAIL_OPERACIONES",
          subject: "URGENTE: Avería semirremolque R-88 en autovía A-4",
        },
        outputPayload: {
          ticketId: "TCK-55410",
          status: "TRIAGING",
        },
        codeLang: "python",
        codeSnippet: `@email_listener.on_message()
async def process_incoming_email(msg):
    ticket = await create_ticket(subject=msg.subject, body=msg.body)
    return await triage_agent.evaluate(ticket)`,
      },
      {
        stepNumber: 2,
        title: "2. Triaje de Criticidad",
        humanSubtitle: "La IA detecta que es crítico (camión parado) y extrae datos",
        iconType: "ai",
        executionMs: 500,
        narrativeText: "Paso 2/4: La IA analiza el texto: detecta peligro en autovía y fija SLA prioritario de 30 minutos...",
        inputProblemTitle: "Falta de Criterio Homogéneo",
        inputProblemBadge: "Riesgo de retraso",
        inputProblemItems: [
          "Un operario novel podría clasificarlo como incidencia normal",
          "Retraso en la cadena de frío o incumplimiento de penalizaciones con el cliente",
          "Tener que llamar al conductor para pedir datos que ya escribió en el correo",
        ],
        outputSuccessTitle: "Diagnóstico Inteligente",
        outputSuccessBadge: "SLA Crítico (30 min)",
        outputSuccessRows: [
          { label: "Categoría:", value: "Avería Mecánica en Ruta (Camión inmovilizado)", badge: "Prioridad 1" },
          { label: "Vehículo / Matrícula:", value: "4489-LXZ (Semirremolque R-88)", badge: "Extraído" },
          { label: "Ubicación:", value: "Autovía A-4, Kilómetro 142 (Dirección Córdoba)", badge: "Geolocalizado" },
        ],
        impactRoiPill: "Identificación de urgencias críticas en 0.5 segundos",
        inputPayload: {
          model: "gemini-2.5-flash",
          rule: "if highway_immobilized then priority = CRITICAL",
        },
        outputPayload: {
          severity: "CRITICAL",
          slaMinutes: 30,
          plate: "4489-LXZ",
          location: "A-4 km 142",
        },
        codeLang: "python",
        codeSnippet: `# Regla de seguridad con IA:
result = await ai_classifier.analyze(email_text)
if "autovía" in result.location and result.is_immobilized:
    result.severity = "CRITICAL"
    result.sla_minutes = 30`,
      },
      {
        stepNumber: 3,
        title: "3. Asignación de Recursos",
        humanSubtitle: "Localiza el taller móvil más cercano y le pasa el aviso",
        iconType: "database",
        executionMs: 350,
        narrativeText: "Paso 3/4: Buscando el taller de guardia más cercano al kilómetro 142 y despachando asistencia...",
        inputProblemTitle: "Búsqueda Manual de Teléfonos",
        inputProblemBadge: "15 min al teléfono",
        inputProblemItems: [
          "Buscar en agendas de papel o Excels viejos qué taller cubre ese tramo",
          "Llamar a varios talleres que comunican o están cerrados",
          "Camión parado en el arcén aumentando el riesgo de accidente",
        ],
        outputSuccessTitle: "Asistencia Móvil Asignada",
        outputSuccessBadge: "En Camino (ETA 22m)",
        outputSuccessRows: [
          { label: "Taller Asignado:", value: "Taller Móvil Manzanares (A 18 km)", badge: "Asignado" },
          { label: "Tiempo Estimado de Llegada:", value: "22 minutos garantizados", badge: "Cumple SLA" },
          { label: "Aprobación de Coste:", value: "Pre-autorizado según baremo oficial", badge: "Sin papeleo" },
        ],
        impactRoiPill: "Despacho de asistencia en carretera 10 veces más rápido",
        inputPayload: {
          coords: [39.0124, -3.3712],
          searchRadiusKm: 50,
        },
        outputPayload: {
          assignedUnit: "TALLER-MOVIL-MANZANARES-02",
          etaMinutes: 22,
          distanceKm: 18.2,
        },
        codeLang: "python",
        codeSnippet: `closest_workshop = find_closest_mechanic(
    location=incident_coords,
    max_radius_km=50,
    available_now=True
)
await dispatch_assistance(closest_workshop.id, ticket_id)`,
      },
      {
        stepNumber: 4,
        title: "4. Respuesta y Seguimiento",
        humanSubtitle: "El conductor y el cliente reciben un SMS con seguimiento en vivo",
        iconType: "action",
        executionMs: 270,
        narrativeText: "Paso 4/4: ¡Resuelto! SMS de tranquilidad enviado al conductor y cliente informado en tiempo real.",
        inputProblemTitle: "Llamadas de Nerviosismo del Cliente",
        inputProblemBadge: "Incertidumbre",
        inputProblemItems: [
          "El cliente llama enfadado preguntando por qué no llega su pedido",
          "El conductor desinformado sobre si alguien va a ayudarle",
          "Falta de registro para el seguro o la empresa de transporte",
        ],
        outputSuccessTitle: "Tranquilidad y Comunicación Total",
        outputSuccessBadge: "Incidencia Controlada",
        outputSuccessRows: [
          { label: "SMS Conductor:", value: "\"Técnico en camino. ETA: 22 min. Tel: 600-11-22\"", badge: "SMS Enviado" },
          { label: "Aviso al Cliente:", value: "\"Nueva hora estimada de entrega: 14:15 h\"", badge: "Cliente Informado" },
          { label: "Resultado:", value: "Resolución sin penalización por retraso", badge: "SLA Salvado" },
        ],
        impactRoiPill: "Resolución de avería en 45 segundos · Cliente fidelizado",
        inputPayload: {
          driverPhone: "+34600112233",
          clientNotification: true,
        },
        outputPayload: {
          smsSent: true,
          liveTrackingUrl: "https://ops.empresa.com/live/TCK-55410",
        },
        codeLang: "javascript",
        codeSnippet: `await sendSms({
  to: driverPhone,
  body: 'Asistencia en camino: Taller Manzanares llega en 22 min.'
});
await notifyCustomer({ etaDelayMinutes: 45 });`,
      },
    ],
  },
];

export function PipelineSimulator() {
  const [selectedPipelineId, setSelectedPipelineId] = useState<PipelineId>("pdf-to-erp");
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"business" | "tech">("business");
  const [simulationStatus, setSimulationStatus] = useState<"idle" | "running" | "completed">("idle");
  const [currentStepProcessing, setCurrentStepProcessing] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [narrativeLog, setNarrativeLog] = useState<string>(
    "Selecciona un flujo y pulsa «Ejecutar Simulación en Vivo» para ver cómo la automatización ahorra horas de trabajo."
  );
  const [isCopied, setIsCopied] = useState(false);

  const pipeline = BUSINESS_PIPELINES.find((p) => p.id === selectedPipelineId) ?? BUSINESS_PIPELINES[0];
  const currentStep = pipeline.steps[activeStepIndex] ?? pipeline.steps[0];

  const handleSelectPipeline = (id: PipelineId) => {
    setSelectedPipelineId(id);
    setActiveStepIndex(0);
    setSimulationStatus("idle");
    setCurrentStepProcessing(null);
    setCompletedSteps(new Set());
    setNarrativeLog(
      "Flujo seleccionado. Pulsa «Ejecutar Simulación en Vivo» para visualizar el recorrido y los entregables de negocio."
    );
  };

  const handleRunSimulation = () => {
    if (simulationStatus === "running") return;

    setSimulationStatus("running");
    setCompletedSteps(new Set());
    setCurrentStepProcessing(0);
    setActiveStepIndex(0);

    let stepIndex = 0;

    const executeNextStep = () => {
      if (stepIndex >= pipeline.steps.length) {
        setSimulationStatus("completed");
        setCurrentStepProcessing(null);
        setNarrativeLog(
          `✔ ¡Proceso completado con éxito! Se ha eliminado el trabajo manual en ${pipeline.timeBeforeVsAfter}.`
        );
        return;
      }

      const step = pipeline.steps[stepIndex];
      setCurrentStepProcessing(stepIndex);
      setActiveStepIndex(stepIndex);
      setNarrativeLog(step.narrativeText);

      setTimeout(() => {
        setCompletedSteps((prev) => new Set(prev).add(stepIndex));
        stepIndex++;
        setTimeout(executeNextStep, 240);
      }, step.executionMs);
    };

    setTimeout(executeNextStep, 150);
  };

  const handleReset = () => {
    setSimulationStatus("idle");
    setCurrentStepProcessing(null);
    setCompletedSteps(new Set());
    setActiveStepIndex(0);
    setNarrativeLog("Simulación reiniciada. Listo para una nueva demostración.");
  };

  const handleCopyTechData = () => {
    const data = {
      step: currentStep.stepNumber,
      title: currentStep.title,
      input: currentStep.inputPayload,
      output: currentStep.outputPayload,
      code: currentStep.codeSnippet,
    };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2)).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6">
      {/* 1. Selector Superior de Casos de Uso con Lenguaje Claro de Negocio */}
      <div className="space-y-2 border-b border-slate-200/80 dark:border-white/10 pb-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Casos Reales de Automatización Operativa:
          </span>
          <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
            {pipeline.timeBeforeVsAfter}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {BUSINESS_PIPELINES.map((p) => {
            const isSelected = p.id === selectedPipelineId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelectPipeline(p.id)}
                className={`group rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-violet-400/80 dark:border-cyan-400/80 bg-white dark:bg-slate-900 shadow-sm"
                    : "border-slate-200/80 dark:border-white/5 bg-white/60 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider ${
                      isSelected
                        ? "bg-violet-100 dark:bg-cyan-950 text-violet-800 dark:text-cyan-300 border border-violet-200 dark:border-cyan-500/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {p.badge}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {p.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {p.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Barra de Acción & Narrativa en Vivo (En lugar de terminal negra que provoca scroll) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/80 dark:bg-slate-900/80 p-3.5 rounded-xl border border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-500/20">
            {simulationStatus === "running" ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Sparkles className="h-4 w-4" />
              </motion.div>
            ) : simulationStatus === "completed" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Activity className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Estado de la Automatización:
            </div>
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
              {narrativeLog}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            disabled={simulationStatus === "running"}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reiniciar</span>
          </button>

          <button
            type="button"
            onClick={handleRunSimulation}
            disabled={simulationStatus === "running"}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 dark:from-cyan-500 dark:via-teal-500 dark:to-emerald-500 px-4 py-1.5 text-xs font-semibold text-white dark:text-slate-950 shadow-md hover:brightness-110 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
          >
            {simulationStatus === "running" ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                >
                  <Activity className="h-4 w-4" />
                </motion.div>
                <span>Ejecutando en vivo...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>Ejecutar Simulación en Vivo</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Diagrama de 4 Pasos Explicativo (En lenguaje humano para reclutadores) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {pipeline.steps.map((step, idx) => {
          const isProcessing = currentStepProcessing === idx;
          const isCompleted = completedSteps.has(idx);
          const isSelected = activeStepIndex === idx;

          return (
            <div
              key={step.stepNumber}
              onClick={() => setActiveStepIndex(idx)}
              className={`rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                isSelected
                  ? "border-violet-500 dark:border-cyan-400 bg-white dark:bg-slate-900 shadow-sm ring-1 ring-violet-500/20 dark:ring-cyan-400/20"
                  : "border-slate-200/80 dark:border-white/5 bg-white/60 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-lg border text-xs font-mono font-bold ${
                      isCompleted
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : isProcessing
                        ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 animate-pulse"
                        : "border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      step.stepNumber
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {step.executionMs} ms
                  </span>
                </div>

                <span
                  className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold ${
                    isCompleted
                      ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                      : isProcessing
                      ? "bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {isCompleted
                    ? "✔ Listo"
                    : isProcessing
                    ? "En curso"
                    : "En espera"}
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {step.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                {step.humanSubtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* 4. Panel de Detalle: Vista Reclutador (Por defecto) vs. Vista CTO (Interruptor) */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-slate-900/80 p-5 space-y-4 shadow-sm min-h-[340px]">
        {/* Cabecera del Panel con Interruptor Reclutador vs CTO */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 dark:bg-cyan-500/10 text-violet-700 dark:text-cyan-400 font-bold font-mono text-xs border border-violet-500/20 dark:border-cyan-500/20">
              0{currentStep.stepNumber}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {currentStep.title} — {currentStep.humanSubtitle}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paso seleccionado para inspección en tiempo real
              </p>
            </div>
          </div>

          {/* Interruptor Discreto: Vista Reclutador (Negocio) vs Vista CTO */}
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-white/10">
              <button
                type="button"
                onClick={() => setViewMode("business")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "business"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Vista Reclutador (Negocio)
              </button>
              <button
                type="button"
                onClick={() => setViewMode("tech")}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "tech"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Vista CTO (Código & JSON)
              </button>
            </div>

            {viewMode === "tech" && (
              <button
                type="button"
                onClick={handleCopyTechData}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 text-slate-400" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Vista 1 (POR DEFECTO): Vista de Impacto Operativo para Reclutadores */}
        {viewMode === "business" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Tarjeta Izquierda: Entrada / Problema Manual */}
            <div className="lg:col-span-6 rounded-xl border border-rose-200/80 dark:border-rose-500/20 bg-rose-50/30 dark:bg-rose-950/20 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>Entrada / Problema Manual Habitual</span>
                </span>
                <span className="rounded-full bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 text-[10px] font-mono font-semibold text-rose-800 dark:text-rose-300">
                  {currentStep.inputProblemBadge}
                </span>
              </div>

              <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                {currentStep.inputProblemTitle}
              </h5>

              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {currentStep.inputProblemItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-500 shrink-0 font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tarjeta Derecha: Salida Lista para Negocio & Entregables */}
            <div className="lg:col-span-6 rounded-xl border border-emerald-200/80 dark:border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20 p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Salida Automatizada Lista para Negocio</span>
                  </span>
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-800 dark:text-emerald-300">
                    {currentStep.outputSuccessBadge}
                  </span>
                </div>

                <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                  {currentStep.outputSuccessTitle}
                </h5>

                {/* Mini-tabla limpia de entregables */}
                <div className="space-y-2 text-xs">
                  {currentStep.outputSuccessRows.map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2 rounded-lg bg-white/80 dark:bg-slate-900/80 p-2 border border-slate-100 dark:border-white/5"
                    >
                      <div className="min-w-0">
                        <span className="text-[11px] font-mono text-slate-400 block">
                          {row.label}
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-100 truncate block">
                          {row.value}
                        </span>
                      </div>
                      <span className="rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shrink-0">
                        {row.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Píldora Grande de Impacto y ROI */}
              <div className="pt-2 border-t border-emerald-200/50 dark:border-emerald-500/20">
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-white/70 dark:bg-slate-900/60 px-3 py-2 rounded-lg border border-emerald-200/60 dark:border-emerald-500/20">
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Impacto Operativo Medido:</span>
                  </span>
                  <span className="font-mono text-xs">{currentStep.impactRoiPill}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Vista 2 (OPCIONAL): Vista CTO con Payload JSON y Código Fuente */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-6 space-y-2">
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Payload JSON de Entrada & Salida</span>
                <span>Contrato de Datos</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-200 h-64 overflow-y-auto">
                <div className="text-[11px] text-cyan-400 font-semibold mb-1">
                  {"// ENTRADA"}
                </div>
                <pre className="text-slate-300 mb-3">
                  {JSON.stringify(currentStep.inputPayload, null, 2)}
                </pre>
                <div className="text-[11px] text-emerald-400 font-semibold mb-1">
                  {"// SALIDA (RESOLVED)"}
                </div>
                <pre className="text-emerald-300">
                  {JSON.stringify(currentStep.outputPayload, null, 2)}
                </pre>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-2">
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Código Fuente en Producción ({currentStep.codeLang.toUpperCase()})</span>
                <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px]">
                  Worker
                </span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 h-64 overflow-y-auto">
                <pre className="leading-relaxed whitespace-pre-wrap">
                  {currentStep.codeSnippet}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
