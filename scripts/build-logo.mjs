import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

// Ultra-modern, iconic AMH vector logo
// Designed to be crisp at 16x16, 32x32 favicon sizes and 1024x1024 Retina display
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background subtle CAD Grid Pattern -->
    <pattern id="cadGrid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(15, 23, 42, 0.04)" stroke-width="1"/>
    </pattern>

    <!-- Letter A Gradient: Electric Violet to Vibrant Purple -->
    <linearGradient id="gradA" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7C3AED" />
      <stop offset="100%" stop-color="#9333EA" />
    </linearGradient>

    <!-- Letter M Gradient: Deep Indigo to Radiant Cobalt Blue -->
    <linearGradient id="gradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366F1" />
      <stop offset="50%" stop-color="#3B82F6" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>

    <!-- Letter H Gradient: Ocean Blue to Emerald Cyan -->
    <linearGradient id="gradH" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284C7" />
      <stop offset="50%" stop-color="#06B6D4" />
      <stop offset="100%" stop-color="#0D9488" />
    </linearGradient>

    <!-- Subtle Ambient Elevation Shadow for Badge -->
    <filter id="elevation" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="22" flood-color="#0f172a" flood-opacity="0.08"/>
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0f172a" flood-opacity="0.04"/>
    </filter>
  </defs>

  <!-- Canvas Background with light architectural grid -->
  <rect width="512" height="512" fill="#F8FAFC" />
  <rect width="512" height="512" fill="url(#cadGrid)" />

  <!-- iOS-Style Curvature Squircle Card -->
  <rect x="48" y="48" width="416" height="416" rx="98" ry="98" fill="#FFFFFF" filter="url(#elevation)" stroke="rgba(226, 232, 240, 0.9)" stroke-width="1.5" />

  <!-- Inner Soft Bezel Rim -->
  <rect x="50" y="50" width="412" height="412" rx="96" ry="96" fill="none" stroke="rgba(255, 255, 255, 0.85)" stroke-width="2" />

  <!-- The Interlocking AMH Glyph (Centered at 256, 256) -->
  <!-- Total glyph width: 360, height: 168. Offset X = 76, Offset Y = 172 -->
  <g transform="translate(76, 172)">
    <!-- ==========================================
         LETTER A: Bold geometric diagonal with crossbar
         ========================================== -->
    <path d="M 54 0 L 98 0 L 152 168 L 118 168 L 105 124 L 46 124 L 33 168 L 0 168 Z M 76 38 L 96 98 L 56 98 Z" fill="url(#gradA)" />

    <!-- ==========================================
         LETTER M: Dual vertical pillars + central chevron
         ========================================== -->
    <path d="M 136 0 L 168 0 L 206 106 L 244 0 L 276 0 L 276 168 L 246 168 L 246 48 L 218 126 L 194 126 L 166 48 L 166 168 L 136 168 Z" fill="url(#gradM)" />

    <!-- ==========================================
         LETTER H: Connecting curved arch ligature + right vertical pillar
         ========================================== -->
    <!-- Curved shoulder arch emerging seamlessly from M right stem -->
    <path d="M 276 68 Q 308 68 320 90 Q 330 110 330 134 L 330 168 L 302 168 L 302 130 Q 302 108 290 98 Q 282 92 276 92 Z" fill="url(#gradH)" />
    <!-- Horizontal bridge bar to right pillar -->
    <path d="M 276 70 L 332 70 L 332 96 L 276 96 Z" fill="url(#gradH)" />
    <!-- Right vertical pillar of H -->
    <path d="M 330 0 L 360 0 L 360 168 L 330 168 Z" fill="url(#gradH)" />
  </g>
</svg>`;

async function buildBrandAssets() {
  const publicDir = "public";
  const appDir = path.join("src", "app");

  // 1. Write the vector SVG
  fs.writeFileSync(path.join(publicDir, "logo-amh.svg"), svgContent);
  console.log("Saved public/logo-amh.svg");

  const svgBuffer = Buffer.from(svgContent);

  // 2. High-res PNG (1024x1024)
  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, "logo-amh.png"));
  console.log("Rendered public/logo-amh.png (1024x1024)");

  // 3. Cropped Badge (tight frame without padding, 512x512)
  await sharp(svgBuffer)
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, "logo-amh-cropped.png"));
  console.log("Rendered public/logo-amh-cropped.png (512x512)");

  // 4. Next.js App Router Favicon (src/app/icon.png - 512x512)
  await sharp(svgBuffer)
    .resize(512, 512)
    .png({ quality: 100 })
    .toFile(path.join(appDir, "icon.png"));
  console.log("Rendered src/app/icon.png (512x512)");

  // 5. Apple Touch Icon (src/app/apple-icon.png - 180x180)
  await sharp(svgBuffer)
    .resize(180, 180)
    .png({ quality: 100 })
    .toFile(path.join(appDir, "apple-icon.png"));
  console.log("Rendered src/app/apple-icon.png (180x180)");

  // 6. Favicon PNG (public/favicon.png - 64x64)
  await sharp(svgBuffer)
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, "favicon.png"));
  console.log("Rendered public/favicon.png (64x64)");

  // 7. Multi-resolution ICO (32x32 RGBA)
  const png32 = await sharp(svgBuffer)
    .resize(32, 32)
    .ensureAlpha()
    .png({ colourType: 6 })
    .toBuffer();

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);
  entry.writeUInt8(32, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(png32.length, 8);
  entry.writeUInt32LE(22, 12);

  const ico = Buffer.concat([header, entry, png32]);
  fs.writeFileSync(path.join(appDir, "favicon.ico"), ico);
  fs.writeFileSync(path.join(publicDir, "favicon.ico"), ico);
  console.log("Rendered src/app/favicon.ico and public/favicon.ico (32x32)");

  console.log("All brand assets successfully built!");
}

buildBrandAssets().catch(console.error);
