/**
 * ALL site text and data lives in this file.
 * Edit here; components only read from it.
 */

/* ───────────────────────────── Types ───────────────────────────── */

export type Personal = {
  name: string;
  firstName: string;
  monogram: string;
  /** Small letter-spaced line above the name in the hero. */
  overline: string;
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
  /** Shown in navy semibold in the About education rows. */
  school: string;
  /** Shown under the school in lighter navy. */
  detail: string;
  location?: string;
  /** Extra detail kept for reference; not currently shown on the site. */
  notes?: string;
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
  location: string;
  dates: string;
  /** Resume text, shown on the back of the flip card. */
  summary: string;
  /** Big number on the back of the flip card. */
  highlight: Metric;
};

export type Article = {
  title: string;
  /** Shown next to the title, e.g. "June 2026". */
  date: string;
  /** YYYY-MM, used to pick the most recent article. */
  published: string;
  url: string;
};

export type IndexEntry = {
  slug: string;
  name: string;
  /** Small letter-spaced label under the name. */
  type: string;
  /** Italic serif line above the description. Writing entries show their latest article instead. */
  lead?: string;
  description: string;
  /** Where the row links. Leave empty for "Link coming soon" (writing entries fall back to the latest article). */
  url: string;
  linkLabel: string;
  preview: SlotImage;
  articles?: Article[];
};

export type Course = {
  name: string;
  /** Short label for what the course is relevant to. */
  theme: string;
};

export type CourseGroup = {
  institution: string;
  courses: Course[];
};

export type Simulation = {
  name: string;
  theme: string;
  completed: boolean;
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
  overline: "International Business · Northeastern \u201929",
  // TODO: Aarav to edit
  tagline: "Building at the intersection of markets, products and people.",
  location: "Mumbai → Boston",
  email: "aher.aa@northeastern.edu",
  phone: "+1 (617) 608-7903",
  showPhone: true,
  linkedin: "https://www.linkedin.com/in/aarav-aher",
  resume: "/resume/Aarav_Aher_Resume.pdf",
};

export type HeroStat = {
  label: string;
  value: string;
  /** "clock": appends live Boston time. "availability": teal dot + mailto link. */
  kind?: "clock" | "availability";
};

/** Stats strip along the bottom of the hero. Keep to four. */
export const atAGlance: HeroStat[] = [
  { label: "Studying", value: "International Business, Northeastern" },
  { label: "Focus", value: "Supply Chain & Marketing" },
  { label: "Based in", value: "Boston, MA", kind: "clock" },
  { label: "Looking for", value: "Spring 2027 Co-op", kind: "availability" },
];

/** Live clock shown after "Based in". */
export const heroClock = {
  timeZone: "America/New_York",
  zoneLabel: "ET",
  /** Shown in the static HTML until the browser renders the real time. */
  placeholder: "--:--",
  separator: " · ",
};

export type RouteStop = {
  city: string;
  lat: number;
  lng: number;
  label: string;
  note: string;
  /** The current city: teal dot with a pulse; the route ends here. */
  current?: boolean;
  /** Part of the note that flashes teal when the plane lands, e.g. "Now". */
  noteHighlight?: string;
  /**
   * Northward bow of the leg that arrives at this stop, as a share of the
   * leg's length (default 0.22). Tune arc curvature here, not in the component.
   */
  bow?: number;
};

/**
 * Hero route map, flown in this order; it ends where I am now (Boston).
 * Each leg is drawn from the previous stop to this one.
 */
export const route: RouteStop[] = [
  { city: "Mumbai", lat: 19.08, lng: 72.88, label: "Mumbai", note: "Home" },
  // Longest leg: a gentle bow kept inside the map, passing below Glasgow and above Boston.
  { city: "Bay Area", lat: 37.77, lng: -122.42, label: "Bay Area", note: "Celona", bow: 0.3 },
  // East over Canada and Greenland, well above Boston and its label.
  { city: "Glasgow", lat: 55.86, lng: -4.25, label: "Glasgow", note: "Study abroad", bow: 0.36 },
  // Westbound across the Atlantic.
  { city: "Boston", lat: 42.36, lng: -71.06, label: "Boston", note: "Northeastern · Now", noteHighlight: "Now", current: true, bow: 0.22 },
];

