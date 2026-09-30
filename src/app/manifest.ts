import type { MetadataRoute } from "next";
import { seo } from "@/content/site";
import { colors } from "@/content/tokens";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: seo.siteName,
    short_name: seo.siteName,
    description: seo.description,
    start_url: "/",
    display: "browser",
    background_color: colors.base,
    theme_color: colors.base,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
