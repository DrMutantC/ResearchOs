"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, BookOpen } from "lucide-react";
import SearchBar     from "@/components/search/SearchBar";
import SearchFilters, { type SearchFilterValues } from "@/components/search/SearchFilters";
import SearchResults from "@/components/search/SearchResults";
import { API_URL, SEARCH_SOURCES, PAGINATION } from "@/lib/constants";
import { buildQueryString } from "@/lib/utils";
import type { Paper, SearchResponse } from "@/types/paper";

/* =============================================================================
   ResearchOS — Search Page
   Wires SearchBar + SearchFilters + SearchResults together.
   Syncs query with URL (?q=...) for shareable links.
   ============================================================================= */

const DEFAULT_FILTERS: SearchFilterValues = {
  sources:    Object.values(SEARCH_SOURCES),
  yearFrom:   null,
  yearTo:     null,
  openAccess: false,
};

export default function SearchPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();

  /* ---- State ---- */
  const [query,       setQuery]       = useState(searchParams.get("q") ?? "");
  const [inputValue,  setInputValue]  = useState(searchParams.get("q") ?? "");
  const [filters,     setFilters]     = useState<SearchFilterValues>(DEFAULT_FILTERS);
  const [papers,      setPapers]      = useState<Paper[]>([]);
  const [total,       setTotal]       = useState(0);
  const [page,        setPage]        = useState<number>(PAGINATION.DEFAULT_PAGE);
  const [isLoading,   setIsLoading]   = useState(false);
  const [isError,     setIsError]     = useState(false);
  const [savedIds,    setSavedIds]    = useState<Set<string>>(new Set());
  const [expandedQuery, setExpandedQuery] = useState<string | null>(null);

  const hasMore = papers.length < total;

  /* ------------------------------------------------------------------ */
  /* Search function                                                      */
  /* ------------------------------------------------------------------ */
  const runSearch = useCallback(async (
    q:      string,
    f:      SearchFilterValues,
    p:      number,
    append: boolean = false,
  ) => {
    if (!q.trim()) return;
    setIsLoading(true);
    setIsError(false);

    try {
      const qs = buildQueryString({
        query:       q,
        sources:     f.sources.join(","),
        year_from:   f.yearFrom  ?? undefined,
        year_to:     f.yearTo    ?? undefined,
        open_access: f.openAccess || undefined,
        page:        p,
        page_size:   PAGINATION.DEFAULT_PAGE_SIZE,
      });

      const res  = await fetch(`${API_URL}/papers/search${qs}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) throw new Error("Search failed");

      const data: SearchResponse = await res.json();

      setPapers((prev) => append ? [...prev, ...data.papers] : data.papers);
      setTotal(data.total);
      setExpandedQuery(data.expandedQuery !== q ? data.expandedQuery : null);
    } catch {
      setIsError(true);
      if (!append) setPapers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ------------------------------------------------------------------ */
  /* Trigger search when URL param changes on mount                       */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setQuery(q);
      setInputValue(q);
      setPage(1);
      runSearch(q, filters, 1, false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------------------------------------------------ */
  /* Handle new search                                                    */
  /* ------------------------------------------------------------------ */
  function handleSearch(q: string) {
    setQuery(q);
    setPage(1);
    setPapers([]);
    router.replace(`/search?q=${encodeURIComponent(q)}`, { scroll: false });
    runSearch(q, filters, 1, false);
  }

  /* ------------------------------------------------------------------ */
  /* Handle filter change — re-run search immediately                    */
  /* ------------------------------------------------------------------ */
  function handleFilterChange(newFilters: SearchFilterValues) {
    setFilters(newFilters);
    if (query) {
      setPage(1);
      setPapers([]);
      runSearch(query, newFilters, 1, false);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Load more                                                            */
  /* ------------------------------------------------------------------ */
  function handleLoadMore() {
    const nextPage = page + 1;
    setPage(nextPage);
    runSearch(query, filters, nextPage, true);
  }

  /* ------------------------------------------------------------------ */
  /* Save / unsave paper                                                  */
  /* ------------------------------------------------------------------ */
  async function handleSave(paper: Paper) {
    try {
      await fetch(`${API_URL}/papers/${paper.id}/save`, {
        method:  "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setSavedIds((prev) => new Set([...prev, paper.id]));
      toast.success("Paper saved to library");
    } catch {
      toast.error("Could not save paper");
    }
  }

  async function handleUnsave(paperId: string) {
    try {
      await fetch(`${API_URL}/papers/${paperId}/unsave`, {
        method:  "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(paperId);
        return next;
      });
      toast.success("Removed from library");
    } catch {
      toast.error("Could not remove paper");
    }
  }

  /* ------------------------------------------------------------------ */
  /* Cite paper                                                           */
  /* ------------------------------------------------------------------ */
  function handleCite(paper: Paper) {
    toast.info(`Citation for "${paper.title.slice(0, 40)}…" — coming in the citation panel`);
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <div className="flex flex-col h-full">

      {/* ---- Top search bar section ---- */}
      <div className="border-b border-border bg-background px-6 py-4 shrink-0">

        <div className="max-w-3xl mx-auto space-y-3">
          <h1 className="text-lg font-semibold text-foreground">Search papers</h1>

          {/* Search bar + filters row */}
          <div className="flex items-start gap-2">
            <SearchBar
              value={inputValue}
              onChange={setInputValue}
              onSearch={handleSearch}
              isLoading={isLoading}
              autoFocus
              className="flex-1"
            />
            <SearchFilters
              filters={filters}
              onChange={handleFilterChange}
            />
          </div>

          {/* AI expanded query hint */}
          {expandedQuery && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>
                AI expanded your query to:{" "}
                <span className="text-foreground font-medium">{expandedQuery}</span>
              </span>
            </div>
          )}

          {/* Source pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {filters.sources.map((source) => (
              <span
                key={source}
                className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border"
              >
                {source === "openalex"         && "OpenAlex"}
                {source === "semantic_scholar" && "Semantic Scholar"}
                {source === "arxiv"            && "arXiv"}
              </span>
            ))}
            {filters.openAccess && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                Open access
              </span>
            )}
            {(filters.yearFrom || filters.yearTo) && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {filters.yearFrom ?? "…"} — {filters.yearTo ?? new Date().getFullYear()}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ---- Results section ---- */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6">

          {/* Literature review shortcut — shown when results exist */}
          {papers.length > 0 && (
            <div className="flex items-center justify-between mb-4 p-3 rounded-lg border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-foreground font-medium">
                  {papers.length} papers loaded
                </span>
                <span className="text-muted-foreground">
                  — generate a literature review?
                </span>
              </div>
              <button
                onClick={() => toast.info("Select papers first, then use the literature review generator")}
                className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md
                  hover:bg-primary/90 transition-colors font-medium"
              >
                Generate review
              </button>
            </div>
          )}

          <SearchResults
            papers={papers}
            total={total}
            isLoading={isLoading}
            isError={isError}
            query={query}
            savedIds={savedIds}
            onSave={handleSave}
            onUnsave={handleUnsave}
            onCite={handleCite}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
          />
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   Helper — get access token from Zustand store outside React tree
   ============================================================================= */
function getToken(): string {
  try {
    const raw = localStorage.getItem("researchos:auth");
    if (!raw) return "";
    const parsed = JSON.parse(raw) as { state?: { accessToken?: string } };
    return parsed?.state?.accessToken ?? "";
  } catch {
    return "";
  }
}