"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { APP_NAME, ROUTES } from "@/lib/constants";

/* =============================================================================
   ResearchOS — Login Page
   ============================================================================= */

const loginSchema = z.object({
  email:    z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router             = useRouter();
  const login              = useAuthStore((s) => s.login);
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  /* ------------------------------------------------------------------ */
  /* Submit                                                               */
  /* ------------------------------------------------------------------ */
  async function onSubmit(data: LoginForm) {
    try {
      await login(data);
      toast.success("Welcome back!");
      router.push(ROUTES.DASHBOARD);
    } catch {
      toast.error("Invalid email or password. Please try again.");
    }
  }

  /* ------------------------------------------------------------------ */
  /* Render                                                               */
  /* ------------------------------------------------------------------ */
  return (
    <div className="min-h-screen bg-background flex">

      {/* Left panel — branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-muted/30 border-r border-border flex-col justify-between p-10">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <BookOpen className="w-5 h-5 text-primary" />
          {APP_NAME}
        </div>

        <div>
          <blockquote className="text-2xl font-semibold leading-snug mb-4">
            &ldquo;The AI that understands research — not just text.&rdquo;
          </blockquote>
          <ul className="space-y-2">
            {[
              "Evidence-first AI responses",
              "Citations on every claim",
              "Research gap detection",
              "Literature review in minutes",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-emerald-500">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME}. Built for researchers worldwide.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 font-semibold text-lg mb-8 lg:hidden">
            <BookOpen className="w-5 h-5 text-primary" />
            {APP_NAME}
          </div>

          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-8">
            Sign in to your research workspace
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

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
                  focus:outline-none focus:ring-2 focus:ring-ring
                  transition-colors ${
                    errors.email
                      ? "border-destructive focus:ring-destructive/30"
                      : "border-input"
                  }`}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full h-10 px-3 pr-10 rounded-lg border bg-background text-sm
                    placeholder:text-muted-foreground
                    focus:outline-none focus:ring-2 focus:ring-ring
                    transition-colors ${
                      errors.password
                        ? "border-destructive focus:ring-destructive/30"
                        : "border-input"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium
                hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Signing in…" : "Sign in"}
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

          {/* OAuth buttons */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => toast.info("Google OAuth coming soon")}
              className="w-full h-10 border border-input bg-background rounded-lg text-sm font-medium
                hover:bg-accent transition-colors flex items-center justify-center gap-2"
            >
              {/* Google SVG icon */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTES.REGISTER}
              className="text-primary hover:underline font-medium"
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}