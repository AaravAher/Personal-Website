"use client";

import { useSyncExternalStore } from "react";
import { heroClock } from "@/content/site";

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: heroClock.timeZone,
  hour: "numeric",
  minute: "2-digit",
});

/** Fires on the next minute boundary, then every 60s. */
function subscribe(onChange: () => void) {
  let interval: number | undefined;
  const msToNextMinute = 60_000 - (Date.now() % 60_000) + 50;
  const timeout = window.setTimeout(() => {
    onChange();
    interval = window.setInterval(onChange, 60_000);
  }, msToNextMinute);
  return () => {
    window.clearTimeout(timeout);
    window.clearInterval(interval);
  };
}

/**
 * Boston local time, e.g. "2:14 PM". The server and static HTML get the
 * placeholder; the browser swaps in the real time after hydration, so the
 * markup never mismatches.
 */
export function useBostonTime() {
  return useSyncExternalStore(
    subscribe,
    () => formatter.format(Date.now()),
    () => heroClock.placeholder,
  );
}
