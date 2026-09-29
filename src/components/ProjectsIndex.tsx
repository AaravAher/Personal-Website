"use client";

import { motion, type Transition, type Variants } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { latestArticle, projectsIndex, type IndexEntry } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { usePrefersReducedMotion } from "@/components/ui/usePrefersReducedMotion";

const EASE = [0.22, 1, 0.36, 1] as const;
const LINE_STAGGER = 0.06;

/** Fades, stagger and the leader "draw". All instant under reduced motion. */
function useIndexMotion() {
  const reduce = usePrefersReducedMotion();
  const t = (transition: Transition): Transition => (reduce ? { duration: 0 } : transition);
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 8 },
    show: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: t({ duration: 0.5, delay: i * LINE_STAGGER, ease: EASE }),
    }),
  };
  const leader: Variants = {
    hidden: { scaleX: 0 },
    show: (i: number = 0) => ({
      scaleX: 1,
      transition: t({ duration: 0.6, delay: 0.15 + i * LINE_STAGGER, ease: "easeOut" }),
    }),
  };
  return { fadeUp, leader };
}

const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.2 } } as const;

function FeaturedRow({ entry, index, variants }: { entry: IndexEntry; index: number; variants: Variants }) {
  const latest = latestArticle(entry.articles);
  const href = entry.url || latest?.url || "";
  const linked = href !== "";
  const lead = latest ? latest.title : entry.lead;
  const number = String(index + 1).padStart(2, "0");

  return (
    <motion.div variants={variants} custom={index} className="border-t border-primary/15">
      <article
        className={`relative -mx-3 grid grid-cols-[auto_1fr] items-baseline gap-x-4 rounded-md px-3 py-7 transition-colors md:grid-cols-[4.5rem_1fr_200px] md:gap-x-8 lg:grid-cols-[4.5rem_15rem_1fr_200px] ${
          linked ? "group hover:bg-base-deep focus-within:bg-base-deep" : ""
        }`}
      >
        <span className="font-serif text-3xl leading-none text-primary-soft md:row-span-2 md:text-5xl lg:row-span-1">
          {number}
        </span>

        <div className="md:col-start-2 lg:row-start-1">
          <h3 className="font-serif text-3xl leading-tight text-primary md:text-4xl">
            {linked ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="stretched-link"
              >
                <span className="relative">
                  {entry.name}
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100 group-focus-within:scale-x-100"
                  />
                </span>
                <span className="sr-only"> {projectsIndex.newTab}</span>
              </a>
            ) : (
              entry.name
            )}
          </h3>
          <p className="mt-2 text-[0.65rem] font-medium uppercase tracking-[0.2em] text-primary-soft">
            {entry.type}
          </p>
        </div>

        <div className="col-span-2 mt-4 max-w-[34rem] md:col-span-1 md:col-start-2 lg:col-start-3 lg:row-start-1 lg:mt-0">
          {lead && (
            <p className="font-serif text-lg italic leading-snug text-primary">
              {latest ? <>&ldquo;{lead}&rdquo;</> : lead}
              {latest && (
                <span className="ml-2 font-sans text-xs not-italic text-primary-soft">
                  {latest.date}
                </span>
              )}
            </p>
          )}
          <p className="mt-2 text-[0.95rem] leading-relaxed text-primary">{entry.description}</p>
        </div>

        <div className="col-span-2 mt-5 self-start md:col-span-1 md:col-start-3 md:row-span-2 md:row-start-1 md:mt-1 lg:col-start-4 lg:row-span-1">
          <div className="rounded-md shadow-primary/15 transition-[transform,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:rotate-2 group-hover:shadow-lg motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:rotate-0">
            <PlaceholderImage image={entry.preview} sizes="(min-width: 768px) 200px, 100vw" />
          </div>
          {linked ? (
            <span aria-hidden className="mt-3 inline-flex items-center gap-1 text-sm text-primary">
              {entry.linkLabel}
              <ArrowUpRight
                size={15}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          ) : (
            <span className="mt-3 block text-sm text-primary-soft">
              {projectsIndex.linkComingSoon}
            </span>
          )}
        </div>
      </article>
    </motion.div>
  );
}

