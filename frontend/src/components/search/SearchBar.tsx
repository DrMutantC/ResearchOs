"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Loader2, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { localGet, localSet } from "@/lib/utils";
import { STORAGE_KEYS } from "@/lib/constants";

/* =============================================================================
   SearchBar — main paper search input with recent history
   ============================================================================= */

interface SearchBarProps {
  value:        string;
  onChange:     (value: string) => void;
  onSearch:     (query: string) => void;
  isLoading?:   boolean;
  placeholder?: string;
  autoFocus?:   boolean;
  className?:   string;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  isLoading   = false,
  placeholder = "Search papers, topics, authors, DOIs…",
  autoFocus   = false,
  className,
}: SearchBarProps) {
  const inputRef                  = useRef<HTMLInputElement>(null);
  const [focused,  setFocused]    = useState(false);
  const [recents,  setRecents]    = useState<string[]>([]);
  const showDropdown = focused && value.length === 0 && recents.length > 0;

  /* Load recent searches */
  useEffect(() => {
    const stored = localGet<string[]>(STORAGE_KEYS.RECENT_SEARCHES);
    if (stored) setRecents(stored);
  }, []);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  /* ------------------------------------------------------------------ */
  /* Handlers                                                             */
  /* ------------------------------------------------------------------ */
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    saveRecent(q);
    onSearch(q);
    setFocused(false);
  }

  function handleRecentClick(q: string) {
    onChange(q);
    saveRecent(q);
    onSearch(q);
    setFocused(false);
  }

  function saveRecent(q: string) {
    const updated = [q, ...recents.filter((r) => r !== q)].slice(0, 6);
    setRecents(updated);
    localSet(STORAGE_KEYS.RECENT_SEARCHES, updated);
  }

  function clearRecents() {
    setRecents([]);
    localSet(STORAGE_KEYS.RECENT_SEARCHES, []);
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <div className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit}>
        <div className={cn(
          "flex items-center gap-2 h-11 px-4 rounded-xl border bg-background transition-all",
          focused
            ? "border-primary ring-2 ring-primary/20"
            : "border-input hover:border-primary/40"
        )}>
          {isLoading
            ? <Loader2 className="w-4 h-4 text-muted-foreground shrink-0 animate-spin" />
            : <Search   className="w-4 h-4 text-muted-foreground shrink-0" />
          }
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || !value.trim()}
            className="shrink-0 bg-primary text-primary-foreground text-xs font-medium
              px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors
              disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Search
          </button>
        </div>
      </form>

      {/* Recent searches dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-xl shadow-panel z-10 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border">
            <span className="text-xs text-muted-foreground font-medium">Recent searches</span>
            <button
              onClick={clearRecents}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear
            </button>
          </div>
          {recents.map((r) => (
            <button
              key={r}
              onMouseDown={() => handleRecentClick(r)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground
                hover:text-foreground hover:bg-accent transition-colors text-left"
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              {r}
            </button>
          ))}
          <div className="flex items-center gap-2 px-4 py-2 border-t border-border text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3 text-primary" />
            AI expands your query automatically
          </div>
        </div>
      )}
    </div>
  );
}