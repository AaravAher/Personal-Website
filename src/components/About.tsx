import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { bio, education, headshot, personal } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ContactLinks } from "@/components/ContactLinks";

// Checked at build time (static export), so a missing photo shows a clean
// placeholder instead of a broken image.
const hasHeadshot = fs.existsSync(
  path.join(process.cwd(), "public", headshot.src),
);

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="py-24 sm:py-32"
    >
      <Container>
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-5">
            <figure className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-sm bg-base-deep md:max-w-none">
              {hasHeadshot ? (
                <Image
                  src={headshot.src}
                  alt={headshot.alt}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div
                  role="img"
                  aria-label="Headshot placeholder"
                  className="flex h-full w-full items-center justify-center border border-primary/10"
                >
                  <span className="font-serif text-8xl text-primary/20">
                    {personal.monogram}
                  </span>
                </div>
              )}
            </figure>
          </Reveal>

          <div className="md:col-span-7 md:pt-4">
            <Reveal>
              <SectionHeading
                id="about-heading"
                index="01"
                eyebrow="About"
                title={
                  <>
                    From Mumbai&rsquo;s markets to{" "}
                    <em className="italic">Boston</em>.
                  </>
                }
              />
            </Reveal>

            {/* TODO: Aarav to rewrite. Bio text lives in content/site.ts (bio). */}
            <Reveal delay={0.1}>
              <div className="space-y-5 text-[1.05rem] leading-relaxed text-primary">
                {bio.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <ContactLinks className="mt-10 border-t border-primary/15 pt-8" />
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-20 sm:mt-24">
            <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-primary-soft">
              Education
            </h3>
            <ol className="grid border-t-2 border-primary md:grid-cols-3">
              {education.map((item, i) => (
                <li
                  key={item.school}
                  className={`border-b border-primary/15 py-6 md:border-b-0 md:py-8 ${
                    i > 0 ? "md:border-l md:pl-8" : ""
                  } ${i < education.length - 1 ? "md:pr-8" : ""}`}
                >
                  <p className="font-serif text-3xl leading-tight text-primary">
                    {item.shortName}
                  </p>
                  <p className="mt-1 text-sm text-primary-soft">
                    {item.detail}
                    {item.dates && <> · {item.dates}</>}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-primary">
                    {item.keyLine}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
