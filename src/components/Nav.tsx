"use client";

import { useEffect, useState } from "react";
import { FileText, Menu, X } from "lucide-react";
import { nav, personal } from "@/content/site";
import { Button } from "@/components/ui/Button";

/**
 * Sections on the page mapped to the nav link they light up.
 * Several page sections can belong to one link (Work covers case studies and
 * other experience).
 */
const SECTION_TO_NAV: Record<string, string> = {
  about: "#about",
  work: "#work",
  experience: "#work",
  projects: "#projects",
  languages: "#about",
  "off-the-clock": "#off-the-clock",
  interests: "#off-the-clock",
  contact: "#contact",
};

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);

      // The active section is the last one whose top has passed 35% of the viewport.
      const line = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const id of Object.keys(SECTION_TO_NAV)) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) {
          if (
            !current ||
            el.offsetTop >= (document.getElementById(current)?.offsetTop ?? 0)
          ) {
            current = id;
          }
        }
      }
      // At the very bottom of the page, the footer (Contact) wins.
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      ) {
        current = "contact";
      }
      setActive(current ? SECTION_TO_NAV[current] : null);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        open
          ? "border-b border-primary/10 bg-base"
          : scrolled
          ? "border-b border-primary/10 bg-base/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-cream"
      >
        Skip to content
      </a>

      <nav
        aria-label="Primary"
        className="mx-auto flex h-[var(--nav-height)] w-full max-w-[1200px] items-center justify-between px-5 sm:px-8"
      >
        <a
          href="#top"
          className="font-serif text-2xl leading-none tracking-tight text-primary"
          aria-label={`${personal.name}, back to top`}
          onClick={() => setOpen(false)}
        >
          {personal.monogram}
          <span aria-hidden className="text-accent">.</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {nav.map((link) => {
            const isActive = active === link.href;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`relative py-2 text-sm transition-colors hover:text-accent ${
                    isActive ? "text-primary" : "text-primary-soft"
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full bg-accent transition-transform duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Button
            href={personal.resume}
            external
            size="sm"
            icon={<FileText size={15} aria-hidden />}
            aria-label="Resume (opens PDF in a new tab)"
          >
            Resume
          </Button>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-primary/5 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-primary/10 md:hidden"
      >
        <ul className="mx-auto flex max-w-[1200px] flex-col px-5 py-4 sm:px-8">
          {nav.map((link) => {
            const isActive = active === link.href;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? "location" : undefined}
                  className={`flex items-center justify-between border-b border-primary/10 py-4 font-serif text-2xl ${
                    isActive ? "text-primary" : "text-primary-soft"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
