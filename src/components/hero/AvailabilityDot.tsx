/** Small teal "live" dot with a slow, soft pulse ring (static under reduced motion). */
export function AvailabilityDot({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`relative inline-flex h-2 w-2 shrink-0 ${className}`}>
      <span className="absolute inset-0 rounded-full bg-accent animate-[pulse-ring_2.4s_ease-out_infinite] motion-reduce:animate-none" />
      <span className="relative h-2 w-2 rounded-full bg-accent" />
    </span>
  );
}
