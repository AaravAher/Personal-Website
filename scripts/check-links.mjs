// Link check for the static build. Run `npm run build` first, then
// `npm run check:links`. Not shipped.
//
// - Internal anchors: every href="#x" (or "/#x") has a matching id.
// - Files: every local href / src / srcset / icon / manifest icon exists in out/.
// - mailto: and tel: are well formed.
// - External <a> links carry target="_blank" and rel="noopener noreferrer",
//   and answer 2xx/3xx. 999/403/429 (bot blocking, e.g. LinkedIn) are
//   reported as "blocked, check manually", not as failures.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = path.join(ROOT, "out");
const CANONICAL = "https://www.aaravaher.com";
if (!fs.existsSync(OUT)) {
  console.error("No out/ folder: run `npm run build` first.");
  process.exit(1);
}

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'");
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i"));
  return m ? decode(m[1]) : null;
};
const pages = fs.readdirSync(OUT).filter((f) => f.endsWith(".html") && !f.startsWith("_"));
const idsOf = (html) => new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
const htmlOf = Object.fromEntries(pages.map((p) => [p, fs.readFileSync(path.join(OUT, p), "utf8")]));
const ids = Object.fromEntries(pages.map((p) => [p, idsOf(htmlOf[p])]));

const failures = [];
const blocked = [];
const passed = { anchors: 0, files: 0, external: 0, mail: 0 };
const fileExists = (urlPath) => {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  const local = path.join(OUT, clean === "/" ? "index.html" : clean);
  return fs.existsSync(local) && (fs.statSync(local).isFile() || fs.existsSync(path.join(local, "index.html")));
};
const external = new Map(); // url -> pages

for (const page of pages) {
  const html = htmlOf[page];
  // Anchors
  for (const m of html.matchAll(/<a\b[^>]*>/gi)) {
    const tag = m[0];
    const href = attr(tag, "href");
    if (!href) continue;
    if (href.startsWith("#")) {
      if (href === "#" || ids[page].has(href.slice(1))) passed.anchors++;
      else failures.push(`${page}: anchor ${href} has no matching id`);
    } else if (href.startsWith("/#")) {
      if (ids["index.html"].has(href.slice(2))) passed.anchors++;
      else failures.push(`${page}: ${href} has no matching id on the home page`);
    } else if (href.startsWith("/")) {
      if (fileExists(href)) passed.files++;
      else failures.push(`${page}: missing file ${href}`);
    } else if (href.startsWith("mailto:")) {
      if (/^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(href)) passed.mail++;
      else failures.push(`${page}: malformed ${href}`);
    } else if (href.startsWith("tel:")) {
      if (/^tel:\+?\d{7,15}$/.test(href)) passed.mail++;
      else failures.push(`${page}: malformed ${href}`);
    } else if (/^https?:\/\//.test(href)) {
      const target = attr(tag, "target");
      const rel = (attr(tag, "rel") || "").split(/\s+/);
      if (target !== "_blank" || !rel.includes("noopener") || !rel.includes("noreferrer")) {
        failures.push(`${page}: external link ${href} needs target="_blank" rel="noopener noreferrer"`);
      }
      if (!external.has(href)) external.set(href, new Set());
      external.get(href).add(page);
    }
  }
  // Local assets: src, srcset, <link href> (icons, manifest, preloads)
  const assetRefs = [
    ...[...html.matchAll(/\ssrc="([^"]+)"/g)].map((m) => decode(m[1])),
    ...[...html.matchAll(/\ssrcset="([^"]+)"/gi)].flatMap((m) => decode(m[1]).split(",").map((s) => s.trim().split(/\s+/)[0])),
    ...[...html.matchAll(/<link\b[^>]*>/gi)].map((m) => attr(m[0], "href")).filter(Boolean),
    ...[...html.matchAll(/<meta\b[^>]*content="(https:\/\/www\.aaravaher\.com[^"]*)"/gi)].map((m) => decode(m[1])),
  ];
  for (let ref of assetRefs) {
    if (ref.startsWith(CANONICAL)) ref = ref.slice(CANONICAL.length) || "/";
    if (!ref.startsWith("/") || ref.startsWith("//")) continue;
    if (fileExists(ref)) passed.files++;
    else failures.push(`${page}: missing asset ${ref}`);
  }
}

// Manifest icons
const manifest = JSON.parse(fs.readFileSync(path.join(OUT, "manifest.webmanifest"), "utf8"));
for (const icon of manifest.icons ?? []) {
  if (fileExists(icon.src)) passed.files++;
  else failures.push(`manifest: missing icon ${icon.src}`);
}

// External links
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";
async function probe(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const res = await fetch(url, { method, redirect: "follow", headers: { "user-agent": UA }, signal: AbortSignal.timeout(15000) });
      if (res.status < 400) return { ok: true, status: res.status };
      if ([999, 403, 429].includes(res.status)) return { blocked: true, status: res.status };
      if (method === "GET") return { ok: false, status: res.status };
    } catch (err) {
      if (method === "GET") return { ok: false, status: err.cause?.code || err.name };
    }
  }
}
const results = await Promise.all([...external.keys()].map(async (url) => [url, await probe(url)]));
for (const [url, r] of results) {
  if (r.ok) passed.external++;
  else if (r.blocked) blocked.push(`${url} (${r.status})`);
  else failures.push(`external ${url} returned ${r.status}`);
}

console.log(`Pages: ${pages.join(", ")}`);
console.log(`OK: ${passed.anchors} anchors, ${passed.files} local files/assets, ${passed.mail} mailto/tel, ${passed.external}/${external.size} external links`);
for (const [url, r] of results) console.log(`  ${r.ok ? "✓" : r.blocked ? "?" : "✗"} ${r.status}  ${url}`);
if (blocked.length) console.log(`\nBlocked, check manually:\n  ${blocked.join("\n  ")}`);
if (failures.length) {
  console.log(`\nFailures (${failures.length}):\n  ${failures.join("\n  ")}`);
  process.exit(1);
}
console.log("\nAll links OK.");
