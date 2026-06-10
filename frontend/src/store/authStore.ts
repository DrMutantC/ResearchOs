/* =============================================================================
   ResearchOS — Auth Store (Zustand)
   Manages authentication state, tokens, and user profile globally.
   ============================================================================= */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, LoginRequest, RegisterRequest, OnboardingData } from "@/types/user";
import type { Tier } from "@/lib/constants";
import { API, STORAGE_KEYS } from "@/lib/constants";
import { API_URL } from "@/lib/constants";

/* -----------------------------------------------------------------------------
   State shape
   ----------------------------------------------------------------------------- */
interface AuthState {
  // Data
  user:         User | null;
  accessToken:  string | null;
  refreshToken: string | null;

  // UI flags
  isLoading:    boolean;
  isHydrated:   boolean;
  isOnboarded:  boolean;
  error:        string | null;

  // Actions
  login:            (data: LoginRequest)       => Promise<void>;
  register:         (data: RegisterRequest)    => Promise<void>;
  logout:           ()                         => Promise<void>;
  refreshAuth:      ()                         => Promise<boolean>;
  completeOnboarding:(data: OnboardingData)    => Promise<void>;
  updateUser:       (updates: Partial<User>)   => void;
  clearError:       ()                         => void;
  setHydrated:      ()                         => void;

  // Derived helpers (not persisted)
  isAuthenticated:  () => boolean;
  tier:             () => Tier;
  hasProAccess:     () => boolean;
}

/* -----------------------------------------------------------------------------
   Store
   ----------------------------------------------------------------------------- */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // -----------------------------------------------------------------------
      // Initial state
      // -----------------------------------------------------------------------
      user:         null,
      accessToken:  null,
      refreshToken: null,
      isLoading:    false,
      isHydrated:   false,
      isOnboarded:  false,
      error:        null,

      // -----------------------------------------------------------------------
      // Login
      // -----------------------------------------------------------------------
      login: async (data: LoginRequest) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(`${API_URL}${API.AUTH.LOGIN}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(data),
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail ?? "Login failed. Please check your credentials.");
          }

          const json = await res.json();
          set({
            user:         json.user,
            accessToken:  json.access_token,
            refreshToken: json.refresh_token,
            isLoading:    false,
            error:        null,
          });
        } catch (err) {
          set({
            isLoading: false,
            error:     err instanceof Error ? err.message : "Login failed.",
          });
          throw err;
        }
      },

      // -----------------------------------------------------------------------
      // Register
      // -----------------------------------------------------------------------
      register: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(`${API_URL}${API.AUTH.REGISTER}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(data),
          });

          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.detail ?? "Registration failed. Please try again.");
          }

          const json = await res.json();
          set({
            user:         json.user,
            accessToken:  json.access_token,
            refreshToken: json.refresh_token,
            isLoading:    false,
            error:        null,
          });
        } catch (err) {
          set({
            isLoading: false,
            error:     err instanceof Error ? err.message : "Registration failed.",
          });
          throw err;
        }
      },

      // -----------------------------------------------------------------------
      // Logout
      // -----------------------------------------------------------------------
      logout: async () => {
        const { accessToken } = get();
        try {
          if (accessToken) {
            await fetch(`${API_URL}${API.AUTH.LOGOUT}`, {
              method:  "POST",
              headers: { Authorization: `Bearer ${accessToken}` },
            });
          }
        } finally {
          set({
            user:         null,
            accessToken:  null,
            refreshToken: null,
            isOnboarded:  false,
            error:        null,
          });
        }
      },

      // -----------------------------------------------------------------------
      // Refresh access token using refresh token
      // Returns true if successful, false if refresh token is expired
      // -----------------------------------------------------------------------
      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) return false;

        try {
          const res = await fetch(`${API_URL}${API.AUTH.REFRESH}`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ refresh_token: refreshToken }),
          });

          if (!res.ok) {
            // Refresh token expired — force logout
            set({ user: null, accessToken: null, refreshToken: null });
            return false;
          }

          const json = await res.json();
          set({ accessToken: json.access_token });
          return true;
        } catch {
          return false;
        }
      },

      // -----------------------------------------------------------------------
      // Complete onboarding (step after registration)
      // -----------------------------------------------------------------------
      completeOnboarding: async (data: OnboardingData) => {
        const { accessToken, user } = get();
        if (!accessToken || !user) return;

        set({ isLoading: true, error: null });
        try {
          const res = await fetch(`${API_URL}${API.AUTH.ME}`, {
            method:  "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization:  `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              academic_field:      data.academicField,
              research_interests:  data.researchInterests,
            }),
          });

          if (!res.ok) throw new Error("Failed to save onboarding data.");

          const updatedUser = await res.json();
          set({ user: updatedUser, isOnboarded: true, isLoading: false });
        } catch (err) {
          set({
            isLoading: false,
            error:     err instanceof Error ? err.message : "Onboarding failed.",
          });
          throw err;
        }
      },

      // -----------------------------------------------------------------------
      // Optimistic user update (for settings page)
      // -----------------------------------------------------------------------
      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, ...updates } });
      },

      // -----------------------------------------------------------------------
      // Helpers
      // -----------------------------------------------------------------------
      clearError:   () => set({ error: null }),
      setHydrated:  () => set({ isHydrated: true }),

      isAuthenticated: () => {
        const { user, accessToken } = get();
        return !!(user && accessToken);
      },

      tier: () => get().user?.subscriptionTier ?? "free",

      hasProAccess: () => {
        const t = get().tier();
        return t === "pro" || t === "max";
      },
    }),

    // -------------------------------------------------------------------------
    // Persistence config — only persist tokens + user, not loading/error state
    // -------------------------------------------------------------------------
    {
      name:    STORAGE_KEYS.THEME,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user:         state.user,
        accessToken:  state.accessToken,
        refreshToken: state.refreshToken,
        isOnboarded:  state.isOnboarded,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

/* -----------------------------------------------------------------------------
   Selector hooks — use these in components for better performance
   (each selector only re-renders when its specific slice changes)
   ----------------------------------------------------------------------------- */
export const useUser          = () => useAuthStore((s) => s.user);
export const useIsAuth        = () => useAuthStore((s) => s.isAuthenticated());
export const useIsOnboarded   = () => useAuthStore((s) => s.isOnboarded);
export const useAuthLoading   = () => useAuthStore((s) => s.isLoading);
export const useAuthError     = () => useAuthStore((s) => s.error);
export const useTier          = () => useAuthStore((s) => s.tier());
export const useHasProAccess  = () => useAuthStore((s) => s.hasProAccess());
export const useAccessToken   = () => useAuthStore((s) => s.accessToken);

export const useSubscriptionTier = () =>
  useAuthStore((s) => s.tier());