"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowDown, Download, Mail, MapPin, Phone } from "lucide-react";
import { atAGlance, personal, phoneHref } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LinkedInIcon } from "@/components/ui/LinkedInIcon";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Hero() {
  const [first, ...rest] = personal.name.split(" ");

  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative flex min-h-svh flex-col justify-center pt-[calc(var(--nav-height)+2rem)] pb-28"
    >
      <Container>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-12"
        >
          <div className="lg:col-span-8">
          <motion.p
            variants={item}
            className="mb-6 flex items-center gap-2 text-sm text-primary-soft"
          >
            <MapPin size={15} aria-hidden />
            {personal.location}
          </motion.p>

          <motion.h1
            variants={item}
            className="font-serif text-[clamp(3.75rem,15vw,11rem)] leading-[0.9] tracking-[-0.02em] text-primary"
          >
            {first}
            <br />
            <em className="italic">{rest.join(" ")}</em>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-xl text-lg leading-relaxed text-primary-soft sm:text-xl"
          >
            {personal.tagline}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Button
              href={`mailto:${personal.email}`}
              icon={<Mail size={17} aria-hidden />}
            >
              Email me
            </Button>
            <Button
              href={personal.linkedin}
              variant="secondary"
              external
              icon={<LinkedInIcon size={16} />}
              aria-label="LinkedIn (opens in a new tab)"
            >
              LinkedIn
            </Button>
            <Button
              href={personal.resume}
              variant="secondary"
              download
              icon={<Download size={17} aria-hidden />}
            >
              Download resume
            </Button>
          </motion.div>

          {personal.showPhone && (
            <motion.p variants={item} className="mt-6 text-sm">
              <a
                href={phoneHref}
                className="inline-flex items-center gap-2 text-primary-soft underline decoration-primary/25 underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                <Phone size={14} aria-hidden />
                {personal.phone}
              </a>
            </motion.p>
          )}
          </div>

          <motion.dl
            variants={item}
            aria-label="At a glance"
            className="hidden border-t-2 border-primary lg:col-span-4 lg:mb-2 lg:block"
          >
            {atAGlance.map((fact) => (
              <div key={fact.label} className="border-b border-primary/15 py-4">
                <dt className="text-xs font-medium uppercase tracking-[0.2em] text-primary-soft">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-[0.95rem] text-primary">{fact.value}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </Container>

      <motion.a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary-soft transition-colors hover:text-accent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        Scroll
        <ArrowDown size={16} aria-hidden className="motion-safe:animate-bounce" />
      </motion.a>
    </section>
  );
}
