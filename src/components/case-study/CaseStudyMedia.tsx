"use client";

import type { CaseStudy, Media } from "@/content/site";
import { workSection } from "@/content/site";
import { LightboxGroup } from "./Lightbox";
import { MediaFrame } from "@/components/media/MediaSet";
import { aspectOf } from "@/components/ui/Picture";

/** PlannrAI: phone screenshots in minimal frames. A row from md up, a snap strip below. */
export function ScreenshotStrip({ company, images }: { company: string; images: Media[] }) {
  return (
    <LightboxGroup images={images}>
      <div className="relative">
        <div
          role="region"
          tabIndex={0}
          aria-label={`${company} ${workSection.screenshotsLabel}`}
          className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0"
        >
          {images.map((image, i) => (
            <figure key={image.src} className="w-[44%] shrink-0 snap-start sm:w-[30%] md:w-auto">
              <MediaFrame
                media={image}
                index={i}
                ratio={aspectOf(image.src, image.trimTop)}
                sizes="(min-width: 768px) 16vw, 45vw"
              />
              {image.caption && (
                <figcaption className="mt-2 text-xs leading-snug text-primary-soft">{image.caption}</figcaption>
              )}
            </figure>
          ))}
        </div>
        {/* Scroll hint: fades the right edge while the strip is scrollable. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l from-base to-transparent md:hidden"
        />
      </div>
    </LightboxGroup>
  );
}

/** Celona: the markets researched, as outline chips under the images. */
export function MarketChips({ markets = [] }: { markets?: CaseStudy["markets"] }) {
  if (!markets.length) return null;
  return (
    <div className="mt-8">
      <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-primary-soft">
        {workSection.marketsHeading}
      </h4>
      <ul className="mt-4 flex flex-wrap gap-2">
        {markets.map((m) => (
          <li
            key={m.iso3}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-3.5 py-1.5 text-sm text-primary"
          >
            <span aria-hidden>{m.flag}</span>
            {m.country}
          </li>
        ))}
      </ul>
    </div>
  );
}
