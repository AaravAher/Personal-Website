import type { CaseStudy, SlotImage } from "@/content/site";
import { workSection } from "@/content/site";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

export type IndexedImage = { image: SlotImage; lightboxIndex: number };

/** PlannrAI: four phone screenshots. A row from md up, a snap strip below. */
export function ScreenshotStrip({
  company,
  images,
}: {
  company: string;
  images: IndexedImage[];
}) {
  return (
    <div className="relative">
      <div
        role="region"
        tabIndex={0}
        aria-label={`${company} ${workSection.screenshotsLabel}`}
        className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1 md:mx-0 md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:px-0"
      >
        {images.map(({ image, lightboxIndex }) => (
          <div key={image.slot} className="w-[44%] shrink-0 snap-start sm:w-[30%] md:w-auto">
            <PlaceholderImage
              image={image}
              lightboxIndex={lightboxIndex}
              sizes="(min-width: 768px) 20vw, 45vw"
              className="rounded-xl"
            />
          </div>
        ))}
      </div>
      {/* Scroll hint: fades the right edge while the strip is scrollable. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l from-base to-transparent md:hidden"
      />
    </div>
  );
}

/** Skillmatics: an asymmetric photo essay (large lead, tall portrait, tiles, wide closer). */
export function PhotoEssay({ images }: { images: IndexedImage[] }) {
  const [lead, tall, a, b, wide] = images;
  const tile = (item: IndexedImage | undefined, className: string, sizes: string) =>
    item && (
      <div className={className}>
        <PlaceholderImage
          image={item.image}
          lightboxIndex={item.lightboxIndex}
          sizing="fill"
          sizes={sizes}
          overlayCaption
        />
      </div>
    );

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {tile(lead, "col-span-2 aspect-[16/10]", "(min-width: 1024px) 60vw, 100vw")}
      {tile(tall, "row-span-2", "(min-width: 1024px) 30vw, 50vw")}
      {tile(a, "aspect-[4/3]", "(min-width: 1024px) 30vw, 50vw")}
      {tile(b, "aspect-[4/3]", "(min-width: 1024px) 30vw, 50vw")}
      {tile(wide, "col-span-2 aspect-[21/9]", "(min-width: 1024px) 60vw, 100vw")}
    </div>
  );
}

/** Celona: one lead photo over two, then the markets researched. */
export function MarketsGallery({
  images,
  markets = [],
}: {
  images: IndexedImage[];
  markets?: CaseStudy["markets"];
}) {
  const [lead, ...rest] = images;
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {lead && (
          <div className="col-span-2">
            <PlaceholderImage
              image={lead.image}
              lightboxIndex={lead.lightboxIndex}
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
          </div>
        )}
        {rest.map(({ image, lightboxIndex }) => (
          <PlaceholderImage
            key={image.slot}
            image={image}
            lightboxIndex={lightboxIndex}
            sizes="(min-width: 1024px) 30vw, 50vw"
          />
        ))}
      </div>

      {markets.length > 0 && (
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
      )}
    </div>
  );
}