/** Flex row: name ··· right. Leader shows only when the column is wide enough. */
function LedgerLine({
  index,
  variants,
  leaderVariants,
  wide,
  left,
  right,
}: {
  index: number;
  variants: Variants;
  leaderVariants: Variants;
  /** Container-query class that switches the row into leader mode. */
  wide: { row: string; leader: string; right: string };
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <motion.li variants={variants} custom={index} className={`flex flex-col py-1.5 ${wide.row}`}>
      {left}
      <motion.span
        aria-hidden
        variants={leaderVariants}
        custom={index}
        className={`mx-2 hidden min-w-5 flex-1 origin-left border-b border-dotted border-primary/40 ${wide.leader}`}
      />
      <span className={`shrink-0 ${wide.right}`}>{right}</span>
    </motion.li>
  );
}

// Container widths at which the longest line (name + leader min + label) fits
// on one row. Measured: coursework ≈ 564px, simulations ≈ 416px.
const COURSE_WIDE = {
  row: "@min-[36rem]:flex-row @min-[36rem]:items-baseline",
  leader: "@min-[36rem]:block",
  right: "",
};
const SIM_WIDE = {
  row: "@min-[27rem]:flex-row @min-[27rem]:items-baseline",
  leader: "@min-[27rem]:block",
  right: "mt-1.5 @min-[27rem]:mt-0",
};

export function ProjectsIndex() {
  const { fadeUp, leader } = useIndexMotion();
  const {
    featured,
    courseworkHeading,
    coursework,
    simulationsHeading,
    simulations,
    simulationsNote,
    completedLabel,
  } = projectsIndex;

  let line = 0;
  const columnHeading = "text-xs font-medium uppercase tracking-[0.2em] text-primary-soft";

  return (
    <section id="projects" aria-labelledby="projects-heading" className="py-24 sm:py-32">
      <Container>
        <motion.div {...inView} variants={fadeUp}>
          <SectionHeading
            id="projects-heading"
            index="04"
            eyebrow={projectsIndex.eyebrow}
            title={projectsIndex.title}
          />
        </motion.div>

        {/* Part A: featured entries */}
        <motion.div {...inView} className="border-b border-primary/15">
          {featured.map((entry, i) => (
            <FeaturedRow key={entry.slug} entry={entry} index={i} variants={fadeUp} />
          ))}
        </motion.div>

        {/* Part B: the ledger */}
        <motion.div
          {...inView}
          className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16"
        >
          <div className="@container lg:col-span-7">
            <h3 className={columnHeading}>{courseworkHeading}</h3>
            {coursework.map((group) => (
              <div key={group.institution} className="mt-6">
                <h4 className="text-sm font-semibold text-primary">{group.institution}</h4>
                <ul className="mt-1.5">
                  {group.courses.map((course) => (
                    <LedgerLine
                      key={course.name}
                      index={line++}
                      variants={fadeUp}
                      leaderVariants={leader}
                      wide={COURSE_WIDE}
                      left={<span className="text-[0.95rem] text-primary">{course.name}</span>}
                      right={<span className="text-sm text-primary-soft">{course.theme}</span>}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="@container lg:col-span-5">
            <h3 className={columnHeading}>{simulationsHeading}</h3>
            <ul className="mt-6">
              {simulations.map((sim) => (
                <LedgerLine
                  key={sim.name}
                  index={line++}
                  variants={fadeUp}
                  leaderVariants={leader}
                  wide={SIM_WIDE}
                  left={
                    <span>
                      <span className="block text-[0.95rem] text-primary">{sim.name}</span>
                      <span className="block text-xs text-primary-soft">{sim.theme}</span>
                    </span>
                  }
                  right={
                    sim.completed && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/60 px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-[0.12em] text-primary">
                        <Check size={11} aria-hidden strokeWidth={2.5} />
                        {completedLabel}
                      </span>
                    )
                  }
                />
              ))}
            </ul>
            <motion.p
              variants={fadeUp}
              custom={line}
              className="mt-6 text-sm text-primary-soft"
            >
              {simulationsNote}
            </motion.p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
