/* =============================================================================
   ResearchOS — Project & Workspace Store (Zustand)
   Manages active project, workspace view state, and PDF context.
   ============================================================================= */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Project,
  CreateProjectRequest,
  UpdateProjectRequest,
  PDFUpload,
  WorkspaceView,
} from "@/types/project";
import type { Paper, SavedPaper } from "@/types/paper";
import { API, API_URL, STORAGE_KEYS } from "@/lib/constants";

/* -----------------------------------------------------------------------------
   State shape
   ----------------------------------------------------------------------------- */
interface ProjectState {
  // Projects
  projects:          Project[];
  activeProjectId:   string | null;

  // Workspace
  activeView:        WorkspaceView;
  sidebarOpen:       boolean;
  rightPanelOpen:    boolean;

  // Active PDF
  activePDFId:       string | null;
  pdfUploads:        PDFUpload[];

  // Saved papers in current project
  savedPapers:       SavedPaper[];

  // UI flags
  isLoading:         boolean;
  error:             string | null;

  // Project actions
  fetchProjects:     (token: string)                                  => Promise<void>;
  createProject:     (data: CreateProjectRequest, token?: string)      => Promise<Project>;
  updateProject:     (id: string, data: UpdateProjectRequest, token: string) => Promise<void>;
  deleteProject:     (id: string, token: string)                      => Promise<void>;
  setActiveProject:  (id: string | null)                              => void;

  // PDF actions
  fetchPDFs:         (projectId: string, token: string)               => Promise<void>;
  setActivePDF:      (id: string | null)                              => void;
  removePDF:         (id: string)                                     => void;
  addPDF:            (pdf: PDFUpload)                                 => void;

  // Saved paper actions
  fetchSavedPapers:  (projectId: string, token: string)               => Promise<void>;
  savePaper:         (paper: Paper, token: string)                    => Promise<void>;
  unsavePaper:       (paperId: string, token: string)                 => Promise<void>;

  // Workspace UI
  setActiveView:     (view: WorkspaceView)                            => void;
  setSidebarOpen:    (open: boolean)                                  => void;
  setRightPanelOpen: (open: boolean)                                  => void;
  toggleSidebar:     ()                                               => void;
  toggleRightPanel:  ()                                               => void;

  // Helpers
  activeProject:     () => Project | null;
  clearError:        ()                                               => void;
}

/* -----------------------------------------------------------------------------
   Store
   ----------------------------------------------------------------------------- */
