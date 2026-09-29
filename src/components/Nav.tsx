"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, FileText, Menu, X } from "lucide-react";
import { caseStudies, nav, navCopy, personal } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { WORK_MENU_ID, WorkMenu } from "@/components/WorkMenu";

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

const WORK_HREF = "#work";
/** Hover intent: open after a short hover, close after leaving link and panel. */
const OPEN_DELAY = 80;
const CLOSE_DELAY = 180;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [mobileWorkOpen, setMobileWorkOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);

  const workLinkRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  // After clicking Work, don't reopen until the pointer leaves and comes back.
  const suppressHover = useRef(false);
  const focusFirstOnOpen = useRef(false);

  const closeMega = useCallback((returnFocus = false) => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    setMegaOpen(false);
    if (returnFocus) workLinkRef.current?.focus();
  }, []);

  const closeMobile = () => {
    setOpen(false);
    setMobileWorkOpen(false);
  };

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

  // While the Work menu is open: Esc, scroll and resizing to mobile close it.
  useEffect(() => {
    if (!megaOpen) return;
    if (focusFirstOnOpen.current) {
      focusFirstOnOpen.current = false;
      menuRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMega(true);
    };
    const onScroll = () => closeMega();
    const onResize = () => window.innerWidth < 768 && closeMega();
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [megaOpen, closeMega]);

  useEffect(
    () => () => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
    },
    [],
  );

  // The Work <li> wraps both the link and the panel, so moving from one to
  // the other (even diagonally across the nav bar) only runs the close delay.
  const onWorkPointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || suppressHover.current) return;
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => setMegaOpen(true), OPEN_DELAY);
  };
  const onWorkPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    suppressHover.current = false;
    window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), CLOSE_DELAY);
  };
  const onWorkKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      if (megaOpen) {
        menuRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
      } else {
        focusFirstOnOpen.current = true;
        setMegaOpen(true);
      }
    }
  };
  const onWorkBlur = (e: React.FocusEvent<HTMLLIElement>) => {
    // Tabbing out of the link + panel closes it.
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) closeMega();
  };

  const headerTone =
    open || megaOpen
      ? `bg-base border-b ${megaOpen ? "border-transparent" : "border-primary/10"}`
      : scrolled
        ? "border-b border-primary/10 bg-base/85 backdrop-blur-md"
        : "bg-transparent";

  return (
    <>
      {/* Dims the page under the Work menu. Sits below the header (z-40 vs z-50). */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            aria-hidden
            className="fixed inset-0 z-40 bg-primary/25"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => closeMega()}
          />
        )}
      </AnimatePresence>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-200 ${headerTone}`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-cream"
        >
          {navCopy.skipLink}
        </a>

        <nav
          aria-label="Primary"
          className="mx-auto flex h-[var(--nav-height)] w-full max-w-[1200px] items-center justify-between px-5 sm:px-8"
        >
          <a
            href="#top"
            className="font-serif text-2xl leading-none tracking-tight text-primary"
            aria-label={`${personal.name}, back to top`}
            onClick={closeMobile}
          >
            {personal.monogram}
            <span aria-hidden className="text-accent">.</span>
          </a>

          <ul className="hidden h-full items-stretch gap-8 md:flex">
            {nav.map((link) => {
              const isWork = link.href === WORK_HREF;
              const isActive = active === link.href || (isWork && megaOpen);
              const underline = (
                <span
                  aria-hidden
                  className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full transition-transform duration-300 ${
                    isActive
                      ? "scale-x-100 bg-accent"
                      : "scale-x-0 bg-primary/30 group-hover:scale-x-100"
                  }`}
                />
              );

              if (!isWork) {
                return (
                  <li key={link.href} className="flex items-center">
                    <a
                      href={link.href}
                      aria-current={active === link.href ? "location" : undefined}
                      className="group relative py-2 text-sm text-primary"
                    >
                      {link.label}
                      {underline}
                    </a>
                  </li>
                );
              }

              return (
                <li
                  key={link.href}
                  className="flex items-center"
                  onPointerEnter={onWorkPointerEnter}
                  onPointerLeave={onWorkPointerLeave}
                  onBlur={onWorkBlur}
                >
                  <a
                    ref={workLinkRef}
                    href={link.href}
                    aria-current={active === link.href ? "location" : undefined}
                    aria-haspopup="true"
                    aria-expanded={megaOpen}
                    aria-controls={WORK_MENU_ID}
                    onKeyDown={onWorkKeyDown}
                    onClick={() => {
                      suppressHover.current = true;
                      closeMega();
                    }}
                    className="group relative flex items-center gap-1 py-2 text-sm text-primary"
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      aria-hidden
                      className={`transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
                    />
                    {underline}
                  </a>
                  <AnimatePresence>
                    {megaOpen && (
                      <WorkMenu
                        ref={menuRef}
                        onNavigate={() => {
                          suppressHover.current = true;
                          closeMega();
                        }}
                      />
                    )}
                  </AnimatePresence>
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
              aria-label={navCopy.resumeLabel}
            >
              {navCopy.resume}
            </Button>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-primary hover:bg-primary/5 md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? navCopy.closeMenu : navCopy.openMenu}
              onClick={() => (open ? closeMobile() : setOpen(true))}
            >
              {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            </button>
          </div>
        </nav>

        <div
          id="mobile-menu"
          hidden={!open}
          className="max-h-[calc(100svh-var(--nav-height))] overflow-y-auto border-t border-primary/10 md:hidden"
        >
          <ul className="mx-auto flex max-w-[1200px] flex-col px-5 py-4 sm:px-8">
            {nav.map((link) => {
              const isActive = active === link.href;
              const dot = isActive && (
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
              );

              if (link.href === WORK_HREF) {
                return (
                  <li key={link.href} className="border-b border-primary/10">
                    <button
                      type="button"
                      aria-expanded={mobileWorkOpen}
                      aria-controls="mobile-work-list"
                      onClick={() => setMobileWorkOpen((o) => !o)}
                      className="flex w-full items-center justify-between py-4 text-left font-serif text-2xl text-primary"
                    >
                      <span className="flex items-center gap-3">
                        {link.label}
                        {dot}
                      </span>
                      <ChevronDown
                        size={20}
                        aria-hidden
                        className={`transition-transform duration-200 ${mobileWorkOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    <ul id="mobile-work-list" hidden={!mobileWorkOpen} className="pb-3">
                      {caseStudies.map((study) => (
                        <li key={study.slug}>
                          <a
                            href={`#${study.slug}`}
                            onClick={closeMobile}
                            className="block rounded-md px-3 py-2.5 hover:bg-accent-soft"
                          >
                            <span className="block text-[0.95rem] font-medium text-primary">
                              {study.company}
                            </span>
                            <span className="block text-sm text-primary-soft">{study.role}</span>
                          </a>
                        </li>
                      ))}
                      <li>
                        <a
                          href={WORK_HREF}
                          onClick={closeMobile}
                          className="block rounded-md px-3 py-2.5 text-sm text-primary underline decoration-primary/25 underline-offset-4 hover:bg-accent-soft"
                        >
                          {navCopy.allWork}
                        </a>
                      </li>
                    </ul>
                  </li>
                );
              }

              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={closeMobile}
                    aria-current={isActive ? "location" : undefined}
                    className="flex items-center justify-between border-b border-primary/10 py-4 font-serif text-2xl text-primary"
                  >
                    {link.label}
                    {dot}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </header>
    </>
  );
}
