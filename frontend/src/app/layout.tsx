import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Lora } from "next/font/google";
import { Toaster } from "sonner";
import { APP_NAME, APP_DESCRIPTION, APP_URL } from "@/lib/constants";
import Providers from "./providers";
import "./globals.css";

/* =============================================================================
   ResearchOS — Root Layout
   Wraps every page with:
     - Google Fonts (Inter + JetBrains Mono + Lora)
     - TanStack Query provider
     - Theme provider (dark mode)
     - Sonner toast notifications
     - SEO metadata
   ============================================================================= */

/* -----------------------------------------------------------------------------
   Fonts
   ----------------------------------------------------------------------------- */
const inter = Inter({
  subsets:  ["latin"],
  variable: "--font-inter",
  display:  "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets:  ["latin"],
  variable: "--font-mono",
  display:  "swap",
});

const lora = Lora({
  subsets:  ["latin"],
  variable: "--font-serif",
  display:  "swap",
});

/* -----------------------------------------------------------------------------
   Metadata
   ----------------------------------------------------------------------------- */
export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default:  APP_NAME,
    template: `%s — ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "AI research",
    "literature review",
    "academic search",
    "paper summarizer",
    "citation generator",
    "research gap detection",
    "PDF AI chat",
    "scientific research tool",
  ],
  authors:  [{ name: APP_NAME }],
  creator:  APP_NAME,
  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         APP_URL,
    title:       APP_NAME,
    description: APP_DESCRIPTION,
    siteName:    APP_NAME,
  },
  twitter: {
    card:        "summary_large_image",
    title:       APP_NAME,
    description: APP_DESCRIPTION,
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#0f1117" },
  ],
  width:        "device-width",
  initialScale: 1,
};

/* -----------------------------------------------------------------------------
   Root layout
   ----------------------------------------------------------------------------- */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${lora.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-[family-name:var(--font-inter)] antialiased">
        <Providers>
          {children}

          {/* Global toast notifications */}
          <Toaster
            position="bottom-right"
            expand={false}
            richColors
            closeButton
            toastOptions={{
              classNames: {
                toast:       "bg-card border border-border text-foreground",
                description: "text-muted-foreground",
                actionButton:"bg-primary text-primary-foreground",
                cancelButton:"bg-muted text-muted-foreground",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}