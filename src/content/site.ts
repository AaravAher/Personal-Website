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

/**
 * A real image on the site. `src` is the base path written by
 * `npm run images:build`, without the size suffix: "/images/celona/presenting"
 * serves presenting-800w.webp and presenting-1600w.webp.
 *
 *   photo       cropped to fill its frame around `focus`
 *   document    slides, docs and page screenshots: never cropped, shown on a mat
 *   screenshot  phone screens, in a minimal phone frame
 *   slide       a 16:9 slide shown on a projector screen (switch any slide
 *               cover to it by changing its kind)
 */
export type MediaKind = "photo" | "document" | "screenshot" | "slide";

export type Media = {
  src: string;
  alt: string;
  caption?: string;
  kind: MediaKind;
  /** Photos: CSS object-position focal point, e.g. "60% 40%". */
  focus?: string;
  /** Screenshots: share of the height to trim from the top (phone status bar). */
  trimTop?: number;
  /** Slides: total slides in the deck, for the "01 / 24" counter. */
  slides?: number;
};

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

export type VideoSource = {
  provider: "youtube" | "vimeo";
  /** The video id only, e.g. "dQw4w9WgXcQ". Leave empty to show "coming soon". */
  id: string;
  title: string;
  /** Optional poster image. YouTube falls back to its own thumbnail. */
  poster?: string;
  /** Built image (base path) blurred behind the "coming soon" placeholder. */
  placeholderImage?: string;
};

export type CaseStudy = {
  slug: "plannrai" | "skillmatics" | "celona";
  /** Optional product link, shown under the one-liner. */
  url?: string;
  linkLabel?: string;
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
    /** Hidden until it has an id. */
    video?: VideoSource;
    /** First image is the primary. PlannrAI's are phone screenshots. */
    images: Media[];
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
  preview: Media;
  /** Crop a tall preview from the top of the page rather than the middle. */
  previewAlign?: "top";
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
  /** BCP-47 tag so screen readers pronounce it correctly (and the right font loads). */
  lang: string;
};

export type Chapter = {
  slug: string;
  overline: string;
  title: string;
  meta: string;
  text: string;
  stat?: Metric;
  /** First image is the primary. */
  media: Media[];
  /** "gallery": the photos are the content: bigger primary, native aspect ratios. */
  layout?: "gallery";
};

export type InterestIcon = "flag" | "table-tennis" | "watch" | "camera" | "trending-up" | "gamepad";

