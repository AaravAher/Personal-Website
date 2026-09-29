"use client";

import { useEffect, useRef, useState } from "react";
import { makersMark, personal } from "@/content/site";

/*
 * Geometry, in a 200 × 200 viewBox centred on (100, 100).
 * The ring text runs clockwise along a circle of radius 80, starting at
 * 12 o'clock. The inner ring (r 58) leaves ≥ 10 units below the letters.
 */
const R = 80;
const CIRCUMFERENCE = 2 * Math.PI * R; // ≈ 502.65
const FONT_SIZE = 13;
const RING_PATH = `M 100,${100 - R} a ${R},${R} 0 1,1 0,${R * 2} a ${R},${R} 0 1,1 0,-${R * 2}`;
// Fixed, valid ids (no useId colons/special characters), one per variant
// so the two instances never duplicate an id.
const pathId = (size: string) => `makers-mark-ring-${size}`;

/*
 * Inter 500 advance widths (em), measured from the site's font. Used to
 * compute the letter-spacing that makes the text close the loop exactly.
 * This is pure arithmetic at render time: no DOM measurement, so it can't
 * race font or CSS loading and can never produce negative spacing.
 */
const ADVANCE: Record<string, number> = {
  A: 0.709, B: 0.657, C: 0.734, D: 0.722, E: 0.603, F: 0.589, G: 0.748, H: 0.744,
  I: 0.273, J: 0.575, K: 0.688, L: 0.565, M: 0.913, N: 0.756, O: 0.767, P: 0.642,
  Q: 0.769, R: 0.648, S: 0.646, T: 0.653, U: 0.74, V: 0.709, W: 1.003, X: 0.701,
  Y: 0.696, Z: 0.641, "0": 0.645, "1": 0.415, "2": 0.616, "3": 0.627, "4": 0.656,
  "5": 0.603, "6": 0.63, "7": 0.571, "8": 0.629, "9": 0.63, " ": 0.266, "·": 0.303,
  "&": 0.653, "'": 0.313, "’": 0.277, ",": 0.303, ".": 0.303, "-": 0.463, "–": 0.5,
  "—": 1, ":": 0.303, "/": 0.37,
};
const FALLBACK_ADVANCE = 0.65;

function ringLetterSpacing(text: string) {
  const chars = [...text.toUpperCase()];
  const natural = chars.reduce((sum, ch) => sum + (ADVANCE[ch] ?? FALLBACK_ADVANCE), 0) * FONT_SIZE;
  // Spacing follows every glyph (including the last), so the loop closes.
  return Math.max(0, (CIRCUMFERENCE - natural) / chars.length);
}

const RING_SPACING = ringLetterSpacing(makersMark.ring);

const canHover = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const SIZES = {
  /** Beside the name: 104px on tablet widths, 128px from lg. */
  inline: "h-[104px] w-[104px] lg:h-32 lg:w-32",
  /** Below the buttons on narrow screens. */
  stacked: "h-24 w-24",
};

/**
 * A watchmaker-style seal: "designed · built · written by" running around a
 * circle, the AA monogram still in the centre. The ring turns slowly; hover
 * or focus (tap on touch) pauses it, turns it teal and shows the tooltip.
 * Motion is CSS-only, so reduced motion simply disables the animations.
 */
export function MakersMark({
  size,
  tooltipAlign = "center",
  className = "",
}: {
  size: keyof typeof SIZES;
  tooltipAlign?: "center" | "start";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const lastPointer = useRef("mouse");
  const ref = useRef<HTMLButtonElement>(null);

  // A tap outside closes a tooltip opened by tap.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Active = hover (mouse), keyboard focus, or opened by tap.
  const active =
    "can-hover:group-hover:text-accent group-focus-visible:text-accent group-data-[open=true]:text-accent";
  const paused =
    "can-hover:group-hover:[animation-play-state:paused] group-focus-visible:[animation-play-state:paused] group-data-[open=true]:[animation-play-state:paused]";

  return (
    <button
      ref={ref}
      type="button"
      aria-label={makersMark.tooltip}
      data-open={open}
      onPointerDown={(e) => (lastPointer.current = e.pointerType)}
      onClick={() => {
        // Hover already shows it for mice; taps and keyboard toggle it.
        if (lastPointer.current !== "mouse" || !canHover()) setOpen((o) => !o);
      }}
      onBlur={() => setOpen(false)}
      className={`group relative block shrink-0 rounded-full ${SIZES[size]} ${className}`}
    >
      {/* Stamp-in, after the name has animated. */}
      <span className="relative block h-full w-full animate-[stamp-in_250ms_ease-out_450ms_both] motion-reduce:animate-none">
        {/* The ring text is its own <svg> layer, rotated as a whole element around
            its centre (100, 100). Rotating the element rather than an inner <g>
            lets the browser composite the spin instead of repainting SVG every frame. */}
        <svg
          aria-hidden
          viewBox="0 0 200 200"
          className={`absolute inset-0 h-full w-full overflow-visible text-primary transition-colors duration-300 origin-center animate-[spin_40s_linear_infinite] motion-reduce:animate-none ${active} ${paused}`}
        >
          <defs>
            <path id={pathId(size)} d={RING_PATH} />
          </defs>
          <text
            fill="currentColor"
            fontSize={FONT_SIZE}
            fontWeight={500}
            letterSpacing={RING_SPACING}
            dominantBaseline="central"
            className="font-sans uppercase"
          >
            <textPath href={`#${pathId(size)}`}>{makersMark.ring}</textPath>
          </text>
        </svg>

        {/* Static inner ring. */}
        <svg aria-hidden viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
          <circle cx="100" cy="100" r="58" fill="none" strokeWidth="1.25" className="stroke-primary/25" />
        </svg>

        <span
          aria-hidden
          className={`absolute inset-0 flex items-center justify-center font-serif leading-none tracking-tight text-primary ${
            size === "inline" ? "text-[1.6rem] lg:text-[2rem]" : "text-[1.5rem]"
          }`}
        >
          {personal.monogram}
          <span className="text-accent">.</span>
        </span>
      </span>

      <span
        aria-hidden
        className={`pointer-events-none absolute top-full z-10 mt-3 w-56 rounded-md bg-primary px-3 py-2 text-left text-xs leading-snug text-cream opacity-0 shadow-lg shadow-primary/20 transition-opacity duration-200 can-hover:group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[open=true]:opacity-100 ${
          tooltipAlign === "center" ? "left-1/2 -translate-x-1/2" : "left-0"
        }`}
      >
        {makersMark.tooltip}
      </span>
    </button>
  );
}
