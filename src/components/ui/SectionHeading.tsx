import type { ReactNode } from "react";

type SectionHeadingProps = {
  /** Small numbered label above the heading, e.g. "01". */
  index?: string;
  eyebrow: string;
  title: ReactNode;
  id?: string;
  className?: string;
};

export function SectionHeading({
  index,
  eyebrow,
  title,
  id,
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`mb-10 sm:mb-14 ${className}`}>
      <p className="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-primary-soft">
        {index && <span className="tabular-nums">{index}</span>}
        {index && <span aria-hidden className="h-px w-8 bg-primary/30" />}
        <span>{eyebrow}</span>
      </p>
      <h2
        id={id}
        className="font-serif text-4xl leading-[1.05] tracking-tight text-primary sm:text-5xl lg:text-6xl"
      >
        {title}
      </h2>
    </div>
  );
}
