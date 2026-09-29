"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { languages, languagesSection } from "@/content/site";
import { usePrefersReducedMotion } from "@/components/ui/usePrefersReducedMotion";

const STEP_MS = 1600;

/** "More about me", cycling through the languages I speak. A short band between sections. */
export function LanguageInterlude() {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [active, setActive] = useState(0);

  // Loops only while the band is on screen.
  useEffect(() => {
    if (reduce || !inView) return;
    const timer = window.setInterval(() => setActive((i) => (i + 1) % languages.length), STEP_MS);
    return () => window.clearInterval(timer);
  }, [inView, reduce]);

  const english = languages[0];
  const current = languages[active];

  return (
    <section
      ref={ref}
      id="languages"
      aria-label={languagesSection.label}
      className="flex min-h-[40vh] items-center bg-base-deep py-20 lg:min-h-[45vh]"
    >
      <div className="mx-auto w-full max-w-[1200px] px-5 text-center sm:px-8">
        {reduce ? (
          // Reduced motion: every phrase at once, English large.
          <div>
            <p lang={english.lang} className="font-serif text-5xl leading-tight text-primary sm:text-7xl">
              {english.moreAboutMe}
            </p>
            <ul className="mt-6 flex flex-wrap items-baseline justify-center gap-x-8 gap-y-3">
              {languages.slice(1).map((l) => (
                <li key={l.lang} className="text-primary">
                  <span lang={l.lang} className="font-serif text-2xl">
                    {l.moreAboutMe}
                  </span>
                  <span className="ml-2 text-xs uppercase tracking-[0.2em] text-primary-soft">{l.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <h2 className="sr-only" lang={english.lang}>
              {english.moreAboutMe}
            </h2>
            {/* Fixed-height stage so the page never jumps between scripts. */}
            <div aria-hidden className="relative mx-auto h-[1.5em] text-[clamp(2.6rem,7vw,5.5rem)]">
              <AnimatePresence initial={false}>
                <motion.p
                  key={current.lang}
                  lang={current.lang}
                  className="absolute inset-x-0 top-0 font-serif leading-[1.4] text-primary"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {current.moreAboutMe}
                </motion.p>
              </AnimatePresence>
            </div>
            <ul aria-hidden className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
              {languages.map((l, i) => (
                <li
                  key={l.lang}
                  className={`border-b pb-1 text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
                    i === active ? "border-accent text-primary" : "border-transparent text-primary-soft"
                  }`}
                >
                  {l.name}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
