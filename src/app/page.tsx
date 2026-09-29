import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { SectionPlaceholder } from "@/components/SectionPlaceholder";
import { Footer } from "@/components/Footer";
import { Work } from "@/components/case-study/Work";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <About />

        <Work />
        <SectionPlaceholder
          id="experience"
          index="03"
          eyebrow="Also"
          title="Other experience"
          contents={["Scorpio India", "Scholastic India"]}
          tone="deep"
        />
        <SectionPlaceholder
          id="projects"
          index="04"
          eyebrow="Beyond the classroom"
          title="Awards & projects"
          contents={["Coursework", "Simulations", "SiteSmith", "BasisPoint Insight"]}
        />
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
