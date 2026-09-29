"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import mapData from "@/content/map-dots.json";
import { heroCopy, route } from "@/content/site";
import { usePrefersReducedMotion } from "@/components/ui/usePrefersReducedMotion";

const [, , W, H] = mapData.viewBox;
const { lngMin, latMax, lngScale, latScale } = mapData.projection;
const project = (lng: number, lat: number) => [(lng - lngMin) * lngScale, (latMax - lat) * latScale] as const;

// Timeline (seconds after the hero mounts). Stats flap in at ~0.8s.
const DRAW_START = 1.4;
const ARC_DURATION = 0.7;
const COMET_FIRST_MS = 6000;
const COMET_TRIP_MS = 3000;
const COMET_EVERY_MS = [10_000, 12_000] as const;
const TAIL = [0.012, 0.024, 0.036, 0.048, 0.06]; // trailing offsets, as a share of the route

// All of this is static: computed once at module load.
const DOTS_PATH = mapData.dots
  .map(([x, y]) => `M${x - mapData.dotRadius},${y}a${mapData.dotRadius},${mapData.dotRadius} 0 1,0 ${mapData.dotRadius * 2},0a${mapData.dotRadius},${mapData.dotRadius} 0 1,0 -${mapData.dotRadius * 2},0`)
  .join("");

const STOPS = route.map((stop) => {
  const [x, y] = project(stop.lng, stop.lat);
  return { ...stop, x, y };
});

/** Quadratic arcs that bow north (upward) by ~22% of each segment's length. */
const ARCS = STOPS.slice(1).map((b, i) => {
  const a = STOPS[i];
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const cx = (a.x + b.x) / 2;
  const cy = (a.y + b.y) / 2 - len * 0.22;
  return { d: `M${a.x},${a.y} Q${cx},${cy} ${b.x},${b.y}`, q: `Q${cx},${cy} ${b.x},${b.y}` };
});
const FULL_ROUTE = `M${STOPS[0].x},${STOPS[0].y} ${ARCS.map((a) => a.q).join(" ")}`;

/** When each stop appears: the first at the start, the rest as their arc lands. */
const arrival = (i: number) => DRAW_START + i * ARC_DURATION;

/**
 * Where each label sits relative to its dot, chosen so labels clear the arcs,
 * each other and the map's edges (Bay Area and Mumbai sit near the sides).
 */
const LABEL_PLACEMENT: Record<string, string> = {
  Mumbai: "right-[-6px] top-[10px] text-right",
  Glasgow: "left-1/2 bottom-[10px] -translate-x-1/2 text-center",
  Boston: "left-[12px] top-[-2px] text-left",
  "Bay Area": "left-[-6px] top-[10px] text-left",
};

