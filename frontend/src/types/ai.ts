/* =============================================================================
   ResearchOS — AI Types
   ============================================================================= */

import type { Paper, ResearchGap } from "@/types/paper";

/* -----------------------------------------------------------------------------
   AI session
   ----------------------------------------------------------------------------- */
export type SessionType =
  | "pdf_chat"
  | "research_chat"
  | "lit_review"
  | "gap_detection"
  | "suggestions";

export interface AISession {
  id:          string;
  userId:      string;
  projectId:   string | null;
  pdfId:       string | null;
  sessionType: SessionType;
  title:       string | null;
  messages:    AIMessage[];
  modelUsed:   string;
  tokensUsed:  number;
  createdAt:   string;
  updatedAt:   string;
}

/* -----------------------------------------------------------------------------
   AI message
   ----------------------------------------------------------------------------- */
export type MessageRole = "user" | "assistant" | "system";

export interface AIMessage {
  id:          string;
  role:        MessageRole;
  content:     string;
  citations:   MessageCitation[];
  confidence:  number | null;         // 0–1, null for user messages
  isStreaming: boolean;
  createdAt:   string;
}

/* -----------------------------------------------------------------------------
   Citation attached to an AI message claim
   ----------------------------------------------------------------------------- */
export interface MessageCitation {
  index:   number;                    // [1], [2] etc in the message
  paperId: string;
  paper:   Paper | null;
  claim:   string;                    // the specific claim this supports
  quote:   string | null;             // direct quote from the paper
}

/* -----------------------------------------------------------------------------
   AI chat request / response
   ----------------------------------------------------------------------------- */
export interface ChatRequest {
  sessionId?:  string;               // omit to start new session
  message:     string;
  pdfId?:      string;
  projectId?:  string;
  sessionType: SessionType;
}

export interface ChatStreamChunk {
  type:       "text" | "citation" | "gap" | "done" | "error";
  content?:   string;
  citation?:  MessageCitation;
  gap?:       ResearchGap;
  error?:     string;
  sessionId?: string;
}

/* -----------------------------------------------------------------------------
   AI suggestions (research recommendations)
   ----------------------------------------------------------------------------- */
export interface AISuggestion {
  id:          string;
  type:        SuggestionType;
  title:       string;
  description: string;
  confidence:  number;
  paper?:      Paper;
  query?:      string;               // suggested search query
  createdAt:   string;
}

export type SuggestionType =
  | "related_paper"
  | "research_gap"
  | "trending_topic"
  | "methodology"
  | "dataset"
  | "search_query";

export interface SuggestionsRequest {
  topic:      string;
  paperIds?:  string[];
  projectId?: string;
  limit?:     number;
}

export interface SuggestionsResponse {
  suggestions: AISuggestion[];
  topic:       string;
  generatedAt: string;
}

/* -----------------------------------------------------------------------------
   Streaming state (UI)
   ----------------------------------------------------------------------------- */
export interface StreamingState {
  isStreaming:  boolean;
  sessionId:    string | null;
  currentText:  string;
  citations:    MessageCitation[];
  gaps:         ResearchGap[];
  error:        string | null;
}

export const INITIAL_STREAMING_STATE: StreamingState = {
  isStreaming:  false,
  sessionId:    null,
  currentText:  "",
  citations:    [],
  gaps:         [],
  error:        null,
};