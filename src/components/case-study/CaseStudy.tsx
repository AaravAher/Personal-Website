import { ArrowUpRight } from "lucide-react";
import { mediaCopy, workSection, type CaseStudy as CaseStudyData } from "@/content/site";
import { Reveal } from "@/components/ui/Reveal";
import { MetricBlock } from "./MetricBlock";
import { VideoEmbed } from "./VideoEmbed";
import { MarketChips, ScreenshotStrip } from "./CaseStudyMedia";
import { MediaSet } from "@/components/media/MediaSet";

const h4 = "text-xs font-medium uppercase tracking-[0.2em] text-primary-soft";

/**
 * "The situation", "What I did" and skills, with the same type and spacing in
 * every case study. "sidebar": one column beside the media. "split": two
 * top-aligned columns (situation | what I did + skills). "single": one column.
 */
function CaseStudyText({ study, layout }: { study: CaseStudyData; layout: "sidebar" | "split" | "single" }) {
  const situation = (
    <div>
      <h4 className={h4}>{workSection.situationHeading}</h4>
      <p className="mt-3 leading-relaxed text-primary">{study.context}</p>
    </div>
  );
  const whatIDid = (
    <div>
      <h4 className={h4}>{workSection.whatIDidHeading}</h4>
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
          <li key={skill} className="rounded-full border border-primary/30 px-3 py-1 text-xs text-primary">
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
  if (layout === "split") {
    return (
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        {situation}
        {whatIDid}
      </div>
    );
  }
  return (
    <div className={`flex flex-col gap-10 ${layout === "single" ? "max-w-[44rem]" : ""}`}>
      {situation}
      {whatIDid}
    </div>
  );
}

/** Which text layout sits under the full-width screenshot row. */
// "single": "The situation" (≈130px) and "What I did" (≈270px) are far from equal,
// so two columns would leave a gap. Switch to "split" if they even out.
const LEAD_TEXT_LAYOUT: "split" | "single" = "single";

export function CaseStudy({ study, index }: { study: CaseStudyData; index: number }) {
  const number = String(index + 1).padStart(2, "0");
  const mediaLeft = index % 2 === 1;

  const [headline, ...supporting] = study.metrics;
  const { images, video } = study.media;
  // Phone screenshots lead as a full-width row; other media sits beside the text.
  const screenshotLed = images.length > 0 && images.every((m) => m.kind === "screenshot");

  return (
    <article
      id={study.slug}
      aria-labelledby={`${study.slug}-title`}
      className="py-20 first:pt-6 last:pb-0 sm:py-28"
    >
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

        {/* Video: rendered only when enabled in site.ts (nothing at all otherwise).
            Enabled with an empty id, it shows the "coming soon" placeholder. */}
        {video?.enabled && (
          <Reveal delay={0.05} className="mt-12 max-w-[960px]">
            <VideoEmbed video={video} />
          </Reveal>
        )}

        {screenshotLed ? (
          <>
            <Reveal delay={0.05} className="mt-12">
              <ScreenshotStrip company={study.company} images={images} />
            </Reveal>
            <Reveal className="mt-12">
              <CaseStudyText study={study} layout={LEAD_TEXT_LAYOUT} />
            </Reveal>
          </>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className={`lg:col-span-5 ${mediaLeft ? "lg:order-last" : ""}`}>
              <CaseStudyText study={study} layout="sidebar" />
            </Reveal>

            {/* If the text runs longer than the media, the media stays in view while reading. */}
            <Reveal delay={0.1} className="lg:sticky lg:top-[calc(var(--nav-height)+24px)] lg:col-span-7 lg:self-start">
              {images.length > 0 && <MediaSet images={images} />}
              <MarketChips markets={study.markets} />
            </Reveal>
          </div>
        )}
    </article>
  );
}
