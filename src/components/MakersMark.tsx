"use client";

import { useEffect, useId, useRef, useState } from "react";
import { makersMark, personal } from "@/content/site";

const R = 46; // radius of the text path, in a 112-unit viewBox
const CIRCUMFERENCE = 2 * Math.PI * R;

const canHover = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * A watchmaker-style seal: "designed · built · written by" running around a
 * circle, the AA monogram still in the centre. The ring turns slowly; hover
 * or focus (tap on touch) pauses it, turns it teal and shows the tooltip.
 * Motion is CSS-only, so reduced motion simply disables the animations.
 */
/** "sm": 84px. "fluid": 84px, growing to 112px from lg up (next to the name). */
export function MakersMark({ size, className = "" }: { size: "sm" | "fluid"; className?: string }) {
  const pathId = useId();
  const [open, setOpen] = useState(false);
  const lastPointer = useRef("mouse");
  const ref = useRef<HTMLButtonElement>(null);
  const textRef = useRef<SVGTextElement>(null);

  // Spread the ring text so it closes the loop exactly. (Chrome ignores
  // textLength on <textPath>, so letter-spacing is measured and set instead.)
  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      const text = textRef.current;
      const path = text?.querySelector("textPath");
      if (cancelled || !text || !path) return;
      text.style.letterSpacing = "0px";
      const natural = path.getComputedTextLength();
      const chars = [...makersMark.ring].length;
      text.style.letterSpacing = `${(CIRCUMFERENCE - natural) / chars}px`;
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
      className={`group relative block shrink-0 rounded-full ${
        size === "fluid" ? "h-[84px] w-[84px] lg:h-28 lg:w-28" : "h-[84px] w-[84px]"
      } ${className}`}
    >
      {/* Stamp-in, after the name has animated. */}
      <span className="relative block h-full w-full animate-[stamp-in_250ms_ease-out_450ms_both] motion-reduce:animate-none">
        <svg
          aria-hidden
          viewBox="0 0 112 112"
          className={`absolute inset-0 h-full w-full text-primary transition-colors duration-300 animate-[spin_40s_linear_infinite] motion-reduce:animate-none ${active} ${paused}`}
        >
          <defs>
            <path
              id={pathId}
              d={`M 56,56 m -${R},0 a ${R},${R} 0 1,1 ${R * 2},0 a ${R},${R} 0 1,1 -${R * 2},0`}
            />
          </defs>
          {/* 1.5 letter-spacing is the pre-measurement estimate for Inter at 7.5. */}
          <text
            ref={textRef}
            className="fill-current font-sans text-[7.5px] font-medium uppercase"
            style={{ letterSpacing: "1.5px" }}
          >
            <textPath href={`#${pathId}`}>{makersMark.ring}</textPath>
          </text>
        </svg>
        <svg aria-hidden viewBox="0 0 112 112" className="absolute inset-0 h-full w-full">
          <circle cx="56" cy="56" r="36" fill="none" className="stroke-primary/25" strokeWidth="0.75" />
        </svg>
        <span
          aria-hidden
          className={`absolute inset-0 flex items-center justify-center font-serif leading-none tracking-tight text-primary ${
            size === "fluid" ? "text-[1.3rem] lg:text-[1.75rem]" : "text-[1.3rem]"
          }`}
        >
          {personal.monogram}
          <span className="text-accent">.</span>
        </span>
      </span>

      <span
        aria-hidden
        className={`pointer-events-none absolute top-full z-10 mt-3 w-56 rounded-md bg-primary px-3 py-2 text-left text-xs leading-snug text-cream opacity-0 shadow-lg shadow-primary/20 transition-opacity duration-200 can-hover:group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[open=true]:opacity-100 ${
          size === "fluid" ? "left-1/2 -translate-x-1/2" : "left-0"
        }`}
      >
        {makersMark.tooltip}
      </span>
    </button>
  );
}
