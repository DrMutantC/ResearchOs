/* =============================================================================
   ResearchOS — Application Constants
   Single source of truth for all magic strings, limits, and config values.
   Import from here — never hardcode these in components.
   ============================================================================= */

/* -----------------------------------------------------------------------------
   App
   ----------------------------------------------------------------------------- */
export const APP_NAME        = "ResearchOS";
export const APP_DESCRIPTION = "The AI Operating System for Scientific Research";
export const APP_URL         = process.env.NEXT_PUBLIC_APP_URL  ?? "http://localhost:3000";
export const API_URL         = process.env.NEXT_PUBLIC_API_URL  ?? "http://localhost:8000/api/v1";

/* -----------------------------------------------------------------------------
   Routes
   ----------------------------------------------------------------------------- */
export const ROUTES = {
  // Public
  HOME:           "/",
  LOGIN:          "/login",
  REGISTER:       "/register",
  ONBOARDING:     "/onboarding",
  PRICING:        "/pricing",

  // Dashboard
  DASHBOARD:      "/dashboard",
  PROJECTS:       "/projects",
  SEARCH:         "/search",
  LIBRARY:        "/library",
  UPLOAD:         "/upload",
  SETTINGS:       "/settings",

  // Payment
  PAYMENT_SUCCESS: "/payment/success",
  PAYMENT_FAIL:    "/payment/fail",
  PAYMENT_CANCEL:  "/payment/cancel",
} as const;

/* -----------------------------------------------------------------------------
   API endpoints (relative to API_URL)
   ----------------------------------------------------------------------------- */
export const API = {
  // Auth
  AUTH: {
    LOGIN:         "/auth/login",
    REGISTER:      "/auth/register",
    LOGOUT:        "/auth/logout",
    REFRESH:       "/auth/refresh",
    ME:            "/auth/me",
    GOOGLE:        "/auth/google",
    APPLE:         "/auth/apple",
  },

  // Papers
  PAPERS: {
    SEARCH:        "/papers/search",
    DETAIL:        (id: string) => `/papers/${id}`,
    SAVE:          (id: string) => `/papers/${id}/save`,
    UNSAVE:        (id: string) => `/papers/${id}/unsave`,
    SAVED:         "/papers/saved",
    SUGGESTIONS:   "/papers/suggestions",
  },

  // Projects
  PROJECTS: {
    LIST:          "/projects",
    CREATE:        "/projects",
    DETAIL:        (id: string) => `/projects/${id}`,
    UPDATE:        (id: string) => `/projects/${id}`,
    DELETE:        (id: string) => `/projects/${id}`,
  },

  // PDF
  PDF: {
    UPLOAD:        "/pdf/upload",
    DETAIL:        (id: string) => `/pdf/${id}`,
    CHAT:          (id: string) => `/pdf/${id}/chat`,
    SUMMARY:       (id: string) => `/pdf/${id}/summary`,
    DELETE:        (id: string) => `/pdf/${id}`,
  },

  // AI
  AI: {
    CHAT:          "/ai/chat",
    LIT_REVIEW:    "/ai/literature-review",
    SUGGESTIONS:   "/ai/suggestions",
    GAP_DETECT:    "/ai/gap-detection",
  },

  // Citations
  CITATIONS: {
    GENERATE:      "/citations/generate",
    FROM_DOI:      "/citations/doi",
    FROM_PDF:      "/citations/pdf",
  },

  // Payments
  PAYMENTS: {
    STRIPE_CHECKOUT:    "/payments/stripe/checkout",
    STRIPE_PORTAL:      "/payments/stripe/portal",
    STRIPE_WEBHOOK:     "/payments/stripe/webhook",
    SSL_INIT:           "/payments/sslcommerz/init",
    SSL_IPN:            "/payments/sslcommerz/ipn",
  },
} as const;

/* -----------------------------------------------------------------------------
   Subscription tiers
   ----------------------------------------------------------------------------- */
export const TIERS = {
  FREE: "free",
  PRO:  "pro",
  MAX:  "max",
} as const;

export type Tier = typeof TIERS[keyof typeof TIERS];

export const TIER_LABELS: Record<Tier, string> = {
  free: "Free",
  pro:  "Pro",
  max:  "Max",
};

export const TIER_PRICES: Record<Tier, number> = {
  free: 0,
  pro:  20,
  max:  80,
};

export const TIER_LIMITS = {
  free: {
    searchesPerDay:  5,
    pdfUploads:      3,
    tokensPerDay:    10_000,
    pdfSizeMb:       10,
  },
  pro: {
    searchesPerDay:  Infinity,
    pdfUploads:      Infinity,
    tokensPerDay:    500_000,
    pdfSizeMb:       50,
  },
  max: {
    searchesPerDay:  Infinity,
    pdfUploads:      Infinity,
    tokensPerDay:    2_000_000,
    pdfSizeMb:       100,
  },
} as const;

