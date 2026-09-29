/**
 * ALL site text and data lives in this file.
 * Edit here; components only read from it.
 */

/* ───────────────────────────── Types ───────────────────────────── */

export type Personal = {
  name: string;
  firstName: string;
  monogram: string;
  tagline: string;
  location: string;
  email: string;
  phone: string;
  /** Set to false to hide the phone number everywhere on the site. */
  showPhone: boolean;
  linkedin: string;
  resume: string;
};

export type EducationItem = {
  school: string;
  /** Short label shown in the About education strip. */
  shortName: string;
  detail: string;
  keyLine: string;
  location?: string;
  dates?: string;
};

export type MediaItem =
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "video"; videoUrl: string; title: string; caption?: string };

export type HeadlineMetric = {
  value: string;
  label: string;
};

export type Market = {
  country: string;
  /** ISO 3166-1 alpha-3 code, for the world-map visual. */
  iso3: string;
  region: string;
};

export type CaseStudy = {
  slug: string;
  company: string;
  role: string;
  location: string;
  dates: string;
  context: string;
  whatIDid: string[];
  headlineMetric: HeadlineMetric;
  /** Optional supporting line under the headline metric. */
  metricNote?: string;
  media: MediaItem[];
  /** Embed URL (YouTube/Vimeo). Leave empty to hide. */
  videoUrl?: string;
  /** Used by the Celona world-map visual. */
  markets?: Market[];
};

export type ExperienceCard = {
  slug: string;
  company: string;
  role: string;
  location?: string;
  dates: string;
  summary: string;
};

export type LinkedItem = {
  label: string;
  title: string;
  description?: string;
  /** Leave empty until the link is live. */
  url: string;
};

export type AwardsAndProjects = {
  coursework: string[];
  simulations: string[];
  projects: LinkedItem[];
};

export type Language = {
  name: string;
  nativeName: string;
  /** "More about me" in the language's own script. */
  moreAboutMe: string;
  /** BCP-47 tag so screen readers pronounce it correctly. */
  lang: string;
};

export type GalleryImage = {
  src: string;
  alt: string;
  caption: string;
};

export type OffTheClockItem = {
  slug: string;
  title: string;
  role?: string;
  dates?: string;
  summary: string;
  media: MediaItem[];
};

export type Interest = {
  label: string;
  optional?: boolean;
};

export type NavLink = {
  label: string;
  href: `#${string}`;
};

/* ───────────────────────────── Data ───────────────────────────── */

export const personal: Personal = {
  name: "Aarav Aher",
  firstName: "Aarav",
  monogram: "AA",
  // TODO: Aarav to edit
  tagline:
    "International business student building at the intersection of markets, products and people.",
  location: "Mumbai → Boston",
  email: "aher.aa@northeastern.edu",
  phone: "+1 (617) 608-7903",
  showPhone: true,
  linkedin: "https://www.linkedin.com/in/aarav-aher",
  resume: "/resume/Aarav_Aher_Resume.pdf",
};

/** Quick facts beside the name in the hero (desktop). Keep to four. */
export const atAGlance: { label: string; value: string }[] = [
  { label: "Studying", value: "BS International Business, Northeastern \u201929" },
  { label: "Focus", value: "Supply Chain & Marketing" },
  { label: "Record", value: "301 units sold in one day at Skillmatics" },
  { label: "Building", value: "PlannrAI, 50+ beta users" },
];

/** Digits-only phone for tel: links. */
export const phoneHref = `tel:${personal.phone.replace(/[^\d+]/g, "")}`;

