"use client";

import { forwardRef } from "react";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { caseStudies, navCopy, workSection } from "@/content/site";
import { usePrefersReducedMotion } from "@/components/ui/usePrefersReducedMotion";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export const WORK_MENU_ID = "work-menu";

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } },
};
const column: Variants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * Full-width mega menu under the nav bar: one column per case study.
 * Rendered inside the Work <li> so Tab flows Work → columns → Projects.
 */
export const WorkMenu = forwardRef<HTMLDivElement, { onNavigate: () => void }>(
  function WorkMenu({ onNavigate }, ref) {
    const reduce = usePrefersReducedMotion();
    return (
      <motion.div
        ref={ref}
        id={WORK_MENU_ID}
        role="region"
        aria-label={navCopy.workMenuLabel}
        className="absolute inset-x-0 top-full border-b border-primary/15 bg-base"
        initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, clipPath: "inset(0 0 0% 0)" }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mx-auto w-full max-w-[1200px] px-5 pb-6 pt-4 sm:px-8">
          <motion.ul
            className="grid grid-cols-3 gap-4 lg:gap-6"
            variants={list}
            initial="hidden"
            animate="show"
          >
            {caseStudies.map((study, i) => {
              const [headline] = study.metrics;
              const thumb = study.media.images[0];
              return (
                <motion.li key={study.slug} variants={column}>
                  <a
                    href={`#${study.slug}`}
                    onClick={onNavigate}
                    className="group/col flex h-full flex-col rounded-md p-3 transition-colors hover:bg-accent-soft focus-visible:bg-accent-soft"
                  >
                    {thumb && (
                      <span aria-hidden className="block">
                        <PlaceholderImage
                          image={{ ...thumb, aspect: "landscape" }}
                          sizes="30vw"
                          compact
                        />
                      </span>
                    )}
                    <span className="mt-4 block text-[0.65rem] font-medium uppercase tracking-[0.2em] text-primary-soft">
                      {workSection.caseStudyLabel} {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-1.5 flex items-center gap-2">
                      <span className="font-serif text-2xl leading-tight text-primary underline decoration-transparent decoration-2 underline-offset-4 transition-colors group-hover/col:decoration-accent group-focus-visible/col:decoration-accent">
                        {study.company}
                      </span>
                      <ArrowRight
                        size={16}
                        aria-hidden
                        className="-translate-x-2 text-primary opacity-0 transition-[opacity,transform] duration-200 group-hover/col:translate-x-0 group-hover/col:opacity-100 group-focus-visible/col:translate-x-0 group-focus-visible/col:opacity-100"
                      />
                    </span>
                    <span className="mt-1 block text-xs text-primary-soft">
                      {study.role} · {study.dates}
                    </span>
                    <span className="mt-2 line-clamp-2 text-sm leading-snug text-primary">
                      {study.oneLiner}
                    </span>
                    {headline && (
                      <span className="mt-3 block text-xs font-medium text-primary">
                        {headline.value} {headline.label}
                      </span>
                    )}
                  </a>
                </motion.li>
              );
            })}
          </motion.ul>
          <a
            href="#work"
            onClick={onNavigate}
            className="mt-3 ml-3 inline-flex items-center gap-1.5 text-sm text-primary underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:decoration-accent"
          >
            {navCopy.allWork}
            <ArrowRight size={14} aria-hidden />
          </a>
        </div>
      </motion.div>
    );
  },
);
