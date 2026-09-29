"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, FileText, Menu, X } from "lucide-react";
import { nav, navCopy, navMenus, personal } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { NavDropdown } from "@/components/NavDropdown";

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
  // Only one desktop dropdown can be open at a time (its nav href, or null).
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  // Which mobile menu group is expanded.
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);

  // A close only applies if that menu is still the open one, so a late close
  // timer from Work can't shut Projects after the pointer has moved across.
  // Stable per-link handlers, so an open dropdown keeps its listeners across renders.
  const menuHandlers = useMemo(
    () =>
      Object.fromEntries(
        nav.map((link) => [
          link.href,
          (isOpen: boolean) =>
            setOpenMenu((cur) => (isOpen ? link.href : cur === link.href ? null : cur)),
        ]),
      ),
    [],
  );

  const closeMobile = () => {
    setOpen(false);
    setMobileGroup(null);
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

  const headerTone = open
    ? "border-b border-primary/10 bg-base"
    : scrolled
      ? "border-b border-primary/10 bg-base/85 backdrop-blur-md"
      : "bg-transparent";

  return (
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
              const menu = navMenus[link.href];
              if (menu) {
                return (
                  <NavDropdown
                    key={link.href}
                    id={link.href.slice(1)}
                    label={link.label}
                    href={link.href}
                    menu={menu}
                    open={openMenu === link.href}
                    switching={openMenu !== null && openMenu !== link.href}
                    onOpenChange={menuHandlers[link.href]}
                    current={active === link.href}
                  />
                );
              }
              const isActive = active === link.href;
              return (
                <li key={link.href} className="flex items-center">
                  <a
                    href={link.href}
                    aria-current={isActive ? "location" : undefined}
                    className="group relative py-2 text-sm text-primary"
                  >
                    {link.label}
                    <span
                      aria-hidden
                      className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full transition-transform duration-300 ${
                        isActive
                          ? "scale-x-100 bg-accent"
                          : "scale-x-0 bg-primary/30 group-hover:scale-x-100"
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

              const menu = navMenus[link.href];
              if (menu) {
                const expanded = mobileGroup === link.href;
                const listId = `mobile-${link.href.slice(1)}-list`;
                return (
                  <li key={link.href} className="border-b border-primary/10">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-controls={listId}
                      onClick={() => setMobileGroup(expanded ? null : link.href)}
                      className="flex w-full items-center justify-between py-4 text-left font-serif text-2xl text-primary"
                    >
                      <span className="flex items-center gap-3">
                        {link.label}
                        {dot}
                      </span>
                      <ChevronDown
                        size={20}
                        aria-hidden
                        className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                      />
                    </button>
                    <ul id={listId} hidden={!expanded} className="pb-3">
                      {menu.items.map((row) => (
                        <li key={row.href}>
                          <a
                            href={row.href}
                            onClick={closeMobile}
                            className="block rounded-md px-3 py-2.5 hover:bg-accent-soft"
                          >
                            <span className="block text-[0.95rem] font-medium text-primary">
                              {row.title}
                            </span>
                            <span className="block text-sm text-primary-soft">{row.subtitle}</span>
                          </a>
                        </li>
                      ))}
                      <li>
                        <a
                          href={link.href}
                          onClick={closeMobile}
                          className="block rounded-md px-3 py-2.5 text-sm text-primary underline decoration-primary/25 underline-offset-4 hover:bg-accent-soft"
                        >
                          {menu.allLabel}
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
  );
}
