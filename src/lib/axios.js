import axios from "axios";

export const api = axios.create({
  // baseURL: "https://your-backend-url.com", // ← CHANGE THIS
    baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