export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      // -----------------------------------------------------------------------
      // Initial state
      // -----------------------------------------------------------------------
      projects:        [],
      activeProjectId: null,
      activeView:      "editor",
      sidebarOpen:     true,
      rightPanelOpen:  true,
      activePDFId:     null,
      pdfUploads:      [],
      savedPapers:     [],
      isLoading:       false,
      error:           null,

      // -----------------------------------------------------------------------
      // Fetch all projects for the current user
      // -----------------------------------------------------------------------
      fetchProjects: async (token: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(`${API_URL}${API.PROJECTS.LIST}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Failed to fetch projects.");
          const data = await res.json();
          set({ projects: data.projects ?? data, isLoading: false });
        } catch (err) {
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : "Failed to fetch projects.",
          });
        }
      },

      // -----------------------------------------------------------------------
      // Create project
      // -----------------------------------------------------------------------
      createProject: async (data: CreateProjectRequest, token?: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(`${API_URL}${API.PROJECTS.CREATE}`, {
            method:  "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization:  `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("Failed to create project.");
          const project: Project = await res.json();
          set((state) => ({
            projects:        [project, ...state.projects],
            activeProjectId: project.id,
            isLoading:       false,
          }));
          return project;
        } catch (err) {
          set({
            isLoading: false,
            error: err instanceof Error ? err.message : "Failed to create project.",
          });
          throw err;
        }
      },

      // -----------------------------------------------------------------------
      // Update project
      // -----------------------------------------------------------------------
      updateProject: async (id: string, data: UpdateProjectRequest, token: string) => {
        try {
          const res = await fetch(`${API_URL}${API.PROJECTS.UPDATE(id)}`, {
            method:  "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization:  `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error("Failed to update project.");
          const updated: Project = await res.json();
          set((state) => ({
            projects: state.projects.map((p) =>
              p.id === id ? updated : p
            ),
          }));
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Failed to update project.",
          });
          throw err;
        }
      },

      // -----------------------------------------------------------------------
      // Delete project
      // -----------------------------------------------------------------------
      deleteProject: async (id: string, token: string) => {
        try {
          const res = await fetch(`${API_URL}${API.PROJECTS.DELETE(id)}`, {
            method:  "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Failed to delete project.");
          set((state) => ({
            projects:        state.projects.filter((p) => p.id !== id),
            activeProjectId: state.activeProjectId === id ? null : state.activeProjectId,
          }));
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Failed to delete project.",
          });
          throw err;
        }
      },

      // -----------------------------------------------------------------------
      // Set active project
      // -----------------------------------------------------------------------
      setActiveProject: (id: string | null) => {
        set({
          activeProjectId: id,
          activePDFId:     null,
          savedPapers:     [],
          activeView:      "editor",
        });
      },

      // -----------------------------------------------------------------------
      // PDF actions
      // -----------------------------------------------------------------------
      fetchPDFs: async (projectId: string, token: string) => {
        try {
          const res = await fetch(
            `${API_URL}${API.PROJECTS.DETAIL(projectId)}/pdfs`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!res.ok) throw new Error("Failed to fetch PDFs.");
          const data = await res.json();
          set({ pdfUploads: data.pdfs ?? data });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Failed to fetch PDFs.",
          });
        }
      },

      setActivePDF: (id: string | null) => {
        set({
          activePDFId: id,
          activeView:  id ? "pdf" : "editor",
        });
      },

      removePDF: (id: string) => {
        set((state) => ({
          pdfUploads: state.pdfUploads.filter((p) => p.id !== id),
          activePDFId: state.activePDFId === id ? null : state.activePDFId,
        }));
      },

      addPDF: (pdf: PDFUpload) => {
        set((state) => ({
          pdfUploads: [pdf, ...state.pdfUploads],
          activePDFId: pdf.id,
          activeView:  "pdf",
        }));
      },

      // -----------------------------------------------------------------------
      // Saved papers
      // -----------------------------------------------------------------------
      fetchSavedPapers: async (projectId: string, token: string) => {
        try {
          const res = await fetch(
            `${API_URL}${API.PROJECTS.DETAIL(projectId)}/papers`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!res.ok) throw new Error("Failed to fetch saved papers.");
          const data = await res.json();
          set({ savedPapers: data.papers ?? data });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Failed to fetch saved papers.",
          });
        }
      },

      savePaper: async (paper: Paper, token: string) => {
        const { activeProjectId } = get();
        try {
          const res = await fetch(`${API_URL}${API.PAPERS.SAVE(paper.id)}`, {
            method:  "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization:  `Bearer ${token}`,
            },
            body: JSON.stringify({ project_id: activeProjectId }),
          });
          if (!res.ok) throw new Error("Failed to save paper.");
          const saved: SavedPaper = await res.json();
          // Optimistic update
          set((state) => ({
            savedPapers: [saved, ...state.savedPapers],
          }));
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Failed to save paper.",
          });
          throw err;
        }
      },

      unsavePaper: async (paperId: string, token: string) => {
        // Optimistic update first
        set((state) => ({
          savedPapers: state.savedPapers.filter((sp) => sp.paperId !== paperId),
        }));
        try {
          const res = await fetch(`${API_URL}${API.PAPERS.UNSAVE(paperId)}`, {
            method:  "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Failed to unsave paper.");
        } catch (err) {
          // Rollback would go here in production — for now just show error
          set({
            error: err instanceof Error ? err.message : "Failed to unsave paper.",
          });
          throw err;
        }
      },

      // -----------------------------------------------------------------------
      // Workspace UI
      // -----------------------------------------------------------------------
      setActiveView:     (view) => set({ activeView: view }),
      setSidebarOpen:    (open) => set({ sidebarOpen: open }),
      setRightPanelOpen: (open) => set({ rightPanelOpen: open }),
      toggleSidebar:     ()     => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      toggleRightPanel:  ()     => set((s) => ({ rightPanelOpen: !s.rightPanelOpen })),

      // -----------------------------------------------------------------------
      // Helpers
      // -----------------------------------------------------------------------
      activeProject: () => {
        const { projects, activeProjectId } = get();
        return projects.find((p) => p.id === activeProjectId) ?? null;
      },

      clearError: () => set({ error: null }),
    }),

    // -------------------------------------------------------------------------
    // Persist only layout preferences — not data (data comes from API)
    // -------------------------------------------------------------------------
    {
      name:    STORAGE_KEYS.SIDEBAR_OPEN,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeProjectId: state.activeProjectId,
        sidebarOpen:     state.sidebarOpen,
        rightPanelOpen:  state.rightPanelOpen,
        activeView:      state.activeView,
      }),
    }
  )
);

/* -----------------------------------------------------------------------------
   Selector hooks
   ----------------------------------------------------------------------------- */
export const useProjects        = () => useProjectStore((s) => s.projects);
export const useActiveProject   = () => useProjectStore((s) => s.activeProject());
export const useActiveProjectId = () => useProjectStore((s) => s.activeProjectId);
export const useActivePDFId     = () => useProjectStore((s) => s.activePDFId);
export const usePDFUploads      = () => useProjectStore((s) => s.pdfUploads);
export const useSavedPapers     = () => useProjectStore((s) => s.savedPapers);
export const useActiveView      = () => useProjectStore((s) => s.activeView);
export const useSidebarOpen     = () => useProjectStore((s) => s.sidebarOpen);
export const useRightPanelOpen  = () => useProjectStore((s) => s.rightPanelOpen);
export const useProjectLoading  = () => useProjectStore((s) => s.isLoading);
export const useProjectError    = () => useProjectStore((s) => s.error);