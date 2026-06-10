"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, Upload, BookOpen, Plus, ArrowRight,
  FileText, TrendingUp, Clock, Zap,
} from "lucide-react";
import { formatCount, timeAgo } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { useUser, useSubscriptionTier } from "@/store/authStore";
import { useProjects, useProjectStore } from "@/store/projectStore";
import { toast } from "sonner";

/* =============================================================================
   ResearchOS — Dashboard Home Page
   Shows:
     - Greeting + quick actions
     - Recent projects
     - Usage stats
     - Getting started checklist (new users)
   ============================================================================= */

/* ---- Mock stats (replaced by real API data later) ---- */
const MOCK_STATS = [
  { label: "Papers saved",      value: 24,   icon: BookOpen,   delta: "+3 this week"  },
  { label: "PDFs uploaded",     value: 7,    icon: FileText,   delta: "+1 today"      },
  { label: "Searches run",      value: 41,   icon: Search,     delta: "Last 30 days"  },
  { label: "Citations generated", value: 18, icon: Zap,        delta: "+5 this week"  },
];

const QUICK_ACTIONS = [
  {
    label:       "Search papers",
    description: "Find papers across OpenAlex, arXiv & Semantic Scholar",
    href:        ROUTES.SEARCH,
    icon:        Search,
    color:       "bg-blue-500/10 text-blue-500",
  },
  {
    label:       "Upload a PDF",
    description: "Chat with any paper using AI",
    href:        ROUTES.UPLOAD,
    icon:        Upload,
    color:       "bg-purple-500/10 text-purple-500",
  },
  {
    label:       "New project",
    description: "Organise papers and notes in one place",
    href:        null,
    icon:        Plus,
    color:       "bg-emerald-500/10 text-emerald-500",
    action:      "new-project",
  },
  {
    label:       "Literature review",
    description: "Generate a structured review from selected papers",
    href:        ROUTES.PROJECTS,
    icon:        BookOpen,
    color:       "bg-amber-500/10 text-amber-500",
  },
];

const CHECKLIST = [
  { id: "search",   label: "Run your first paper search",     done: true  },
  { id: "upload",   label: "Upload and chat with a PDF",      done: false },
  { id: "project",  label: "Create a research project",       done: false },
  { id: "litreview",label: "Generate a literature review",    done: false },
  { id: "citation", label: "Export a citation",               done: false },
];

/* =============================================================================
   Component
   ============================================================================= */

export default function DashboardPage() {
  const router          = useRouter();
  const user            = useUser();
  const tier            = useSubscriptionTier();
  const projects        = useProjects();
  const createProject   = useProjectStore((s) => s.createProject);
  const setActiveProject = useProjectStore((s) => s.setActiveProject);

  const firstName = user?.name?.split(" ")[0] ?? "Researcher";
  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  /* ------------------------------------------------------------------ */
  /* Handlers                                                             */
  /* ------------------------------------------------------------------ */
  async function handleNewProject() {
    try {
      const project = await createProject({ name: "Untitled Project", color: "#6366f1" });
      setActiveProject(project.id);
      router.push(ROUTES.PROJECTS);
      toast.success("Project created");
    } catch {
      toast.error("Could not create project");
    }
  }

  function handleQuickAction(action: typeof QUICK_ACTIONS[number]) {
    if (action.action === "new-project") {
      handleNewProject();
    } else if (action.href) {
      router.push(action.href);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

        {/* ------------------------------------------------------------ */}
        {/* Greeting header                                               */}
        {/* ------------------------------------------------------------ */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {greeting}, {firstName} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {projects.length === 0
                ? "Welcome to ResearchOS. Let's get started."
                : `You have ${projects.length} project${projects.length !== 1 ? "s" : ""}. What are you working on today?`
              }
            </p>
          </div>

          {/* Tier badge */}
          <div className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border capitalize
            ${tier === "free"
              ? "bg-muted text-muted-foreground border-border"
              : tier === "pro"
              ? "bg-primary/10 text-primary border-primary/30"
              : "bg-amber-500/10 text-amber-500 border-amber-500/30"
            }`}
          >
            {tier} plan
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Stats row                                                     */}
        {/* ------------------------------------------------------------ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {MOCK_STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <stat.icon className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">
                {formatCount(stat.value)}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-500" />
                {stat.delta}
              </div>
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Quick actions                                                 */}
        {/* ------------------------------------------------------------ */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Quick actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                onClick={() => handleQuickAction(action)}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card
                  hover:border-primary/40 hover:bg-accent/50 transition-all text-left group"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${action.color}`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{action.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{action.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </button>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Recent projects                                               */}
        {/* ------------------------------------------------------------ */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-foreground">Recent projects</h2>
            <Link
              href={ROUTES.PROJECTS}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {projects.length === 0 ? (
            /* Empty state */
            <div className="rounded-lg border border-dashed border-border bg-card/50 p-8 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">No projects yet</p>
              <p className="text-xs text-muted-foreground mb-4">
                Create a project to organise your papers, PDFs, and notes.
              </p>
              <button
                onClick={handleNewProject}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground
                  px-4 py-2 rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Create first project
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {projects.slice(0, 6).map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setActiveProject(project.id);
                    router.push(ROUTES.PROJECTS);
                  }}
                  className="flex flex-col p-4 rounded-lg border border-border bg-card
                    hover:border-primary/40 hover:bg-accent/30 transition-all text-left group"
                >
                  {/* Color bar */}
                  <div
                    className="w-full h-1 rounded-full mb-3"
                    style={{ backgroundColor: project.color }}
                  />
                  <p className="text-sm font-medium text-foreground truncate mb-1">
                    {project.name}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {project.paperCount} papers
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {project.pdfCount} PDFs
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                    <Clock className="w-3 h-3" />
                    {timeAgo(project.updatedAt)}
                  </div>
                </button>
              ))}

              {/* New project card */}
              <button
                onClick={handleNewProject}
                className="flex flex-col items-center justify-center p-4 rounded-lg border border-dashed border-border
                  hover:border-primary/40 hover:bg-accent/30 transition-all text-muted-foreground hover:text-foreground group min-h-[100px]"
              >
                <Plus className="w-5 h-5 mb-1.5 group-hover:text-primary transition-colors" />
                <span className="text-xs font-medium">New project</span>
              </button>
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Getting started checklist                                     */}
        {/* ------------------------------------------------------------ */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Getting started</h2>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {/* Progress bar */}
            <div className="h-1 bg-muted">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{
                  width: `${(CHECKLIST.filter((c) => c.done).length / CHECKLIST.length) * 100}%`,
                }}
              />
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">
                  {CHECKLIST.filter((c) => c.done).length} of {CHECKLIST.length} completed
                </p>
              </div>
              <ul className="space-y-2">
                {CHECKLIST.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0
                      ${item.done
                        ? "bg-primary border-primary"
                        : "border-muted-foreground/30"
                      }`}
                    >
                      {item.done && (
                        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm ${item.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}