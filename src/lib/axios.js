import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000",
});

// Attach token automatically to every request
api.interceptors.request.use(
  (config) => {
    const publicEndpoints = [
      "/accounts/login/",
      "/accounts/signup/",
    ];

    // Do not attach token for public endpoints
    if (publicEndpoints.some((url) => config.url?.includes(url))) {
      return config;
    }

    const tokens = localStorage.getItem("tokens");
    if (tokens) {
      const parsed = JSON.parse(tokens);
      if (parsed?.access) {
        config.headers.Authorization = `Bearer ${parsed.access}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

