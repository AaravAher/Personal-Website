"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { experienceSection, otherExperience } from "@/content/site";
import { usePrefersReducedMotion } from "@/components/ui/usePrefersReducedMotion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { FlipCard } from "./FlipCard";

const FIRST_PEEK = 600;
const STAGGER = 1500;
const CYCLE = 4500;
const JITTER = 400;

export function OtherExperience() {
  const reduce = usePrefersReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  // Once the visitor flips any card, idle hints stop for the rest of the visit.
  const [hasFlipped, setHasFlipped] = useState(false);
  const [peekSignals, setPeekSignals] = useState(() => otherExperience.map(() => 0));

  const running = inView && tabVisible && !hasFlipped && !reduce;

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.4,
    });
    io.observe(el);
    const onVisibility = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // One scheduler for all cards, so peeks are always staggered, never simultaneous.
  useEffect(() => {
    if (!running) return;
    const timers = new Set<number>();
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        fn();
      }, ms);
      timers.add(id);
    };
    const cycle = () => {
      otherExperience.forEach((_, i) =>
        later(
          () => setPeekSignals((s) => s.map((n, j) => (j === i ? n + 1 : n))),
          i * STAGGER,
        ),
      );
      later(cycle, CYCLE + (Math.random() * 2 - 1) * JITTER);
    };
    later(cycle, FIRST_PEEK);
    return () => timers.forEach(clearTimeout);
  }, [running]);

  const onFlip = useCallback(() => setHasFlipped(true), []);

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="bg-base-deep py-24 sm:py-32"
    >
      <Container>
        <Reveal>
          <SectionHeading
            id="experience-heading"
            index="03"
            eyebrow={experienceSection.eyebrow}
            title={experienceSection.title}
          />
        </Reveal>
        <Reveal delay={0.05}>
          <div
            ref={gridRef}
            className="grid max-w-[1064px] grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8"
          >
            {otherExperience.map((item, i) => (
              <FlipCard
                key={item.slug}
                item={item}
                peekSignal={peekSignals[i]}
                idleAllowed={running}
                breathDelay={i * 1.8}
                onFlip={onFlip}
              />
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
