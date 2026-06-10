/* =============================================================================
   ResearchOS — Project & Workspace Types
   ============================================================================= */

/* -----------------------------------------------------------------------------
   Project
   ----------------------------------------------------------------------------- */
export interface Project {
  id:          string;
  userId:      string;
  name:        string;
  description: string | null;
  color:       string;               // hex color for project card
  icon:        string | null;        // emoji or icon name
  paperCount:  number;
  pdfCount:    number;
  createdAt:   string;
  updatedAt:   string;
}

export interface CreateProjectRequest {
  name:        string;
  description?: string;
  color?:      string;
  icon?:       string;
}

export interface UpdateProjectRequest {
  name?:        string;
  description?: string;
  color?:       string;
  icon?:        string;
}

/* -----------------------------------------------------------------------------
   Folder (nested inside projects)
   ----------------------------------------------------------------------------- */
export interface Folder {
  id:        string;
  projectId: string;
  name:      string;
  parentId:  string | null;          // null = root level
  children:  Folder[];
  createdAt: string;
}

/* -----------------------------------------------------------------------------
   PDF Upload
   ----------------------------------------------------------------------------- */
export interface PDFUpload {
  id:          string;
  userId:      string;
  projectId:   string | null;
  fileName:    string;
  fileSize:    number;               // bytes
  pageCount:   number | null;
  s3Key:       string;
  status:      PDFStatus;
  uploadedAt:  string;
  processedAt: string | null;
}

export type PDFStatus =
  | "uploading"
  | "processing"
  | "ready"
  | "failed";

export interface PDFUploadResponse {
  upload:    PDFUpload;
  uploadUrl: string;                 // presigned S3 URL for direct upload
}

/* -----------------------------------------------------------------------------
   Workspace UI state
   ----------------------------------------------------------------------------- */
export type WorkspaceView =
  | "editor"
  | "pdf"
  | "search"
  | "lit-review"
  | "citations";

export interface WorkspaceState {
  activeProjectId:  string | null;
  activePDFId:      string | null;
  activeView:       WorkspaceView;
  sidebarOpen:      boolean;
  rightPanelOpen:   boolean;
}