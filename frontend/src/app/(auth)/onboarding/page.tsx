"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, BookOpen, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import {
  APP_NAME,
  ROUTES,
  ACADEMIC_FIELDS,
  TIERS,
  TIER_PRICES,
  type Tier,
  type AcademicField,
} from "@/lib/constants";

/* =============================================================================
   ResearchOS — Onboarding Page (3 steps)
   Step 1 → Academic field
   Step 2 → Research interests (free text tags)
   Step 3 → Choose subscription plan
   ============================================================================= */

const STEPS = [
  { id: 1, label: "Your field" },
  { id: 2, label: "Your interests" },
  { id: 3, label: "Choose plan" },
];

const INTEREST_SUGGESTIONS = [
  "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
  "Bioinformatics", "Genomics", "Climate Change", "Renewable Energy",
  "Drug Discovery", "Neuroscience", "Robotics", "Quantum Computing",
  "Material Science", "Epidemiology", "Social Networks", "Economics",
  "Blockchain", "Cybersecurity", "Data Science", "Ethics in AI",
];

const PLAN_FEATURES: Record<Tier, string[]> = {
  free: [
    "5 paper searches / day",
    "3 PDF uploads",
    "Basic AI responses",
    "Citation generator",
  ],
  pro: [
    "Unlimited searches",
    "Advanced reasoning models",
    "Literature review generator",
    "Citation intelligence",
    "Plagiarism detection",
    "50 MB PDF context",
  ],
  max: [
    "Everything in Pro",
    "Team collaboration",
    "Shared workspaces",
    "Research monitoring",
    "Priority AI queues",
    "2M tokens / day",
  ],
};

