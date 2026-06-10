import axios from "axios";
import { API_URL } from "@/lib/constants";

/* =============================================================================
   ResearchOS — Axios API Client
   Pre-configured axios instance used across all services.
   Auth token injection is handled by authStore interceptors.
   ============================================================================= */

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;