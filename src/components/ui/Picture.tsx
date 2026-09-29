import type { CSSProperties } from "react";
import manifest from "@/content/image-manifest.json";

type Size = { width: number; height: number };
const SIZES = manifest as Record<string, Size>;

/** Dimensions of the built 1600w image (falls back to 16:10 if unknown). */
export function imageSize(src: string): Size {
  return SIZES[src] ?? { width: 1600, height: 1000 };
}

export function aspectOf(src: string, trimTop = 0) {
  const { width, height } = imageSize(src);
  return width / (height * (1 - trimTop));
}

/**
 * A built WebP image (see scripts/optimize-images.mjs) with an 800w/1600w
 * srcSet. Descriptors use the real widths, so small originals aren't
 * mislabelled. Lazy by default: everything with images is below the hero.
 */
export function Picture({
  src,
  alt,
  sizes,
  className = "",
  style,
  eager = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  style?: CSSProperties;
  eager?: boolean;
}) {
  const { width, height } = imageSize(src);
  const small = Math.round(width * Math.min(1, 800 / Math.max(width, height)));
  return (
    // Static export: images are pre-built, so a plain <img> with srcSet is the right tool.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${src}-1600w.webp`}
      srcSet={`${src}-800w.webp ${small}w, ${src}-1600w.webp ${width}w`}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
      style={style}
    />
  );
}
