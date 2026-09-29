"use client";

import { motion, type Variants } from "framer-motion";
import { atAGlance, heroClock, heroCopy, personal } from "@/content/site";
import { FLAP_MAX_SETTLE_MS, SplitFlap } from "./SplitFlap";
import { AvailabilityDot } from "./AvailabilityDot";
import { useBostonTime } from "./useBostonTime";

/** When the strip starts flapping (after the name, seal, tagline and buttons). */
const FLAP_START_MS = 800;
const STAT_STAGGER_MS = 250;
/** When the whole strip has settled (ms after the hero mounts). */
export const STATS_SETTLED_MS =
  FLAP_START_MS + (atAGlance.length - 1) * STAT_STAGGER_MS + FLAP_MAX_SETTLE_MS;

/** The hero's stats strip: four label/value pairs that flip in like a departures board. */
export function HeroStats({ variants }: { variants: Variants }) {
  const time = useBostonTime();

  return (
    <motion.dl
      variants={variants}
      custom={FLAP_START_MS / 1000}
      aria-label={heroCopy.statsLabel}
      className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-primary/15 py-6 sm:gap-x-10 lg:grid-cols-4 lg:py-7"
    >
      {atAGlance.map((stat, i) => {
        const delay = FLAP_START_MS + i * STAT_STAGGER_MS;
        return (
          <div key={stat.label}>
            <dt className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-primary-soft">
              {stat.label}
            </dt>
            <dd className="mt-1.5 text-sm leading-snug text-primary sm:text-[0.95rem]">
              {stat.kind === "clock" ? (
                <>
                  <SplitFlap text={`${stat.value}${heroClock.separator}${time}`} startDelay={delay} seed={i + 1} />
                  <span className="ml-1 text-[0.7em] text-primary-soft">{heroClock.zoneLabel}</span>
                </>
              ) : stat.kind === "availability" ? (
                <a
                  href={`mailto:${personal.email}`}
                  className="inline-flex items-center gap-2 underline decoration-transparent decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  <AvailabilityDot />
                  <span className="sr-only">{heroCopy.availabilityLabel} </span>
                  <SplitFlap text={stat.value} startDelay={delay} seed={i + 1} />
                </a>
              ) : (
                <SplitFlap text={stat.value} startDelay={delay} seed={i + 1} />
              )}
            </dd>
          </div>
        );
      })}
    </motion.dl>
  );
}
