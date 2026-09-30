// One-off generator for the hero route map's dot matrix.
// Run with `npm run gen:map`. Uses devDependencies only (world-atlas,
// topojson-client, d3-geo); the browser only ever sees the JSON output.
import fs from "node:fs";
import { createRequire } from "node:module";
import { feature } from "topojson-client";
import { geoContains } from "d3-geo";
import { route } from "../src/content/site.ts";

const require = createRequire(import.meta.url);
const topology = require("world-atlas/land-50m.json");
const land = feature(topology, topology.objects.land);

// Region the route needs.
const LNG_MIN = -130;
const LNG_MAX = 90;
const LAT_MIN = 5;
const LAT_MAX = 65;

// Equirectangular with a 45° standard parallel, so mid-latitude shapes
// (US, Europe) aren't stretched sideways. Normalised to width 1000.
const WIDTH = 1000;
const lngScale = WIDTH / (LNG_MAX - LNG_MIN);
const latScale = lngScale / Math.cos((45 * Math.PI) / 180);
const HEIGHT = Math.round((LAT_MAX - LAT_MIN) * latScale);

const project = ([lng, lat]) => [(lng - LNG_MIN) * lngScale, (LAT_MAX - lat) * latScale];
const invert = ([x, y]) => [x / lngScale + LNG_MIN, LAT_MAX - y / latScale];
const round = (n) => Math.round(n * 10) / 10;

function sample(spacing) {
  const dots = [];
  for (let y = spacing / 2; y < HEIGHT; y += spacing) {
    for (let x = spacing / 2; x < WIDTH; x += spacing) {
      if (geoContains(land, invert([x, y]))) dots.push([round(x), round(y)]);
    }
  }
  return dots;
}

// Tune spacing so the map lands in the 1,500–2,500 dot range (aim ~2,000).
let spacing = 9;
let dots = sample(spacing);
for (let i = 0; i < 8 && (dots.length < 1800 || dots.length > 2200); i++) {
  spacing *= Math.sqrt(dots.length / 2000);
  spacing = Math.round(spacing * 100) / 100;
  dots = sample(spacing);
}

const out = {
  viewBox: [0, 0, WIDTH, HEIGHT],
  region: { lngMin: LNG_MIN, lngMax: LNG_MAX, latMin: LAT_MIN, latMax: LAT_MAX },
  projection: { lngMin: LNG_MIN, latMax: LAT_MAX, lngScale: round(lngScale * 1000) / 1000, latScale: round(latScale * 1000) / 1000 },
  spacing,
  dotRadius: 1.8,
  cities: Object.fromEntries(route.map((stop) => [stop.city, project([stop.lng, stop.lat]).map(round)])),
  dots,
};

fs.writeFileSync(new URL("../src/content/map-dots.json", import.meta.url), JSON.stringify(out) + "\n");
console.log(`map-dots.json: ${dots.length} dots, spacing ${spacing}, viewBox 0 0 ${WIDTH} ${HEIGHT}`);
console.log("cities:", out.cities);
