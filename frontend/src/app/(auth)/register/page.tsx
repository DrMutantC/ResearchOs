"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, BookOpen, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { APP_NAME, ROUTES } from "@/lib/constants";

/* =============================================================================
   ResearchOS — Register Page
   ============================================================================= */

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path:    ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

/* Password strength rules shown live under the field */
const PW_RULES = [
  { label: "At least 8 characters",       test: (pw: string) => pw.length >= 8 },
  { label: "One uppercase letter",         test: (pw: string) => /[A-Z]/.test(pw) },
  { label: "One number",                   test: (pw: string) => /[0-9]/.test(pw) },
];

export default function RegisterPage() {
  const router              = useRouter();
  const register_           = useAuthStore((s) => s.register);
  const [showPw, setShowPw]  = useState(false);
  const [showCPw, setShowCPw] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const password = watch("password", "");

  /* ------------------------------------------------------------------ */
  /* Submit                                                               */
  /* ------------------------------------------------------------------ */
  async function onSubmit(data: RegisterForm) {
    try {
      await register_({
        name:     data.name,
        email:    data.email,
        password: data.password,
      });
      toast.success("Account created! Let's set up your workspace.");
      router.push(ROUTES.ONBOARDING);
    } catch {
      toast.error("Could not create account. This email may already be in use.");
    }
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <div className="min-h-screen bg-background flex">

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-muted/30 border-r border-border flex-col justify-between p-10">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <BookOpen className="w-5 h-5 text-primary" />
          {APP_NAME}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold leading-snug">
            Join thousands of researchers accelerating their work with AI.
          </h2>

          {/* Step preview */}
          <div className="space-y-3">
            {[
              { step: "1", label: "Create your account",          active: true  },
              { step: "2", label: "Choose your research field",   active: false },
              { step: "3", label: "Start your first project",     active: false },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0
                  ${s.active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {s.step}
                </div>
                <span className={`text-sm ${s.active ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}. Free plan available. No credit card required.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 overflow-y-auto">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 font-semibold text-lg mb-8 lg:hidden">
            <BookOpen className="w-5 h-5 text-primary" />
            {APP_NAME}
          </div>

          <h1 className="text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Free forever. Upgrade when you need more.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Full name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Dr. Jane Smith"
                {...register("name")}
                className={`w-full h-10 px-3 rounded-lg border bg-background text-sm
                  placeholder:text-muted-foreground
                  focus:outline-none focus:ring-2 focus:ring-ring transition-colors
                  ${errors.name ? "border-destructive" : "border-input"}`}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@university.edu"
                {...register("email")}
                className={`w-full h-10 px-3 rounded-lg border bg-background text-sm
                  placeholder:text-muted-foreground
                  focus:outline-none focus:ring-2 focus:ring-ring transition-colors
                  ${errors.email ? "border-destructive" : "border-input"}`}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full h-10 px-3 pr-10 rounded-lg border bg-background text-sm
                    placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-ring transition-colors
                    ${errors.password ? "border-destructive" : "border-input"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Live password strength rules */}
              {password.length > 0 && (
                <ul className="space-y-1 mt-2">
                  {PW_RULES.map((rule) => {
                    const passed = rule.test(password);
                    return (
                      <li key={rule.label} className="flex items-center gap-1.5 text-xs">
                        {passed ? (
                          <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                        ) : (
                          <X className="w-3 h-3 text-muted-foreground shrink-0" />
                        )}
                        <span className={passed ? "text-emerald-500" : "text-muted-foreground"}>
                          {rule.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm password */}
            <div className="space-y-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showCPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className={`w-full h-10 px-3 pr-10 rounded-lg border bg-background text-sm
                    placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-ring transition-colors
                    ${errors.confirmPassword ? "border-destructive" : "border-input"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowCPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showCPw ? "Hide password" : "Show password"}
                >
                  {showCPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms */}
            <p className="text-xs text-muted-foreground">
              By creating an account you agree to our{" "}
              <Link href="/terms" className="underline hover:text-foreground transition-colors">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-foreground transition-colors">
                Privacy Policy
              </Link>.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium
                hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Creating account…" : "Create free account"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-3 text-xs text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={() => toast.info("Google OAuth coming soon")}
            className="w-full h-10 border border-input bg-background rounded-lg text-sm font-medium
              hover:bg-accent transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Sign in link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              href={ROUTES.LOGIN}
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}