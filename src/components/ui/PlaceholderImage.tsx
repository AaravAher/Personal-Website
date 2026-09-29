"use client";

import Image from "next/image";
import { ImageIcon } from "lucide-react";
import {
  mediaCopy,
  recommendedSizes,
  type ImageAspect,
  type SlotImage,
} from "@/content/site";
import { useLightbox } from "@/components/case-study/Lightbox";

const aspectClass: Record<ImageAspect, string> = {
  landscape: "aspect-[16/10]",
  portrait: "aspect-[9/19.5]",
  square: "aspect-square",
};

type PlaceholderImageProps = {
  image: SlotImage;
  /** Position among this case study's filled images; enables the lightbox. */
  lightboxIndex?: number;
  /**
   * "aspect" sizes the tile from the image's aspect ratio.
   * "fill" lets the parent grid decide the size (photo-essay layouts).
   */
  sizing?: "aspect" | "fill";
  sizes?: string;
  /** Show the caption over the image (on hover for mouse, always on touch). */
  overlayCaption?: boolean;
  /** Icon-only placeholder, for small thumbnails. */
  compact?: boolean;
  className?: string;
};

/**
 * An image slot. Empty `src` renders a labelled placeholder at the right
 * shape; a filled `src` renders next/image (click to enlarge when in a
 * LightboxGroup). Only site.ts needs editing to swap one for the other.
 */
export function PlaceholderImage({
  image,
  lightboxIndex,
  sizing = "aspect",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  overlayCaption = false,
  compact = false,
  className = "",
}: PlaceholderImageProps) {
  const lightbox = useLightbox();
  const shape = sizing === "aspect" ? aspectClass[image.aspect] : "h-full min-h-full";
  const frame = `relative w-full overflow-hidden rounded-sm ${shape} ${className}`;

  if (!image.src) {
    const size = image.recommendedSize ?? recommendedSizes[image.aspect];
    return (
      <div
        role="img"
        aria-label={`${image.slot} (placeholder)`}
        className={`${frame} flex flex-col items-center justify-center gap-2 border border-primary/15 bg-base-deep p-3 text-center text-primary-soft`}
      >
        <ImageIcon size={compact ? 16 : 20} aria-hidden strokeWidth={1.5} />
        {!compact && (
          <>
            <span className="text-xs font-medium leading-snug">{image.slot}</span>
            {image.caption && (
              <span className="text-[0.7rem] leading-snug">{image.caption}</span>
            )}
            <span className="text-[0.65rem] leading-snug tabular-nums">
              {mediaCopy.recommendedPrefix} {size}
            </span>
          </>
        )}
      </div>
    );
  }

  const img = (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
    />
  );

  const caption = overlayCaption && image.caption && (
    <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-primary/80 to-transparent px-3 pb-3 pt-8 text-left text-xs text-cream transition-opacity duration-300 can-hover:opacity-0 can-hover:group-hover:opacity-100 can-hover:group-focus-visible:opacity-100">
      {image.caption}
    </span>
  );

  if (lightbox && lightboxIndex !== undefined && lightboxIndex >= 0) {
    return (
      <button
        type="button"
        onClick={(e) => lightbox.open(lightboxIndex, e.currentTarget)}
        aria-label={`${mediaCopy.openImage}: ${image.alt}`}
        className={`group block cursor-zoom-in ${frame}`}
      >
        {img}
        {caption}
      </button>
    );
  }

  return (
    <div className={`group ${frame}`}>
      {img}
      {caption}
    </div>
  );
}
