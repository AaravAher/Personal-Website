"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Media } from "@/content/site";
import { Picture } from "@/components/ui/Picture";
import { usePrefersReducedMotion } from "@/components/ui/usePrefersReducedMotion";

const DEFAULT_SLIDES = 24;
const pad = (n: number) => String(n).padStart(2, "0");

// All colours are tokens mixed with transparency: no new hues.
const VIGNETTE = {
  backgroundImage: [
    // Brighter centre, like the hot spot of a projector lamp…
    "radial-gradient(ellipse at 50% 45%, color-mix(in oklab, var(--color-base) 14%, transparent) 0%, transparent 55%)",
    // …dimming gently towards the corners.
    "radial-gradient(ellipse at center, transparent 58%, color-mix(in oklab, var(--color-primary) 22%, transparent) 100%)",
  ].join(", "),
};
// No projector beam: cream is already the lightest token and the page colour,
// so a "light" cone could only be drawn darker than the page, like a shadow.

/**
 * A slide on a pull-down projector screen: casing, screen surface, the
 * projected slide with a soft bloom and vignette, and a slide counter. When it
 * first scrolls into view the screen rolls down and the slide powers on (with
 * one tiny flicker). Reduced motion: shown fully, still.
 */
export function ProjectorSlide({ media, sizes }: { media: Media; sizes: string }) {
  const reduce = usePrefersReducedMotion();
  const total = media.slides ?? DEFAULT_SLIDES;
  // Watch the unclipped wrapper: the screen itself starts fully clipped, and a
  // fully clipped element never counts as "in view" (nor would its lazy image load).
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <span ref={ref} className="relative block" key={String(reduce)}>
      {/* Screen casing: slightly wider than the screen, rounded ends. */}
      <span aria-hidden className="relative z-10 mx-[-1.5%] block h-[11px] rounded-full bg-primary" />

      {/* The screen surface rolls down from the casing. */}
      <motion.span
        className="relative mx-[1.5%] block"
        {...(reduce
          ? { initial: false as const }
          : {
              initial: { clipPath: "inset(0 0 100% 0)" },
              animate: inView ? { clipPath: "inset(0 0 0% 0)" } : undefined,
              transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
            })}
      >
        <span className="relative block border border-t-0 border-b-[3px] border-primary/15 border-b-primary/35 bg-base-deep/50 px-[5%] pb-[7%] pt-[4%]">
          {/* The projected slide, with a barely-there keystone. */}
          <span className="block [perspective:1400px]">
            <motion.span
              className="relative block aspect-video origin-top overflow-hidden rounded-[2px] shadow-[0_0_26px_6px] shadow-base/95 [transform:rotateX(2.5deg)]"
              {...(reduce
                ? { initial: false as const }
                : {
                    initial: { opacity: 0, filter: "brightness(0)" },
                    animate: inView
                      ? {
                          opacity: [0, 1, 0.55, 1],
                          filter: ["brightness(0)", "brightness(1.08)", "brightness(0.7)", "brightness(1)"],
                        }
                      : undefined,
                    transition: { delay: 0.6, duration: 0.4, times: [0, 0.55, 0.62, 1] },
                  })}
            >
              {/* Eager: it must be ready before it "powers on". */}
              <Picture src={media.src} alt={media.alt} sizes={sizes} eager className="absolute inset-0 h-full w-full object-cover" />
              <span aria-hidden className="absolute inset-0" style={VIGNETTE} />
            </motion.span>
          </span>

          {/* Slide counter, on the screen surface outside the slide. */}
          <span
            aria-hidden
            className="absolute bottom-[2.2%] right-[5%] text-[10px] tabular-nums tracking-[0.12em] text-primary-soft"
          >
            {pad(1)} / {pad(total)}
          </span>
        </span>
        {/* Pull tab. */}
        <span aria-hidden className="mx-auto block h-[7px] w-[2px] bg-primary/35" />
        <span aria-hidden className="mx-auto block h-[5px] w-[14px] rounded-b-[3px] bg-primary/45" />
      </motion.span>

    </span>
  );
}
