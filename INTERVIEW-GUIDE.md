# Guía Local de Defensa Técnica y Entrevistas Ejecutivas
**Candidato:** Abraham Martín Heras  
**Especialidad:** Full Stack AI · Automatización de Procesos Operativos · Vibe Coding  
**Proyecto:** Portfolio & Demostrador Técnico Interactivo (Next.js 16 + React 19 + IA)

---

## 🎯 1. Elevator Pitch Estratégico (30 - 60 Segundos)

> *"Soy Abraham Martín Heras. Mi perfil se define por una intersección poco común: combino **más de una década de experiencia real liderando y supervisando operaciones críticas y logística** (cumplimiento estricto de turnos, SLAs ferroviarios en Serveo, inventarios y resolución de incidencias en Cremonini y Wagons-Lits) con **ingeniería de software moderna e Inteligencia Artificial** (Next.js 16, TypeScript estricto, Python, agentes LLM y automatización con n8n y Playwright).*
>
> *No diseño software desde una torre de marfil; he vivido en primera persona la frustración de las hojas de cálculo caóticas, los cierres de turno manuales y los cuellos de botella de oficina. Por eso construyo herramientas internas, bots y sistemas autónomos que resuelven problemas reales de negocio con un ROI medible desde la primera semana."*

---

## 🏛️ 2. Decisiones de Arquitectura Técnica y Trade-Offs

### A. ¿Por qué CSS 3D GPU Transforms en lugar de Three.js / WebGL en el Carrusel de Certificaciones?
- **Trade-Off Evaluado:** Three.js o React Three Fiber añaden entre **400 KB y 800 KB (gzipped)** al bundle inicial de JavaScript, introducen un contexto Canvas WebGL que consume ciclos de GPU continuos en dispositivos móviles (calentando la batería) y degradan la accesibilidad del DOM (el texto de las certificaciones no sería indexable por lectores de pantalla ni seleccionable).
- **Decisión Aplicada:** Arquitectura **CSS 3D nativa** con `perspective: 1200px` y `transform-style: preserve-3d` acoplada a `useMotionValue` y `useSpring` de Framer Motion.
- **Rendimiento:** Las transformaciones 3D corren en el **compositor de la GPU** (hilo separado del hilo principal de JavaScript), logrando 60 FPS fijos incluso durante arrastre táctil en móviles de gama baja con **0 bytes de sobrecoste en librerías 3D**.
- **Fórmula de Radio Cilíndrico Sin Colisiones:**
  $$\text{radius} = \max\left(380, \frac{\text{cardWidth} \times N}{2\pi}\right)$$
  Con $N = 26$ tarjetas de $280\text{px}$, el radio se sitúa en $1159\text{px}$, dejando un espaciado exacto y constante entre tarjetas.
- **Depth Culling (Ángulo Relativo $> 75^\circ$):** Las tarjetas que orbitan hacia la cara oculta del cilindro se apagan inmediatamente con `opacity-0 pointer-events-none invisible`, ahorrando capas de composición gráfica y evitando cualquier choque visual con la tarjeta frontal.

---

### B. Eliminación Radical del "First-Scroll Jank" (Tirón en el Primer Scroll)
- **Diagnóstico del Problema:** Animar `filter: blur(...)` o sombras difusas complejas durante eventos `whileInView` o `scroll` obliga al motor de renderizado del navegador (Blink/Gecko) a rasterizar la capa en cada frame en la CPU antes de subirla a la GPU, provocando caídas de frames perceptibles en la primera interacción.
- **Solución Implementada:**
  1. Se eliminaron todas las animaciones de `filter` durante el scroll hacia abajo.
  2. Las transiciones de entrada utilizan exclusivamente propiedades **aceleradas por compositor**: `opacity` y transformaciones vectoriales `translate3d` (`y`).
  3. Contención de renderizado mediante la clase CSS `transform-gpu` y `will-change: transform`.

---

### C. Confinamiento Estricto de Scroll (Zero Page Jumps)
- **Problema Detectado en Sprints Previos:** Al recibir mensajes en el chat de IA o ejecutar el simulador de pipelines, las llamadas a `element.scrollIntoView()` o `.focus()` automático desplazaban involuntariamente la ventana entera del navegador (`window.scrollY`), arruinando la experiencia del usuario.
- **Solución Implementada:**
  - Prohibición absoluta de `scrollIntoView()` y `window.scrollTo()`.
  - Los contenedores dinámicos disponen de altura fija (`h-[360px]` con `overflow-y-auto`) y el auto-scroll se aplica **únicamente de forma interna**:
    ```ts
    containerRef.current.scrollTop = containerRef.current.scrollHeight;
    ```

---

