"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { TIER_LIMITS } from "@/lib/constants";
import { useSubscriptionTier } from "@/store/authStore";
import type { PDFUpload } from "@/types/project";

/* =============================================================================
   PDFUploader — drag-and-drop + file picker upload component
   ============================================================================= */

interface PDFUploaderProps {
  onUploadComplete: (upload: PDFUpload) => void;
  projectId?:       string;
  className?:       string;
}

type UploadState = "idle" | "uploading" | "processing" | "done" | "error";

interface FileEntry {
  file:     File;
  state:    UploadState;
  progress: number;
  error?:   string;
  upload?:  PDFUpload;
}

export default function PDFUploader({
  onUploadComplete,
  projectId,
  className,
}: PDFUploaderProps) {
  const tier         = useSubscriptionTier();
  const inputRef     = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [files,      setFiles]      = useState<FileEntry[]>([]);

  const maxSizeMb = TIER_LIMITS[tier].pdfSizeMb;

  /* ------------------------------------------------------------------ */
  /* Drag handlers                                                        */
  /* ------------------------------------------------------------------ */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files).filter(
      (f) => f.type === "application/pdf"
    );
    if (dropped.length) processFiles(dropped);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------------------------------------------------ */
  /* File input change                                                    */
  /* ------------------------------------------------------------------ */
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length) processFiles(selected);
    e.target.value = "";
  }

  /* ------------------------------------------------------------------ */
  /* Process + upload files                                               */
  /* ------------------------------------------------------------------ */
  function processFiles(incoming: File[]) {
    const newEntries: FileEntry[] = incoming.map((file) => {
      const sizeMb = file.size / (1024 * 1024);
      if (sizeMb > maxSizeMb) {
        return {
          file,
          state:    "error" as UploadState,
          progress: 0,
          error:    `File exceeds ${maxSizeMb} MB limit for your plan.`,
        };
      }
      return { file, state: "idle" as UploadState, progress: 0 };
    });

    setFiles((prev) => [...prev, ...newEntries]);

    // Start uploading valid files
    newEntries.forEach((entry) => {
      if (entry.state !== "error") uploadFile(entry.file);
    });
  }

  async function uploadFile(file: File) {
    // Set uploading state
    updateFile(file.name, { state: "uploading", progress: 0 });

    try {
      // Simulate chunked upload progress
      for (let p = 10; p <= 80; p += 10) {
        await new Promise((r) => setTimeout(r, 80));
        updateFile(file.name, { progress: p });
      }

      // In real implementation: POST to /api/pdf/upload
      // const formData = new FormData();
      // formData.append("file", file);
      // if (projectId) formData.append("project_id", projectId);
      // const res = await fetch(`${API_URL}/pdf/upload`, { method: "POST", body: formData });
      // const data = await res.json();

      updateFile(file.name, { state: "processing", progress: 85 });
      await new Promise((r) => setTimeout(r, 1200)); // simulate processing

      updateFile(file.name, { state: "done", progress: 100 });

      // Mock upload result
      const mockUpload: PDFUpload = {
        id:          crypto.randomUUID(),
        userId:      "user_1",
        projectId:   projectId ?? null,
        fileName:    file.name,
        fileSize:    file.size,
        pageCount:   null,
        s3Key:       `uploads/${file.name}`,
        status:      "ready",
        uploadedAt:  new Date().toISOString(),
        processedAt: new Date().toISOString(),
      };

      onUploadComplete(mockUpload);
    } catch {
      updateFile(file.name, {
        state: "error",
        error: "Upload failed. Please try again.",
      });
    }
  }

  function updateFile(name: string, patch: Partial<FileEntry>) {
    setFiles((prev) =>
      prev.map((f) => f.file.name === name ? { ...f, ...patch } : f)
    );
  }

  function removeFile(name: string) {
    setFiles((prev) => prev.filter((f) => f.file.name !== name));
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <div className={cn("space-y-4", className)}>

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3",
          "rounded-xl border-2 border-dashed p-10 cursor-pointer transition-all",
          isDragging
            ? "border-primary bg-primary/10 scale-[1.01]"
            : "border-border bg-muted/20 hover:border-primary/40 hover:bg-muted/30"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
          isDragging ? "bg-primary/20" : "bg-muted"
        )}>
          <Upload className={cn("w-5 h-5", isDragging ? "text-primary" : "text-muted-foreground")} />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            {isDragging ? "Drop PDF here" : "Upload PDF papers"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Drag & drop or click to browse · PDF only · Max {maxSizeMb} MB
          </p>
        </div>

        {tier === "free" && (
          <p className="text-xs text-amber-500 border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 rounded-lg">
            Free plan: 3 uploads total. Upgrade for unlimited.
          </p>
        )}
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((entry) => (
            <FileRow
              key={entry.file.name}
              entry={entry}
              onRemove={() => removeFile(entry.file.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- File row sub-component ---- */
function FileRow({
  entry,
  onRemove,
}: {
  entry:    FileEntry;
  onRemove: () => void;
}) {
  const { file, state, progress, error } = entry;

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <FileText className="w-4 h-4 text-primary" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
        <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>

        {/* Progress bar */}
        {(state === "uploading" || state === "processing") && (
          <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Status text */}
        <p className={cn("text-xs mt-0.5", {
          "text-muted-foreground": state === "uploading",
          "text-amber-500":        state === "processing",
          "text-emerald-500":      state === "done",
          "text-destructive":      state === "error",
        })}>
          {state === "uploading"  && `Uploading… ${progress}%`}
          {state === "processing" && "Processing with AI…"}
          {state === "done"       && "Ready — click to chat"}
          {state === "error"      && (error ?? "Upload failed")}
        </p>
      </div>

      {/* Status icon */}
      <div className="shrink-0">
        {state === "uploading" || state === "processing"
          ? <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
          : state === "done"
          ? <CheckCircle className="w-4 h-4 text-emerald-500" />
          : state === "error"
          ? <AlertCircle className="w-4 h-4 text-destructive" />
          : (
            <button
              onClick={onRemove}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )
        }
      </div>
    </div>
  );
}