"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { heroCopy } from "@/content/site";
import { usePrefersReducedMotion } from "@/components/ui/usePrefersReducedMotion";
import { STATS_SETTLED_MS } from "./HeroStats";
import { DOTS_PATH, LEGS, MAP_H as H, MAP_W as W, STOPS } from "./routeGeometry";

/*
 * The map at rest shows only land and the four cities. Each flight draws the
 * route leg by leg behind the plane; the previous leg fades as the next one
 * starts, and the last leg lingers after the landing, then fades.
 */
const CITIES_POP_AT = 1.2; // s after mount: cities appear with the stats
const FIRST_FLIGHT_MS = STATS_SETTLED_MS + 600;
const FLIGHT_EVERY_MS = [14_000, 16_000] as const; // start to start
// Leg duration grows with its length, so speed stays roughly constant
// (≈2.2s / 1.7s / 1.3s for the current route; the whole flight ≈5.5s).
const LEG_BASE_MS = 825;
const LEG_MS_PER_UNIT = 1.425;
const STOP_PAUSE_MS = 180; // brief pause at each intermediate stop
const HANDOFF_MS = 450; // previous leg fades out as the next starts
const LANDING_MS = 300; // plane shrinks into Boston over the final 300ms
const LINGER_MS = 1500; // last leg stays visible after landing…
const FADE_MS = 600; // …then fades, leaving just the cities
const CONTRAIL = 55; // viewBox units behind the plane (~50px on wide screens)

// Sizes in viewBox units. Boston is ~15% bigger than the other cities.
const CITY_R = 4;
const CURRENT_R = 5.75;
const CURRENT_HALO_R = 10.35;
const LAST_LEG = LEGS.length - 1;

const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
// The last leg lingers longer at the end: a softer landing.
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

type Segment =
  | { kind: "fly"; leg: number; start: number; dur: number }
  | { kind: "pause"; leg: number; start: number; dur: number }
  | { kind: "linger"; start: number; dur: number }
  | { kind: "fade"; start: number; dur: number };

/** The whole flight as a timeline of segments (ms from take-off). */
function buildTimeline(legLengths: number[]) {
  const segments: Segment[] = [];
  const legStart: number[] = [];
  let t = 0;
  legLengths.forEach((len, leg) => {
    const dur = LEG_BASE_MS + len * LEG_MS_PER_UNIT;
    legStart.push(t);
    segments.push({ kind: "fly", leg, start: t, dur });
    t += dur;
    if (leg < LAST_LEG) {
      segments.push({ kind: "pause", leg, start: t, dur: STOP_PAUSE_MS });
      t += STOP_PAUSE_MS;
    }
  });
  const landedAt = t;
  segments.push({ kind: "linger", start: t, dur: LINGER_MS });
  t += LINGER_MS;
  segments.push({ kind: "fade", start: t, dur: FADE_MS });
  t += FADE_MS;
  return { segments, legStart, landedAt, total: t };
}

/**
 * Where each label sits relative to its dot, chosen so labels clear every leg,
 * each other and the map's edges (Bay Area and Mumbai sit near the sides).
 */
const LABEL_PLACEMENT: Record<string, string> = {
  Mumbai: "right-[-6px] top-[10px] text-right",
  // Above, shifted right: the legs to and from Glasgow run up and to the left.
  Glasgow: "left-[-4px] bottom-[10px] text-left",
  Boston: "left-[14px] top-[-2px] text-left",
  "Bay Area": "left-[-6px] top-[10px] text-left",
};

/** Top-down plane silhouette, nose pointing +x, ~18 units long. */
const PLANE =
  "M9,0 L3,-1.3 L-1,-7.5 L-3.2,-7.5 L-1.3,-1.5 L-6,-1.6 L-7.8,-4.2 L-9.2,-4.2 L-8,0 L-9.2,4.2 L-7.8,4.2 L-6,1.6 L-1.3,1.5 L-3.2,7.5 L-1,7.5 L3,1.3 Z";

