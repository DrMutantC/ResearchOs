"use client";

import { useState } from "react";
import {
  BookOpen, ExternalLink, Bookmark, BookmarkCheck,
  Quote, ChevronDown, ChevronUp, Shield, FileText,
} from "lucide-react";
import { cn, formatAuthors, formatCount, doiToUrl, relevanceLabel } from "@/lib/utils";
import { SEARCH_SOURCE_LABELS } from "@/lib/constants";
import type { Paper } from "@/types/paper";

/* =============================================================================
   PaperCard — single paper result card
   ============================================================================= */

interface PaperCardProps {
  paper:      Paper;
  isSaved?:   boolean;
  onSave?:    (paper: Paper) => void;
  onUnsave?:  (paperId: string) => void;
  onCite?:    (paper: Paper) => void;
  onChat?:    (paper: Paper) => void;
  showScore?: boolean;
  className?: string;
}

export default function PaperCard({
  paper,
  isSaved    = false,
  onSave,
  onUnsave,
  onCite,
  onChat,
  showScore  = true,
  className,
}: PaperCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [saving,   setSaving]   = useState(false);

  const relevance = relevanceLabel(paper.relevanceScore);
  const relevanceClass =
  relevance === "high"
    ? "text-emerald-500"
    : relevance === "medium"
    ? "text-amber-500"
    : "text-muted-foreground";

  async function handleSaveToggle(e: React.MouseEvent) {
    e.stopPropagation();
    setSaving(true);
    try {
      if (isSaved) onUnsave?.(paper.id);
      else         onSave?.(paper);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={cn("paper-card group", className)}>
      {/* ---- Header row ---- */}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">

          {/* Title */}
          <h3 className="paper-card-title">
            {paper.url ? (
              <a
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:text-primary transition-colors"
              >
                {paper.title}
              </a>
            ) : (
              paper.title
            )}
          </h3>

          {/* Meta row */}
          <div className="paper-card-meta">
            <span>{formatAuthors(paper.authors, 3)}</span>
            {paper.year  && <span>·</span>}
            {paper.year  && <span>{paper.year}</span>}
            {paper.venue && <span>·</span>}
            {paper.venue && <span className="italic truncate max-w-[120px]">{paper.venue}</span>}
            <span>·</span>
            <span className="text-muted-foreground/60">
              {SEARCH_SOURCE_LABELS[paper.source]}
            </span>
          </div>
        </div>

        {/* Right badges */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {/* Relevance score */}
          {showScore && (
            <span
  className={cn(
    "text-xs font-medium",
    relevance === "high" && "text-emerald-500",
    relevance === "medium" && "text-amber-500",
    relevance === "low" && "text-muted-foreground"
  )}
>
              {Math.round(paper.relevanceScore * 100)}%
            </span>
          )}
          {/* Open access */}
          {paper.isOpenAccess && (
            <span className={cn("text-xs font-medium", relevanceClass)}>
              <Shield className="w-3 h-3" />
              Open
            </span>
          )}
        </div>
      </div>

      {/* ---- Abstract (expandable) ---- */}
      {paper.abstract && (
        <>
          <p className={cn(
            "paper-card-abstract mt-2",
            expanded ? "line-clamp-none" : "line-clamp-3"
          )}>
            {paper.abstract}
          </p>
          {paper.abstract.length > 200 && (
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mt-1 transition-colors"
            >
              {expanded
                ? <><ChevronUp   className="w-3 h-3" /> Less</>
                : <><ChevronDown className="w-3 h-3" /> More</>
              }
            </button>
          )}
        </>
      )}

      {/* ---- Stats row ---- */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {formatCount(paper.citationCount)} cited
          </span>
          {paper.doi && (
            <a
              href={doiToUrl(paper.doi)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              DOI <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Save */}
          <button
            onClick={handleSaveToggle}
            disabled={saving}
            title={isSaved ? "Remove from library" : "Save to library"}
            className={cn(
              "flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors",
              isSaved
                ? "text-primary bg-primary/10 hover:bg-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {isSaved
              ? <BookmarkCheck className="w-3.5 h-3.5" />
              : <Bookmark      className="w-3.5 h-3.5" />
            }
          </button>

          {/* Cite */}
          {onCite && (
            <button
              onClick={(e) => { e.stopPropagation(); onCite(paper); }}
              title="Generate citation"
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-md
                text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Chat with PDF */}
          {onChat && paper.pdfUrl && (
            <button
              onClick={(e) => { e.stopPropagation(); onChat(paper); }}
              title="Chat with this paper"
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-md
                text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}