import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9000",
  withCredentials: false, // ✅ NO cookies
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  // Don't attach token to login/register requests
  if (token && !config.url.includes("/auth/login") && !config.url.includes("/auth/register")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
