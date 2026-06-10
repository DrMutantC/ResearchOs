"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Bell, PanelRightOpen, PanelRightClose,
  Plus, Command, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import { useProjectStore, useActiveProject, useRightPanelOpen } from "@/store/projectStore";

/* =============================================================================
   ResearchOS — Top Bar
   Contains:
     - Active project name / breadcrumb
     - Global quick-search (Cmd+K)
     - Notifications bell
     - Right panel toggle
     - New project button
   ============================================================================= */

export default function TopBar() {
  const router           = useRouter();
  const user             = useAuthStore((s) => s.user);
  const activeProject    = useActiveProject();
  const rightPanelOpen   = useRightPanelOpen();
  const toggleRightPanel = useProjectStore((s) => s.toggleRightPanel);
  const createProject    = useProjectStore((s) => s.createProject);
  const setActiveProject = useProjectStore((s) => s.setActiveProject);

  const [searchOpen,  setSearchOpen]  = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  /* ------------------------------------------------------------------ */
  /* Cmd+K global shortcut                                               */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchQuery("");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  /* ------------------------------------------------------------------ */
  /* Handlers                                                             */
  /* ------------------------------------------------------------------ */
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
  }

  async function handleNewProject() {
    const project = await createProject({ name: "Untitled Project", color: "#6366f1" });
    setActiveProject(project.id);
    router.push(ROUTES.PROJECTS);
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <>
      <header className="workspace-topbar shrink-0 z-topbar">
        <div className="flex items-center gap-3 flex-1 min-w-0">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs text-muted-foreground hidden sm:block">
              {user?.name?.split(" ")[0] ?? "Workspace"}
            </span>
            {activeProject && (
              <>
                <span className="text-xs text-muted-foreground hidden sm:block">/</span>
                <span className="flex items-center gap-1.5 text-xs font-medium text-foreground truncate max-w-[160px]">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: activeProject.color }}
                  />
                  {activeProject.name}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Center — search trigger */}
        <div className="flex-1 flex justify-center px-4">
          <button
            onClick={() => setSearchOpen(true)}
            className={cn(
              "hidden sm:flex items-center gap-2 w-full max-w-xs h-8 px-3 rounded-lg",
              "border border-input bg-muted/50 text-muted-foreground text-xs",
              "hover:border-primary/40 hover:bg-muted transition-colors"
            )}
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="flex-1 text-left">Search papers…</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-xs bg-background border border-border px-1.5 py-0.5 rounded">
              <Command className="w-2.5 h-2.5" />K
            </kbd>
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">

          {/* Mobile search icon */}
          <button
            onClick={() => setSearchOpen(true)}
            className="sm:hidden w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* New project */}
          <button
            onClick={handleNewProject}
            className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-medium
              bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            aria-label="New project"
          >
            <Plus className="w-3.5 h-3.5" />
            New
          </button>

          {/* Notifications */}
          <button
            className="relative w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {/* Unread dot */}
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
          </button>

          {/* Right panel toggle */}
          <button
            onClick={toggleRightPanel}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              rightPanelOpen
                ? "text-primary bg-primary/10 hover:bg-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
            aria-label={rightPanelOpen ? "Close AI panel" : "Open AI panel"}
            title={rightPanelOpen ? "Close AI panel" : "Open AI panel"}
          >
            {rightPanelOpen
              ? <PanelRightClose className="w-4 h-4" />
              : <PanelRightOpen  className="w-4 h-4" />
            }
          </button>
        </div>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* Quick-search overlay (Cmd+K)                                      */}
      {/* ---------------------------------------------------------------- */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-modal bg-background/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSearchOpen(false);
              setSearchQuery("");
            }
          }}
        >
          <div className="w-full max-w-xl bg-card border border-border rounded-xl shadow-panel overflow-hidden">

            {/* Search input */}
            <form onSubmit={handleSearch}>
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search papers, topics, authors…"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <kbd className="text-xs text-muted-foreground border border-border px-1.5 py-0.5 rounded bg-muted">
                  Esc
                </kbd>
              </div>
            </form>

            {/* Quick actions */}
            <div className="p-2">
              <p className="text-xs text-muted-foreground px-2 py-1.5">Quick actions</p>
              {[
                { label: "Search papers",         href: ROUTES.SEARCH,   icon: Search    },
                { label: "Upload a PDF",          href: ROUTES.UPLOAD,   icon: Plus      },
                { label: "New project",           action: handleNewProject, icon: Plus   },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    setSearchOpen(false);
                    if ("action" in item && item.action) item.action();
                    else if ("href" in item) router.push(item.href);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors text-left"
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Footer hint */}
            <div className="border-t border-border px-4 py-2 flex items-center gap-3 text-xs text-muted-foreground">
              <span><kbd className="bg-muted border border-border px-1 rounded">↵</kbd> to search</span>
              <span><kbd className="bg-muted border border-border px-1 rounded">Esc</kbd> to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}