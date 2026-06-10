"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar     from "@/components/layout/Sidebar";
import TopBar      from "@/components/layout/TopBar";
import RightPanel  from "@/components/layout/RightPanel";
import { useIsAuth, useIsOnboarded } from "@/store/authStore";
import { useProjectStore, useRightPanelOpen } from "@/store/projectStore";
import { ROUTES } from "@/lib/constants";

/* =============================================================================
   ResearchOS — Dashboard Layout
   Wires together:
     Sidebar (left) + Main content (center) + RightPanel (right)
   Guards:
     - Unauthenticated → redirect to /login
     - Not onboarded   → redirect to /onboarding
   ============================================================================= */

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router          = useRouter();
  const isAuthenticated = useIsAuth();
  const isOnboarded     = useIsOnboarded();
  const rightPanelOpen  = useRightPanelOpen();
  const fetchProjects   = useProjectStore((s) => s.fetchProjects);

  /* ------------------------------------------------------------------ */
  /* Auth guard                                                           */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(ROUTES.LOGIN);
      return;
    }
    if (!isOnboarded) {
      router.replace(ROUTES.ONBOARDING);
      return;
    }
  }, [isAuthenticated, isOnboarded, router]);

  /* ------------------------------------------------------------------ */
  /* Fetch projects on mount                                              */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (isAuthenticated && isOnboarded) {
      fetchProjects("").catch(() => {
        // silently fail — sidebar shows empty state
      });
    }
  }, [isAuthenticated, isOnboarded, fetchProjects]);

  /* ------------------------------------------------------------------ */
  /* Don't render until authenticated                                    */
  /* ------------------------------------------------------------------ */
  if (!isAuthenticated || !isOnboarded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading workspace…</p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /* Render workspace shell                                               */
  /* ------------------------------------------------------------------ */
  return (
    <div className="workspace-layout">

      {/* Left sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="workspace-main min-w-0">

        {/* Top bar */}
        <TopBar />

        {/* Content + right panel */}
        <div className="workspace-content">

          {/* Center content — page renders here */}
          <main className="workspace-center">
            {children}
          </main>

          {/* Right AI panel — conditionally shown */}
          {rightPanelOpen && <RightPanel />}
        </div>
      </div>
    </div>
  );
}