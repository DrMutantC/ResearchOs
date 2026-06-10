"use client";

import { useState, useCallback } from "react";
import {
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
  RotateCw, Download, Loader2, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* =============================================================================
   PDFViewer — renders a PDF with page controls, zoom, rotate
   Uses native browser PDF rendering via <embed> for reliability.
   Full react-pdf integration can be added when pdfjs-dist is configured.
   ============================================================================= */

interface PDFViewerProps {
  url:        string;
  fileName?:  string;
  className?: string;
  onPageChange?: (page: number) => void;
}

export default function PDFViewer({
  url,
  fileName   = "document.pdf",
  className,
  onPageChange,
}: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,]  = useState<number | null>(null);
  const [zoom,        setZoom]        = useState(100);
  const [rotation,    setRotation]    = useState(0);
  const [isLoading,   setIsLoading]   = useState(true);
  const [hasError,    setHasError]    = useState(false);

  /* ------------------------------------------------------------------ */
  /* Controls                                                             */
  /* ------------------------------------------------------------------ */
  function goToPage(p: number) {
    if (!totalPages) return;
    const clamped = Math.max(1, Math.min(p, totalPages));
    setCurrentPage(clamped);
    onPageChange?.(clamped);
  }

  function zoomIn()  { setZoom((z) => Math.min(z + 25, 200)); }
  function zoomOut() { setZoom((z) => Math.max(z - 25, 50));  }
  function rotate()  { setRotation((r) => (r + 90) % 360);    }

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  /* ------------------------------------------------------------------ */
  /* Render                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <div className={cn("pdf-viewer", className)}>

      {/* Toolbar */}
      <div className="pdf-viewer-toolbar">
        {/* File name */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-xs text-foreground font-medium truncate">{fileName}</span>
        </div>

        {/* Page controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground
              hover:text-foreground hover:bg-accent transition-colors disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 text-xs text-foreground">
            <input
              type="number"
              value={currentPage}
              onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
              className="w-10 h-6 text-center bg-background border border-input rounded text-xs
                focus:outline-none focus:ring-1 focus:ring-ring"
              min={1}
              max={totalPages ?? 1}
            />
            {totalPages && (
              <span className="text-muted-foreground">/ {totalPages}</span>
            )}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={!!totalPages && currentPage >= totalPages}
            className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground
              hover:text-foreground hover:bg-accent transition-colors disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            disabled={zoom <= 50}
            className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground
              hover:text-foreground hover:bg-accent transition-colors disabled:opacity-40"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs text-muted-foreground w-10 text-center">{zoom}%</span>
          <button
            onClick={zoomIn}
            disabled={zoom >= 200}
            className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground
              hover:text-foreground hover:bg-accent transition-colors disabled:opacity-40"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Rotate */}
        <button
          onClick={rotate}
          className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground
            hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Rotate"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        {/* Download */}
        <a
          href={url}
          download={fileName}
          className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground
            hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Download PDF"
        >
          <Download className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* PDF canvas */}
      <div className="pdf-viewer-canvas relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <p className="text-xs text-muted-foreground">Loading PDF…</p>
            </div>
          </div>
        )}

        {hasError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium text-foreground mb-1">Could not load PDF</p>
            <p className="text-xs text-muted-foreground mb-4">
              The file may be corrupted or unavailable.
            </p>
            <a
              href={url}
              download={fileName}
              className="text-xs text-primary hover:underline"
            >
              Try downloading instead
            </a>
          </div>
        ) : (
          <div
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: "top center",
              transition: "transform 0.2s ease",
              width: "100%",
            }}
          >
            <embed
              src={`${url}#page=${currentPage}`}
              type="application/pdf"
              width="100%"
              style={{ minHeight: "80vh", borderRadius: "8px" }}
              onLoad={handleLoad}
              onError={handleError}
            />
          </div>
        )}
      </div>
    </div>
  );
}