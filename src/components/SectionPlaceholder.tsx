import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

type SectionPlaceholderProps = {
  id: string;
  index?: string;
  eyebrow: string;
  title: ReactNode;
  /** What will be built here, shown as a short list. */
  contents?: string[];
  tone?: "base" | "deep";
};

/** Temporary stand-in for a section that a later prompt will build. */
export function SectionPlaceholder({
  id,
  index,
  eyebrow,
  title,
  contents = [],
  tone = "base",
}: SectionPlaceholderProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`py-24 sm:py-32 ${tone === "deep" ? "bg-base-deep" : ""}`}
    >
      <Container>
        <SectionHeading
          id={`${id}-heading`}
          index={index}
          eyebrow={eyebrow}
          title={title}
        />
        <div className="rounded-sm border border-dashed border-primary/25 px-6 py-10 sm:px-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-soft">
            Coming in next prompt
          </p>
          {contents.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {contents.map((c) => (
                <li
                  key={c}
                  className="rounded-full border border-primary/15 px-3 py-1 text-sm text-primary"
                >
                  {c}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}
