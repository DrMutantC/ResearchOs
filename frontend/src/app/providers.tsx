"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

/* =============================================================================
   ResearchOS — Client Providers
   All client-side providers live here so the root layout stays a Server
   Component. Add new providers inside the return without touching layout.tsx.
   ============================================================================= */

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 60 seconds
            staleTime:            60 * 1000,
            // Keep unused data in cache for 5 minutes
            gcTime:               5 * 60 * 1000,
            // Retry failed requests twice with exponential backoff
            retry:                2,
            retryDelay:           (attempt) => Math.min(1000 * 2 ** attempt, 10000),
            // Don't refetch when window regains focus (avoids noisy AI re-fetches)
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
}