const ARRIVAL_PULSE = "animate-[pulse-ring_1.4s_ease-out]";
const LABEL_BRIGHTEN = "animate-[label-brighten_1.2s_ease-out]";
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
  const legRefs = useRef<(SVGPathElement | null)[]>([]);
  const legMaskRefs = useRef<(SVGPathElement | null)[]>([]);
  const planeRef = useRef<SVGGElement>(null);
  const contrailRef = useRef<SVGPathElement>(null);
  const gradientRef = useRef<SVGLinearGradientElement>(null);
  const pulseRefs = useRef<(SVGCircleElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const landedRef = useRef<SVGCircleElement>(null);
  const nowRef = useRef<HTMLSpanElement>(null);

  // Flights: timeline-driven, so pausing (off-screen or hidden tab) simply
  // stops the clock and resuming continues from the exact same moment.
  useEffect(() => {
    if (reduce) return;
    const root = rootRef.current;
    const plane = planeRef.current;
    const contrail = contrailRef.current;
    const gradient = gradientRef.current;
    const legs = legRefs.current;
    const masks = legMaskRefs.current;
    if (!root || !plane || !contrail || !gradient || legs.some((l) => !l) || masks.some((m) => !m)) return;

    const lengths = legs.map((l) => l!.getTotalLength());
    const { segments, legStart, landedAt, total } = buildTimeline(lengths);

    const setLeg = (i: number, reveal: number, opacity: number) => {
      masks[i]!.setAttribute("stroke-dashoffset", String(1 - reveal));
      legs[i]!.setAttribute("opacity", String(opacity));
    };
    const hideAll = () => {
      legs.forEach((_, i) => setLeg(i, 0, 0));
      plane.setAttribute("opacity", "0");
      contrail.setAttribute("opacity", "0");
    };

    const placePlane = (leg: number, at: number, scale: number) => {
      const path = legs[leg]!;
      const len = lengths[leg];
      const pt = path.getPointAtLength(at);
      const ahead = path.getPointAtLength(Math.min(len, at + 1));
      const behind = path.getPointAtLength(Math.max(0, at - 1));
      const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
      plane.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${angle}) scale(${scale})`);
      plane.setAttribute("opacity", String(scale));

      // Contrail: the last CONTRAIL units of this leg, fading toward the tail.
      const tailAt = Math.max(0, at - CONTRAIL);
      const tail = path.getPointAtLength(tailAt);
      contrail.setAttribute("d", LEGS[leg]);
      contrail.setAttribute("stroke-dasharray", `${at - tailAt} ${len * 2}`);
      contrail.setAttribute("stroke-dashoffset", String(-tailAt));
      contrail.setAttribute("opacity", String(scale));
      gradient.setAttribute("x1", String(tail.x));
      gradient.setAttribute("y1", String(tail.y));
      gradient.setAttribute("x2", String(pt.x));
      gradient.setAttribute("y2", String(pt.y));
    };

    /** Draw the flight as it looks `e` ms after take-off. */
    const render = (e: number) => {
      const seg = segments.findLast((s) => s.start <= e) ?? segments[0];
      const leg = seg.kind === "fly" || seg.kind === "pause" ? seg.leg : LAST_LEG;

      LEGS.forEach((_, i) => {
        if (i > leg) return setLeg(i, 0, 0);
        if (i < leg - 1) return setLeg(i, 1, 0);
        if (i === leg - 1) {
          // Handoff: the previous leg fades as this one starts drawing.
          return setLeg(i, 1, Math.max(0, 1 - (e - legStart[leg]) / HANDOFF_MS));
        }
        // The current leg: revealed up to the plane, then kept until the fade.
        const reveal = seg.kind === "fly" ? progressOf(seg, e) : 1;
        const opacity = seg.kind === "fade" ? Math.max(0, 1 - (e - seg.start) / seg.dur) : 1;
        setLeg(i, reveal, opacity);
      });

      if (seg.kind === "fly") {
        const p = progressOf(seg, e);
        const intoLanding = seg.leg === LAST_LEG ? (seg.start + seg.dur - e) / LANDING_MS : 1;
        placePlane(seg.leg, p * lengths[seg.leg], Math.max(0, Math.min(1, intoLanding)));
      } else if (seg.kind === "pause") {
        placePlane(seg.leg, lengths[seg.leg], 1);
      } else {
        plane.setAttribute("opacity", "0");
        contrail.setAttribute("opacity", "0");
      }
    };
    function progressOf(seg: Segment, e: number) {
      if (seg.kind !== "fly") return 1;
      const t = Math.min(1, Math.max(0, (e - seg.start) / seg.dur));
      return seg.leg === LAST_LEG ? easeInOutCubic(t) : easeInOutSine(t);
    }

    // One-off moments: arrivals at intermediate stops, and the landing.
    const moments = [
      ...legStart.slice(1).map((start, i) => ({
        at: start - STOP_PAUSE_MS,
        run: () => {
          replay(pulseRefs.current[i + 1], ARRIVAL_PULSE);
          replay(labelRefs.current[i + 1], LABEL_BRIGHTEN);
        },
      })),
      {
        at: landedAt,
        run: () => {
          replay(landedRef.current, LANDED_PULSE);
          replay(nowRef.current, NOW_FLASH);
        },
      },
    ];

    // Clock state survives pauses.
    let active = false;
    let inView = false;
    let visible = document.visibilityState === "visible";
    let flying = false;
    let elapsed = 0; // ms into the current flight
    let fired = 0; // moments already run this flight
    let waitLeft = FIRST_FLIGHT_MS; // ms until the next take-off
    let waitFrom = 0;
    let lastFrame = 0;
    let frame = 0;
    let timer: number | undefined;

    const tick = (now: number) => {
      elapsed += now - lastFrame;
      lastFrame = now;
      while (fired < moments.length && elapsed >= moments[fired].at) moments[fired++].run();
      if (elapsed >= total) {
        hideAll();
        flying = false;
        const every = FLIGHT_EVERY_MS[0] + Math.random() * (FLIGHT_EVERY_MS[1] - FLIGHT_EVERY_MS[0]);
        waitLeft = Math.max(0, every - total);
        waitForTakeoff();
        return;
      }
      render(elapsed);
      frame = requestAnimationFrame(tick);
    };
    const takeOff = () => {
      flying = true;
      elapsed = 0;
      fired = 0;
      fly();
    };
    const fly = () => {
      lastFrame = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const waitForTakeoff = () => {
      waitFrom = performance.now();
      timer = window.setTimeout(takeOff, waitLeft);
    };

    const sync = () => {
      const next = inView && visible;
      if (next === active) return;
      active = next;
      if (active) {
        if (flying) fly();
        else waitForTakeoff();
      } else {
        cancelAnimationFrame(frame);
        window.clearTimeout(timer);
        if (!flying) waitLeft = Math.max(0, waitLeft - (performance.now() - waitFrom));
      }
    };

    hideAll();
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
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
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
          transition: { delay: CITIES_POP_AT + i * 0.1, type: "spring" as const, stiffness: 520, damping: 16 },
        };
  const fade = (i: number) =>
    reduce
      ? { initial: false as const }
      : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: CITIES_POP_AT + i * 0.1 + 0.1, duration: 0.35 } };

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

        {reduce ? (
          // Reduced motion: the whole story, static and quiet.
          LEGS.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              strokeWidth={2}
              strokeDasharray="3 9"
              strokeLinecap="round"
              className="stroke-primary/35"
            />
          ))
        ) : (
          <>
            <defs>
              {/* Each leg is revealed up to the plane: pathLength 1, so the
                  dash offset is simply 1 − progress along that same path. */}
              {LEGS.map((d, i) => (
                <mask key={i} id={`route-leg-mask-${i}`} maskUnits="userSpaceOnUse" x={-50} y={-150} width={W + 100} height={H + 250}>
                  <path
                    ref={(el) => {
                      legMaskRefs.current[i] = el;
                    }}
                    d={d}
                    fill="none"
                    stroke="white"
                    strokeWidth={12}
                    pathLength={1}
                    strokeDasharray="1 1"
                    strokeDashoffset={1}
                  />
                </mask>
              ))}
              <linearGradient ref={gradientRef} id="route-contrail" gradientUnits="userSpaceOnUse">
                <stop offset="0" style={{ stopColor: "var(--color-accent)", stopOpacity: 0 }} />
                <stop offset="1" style={{ stopColor: "var(--color-accent)", stopOpacity: 0.8 }} />
              </linearGradient>
            </defs>

            {/* Dashed legs: invisible at rest, drawn behind the plane. */}
            {LEGS.map((d, i) => (
              <path
                key={i}
                ref={(el) => {
                  legRefs.current[i] = el;
                }}
                d={d}
                fill="none"
                strokeWidth={2}
                strokeDasharray="3 9"
                strokeLinecap="round"
                className="stroke-primary/[0.62]"
                mask={`url(#route-leg-mask-${i})`}
                opacity={0}
              />
            ))}

            <path
              ref={contrailRef}
              d={LEGS[0]}
              fill="none"
              stroke="url(#route-contrail)"
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0}
            />
          </>
        )}

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
                style={reduce ? undefined : { animationDelay: `${CITIES_POP_AT + 0.6}s` }}
              />
              {/* One-shot "landed" pulse, wider than the idle one. */}
              <circle ref={landedRef} cx={stop.x} cy={stop.y} r={CURRENT_R} className={`fill-accent opacity-0 ${fromCentre}`} />
              <motion.circle cx={stop.x} cy={stop.y} r={CURRENT_R} className={`fill-accent ${fromCentre}`} {...pop(i)} />
            </g>
          ) : (
            <g key={stop.city}>
              {/* Pulses once as the plane arrives. */}
              <circle
                ref={(el) => {
                  pulseRefs.current[i] = el;
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
        {!reduce && (
          <g ref={planeRef} opacity={0} aria-hidden>
            <path d={PLANE} className="fill-primary" />
          </g>
        )}
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
            <div
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              className={`absolute w-max text-primary-soft ${LABEL_PLACEMENT[stop.city] ?? "left-[10px] top-[10px]"}`}
            >
              <p className="text-[clamp(10px,1.95cqw,14px)] font-medium uppercase leading-tight tracking-[0.18em]">
                {stop.label}
              </p>
              <p className="text-[clamp(10px,1.8cqw,13px)] leading-tight">
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