export type Interest = {
  label: string;
  icon: InterestIcon;
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

/** Search, sharing and structured data. Used by the layout, share image and 404 page. */
export const seo = {
  siteUrl: "https://www.aaravaher.com",
  domain: "aaravaher.com",
  siteName: "Aarav Aher",
  title: "Aarav Aher: International Business Student, Northeastern ’29",
  titleTemplate: "%s · Aarav Aher",
  description:
    "Aarav Aher is an International Business student at Northeastern (Supply Chain & Marketing), co-founder of PlannrAI, and open to Spring 2027 co-ops.",
  keywords: [
    "Aarav Aher",
    "Northeastern University",
    "International Business",
    "Supply Chain",
    "Marketing",
    "PlannrAI",
    "co-op",
    "D’Amore-McKim",
  ],
  locale: "en_US",
  jobTitle: "Student",
  university: "Northeastern University",
  school: "D’Amore-McKim School of Business",
  shareImageAlt: "Aarav Aher, International Business student at Northeastern, open to Spring 2027 co-op",
  shareAvailability: "Open to Spring 2027 Co-op",
};

export const notFoundCopy = {
  overline: "404",
  title: "This page took a wrong turn.",
  text: "The page you’re looking for doesn’t exist or has moved.",
  cta: "Back to aaravaher.com",
};

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
  "As a second-year International Business student at Northeastern University, with a concentration in Marketing and Supply Chain Management and a passion for entrepreneurship, global markets, and social impact, I am committed to building experiences that create meaningful change. I thrive on taking initiative, excel at working across cultures and industries, and bring drive to everything I pursue. With a foundation in international business and a focus on continuous growth, I’m eager to leverage my skills to make a difference and build something worthwhile.";

export const education: EducationItem[] = [
  {
    school: "Northeastern University",
    detail: "BS International Business, Supply Chain & Marketing · May 2029",
    location: "Boston, MA",
    notes: "D’Amore-McKim School of Business",
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
  videoPlaceholderTitle: "Intro video",
  videoComingSoon: "Coming soon",
  playVideo: "Play video",
  newTab: "(opens in a new tab)",
  openImage: "View larger",
  lightboxLabel: "Image viewer",
  closeLightbox: "Close image viewer",
  previousImage: "Previous image",
  nextImage: "Next image",
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "plannrai",
    company: "PlannrAI",
    url: "https://plannrai.in",
    linkLabel: "Visit plannrai.in",
    role: "Co-Founder & Developer",
    location: "Boston, MA",
    dates: "Jan 2026 – Present",
    oneLiner: "An AI-powered day-planning app built for college students.",
    context:
      "College students juggle classes, clubs, jobs and deadlines, and most planners leave them to stitch it all together by hand. PlannrAI uses AI to turn that into a realistic plan for the day. I co-founded it in January 2026 and own both how it’s built and how it reaches students.",
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
      video: { provider: "youtube", id: "", title: "PlannrAI intro video", placeholderImage: "/images/plannrai/home" },
      // No status bars in these screenshots (they start at the app header), so no trim.
      images: [
        { kind: "screenshot", src: "/images/plannrai/home", caption: "Home: plan my day", alt: "PlannrAI home screen with a Plan My Day button, the next scheduled block, a mood check-in (low, optimal, high) and a Mindspace note field" },
        { kind: "screenshot", src: "/images/plannrai/calendar", caption: "Day planner", alt: "PlannrAI day view for Tuesday 29 September with time blocks for dinner, PlannrAI work and studying" },
        { kind: "screenshot", src: "/images/plannrai/goals", caption: "Goals and AI strategies", alt: "PlannrAI goals screen tracking weekly minutes for gym, sports, SiteSmith and PlannrAI, each with a Strategy button" },
        { kind: "screenshot", src: "/images/plannrai/ai-coach", caption: "Donna, the AI chief of staff", alt: "Chat with Donna, PlannrAI’s AI chief of staff, moving tasks to later in the week after a request to reduce today’s load" },
      ],
    },
  },
  {
    slug: "skillmatics",
    company: "Skillmatics (Gouda Games)",
    role: "Marketing & Strategy Intern",
    location: "Mumbai, India",
    dates: "May – Jul 2026",
    oneLiner:
      "Took an adult party-games brand from online-only into physical retail in Mumbai.",
    context:
      "Gouda Games, Skillmatics’ adult party-games brand, had only ever sold online. Summer 2026 was its first move onto physical shelves in Mumbai, where placement, pricing and store format decide whether a game gets picked up. I joined the marketing and strategy team to help make that launch work.",
    whatIDid: [
      "Led a retail distribution initiative to establish Gouda Games’ first physical presence across stores in Mumbai, identifying 20+ optimal retail locations and developing product placement and pricing strategies across multiple store formats.",
      "Represented Gouda Games at the All You Can Mumbai event, driving direct sales and moving 100+ units on the ground.",
      "Conducted market research for two new product launches and prepared and presented GTM documentation to the Founder and CPO.",
      "Contributed to a record-breaking sales day for the brand: 301 units sold in a single day, the highest in the company’s history.",
    ],
    metrics: [
      { value: "301", label: "units in one day, a company record" },
      { value: "20+", label: "retail locations identified" },
      { value: "100+", label: "units sold at All You Can Mumbai" },
    ],
    skills: ["Retail Distribution", "Pricing", "Market Research", "GTM", "Event Sales"],
    media: {
      images: [
        { kind: "document", src: "/images/skillmatics/furbitz-gtm-strategy", caption: "Furbitz India go-to-market strategy", alt: "Cover of the Gouda Games Furbitz India go-to-market strategy for 2026: a collectible dog-shaped keychain, launch price ₹499, four breed variants, launching June 2026" },
        { kind: "document", src: "/images/skillmatics/content-deck", caption: "Content deck: reels, carousels and statics", alt: "Title slide of the Artsy Stash content deck, covering reels, carousels and static posts" },
      ],
    },
  },
  {
    slug: "celona",
    company: "Celona Inc.",
    role: "International Business Intern",
    location: "Bay Area, CA",
    dates: "Apr – Jun 2024",
    oneLiner: "Market research across six countries ahead of a global expansion.",
    context:
      "Celona was preparing to expand beyond the US and needed to know which international markets to prioritise. I joined the international business department to research six candidate markets across four regions and turn the findings into something leadership could act on.",
    whatIDid: [
      "Joined the international business department ahead of the company’s global expansion, conducting primary market research across 6 target markets.",
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
      images: [
        { kind: "photo", src: "/images/celona/presenting", focus: "60% 40%", caption: "Presenting the foreign-market analysis", alt: "Aarav presenting market research to Celona’s team around a conference table, with the analysis on the wall screen behind him" },
        { kind: "slide", slides: 24, src: "/images/celona/market-research-deck", caption: "Six-market analysis deck", alt: "Title slide reading International Expansion of Celona: Market Research" },
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
      preview: { kind: "document", src: "/images/projects/sitesmith-hero", alt: "SiteSmith homepage: ’Websites that move at the speed of your idea’ over a mechanical keyboard" },
    },
    {
      slug: "basispoint",
      name: "BasisPoint Insight",
      type: "Writing · Published author",
      description:
        "Published author at BasisPoint Insight. My piece on Portugal’s 1–1 World Cup draw with DR Congo argues the result came down to a midfield that failed to create chances, not to Cristiano Ronaldo.",
      // Optional author/profile page. Empty: the row links to the latest article.
      url: "",
      linkLabel: "Read article",
      preview: { kind: "document", src: "/images/projects/basispoint-article", alt: "Aarav’s BasisPoint Insight article on Portugal’s 1–1 draw, with a photo of Cristiano Ronaldo and his byline" },
      previewAlign: "top",
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
  simulationsNote: "Run through D’Amore-McKim School of Business, Northeastern.",
};

/** The most recent article by `published` (YYYY-MM). */
export function latestArticle(articles: Article[] = []): Article | undefined {
  return [...articles].sort((a, b) => b.published.localeCompare(a.published))[0];
}

/** "More about me", cycling through the languages I speak. */
export const languagesSection = {
  label: "More about me, in the languages I speak",
};

export const languages: Language[] = [
  { name: "English", nativeName: "English", moreAboutMe: "More about me", lang: "en" },
  { name: "Spanish", nativeName: "Español", moreAboutMe: "Más sobre mí", lang: "es" },
  { name: "Hindi", nativeName: "हिंदी", moreAboutMe: "मेरे बारे में कुछ और", lang: "hi" },
  { name: "Marathi", nativeName: "मराठी", moreAboutMe: "माझ्याबद्दल अधिक", lang: "mr" },
  { name: "Gujarati", nativeName: "ગુજરાતી", moreAboutMe: "મારા વિશે વધુ", lang: "gu" },
];

export const offTheClockSection = {
  eyebrow: "Off the clock",
  title: "Life outside work",
};

export const chapters: Chapter[] = [
  {
    slug: "football",
    overline: "Football",
    title: "The pitch",
    meta: "2023 – 2025 · India",
    text: "Competed in a national-level tournament in India, representing my club at the highest competitive tiers in the country. Led the club team to a third-place finish in the state league, coordinating tactics and player development.",
    stat: { value: "3rd", label: "State league finish" },
    media: [
      { kind: "photo", src: "/images/soccer/solo-in-game", focus: "47% 45%", caption: "In action for Maharashtra Oranje FC", alt: "Aarav in a blue and orange kit, number 31, bringing the ball forward on an artificial pitch" },
      { kind: "photo", src: "/images/soccer/medals", focus: "50% 50%", caption: "Medals from football and school competitions", alt: "Rows of medals laid out on a sofa, including Man of the Match and U14 winner medals and a Star of the Match trophy" },
      { kind: "document", src: "/images/soccer/result-7-0-sri-ma", caption: "7–0 vs Thane – Sri Ma FC, U17 Youth League", alt: "Full-time graphic: Maharashtra Oranje FC 7–0 Thane – Sri Ma FC, Under 17 Youth League, Cooperage Stadium, 4 December 2023, with a team photo" },
      { kind: "document", src: "/images/soccer/result-3-1-thane-city-state-league", caption: "3–1 vs Thane City FC, U17 State League", alt: "Full-time graphic: Maharashtra Oranje FC 3–1 Thane City FC, Under 17 State League, Cooperage Stadium, 14 August 2024, with the team by the scoreboard" },
      // Also available: /images/soccer/result-4-1-conscient-sports, /images/soccer/result-6-1-mumbai-soccer-prodigies
    ],
  },
  {
    slug: "photography",
    overline: "Photography",
    title: "Through the lens",
    meta: "Ongoing",
    text: "Photography is how I slow down and notice things. A few of my favourite frames.",
    layout: "gallery",
    media: [
      { kind: "photo", src: "/images/photography/milky-way-joshua-trees", caption: "Milky Way over Joshua trees", alt: "The Milky Way and a shooting star over a desert of Joshua tree silhouettes, with a warm glow on the horizon" },
      { kind: "photo", src: "/images/photography/taj-mahal", caption: "Taj Mahal, Agra", alt: "The Taj Mahal framed through a dark arched gateway in warm, hazy light" },
      { kind: "photo", src: "/images/photography/moon-through-palms", alt: "A bright moon in a hazy night sky, seen through dark palm fronds" },
    ],
  },
  {
    slug: "asha",
    overline: "Service",
    title: "Asha Foundation",
    meta: "2022 – 2024 · Volunteer Educator",
    text: "Taught 50+ underprivileged children over two years, delivering structured lessons to build foundational academic skills and improve access to education. Worked with NGO leadership to develop lesson plans tailored to students at different ability levels.",
    stat: { value: "50+", label: "Children taught" },
    media: [
      { kind: "photo", src: "/images/asha/teaching-session", focus: "45% 40%", caption: "Teaching session, Asha Foundation", alt: "Volunteers leading a reading activity with children in a brightly painted classroom, students seated on the floor" },
      { kind: "photo", src: "/images/asha/group-photo", focus: "50% 45%", caption: "Volunteers and students, Asha Foundation", alt: "Group photo of volunteers in maroon shirts with children in blue T-shirts in a colourful classroom library" },
    ],
  },
];

export const interests: Interest[] = [
  { label: "Formula 1", icon: "flag" },
  { label: "Table Tennis", icon: "table-tennis" },
  { label: "Watches", icon: "watch" },
  { label: "Photography", icon: "camera" },
  { label: "Investing", icon: "trending-up" },
  { label: "Gaming", icon: "gamepad" },
];

export const interestsSection = {
  label: "Interests",
};

export const headshot: Media = {
  kind: "photo",
  src: "/images/about/headshot",
  focus: "50% 45%",
  alt: "Portrait of Aarav Aher in a navy blazer, in a bright multi-storey atrium",
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
