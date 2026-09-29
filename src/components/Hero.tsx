"use client";

import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowDown, Mail } from "lucide-react";
import { heroCopy, personal } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LinkedInIcon } from "@/components/ui/LinkedInIcon";
import { MakersMark } from "@/components/MakersMark";
import { HeroStats } from "@/components/hero/HeroStats";
import { RouteMap } from "@/components/hero/RouteMap";

/*
 * Load choreography (seconds):
 *   0.0  overline + name fade up
 *   0.45 seal stamps in (CSS, in MakersMark)
 *   0.6  tagline + buttons
 *   0.8  stats strip flaps in (~1.2s)
 *   1.4  map arcs draw, cities pop (done ~3.5s)
 *   6.0  comet loop begins
 */
const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Hero() {
  const [first, ...rest] = personal.name.split(" ");
  const sectionRef = useRef<HTMLElement>(null);

  // Freeze the hero's looping CSS animations (seal, pulses) while it's off
  // screen or the tab is hidden. Set on the DOM directly: no re-renders.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let inView = true;
    const apply = () => {
      const paused = !inView || document.visibilityState !== "visible";
      section.dataset.heroPaused = String(paused);
    };
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      apply();
    });
    io.observe(section);
    document.addEventListener("visibilitychange", apply);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", apply);
    };
  }, []);

  return (
    <motion.section
      ref={sectionRef}
      id="top"
      aria-label="Introduction"
      className="mt-[var(--nav-height)] flex min-h-[calc(100svh-var(--nav-height))] flex-col"
      initial="hidden"
      animate="show"
    >
      {/* Desktop: content left, route map right. Below lg the map follows the buttons. */}
      <Container className="relative flex flex-1 flex-col justify-center py-12 sm:py-16 lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:content-center lg:items-center lg:gap-x-12">
        <div>
          <motion.p
            variants={item}
            custom={0}
            className="text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-primary-soft sm:text-xs sm:tracking-[0.2em]"
          >
            {personal.overline}
          </motion.p>

          {/* Name and seal side by side from 900px, with a fixed 48px gap so the
              seal can never touch the name. */}
          <div className="mt-5 flex items-center gap-12">
            <motion.h1
              variants={item}
              custom={0.05}
              className="font-serif text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.95] tracking-[-0.02em] text-primary"
            >
              {first} <em className="italic">{rest.join(" ")}</em>
            </motion.h1>
            {/* -3px: centres the seal on the letters' cap height rather than the line box. */}
            <div className="hidden -translate-y-[3px] min-[900px]:block">
              <MakersMark size="inline" />
            </div>
          </div>

          <motion.p
            variants={item}
            custom={0.6}
            className="mt-6 max-w-[34rem] text-lg leading-relaxed text-primary sm:text-xl"
          >
            {personal.tagline}
          </motion.p>

          <motion.div variants={item} custom={0.65} className="mt-8 flex flex-wrap items-center gap-3">
            <Button href={`mailto:${personal.email}`} icon={<Mail size={17} aria-hidden />}>
              {heroCopy.emailCta}
            </Button>
            <Button
              href={personal.linkedin}
              variant="secondary"
              external
              icon={<LinkedInIcon size={16} />}
              aria-label={`${heroCopy.linkedinCta} ${heroCopy.newTab}`}
            >
              {heroCopy.linkedinCta}
            </Button>
          </motion.div>

          {/* Below 900px there isn't room beside the name: the seal sits under the buttons. */}
          <MakersMark size="stacked" tooltipAlign="start" className="mt-8 min-[900px]:hidden" />
        </div>

        {/* Hidden on phones. Tablet: 220px tall under the buttons. Desktop: the
            right column, bleeding into the page margin beyond the 1200px grid. */}
        <RouteMap className="mt-10 hidden w-[570px] max-w-full md:block lg:mt-0 lg:w-auto lg:-mr-[max(0px,calc((100vw-1200px)/2))]" />

        <motion.a
          variants={item}
          custom={0.8}
          href="#about"
          aria-label={heroCopy.scrollCueLabel}
          className="absolute bottom-6 right-5 hidden items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-primary-soft/80 transition-colors hover:text-primary sm:right-8 md:flex"
        >
          {heroCopy.scrollCue}
          <ArrowDown size={12} aria-hidden />
        </motion.a>
      </Container>

      <Container>
        <HeroStats variants={item} />
      </Container>
    </motion.section>
  );
}
