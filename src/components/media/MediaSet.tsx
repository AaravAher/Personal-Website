"use client";

import type { CSSProperties } from "react";
import { mediaCopy, type Media } from "@/content/site";
import { LightboxGroup, useLightbox } from "@/components/case-study/Lightbox";
import { Picture, aspectOf } from "@/components/ui/Picture";
import { ProjectorSlide } from "./ProjectorSlide";

/*
 * One media layout for every section: a primary image plus up to three
 * secondaries, framed by kind (photo / document / phone screenshot / slide),
 * with captions and a lightbox scoped to the set.
 */

const FRAME = "rounded-lg border border-primary/15";
/** Mat around documents: enough to read as paper on a desk, not a big empty border. */
const MAT = "bg-base-deep p-4 sm:p-5";
const PAPER = "rounded-[3px] border border-primary/10 shadow-md shadow-primary/10";
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

type FrameProps = {
  media: Media;
  /** Lightbox position within the set. */
  index: number;
  sizes: string;
  /**
   * "natural": the frame takes the image's own shape (nothing cropped, no
   * empty mat). Otherwise the frame is a box of `ratio` (width / height).
   */
  natural?: boolean;
  ratio?: number;
  /** On md+ the frame fills its parent's height instead (secondaries beside the primary). */
  fillOnDesktop?: boolean;
  /** Documents only: crop from the top instead of showing the whole page. */
  alignTop?: boolean;
  className?: string;
};

/** A single image frame, shaped by the image's kind. Opens the set's lightbox. */
export function MediaFrame({ media, index, sizes, natural, ratio, fillOnDesktop, alignTop, className = "" }: FrameProps) {
  const lightbox = useLightbox();
  const boxRatio = natural ? aspectOf(media.src, media.trimTop) : (ratio ?? aspectOf(media.src));
  const box = `relative block w-full aspect-[var(--ar)] ${fillOnDesktop ? "md:aspect-auto md:h-full md:min-h-0" : ""}`;
  const style = { "--ar": String(boxRatio) } as CSSProperties;

  let inner;
  if (media.kind === "slide") {
    inner = <ProjectorSlide media={media} sizes={sizes} />;
  } else if (media.kind === "screenshot") {
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
  } else if (media.kind === "document" && natural) {
    // A document on a desk, sized by the document itself: never cropped, no empty mat.
    inner = (
      <span className={`block ${FRAME} ${MAT}`}>
        <Picture src={media.src} alt={media.alt} sizes={sizes} className={`block h-auto w-full ${PAPER}`} />
      </span>
    );
  } else if (media.kind === "document" && !alignTop) {
    // A document in a fixed box: contained on the mat, never cropped.
    inner = (
      <span className={`${box} ${FRAME} ${MAT} flex items-center justify-center`} style={style}>
        <Picture src={media.src} alt={media.alt} sizes={sizes} className={`h-auto max-h-full w-auto max-w-full ${PAPER}`} />
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

/** Captions are always visible, under every image that has one. */
function Caption({ text }: { text?: string }) {
  if (!text) return null;
  return <figcaption className="mt-2 shrink-0 text-xs leading-snug text-primary-soft">{text}</figcaption>;
}

/** Box ratio for a primary image. Photos are clamped so a panorama or a very tall shot can't dominate. */
function primaryRatio(m: Media, native: boolean) {
  const r = aspectOf(m.src, m.trimTop);
  if (m.kind !== "photo" || native) return r;
  return clamp(r, 0.8, 1.6);
}
/** Box ratio for a secondary on its own (mobile, or native layouts). */
function secondaryRatio(m: Media, native: boolean) {
  const r = aspectOf(m.src, m.trimTop);
  if (native || m.kind !== "photo") return r;
  return 4 / 3;
}

export function MediaSet({ images, variant = "default" }: { images: Media[]; variant?: "default" | "gallery" }) {
  const set = images.slice(0, 4);
  const [primary, ...rest] = set;
  if (!primary) return null;
  const gallery = variant === "gallery";
  const n = rest.length;
  const pRatio = primaryRatio(primary, gallery);
  /*
   * single  one image
   * stacked two images: both large, the second below at 85% width
   * row     landscape primary with 2–3 secondaries in a row beneath
   * column  otherwise: secondaries in a column beside the primary
   */
  const mode = n === 0 ? "single" : n === 1 && !gallery ? "stacked" : !gallery && pRatio >= 1.25 ? "row" : "column";

  if (mode === "single" || mode === "stacked") {
    return (
      <LightboxGroup images={set}>
        <div className="flex flex-col gap-5 sm:gap-6">
          <figure className="min-w-0">
            <MediaFrame media={primary} index={0} natural sizes="(min-width: 1024px) 55vw, 100vw" />
            <Caption text={primary.caption} />
          </figure>
          {rest.map((m, i) => (
            <figure key={m.src} className="min-w-0 md:w-[85%]">
              <MediaFrame media={m} index={i + 1} natural sizes="(min-width: 1024px) 47vw, 100vw" />
              <Caption text={m.caption} />
            </figure>
          ))}
        </div>
      </LightboxGroup>
    );
  }

  const primaryFigure = (
    <figure className="min-w-0">
      <MediaFrame
        media={primary}
        index={0}
        ratio={pRatio}
        sizes={mode === "column" ? "(min-width: 1024px) 36vw, (min-width: 768px) 60vw, 100vw" : "(min-width: 1024px) 58vw, 100vw"}
      />
      <Caption text={primary.caption} />
    </figure>
  );

  // Mobile arrangement of secondaries: two side by side, three in a snap strip.
  const mobileWrap =
    n === 3 ? "no-scrollbar -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1" : "grid grid-cols-2 gap-3";
  const mobileItem = n === 3 ? "w-[68%] shrink-0 snap-start" : "";

  if (mode === "row") {
    return (
      <LightboxGroup images={set}>
        {primaryFigure}
        <div className={`mt-3 sm:mt-4 ${mobileWrap} md:mx-0 md:grid md:overflow-visible md:px-0 md:gap-4 ${n === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {rest.map((m, i) => (
            <figure key={m.src} className={`min-w-0 ${mobileItem} md:w-auto`}>
              <MediaFrame media={m} index={i + 1} ratio={4 / 3} sizes="(min-width: 1024px) 20vw, 50vw" />
              <Caption text={m.caption} />
            </figure>
          ))}
        </div>
      </LightboxGroup>
    );
  }

  return (
    <LightboxGroup images={set}>
      <div
        className={`md:grid md:gap-4 ${
          gallery ? "md:grid-cols-[minmax(0,70fr)_minmax(0,30fr)] md:items-start" : "md:grid-cols-[minmax(0,62fr)_minmax(0,38fr)] md:items-stretch"
        }`}
      >
        {primaryFigure}
        <div className={`mt-3 ${mobileWrap} md:mx-0 md:mt-0 md:flex md:flex-col md:gap-4 md:overflow-visible md:px-0`}>
          {rest.map((m, i) => (
            <figure key={m.src} className={`flex min-w-0 flex-col ${mobileItem} md:w-auto ${gallery ? "" : "md:min-h-0 md:flex-1"}`}>
              <MediaFrame
                media={m}
                index={i + 1}
                ratio={secondaryRatio(m, gallery)}
                fillOnDesktop={!gallery}
                className={gallery ? "" : "md:min-h-0 md:flex-1"}
                sizes="(min-width: 1024px) 22vw, (min-width: 768px) 36vw, 50vw"
              />
              <Caption text={m.caption} />
            </figure>
          ))}
        </div>
      </div>
    </LightboxGroup>
  );
}
