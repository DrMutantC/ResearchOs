"use client";

import { useState } from "react";
import { FileText, Upload, Clock, Trash2 } from "lucide-react";
import { cn, formatBytes, timeAgo } from "@/lib/utils";
import { useActiveProject } from "@/store/projectStore";
import PDFUploader  from "@/components/pdf/PDFUploader";
import PDFViewer    from "@/components/pdf/PDFViewer";
import PDFChatPanel from "@/components/pdf/PDFChatPanel";
import type { PDFUpload } from "@/types/project";

/* =============================================================================
   ResearchOS — Upload Page
   Layout:
     Left  — upload zone + uploaded files list
     Center — PDF viewer (when a file is selected)
     Right  — AI chat panel (when a file is selected)
   ============================================================================= */

export default function UploadPage() {
  const activeProject  = useActiveProject();
  const [uploads,      setUploads]      = useState<PDFUpload[]>([]);
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(true);

  const selected = uploads.find((u) => u.id === selectedId) ?? null;

  /* ------------------------------------------------------------------ */
  /* Handlers                                                             */
  /* ------------------------------------------------------------------ */
  function handleUploadComplete(upload: PDFUpload) {
    setUploads((prev) => [upload, ...prev]);
    setSelectedId(upload.id);
    setShowUploader(false);
  }

  function handleDelete(id: string) {
    setUploads((prev) => prev.filter((u) => u.id !== id));
    if (selectedId === id) {
      setSelectedId(uploads.find((u) => u.id !== id)?.id ?? null);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <div className="flex h-full overflow-hidden">

      {/* ------------------------------------------------------------ */}
      {/* Left panel — file list + uploader                            */}
      {/* ------------------------------------------------------------ */}
      <div className="w-72 shrink-0 border-r border-border flex flex-col bg-sidebar">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">PDF Library</span>
          </div>
          <button
            onClick={() => setShowUploader((v) => !v)}
            className={cn(
              "flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors",
              showUploader
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload
          </button>
        </div>

        {/* Uploader (collapsible) */}
        {showUploader && (
          <div className="p-3 border-b border-border">
            <PDFUploader
              onUploadComplete={handleUploadComplete}
              projectId={activeProject?.id}
            />
          </div>
        )}

        {/* File list */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {uploads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <FileText className="w-8 h-8 text-muted-foreground mb-3" />
              <p className="text-xs text-muted-foreground">
                No PDFs yet. Upload a paper to get started.
              </p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {uploads.map((upload) => (
                <FileListItem
                  key={upload.id}
                  upload={upload}
                  isSelected={selectedId === upload.id}
                  onSelect={() => {
                    setSelectedId(upload.id);
                    setShowUploader(false);
                  }}
                  onDelete={() => handleDelete(upload.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Project context footer */}
        {activeProject && (
          <div className="border-t border-border px-4 py-2.5">
            <p className="text-xs text-muted-foreground">
              Uploading to{" "}
              <span className="font-medium text-foreground flex items-center gap-1 inline-flex">
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{ backgroundColor: activeProject.color }}
                />
                {activeProject.name}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------ */}
      {/* Center + right — viewer + chat                               */}
      {/* ------------------------------------------------------------ */}
      {selected ? (
        <>
          {/* PDF Viewer — center */}
          <div className="flex-1 min-w-0 overflow-hidden">
            <PDFViewer
              url={selected.s3Key}
              fileName={selected.fileName}
              className="h-full"
            />
          </div>

          {/* Chat panel — right */}
          <div className="w-80 shrink-0 border-l border-border">
            <PDFChatPanel
              pdfId={selected.id}
              fileName={selected.fileName}
              className="h-full"
            />
          </div>
        </>
      ) : (
        /* Empty state when no file selected */
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            Upload a research paper
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mb-6">
            Upload any PDF and chat with it using AI. Summarize sections,
            explain equations, extract methodologies, and identify findings —
            all grounded in the actual paper content.
          </p>

          {/* Feature list */}
          <div className="grid grid-cols-2 gap-3 max-w-sm text-left">
            {[
              { label: "Summarize sections",    desc: "Get key points fast"         },
              { label: "Explain equations",     desc: "Plain-language breakdowns"   },
              { label: "Extract methodology",   desc: "Structured research steps"   },
              { label: "Identify findings",     desc: "Key results highlighted"     },
            ].map((f) => (
              <div
                key={f.label}
                className="rounded-lg border border-border bg-card p-3"
              >
                <p className="text-xs font-medium text-foreground">{f.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowUploader(true)}
            className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-foreground
              px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload a PDF
          </button>
        </div>
      )}
    </div>
  );
}

/* =============================================================================
   FileListItem sub-component
   ============================================================================= */

function FileListItem({
  upload,
  isSelected,
  onSelect,
  onDelete,
}: {
  upload:     PDFUpload;
  isSelected: boolean;
  onSelect:   () => void;
  onDelete:   () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "group flex items-start gap-2.5 p-2.5 rounded-lg cursor-pointer transition-colors",
        isSelected
          ? "bg-primary/10 border border-primary/30"
          : "hover:bg-accent border border-transparent"
      )}
    >
      {/* Icon */}
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
        isSelected ? "bg-primary/20" : "bg-muted"
      )}>
        <FileText className={cn(
          "w-4 h-4",
          isSelected ? "text-primary" : "text-muted-foreground"
        )} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-xs font-medium truncate",
          isSelected ? "text-primary" : "text-foreground"
        )}>
          {upload.fileName}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs text-muted-foreground">
            {formatBytes(upload.fileSize)}
          </span>
          {upload.pageCount && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <span className="text-xs text-muted-foreground">
                {upload.pageCount}p
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {timeAgo(upload.uploadedAt)}
        </div>
      </div>

      {/* Status + delete */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className={cn(
          "text-xs px-1.5 py-0.5 rounded-full",
          upload.status === "ready"
            ? "bg-emerald-500/10 text-emerald-500"
            : upload.status === "processing"
            ? "bg-amber-500/10 text-amber-500"
            : "bg-muted text-muted-foreground"
        )}>
          {upload.status}
        </span>

        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity
            w-5 h-5 rounded flex items-center justify-center
            text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Delete upload"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}