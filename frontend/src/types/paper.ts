/* =============================================================================
   ResearchOS — Paper & Search Types
   ============================================================================= */

import type { SearchSource, CitationFormat } from "@/lib/constants";

/* -----------------------------------------------------------------------------
   Paper
   ----------------------------------------------------------------------------- */
export interface Paper {
  id:             string;
  title:          string;
  authors:        string[];
  abstract:       string | null;
  doi:            string | null;
  year:           number | null;
  venue:          string | null;        // journal or conference name
  url:            string | null;
  pdfUrl:         string | null;
  citationCount:  number;
  referenceCount: number;
  source:         SearchSource;
  externalId:     string;              // ID from the source API
  relevanceScore: number;              // 0–1, from reranker
  isOpenAccess:   boolean;
  fields:         string[];            // academic fields / topics
  createdAt:      string;
}

/* -----------------------------------------------------------------------------
   Saved paper (user's library entry)
   ----------------------------------------------------------------------------- */
export interface SavedPaper {
  id:        string;
  paperId:   string;
  projectId: string | null;
  paper:     Paper;
  notes:     string | null;
  savedAt:   string;
}

/* -----------------------------------------------------------------------------
   Search
   ----------------------------------------------------------------------------- */
export interface SearchParams {
  query:       string;
  sources?:    SearchSource[];
  yearFrom?:   number;
  yearTo?:     number;
  fields?:     string[];
  openAccess?: boolean;
  page?:       number;
  pageSize?:   number;
}

export interface SearchResponse {
  papers:     Paper[];
  total:      number;
  page:       number;
  pageSize:   number;
  query:      string;
  expandedQuery: string;               // AI-expanded query
  timeTakenMs:   number;
}

/* -----------------------------------------------------------------------------
   Citation
   ----------------------------------------------------------------------------- */
export interface Citation {
  paperId:    string;
  format:     CitationFormat;
  text:       string;                  // formatted citation string
  bibtex:     string | null;
  generatedAt: string;
}

export interface CitationRequest {
  paperId?:   string;
  doi?:       string;
  title?:     string;
  format:     CitationFormat;
}

/* -----------------------------------------------------------------------------
   Literature review
   ----------------------------------------------------------------------------- */
export interface LitReviewRequest {
  paperIds:   string[];
  title?:     string;
  focusArea?: string;
}

export interface LitReviewSection {
  heading:   string;
  content:   string;
  paperRefs: string[];               // paper IDs cited in this section
}

export interface LitReviewResponse {
  id:           string;
  title:        string;
  introduction: string;
  sections:     LitReviewSection[];
  contradictions: string;
  futureDirections: string;
  paperIds:     string[];
  generatedAt:  string;
}

/* -----------------------------------------------------------------------------
   Research gap
   ----------------------------------------------------------------------------- */
export interface ResearchGap {
  id:          string;
  description: string;
  confidence:  number;
  supportingPaperIds: string[];
  category:    "missing_experiment" | "contradiction" | "unexplored_topic";
}