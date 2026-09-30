"use client";

import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import type { NavMenu } from "@/content/site";
import { usePrefersReducedMotion } from "@/components/ui/usePrefersReducedMotion";

/** Hover intent: open after a short hover, close after leaving link and dropdown. */
const OPEN_DELAY = 80;
const CLOSE_DELAY = 180;

type NavDropdownProps = {
  /** Used for the dropdown's element id, e.g. "work" → "work-menu". */
  id: string;
  label: string;
  href: string;
  /** Prefix for in-page row links ("/" off the home page). */
  linkBase?: string;
  menu: NavMenu;
  open: boolean;
  /** Another dropdown is open: this one should vanish instantly, not fade. */
  switching: boolean;
  onOpenChange: (open: boolean) => void;
  /** This link's section is the one in view. */
  current: boolean;
};

/**
 * A nav link with a compact dropdown anchored under it. Hover (mouse only)
 * opens it with intent delays; Enter/Space/Down open it from the keyboard.
 * Esc, scroll, outside click, Tab-out and resizing to mobile close it.
 */
export function NavDropdown({
  id,
  label,
  href,
  linkBase = "",
  menu,
  open,
  switching,
  onOpenChange,
  current,
}: NavDropdownProps) {
  const reduce = usePrefersReducedMotion();
  const menuId = `${id}-menu`;
  const itemRef = useRef<HTMLLIElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  // After clicking the link itself, don't reopen until the pointer leaves.
  const suppressHover = useRef(false);
  const focusFirstOnOpen = useRef(false);

  const close = useCallback(
    (returnFocus = false) => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
      onOpenChange(false);
      if (returnFocus) linkRef.current?.focus();
    },
    [onOpenChange],
  );

  useEffect(() => {
    if (!open) return;
    if (focusFirstOnOpen.current) {
      focusFirstOnOpen.current = false;
      menuRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const onScroll = () => close();
    const onResize = () => window.innerWidth < 768 && close();
    const onPointerDown = (e: PointerEvent) => {
      if (!itemRef.current?.contains(e.target as Node)) close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, close]);

  useEffect(
    () => () => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
    },
    [],
  );

  // The <li> wraps both the link and the dropdown, so moving from one to the
  // other only runs the close delay (the dropdown's ::before bridges the gap).
  const onPointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || suppressHover.current) return;
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(() => onOpenChange(true), OPEN_DELAY);
  };
  const onPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    suppressHover.current = false;
    window.clearTimeout(openTimer.current);
    closeTimer.current = window.setTimeout(() => onOpenChange(false), CLOSE_DELAY);
  };
  const onLinkKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter" && e.key !== " " && e.key !== "ArrowDown") return;
    e.preventDefault();
    if (open) {
      menuRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    } else {
      focusFirstOnOpen.current = true;
      onOpenChange(true);
    }
  };
  // Up/Down move between rows inside the dropdown.
  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const links = [...(menuRef.current?.querySelectorAll<HTMLElement>("a") ?? [])];
    const i = links.indexOf(document.activeElement as HTMLElement);
    if (i === -1) return;
    e.preventDefault();
    links[(i + (e.key === "ArrowDown" ? 1 : -1) + links.length) % links.length]?.focus();
  };
  const onBlur = (e: React.FocusEvent<HTMLLIElement>) => {
    // Tabbing out of the link + dropdown closes it.
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) close();
  };

  const hidden = { opacity: 0, y: reduce ? 0 : -4 };
  const variants: Variants = {
    hidden,
    shown: { opacity: 1, y: 0, transition: { duration: 0.15, ease: "easeOut" } },
    // Switching to another dropdown: disappear at once so both never show.
    exit: (isSwitching: boolean) =>
      isSwitching ? { opacity: 0, transition: { duration: 0 } } : { ...hidden, transition: { duration: 0.15 } },
  };

  return (
    <li
      ref={itemRef}
      className="flex items-center"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onBlur={onBlur}
    >
      <div className="relative">
        <a
          ref={linkRef}
          href={href}
          aria-current={current ? "location" : undefined}
          aria-haspopup="true"
          aria-expanded={open}
          aria-controls={menuId}
          onKeyDown={onLinkKeyDown}
          onClick={() => {
            suppressHover.current = true;
            close();
          }}
          className="group relative flex items-center gap-1 py-2 text-sm text-primary"
        >
          {label}
          <ChevronDown
            size={14}
            aria-hidden
            className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
          <span
            aria-hidden
            className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-left rounded-full transition-transform duration-300 ${
              current || open
                ? "scale-x-100 bg-accent"
                : "scale-x-0 bg-primary/30 group-hover:scale-x-100"
            }`}
          />
        </a>

        <AnimatePresence custom={switching}>
          {open && (
            <motion.div
              ref={menuRef}
              id={menuId}
              role="region"
              aria-label={menu.label}
              onKeyDown={onMenuKeyDown}
              className="absolute left-0 top-full mt-2 w-[260px] rounded-lg border border-primary/15 bg-base p-1.5 shadow-lg shadow-primary/10 before:absolute before:inset-x-0 before:-top-2 before:h-2"
              custom={switching}
              variants={variants}
              initial="hidden"
              animate="shown"
              exit="exit"
            >
              <ul>
                {menu.items.map((row) => (
                  <li key={row.href}>
                    <a
                      href={`${linkBase}${row.href}`}
                      // No hover suppression here: the row under the pointer is
                      // removed, so no pointerleave would ever clear it.
                      onClick={() => close()}
                      className="group/row relative block rounded-md px-3 py-2.5 transition-colors hover:bg-accent-soft focus-visible:bg-accent-soft"
                    >
                      <span className="block text-[15px] font-semibold leading-snug text-primary">
                        {row.title}
                      </span>
                      <span className="block text-xs text-primary-soft">{row.subtitle}</span>
                      <ArrowRight
                        size={14}
                        aria-hidden
                        className="absolute right-3 top-1/2 -mt-[7px] -translate-x-1 text-primary opacity-0 transition-[opacity,transform] duration-150 group-hover/row:translate-x-0 group-hover/row:opacity-100 group-focus-visible/row:translate-x-0 group-focus-visible/row:opacity-100"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </li>
  );
}
