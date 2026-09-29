"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import mapData from "@/content/map-dots.json";
import { heroCopy, route } from "@/content/site";
import { usePrefersReducedMotion } from "@/components/ui/usePrefersReducedMotion";

const [, , W, H] = mapData.viewBox;
const { lngMin, latMax, lngScale, latScale } = mapData.projection;
const project = (lng: number, lat: number) => [(lng - lngMin) * lngScale, (latMax - lat) * latScale] as const;

/*
 * Timeline (seconds after the hero mounts). The stats flap from 0.8s to
 * ~3.1s; arcs draw from 1.6s, overlapping the end of the flaps.
 */
const DRAW_START = 1.6;
const ARC_DURATION = 0.6;
const FIRST_FLIGHT_GAP_MS = 800; // after the last arc lands
const FLIGHT_MS = 6200;
const LANDING_MS = 300; // the plane shrinks into Boston over the last 300ms
const FLIGHT_EVERY_MS = [14_000, 16_000] as const; // start to start
const CONTRAIL = 55; // viewBox units behind the plane (~50px on wide screens)

// Sizes in viewBox units. Boston is ~15% bigger than the other cities.
const CITY_R = 4;
const CURRENT_R = 5.75;
const CURRENT_HALO_R = 10.35;

/** How far each arc bows north, as a share of its length. */
const BOW: Record<string, number> = {
  // Over Greenland and northern Canada, well clear of Boston and its label.
  "Glasgow>Bay Area": 0.36,
  // A short, gentle eastbound hop.
  "Bay Area>Boston": 0.12,
};
const DEFAULT_BOW = 0.22;

// All of this is static: computed once at module load.
const DOTS_PATH = mapData.dots
  .map(([x, y]) => `M${x - mapData.dotRadius},${y}a${mapData.dotRadius},${mapData.dotRadius} 0 1,0 ${mapData.dotRadius * 2},0a${mapData.dotRadius},${mapData.dotRadius} 0 1,0 -${mapData.dotRadius * 2},0`)
  .join("");

const STOPS = route.map((stop) => {
  const [x, y] = project(stop.lng, stop.lat);
  return { ...stop, x, y };
});

/** Quadratic arcs that bow north (upward), like flight paths. */
const ARCS = STOPS.slice(1).map((b, i) => {
  const a = STOPS[i];
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const bow = BOW[`${a.city}>${b.city}`] ?? DEFAULT_BOW;
  const cx = (a.x + b.x) / 2;
  const cy = (a.y + b.y) / 2 - len * bow;
  return { d: `M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`, q: `Q${cx},${cy} ${b.x},${b.y}` };
});
const FULL_ROUTE = `M${STOPS[0].x},${STOPS[0].y} ${ARCS.map((a) => a.q).join(" ")}`;

/** When each stop appears: the first at the start, the rest as their arc lands. */
const arrival = (i: number) => DRAW_START + i * ARC_DURATION;
const FIRST_FLIGHT_MS = arrival(ARCS.length) * 1000 + FIRST_FLIGHT_GAP_MS;

/*
 * Flight speed along the route (0 → 1). Eases out of the first city, cruises,
 * dips gently through each stop, and slows right down into the last one.
 * Integrated once into a time → distance table the flight reads from.
 */
const smooth = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
function timeTable(stops: number[], samples = 800) {
  const speed = (s: number) => {
    const takeoff = 0.25 + 0.75 * smooth(s / 0.12);
    const landing = 0.1 + 0.9 * smooth((1 - s) / 0.22);
    const dips = stops.reduce((f, at) => f * (1 - 0.45 * Math.exp(-(((s - at) / 0.035) ** 2))), 1);
    return takeoff * landing * dips;
  };
  const times = [0];
  for (let i = 1; i <= samples; i++) times.push(times[i - 1] + 1 / samples / speed((i - 0.5) / samples));
  const total = times[samples];
  return times.map((t) => t / total);
}
/** Distance share travelled at a time share, by binary search in the table. */
function distanceAt(times: number[], t: number) {
  let lo = 0;
  let hi = times.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (times[mid] < t) lo = mid;
    else hi = mid;
  }
  const f = (t - times[lo]) / (times[hi] - times[lo] || 1);
  return (lo + f) / (times.length - 1);
}

