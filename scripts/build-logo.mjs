import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const originalImagePath = "C:/Users/super/.gemini/antigravity/brain/1496fecd-13a9-4297-9b40-2e25a41c0918/.user_uploaded/media_1793884081441_6ee72785.jpg";

async function restoreUserLogo() {
  const publicDir = "public";
  const appDir = path.join("src", "app");

  console.log("Restoring user original logo from:", originalImagePath);

  // 1. Full high-res 1024x1024 PNG
  await sharp(originalImagePath)
    .png({ quality: 100 })
    .toFile(path.join(publicDir, "logo-amh.png"));
  console.log("Rendered public/logo-amh.png (1024x1024)");

  // 2. Focused squircle card crop (620x620 centered at 512,512)
  await sharp(originalImagePath)
    .extract({ left: 202, top: 202, width: 620, height: 620 })
    .png({ quality: 100 })
    .toFile(path.join(publicDir, "logo-amh-cropped.png"));
  console.log("Rendered public/logo-amh-cropped.png (620x620)");

  // 3. Next.js App Router Favicon (src/app/icon.png - 512x512)
  await sharp(originalImagePath)
    .extract({ left: 202, top: 202, width: 620, height: 620 })
    .resize(512, 512)
    .png()
    .toFile(path.join(appDir, "icon.png"));
  console.log("Rendered src/app/icon.png (512x512)");

  // 4. Apple Touch Icon (src/app/apple-icon.png - 180x180)
  await sharp(originalImagePath)
    .extract({ left: 202, top: 202, width: 620, height: 620 })
    .resize(180, 180)
    .png()
    .toFile(path.join(appDir, "apple-icon.png"));
  console.log("Rendered src/app/apple-icon.png (180x180)");

  // 5. Favicon PNG (public/favicon.png - 64x64)
  await sharp(originalImagePath)
    .extract({ left: 202, top: 202, width: 620, height: 620 })
    .resize(64, 64)
    .png()
    .toFile(path.join(publicDir, "favicon.png"));
  console.log("Rendered public/favicon.png (64x64)");

  // 6. Favicon ICO (32x32 RGBA)
  const png32 = await sharp(originalImagePath)
    .extract({ left: 202, top: 202, width: 620, height: 620 })
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

  // Remove the temporary custom SVG if present to keep public clean
  const svgPath = path.join(publicDir, "logo-amh.svg");
  if (fs.existsSync(svgPath)) {
    fs.unlinkSync(svgPath);
    console.log("Removed public/logo-amh.svg");
  }

  console.log("User original logo restored across all favicon and brand assets!");
}

restoreUserLogo().catch(console.error);
