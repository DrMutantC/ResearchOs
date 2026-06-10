"use client";

import { Loader2, SearchX, BookOpen } from "lucide-react";
import PaperCard from "./PaperCard";
import { cn } from "@/lib/utils";
import type { Paper } from "@/types/paper";

/* =============================================================================
   SearchResults — list of paper cards with loading/empty/error states
   ============================================================================= */

interface SearchResultsProps {
  papers:      Paper[];
  total:       number;
  isLoading:   boolean;
  isError:     boolean;
  query:       string;
  savedIds?:   Set<string>;
  onSave?:     (paper: Paper) => void;
  onUnsave?:   (paperId: string) => void;
  onCite?:     (paper: Paper) => void;
  onChat?:     (paper: Paper) => void;
  onLoadMore?: () => void;
  hasMore?:    boolean;
  className?:  string;
}

export default function SearchResults({
  papers,
  total,
  isLoading,
  isError,
  query,
  savedIds    = new Set(),
  onSave,
  onUnsave,
  onCite,
  onChat,
  onLoadMore,
  hasMore     = false,
  className,
}: SearchResultsProps) {

  /* ---- Loading skeleton ---- */
  if (isLoading && papers.length === 0) {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-4 space-y-2">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-1/2" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-5/6" />
          </div>
        ))}
      </div>
    );
  }

  /* ---- Error state ---- */
  if (isError) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <SearchX className="w-6 h-6 text-destructive" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Search failed</p>
        <p className="text-xs text-muted-foreground">
          Could not connect to the search service. Please try again.
        </p>
      </div>
    );
  }

  /* ---- Empty state (after search) ---- */
  if (!isLoading && papers.length === 0 && query) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <BookOpen className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">No papers found</p>
        <p className="text-xs text-muted-foreground max-w-sm">
          No results for &ldquo;{query}&rdquo;. Try broadening your search or using different keywords.
        </p>
      </div>
    );
  }

  /* ---- Initial empty state (no search yet) ---- */
  if (!isLoading && papers.length === 0 && !query) {
    return (
      <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <BookOpen className="w-6 h-6 text-primary" />
        </div>
        <p className="text-sm font-medium text-foreground mb-1">Search the literature</p>
        <p className="text-xs text-muted-foreground max-w-sm">
          Search across OpenAlex, Semantic Scholar, and arXiv simultaneously.
          AI expands your query for better results.
        </p>
      </div>
    );
  }

  /* ---- Results ---- */
  return (
    <div className={cn("space-y-3", className)}>

      {/* Result count */}
      {query && total > 0 && (
        <p className="text-xs text-muted-foreground px-1">
          {total.toLocaleString()} results for &ldquo;{query}&rdquo;
        </p>
      )}

      {/* Paper cards */}
      {papers.map((paper) => (
        <PaperCard
          key={paper.id}
          paper={paper}
          isSaved={savedIds.has(paper.id)}
          onSave={onSave}
          onUnsave={onUnsave}
          onCite={onCite}
          onChat={onChat}
        />
      ))}

      {/* Load more */}
      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={isLoading}
          className="w-full py-3 rounded-lg border border-border text-sm text-muted-foreground
            hover:text-foreground hover:bg-accent transition-colors flex items-center justify-center gap-2
            disabled:opacity-50"
        >
          {isLoading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Loading…</>
            : "Load more results"
          }
        </button>
      )}
    </div>
  );
}