/**
 * Where each label sits relative to its dot, chosen so labels clear the arcs,
 * each other and the map's edges (Bay Area and Mumbai sit near the sides).
 */
const LABEL_PLACEMENT: Record<string, string> = {
  Mumbai: "right-[-6px] top-[10px] text-right",
  // Above, shifted right: the Bay Area arc leaves Glasgow steeply up-left.
  Glasgow: "left-[-4px] bottom-[10px] text-left",
  Boston: "left-[14px] top-[-2px] text-left",
  "Bay Area": "left-[-6px] top-[10px] text-left",
};

/** Top-down plane silhouette, nose pointing +x, ~18 units long. */
const PLANE =
  "M9,0 L3,-1.3 L-1,-7.5 L-3.2,-7.5 L-1.3,-1.5 L-6,-1.6 L-7.8,-4.2 L-9.2,-4.2 L-8,0 L-9.2,4.2 L-7.8,4.2 L-6,1.6 L-1.3,1.5 L-3.2,7.5 L-1,7.5 L3,1.3 Z";

const PASS_PULSE = "animate-[pulse-ring_1.4s_ease-out]";
const LANDED_PULSE = "animate-[landed-pulse_1.6s_ease-out]";
const NOW_FLASH = "animate-[now-flash_1.2s_ease-out]";

/** Restart a one-shot CSS animation by re-adding its class. */
function replay(el: Element | null | undefined, cls: string) {
  if (!el) return;
  el.classList.remove(cls);
  void (el as HTMLElement).getBoundingClientRect();
  el.classList.add(cls);
}

