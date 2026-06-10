import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
  // ---------------------------------------------------------------------------
  // Content paths — scan all component and page files
  // ---------------------------------------------------------------------------
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],

  // ---------------------------------------------------------------------------
  // Dark mode — class strategy (toggled via <html class="dark">)
  // ---------------------------------------------------------------------------
  darkMode: ["class"],

  theme: {
    extend: {
      // -----------------------------------------------------------------------
      // Colors — ResearchOS design system
      // Dark-first academic workspace
      // -----------------------------------------------------------------------
      colors: {
        // Brand
        brand: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",   // primary brand
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
          950: "#1e1b4b",
        },

        // Surfaces (used for workspace panels)
        surface: {
          DEFAULT: "#0f1117",   // main bg (dark)
          50:  "#f8f9fc",       // light mode bg
          100: "#f1f3f9",
          200: "#e2e6f0",
          700: "#1a1d27",       // dark sidebar
          800: "#13151f",       // dark panel
          900: "#0c0e16",       // dark deepest
          950: "#080a11",
        },

        // Accent — for AI responses, highlights, CTAs
        accent: {
          DEFAULT: "#7c3aed",
          light: "#a78bfa",
          dark:  "#5b21b6",
        },

        // Research-specific semantic colors
        research: {
          gap:     "#f59e0b",   // research gap callouts (amber)
          cite:    "#10b981",   // citation markers (emerald)
          verify:  "#3b82f6",   // verified source badges (blue)
          warning: "#ef4444",   // hallucination warnings (red)
        },

        // shadcn/ui compatible semantic tokens
        background:    "hsl(var(--background))",
        foreground:    "hsl(var(--foreground))",
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border:  "hsl(var(--border))",
        input:   "hsl(var(--input))",
        ring:    "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT:            "hsl(var(--sidebar-background))",
          foreground:         "hsl(var(--sidebar-foreground))",
          primary:            "hsl(var(--sidebar-primary))",
          "primary-foreground":"hsl(var(--sidebar-primary-foreground))",
          accent:             "hsl(var(--sidebar-accent))",
          "accent-foreground":"hsl(var(--sidebar-accent-foreground))",
          border:             "hsl(var(--sidebar-border))",
          ring:               "hsl(var(--sidebar-ring))",
        },
      },

      // -----------------------------------------------------------------------
      // Typography
      // -----------------------------------------------------------------------
      fontFamily: {
        sans:  ["var(--font-inter)", ...fontFamily.sans],
        mono:  ["var(--font-mono)",  ...fontFamily.mono],
        serif: ["var(--font-serif)", ...fontFamily.serif],
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },

      // -----------------------------------------------------------------------
      // Border radius — matches shadcn/ui CSS vars
      // -----------------------------------------------------------------------
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      // -----------------------------------------------------------------------
      // Spacing extras
      // -----------------------------------------------------------------------
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "sidebar": "16rem",     // left sidebar width
        "panel":   "20rem",     // right AI panel width
      },

      // -----------------------------------------------------------------------
      // Animations — workspace + AI streaming effects
      // -----------------------------------------------------------------------
      keyframes: {
        // shadcn/ui standard
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        // AI streaming cursor blink
        "cursor-blink": {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0" },
        },
        // Subtle pulse for AI thinking state
        "ai-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%":       { opacity: "1" },
        },
        // Slide in from left (sidebar items)
        "slide-in-left": {
          from: { transform: "translateX(-8px)", opacity: "0" },
          to:   { transform: "translateX(0)",    opacity: "1" },
        },
        // Fade up (paper cards, search results)
        "fade-up": {
          from: { transform: "translateY(8px)", opacity: "0" },
          to:   { transform: "translateY(0)",   opacity: "1" },
        },
        // Shimmer for skeleton loaders
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition:  "200% 0" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "cursor-blink":   "cursor-blink 1s ease-in-out infinite",
        "ai-pulse":       "ai-pulse 1.5s ease-in-out infinite",
        "slide-in-left":  "slide-in-left 0.2s ease-out",
        "fade-up":        "fade-up 0.3s ease-out",
        shimmer:          "shimmer 2s linear infinite",
      },

      // -----------------------------------------------------------------------
      // Box shadows — for panels and cards
      // -----------------------------------------------------------------------
      boxShadow: {
        "panel":  "0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.4)",
        "card":   "0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)",
        "glow":   "0 0 20px rgba(99,102,241,0.3)",
      },

      // -----------------------------------------------------------------------
      // Background gradients for AI / hero sections
      // -----------------------------------------------------------------------
      backgroundImage: {
        "gradient-radial":  "radial-gradient(var(--tw-gradient-stops))",
        "shimmer-gradient": "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
      },

      // -----------------------------------------------------------------------
      // Z-index scale
      // -----------------------------------------------------------------------
      zIndex: {
        "sidebar":  "40",
        "topbar":   "50",
        "modal":    "60",
        "toast":    "70",
        "tooltip":  "80",
      },
    },
  },

  // ---------------------------------------------------------------------------
  // Plugins
  // ---------------------------------------------------------------------------
  plugins: [
    require("tailwindcss-animate"),
  ],
};

export default config;