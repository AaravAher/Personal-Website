import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, Noto_Serif_Devanagari, Noto_Serif_Gujarati } from "next/font/google";
import { MotionProvider } from "@/components/MotionProvider";
import { personal } from "@/content/site";
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

export const metadata: Metadata = {
  title: `${personal.name} | International Business, Northeastern`,
  description: personal.tagline,
};

export const viewport: Viewport = {
  // Mobile browser chrome colour. Metadata can't read CSS variables; keep in sync with --color-base.
  themeColor: "#faf7f0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${notoDevanagari.variable} ${notoGujarati.variable} antialiased`}
    >
      <body className="bg-base font-sans text-primary">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
