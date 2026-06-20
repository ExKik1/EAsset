import axios from "axios";

// ─────────────────────────────────────────────────────────────────────────────
// PHP Native Backend — jalankan dengan: php -S localhost:8080 index.php
// (di folder php_backend/)
// ─────────────────────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const configUrl = error.config?.url || "";
    const cleanUrl  = configUrl.startsWith("/") ? configUrl : `/${configUrl}`;
    const isAuthPage =
      cleanUrl.includes("/auth/login") || cleanUrl.includes("/auth/register");

    if (error.response && error.response.status === 401 && !isAuthPage) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  },
);

export default api;