export default function OnboardingPage() {
  const router              = useRouter();
  const completeOnboarding  = useAuthStore((s) => s.completeOnboarding);
  // const user                = useAuthStore((s) => s.user);

  const [step, setStep]               = useState(1);
  const [field, setField]             = useState<AcademicField | null>(null);
  const [interests, setInterests]     = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState("");
  const [selectedTier, setSelectedTier]   = useState<Tier>(TIERS.FREE);
  const [isSubmitting, setIsSubmitting]   = useState(false);

  /* ------------------------------------------------------------------ */
  /* Interest tag helpers                                                 */
  /* ------------------------------------------------------------------ */
  function addInterest(tag: string) {
    const clean = tag.trim();
    if (!clean || interests.includes(clean) || interests.length >= 10) return;
    setInterests((prev) => [...prev, clean]);
    setInterestInput("");
  }

  function removeInterest(tag: string) {
    setInterests((prev) => prev.filter((t) => t !== tag));
  }

  function handleInterestKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addInterest(interestInput);
    }
    if (e.key === "Backspace" && interestInput === "" && interests.length > 0) {
      setInterests((prev) => prev.slice(0, -1));
    }
  }

  /* ------------------------------------------------------------------ */
  /* Navigation                                                           */
  /* ------------------------------------------------------------------ */
  function next() {
    if (step === 1 && !field) {
      toast.error("Please select your academic field.");
      return;
    }
    if (step === 2 && interests.length === 0) {
      toast.error("Add at least one research interest.");
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1));
  }

  /* ------------------------------------------------------------------ */
  /* Final submit                                                         */
  /* ------------------------------------------------------------------ */
  async function finish() {
    if (!field) return;
    setIsSubmitting(true);
    try {
      await completeOnboarding({
        academicField:     field,
        researchInterests: interests,
        selectedTier,
      });
      toast.success("Workspace ready! Welcome to ResearchOS.");
      router.push(ROUTES.DASHBOARD);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Top bar */}
      <div className="border-b border-border px-6 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <BookOpen className="w-4 h-4 text-primary" />
          {APP_NAME}
        </div>
        <span className="text-xs text-muted-foreground">
          Step {step} of {STEPS.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-500"
          style={{ width: `${(step / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-6 mb-10">
            {STEPS.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 transition-colors
                  ${s.id < step
                    ? "bg-primary text-primary-foreground"
                    : s.id === step
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {s.id < step ? <Check className="w-3.5 h-3.5" /> : s.id}
                </div>
                <span className={`text-xs hidden sm:block ${s.id === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
                {s.id < STEPS.length && (
                  <div className={`h-px w-8 hidden sm:block ${s.id < step ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          {/* -------------------------------------------------------- */}
          {/* Step 1 — Academic field                                  */}
          {/* -------------------------------------------------------- */}
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold mb-1 text-center">What&apos;s your field?</h1>
              <p className="text-sm text-muted-foreground text-center mb-8">
                We&apos;ll tailor paper suggestions and AI responses to your area.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ACADEMIC_FIELDS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setField(f)}
                    className={`text-left px-4 py-3 rounded-lg border text-sm transition-all
                      ${field === f
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                  >
                    {field === f && <Check className="w-3 h-3 inline mr-1.5 mb-0.5" />}
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* Step 2 — Research interests                              */}
          {/* -------------------------------------------------------- */}
          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold mb-1 text-center">Your research interests</h1>
              <p className="text-sm text-muted-foreground text-center mb-8">
                Add topics you study — press Enter or comma to add. Max 10.
              </p>

              {/* Tag input */}
              <div className={`min-h-[3rem] flex flex-wrap gap-2 p-3 rounded-lg border bg-background
                focus-within:ring-2 focus-within:ring-ring transition-all
                ${interests.length === 0 ? "border-input" : "border-primary/40"}`}
              >
                {interests.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeInterest(tag)}
                      className="hover:text-destructive transition-colors ml-0.5"
                      aria-label={`Remove ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={handleInterestKeyDown}
                  onBlur={() => interestInput && addInterest(interestInput)}
                  placeholder={interests.length === 0 ? "e.g. Machine Learning, Genomics…" : ""}
                  className="flex-1 min-w-[160px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  disabled={interests.length >= 10}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                {interests.length}/10 interests added
              </p>

              {/* Suggestions */}
              <div className="mt-6">
                <p className="text-xs text-muted-foreground mb-2">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_SUGGESTIONS.filter((s) => !interests.includes(s)).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addInterest(s)}
                      disabled={interests.length >= 10}
                      className="text-xs px-3 py-1.5 rounded-full border border-border
                        text-muted-foreground hover:border-primary/40 hover:text-primary
                        transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* Step 3 — Choose plan                                     */}
          {/* -------------------------------------------------------- */}
          {step === 3 && (
            <div>
              <h1 className="text-2xl font-bold mb-1 text-center">Choose your plan</h1>
              <p className="text-sm text-muted-foreground text-center mb-8">
                Start free. Upgrade anytime. Bangladesh &amp; international payments supported.
              </p>

              <div className="grid sm:grid-cols-3 gap-4">
                {(Object.keys(TIERS) as Array<keyof typeof TIERS>).map((key) => {
                  const tier  = TIERS[key];
                  const price = TIER_PRICES[tier];
                  const isSelected = selectedTier === tier;
                  const isFeatured = tier === TIERS.PRO;

                  return (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setSelectedTier(tier)}
                      className={`relative text-left rounded-xl border p-5 transition-all
                        ${isSelected
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border bg-card hover:border-primary/40"
                        }`}
                    >
                      {isFeatured && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full font-medium">
                          Popular
                        </div>
                      )}

                      {/* Selected checkmark */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}

                      <div className="font-semibold text-sm mb-1 capitalize">{tier}</div>
                      <div className="text-2xl font-bold mb-3">
                        {price === 0 ? "Free" : `$${price}`}
                        {price > 0 && (
                          <span className="text-xs font-normal text-muted-foreground">/mo</span>
                        )}
                      </div>
                      <ul className="space-y-1.5">
                        {PLAN_FEATURES[tier].map((f) => (
                          <li key={f} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                            <Check className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>

              {selectedTier !== TIERS.FREE && (
                <p className="text-xs text-muted-foreground text-center mt-4">
                  You can complete payment after your workspace is set up.
                </p>
              )}
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* Navigation buttons                                        */}
          {/* -------------------------------------------------------- */}
          <div className="flex items-center justify-between mt-10">
            <button
              type="button"
              onClick={back}
              disabled={step === 1}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground
                hover:text-foreground transition-colors disabled:opacity-0 disabled:pointer-events-none"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground
                  px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={finish}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground
                  px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Setting up…" : "Launch workspace"}
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            )}
          </div>

          {/* Skip for now */}
          {step === 3 && (
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => {
                  setSelectedTier(TIERS.FREE);
                  finish();
                }}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Skip — start with free plan
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}