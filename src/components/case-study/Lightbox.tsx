"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { mediaCopy, type Media } from "@/content/site";
import { Picture } from "@/components/ui/Picture";

/** What the viewer needs from an image. */
export type LightboxImage = Pick<Media, "src" | "alt" | "caption">;

type LightboxContextValue = {
  open: (index: number, trigger: HTMLElement) => void;
};

const LightboxContext = createContext<LightboxContextValue | null>(null);

/** Returns null outside a LightboxGroup, so images render as plain images. */
export function useLightbox() {
  return useContext(LightboxContext);
}

/**
 * Wraps one case study. `images` are the filled-in images, in order; tiles
 * open the viewer at their index within this list.
 */
export function LightboxGroup({
  images,
  children,
}: {
  images: LightboxImage[];
  children: ReactNode;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((i: number, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setIndex(i);
  }, []);

  const close = useCallback(() => {
    setIndex(null);
    // Return focus to the image that opened the viewer.
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      <Lightbox
        images={images}
        index={index}
        onIndexChange={setIndex}
        onClose={close}
      />
    </LightboxContext.Provider>
  );
}

function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: {
  images: LightboxImage[];
  index: number | null;
  onIndexChange: (i: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const isOpen = index !== null;
  const count = images.length;

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      onIndexChange((index + delta + count) % count);
    },
    [index, count, onIndexChange],
  );

  // Lock body scroll while open, compensating for the scrollbar width.
  useEffect(() => {
    if (!isOpen) return;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [isOpen]);

  // Move focus into the dialog when it opens.
  useEffect(() => {
    if (isOpen) dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
  }, [isOpen]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowRight" && count > 1) {
      step(1);
    } else if (e.key === "ArrowLeft" && count > 1) {
      step(-1);
    } else if (e.key === "Tab") {
      // Trap focus inside the dialog.
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>("button");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  if (typeof document === "undefined") return null;

  const image = index !== null ? images[index] : null;

  return createPortal(
    <AnimatePresence>
      {image && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={mediaCopy.lightboxLabel}
          onKeyDown={onKeyDown}
          onClick={(e) => e.target === e.currentTarget && onClose()}
          className="on-primary fixed inset-0 z-[100] flex flex-col items-center justify-center bg-primary/95 px-4 py-16 backdrop-blur-md text-cream sm:px-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            data-autofocus
            onClick={onClose}
            aria-label={mediaCopy.closeLightbox}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full text-cream transition-colors hover:bg-cream/10"
          >
            <X size={22} aria-hidden />
          </button>

          <figure
            className="flex max-h-full w-full max-w-5xl flex-col items-center"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <motion.div
              key={image.src}
              className="relative h-[70vh] w-full"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              <Picture
                src={image.src}
                alt={image.alt}
                sizes="100vw"
                eager
                className="absolute inset-0 h-full w-full object-contain"
              />
            </motion.div>
            <figcaption className="mt-4 flex items-center gap-4 text-sm text-cream/80">
              {image.caption && <span>{image.caption}</span>}
              {count > 1 && (
                <span className="tabular-nums" aria-live="polite">
                  {index! + 1} / {count}
                </span>
              )}
            </figcaption>
          </figure>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label={mediaCopy.previousImage}
                className="absolute left-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-cream transition-colors hover:bg-cream/10 sm:left-6"
              >
                <ChevronLeft size={26} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label={mediaCopy.nextImage}
                className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-cream transition-colors hover:bg-cream/10 sm:right-6"
              >
                <ChevronRight size={26} aria-hidden />
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
