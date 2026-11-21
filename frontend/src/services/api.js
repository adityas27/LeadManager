import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Token refresh logic
let isRefreshing = false;
let failedRequests = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we have a refresh token, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const stored = localStorage.getItem("lead-manager-auth");
        if (!stored) {
          return Promise.reject(error);
        }

        const { refreshToken } = JSON.parse(stored);
        const response = await api.post("/auth/refresh/", { refresh: refreshToken });
        const { access } = response.data;

        api.defaults.headers.common.Authorization = `Bearer ${access}`;

        // Update stored token
        const authData = { ...JSON.parse(stored), accessToken: access };
        localStorage.setItem("lead-manager-auth", JSON.stringify(authData));

        // Retry all failed requests
        failedRequests.forEach((cb) => cb(access));
        failedRequests = [];

        return api(originalRequest);
      } catch (refreshError) {
        // Clear auth on refresh failure
        localStorage.removeItem("lead-manager-auth");
        delete api.defaults.headers.common.Authorization;
        
        // Redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
