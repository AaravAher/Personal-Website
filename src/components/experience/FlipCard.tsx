"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { RotateCw } from "lucide-react";
import { experienceSection, type ExperienceCard } from "@/content/site";
import { usePrefersReducedMotion } from "@/components/ui/usePrefersReducedMotion";

const canHover = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

type FlipCardProps = {
  item: ExperienceCard;
  /** Increments each time the section scheduler wants this card to peek. */
  peekSignal: number;
  /** In view, tab visible, not yet flipped by the visitor, motion allowed. */
  idleAllowed: boolean;
  /** Offsets the breathing loop so the two cards don't move in sync. */
  breathDelay: number;
  onFlip: () => void;
};

/**
 * Two-faced card. Hover flips it on mouse devices, tap toggles on touch,
 * Enter/Space toggles from the keyboard. The idle "peek" and "breathing"
 * run on wrappers separate from the flip transform so they never conflict.
 */
export function FlipCard({ item, peekSignal, idleAllowed, breathDelay, onFlip }: FlipCardProps) {
  const reduce = usePrefersReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [peeking, setPeeking] = useState(false);
  const lastPointer = useRef("mouse");
  const peekRotate = useMotionValue(0);

  const busy = hovered || focused || flipped;
  const idle = idleAllowed && !busy && !reduce;

  const setFlip = (value: boolean) => {
    setFlipped(value);
    if (value) onFlip();
  };

  // Peek: a small springy partial turn that shows a sliver of the navy plate.
  useEffect(() => {
    if (!peekSignal || !idle) return;
    const controls = animate(peekRotate, [0, 14, -2.5, 0], {
      duration: 0.9,
      times: [0, 0.4, 0.72, 1],
      ease: ["easeOut", "easeInOut", "easeOut"],
      onPlay: () => setPeeking(true),
      onComplete: () => setPeeking(false),
      onStop: () => setPeeking(false),
    });
    return () => controls.stop();
    // Only a new signal should start a peek.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peekSignal]);

  // A real hover, focus or flip cancels any peek in progress (starting a new
  // animation on the same value stops the peek, which clears `peeking`).
  useEffect(() => {
    if (busy) animate(peekRotate, 0, { duration: 0.15 });
  }, [busy, peekRotate]);

  const faceBase =
    "absolute inset-0 flex flex-col rounded-lg p-5 sm:p-6 md:p-7 [backface-visibility:hidden]";
  const fade = "transition-opacity duration-200";

  return (
    <motion.div
      className="relative h-[320px] [perspective:1400px] md:h-[300px]"
      animate={idle ? { y: [0, -2.5, 0] } : { y: 0 }}
      transition={
        idle
          ? { duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: breathDelay }
          : { duration: 0.3 }
      }
    >
      {/* Navy plate behind the card: revealed by the peek, or offset as a
          static stacked edge under reduced motion. */}
      <span
        aria-hidden
        className={`absolute inset-px rounded-lg bg-primary ${fade} ${
          reduce ? "translate-x-1 translate-y-1" : busy ? "opacity-0" : ""
        }`}
      />

      <motion.div className="relative h-full origin-left" style={{ rotateY: peekRotate }}>
        <button
          type="button"
          aria-pressed={flipped}
          className="group relative block h-full w-full rounded-lg text-left [perspective:1400px]"
          onPointerDown={(e) => (lastPointer.current = e.pointerType)}
          onPointerEnter={(e) => {
            if (e.pointerType !== "mouse" || !canHover()) return;
            setHovered(true);
            setFlip(true);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType !== "mouse" || !canHover()) return;
            setHovered(false);
            setFlipped(false);
          }}
          onClick={(e) => {
            // Mouse clicks on hover devices are already handled by hover.
            // detail === 0 means the click came from Enter/Space.
            if (e.detail === 0 || lastPointer.current !== "mouse" || !canHover()) {
              setFlip(!flipped);
            }
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          <span
            className="relative block h-full w-full transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d]"
            style={{ transform: reduce ? "none" : `rotateY(${flipped ? 180 : 0}deg)` }}
          >
            {/* Front */}
            <span
              aria-hidden={flipped}
              className={`${faceBase} border border-primary/15 bg-base ${
                reduce ? `${fade} ${flipped ? "opacity-0" : "opacity-100"}` : ""
              }`}
            >
              <span className="block font-serif text-4xl leading-[1.05] tracking-tight text-primary sm:text-[2.75rem]">
                {item.company}
              </span>
              <span className="mt-4 block text-[0.95rem] leading-snug text-primary">
                {item.role}
              </span>
              <span className="mt-1 block text-sm text-primary-soft">
                {item.location} · {item.dates}
              </span>
              <span className="mt-auto flex items-center justify-end gap-2 text-xs text-primary-soft">
                {experienceSection.flipHint}
                <RotateCw
                  size={14}
                  aria-hidden
                  className={`transition-colors duration-300 group-hover:text-accent ${
                    peeking ? "animate-[spin_0.8s_ease-in-out] text-accent" : ""
                  }`}
                />
              </span>
            </span>

            {/* Back */}
            <span
              aria-hidden={!flipped}
              className={`${faceBase} bg-primary text-cream ${
                reduce
                  ? `${fade} ${flipped ? "opacity-100" : "opacity-0"}`
                  : "[transform:rotateY(180deg)]"
              }`}
            >
              <span className="block font-serif text-5xl leading-none tracking-tight">
                {item.highlight.value}
              </span>
              <span className="mt-2 block text-[0.65rem] font-medium uppercase tracking-[0.2em] text-cream/75">
                {item.highlight.label}
              </span>
              <span className="mt-4 block text-[0.8125rem] leading-relaxed text-cream/90 lg:text-sm">
                {item.summary}
              </span>
              <span className="mt-auto block border-t border-cream/15 pt-3 text-xs leading-snug text-cream/70">
                {item.company} · {item.role}
              </span>
            </span>
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}
