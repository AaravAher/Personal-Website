import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, Noto_Serif_Devanagari, Noto_Serif_Gujarati } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { MotionProvider } from "@/components/MotionProvider";
import { caseStudies, headshot, languages, personal, seo } from "@/content/site";
import { colors } from "@/content/tokens";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

// Indic scripts for the language interlude (Hindi and Marathi use Devanagari).
// One light weight each, to sit with Instrument Serif; not preloaded, so they
// only download when those phrases render.
const notoDevanagari = Noto_Serif_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: "300",
  display: "swap",
  preload: false,
});

const notoGujarati = Noto_Serif_Gujarati({
  variable: "--font-gujarati",
  subsets: ["gujarati"],
  weight: "300",
  display: "swap",
  preload: false,
});

// The share image (opengraph-image.tsx / twitter-image.tsx) and icons are
// file-based, so Next adds their tags automatically.
export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: { default: seo.title, template: seo.titleTemplate },
  description: seo.description,
  applicationName: seo.siteName,
  authors: [{ name: personal.name, url: seo.siteUrl }],
  creator: personal.name,
  keywords: seo.keywords,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/",
    siteName: seo.siteName,
    title: seo.title,
    description: seo.description,
    locale: seo.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
};

export const viewport: Viewport = {
  themeColor: colors.base,
  colorScheme: "light",
};

/** Person structured data, so search engines can match "Aarav Aher" to this site. */
const plannrai = caseStudies.find((c) => c.slug === "plannrai");
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personal.name,
  url: seo.siteUrl,
  image: `${seo.siteUrl}${headshot.src}-1600w.webp`,
  email: personal.email,
  jobTitle: seo.jobTitle,
  description: seo.description,
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: seo.university,
    department: { "@type": "Organization", name: seo.school },
  },
  knowsLanguage: languages.map((l) => l.name),
  sameAs: [personal.linkedin],
  ...(plannrai?.url && {
    worksFor: { "@type": "Organization", name: plannrai.company, url: plannrai.url },
  }),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${notoDevanagari.variable} ${notoGujarati.variable} antialiased`}
    >
      <body className="bg-base font-sans text-primary">
        <script
          type="application/ld+json"
          // JSON.stringify of our own data; "<" escaped so it can't close the tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
