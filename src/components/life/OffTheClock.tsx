import { chapters, offTheClockSection, type Chapter as ChapterData } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MediaSet } from "@/components/media/MediaSet";
import { MetricBlock } from "@/components/case-study/MetricBlock";

/** One chapter: text beside a MediaSet. Smaller and lighter than a case study. */
function Chapter({ chapter, index }: { chapter: ChapterData; index: number }) {
  const mediaLeft = index % 2 === 1;
  return (
    <article
      id={`chapter-${chapter.slug}`}
      aria-labelledby={`chapter-${chapter.slug}-title`}
      className="grid grid-cols-1 gap-10 py-16 first:pt-4 last:pb-0 sm:py-20 lg:grid-cols-12 lg:items-center lg:gap-14"
    >
      <Reveal className={`lg:col-span-5 ${mediaLeft ? "lg:order-last" : ""}`}>
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-soft">{chapter.overline}</p>
        <h3 id={`chapter-${chapter.slug}-title`} className="mt-3 font-serif text-4xl leading-tight text-primary sm:text-5xl">
          {chapter.title}
        </h3>
        <p className="mt-2 text-sm text-primary-soft">{chapter.meta}</p>
        <p className="mt-5 max-w-[34rem] leading-relaxed text-primary">{chapter.text}</p>
        {chapter.stat && (
          <dl className="mt-8 max-w-[34rem] border-t border-primary/15 pt-6">
            <MetricBlock metric={chapter.stat} compact />
          </dl>
        )}
      </Reveal>
      <Reveal delay={0.1} className="lg:col-span-7">
        <MediaSet images={chapter.media} variant={chapter.layout === "gallery" ? "gallery" : "default"} />
      </Reveal>
    </article>
  );
}

export function OffTheClock() {
  return (
    <section id="off-the-clock" aria-labelledby="off-the-clock-heading" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            id="off-the-clock-heading"
            index="05"
            eyebrow={offTheClockSection.eyebrow}
            title={offTheClockSection.title}
          />
        </Reveal>
        <div className="divide-y divide-primary/15">
          {chapters.map((chapter, i) => (
            <Chapter key={chapter.slug} chapter={chapter} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