export function RouteMap({ className = "" }: { className?: string }) {
  const reduce = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<SVGGElement>(null);
  const contrailRef = useRef<SVGPathElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const passRefs = useRef<(SVGCircleElement | null)[]>([]);
  const landedRef = useRef<SVGCircleElement>(null);
  const nowRef = useRef<HTMLSpanElement>(null);

  // The plane: flies Mumbai → … → Boston every 14–16s, landing in Boston.
  // Runs only while the map is on screen and the tab is visible.
  useEffect(() => {
    if (reduce) return;
    const root = rootRef.current;
    const path = routeRef.current;
    const plane = planeRef.current;
    const contrail = contrailRef.current;
    const gradient = gradientRef.current;
    if (!root || !path || !plane || !contrail || !gradient) return;

    const total = path.getTotalLength();
    // Where each intermediate stop falls along the route (share of length).
    const stopsAt = ARCS.slice(0, -1).map((_, i) => {
      const probe = document.createElementNS("http://www.w3.org/2000/svg", "path");
      probe.setAttribute("d", `M${STOPS[0].x},${STOPS[0].y} ${ARCS.slice(0, i + 1).map((a) => a.q).join(" ")}`);
      return probe.getTotalLength() / total;
    });
    const times = timeTable(stopsAt);

    let inView = false;
    let visible = document.visibilityState === "visible";
    let timer: number | undefined;
    let frame = 0;
    const mountedAt = performance.now();

    const hide = () => {
      plane.setAttribute("opacity", "0");
      contrail.setAttribute("opacity", "0");
    };
    const stop = () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      hide();
    };
    const schedule = (ms: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(fly, ms);
    };
    const nextGap = () =>
      FLIGHT_EVERY_MS[0] + Math.random() * (FLIGHT_EVERY_MS[1] - FLIGHT_EVERY_MS[0]) - FLIGHT_MS;

    function fly() {
      const start = performance.now();
      const passed = stopsAt.map(() => false);
      const landingFrom = 1 - LANDING_MS / FLIGHT_MS;
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / FLIGHT_MS);
        const at = distanceAt(times, t) * total;
        const pt = path!.getPointAtLength(at);
        const ahead = path!.getPointAtLength(Math.min(total, at + 1));
        const behind = path!.getPointAtLength(Math.max(0, at - 1));
        const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
        // Over the final 300ms the plane shrinks and fades into Boston.
        const k = t < landingFrom ? 1 : Math.max(0, (1 - t) / (1 - landingFrom));
        plane!.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${angle}) scale(${k})`);
        plane!.setAttribute("opacity", String(k));

        // Contrail: the last CONTRAIL units of the route, fading toward the tail.
        const tailAt = Math.max(0, at - CONTRAIL);
        const tail = path!.getPointAtLength(tailAt);
        contrail!.setAttribute("stroke-dasharray", `${at - tailAt} ${total * 2}`);
        contrail!.setAttribute("stroke-dashoffset", String(-tailAt));
        contrail!.setAttribute("opacity", String(k));
        gradient!.setAttribute("x1", String(tail.x));
        gradient!.setAttribute("y1", String(tail.y));
        gradient!.setAttribute("x2", String(pt.x));
        gradient!.setAttribute("y2", String(pt.y));

        // Soft pulse on each stop as the plane passes through.
        stopsAt.forEach((share, i) => {
          if (!passed[i] && at / total >= share) {
            passed[i] = true;
            replay(passRefs.current[i + 1], PASS_PULSE);
          }
        });

        if (t < 1) {
          frame = requestAnimationFrame(step);
        } else {
          hide();
          replay(landedRef.current, LANDED_PULSE);
          replay(nowRef.current, NOW_FLASH);
          schedule(nextGap());
        }
      };
      frame = requestAnimationFrame(step);
    }

    const sync = () => {
      stop();
      if (inView && visible) schedule(Math.max(600, FIRST_FLIGHT_MS - (performance.now() - mountedAt)));
    };

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(root);
    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      stop();
    };
  }, [reduce]);

  // Under reduced motion everything renders in its final state (remounted on
  // change, so an in-flight intro can't linger).
  const pop = (i: number) =>
    reduce
      ? { initial: false as const }
      : {
          initial: { scale: 0 },
          animate: { scale: 1 },
          transition: { delay: arrival(i), type: "spring" as const, stiffness: 520, damping: 16 },
        };
  const fade = (i: number) =>
    reduce
      ? { initial: false as const }
      : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: arrival(i) + 0.1, duration: 0.35 } };

  const fromCentre = "[transform-box:fill-box] [transform-origin:center]";

  return (
    // @container: label sizes follow the map's rendered width (capped).
    <div ref={rootRef} className={`@container relative ${className}`} key={String(reduce)}>
      <svg
        role="img"
        aria-label={heroCopy.mapLabel}
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full overflow-visible"
      >
        <path d={DOTS_PATH} className="fill-primary/[0.24]" />

        <defs>
          {ARCS.map((arc, i) => (
            <mask key={i} id={`route-arc-mask-${i}`} maskUnits="userSpaceOnUse" x={-50} y={-150} width={W + 100} height={H + 250}>
              <motion.path
                d={arc.d}
                fill="none"
                stroke="white"
                strokeWidth={12}
                strokeLinecap="round"
                {...(reduce
                  ? { initial: false as const }
                  : {
                      initial: { pathLength: 0 },
                      animate: { pathLength: 1 },
                      transition: { delay: arrival(i), duration: ARC_DURATION, ease: "easeInOut" as const },
                    })}
              />
            </mask>
          ))}
          <linearGradient ref={gradientRef} id="route-contrail" gradientUnits="userSpaceOnUse">
            <stop offset="0" style={{ stopColor: "var(--color-accent)", stopOpacity: 0 }} />
            <stop offset="1" style={{ stopColor: "var(--color-accent)", stopOpacity: 0.8 }} />
          </linearGradient>
        </defs>

        {/* Dashed flight paths, revealed by the masks above. */}
        {ARCS.map((arc, i) => (
          <path
            key={i}
            d={arc.d}
            fill="none"
            strokeWidth={2}
            strokeDasharray="3 9"
            strokeLinecap="round"
            className="stroke-primary/[0.62]"
            mask={`url(#route-arc-mask-${i})`}
          />
        ))}

        {/* The route the plane follows, and its contrail (drawn from the same path). */}
        <path ref={routeRef} d={FULL_ROUTE} fill="none" stroke="none" />
        <path
          ref={contrailRef}
          d={FULL_ROUTE}
          fill="none"
          stroke="url(#route-contrail)"
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={0}
        />

        {STOPS.map((stop, i) =>
          stop.current ? (
            <g key={stop.city}>
              <motion.circle
                cx={stop.x}
                cy={stop.y}
                r={CURRENT_HALO_R}
                fill="none"
                strokeWidth={1.25}
                className={`stroke-accent/30 ${fromCentre}`}
                {...pop(i)}
              />
              {/* Idle pulse: slow and soft. */}
              <circle
                cx={stop.x}
                cy={stop.y}
                r={CURRENT_R}
                className={`fill-accent opacity-0 ${fromCentre} ${
                  reduce ? "" : "animate-[pulse-ring_2.4s_ease-out_infinite]"
                }`}
                style={reduce ? undefined : { animationDelay: `${arrival(i) + 0.4}s` }}
              />
              {/* One-shot "landed" pulse, wider than the idle one. */}
              <circle ref={landedRef} cx={stop.x} cy={stop.y} r={CURRENT_R} className={`fill-accent opacity-0 ${fromCentre}`} />
              <motion.circle cx={stop.x} cy={stop.y} r={CURRENT_R} className={`fill-accent ${fromCentre}`} {...pop(i)} />
            </g>
          ) : (
            <g key={stop.city}>
              {/* Soft pulse as the plane passes. */}
              <circle
                ref={(el) => {
                  passRefs.current[i] = el;
                }}
                cx={stop.x}
                cy={stop.y}
                r={CITY_R}
                className={`fill-primary/40 opacity-0 ${fromCentre}`}
              />
              <motion.circle cx={stop.x} cy={stop.y} r={CITY_R} className={`fill-primary ${fromCentre}`} {...pop(i)} />
            </g>
          ),
        )}

        {/* The plane. Hidden between flights. */}
        <g ref={planeRef} opacity={0} aria-hidden>
          <path d={PLANE} className="fill-primary" />
        </g>
      </svg>

      {/* Labels are HTML so they stay crisp. They grow with the map, capped at 14px / 13px. */}
      {STOPS.map((stop, i) => {
        const [before, after] = stop.noteHighlight ? stop.note.split(stop.noteHighlight) : [stop.note, undefined];
        return (
          <motion.div
            key={stop.city}
            aria-hidden
            className="pointer-events-none absolute h-0 w-0"
            style={{ left: `${(stop.x / W) * 100}%`, top: `${(stop.y / H) * 100}%` }}
            {...fade(i)}
          >
            <div className={`absolute w-max ${LABEL_PLACEMENT[stop.city] ?? "left-[10px] top-[10px]"}`}>
              <p className="text-[clamp(10px,1.95cqw,14px)] font-medium uppercase leading-tight tracking-[0.18em] text-primary-soft">
                {stop.label}
              </p>
              <p className="text-[clamp(10px,1.8cqw,13px)] leading-tight text-primary-soft">
                {before}
                {after !== undefined && (
                  <>
                    <span ref={stop.current ? nowRef : undefined}>{stop.noteHighlight}</span>
                    {after}
                  </>
                )}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
