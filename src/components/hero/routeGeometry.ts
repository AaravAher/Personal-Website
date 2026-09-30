import mapData from "@/content/map-dots.json";
import { route } from "@/content/site";

/*
 * Map geometry shared by the hero route map and the share image: the
 * dot-matrix land, the projected cities, and one arc per leg. All static.
 */
export const [, , MAP_W, MAP_H] = mapData.viewBox;
const { lngMin, latMax, lngScale, latScale } = mapData.projection;
const project = (lng: number, lat: number) => [(lng - lngMin) * lngScale, (latMax - lat) * latScale] as const;

const DEFAULT_BOW = 0.22;
const r = mapData.dotRadius;

/** Every land dot as one path (far cheaper than thousands of <circle>s). */
export const DOTS_PATH = mapData.dots
  .map(([x, y]) => `M${x - r},${y}a${r},${r} 0 1,0 ${r * 2},0a${r},${r} 0 1,0 -${r * 2},0`)
  .join("");

export const STOPS = route.map((stop) => {
  const [x, y] = project(stop.lng, stop.lat);
  return { ...stop, x, y };
});

/** One quadratic arc per leg, bowing north by the arriving stop's `bow`. */
export const LEGS = STOPS.slice(1).map((b, i) => {
  const a = STOPS[i];
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const cx = (a.x + b.x) / 2;
  const cy = (a.y + b.y) / 2 - len * (b.bow ?? DEFAULT_BOW);
  return `M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`;
});
