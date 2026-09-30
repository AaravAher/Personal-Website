// Generates the favicon set from the "AA." monogram (navy serif "AA" with a
// teal dot, on cream). Run with `npm run icons:build`.
//
// Glyphs are converted to SVG paths with opentype.js (run one-off through npx,
// not a dependency), so the icons need no web fonts; sharp rasterises them.
//
// Outputs: src/app/icon.svg, src/app/apple-icon.png (180),
// public/icons/icon-192.png, public/icons/icon-512.png, src/app/favicon.ico (16 + 32).
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
// opentype.js comes from the npx cache (see the npm script).
const npxBin = (process.env.PATH || "").split(path.delimiter).find((p) => p.includes("_npx") && fs.existsSync(path.join(p, "..", "opentype.js")));
if (!npxBin) throw new Error("Run via `npm run icons:build` (needs opentype.js from npx).");
const opentype = createRequire(path.join(npxBin, ".."))("opentype.js");

const COLORS = { base: "#faf7f0", primary: "#1b2a41", accent: "#0f7c74" }; // = src/content/tokens.ts
const serif = opentype.loadSync(path.join(ROOT, "assets-src/fonts/InstrumentSerif-Regular.ttf"));

/**
 * "AA" + "." centred in a square of side `size`, scaled so the text spans
 * `fill` of the width. Returns an SVG string.
 */
function monogram({ size, fill, bg, fg, dot, radius = 0, withDot = true, bold = 0 }) {
  const probe = 100;
  const aa = serif.getPath("AA", 0, 0, probe);
  const aaBox = aa.getBoundingBox();
  const advance = serif.getAdvanceWidth("AA", probe);
  const dotPath = serif.getPath(".", advance, 0, probe);
  const dotBox = dotPath.getBoundingBox();
  const right = withDot ? dotBox.x2 : aaBox.x2;
  const scale = (size * fill) / (right - aaBox.x1);
  const fontSize = probe * scale;
  const width = (right - aaBox.x1) * scale;
  const height = (aaBox.y2 - aaBox.y1) * scale; // cap height of "A"
  const x = (size - width) / 2 - aaBox.x1 * scale;
  const baseline = (size + height) / 2 - aaBox.y2 * scale;
  const glyphs = serif.getPath("AA", x, baseline, fontSize).toPathData(2);
  const period = serif.getPath(".", x + advance * scale, baseline, fontSize).toPathData(2);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">` +
    `<rect width="${size}" height="${size}" rx="${radius}" fill="${bg}"/>` +
    (bold ? `<path d="${glyphs}" fill="${fg}" stroke="${fg}" stroke-width="${bold}" stroke-linejoin="round"/>` : `<path d="${glyphs}" fill="${fg}"/>`) +
    (withDot ? `<path d="${period}" fill="${dot}"/>` : "") +
    `</svg>`;
}

const png = (svg, size) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();

// Primary: cream tile, navy "AA", teal dot; ~20% padding each side.
const primary = monogram({ size: 512, fill: 0.62, bg: COLORS.base, fg: COLORS.primary, dot: COLORS.accent, radius: 96 });
const full = monogram({ size: 512, fill: 0.6, bg: COLORS.base, fg: COLORS.primary, dot: COLORS.accent }); // square, for apple/manifest
// Tiny sizes: the thin serif breaks up at 16px, so invert to a navy tile with
// a cream monogram that fills more of the square, emboldened with a stroke.
const small = (size) =>
  monogram({ size: 64, fill: 0.84, bg: COLORS.primary, fg: COLORS.base, dot: COLORS.accent, radius: 12, withDot: size >= 32, bold: size <= 16 ? 3.2 : 1.6 });

fs.writeFileSync(path.join(ROOT, "src/app/icon.svg"), primary);
fs.writeFileSync(path.join(ROOT, "src/app/apple-icon.png"), await png(full, 180));
fs.writeFileSync(path.join(ROOT, "public/icons/icon-192.png"), await png(full, 192));
fs.writeFileSync(path.join(ROOT, "public/icons/icon-512.png"), await png(full, 512));

// favicon.ico: an ICO container holding PNG images (supported by every current browser).
const entries = await Promise.all([16, 32].map(async (s) => ({ size: s, data: await png(small(s), s) })));
const header = Buffer.alloc(6 + 16 * entries.length);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(entries.length, 4);
let offset = header.length;
entries.forEach((e, i) => {
  const o = 6 + 16 * i;
  header.writeUInt8(e.size, o); header.writeUInt8(e.size, o + 1); header.writeUInt8(0, o + 2); header.writeUInt8(0, o + 3);
  header.writeUInt16LE(1, o + 4); header.writeUInt16LE(32, o + 6);
  header.writeUInt32LE(e.data.length, o + 8); header.writeUInt32LE(offset, o + 12);
  offset += e.data.length;
});
fs.writeFileSync(path.join(ROOT, "src/app/favicon.ico"), Buffer.concat([header, ...entries.map((e) => e.data)]));
console.log("icons: icon.svg, apple-icon.png (180), icons/icon-192.png, icons/icon-512.png, favicon.ico (16, 32)");
