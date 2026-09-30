// The X/Twitter card uses the same image as Open Graph.
import OpengraphImage from "./opengraph-image";
import { seo } from "@/content/site";

export const dynamic = "force-static";
export const alt = seo.shareImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default OpengraphImage;