/** Hero UI copy. */
export const heroCopy = {
  emailCta: "Email me",
  linkedinCta: "LinkedIn",
  newTab: "(opens in a new tab)",
  statsLabel: "At a glance",
  availabilityLabel: "Email me about",
  mapLabel: "Route map: Mumbai to the Bay Area to Glasgow to Boston",
  scrollCue: "Scroll",
  scrollCueLabel: "Scroll to About",
};

/** The "designed & built by me" seal next to the name in the hero. */
export const makersMark = {
  /** Runs around the circle; the trailing " · " closes the loop. */
  ring: "DESIGNED · BUILT · WRITTEN BY AARAV AHER · MMXXVI · ",
  tooltip: "This site: designed, built and written by me. Every section, every line.",
};

/** Footer copy. */
export const footerCopy = {
  colophon: "Designed and built by Aarav Aher. Set in Instrument Serif & Inter.",
  rights: "All rights reserved.",
};

/** Nav UI copy. */
export const navCopy = {
  resume: "Resume",
  resumeLabel: "Resume (opens PDF in a new tab)",
  skipLink: "Skip to content",
  openMenu: "Open menu",
  closeMenu: "Close menu",
};

/** About section UI copy. */
export const aboutCopy = {
  eyebrow: "About",
  educationHeading: "Education",
  contactHeading: "Contact",
  headshotPlaceholder: "Headshot placeholder",
  linkedinLabel: "LinkedIn",
  resumeLabel: "Resume",
};

/** Digits-only phone for tel: links. */
export const phoneHref = `tel:${personal.phone.replace(/[^\d+]/g, "")}`;