export function RouteMap({ className = "" }: { className?: string }) {
  const reduce = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const routeRef = useRef<SVGPathElement>(null);
  const cometRef = useRef<SVGGElement>(null);
  const bostonPulseRef = useRef<SVGCircleElement>(null);

  // The comet: a teal dot with a short tail that travels the whole route
  // every 10–12s. Runs only while the map is on screen and the tab visible.
  useEffect(() => {
    if (reduce) return;
    const root = rootRef.current;
    const path = routeRef.current;
    const comet = cometRef.current;
    if (!root || !path || !comet) return;

    const total = path.getTotalLength();
    const currentIndex = STOPS.findIndex((s) => s.current);
    // Share of the route at which the comet passes the current city.
    let passAt = 1;
    if (currentIndex > 0) {
      const probe = document.createElementNS("http://www.w3.org/2000/svg", "path");
      probe.setAttribute("d", `M${STOPS[0].x},${STOPS[0].y} ${ARCS.slice(0, currentIndex).map((a) => a.q).join(" ")}`);
      passAt = probe.getTotalLength() / total;
    }

    const dots = [...comet.querySelectorAll("circle")];
    let inView = false;
    let visible = document.visibilityState === "visible";
    let timer: number | undefined;
    let frame = 0;
    const mountedAt = performance.now();

    const hide = () => comet.setAttribute("opacity", "0");
    const pulseBoston = () => {
      const ring = bostonPulseRef.current;
      if (!ring) return;
      ring.classList.remove("animate-[pulse-ring_1.4s_ease-out]");
      void ring.getBoundingClientRect(); // restart the CSS animation
      ring.classList.add("animate-[pulse-ring_1.4s_ease-out]");
    };

    const stop = () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
      hide();
    };
    const schedule = (ms: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(trip, ms);
    };
    const nextGap = () =>
      COMET_EVERY_MS[0] + Math.random() * (COMET_EVERY_MS[1] - COMET_EVERY_MS[0]) - COMET_TRIP_MS;

    function trip() {
      const start = performance.now();
      let pulsed = false;
      comet!.setAttribute("opacity", "1");
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / COMET_TRIP_MS);
        const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
        dots.forEach((dot, k) => {
          const at = Math.max(0, eased - (k === 0 ? 0 : TAIL[k - 1]));
          const pt = path!.getPointAtLength(at * total);
          dot.setAttribute("cx", String(pt.x));
          dot.setAttribute("cy", String(pt.y));
        });
        if (!pulsed && eased >= passAt) {
          pulsed = true;
          pulseBoston();
        }
        if (t < 1) frame = requestAnimationFrame(step);
        else {
          hide();
          schedule(nextGap());
        }
      };
      frame = requestAnimationFrame(step);
    }

    const sync = () => {
      stop();
      if (inView && visible) schedule(Math.max(1000, COMET_FIRST_MS - (performance.now() - mountedAt)));
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

  return (
    <div ref={rootRef} className={`relative ${className}`} key={String(reduce)}>
      <svg
        role="img"
        aria-label={heroCopy.mapLabel}
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full overflow-visible"
      >
        <path d={DOTS_PATH} className="fill-primary/15" />

        <defs>
          {ARCS.map((arc, i) => (
            <mask key={i} id={`route-arc-mask-${i}`} maskUnits="userSpaceOnUse" x={-50} y={-100} width={W + 100} height={H + 200}>
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
            className="stroke-primary/55"
            mask={`url(#route-arc-mask-${i})`}
          />
        ))}

        {/* Hidden path the comet follows. */}
        <path ref={routeRef} d={FULL_ROUTE} fill="none" stroke="none" />

        {STOPS.map((stop, i) =>
          stop.current ? (
            <g key={stop.city}>
              <motion.circle
                cx={stop.x}
                cy={stop.y}
                r={9}
                fill="none"
                strokeWidth={1.25}
                className="stroke-accent/30 [transform-box:fill-box] [transform-origin:center]"
                {...pop(i)}
              />
              <circle
                ref={bostonPulseRef}
                cx={stop.x}
                cy={stop.y}
                r={5}
                className="fill-accent opacity-0 [transform-box:fill-box] [transform-origin:center]"
              />
              <motion.circle
                cx={stop.x}
                cy={stop.y}
                r={5}
                className="fill-accent [transform-box:fill-box] [transform-origin:center]"
                {...pop(i)}
              />
            </g>
          ) : (
            <motion.circle
              key={stop.city}
              cx={stop.x}
              cy={stop.y}
              r={4}
              className="fill-primary [transform-box:fill-box] [transform-origin:center]"
              {...pop(i)}
            />
          ),
        )}

        {/* The comet: head + fading tail. Hidden between trips. */}
        <g ref={cometRef} opacity={0} aria-hidden>
          {[0, ...TAIL].map((_, k) => (
            <circle key={k} r={k === 0 ? 4 : 3.4 - k * 0.5} className="fill-accent" opacity={k === 0 ? 1 : 0.55 - k * 0.1} />
          ))}
        </g>
      </svg>

      {/* Labels are HTML so they stay crisp and a readable size at any map width. */}
      {STOPS.map((stop, i) => (
        <motion.div
          key={stop.city}
          aria-hidden
          className="pointer-events-none absolute h-0 w-0"
          style={{ left: `${(stop.x / W) * 100}%`, top: `${(stop.y / H) * 100}%` }}
          {...fade(i)}
        >
          <div className={`absolute w-max ${LABEL_PLACEMENT[stop.city] ?? "left-[10px] top-[10px]"}`}>
            <p className="text-[0.62rem] font-medium uppercase leading-tight tracking-[0.18em] text-primary-soft">
              {stop.label}
            </p>
            <p className={`text-[0.62rem] leading-tight ${stop.current ? "text-primary" : "text-primary-soft"}`}>
              {stop.note}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
