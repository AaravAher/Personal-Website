import type { Metadata } from "next";
import { Plane } from "lucide-react";
import { notFoundCopy } from "@/content/site";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

// Next marks not-found pages noindex on its own.
export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <>
      <Nav linkBase="/" />
      <main id="main" className="flex min-h-[70svh] items-center pb-20 pt-[calc(var(--nav-height)+4rem)]">
        <Container>
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-primary-soft">
            <Plane size={14} aria-hidden />
            {notFoundCopy.overline}
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.05] tracking-tight text-primary sm:text-7xl">
            {notFoundCopy.title}
          </h1>
          <p className="mt-5 text-lg text-primary-soft">{notFoundCopy.text}</p>
          <div className="mt-10">
            <Button href="/">{notFoundCopy.cta}</Button>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
