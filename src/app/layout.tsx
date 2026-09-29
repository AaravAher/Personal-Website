import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
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
      className={`${inter.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body className="bg-base font-sans text-primary">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