export const nav: NavLink[] = [
  { label: "Work", href: "#work" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Off the Clock", href: "#off-the-clock" },
  { label: "Contact", href: "#contact" },
];

export const bio =
  "As a second-year International Business and Analytics student at Northeastern University with a passion for entrepreneurship, global markets, and social impact, I am committed to building experiences that create meaningful change. I thrive on taking initiative, excel at working across cultures and industries, and bring drive to everything I pursue. With a foundation in international business and a focus on continuous growth, I'm eager to leverage my skills to make a difference and build something worthwhile.";

export const education: EducationItem[] = [
  {
    school: "Northeastern University",
    detail: "BS International Business, Supply Chain & Marketing · May 2029",
    location: "Boston, MA",
    notes: "D'Amore-McKim School of Business",
  },
  {
    school: "University of Glasgow",
    detail: "Semester Study Abroad",
    location: "Glasgow, UK",
    notes: "Principles of Microeconomics, Rhetorical Devices in English",
  },
  {
    school: "Hiranandani Foundation International High School",
    detail: "Subject Topper",
    location: "Mumbai, India",
    notes: "Ranked first in Business, Mathematics and Environmental Science",
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
    dates: "July 2024",
    summary:
      "Managed payment negotiations with 3 major vessel clients, issuing 2 legal notices and accelerating claim resolution by 7+ days while preserving long-term client relationships and future shipping orders.",
    highlight: { value: "7+ days", label: "faster claim resolution" },
  },
  {
    slug: "scholastic",
    company: "Scholastic India",
    role: "HR Intern (Part-Time, School Partnership)",
    location: "India",
    dates: "2023 – 2024",
    summary:
      "Partnered with HR leadership to coordinate a major book launch event attended by over 1,000 guests, managing logistics, vendor coordination, and on-the-day execution.",
    highlight: { value: "1,000+", label: "guests" },
  },
];

/** Copy for the Other Experience flip cards. */
export const experienceSection = {
  eyebrow: "Also",
  title: "Other experience",
  flipHint: "Flip for details",
};

/** "The Index": featured projects, coursework and simulations. */
export const projectsIndex = {
  eyebrow: "Index",
  title: "Projects, writing & coursework",
  linkComingSoon: "Link coming soon",
  newTab: "(opens in a new tab)",

  featured: [
    {
      slug: "sitesmith",
      name: "SiteSmith",
      type: "Studio · Co-founder",
      lead: "Websites that move at the speed of your idea.",
      description:
        "A Mumbai-based, AI-powered web design studio I co-founded with two friends. We build custom websites for personal brands and small businesses, fast and with no middlemen: clients work directly with the three of us from direction and design through to delivery.",
      url: "https://www.sitesmith.co.in/",
      linkLabel: "Visit site",
      // /images/projects/sitesmith.jpg
      preview: { src: "", alt: "SiteSmith website preview", aspect: "landscape", slot: "SiteSmith preview", recommendedSize: "1600 × 1000 px" },
    },
    {
      slug: "basispoint",
      name: "BasisPoint Insight",
      type: "Writing · Published author",
      description:
        "Published author at BasisPoint Insight. My piece on Portugal's 1–1 World Cup draw with DR Congo argues the result came down to a midfield that failed to create chances, not to Cristiano Ronaldo.",
      // Optional author/profile page. Empty: the row links to the latest article.
      url: "",
      linkLabel: "Read article",
      // /images/projects/basispoint.jpg
      preview: { src: "", alt: "BasisPoint Insight article preview", aspect: "landscape", slot: "BasisPoint preview", recommendedSize: "1600 × 1000 px" },
      articles: [
        {
          title: "Portugal Were Held by a Failure of Service, Not Their Captain",
          date: "June 2026",
          published: "2026-06",
          url: "https://basispointinsight.com/Story/Search/portugal-were-held-by-a-failure-of-service--not-their-captain_27e4841d184e.html",
        },
      ],
    },
  ] satisfies IndexEntry[] as IndexEntry[],

  courseworkHeading: "Coursework",
  coursework: [
    {
      institution: "Northeastern University",
      courses: [
        { name: "Business Statistics", theme: "Analytics" },
        { name: "Supply-Chain Management", theme: "Operations" },
        { name: "Decision Making in Developed and Emerging Markets", theme: "International business" },
        { name: "Financial Management", theme: "Finance" },
        { name: "Introduction to Marketing", theme: "Marketing" },
        { name: "Communication", theme: "Communication" },
        { name: "Innovation", theme: "Entrepreneurship" },
      ],
    },
    {
      institution: "University of Glasgow · Study abroad",
      courses: [
        { name: "Principles of Microeconomics", theme: "Economics" },
        { name: "Rhetorical Devices in English", theme: "Communication" },
      ],
    },
  ] satisfies CourseGroup[] as CourseGroup[],

  simulationsHeading: "Simulations",
  completedLabel: "Completed",
  simulations: [
    { name: "Market-Entry Simulation", theme: "Strategy", completed: true },
    { name: "Supply-Chain Management Simulation", theme: "Operations", completed: true },
  ] satisfies Simulation[] as Simulation[],
  simulationsNote: "Run through D'Amore-McKim School of Business, Northeastern.",
};

/** The most recent article by `published` (YYYY-MM). */
export function latestArticle(articles: Article[] = []): Article | undefined {
  return [...articles].sort((a, b) => b.published.localeCompare(a.published))[0];
}

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

/* ───────────────────────── Nav dropdowns ───────────────────────── */

export type NavMenuItem = {
  title: string;
  subtitle: string;
  href: `#${string}`;
};

export type NavMenu = {
  /** Accessible name for the dropdown. */
  label: string;
  /** Mobile menu: last row linking to the whole section. */
  allLabel: string;
  items: NavMenuItem[];
};

/** Dropdowns keyed by the nav link they hang off. Rows reuse section data. */
export const navMenus: Partial<Record<NavLink["href"], NavMenu>> = {
  "#work": {
    label: "Case studies",
    allLabel: "All work",
    items: caseStudies.map((study) => ({
      title: study.company,
      subtitle: study.role,
      href: `#${study.slug}` as const,
    })),
  },
  "#projects": {
    label: "Projects, writing & coursework",
    allLabel: "All projects",
    items: [
      ...projectsIndex.featured.map((entry) => ({
        title: entry.name,
        subtitle: entry.type,
        href: `#${entry.slug}` as const,
      })),
      { title: "Coursework & Simulations", subtitle: "Northeastern & Glasgow", href: "#coursework" },
    ],
  },
};
