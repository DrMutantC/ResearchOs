import Link from "next/link";
import { ArrowRight, Search, FileText, BookOpen, Zap, Shield, Globe } from "lucide-react";
import { APP_NAME, ROUTES } from "@/lib/constants";

/* =============================================================================
   ResearchOS — Landing Page (Server Component)
   ============================================================================= */

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">

      {/* ------------------------------------------------------------------ */}
      {/* Navbar                                                              */}
      {/* ------------------------------------------------------------------ */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <span className="font-semibold text-lg tracking-tight">{APP_NAME}</span>
          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.LOGIN}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              href={ROUTES.REGISTER}
              className="text-sm bg-primary text-primary-foreground px-4 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ------------------------------------------------------------------ */}
      {/* Hero                                                                */}
      {/* ------------------------------------------------------------------ */}
      <section className="pt-32 pb-20 px-4">
        <div className="mx-auto max-w-4xl text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary mb-6">
            <Zap className="w-3 h-3" />
            AI-powered research intelligence
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
            The AI Operating System{" "}
            <span className="gradient-text">for Scientific Research</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover papers, synthesize literature, detect research gaps, and
            generate citations — all in one intelligent workspace built for
            serious researchers.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={ROUTES.REGISTER}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={ROUTES.LOGIN}
              className="inline-flex items-center gap-2 border border-border bg-card text-foreground px-6 py-3 rounded-lg font-medium hover:bg-accent transition-colors text-sm"
            >
              Sign in
            </Link>
          </div>

          {/* Social proof */}
          <p className="text-xs text-muted-foreground mt-6">
            No credit card required · Free plan available · Bangladesh &amp; international payments
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Problem → Solution strip                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { stat: "10M+", label: "Papers indexed" },
              { stat: "3",    label: "Academic APIs" },
              { stat: "5",    label: "Citation formats" },
              { stat: "6",    label: "AI agents working for you" },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-2xl font-bold text-primary">{item.stat}</div>
                <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Features                                                            */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Everything researchers need</h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Built around how research actually works — not how chatbots work.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <f.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* AI difference section                                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 px-4 bg-muted/20 border-y border-border">
        <div className="mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                AI that understands research,{" "}
                <span className="gradient-text">not just text</span>
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Every AI response is grounded in real sources. No hallucinations.
                No made-up citations. Every claim links back to a verified paper.
              </p>
              <ul className="space-y-3">
                {AI_POINTS.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm">
                    <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                    <span className="text-muted-foreground">{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mock AI message */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground border-b border-border pb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                AI Research Assistant
              </div>
              <p className="text-sm leading-relaxed">
                Based on <span className="inline-flex items-center gap-0.5 text-xs font-medium bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded">[1] Zhang et al. 2023</span> and{" "}
                <span className="inline-flex items-center gap-0.5 text-xs font-medium bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded">[2] Liu et al. 2024</span>,
                current textile recycling systems achieve 67% efficiency under
                homogeneous fabric conditions.
              </p>
              <div className="flex items-start gap-2 text-xs rounded-lg border border-amber-500/30 bg-amber-500/5 p-2.5">
                <span className="text-amber-500 shrink-0">⚠</span>
                <span className="text-muted-foreground">
                  <strong className="text-amber-500">Research gap detected:</strong>{" "}
                  No studies address mixed-fabric conditions above 40% polyester content.
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-500">
                <Shield className="w-3 h-3" />
                Verified · 2 sources · Confidence 94%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Pricing                                                             */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Simple pricing</h2>
            <p className="text-muted-foreground text-sm">
              Supports Stripe, bKash, Nagad, Rocket, and local cards.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-6 flex flex-col ${
                  plan.featured
                    ? "border-primary bg-primary/5 relative"
                    : "border-border bg-card"
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full font-medium">
                    Most popular
                  </div>
                )}
                <div className="font-semibold text-sm mb-1">{plan.name}</div>
                <div className="text-3xl font-bold mb-1">
                  {plan.price === 0 ? "Free" : `$${plan.price}`}
                  {plan.price > 0 && (
                    <span className="text-sm font-normal text-muted-foreground">/mo</span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mb-5">{plan.goal}</div>
                <ul className="space-y-2 flex-1 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs">
                      <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={ROUTES.REGISTER}
                  className={`text-center text-sm py-2 rounded-lg font-medium transition-colors ${
                    plan.featured
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-border hover:bg-accent"
                  }`}
                >
                  {plan.price === 0 ? "Start free" : "Get started"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Footer                                                              */}
      {/* ------------------------------------------------------------------ */}
      <footer className="border-t border-border py-8 px-4">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold">{APP_NAME}</span>
          <p className="text-xs text-muted-foreground">
            The AI Operating System for Scientific Research
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Globe className="w-3 h-3" />
            Available worldwide
          </div>
        </div>
      </footer>

    </main>
  );
}

/* =============================================================================
   Static data
   ============================================================================= */

const FEATURES = [
  {
    icon: Search,
    title: "AI Paper Search",
    description:
      "Search OpenAlex, Semantic Scholar, and arXiv simultaneously with semantic reranking and relevance scoring.",
  },
  {
    icon: FileText,
    title: "PDF AI Chat",
    description:
      "Upload any paper and chat with it. Summarize sections, explain equations, extract methodologies.",
  },
  {
    icon: BookOpen,
    title: "Literature Review Generator",
    description:
      "Select papers, AI extracts themes, groups findings, and writes a structured review with citations.",
  },
  {
    icon: Zap,
    title: "Research Gap Detection",
    description:
      "AI identifies contradictions, missing experiments, and underexplored topics across your paper collection.",
  },
  {
    icon: Shield,
    title: "Citation Generator",
    description:
      "Auto-generate APA, MLA, IEEE, Harvard, and Chicago citations from DOI, title, or PDF metadata.",
  },
  {
    icon: Globe,
    title: "Research Suggestions",
    description:
      "AI recommends related methods, emerging datasets, and trending papers based on your research interests.",
  },
];

const AI_POINTS = [
  "Every claim is backed by a real, verifiable paper",
  "Confidence score shown for every AI response",
  "Research gaps highlighted automatically",
  "No hallucinated citations — ever",
  "Multi-agent verification before every response",
];

const PRICING = [
  {
    name:     "Free",
    price:    0,
    goal:     "Get started — no card needed",
    featured: false,
    features: [
      "5 paper searches / day",
      "3 PDF uploads",
      "Basic AI responses",
      "Citation generator",
      "Limited tokens",
    ],
  },
  {
    name:     "Pro",
    price:    20,
    goal:     "For active researchers",
    featured: true,
    features: [
      "Unlimited paper searches",
      "Advanced reasoning models",
      "Literature review generator",
      "Citation intelligence",
      "Plagiarism detection",
      "50 MB PDF context",
    ],
  },
  {
    name:     "Max",
    price:    80,
    goal:     "For labs & research groups",
    featured: false,
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Shared workspaces",
      "Research monitoring",
      "Priority AI queues",
      "2M tokens / day",
    ],
  },
];