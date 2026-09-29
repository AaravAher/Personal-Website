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

export type Metric = {
  /** Keep prefixes/suffixes like "~" and "+" in the string; they survive the count-up. */
  value: string;
  label: string;
};

export type Market = {
  country: string;
  /** Flag emoji shown on the market chip. */
  flag: string;
  /** ISO 3166-1 alpha-3 code, for the world-map visual. */
  iso3: string;
  region: string;
};

export type ImageAspect = "landscape" | "portrait" | "square";

export type SlotImage = {
  /** Leave empty to show a placeholder. Fill with e.g. "/images/plannrai/screen-1.png". */
  src: string;
  alt: string;
  caption?: string;
  aspect: ImageAspect;
  /** Label shown on the placeholder, e.g. "PlannrAI screenshot 2". */
  slot: string;
  /** Overrides the default recommended size for this aspect. */
  recommendedSize?: string;
};

export type VideoSource = {
  provider: "youtube" | "vimeo";
  /** The video id only, e.g. "dQw4w9WgXcQ". Leave empty to show "coming soon". */
  id: string;
  title: string;
  /** Optional poster image. YouTube falls back to its own thumbnail. */
  poster?: string;
};

export type CaseStudy = {
  slug: "plannrai" | "skillmatics" | "celona";
  company: string;
  role: string;
  location: string;
  dates: string;
  /** One sentence shown under the title. */
  oneLiner: string;
  /** Two or three sentences: "The situation". */
  context: string;
  whatIDid: string[];
  /** First is the headline metric; up to two more are supporting. */
  metrics: Metric[];
  skills: string[];
  media: {
    video?: VideoSource;
    images: SlotImage[];
  };
  /** Celona only: chips below the photos and the world-map visual later. */
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

/** Copy for the Work section and case study layout. */
export const workSection = {
  eyebrow: "Work",
  title: "Selected work",
  // TODO: Aarav to rewrite
  intro:
    "Three roles where I helped a product or a brand reach a new market, from the first research to units sold.",
  caseStudyLabel: "Case study",
  situationHeading: "The situation",
  whatIDidHeading: "What I did",
  skillsHeading: "Skills",
  marketsHeading: "Markets researched",
  screenshotsLabel: "screenshots",
  photosLabel: "photos",
};

/** Shared UI strings for media components. */
export const mediaCopy = {
  videoComingSoon: "Product walkthrough — coming soon",
  playVideo: "Play video",
  openImage: "View larger",
  lightboxLabel: "Image viewer",
  closeLightbox: "Close image viewer",
  previousImage: "Previous image",
  nextImage: "Next image",
  recommendedPrefix: "Recommended",
};

/** Default recommended upload size per image aspect (shown on placeholders). */
export const recommendedSizes: Record<ImageAspect, string> = {
  landscape: "1600 × 1000 px",
  portrait: "1170 × 2532 px",
  square: "1200 × 1200 px",
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "plannrai",
    company: "PlannrAI",
    role: "Co-Founder & Developer",
    location: "Boston, MA",
    dates: "Jan 2026 – Present",
    // TODO: Aarav to rewrite
    oneLiner: "An AI-powered day-planning app built for college students.",
    // TODO: Aarav to rewrite
    context:
      "College students juggle classes, clubs, jobs and deadlines, and most planners leave them to stitch it all together by hand. PlannrAI uses AI to turn that into a realistic plan for the day. I co-founded it in January 2026 and own both how it's built and how it reaches students.",
    whatIDid: [
      "Built and developed the core application, contributing directly to product architecture and technical implementation.",
      "Leading all marketing and sales efforts, including go-to-market strategy, user acquisition and brand positioning.",
      "Launched beta testing with 50+ active users, with interest from about 100 additional students ahead of wider release.",
    ],
    metrics: [
      { value: "50+", label: "active beta users" },
      { value: "~100", label: "students on the waitlist" },
    ],
    skills: ["Product", "GTM", "User Acquisition", "Brand Positioning"],
    media: {
      // Paste the YouTube or Vimeo id (not the full URL) once the video is up.
      video: { provider: "youtube", id: "", title: "PlannrAI product walkthrough" },
      images: [
        // TODO: describe each screen in its alt text once added.
        { src: "", alt: "PlannrAI app screen", aspect: "portrait", slot: "PlannrAI screenshot 1" }, // /images/plannrai/screen-1.png
        { src: "", alt: "PlannrAI app screen", aspect: "portrait", slot: "PlannrAI screenshot 2" }, // /images/plannrai/screen-2.png
        { src: "", alt: "PlannrAI app screen", aspect: "portrait", slot: "PlannrAI screenshot 3" }, // /images/plannrai/screen-3.png
        { src: "", alt: "PlannrAI app screen", aspect: "portrait", slot: "PlannrAI screenshot 4" }, // /images/plannrai/screen-4.png
      ],
    },
  },
  {
    slug: "skillmatics",
    company: "Skillmatics (Gouda Games)",
    role: "Marketing & Strategy Intern",
    location: "Mumbai, India",
    dates: "May – Jul 2026",
    // TODO: Aarav to rewrite
    oneLiner:
      "Took an adult party-games brand from online-only into physical retail in Mumbai.",
    // TODO: Aarav to rewrite
    context:
      "Gouda Games, Skillmatics' adult party-games brand, had only ever sold online. Summer 2026 was its first move onto physical shelves in Mumbai, where placement, pricing and store format decide whether a game gets picked up. I joined the marketing and strategy team to help make that launch work.",
    whatIDid: [
      "Led a retail distribution initiative to establish Gouda Games' first physical presence across stores in Mumbai, identifying 20+ optimal retail locations and developing product placement and pricing strategies across multiple store formats.",
      "Represented Gouda Games at the All You Can Mumbai event, driving direct sales and moving 100+ units on the ground.",
      "Conducted market research for two new product launches and prepared and presented GTM documentation to the Founder and CPO.",
      "Contributed to a record-breaking sales day for the brand: 301 units sold in a single day, the highest in the company's history.",
    ],
    metrics: [
      { value: "301", label: "units in one day, a company record" },
      { value: "20+", label: "retail locations identified" },
      { value: "100+", label: "units sold at All You Can Mumbai" },
    ],
    skills: ["Retail Distribution", "Pricing", "Market Research", "GTM", "Event Sales"],
    media: {
      // TODO: Aarav to confirm captions and alt text once photos are chosen.
      images: [
        { src: "", alt: "The Gouda Games stall at All You Can Mumbai", caption: "All You Can Mumbai stall", aspect: "landscape", slot: "Skillmatics photo 1", recommendedSize: "2000 × 1250 px" }, // /images/skillmatics/photo-1.jpg
        { src: "", alt: "Gouda Games products placed in a Mumbai store", caption: "In-store placement", aspect: "portrait", slot: "Skillmatics photo 2", recommendedSize: "1200 × 1800 px" }, // /images/skillmatics/photo-2.jpg
        { src: "", alt: "Selling Gouda Games to visitors at the event", caption: "On the ground at the event", aspect: "landscape", slot: "Skillmatics photo 3", recommendedSize: "1600 × 1200 px" }, // /images/skillmatics/photo-3.jpg
        { src: "", alt: "Gouda Games shelf display with pricing", caption: "Shelf and pricing setup", aspect: "landscape", slot: "Skillmatics photo 4", recommendedSize: "1600 × 1200 px" }, // /images/skillmatics/photo-4.jpg
        { src: "", alt: "Presenting go-to-market plans to the Skillmatics leadership", caption: "GTM presentation", aspect: "landscape", slot: "Skillmatics photo 5", recommendedSize: "2000 × 900 px" }, // /images/skillmatics/photo-5.jpg
      ],
    },
  },
  {
    slug: "celona",
    company: "Celona Inc.",
    role: "International Business Intern",
    location: "Bay Area, CA",
    dates: "Apr – Jun 2024",
    // TODO: Aarav to rewrite
    oneLiner: "Market research across six countries ahead of a global expansion.",
    // TODO: Aarav to rewrite
    context:
      "Celona was preparing to expand beyond the US and needed to know which international markets to prioritise. I joined the international business department to research six candidate markets across four regions and turn the findings into something leadership could act on.",
    whatIDid: [
      "Joined the international business department ahead of the company's global expansion, conducting primary market research across 6 target markets.",
      "Synthesized competitive, regulatory and demand data into a comprehensive foreign-market analysis.",
      "Presented the analysis to the CEO and 20+ leaders across international business and marketing.",
    ],
    metrics: [
      { value: "6", label: "markets analyzed" },
      { value: "20+", label: "leaders presented to" },
    ],
    skills: [
      "Market Research",
      "Competitive Analysis",
      "Regulatory Research",
      "Executive Presentation",
    ],
    media: {
      // TODO: Aarav to confirm captions and alt text once photos are chosen.
      images: [
        { src: "", alt: "Presenting the foreign-market analysis", caption: "Presenting the market analysis", aspect: "landscape", slot: "Celona photo 1" }, // /images/celona/photo-1.jpg
        { src: "", alt: "With the Celona international business team", caption: "International business team", aspect: "landscape", slot: "Celona photo 2" }, // /images/celona/photo-2.jpg
        { src: "", alt: "Celona office in the Bay Area", caption: "Celona, Bay Area", aspect: "landscape", slot: "Celona photo 3" }, // /images/celona/photo-3.jpg
      ],
    },
    markets: [
      { country: "Mexico", flag: "🇲🇽", iso3: "MEX", region: "Americas" },
      { country: "Japan", flag: "🇯🇵", iso3: "JPN", region: "Asia-Pacific" },
      { country: "Saudi Arabia", flag: "🇸🇦", iso3: "SAU", region: "Middle East" },
      { country: "Turkey", flag: "🇹🇷", iso3: "TUR", region: "Europe / Middle East" },
      { country: "United Kingdom", flag: "🇬🇧", iso3: "GBR", region: "Europe" },
      { country: "Malaysia", flag: "🇲🇾", iso3: "MYS", region: "Asia-Pacific" },
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
