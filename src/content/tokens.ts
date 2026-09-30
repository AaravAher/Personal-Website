/**
 * The 60-30-10 colour tokens as hex, for places that can't read CSS
 * variables: the share image, icons, the web manifest and the browser theme
 * colour. Keep in sync with the @theme block in src/app/globals.css.
 */
export const colors = {
  base: "#faf7f0", // 60%: cream background
  baseDeep: "#f3eee3",
  primary: "#1b2a41", // 30%: navy
  primarySoft: "#4a5a73",
  accent: "#0f7c74", // 10%: teal
} as const;
