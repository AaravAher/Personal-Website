"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/ui/usePrefersReducedMotion";

const FLAP_CHARS = "ABCDEFGHJKLNOPQRSTUVXYZ0123456789&";
/** Narrow finals (i, l, 1, punctuation…) cycle through narrow glyphs so the noise fits their cell. */
const NARROW_FINALS = "iIlj1!|.,:;·'’()frt";
const NARROW_CHARS = "I1·,:";
const STEP_MS = 60;
const MIN_STEPS = 8;
const MAX_STEPS = 14;
/** Characters settle left to right, 35ms apart (compressed for long values, so
    the whole strip still settles in ~2.2s). */
const CHAR_STAGGER_MS = 35;
const MAX_TOTAL_STAGGER_MS = 700;

/** Small deterministic PRNG, so a given cell always flips through the same letters. */
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

const isSpace = (ch: string) => /\s/.test(ch);

type Cell = { char: string; step: number; flipping: boolean };

type Plan = {
  start: number;
  /** Per cell: delay (ms) and the letters it cycles through before landing. */
  cells: ({ delay: number; seq: string[] } | null)[];
};

function makePlan(text: string, indices: number[], seed: number, minSteps = MIN_STEPS): Plan {
  const stagger = Math.min(CHAR_STAGGER_MS, MAX_TOTAL_STAGGER_MS / Math.max(1, indices.length - 1));
  const cells: Plan["cells"] = Array.from({ length: text.length }, () => null);
  indices.forEach((i, order) => {
    const steps = minSteps + Math.floor(rand(seed + i) * (MAX_STEPS - minSteps + 1));
    const pool = NARROW_FINALS.includes(text[i]) ? NARROW_CHARS : FLAP_CHARS;
    const seq = Array.from({ length: steps }, (_, k) => {
      return pool[Math.floor(rand(seed * 31 + i * 7 + k) * pool.length)];
    });
    cells[i] = { delay: order * stagger, seq };
  });
  return { start: performance.now(), cells };
}

/**
 * Text that flips into place like a departures board. Each character sits in
 * a cell locked to its final glyph's width (no layout shift); the visible
 * character cycles a few random letters, folding its top half down each step.
 * Runs once after `startDelay` ms; afterwards, when `text` changes, only the
 * changed characters flap (the clock). Screen readers get the plain text.
 */
export function SplitFlap({
  text,
  startDelay = 0,
  seed = 1,
  className = "",
}: {
  text: string;
  startDelay?: number;
  seed?: number;
  className?: string;
}) {
  const reduce = usePrefersReducedMotion();
  const [cells, setCells] = useState<Cell[] | null>(null);
  const planRef = useRef<Plan | null>(null);
  const frameRef = useRef(0);
  const textRef = useRef(text);
  const prevTextRef = useRef(text);
  const loadedRef = useRef(false);

  // One animation loop: work out every cell's current letter from elapsed time.
  const run = (plan: Plan) => {
    planRef.current = plan;
    cancelAnimationFrame(frameRef.current);
    const tick = (now: number) => {
      const target = textRef.current;
      const elapsed = now - plan.start;
      let busy = false;
      const next = [...target].map((finalChar, i): Cell => {
        const p = plan.cells[i];
        if (!p || isSpace(finalChar)) return { char: finalChar, step: 0, flipping: false };
        const local = elapsed - p.delay;
        if (local < 0) {
          busy = true;
          // Not started yet: first letter of the sequence, still.
          return { char: p.seq[0], step: 0, flipping: false };
        }
        const step = Math.floor(local / STEP_MS);
        if (step >= p.seq.length) return { char: finalChar, step: p.seq.length, flipping: false };
        busy = true;
        return { char: p.seq[step], step, flipping: true };
      });
      setCells(next);
      if (busy) frameRef.current = requestAnimationFrame(tick);
      else setCells(null);
    };
    frameRef.current = requestAnimationFrame(tick);
  };

  // Load animation, once, after the delay.
  useEffect(() => {
    if (reduce || loadedRef.current) return;
    const timer = window.setTimeout(() => {
      loadedRef.current = true;
      const t = textRef.current;
      const all = [...t].map((ch, i) => (isSpace(ch) ? -1 : i)).filter((i) => i >= 0);
      run(makePlan(t, all, seed));
    }, startDelay);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frameRef.current);
    };
    // The load animation is scheduled once per mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  // Later text changes (the clock ticking over): flap only what changed.
  useEffect(() => {
    const prev = prevTextRef.current;
    textRef.current = text;
    prevTextRef.current = text;
    if (reduce || !loadedRef.current || prev === text) return;
    const changed = [...text]
      .map((ch, i) => (ch !== prev[i] && !isSpace(ch) ? i : -1))
      .filter((i) => i >= 0);
    if (changed.length) run(makePlan(text, changed, seed + text.length));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, reduce]);

  useEffect(() => () => cancelAnimationFrame(frameRef.current), []);

  // Render words as unbreakable groups so lines only wrap at real spaces.
  const shown: Cell[] = cells ?? [...text].map((char) => ({ char, step: 0, flipping: false }));
  const words: { cells: { cell: Cell; final: string; i: number }[]; space: boolean }[] = [];
  [...text].forEach((final, i) => {
    const cell = shown[i] ?? { char: final, step: 0, flipping: false };
    const space = isSpace(final) && final !== " ";
    const last = words[words.length - 1];
    if (!last || last.space !== space) words.push({ cells: [], space });
    words[words.length - 1].cells.push({ cell, final, i });
  });

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, w) =>
          word.space ? (
            <span key={w}>{word.cells.map((c) => c.final).join("")}</span>
          ) : (
            <span key={w} className="inline-block whitespace-nowrap">
              {word.cells.map(({ cell, final, i }) => (
                <span key={i} className="relative inline-block">
                  {/* Invisible final glyph fixes the cell's size. */}
                  <span className="invisible">{final}</span>
                  {cell.flipping ? (
                    <>
                      <span className="absolute inset-0 text-center [clip-path:inset(50%_0_0_0)]">
                        {cell.char}
                      </span>
                      <span
                        key={cell.step}
                        className="absolute inset-0 text-center [clip-path:inset(0_0_50%_0)] animate-[flap-top_60ms_linear]"
                      >
                        {cell.char}
                      </span>
                      <span className="absolute inset-x-0 top-1/2 h-px bg-primary/15" />
                    </>
                  ) : (
                    // A stand-in letter is clipped to the cell, like a real board.
                    // (clip-path, not overflow: overflow would move the baseline.)
                    <span className={`absolute inset-0 text-center ${cell.char !== final ? "[clip-path:inset(0)]" : ""}`}>
                      {cell.char}
                    </span>
                  )}
                </span>
              ))}
            </span>
          ),
        )}
      </span>
    </span>
  );
}