export const nav: NavLink[] = [
  { label: "Work", href: "#work" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Off the Clock", href: "#off-the-clock" },
  { label: "Contact", href: "#contact" },
];

// TODO: Aarav to rewrite. Placeholder bio, three short paragraphs.
export const bio: string[] = [
  "I grew up in Mumbai, a city where every street corner is a small lesson in trade: what sells, who buys it, and how it got there. That curiosity about how businesses actually reach people has followed me ever since.",
  "Today I study International Business at Northeastern's D'Amore-McKim School of Business, concentrating in Supply Chain and Marketing, after a semester abroad at the University of Glasgow. I'm most drawn to the question of how a product finds its way into a new market, from research and pricing to the shelf.",
  "Outside class I'm building PlannrAI, an AI day-planner for college students, where I wrote the core app and run go-to-market. I'm looking for co-op and internship roles where I can do the same: dig into a market, then help a product win in it.",
];

export const education: EducationItem[] = [
  {
    school: "Northeastern University",
    shortName: "Northeastern",
    detail: "D'Amore-McKim School of Business",
    keyLine:
      "BS International Business, Supply Chain & Marketing concentration",
    location: "Boston, MA",
    dates: "Expected May 2029",
  },
  {
    school: "University of Glasgow",
    shortName: "Glasgow",
    detail: "Semester Study Abroad",
    keyLine: "Principles of Microeconomics, Rhetorical Devices in English",
    location: "Glasgow, UK",
  },
  {
    school: "Hiranandani Foundation International High School",
    shortName: "High School",
    detail: "Hiranandani Foundation International",
    keyLine:
      "Subject Topper, ranked first in Business, Mathematics and Environmental Science",
    location: "Mumbai, India",
  },
];

export const caseStudies: CaseStudy[] = [
  {
    slug: "plannrai",
    company: "PlannrAI",
    role: "Co-Founder & Developer",
    location: "Boston, MA",
    dates: "Jan 2026 – Present",
    context: "An AI-powered day-planning app built for college students.",
    whatIDid: [
      "Built the core application, owning the architecture and technical implementation.",
      "Lead all marketing and sales: go-to-market strategy, user acquisition and brand positioning.",
    ],
    headlineMetric: { value: "50+", label: "beta users" },
    metricNote: "About 100 more students have shown interest.",
    media: [
      // Add screenshots to /public/images/plannrai/, e.g.:
      // { type: "image", src: "/images/plannrai/screen-1.png", alt: "PlannrAI daily plan view" },
    ],
    videoUrl: "",
  },
  {
    slug: "skillmatics",
    company: "Skillmatics (Gouda Games)",
    role: "Marketing & Strategy Intern",
    location: "Mumbai, India",
    dates: "May – Jul 2026",
    context:
      "Gouda Games, a Skillmatics brand, was preparing its first physical retail presence in Mumbai.",
    whatIDid: [
      "Led a retail distribution initiative for the brand's first physical store presence, identifying 20+ retail locations and building placement and pricing strategy across store formats.",
      "Represented the brand at All You Can Mumbai, selling 100+ units on the ground.",
      "Ran market research and wrote go-to-market documents for two new product launches, presented to the Founder and CPO.",
    ],
    headlineMetric: { value: "301", label: "units sold in a single day" },
    metricNote: "A company record.",
    media: [],
  },
  {
    slug: "celona",
    company: "Celona Inc.",
    role: "International Business Intern",
    location: "Bay Area, CA",
    dates: "Apr – Jun 2024",
    context:
      "Celona was evaluating markets ahead of its global expansion.",
    whatIDid: [
      "Conducted primary market research across 6 target markets ahead of global expansion.",
      "Synthesized competitive, regulatory and demand data into a foreign-market analysis presented to the CEO and 20+ leaders.",
    ],
    headlineMetric: { value: "6", label: "markets analyzed" },
    media: [],
    markets: [
      { country: "Mexico", iso3: "MEX", region: "Americas" },
      { country: "Japan", iso3: "JPN", region: "Asia-Pacific" },
      { country: "Saudi Arabia", iso3: "SAU", region: "Middle East" },
      { country: "Turkey", iso3: "TUR", region: "Europe / Middle East" },
      { country: "United Kingdom", iso3: "GBR", region: "Europe" },
      { country: "Malaysia", iso3: "MYS", region: "Asia-Pacific" },
    ],
  },
];

export const otherExperience: ExperienceCard[] = [
  {
    slug: "scorpio",
    company: "Scorpio India",
    role: "Intern (Part-Time)",
    location: "Mumbai, India",
    dates: "Jul 2024",
    summary:
      "Managed payment negotiations with 3 major vessel clients, issued 2 legal notices, and sped up claim resolution by 7+ days while keeping client relationships intact.",
  },
  {
    slug: "scholastic",
    company: "Scholastic India",
    role: "HR Intern (Part-Time, School Partnership)",
    dates: "2023 – 2024",
    summary:
      "Coordinated a book launch event with 1,000+ guests, covering logistics, vendors and on-the-day execution.",
  },
];

export const awardsAndProjects: AwardsAndProjects = {
  coursework: [
    "Business Statistics",
    "Supply-Chain Management",
    "Decision Making in Developed and Emerging Markets",
  ],
  simulations: [
    "Market-Entry Simulation",
    "Supply-Chain Management Simulation",
  ],
  projects: [
    {
      label: "AI-powered Web Design Studio",
      title: "SiteSmith",
      url: "",
    },
    {
      label: "Writing · Published Author",
      title: "BasisPoint Insight",
      url: "",
    },
  ],
};

export const languages: Language[] = [
  { name: "English", nativeName: "English", moreAboutMe: "More about me", lang: "en" },
  { name: "Hindi", nativeName: "हिंदी", moreAboutMe: "मेरे बारे में और", lang: "hi" },
  { name: "Marathi", nativeName: "मराठी", moreAboutMe: "माझ्याबद्दल अधिक", lang: "mr" },
  { name: "Gujarati", nativeName: "ગુજરાતી", moreAboutMe: "મારા વિશે વધુ", lang: "gu" },
  { name: "Spanish", nativeName: "Español", moreAboutMe: "Más sobre mí", lang: "es" },
];

export const gallery: GalleryImage[] = [
  // Add photos to /public/images/gallery/, e.g.:
  // { src: "/images/gallery/01.jpg", alt: "Describe the photo", caption: "Short caption" },
];

export const offTheClock: OffTheClockItem[] = [
  {
    slug: "football",
    title: "Football",
    dates: "2023 – 2025",
    summary:
      "Played in a national-level tournament in India and led my club team to a third-place finish in the state league.",
    media: [],
  },
  {
    slug: "asha",
    title: "Asha Foundation",
    role: "Volunteer Educator",
    dates: "2022 – 2024",
    summary:
      "Taught 50+ underprivileged children and co-developed lesson plans with NGO leadership.",
    media: [],
  },
];

export const interests: Interest[] = [
  { label: "Formula 1" },
  { label: "Table Tennis" },
  { label: "Watches" },
  { label: "Photography", optional: true },
  { label: "Investing", optional: true },
  { label: "Gaming", optional: true },
];

export const headshot = {
  src: "/images/headshot/headshot.jpg",
  alt: "Portrait of Aarav Aher",
};
