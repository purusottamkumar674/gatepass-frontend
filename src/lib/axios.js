import axios from "axios";

export const api = axios.create({
  baseURL: "https://p4.project1.space",
    // baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

