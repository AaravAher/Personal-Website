import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { SectionPlaceholder } from "@/components/SectionPlaceholder";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <About />

        <SectionPlaceholder
          id="work"
          index="02"
          eyebrow="Selected work"
          title="Case studies"
          contents={["PlannrAI", "Skillmatics (Gouda Games)", "Celona Inc."]}
          tone="deep"
        />
        <SectionPlaceholder
          id="experience"
          index="03"
          eyebrow="Also"
          title="Other experience"
          contents={["Scorpio India", "Scholastic India"]}
        />
        <SectionPlaceholder
          id="projects"
          index="04"
          eyebrow="Beyond the classroom"
          title="Awards & projects"
          contents={["Coursework", "Simulations", "SiteSmith", "BasisPoint Insight"]}
          tone="deep"
        />
        <SectionPlaceholder
          id="languages"
          eyebrow="In five languages"
          title="More about me"
          contents={["English", "हिंदी", "मराठी", "ગુજરાતી", "Español"]}
        />
        <SectionPlaceholder
          id="off-the-clock"
          index="05"
          eyebrow="Off the clock"
          title="Life outside work"
          contents={["Gallery", "Football", "Asha Foundation"]}
          tone="deep"
        />
        <SectionPlaceholder
          id="interests"
          eyebrow="Currently into"
          title="Interests"
          contents={["Formula 1", "Table Tennis", "Watches"]}
        />
      </main>
      <Footer />
    </>
  );
}
