"use client";

import type { CSSProperties } from "react";
import { mediaCopy, type Media } from "@/content/site";
import { LightboxGroup, useLightbox } from "@/components/case-study/Lightbox";
import { Picture, aspectOf } from "@/components/ui/Picture";

/*
 * One media layout for every section: a primary image plus up to three
 * secondaries, framed by kind (photo / document / phone screenshot), with
 * captions and a lightbox scoped to the set.
 */

const FRAME = "rounded-lg border border-primary/15";
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

type FrameProps = {
  media: Media;
  /** Lightbox position within the set. */
  index: number;
  /** Width / height of the frame box. */
  ratio: number;
  sizes: string;
  /** On md+ the frame fills its parent's height instead (secondaries beside the primary). */
  fillOnDesktop?: boolean;
  /** Documents only: crop from the top instead of showing the whole page. */
  alignTop?: boolean;
  className?: string;
};

/** A single image frame, shaped by the image's kind. Opens the set's lightbox. */
export function MediaFrame({ media, index, ratio, sizes, fillOnDesktop, alignTop, className = "" }: FrameProps) {
  const lightbox = useLightbox();
  const box = `relative block w-full aspect-[var(--ar)] ${fillOnDesktop ? "md:aspect-auto md:h-full md:min-h-0" : ""}`;
  const style = { "--ar": String(ratio) } as CSSProperties;

  let inner;
  if (media.kind === "screenshot") {
    // Minimal phone: a thin bezel and rounded screen. trimTop hides a status bar.
    inner = (
      <span className="block rounded-[1.6rem] border-2 border-primary/20 bg-base p-[5px]">
        <span
          className="relative block overflow-hidden rounded-[1.25rem] aspect-[var(--ar)]"
          style={{ "--ar": String(aspectOf(media.src, media.trimTop)) } as CSSProperties}
        >
          <Picture src={media.src} alt={media.alt} sizes={sizes} className="absolute inset-0 h-full w-full object-cover object-bottom" />
        </span>
      </span>
    );
  } else if (media.kind === "document" && !alignTop) {
    // A document on a desk: never cropped, on a mat, with a paper edge.
    inner = (
      <span className={`${box} ${FRAME} flex items-center justify-center bg-base-deep p-[6%]`} style={style}>
        <Picture
          src={media.src}
          alt={media.alt}
          sizes={sizes}
          className="h-auto max-h-full w-auto max-w-full rounded-[3px] border border-primary/10 shadow-md shadow-primary/10"
        />
      </span>
    );
  } else {
    // A photo filling a tall slot beside the primary could lose faces at its
    // edges, so on desktop it is shown whole, as a print on the mat. Mobile
    // frames keep a photo-friendly 4:3, so cover is safe there.
    const print = fillOnDesktop && media.kind === "photo";
    inner = (
      <span className={`${box} ${FRAME} overflow-hidden bg-base-deep`} style={style}>
        <Picture
          src={media.src}
          alt={media.alt}
          sizes={sizes}
          className={`absolute inset-0 h-full w-full object-cover ${
            print ? "md:inset-[6%] md:h-[88%] md:w-[88%] md:rounded-[3px] md:object-contain" : ""
          }`}
          style={{ objectPosition: alignTop ? "50% 0%" : (media.focus ?? "50% 50%") }}
        />
      </span>
    );
  }

  if (!lightbox) return <span className={`block ${className}`}>{inner}</span>;
  return (
    <button
      type="button"
      onClick={(e) => lightbox.open(index, e.currentTarget)}
      aria-label={`${mediaCopy.openImage}: ${media.alt}`}
      className={`block w-full cursor-zoom-in rounded-lg text-left ${fillOnDesktop ? "md:h-full md:min-h-0" : ""} ${className}`}
    >
      {inner}
    </button>
  );
}

function Caption({ text, secondary }: { text?: string; secondary?: boolean }) {
  if (!text) return null;
  return (
    <figcaption
      className={`mt-2 shrink-0 text-xs leading-snug text-primary-soft ${
        secondary ? "transition-opacity duration-200 can-hover:opacity-0 can-hover:group-hover:opacity-100 can-hover:group-focus-within:opacity-100" : ""
      }`}
    >
      {text}
    </figcaption>
  );
}

