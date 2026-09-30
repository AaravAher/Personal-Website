import type { MetadataRoute } from "next";
import { personal, seo } from "@/content/site";

export const dynamic = "force-static";

/** Built once; lastModified is the build time. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${seo.siteUrl}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${seo.siteUrl}${personal.resume}`, lastModified, changeFrequency: "monthly", priority: 0.5 },
  ];
}
