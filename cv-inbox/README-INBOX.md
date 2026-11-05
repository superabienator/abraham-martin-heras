# 📥 CV-Inbox — Sistema de Ingesta Incremental con IA y Checkpoints SHA-256

Esta carpeta funciona como una **bandeja de entrada inteligente** para actualizar automáticamente [`src/data/cv-data.ts`](../src/data/cv-data.ts) a partir de nuevos diplomas, certificados oficiales o notas de experiencia laboral sin consumir tokens innecesarios.

---

## 📄 Formatos Admitidos

Deposita tus documentos directamente en `cv-inbox/`:

| Extensión | Tipo MIME | Uso recomendado |
| :--- | :--- | :--- |
| `.pdf` | `application/pdf` | Diplomas oficiales, certificados de cursos, programas formativos o CV previo |
| `.png`, `.jpg`, `.jpeg`, `.webp` | `image/*` | Capturas de credenciales, insignias verificadas o certificados escaneados |
| `.txt`, `.md` | `text/plain` | Notas rápidas sobre nuevos proyectos, logros operativos, métricas o cursos |

---

## ⚙️ Cómo Funciona (Ahorro de Tokens con Checkpoints)

1. **Escaneo y Hash SHA-256:**  
   Al ejecutar el script, se calcula la huella criptográfica (`SHA-256`) de cada archivo en `cv-inbox/` y se compara contra `cv-inbox/.checkpoint.json`.
2. **Cero Coste si no hay Cambios:**  
   Si todos los archivos ya fueron procesados anteriormente, el script termina de inmediato mostrando:  
   `✅ Todo sincronizado. 0 archivos nuevos (0 tokens consumidos).`
3. **Extracción Multimodal con `gemini-2.5-flash`:**  
   Solo los archivos nuevos o modificados se envían como `inlineData` (base64) a la API REST de **Gemini 2.5 Flash**, junto con el estado actual de `src/data/cv-data.ts`.
4. **Privacidad por Diseño (Filtro PII):**  
   El System Prompt filtra y omite automáticamente datos sensibles personales presentes en los diplomas (DNI/NIE, dirección postal, teléfono personal o firmas).
5. **Backup Automático:**  
   Antes de sobrescribir `src/data/cv-data.ts`, se guarda una copia íntegra en `src/data/cv-data.backup.ts`.

---

## 🚀 Requisitos y Ejecución

1. Define tu clave en `.env.local` en la raíz del proyecto:
   ```env
   GEMINI_API_KEY="tu_clave_de_gemini_aqui"
   ```
2. Ejecuta la sincronización con cualquiera de estos métodos:
   - **Vía npm ( multiplataforma):**
     ```bash
     npm run sync-cv
     ```
   - **Vía script Bash (con validación TypeScript integrada):**
     ```bash
     ./cv-inbox/actualizar-cv.sh
     ```

---

## 🔒 Privacidad en Git (`.gitignore`)

El archivo `.gitignore` del proyecto está configurado para **ignorar todos tus documentos personales** (`.pdf`, imágenes, notas privadas, `.checkpoint.json` y `src/data/cv-data.backup.ts`), subiendo al repositorio únicamente:
- `cv-inbox/sync-cv.mjs`
- `cv-inbox/actualizar-cv.sh`
- `cv-inbox/README-INBOX.md`
