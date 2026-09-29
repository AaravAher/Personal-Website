"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowDown, Mail } from "lucide-react";
import { atAGlance, heroCopy, personal } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LinkedInIcon } from "@/components/ui/LinkedInIcon";
import { MakersMark } from "@/components/MakersMark";

// Five groups × 0.05s stagger + 0.35s duration ≈ 0.6s total.
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Hero() {
  const [first, ...rest] = personal.name.split(" ");

  return (
    <motion.section
      id="top"
      aria-label="Introduction"
      className="mt-[var(--nav-height)] flex min-h-[calc(100svh-var(--nav-height))] flex-col"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <Container className="relative flex flex-1 flex-col justify-center py-12 sm:py-16">
        <motion.p
          variants={item}
          className="text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-primary-soft sm:text-xs sm:tracking-[0.2em]"
        >
          {personal.overline}
        </motion.p>

        {/* Name and seal side by side from 900px, with a fixed 48px gap so the
            seal can never touch the name. */}
        <div className="mt-5 flex items-center gap-12">
          <motion.h1
            variants={item}
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
          className="mt-6 max-w-[34rem] text-lg leading-relaxed text-primary sm:text-xl"
        >
          {personal.tagline}
        </motion.p>

        <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
          <Button
            href={`mailto:${personal.email}`}
            icon={<Mail size={17} aria-hidden />}
          >
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

        <motion.a
          variants={item}
          href="#about"
          aria-label={heroCopy.scrollCueLabel}
          className="absolute bottom-6 right-5 hidden items-center gap-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-primary-soft/80 transition-colors hover:text-primary sm:right-8 md:flex"
        >
          {heroCopy.scrollCue}
          <ArrowDown size={12} aria-hidden />
        </motion.a>
      </Container>

      <Container>
        <motion.dl
          variants={item}
          aria-label={heroCopy.statsLabel}
          className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-primary/15 py-6 sm:gap-x-10 lg:grid-cols-4 lg:py-7"
        >
          {atAGlance.map((fact) => (
            <div key={fact.label}>
              <dt className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-primary-soft">
                {fact.label}
              </dt>
              <dd className="mt-1.5 text-sm leading-snug text-primary sm:text-[0.95rem]">
                {fact.value}
              </dd>
            </div>
          ))}
        </motion.dl>
      </Container>
    </motion.section>
  );
}
