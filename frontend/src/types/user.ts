/* =============================================================================
   ResearchOS — User & Auth Types
   ============================================================================= */

import type { Tier, AcademicField } from "@/lib/constants";

/* -----------------------------------------------------------------------------
   User
   ----------------------------------------------------------------------------- */
export interface User {
  id:                  string;
  email:               string;
  name:                string | null;
  avatarUrl:           string | null;
  academicField:       AcademicField | null;
  researchInterests:   string[];
  subscriptionTier:    Tier;
  subscriptionStatus:  SubscriptionStatus;
  oauthProvider:       OAuthProvider | null;
  emailVerified:       boolean;
  createdAt:           string;
  updatedAt:           string;
}

export type SubscriptionStatus =
  | "active"
  | "inactive"
  | "trialing"
  | "past_due"
  | "canceled";

export type OAuthProvider = "google" | "apple";

/* -----------------------------------------------------------------------------
   Auth request / response shapes
   ----------------------------------------------------------------------------- */
export interface LoginRequest {
  email:    string;
  password: string;
}

export interface RegisterRequest {
  name:     string;
  email:    string;
  password: string;
}

export interface AuthResponse {
  accessToken:  string;
  refreshToken: string;
  user:         User;
}

export interface RefreshResponse {
  accessToken: string;
}

/* -----------------------------------------------------------------------------
   Onboarding
   ----------------------------------------------------------------------------- */
export interface OnboardingData {
  academicField:     AcademicField;
  researchInterests: string[];
  selectedTier:      Tier;
}

/* -----------------------------------------------------------------------------
   Session (NextAuth)
   ----------------------------------------------------------------------------- */
export interface Session {
  user:        User;
  accessToken: string;
  expires:     string;
}