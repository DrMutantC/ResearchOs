import type { NextConfig } from "next";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

const nextConfig: NextConfig = {
  // ---------------------------------------------------------------------------
  // React
  // ---------------------------------------------------------------------------
  reactStrictMode: true,

  // ---------------------------------------------------------------------------
  // Images — allow academic paper sources + avatars
  // ---------------------------------------------------------------------------
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.semanticscholar.org",
      },
      {
        protocol: "https",
        hostname: "**.arxiv.org",
      },
      {
        protocol: "https",
        hostname: "**.openalex.org",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google OAuth avatars
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: `${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
      },
    ],
  },

  // ---------------------------------------------------------------------------
  // API rewrites — proxy frontend requests to FastAPI backend
  // Avoids CORS issues in development
  // ---------------------------------------------------------------------------
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${apiBaseUrl}/:path*`,
      },
    ];
  },

  // ---------------------------------------------------------------------------
  // Security headers
  // ---------------------------------------------------------------------------
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },

  // ---------------------------------------------------------------------------
  // Webpack — handle PDF.js worker
  // ---------------------------------------------------------------------------
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    // Required for pdfjs-dist web worker
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?mjs/,
      type: "asset/resource",
      generator: {
        filename: "static/worker/[hash][ext][query]",
      },
    });

    return config;
  },

  // ---------------------------------------------------------------------------
  // Experimental
  // ---------------------------------------------------------------------------
  serverExternalPackages: ["pdfjs-dist"],

  // ---------------------------------------------------------------------------
  // Environment variables exposed to the browser
  // ---------------------------------------------------------------------------
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "ResearchOS",
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    NEXT_PUBLIC_API_URL: apiBaseUrl,
  },
};

export default nextConfig;