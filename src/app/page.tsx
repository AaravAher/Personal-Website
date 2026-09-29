import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { SectionPlaceholder } from "@/components/SectionPlaceholder";
import { Footer } from "@/components/Footer";
import { Work } from "@/components/case-study/Work";
import { OtherExperience } from "@/components/experience/OtherExperience";
import { ProjectsIndex } from "@/components/ProjectsIndex";

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
        <SectionPlaceholder
          id="languages"
          eyebrow="In five languages"
          title="More about me"
          contents={["English", "हिंदी", "मराठी", "ગુજરાતી", "Español"]}
          tone="deep"
        />
        <SectionPlaceholder
          id="off-the-clock"
          index="05"
          eyebrow="Off the clock"
          title="Life outside work"
          contents={["Gallery", "Football", "Asha Foundation"]}
        />
        <SectionPlaceholder
          id="interests"
          eyebrow="Currently into"
          title="Interests"
          contents={["Formula 1", "Table Tennis", "Watches"]}
          tone="deep"
        />
      </main>
      <Footer />
    </>
  );
}
