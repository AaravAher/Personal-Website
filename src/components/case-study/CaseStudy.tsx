import { ArrowUpRight } from "lucide-react";
import { mediaCopy, workSection, type CaseStudy as CaseStudyData } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { MetricBlock } from "./MetricBlock";
import { VideoEmbed } from "./VideoEmbed";
import { MarketChips, ScreenshotStrip } from "./CaseStudyMedia";
import { MediaSet } from "@/components/media/MediaSet";

/** Phone screenshots get the strip; everything else uses the shared MediaSet. */
function Media({ study }: { study: CaseStudyData }) {
  const { images } = study.media;
  if (!images.length) return null;
  return images.every((m) => m.kind === "screenshot") ? (
    <ScreenshotStrip company={study.company} images={images} />
  ) : (
    <>
      <MediaSet images={images} />
      <MarketChips markets={study.markets} />
    </>
  );
}

export function CaseStudy({ study, index }: { study: CaseStudyData; index: number }) {
  const number = String(index + 1).padStart(2, "0");
  const mediaLeft = index % 2 === 1;

  const [headline, ...supporting] = study.metrics;

  return (
    <article
      id={study.slug}
      aria-labelledby={`${study.slug}-title`}
      className="py-20 first:pt-6 last:pb-0 sm:py-28"
    >
      <>
        <Reveal>
          <header>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {workSection.caseStudyLabel} {number}
            </p>
            <h3
              id={`${study.slug}-title`}
              className="mt-4 font-serif text-5xl leading-[1.02] tracking-tight text-primary sm:text-7xl"
            >
              {study.company}
            </h3>
            <p className="mt-4 text-sm text-primary-soft">
              {study.role}
              <span aria-hidden className="mx-2">·</span>
              {study.location}
              <span aria-hidden className="mx-2">·</span>
              {study.dates}
            </p>
            <p className="mt-6 max-w-2xl text-xl leading-snug text-primary sm:text-2xl">
              {study.oneLiner}
            </p>
            {study.url && study.linkLabel && (
              <a
                href={study.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-primary px-4 py-2 text-sm text-primary transition-colors hover:border-accent hover:text-accent-strong"
              >
                {study.linkLabel}
                <ArrowUpRight size={15} aria-hidden />
                <span className="sr-only">{mediaCopy.newTab}</span>
              </a>
            )}
          </header>
        </Reveal>

        <Reveal delay={0.05}>
          <dl className="mt-10 flex flex-wrap border-y border-primary/15 py-8 md:flex-nowrap md:items-end">
            {headline && (
              <MetricBlock
                metric={headline}
                headline
                className="basis-full border-b border-primary/15 pb-8 md:basis-auto md:border-b-0 md:pb-0 md:pr-12"
              />
            )}
            {supporting.map((metric, i) => (
              <MetricBlock
                key={metric.label}
                metric={metric}
                className={`flex-1 pt-8 md:flex-none md:border-l md:border-primary/15 md:px-10 md:pt-0 ${
                  i > 0 ? "border-l border-primary/15 pl-6" : "pr-6"
                }`}
              />
            ))}
          </dl>
        </Reveal>

        {/* Video (or its "coming soon" placeholder), full width above the columns, capped at 960px. */}
        {study.media.video && (
          <Reveal delay={0.05} className="mt-12 max-w-[960px]">
            <VideoEmbed video={study.media.video} />
          </Reveal>
        )}

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className={`lg:col-span-5 ${mediaLeft ? "lg:order-last" : ""}`}>
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-primary-soft">
              {workSection.situationHeading}
            </h4>
            <p className="mt-3 leading-relaxed text-primary">{study.context}</p>

            <h4 className="mt-10 text-xs font-medium uppercase tracking-[0.2em] text-primary-soft">
              {workSection.whatIDidHeading}
            </h4>
            <ul className="mt-3 space-y-3">
              {study.whatIDid.map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed text-primary">
                  <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-primary/40" />
                  {item}
                </li>
              ))}
            </ul>

            <h4 className="sr-only">{workSection.skillsHeading}</h4>
            <ul className="mt-8 flex flex-wrap gap-2">
              {study.skills.map((skill) => (
                <li
                  key={skill}
                  className="rounded-full border border-primary/30 px-3 py-1 text-xs text-primary"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* If the text runs longer than the media, the media stays in view while reading. */}
          <Reveal delay={0.1} className="lg:sticky lg:top-[calc(var(--nav-height)+24px)] lg:col-span-7 lg:self-start">
            <Media study={study} />
          </Reveal>
        </div>
      </>
    </article>
  );
}
