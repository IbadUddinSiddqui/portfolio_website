/**
 * Favicon Generator
 *
 * Reads public/images/logo.png and generates:
 * - favicon.ico (multi-size: 16, 32, 48)
 * - favicon-16x16.png
 * - favicon-32x32.png
 * - favicon-192x192.png (for PWA / manifest)
 * - favicon-512x512.png (for PWA / manifest)
 * - apple-touch-icon.png (180x180)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const inputFile = path.join(root, "public/images/logo.png");
const outputDir = path.join(root, "public");

if (!fs.existsSync(inputFile)) {
  console.error("❌ Input file not found:", inputFile);
  process.exit(1);
}

const sizes = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "favicon-192x192.png", size: 192 },
  { name: "favicon-512x512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

// ─── Generate PNG favicons ─────────────────────────────

console.log("📦 Generating PNG favicons...");

const pngBuffers = {};

for (const { name, size } of sizes) {
  const outputPath = path.join(outputDir, name);
  const buffer = await sharp(inputFile).resize(size, size).png().toBuffer();
  fs.writeFileSync(outputPath, buffer);
  pngBuffers[size] = buffer;
  console.log(`  ✅ ${name} (${size}×${size})`);
}

// ─── Generate multi-size favicon.ico ────────────────────

console.log("📦 Generating favicon.ico...");

const icoSizes = [16, 32, 48];
const icoPngBuffers = [];

for (const size of icoSizes) {
  const buffer = await sharp(inputFile).resize(size, size).png().toBuffer();
  icoPngBuffers.push(buffer);
}

// Build ICO manually: header + directory entries + PNG data
function buildIco(pngs) {
  const headerSize = 6;
  const dirEntrySize = 16;
  const numImages = pngs.length;
  const header = Buffer.alloc(headerSize);

  // ICO header: reserved(2) + type(2) + count(2)
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = ICO
  header.writeUInt16LE(numImages, 4); // count

  let offset = headerSize + numImages * dirEntrySize;
  const entries = [];
  const imageData = [];

  for (let i = 0; i < numImages; i++) {
    const png = pngs[i];
    const size = icoSizes[i];
    const entry = Buffer.alloc(dirEntrySize);

    // Directory entry
    entry.writeUInt8(size === 256 ? 0 : size, 0); // width
    entry.writeUInt8(size === 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // colors
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(png.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset

    entries.push(entry);
    imageData.push(png);
    offset += png.length;
  }

  return Buffer.concat([header, ...entries, ...imageData]);
}

const icoBuffer = buildIco(icoPngBuffers);
fs.writeFileSync(path.join(outputDir, "favicon.ico"), icoBuffer);

console.log("  ✅ favicon.ico (16×16, 32×32, 48×48)");
console.log("\n🎉 All favicon files generated in public/");
