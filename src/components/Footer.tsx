import { ArrowUpRight } from "lucide-react";
import { personal } from "@/content/site";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const links = [
    { label: "Email", href: `mailto:${personal.email}` },
    { label: "LinkedIn", href: personal.linkedin, external: true },
    { label: "Resume", href: personal.resume, external: true },
  ];

  return (
    <footer
      id="contact"
      aria-labelledby="contact-heading"
      className="on-primary bg-primary pt-24 pb-10 text-cream sm:pt-32"
    >
      <Container>
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-cream/70">
          Contact
        </p>
        <h2
          id="contact-heading"
          className="max-w-3xl font-serif text-5xl leading-[1.02] tracking-tight sm:text-7xl"
        >
          Let&rsquo;s build something <em className="italic">together</em>.
        </h2>
        <a
          href={`mailto:${personal.email}`}
          className="mt-8 inline-block break-all text-lg underline decoration-accent-bright decoration-2 underline-offset-8 transition-colors hover:text-cream/80 sm:text-2xl"
        >
          {personal.email}
        </a>

        <div className="mt-20 flex flex-col gap-6 border-t border-cream/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-2xl">{personal.name}</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="inline-flex items-center gap-1 underline decoration-transparent decoration-2 underline-offset-4 transition-colors hover:decoration-accent-bright"
                >
                  {link.label}
                  {link.external && (
                    <>
                      <ArrowUpRight size={14} aria-hidden />
                      <span className="sr-only">(opens in a new tab)</span>
                    </>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-10 text-xs text-cream/70">
          © 2026 {personal.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