/** Box ratio for a primary image. Photos are clamped so a panorama or a very tall shot can't dominate. */
function primaryRatio(m: Media, native: boolean) {
  const r = aspectOf(m.src, m.trimTop);
  if (m.kind === "document" || native) return r;
  return clamp(r, 0.8, 1.6);
}
/** Box ratio for a secondary on its own (mobile, or native layouts). */
function secondaryRatio(m: Media, native: boolean) {
  const r = aspectOf(m.src, m.trimTop);
  if (native || m.kind === "document") return r;
  return 4 / 3;
}

export function MediaSet({ images, variant = "default" }: { images: Media[]; variant?: "default" | "gallery" }) {
  const [primary, ...rest] = images.slice(0, 4);
  if (!primary) return null;
  const gallery = variant === "gallery";
  const n = rest.length;
  const pRatio = primaryRatio(primary, gallery);
  // Landscape primary with 2–3 secondaries: row beneath. Otherwise: column beside.
  const mode = n === 0 ? "single" : !gallery && pRatio >= 1.25 && n >= 2 ? "row" : "column";

  const primaryFigure = (
    <figure className="group min-w-0">
      <MediaFrame
        media={primary}
        index={0}
        ratio={pRatio}
        sizes={mode === "column" ? "(min-width: 1024px) 36vw, (min-width: 768px) 60vw, 100vw" : "(min-width: 1024px) 58vw, 100vw"}
      />
      <Caption text={primary.caption} />
    </figure>
  );

  // Mobile arrangement of secondaries: one full width, two side by side, three in a snap strip.
  const mobileWrap =
    n === 3
      ? "no-scrollbar -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1"
      : n === 2
        ? "grid grid-cols-2 gap-3"
        : "block";
  const mobileItem = n === 3 ? "w-[68%] shrink-0 snap-start" : "";

  let secondaries = null;
  if (mode === "row") {
    secondaries = (
      <div className={`mt-3 sm:mt-4 ${mobileWrap} md:mx-0 md:grid md:overflow-visible md:px-0 md:gap-4 ${n === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {rest.map((m, i) => (
          <figure key={m.src} className={`group min-w-0 ${mobileItem} md:w-auto`}>
            <MediaFrame media={m} index={i + 1} ratio={4 / 3} sizes="(min-width: 1024px) 20vw, 50vw" />
            <Caption text={m.caption} secondary />
          </figure>
        ))}
      </div>
    );
  } else if (mode === "column") {
    secondaries = (
      <div
        className={`mt-3 ${mobileWrap} md:mx-0 md:mt-0 md:flex md:flex-col md:gap-4 md:overflow-visible md:px-0 ${gallery ? "md:justify-start" : ""}`}
      >
        {rest.map((m, i) => (
          <figure key={m.src} className={`group flex min-w-0 flex-col ${mobileItem} md:w-auto ${gallery ? "" : "md:min-h-0 md:flex-1"}`}>
            <MediaFrame
              media={m}
              index={i + 1}
              ratio={secondaryRatio(m, gallery)}
              fillOnDesktop={!gallery}
              className={gallery ? "" : "md:min-h-0 md:flex-1"}
              sizes="(min-width: 1024px) 22vw, (min-width: 768px) 36vw, 50vw"
            />
            <Caption text={m.caption} secondary />
          </figure>
        ))}
      </div>
    );
  }

  return (
    <LightboxGroup images={images.slice(0, 4)}>
      {mode === "column" ? (
        <div
          className={`md:grid md:gap-4 ${
            gallery ? "md:grid-cols-[minmax(0,70fr)_minmax(0,30fr)] md:items-start" : "md:grid-cols-[minmax(0,62fr)_minmax(0,38fr)] md:items-stretch"
          }`}
        >
          {primaryFigure}
          {secondaries}
        </div>
      ) : (
        <div>
          {primaryFigure}
          {secondaries}
        </div>
      )}
    </LightboxGroup>
  );
}
