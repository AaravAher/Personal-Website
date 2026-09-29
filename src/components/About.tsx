import { MapPin } from "lucide-react";
import { aboutCopy, bio, education, headshot, personal } from "@/content/site";
import { Picture } from "@/components/ui/Picture";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ContactLinks } from "@/components/ContactLinks";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="bg-base-deep py-24 sm:py-32 lg:py-40"
    >
      <Container>
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-12 lg:gap-20">
          <Reveal className="md:col-span-5">
            {/* Thin offset frame behind the photo. */}
            <div className="relative mx-auto w-full max-w-sm pb-3 pr-3 md:max-w-none">
              <div
                aria-hidden
                className="absolute inset-0 left-3 top-3 rounded-md border border-primary/20"
              />
              <figure className="relative aspect-[4/5] overflow-hidden rounded-md bg-base">
                <Picture
                  src={headshot.src}
                  alt={headshot.alt}
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: headshot.focus }}
                />
              </figure>
            </div>
          </Reveal>

          <div className="md:col-span-7 lg:pt-2">
            <Reveal>
              {/* accent-strong: plain accent is below AA on the base-deep background. */}
              <h2
                id="about-heading"
                className="text-xs font-medium uppercase tracking-[0.2em] text-accent-strong"
              >
                {aboutCopy.eyebrow}
              </h2>
              <p className="mt-6 max-w-[38rem] text-[1.125rem] leading-[1.75] text-primary lg:text-[1.25rem]">
                {bio}
              </p>
              <p className="mt-6 flex items-center gap-2 text-sm text-primary-soft">
                <MapPin size={15} aria-hidden />
                {personal.location}
              </p>
            </Reveal>

            <Reveal delay={0.05}>
              <h3 className="mt-12 text-xs font-medium uppercase tracking-[0.2em] text-primary-soft">
                {aboutCopy.educationHeading}
              </h3>
              <ul className="mt-4 max-w-[38rem] border-b border-primary/15">
                {education.map((item) => (
                  <li key={item.school} className="border-t border-primary/15 py-4">
                    <p className="font-semibold text-primary">{item.school}</p>
                    <p className="mt-0.5 text-sm text-primary-soft">{item.detail}</p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <h3 className="sr-only">{aboutCopy.contactHeading}</h3>
              <ContactLinks className="mt-10" />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
