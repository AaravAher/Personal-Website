// Builds web images from the originals in /assets-src (not shipped).
// Run with `npm run images:build`. Uses sharp (devDependency only).
//
// For every assets-src/<section>/<name>.<ext> it writes
//   public/images/<section>/<name>-1600w.webp  (max 1600px long edge)
//   public/images/<section>/<name>-800w.webp   (max 800px long edge)
// and records each image's dimensions in src/content/image-manifest.json,
// keyed by "/images/<section>/<name>", so layouts know the true aspect ratio.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SRC = path.join(ROOT, "assets-src");
const OUT = path.join(ROOT, "public", "images");
const MANIFEST = path.join(ROOT, "src", "content", "image-manifest.json");
const SIZES = [1600, 800];
const QUALITY = 80;

/**
 * Optional per-file trims, applied after EXIF rotation, in source pixels.
 * Only trims empty page margins; never crops content.
 */
const EXTRACT = {
  // Article sits in a narrow centre column; drop the empty side margins.
  "projects/basispoint-article": { left: 740, top: 0, width: 1460, height: 1586 },
};

const manifest = {};
let count = 0;
for (const section of fs.readdirSync(SRC).filter((d) => fs.statSync(path.join(SRC, d)).isDirectory()).sort()) {
  fs.mkdirSync(path.join(OUT, section), { recursive: true });
  for (const file of fs.readdirSync(path.join(SRC, section)).filter((f) => /\.(jpe?g|png|webp|tiff?)$/i.test(f)).sort()) {
    const name = file.replace(/\.[^.]+$/, "");
    const key = `${section}/${name}`;
    // .rotate() with no argument applies the EXIF orientation. sharp drops
    // all metadata (EXIF, GPS, ICC) unless asked to keep it.
    let base = sharp(path.join(SRC, section, file)).rotate();
    if (EXTRACT[key]) base = sharp(await base.toBuffer()).extract(EXTRACT[key]);
    const buffer = await base.toBuffer();
    for (const size of SIZES) {
      const info = await sharp(buffer)
        .resize({ width: size, height: size, fit: "inside", withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(path.join(OUT, section, `${name}-${size}w.webp`));
      if (size === SIZES[0]) manifest[`/images/${key}`] = { width: info.width, height: info.height };
    }
    count++;
  }
}
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Built ${count} images (${count * SIZES.length} files) → public/images, manifest → src/content/image-manifest.json`);
