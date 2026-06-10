"use client";

import { useState} from "react";
import {
  Lightbulb, TrendingUp, BookOpen, AlertTriangle,
  ExternalLink, RefreshCw, ChevronDown, ChevronUp, Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatAuthors, formatNumber, formatRelativeTime } from "@/lib/utils";
// import { useAuthStore } from "@/store/authStore";
import { useActiveProject } from "@/store/projectStore";
import type { AISuggestion } from "@/types/ai";
import type { Paper } from "@/types/paper";

/* =============================================================================
   ResearchOS — Right AI Panel
   Shows:
     - AI research suggestions (related papers, gaps, trends)
     - Related papers for active project
     - Research gap callouts
   ============================================================================= */

type PanelTab = "suggestions" | "papers" | "gaps";

const TABS: { id: PanelTab; label: string; icon: React.ElementType }[] = [
  { id: "suggestions", label: "Suggestions", icon: Sparkles   },
  { id: "papers",      label: "Related",     icon: BookOpen   },
  { id: "gaps",        label: "Gaps",        icon: AlertTriangle },
];

/* ---- Mock data (replaced by real API calls in hooks) ---- */
const MOCK_SUGGESTIONS: AISuggestion[] = [
  {
    id: "1",
    type: "trending_topic",
    title: "Multimodal LLMs in Scientific Discovery",
    description: "Rapidly growing area combining vision and language models for lab automation.",
    confidence: 0.91,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    type: "research_gap",
    title: "Mixed-fabric recycling under humid conditions",
    description: "No published studies address >40% polyester blends in high-humidity environments.",
    confidence: 0.87,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: "3",
    type: "methodology",
    title: "Contrastive learning for citation graphs",
    description: "Emerging method showing strong results in paper recommendation systems.",
    confidence: 0.78,
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: "4",
    type: "dataset",
    title: "OpenAlex full corpus dump (2024)",
    description: "250M+ works with full metadata. Suitable for large-scale bibliometric analysis.",
    confidence: 0.95,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
];

const MOCK_PAPERS: Paper[] = [
  {
    id: "p1",
    title: "Attention Is All You Need: Revisited for Scientific Literature",
    authors: ["Vaswani, A.", "Shazeer, N.", "Parmar, N."],
    abstract: "We revisit the transformer architecture for scientific literature processing...",
    doi: "10.1234/example",
    year: 2024,
    venue: "NeurIPS",
    url: null,
    pdfUrl: null,
    citationCount: 4821,
    referenceCount: 67,
    source: "semantic_scholar",
    externalId: "ext1",
    relevanceScore: 0.94,
    isOpenAccess: true,
    fields: ["Computer Science", "AI"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "p2",
    title: "Large Language Models for Systematic Literature Review Automation",
    authors: ["Zhang, Y.", "Liu, X.", "Chen, R.", "Wang, M."],
    abstract: "This paper presents a framework for automating systematic reviews...",
    doi: null,
    year: 2024,
    venue: "ACL",
    url: null,
    pdfUrl: null,
    citationCount: 312,
    referenceCount: 89,
    source: "openalex",
    externalId: "ext2",
    relevanceScore: 0.88,
    isOpenAccess: false,
    fields: ["NLP"],
    createdAt: new Date().toISOString(),
  },
];

const MOCK_GAPS = [
  {
    id: "g1",
    description: "No studies address mixed-fabric recycling under high humidity (>80% RH).",
    confidence: 0.89,
    category: "missing_experiment" as const,
    supportingPaperIds: ["p1", "p2"],
  },
  {
    id: "g2",
    description: "Contradiction detected: Zhang (2023) reports 67% efficiency while Liu (2024) reports 43% under identical conditions.",
    confidence: 0.92,
    category: "contradiction" as const,
    supportingPaperIds: ["p1"],
  },
  {
    id: "g3",
    description: "Nano-coating effects on recycled fiber strength remain unexplored in peer-reviewed literature.",
    confidence: 0.76,
    category: "unexplored_topic" as const,
    supportingPaperIds: [],
  },
];

/* =============================================================================
   Component
   ============================================================================= */

export default function RightPanel() {
  // const user           = useAuthStore((s) => s.user);
  const activeProject  = useActiveProject();
  const [activeTab, setActiveTab]     = useState<PanelTab>("suggestions");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expanded, setExpanded]       = useState<Record<string, boolean>>({});

  function toggleExpanded(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function refresh() {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 1200)); // simulate API call
    setIsRefreshing(false);
  }

  return (
    <aside
      className="workspace-panel"
      style={{ width: "var(--panel-width)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-foreground">AI Assistant</span>
        </div>
        <button
          onClick={refresh}
          disabled={isRefreshing}
          className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-50"
          aria-label="Refresh suggestions"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", isRefreshing && "animate-spin")} />
        </button>
      </div>

      {/* Context pill */}
      {activeProject && (
        <div className="px-4 py-2 border-b border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Context:</span>
            <span className="flex items-center gap-1 font-medium text-foreground">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: activeProject.color }}
              />
              {activeProject.name}
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors border-b-2",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-3 h-3" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">

        {/* ------------------------------------------------------------ */}
        {/* Suggestions tab                                               */}
        {/* ------------------------------------------------------------ */}
        {activeTab === "suggestions" && (
          <div className="p-3 space-y-2">
            {MOCK_SUGGESTIONS.map((s) => (
              <SuggestionCard
                key={s.id}
                suggestion={s}
                expanded={!!expanded[s.id]}
                onToggle={() => toggleExpanded(s.id)}
              />
            ))}
            <p className="text-xs text-muted-foreground text-center pt-2 pb-1">
              Based on your project &amp; recent activity
            </p>
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* Related papers tab                                            */}
        {/* ------------------------------------------------------------ */}
        {activeTab === "papers" && (
          <div className="p-3 space-y-2">
            {MOCK_PAPERS.map((paper) => (
              <RelatedPaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* Research gaps tab                                             */}
        {/* ------------------------------------------------------------ */}
        {activeTab === "gaps" && (
          <div className="p-3 space-y-2">
            {MOCK_GAPS.map((gap) => (
              <GapCard key={gap.id} gap={gap} />
            ))}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
              <p className="font-medium text-primary mb-1">How gaps are detected</p>
              <p>AI analyzes contradictions, missing experiments, and underexplored areas across all papers in your project.</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

/* =============================================================================
   Sub-components
   ============================================================================= */

/* ---- Suggestion card ---- */
function SuggestionCard({
  suggestion,
  expanded,
  onToggle,
}: {
  suggestion: AISuggestion;
  expanded:   boolean;
  onToggle:   () => void;
}) {
  const iconMap: Record<AISuggestion["type"], React.ElementType> = {
    related_paper:  BookOpen,
    research_gap:   AlertTriangle,
    trending_topic: TrendingUp,
    methodology:    Sparkles,
    dataset:        BookOpen,
    search_query:   BookOpen,
  };

  const colorMap: Record<AISuggestion["type"], string> = {
    related_paper:  "text-blue-500 bg-blue-500/10",
    research_gap:   "text-amber-500 bg-amber-500/10",
    trending_topic: "text-emerald-500 bg-emerald-500/10",
    methodology:    "text-purple-500 bg-purple-500/10",
    dataset:        "text-cyan-500 bg-cyan-500/10",
    search_query:   "text-blue-500 bg-blue-500/10",
  };

  const Icon  = iconMap[suggestion.type];
  const color = colorMap[suggestion.type];

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-2.5 p-3 text-left hover:bg-accent/50 transition-colors"
      >
        <div className={cn("w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5", color)}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground leading-snug line-clamp-2">
            {suggestion.title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(suggestion.createdAt)}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-emerald-500">
              {Math.round(suggestion.confidence * 100)}% confident
            </span>
          </div>
        </div>
        {expanded
          ? <ChevronUp   className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
          : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
        }
      </button>

      {expanded && (
        <div className="px-3 pb-3 pt-0 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground leading-relaxed pt-2">
            {suggestion.description}
          </p>
        </div>
      )}
    </div>
  );
}

/* ---- Related paper card ---- */
function RelatedPaperCard({ paper }: { paper: Paper }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 hover:border-primary/30 transition-colors group">
      <p className="text-xs font-medium text-foreground leading-snug line-clamp-2 mb-1">
        {paper.title}
      </p>
      <p className="text-xs text-muted-foreground mb-2">
        {formatAuthors(paper.authors, 2)} · {paper.year}
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {formatNumber(paper.citationCount)} citations
          </span>
          {paper.isOpenAccess && (
            <span className="text-xs text-emerald-500 border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Open
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-primary font-medium">
            {Math.round(paper.relevanceScore * 100)}% match
          </span>
          {paper.url && (
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Open paper"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- Gap card ---- */
function GapCard({
  gap,
}: {
  gap: { id: string; description: string; confidence: number; category: string };
}) {
  const categoryConfig = {
    missing_experiment: { label: "Missing experiment", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
    contradiction:      { label: "Contradiction",      color: "text-red-500 bg-red-500/10 border-red-500/20"      },
    unexplored_topic:   { label: "Unexplored topic",   color: "text-blue-500 bg-blue-500/10 border-blue-500/20"   },
  } as const;

  const config = categoryConfig[gap.category as keyof typeof categoryConfig];

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-start gap-2 mb-2">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <span className={cn(
            "inline-block text-xs px-2 py-0.5 rounded-full border font-medium mb-1.5",
            config.color
          )}>
            {config.label}
          </span>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {gap.description}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          <div className="h-1 w-16 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${gap.confidence * 100}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            {Math.round(gap.confidence * 100)}%
          </span>
        </div>
        <Lightbulb className="w-3.5 h-3.5 text-muted-foreground" />
      </div>
    </div>
  );
}