### D. Pipeline Incremental SHA-256 en `cv-inbox/` (Consumo Responsable de Tokens)
- **Problema:** Enviar continuamente todos los diplomas y documentos PDF a un LLM multimodal en cada ejecución genera un coste acumulativo en tokens y latencia de red innecesaria.
- **Solución:**
  1. Cada archivo depositado en `cv-inbox/` se analiza mediante un hash criptográfico **SHA-256**.
  2. Se contrastan los hashes contra `cv-inbox/.checkpoint.json`.
  3. Si un archivo ya fue procesado, se omite con **0 tokens consumidos y 0 ms de latencia**.
  4. Los archivos nuevos pasan por Gemini 2.5 Flash con un prompt de **Filtrado Estricto de PII** (omisión de DNI, teléfono personal, domicilio) y actualizan tanto `src/data/cv-data.ts` como el archivo de respaldo `public/CV-Abraham-ATS.md`.

---

### E. Resiliencia del Asistente Contextual (Zero-Error Fallback Engine)
- **Riesgo:** Si la API key de Gemini no está configurada, se agota la cuota gratuita (HTTP 429) o hay un micro-corte de red, una aplicación convencional devolvería un error 500 o una pantalla rota.
- **Arquitectura de Resiliencia:**
  - `src/app/api/chat/route.ts` incorpora un **motor de inferencia local determinista** enriquecido con todo el perfil real de Abraham.
  - Clasifica semánticamente la intención (tareas de oficina, experiencia en Serveo, certificaciones, ciberseguridad) y devuelve respuestas ejecutivas estructuradas en el idioma activo (**ES o EN**) con **tasa de error 0% garantizada**.
  - Si Gemini está activo, se ajusta `thinkingConfig: { thinkingBudget: 0 }` para evitar que el razonamiento interno agote los tokens de salida, garantizando respuestas completas sin truncar.

---

## 👥 3. Diseño Dual-Audience: Reclutador de RRHH vs. CTO / Tech Lead

| Requisito del Perfil | Para Reclutadores de RRHH (Talent Acquisition) | Para CTOs, Leads de IA & Arquitectos |
|---|---|---|
| **Velocidad de Lectura** | Botón de **"Cuadrícula"** en certificaciones para escanear los 26 títulos en 5 segundos sin interactuar con el 3D. | **Carrusel Cilíndrico 3D GPU** interactivo que demuestra dominio de transformaciones espaciales y Framer Motion. |
| **Descarga Tradicional** | Botón visible **"Descargar CV PDF"** que abre `/cv-print` en formato A4 limpio y sobrio de 1 página. | Formato **ATS-Friendly** con botón "Copiar Texto ATS" para auditoría de keywords y arquitectura serverless. |
| **Validación de Competencias** | Píldoras de horas oficiales (**260h Ciberseguridad, 260h Python**) y nota de acceso universitario (**8,80**). | Código fuente modular en Next.js 16, tipado estricto en TypeScript y pipeline incremental SHA-256 en Node.js. |
| **Pruebas en Vivo** | Miniaplicación **Smart Data Cleaner** para ver cómo arregla tablas sucias de Excel en 1 segundo. | **Simulador de Pipelines** para verificar cómo orquestaría Webhooks de n8n, scraping con Playwright y workers de Python. |

---

## 💡 4. Respuestas a Preguntas Difíciles de Entrevista

### P1: *"Tu trayectoria previa ha estado muy vinculada a operaciones y logística (Serveo, Cremonini, Wagons-Lits). ¿Por qué deberíamos contratarte como desarrollador Full Stack o Ingeniero de IA en lugar de a un graduado en informática tradicional?"*
> **Respuesta:**
> *"Un graduado recién salido de la universidad conoce la sintaxis, pero rara vez ha vivido lo que ocurre cuando un sistema falla en el mundo real. Yo he pasado más de 10 años gestionando operativas críticas bajo presión de tiempo real, donde un retraso en la cadena de suministro o un fallo en el registro de un turno genera penalizaciones económicas directas.*
> 
> *Esa experiencia me otorga dos ventajas competitivas inmediatas:*
> *1. **Criterio de negocio:** Entiendo de inmediato los requerimientos de los usuarios operativos y administrativos; sé dónde se pierde tiempo y cómo diseñar herramientas que la plantilla adopte sin fricción.*
> *2. **Seguridad y rigor:** Mi certificación de 260h en Ciberseguridad de Google me inculcó una mentalidad de 'Security-by-Design'; jamás construyo flujos que expongan credenciales o dejen datos sin sanitizar.*
> 
> *Aporto la madurez de un líder operativo con la agilidad técnica de un desarrollador moderno."*

---

