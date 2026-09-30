import { Camera, CircleDot, Flag, Gamepad2, TrendingUp, Watch, type LucideIcon } from "lucide-react";
import { interests, interestsSection, type InterestIcon } from "@/content/site";

const ICONS: Record<InterestIcon, LucideIcon> = {
  flag: Flag,
  "table-tennis": CircleDot, // lucide has no table-tennis icon; a ball reads well
  watch: Watch,
  camera: Camera,
  "trending-up": TrendingUp,
  gamepad: Gamepad2,
};

// Each half of the loop repeats the list, so it is always wider than the screen.
const REPEATS_PER_HALF = 3;

function Items({ hidden }: { hidden?: boolean }) {
  return (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {interests.map(({ label, icon }) => {
        const Icon = ICONS[icon];
        return (
          <li key={label} className="flex items-center whitespace-nowrap">
            <span className="inline-flex items-center gap-2 px-5 text-xs font-medium uppercase tracking-[0.2em] text-primary sm:px-7">
              <Icon size={14} aria-hidden className="text-primary-soft" />
              {label}
            </span>
            <span aria-hidden className="text-accent">
              ·
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** A slim, slow marquee of interests. Pauses on hover; static and wrapped under reduced motion. */
export function InterestsStrip() {
  const copies = Array.from({ length: REPEATS_PER_HALF * 2 }, (_, i) => i);
  return (
    <section id="interests" aria-label={interestsSection.label} className="group overflow-hidden border-y border-primary/15 py-5">
      <div className="flex w-max animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center">
        {copies.map((i) => (
          <div key={i} className={i === 0 ? "flex" : "flex motion-reduce:hidden"}>
            <Items hidden={i > 0} />
          </div>
        ))}
      </div>
    </section>
  );
}
