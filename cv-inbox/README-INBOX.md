# 📥 CV-Inbox — Sistema de Ingesta Inteligente y Curación Curricular

Esta carpeta funciona como la **bandeja de entrada inteligente** para mantener actualizado [`src/data/cv-data.ts`](../src/data/cv-data.ts) a partir de diplomas, certificaciones oficiales y credenciales técnicas, aplicando **reglas estrictas de relevancia para perfiles Full Stack, Ofimática Avanzada, Automatización e Inteligencia Artificial**.

---

## 🎯 Reglas de Filtrado y Curación Curricular

Para proyectar máxima solvencia ante reclutadores técnicos, directores de tecnología y responsables de operaciones, el pipeline aplica filtros deterministas:

### 🚫 Reglas de Exclusión Estricta (Blacklist Automática)
Se descartan automáticamente aquellos cursos que no aportan valor a una posición de software, IA u ofimática técnica:
- **Maquinaria de planta / almacén físico:** Manejo de carretillas (FSEBON/FSEEXT), tractores, maquinaria pesada.
- **Conducción de vehículos:** Conducción eficiente de vehículos eléctricos, semirremolques, transporte terrestre.
- **Prevención de riesgos básicos y emergencias de nave:** Primeros auxilios básicos de almacén, planes de evacuación de incendios, PRL básico de operario.
- **Seguridad en planta:** Calidad y medioambiente de planta, seguridad alimentaria/APPCC.
- **Compliance corporativo genérico:** Conductas prohibidas, código de ética básico.
- **Documentos de soporte:** Cartas de presentación, copias de vidas laborales o currículums antiguos (se reservan para contexto de experiencia, no como títulos).

### ⭐ Reglas de Inclusión Prioritaria (Target Tech)
Se homologan e integran con código de credencial y habilidades tipadas:
1. **Full Stack & Desarrollo Web:** freeCodeCamp Responsive Web Design Developer Certification, React, TypeScript, HTML5, CSS3.
2. **Inteligencia Artificial & LLMs:** Google AI Professional Certificate, AI for Data Analysis, AI for Content Creation, AI for Writing and Communicating, Perplexity AI, Agentes de IA (Negocios y Procesos), Prompt Engineering, ChatGPT, Gemini.
3. **Python, Datos & Automatización:** Curso Profesional de Programación en Python (260h), ETL con Pandas, n8n, Playwright, SGA/ERP Codisys Logística.
4. **Ciberseguridad & Privacidad de Datos:** Google Cybersecurity Certificate (260h), Protección de Datos & RGPD.
5. **Estrategia, Liderazgo & Educación Superior:** Toma de Decisiones y Resolución de Problemas (Grupo Hedima, 10h), Liderazgo y Motivación de Equipos, PAU +25 (Universitat de València, nota 8,80 sobresaliente).

---

## 🚀 Ejecución y Comandos

- **Sincronización incremental:**
  ```bash
  npm run sync-cv
  ```
- **Sincronización completa desde cero (reset):**
  ```bash
  node cv-inbox/sync-cv.mjs --reset
  ```
- **Vía script Bash con verificación TypeScript:**
  ```bash
  ./cv-inbox/actualizar-cv.sh
  ```

---

## 🔒 Privacidad y Git (`.gitignore`)

Tus documentos personales (`.pdf`, imágenes, `.checkpoint.json` y `cv-data.backup.ts`) permanecen ignorados en Git por confidencialidad, versionándose únicamente el código del motor y las plantillas públicas.
