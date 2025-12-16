import axios from "axios";
import { emitAuthEvent, AUTH_EVENTS } from "@/lib/authEvents";

export const api = axios.create({
  baseURL: "http://localhost:8000",
  // baseURL: "https://p4.project1.space",
  withCredentials: true, // safe to keep (cookies / CSRF future-ready)
});

/* ================================
   REQUEST INTERCEPTOR
   - Attaches access token
   - Runs BEFORE every request
================================ */
api.interceptors.request.use(
  (config) => {
    const tokensRaw = localStorage.getItem("tokens");

    if (tokensRaw) {
      try {
        const { access } = JSON.parse(tokensRaw);
        if (access) {
          config.headers.Authorization = `Bearer ${access}`;
        }
      } catch {
        // Corrupted tokens → clean up
        localStorage.removeItem("tokens");
        localStorage.removeItem("user");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================================
   RESPONSE INTERCEPTOR
   - Handles expired / invalid token
   - Emits SESSION_EXPIRED only when valid
================================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network / CORS / server down
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = error.config?.url || "";

    // Do NOT interfere with auth endpoints
    const authEndpoints = [
      "/accounts/login/",
      "/accounts/signup/",
    ];

    if (authEndpoints.some((endpoint) => url.includes(endpoint))) {
      return Promise.reject(error);
    }

    const tokensRaw = localStorage.getItem("tokens");
    const hasAccessToken =
      tokensRaw && JSON.parse(tokensRaw)?.access;

    // 🔴 Access token existed but backend says 401 → session expired
    if (status === 401 && hasAccessToken) {
      forceLogout();
    }

    return Promise.reject(error);
  }
);

/* ================================
   FORCE LOGOUT (single authority)
================================ */
function forceLogout() {
  localStorage.removeItem("tokens");
  localStorage.removeItem("user");

  emitAuthEvent(AUTH_EVENTS.SESSION_EXPIRED);
}

