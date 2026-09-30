"use client";

import { useEffect, useRef, type CSSProperties } from "react";
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
 *   0.8  stats strip flaps in (~2.2s)
 *   1.6  map arcs draw, cities pop (done ~3.4s)
 *   4.2  first flight; the plane lands in Boston at ~10.4s, then every 14–16s
 */
/** Entrance delay for a .hero-in element (a CSS animation; see globals.css). */
const d = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

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
    <section
      ref={sectionRef}
      id="top"
      aria-label="Introduction"
      className="mt-[var(--nav-height)] flex min-h-[calc(100svh-var(--nav-height))] flex-col"
    >
      {/* Desktop: content left, route map right. Below lg the map follows the buttons. */}
      <Container className="relative flex flex-1 flex-col justify-center py-12 sm:py-16 lg:grid lg:grid-cols-[auto_minmax(0,1fr)] lg:content-center lg:items-center lg:gap-x-12">
        <div>
          <p
            style={d(0)}
            className="hero-in text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-primary-soft sm:text-xs sm:tracking-[0.2em]"
          >
            {personal.overline}
          </p>

          {/* Name and seal side by side from 900px, with a fixed 48px gap so the
              seal can never touch the name. */}
          <div className="mt-5 flex items-center gap-12">
            <h1
              style={d(0.05)}
              className="hero-in font-serif text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.95] tracking-[-0.02em] text-primary"
            >
              {first} <em className="italic">{rest.join(" ")}</em>
            </h1>
            {/* -3px: centres the seal on the letters' cap height rather than the line box. */}
            <div className="hidden -translate-y-[3px] min-[900px]:block">
              <MakersMark size="inline" />
            </div>
          </div>

          <p
            style={d(0.6)}
            // lg:w-0 + min-w-full: the tagline fills the column but doesn't widen it, so the
            // column (and the map's start) is set by the name and seal.
            className="hero-in mt-6 max-w-[34rem] text-lg leading-relaxed text-primary sm:text-xl lg:w-0 lg:min-w-full"
          >
            {personal.tagline}
          </p>

          <div style={d(0.65)} className="hero-in mt-8 flex flex-wrap items-center gap-3">
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
          </div>

          {/* Below 900px there isn't room beside the name: the seal sits under the buttons. */}
          <MakersMark size="stacked" tooltipAlign="start" className="mt-8 min-[900px]:hidden" />
        </div>

        {/* Hidden on phones. Tablet: up to 1.4× (798px) under the buttons.
            Desktop: starts 48px right of the seal (the grid gap) and grows to
            925px, or as far as 32px short of the viewport edge, whichever is
            smaller. It overflows its column into the page margin on purpose. */}
        <RouteMap className="mt-10 hidden w-full max-w-[798px] md:block lg:mt-0 lg:w-[min(925px,calc(100%+max(0px,(100vw-1200px)/2)))] lg:max-w-none" />

        <a
          style={d(0.8)}
          href="#about"
          aria-label={heroCopy.scrollCueLabel}
          className="hero-in absolute bottom-6 right-5 hidden items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-primary-soft transition-colors hover:text-primary sm:right-8 md:flex"
        >
          {heroCopy.scrollCue}
          <ArrowDown size={12} aria-hidden />
        </a>
      </Container>

      <Container>
        <HeroStats />
      </Container>
    </section>
  );
}
