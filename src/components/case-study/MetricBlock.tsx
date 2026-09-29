"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import type { Metric } from "@/content/site";

/** Splits "~100" / "50+" / "1,000+" into prefix, number and suffix. */
function parse(value: string) {
  const match = value.match(/^(\D*)([\d,]*\.?\d+)(\D*)$/);
  if (!match) return null;
  const [, prefix, num, suffix] = match;
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  return { prefix, suffix, target: parseFloat(num.replace(/,/g, "")), decimals };
}

function format(n: number, decimals: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Large serif number with a label. Counts up once when scrolled into view;
 * renders the final value without JS or under reduced motion.
 */
export function MetricBlock({
  metric,
  headline = false,
  compact = false,
  className = "",
}: {
  metric: Metric;
  headline?: boolean;
  /** Smaller stat, for the Off the Clock chapters. */
  compact?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const parsed = useMemo(() => parse(metric.value), [metric.value]);
  const [display, setDisplay] = useState(metric.value);
  const armed = useRef(false);

  // If the metric starts off-screen, reset it to zero so it can count up.
  useEffect(() => {
    if (!parsed || reduce || !ref.current) return;
    const top = ref.current.getBoundingClientRect().top;
    if (top > window.innerHeight) {
      armed.current = true;
      setDisplay(`${parsed.prefix}${format(0, parsed.decimals)}${parsed.suffix}`);
    }
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!inView || !armed.current || !parsed) return;
    armed.current = false;
    const controls = animate(0, parsed.target, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) =>
        setDisplay(`${parsed.prefix}${format(v, parsed.decimals)}${parsed.suffix}`),
      onComplete: () => setDisplay(metric.value),
    });
    return () => controls.stop();
  }, [inView, parsed, metric.value]);

  // dt comes first in the markup (valid <dl>); flex-col-reverse puts the number on top.
  return (
    <div ref={ref} className={`flex flex-col-reverse ${className}`}>
      <dt
        className={`mt-3 max-w-[16rem] text-primary-soft ${
          headline ? "text-sm sm:text-[1rem]" : "text-sm"
        }`}
      >
        {metric.label}
      </dt>
      <dd
        className={`font-serif leading-none tracking-tight text-primary tabular-nums ${
          compact ? "text-4xl sm:text-5xl" : headline ? "text-7xl sm:text-8xl" : "text-5xl sm:text-6xl"
        }`}
      >
        <span aria-hidden>{display}</span>
        <span className="sr-only">{metric.value}</span>
      </dd>
    </div>
  );
}
