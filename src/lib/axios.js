import axios from "axios";
import { emitAuthEvent, AUTH_EVENTS } from "@/lib/authEvents";


export const api = axios.create({
  baseURL: "http://localhost:8000",
});

// Attach token automatically to every request
api.interceptors.request.use(
  (config) => {
    const publicEndpoints = [
      "/accounts/login/",
      "/accounts/signup/",
      "/accounts/refresh/",
    ];

    if (publicEndpoints.some((url) => config.url?.includes(url))) {
      return config;
    }

    const tokens = localStorage.getItem("tokens");
    if (tokens) {
      const { access } = JSON.parse(tokens);
      if (access) {
        config.headers.Authorization = `Bearer ${access}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const tokens = JSON.parse(localStorage.getItem("tokens"));

      if (!tokens?.refresh) {
        forceLogout();
        return Promise.reject(error);
      }

      // If refresh already in progress, queue requests
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = "Bearer " + token;
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const res = await api.post("/accounts/refresh/", {
          refresh: tokens.refresh,
        });

        const newAccess = res.data.access;

        localStorage.setItem(
          "tokens",
          JSON.stringify({
            ...tokens,
            access: newAccess,
          })
        );

        api.defaults.headers.Authorization = `Bearer ${newAccess}`;
        processQueue(null, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        forceLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

function forceLogout() {
  localStorage.removeItem("tokens");
  emitAuthEvent(AUTH_EVENTS.SESSION_EXPIRED);
}