/* -----------------------------------------------------------------------------
   Academic search sources
   ----------------------------------------------------------------------------- */
export const SEARCH_SOURCES = {
  OPENALEX:         "openalex",
  SEMANTIC_SCHOLAR: "semantic_scholar",
  ARXIV:            "arxiv",
} as const;

export type SearchSource = typeof SEARCH_SOURCES[keyof typeof SEARCH_SOURCES];

export const SEARCH_SOURCE_LABELS: Record<SearchSource, string> = {
  openalex:         "OpenAlex",
  semantic_scholar: "Semantic Scholar",
  arxiv:            "arXiv",
};

/* -----------------------------------------------------------------------------
   Citation formats
   ----------------------------------------------------------------------------- */
export const CITATION_FORMATS = {
  APA:     "apa",
  MLA:     "mla",
  IEEE:    "ieee",
  HARVARD: "harvard",
  CHICAGO: "chicago",
} as const;

export type CitationFormat = typeof CITATION_FORMATS[keyof typeof CITATION_FORMATS];

export const CITATION_FORMAT_LABELS: Record<CitationFormat, string> = {
  apa:     "APA 7th",
  mla:     "MLA 9th",
  ieee:    "IEEE",
  harvard: "Harvard",
  chicago: "Chicago",
};

/* -----------------------------------------------------------------------------
   Academic fields (onboarding step 1)
   ----------------------------------------------------------------------------- */
export const ACADEMIC_FIELDS = [
  "Computer Science & AI",
  "Biology & Life Sciences",
  "Medicine & Health",
  "Physics & Astronomy",
  "Chemistry",
  "Mathematics",
  "Engineering",
  "Social Sciences",
  "Economics & Finance",
  "Psychology",
  "Environmental Science",
  "Materials Science",
  "Linguistics",
  "Philosophy",
  "Education",
  "Law",
  "Other",
] as const;

export type AcademicField = typeof ACADEMIC_FIELDS[number];

/* -----------------------------------------------------------------------------
   AI models (LiteLLM strings)
   ----------------------------------------------------------------------------- */
export const AI_MODELS = {
  DEFAULT:   "gpt-4o-mini",
  REASONING: "gpt-4o",
  EMBEDDING: "text-embedding-3-small",
} as const;

/* -----------------------------------------------------------------------------
   UI layout dimensions (must match globals.css + tailwind.config.ts)
   ----------------------------------------------------------------------------- */
export const LAYOUT = {
  SIDEBAR_WIDTH:  "16rem",
  PANEL_WIDTH:    "20rem",
  TOPBAR_HEIGHT:  "3.5rem",
} as const;

/* -----------------------------------------------------------------------------
   Pagination defaults
   ----------------------------------------------------------------------------- */
export const PAGINATION = {
  DEFAULT_PAGE:     1,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE:    50,
} as const;

/* -----------------------------------------------------------------------------
   File upload
   ----------------------------------------------------------------------------- */
export const UPLOAD = {
  ACCEPTED_TYPES:   ["application/pdf"],
  ACCEPTED_EXT:     [".pdf"],
  MAX_SIZE_FREE_MB: 10,
  MAX_SIZE_PRO_MB:  50,
  MAX_SIZE_MAX_MB:  100,
} as const;

/* -----------------------------------------------------------------------------
   Local storage keys
   ----------------------------------------------------------------------------- */
export const STORAGE_KEYS = {
  THEME:           "researchos:theme",
  SIDEBAR_OPEN:    "researchos:sidebar-open",
  RECENT_SEARCHES: "researchos:recent-searches",
  ONBOARDING_DONE: "researchos:onboarding-done",
  CITATION_FORMAT: "researchos:citation-format",
} as const;

/* -----------------------------------------------------------------------------
   Query keys — TanStack Query cache keys
   ----------------------------------------------------------------------------- */
export const QUERY_KEYS = {
  ME:              ["me"],
  PROJECTS:        ["projects"],
  PROJECT:         (id: string)    => ["projects", id],
  PAPERS_SEARCH:   (q: string)     => ["papers", "search", q],
  PAPERS_SAVED:    ["papers", "saved"],
  PAPER:           (id: string)    => ["papers", id],
  PDF_UPLOADS:     ["pdf-uploads"],
  PDF:             (id: string)    => ["pdf", id],
  AI_SUGGESTIONS:  (topic: string) => ["ai", "suggestions", topic],
} as const;

/* -----------------------------------------------------------------------------
   Toast durations (ms)
   ----------------------------------------------------------------------------- */
export const TOAST = {
  SHORT:   2000,
  DEFAULT: 4000,
  LONG:    7000,
} as const;

/* -----------------------------------------------------------------------------
   Confidence thresholds for AI responses
   ----------------------------------------------------------------------------- */
export const CONFIDENCE = {
  HIGH:   0.8,
  MEDIUM: 0.5,
  LOW:    0.0,
} as const;