### P2: *"Hoy en día todo el mundo habla de 'Vibe Coding'. ¿Cómo demuestras que tu trabajo con IA tiene rigor arquitectónico y no es solo 'copiar y pegar' código que no entiendes?"*
> **Respuesta:**
> *"El 'Vibe Coding' sin criterio técnico produce deuda técnica instantánea. En mi flujo de trabajo, la IA es un acelerador de mecanografía y prototipado, pero **la arquitectura, el modelo de datos y la auditoría de seguridad son 100% míos**.*
> 
> *Por ejemplo, en este portfolio:*
> *- Definí contratos de datos estrictos en TypeScript (`CVData`, `BentoCategory`, `LanguageSkill`) que actúan como fuente de verdad inmutable.*
> *- La matemática 3D del carrusel cilíndrico ($R = \frac{\text{cardWidth} \cdot N}{2\pi}$) y el culling a 75° responden a principios físicos y trigonométricos calculados para evitar colisiones.*
> *- El pipeline de `cv-inbox` utiliza SHA-256 para evitar consumo redundante de tokens y sanitiza PII antes de enviar datos a APIs externas.*
> 
> *Utilizo la IA para multiplicar mi velocidad por 10, pero cada línea de código pasa por mi filtro de tipado estricto, análisis de complejidad temporal y auditoría de seguridad."*

---

### P3: *"Si tuviéramos que automatizar mañana mismo un proceso caótico en nuestra oficina (por ejemplo, cruzar albaranes de proveedores en PDF con nuestro ERP), ¿cuál sería tu enfoque paso a paso?"*
> **Respuesta:**
> *"Aplicaría un enfoque modular en 4 fases:*
> *1. **Detección y Mapeo:** Identificar el formato de entrada (PDFs escaneados vs vectoriales, correos entrantes, carpetas compartidas) y las reglas de validación necesarias (código de albarán, fecha, NIF del proveedor e importe con desglose de IVA).*
> *2. **Ingesta y Extracción:** Montar un trigger en **n8n** (o script ligero en **Python con Playwright** si hay que descargarlo de un portal de proveedor sin API) para extraer el archivo desatendidamente.*
> *3. **Normalización Determinista + LLM:** Pasar el documento por una función de extracción estructurada con esquema JSON estricto (`JSON Schema`). Si el PDF es ilegible o tiene anomalías, la IA normaliza los campos y los contrasta contra una base de datos de proveedores.*
> *4. **Conciliación y Notificación:** Si los datos cuadran al 100%, se inyectan en el ERP vía webhook/API. Si hay una discrepancia (ej. el importe no coincide con la orden de compra), el sistema deriva la incidencia a un canal de Slack/Teams con un diff visual para aprobación humana en 1 clic.*
> 
> *Resultado: se elimina el 90% del tiempo de picado manual y solo se atienden excepciones reales."*

---

### P4: *"¿Por qué decidiste dar soporte bilingüe (ES/EN) y crear una vista imprimible `/cv-print` en lugar de simplemente subir un PDF estático a Google Drive?"*
> **Respuesta:**
> *"Un PDF estático en Google Drive o Dropbox queda desactualizado en cuanto obtienes una nueva certificación o cambias un caso de uso, y obliga al reclutador a abandonar tu web.*
> 
> *Al construir `/cv-print`:*
> *1. **Single Source of Truth:** La vista se alimenta en tiempo real de `src/data/cv-data.ts`. Si el pipeline de `cv-inbox` detecta un nuevo diploma, el CV descargable e imprimible se actualiza solo sin tocar código.*
> *2. **Cumplimiento ATS:** Los portales de empleo (LinkedIn, InfoJobs) procesan con éxito documentos limpios con texto seleccionable, cabeceras estándar y sin gráficos complejos. `/cv-print` incluye además un botón para copiar el texto plano estructurado en 1 clic.*
> *3. **Soporte Internacional:** El selector `ES \| EN` adapta tanto el portfolio como el CV imprimible para procesos nacionales o internacionales al instante."*

---

### P5: *"¿Qué nivel real tienes en inglés y en qué entornos te desenvuelves?"*
> **Respuesta:**
> *"Mi nivel de inglés está especializado en lo que más importa en un equipo técnico:*
> *- **Lectura y comprensión técnica (Nivel Alto / B2+):** Asimilo a diario documentación oficial en inglés, especificaciones RFC, papers de IA y repositorios de código abierto sin ninguna barrera.*
> *- **Comunicación profesional general (Nivel Medio / B1-B2):** Mantengo conversaciones operativas, redacción de correos técnicos y participación en daily meetings o chats de ingeniería.*
> *- Además, cuento con **Castellano Nativo (C2)** y **Valenciano/Catalán fluido (B2-C1)** para cualquier comunicación corporativa o institucional en el ámbito nacional."*
