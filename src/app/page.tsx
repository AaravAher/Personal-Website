import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { Work } from "@/components/case-study/Work";
import { OtherExperience } from "@/components/experience/OtherExperience";
import { ProjectsIndex } from "@/components/ProjectsIndex";
import { LanguageInterlude } from "@/components/life/LanguageInterlude";
import { OffTheClock } from "@/components/life/OffTheClock";
import { InterestsStrip } from "@/components/life/InterestsStrip";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Work />
        <OtherExperience />
        <ProjectsIndex />
        <LanguageInterlude />
        <OffTheClock />
        <InterestsStrip />
      </main>
      <Footer />
    </>
  );
}
