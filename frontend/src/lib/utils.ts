import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/* =============================================================================
   ResearchOS — Shared Utility Functions
   ============================================================================= */

/* -----------------------------------------------------------------------------
   cn() — Tailwind class merging
   ----------------------------------------------------------------------------- */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* -----------------------------------------------------------------------------
   String utilities
   ----------------------------------------------------------------------------- */

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/* -----------------------------------------------------------------------------
   Number utilities
   ----------------------------------------------------------------------------- */

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/* -----------------------------------------------------------------------------
   Date utilities
   ----------------------------------------------------------------------------- */

export function formatMonthYear(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function formatRelativeTime(date: Date | string): string {
  const d       = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);

  const intervals: [number, string][] = [
    [31_536_000, "year"],
    [2_592_000,  "month"],
    [86_400,     "day"],
    [3_600,      "hour"],
    [60,         "minute"],
  ];

  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? "s" : ""} ago`;
  }

  return "just now";
}

export function isValidPublicationYear(year: number): boolean {
  const currentYear = new Date().getFullYear();
  return year >= 1800 && year <= currentYear;
}

/* -----------------------------------------------------------------------------
   Array utilities
   ----------------------------------------------------------------------------- */

export function uniqueBy<T>(arr: T[], key: keyof T): T[] {
  const seen = new Set<T[keyof T]>();
  return arr.filter((item) => {
    const val = item[key];
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
}

export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce<Record<string, T[]>>((acc, item) => {
    const group = String(item[key]);
    if (!acc[group]) acc[group] = [];
    acc[group]!.push(item);
    return acc;
  }, {});
}

export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/* -----------------------------------------------------------------------------
   Research-specific utilities
   ----------------------------------------------------------------------------- */

export function formatAuthors(authors: string[], maxShow = 3): string {
  if (authors.length === 0) return "Unknown authors";
  if (authors.length <= maxShow) return authors.join(", ");
  return `${authors.slice(0, maxShow).join(", ")} et al.`;
}

export function extractYear(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const match = dateStr.match(/\b(1[89]\d{2}|20\d{2})\b/);
  return match ? parseInt(match[0]!, 10) : null;
}

export function doiToUrl(doi: string): string {
  const clean = doi.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "");
  return `https://doi.org/${clean}`;
}

export function relevanceLabel(score: number): "high" | "medium" | "low" {
  if (score >= 0.75) return "high";
  if (score >= 0.4)  return "medium";
  return "low";
}

/* -----------------------------------------------------------------------------
   Async utilities
   ----------------------------------------------------------------------------- */

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  times = 3,
  delayMs = 500
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < times; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < times - 1) await sleep(delayMs * 2 ** attempt);
    }
  }
  throw lastError;
}

/* -----------------------------------------------------------------------------
   URL utilities
   ----------------------------------------------------------------------------- */

export function buildQueryString(
  params: Record<string, string | number | boolean | null | undefined>
): string {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join("&");
  return qs ? `?${qs}` : "";
}

export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/* -----------------------------------------------------------------------------
   Storage utilities (with JSON + error handling)
   ----------------------------------------------------------------------------- */

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch {
      return null;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage quota exceeded or SSR — fail silently
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // fail silently
    }
  },
};
export function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function timeAgo(date: Date | string): string {
  return formatRelativeTime(date);
}

export function formatCount(count: number): string {
  return formatNumber(count);
}

export function localGet<T>(key: string, fallback?: T): T | null {
  if (typeof window === "undefined") return fallback ?? null;

  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : (fallback ?? null);
  } catch {
    return fallback ?? null;
  }
}

export function localSet(key: string, value: unknown): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error(`Failed to save ${key}`);
  }
}