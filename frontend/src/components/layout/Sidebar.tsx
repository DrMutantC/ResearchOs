"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen, Search, FolderOpen, Library, Upload,
  Settings, ChevronRight, Plus, LogOut, User,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ROUTES, APP_NAME } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import {
  useProjectStore,
  useProjects,
  useSidebarOpen,
  useActiveProjectId,
} from "@/store/projectStore";

/* =============================================================================
   ResearchOS — Left Sidebar
   ============================================================================= */

const NAV_ITEMS = [
  { label: "Dashboard",  href: ROUTES.DASHBOARD, icon: BookOpen  },
  { label: "Search",     href: ROUTES.SEARCH,    icon: Search    },
  { label: "Projects",   href: ROUTES.PROJECTS,  icon: FolderOpen },
  { label: "Library",    href: ROUTES.LIBRARY,   icon: Library   },
  { label: "Upload PDF", href: ROUTES.UPLOAD,    icon: Upload    },
];

export default function Sidebar() {
  const pathname         = usePathname();
  const user             = useAuthStore((s) => s.user);
  const logout           = useAuthStore((s) => s.logout);
  const sidebarOpen      = useSidebarOpen();
  const toggleSidebar    = useProjectStore((s) => s.toggleSidebar);
  const projects         = useProjects();
  const activeProjectId  = useActiveProjectId();
  const setActiveProject = useProjectStore((s) => s.setActiveProject);
  const createProject    = useProjectStore((s) => s.createProject);

  /* ------------------------------------------------------------------ */
  /* Helpers                                                              */
  /* ------------------------------------------------------------------ */
  function isActive(href: string) {
    if (href === ROUTES.DASHBOARD) return pathname === href;
    return pathname.startsWith(href);
  }

  async function handleNewProject() {
    try {
      const project = await createProject({
        name:  "Untitled Project",
        color: "#6366f1",
      });
      setActiveProject(project.id);
      toast.success("Project created");
    } catch {
      toast.error("Could not create project");
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch {
      toast.error("Logout failed");
    }
  }

  /* ------------------------------------------------------------------ */
  /* Collapsed sidebar                                                    */
  /* ------------------------------------------------------------------ */
  if (!sidebarOpen) {
    return (
      <aside className="hidden md:flex flex-col items-center border-r border-border bg-sidebar shrink-0 w-14 py-3 gap-1">
        {/* Logo */}
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
          <BookOpen className="w-4 h-4 text-primary" />
        </div>

        {/* Expand button */}
        <button
          onClick={toggleSidebar}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Expand sidebar"
        >
          <PanelLeftOpen className="w-4 h-4" />
        </button>

        <div className="w-full border-t border-border my-1" />

        {/* Collapsed nav icons */}
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
              isActive(item.href)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <item.icon className="w-4 h-4" />
          </Link>
        ))}

        {/* Settings at bottom */}
        <div className="mt-auto">
          <Link
            href={ROUTES.SETTINGS}
            title="Settings"
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
              isActive(ROUTES.SETTINGS)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <Settings className="w-4 h-4" />
          </Link>
        </div>
      </aside>
    );
  }

  /* ------------------------------------------------------------------ */
  /* Expanded sidebar                                                     */
  /* ------------------------------------------------------------------ */
  return (
    <aside
      className="hidden md:flex flex-col border-r border-border bg-sidebar shrink-0"
      style={{ width: "var(--sidebar-width)" }}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5 text-primary" />
          </div>
          {APP_NAME}
        </div>
        <button
          onClick={toggleSidebar}
          className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto no-scrollbar py-3 px-2 space-y-1">

        {/* Main navigation */}
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors",
              isActive(item.href)
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </Link>
        ))}

        {/* Divider */}
        <div className="pt-3 pb-1 px-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Projects
            </span>
            <button
              onClick={handleNewProject}
              className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="New project"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Project list */}
        {projects.length === 0 ? (
          <div className="px-3 py-2 text-xs text-muted-foreground">
            No projects yet.{" "}
            <button
              onClick={handleNewProject}
              className="text-primary hover:underline"
            >
              Create one
            </button>
          </div>
        ) : (
          <div className="space-y-0.5">
            {projects.slice(0, 8).map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  setActiveProject(project.id);
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                  activeProjectId === project.id
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {/* Project color dot */}
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                <span className="truncate flex-1">{project.name}</span>
                <ChevronRight className="w-3 h-3 shrink-0 opacity-40" />
              </button>
            ))}
            {projects.length > 8 && (
              <Link
                href={ROUTES.PROJECTS}
                className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                +{projects.length - 8} more projects
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Footer — user info + settings */}
      <div className="border-t border-border p-2 shrink-0">
        <Link
          href={ROUTES.SETTINGS}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors mb-1",
            isActive(ROUTES.SETTINGS)
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          )}
        >
          <Settings className="w-4 h-4 shrink-0" />
          Settings
        </Link>

        {/* User row */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg">
          {/* Avatar */}
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            {user?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.name ?? "User"}
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <User className="w-3.5 h-3.5 text-primary" />
            )}
          </div>

          {/* Name + email */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {user?.name ?? "Researcher"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}