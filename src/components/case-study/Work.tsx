import { caseStudies, workSection } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CaseStudy } from "./CaseStudy";

export function Work() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="border-t border-primary/15 py-24 sm:py-32"
    >
      <Container>
        <Reveal>
          <SectionHeading
            id="work-heading"
            index="02"
            eyebrow={workSection.eyebrow}
            title={workSection.title}
            className="mb-6!"
          />
          <p className="max-w-2xl text-lg leading-relaxed text-primary-soft">
            {workSection.intro}
          </p>
        </Reveal>

        <div className="mt-10 divide-y divide-primary/15">
          {caseStudies.map((study, i) => (
            <CaseStudy key={study.slug} study={study} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
