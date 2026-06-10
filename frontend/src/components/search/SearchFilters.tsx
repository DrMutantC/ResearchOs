"use client";

import { useState } from "react";
import { Filter, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEARCH_SOURCES, SEARCH_SOURCE_LABELS } from "@/lib/constants";
import type { SearchSource } from "@/lib/constants";

/* =============================================================================
   SearchFilters — year range, sources, open access toggle
   ============================================================================= */

export interface SearchFilterValues {
  sources:     SearchSource[];
  yearFrom:    number | null;
  yearTo:      number | null;
  openAccess:  boolean;
}

const DEFAULT_FILTERS: SearchFilterValues = {
  sources:    Object.values(SEARCH_SOURCES),
  yearFrom:   null,
  yearTo:     null,
  openAccess: false,
};

interface SearchFiltersProps {
  filters:   SearchFilterValues;
  onChange:  (filters: SearchFilterValues) => void;
  className?: string;
}

export default function SearchFilters({
  filters,
  onChange,
  className,
}: SearchFiltersProps) {
  const [open, setOpen] = useState(false);

  const activeCount = [
    filters.yearFrom !== null,
    filters.yearTo   !== null,
    filters.openAccess,
    filters.sources.length < Object.values(SEARCH_SOURCES).length,
  ].filter(Boolean).length;

  function toggleSource(source: SearchSource) {
    const has = filters.sources.includes(source);
    if (has && filters.sources.length === 1) return; // keep at least one
    onChange({
      ...filters,
      sources: has
        ? filters.sources.filter((s) => s !== source)
        : [...filters.sources, source],
    });
  }

  function reset() {
    onChange(DEFAULT_FILTERS);
  }

  const currentYear = new Date().getFullYear();

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 h-9 px-3 rounded-lg border text-sm transition-colors",
          open || activeCount > 0
            ? "border-primary bg-primary/10 text-primary"
            : "border-input text-muted-foreground hover:border-primary/40 hover:text-foreground"
        )}
      >
        <Filter className="w-3.5 h-3.5" />
        Filters
        {activeCount > 0 && (
          <span className="bg-primary text-primary-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-72 bg-card border border-border rounded-xl shadow-panel z-10 p-4 space-y-4">

          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Filters</span>
            <div className="flex items-center gap-2">
              {activeCount > 0 && (
                <button
                  onClick={reset}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Reset all
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sources */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Sources</p>
            <div className="space-y-1.5">
              {Object.values(SEARCH_SOURCES).map((source) => (
                <label
                  key={source}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <div
                    onClick={() => toggleSource(source)}
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                      filters.sources.includes(source)
                        ? "bg-primary border-primary"
                        : "border-input group-hover:border-primary/40"
                    )}
                  >
                    {filters.sources.includes(source) && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-foreground">{SEARCH_SOURCE_LABELS[source]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Year range */}
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Publication year</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="From"
                min={1900}
                max={currentYear}
                value={filters.yearFrom ?? ""}
                onChange={(e) =>
                  onChange({ ...filters, yearFrom: e.target.value ? parseInt(e.target.value) : null })
                }
                className="w-full h-8 px-2 rounded-lg border border-input bg-background text-sm
                  focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-muted-foreground text-sm shrink-0">—</span>
              <input
                type="number"
                placeholder="To"
                min={1900}
                max={currentYear}
                value={filters.yearTo ?? ""}
                onChange={(e) =>
                  onChange({ ...filters, yearTo: e.target.value ? parseInt(e.target.value) : null })
                }
                className="w-full h-8 px-2 rounded-lg border border-input bg-background text-sm
                  focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Open access */}
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-foreground">Open access only</span>
            <div
              onClick={() => onChange({ ...filters, openAccess: !filters.openAccess })}
              className={cn(
                "w-9 h-5 rounded-full transition-colors relative cursor-pointer",
                filters.openAccess ? "bg-primary" : "bg-muted"
              )}
            >
              <div className={cn(
                "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                filters.openAccess ? "translate-x-4" : "translate-x-0.5"
              )} />
            </div>
          </label>

          {/* Apply */}
          <button
            onClick={() => setOpen(false)}
            className="w-full h-8 bg-primary text-primary-foreground rounded-lg text-xs font-medium
              hover:bg-primary/90 transition-colors"
          >
            Apply filters
          </button>
        </div>
      )}
    </div>
  );
}