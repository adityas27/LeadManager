import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

const AuthContext = createContext(null);

const AUTH_TOKEN_KEY = "lead-manager-auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing auth on mount
    const stored = localStorage.getItem(AUTH_TOKEN_KEY);
    if (stored) {
      try {
        const { accessToken, refreshToken, user: userData } = JSON.parse(stored);
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        setUser(userData);
      } catch {
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);

  async function login(username, password) {
    try {
      const response = await api.post("/auth/login/", { username, password });
      const { access, refresh } = response.data;

      api.defaults.headers.common.Authorization = `Bearer ${access}`;

      // Get current user profile
      const userResponse = await api.get("/auth/me/");
      const userData = userResponse.data;

      const authData = {
        accessToken: access,
        refreshToken: refresh,
        user: userData,
      };

      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(authData));
      setUser(userData);
      return { ok: true };
    } catch (err) {
      if (err.response?.status === 401) {
        return { ok: false, form: "Invalid username or password." };
      }
      return {
        ok: false,
        form: err.response?.data?.detail || "Login failed. Please try again.",
      };
    }
  }

  async function refreshAccessToken() {
    try {
      const stored = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!stored) return { ok: false };

      const { refreshToken } = JSON.parse(stored);
      const response = await api.post("/auth/refresh/", { refresh: refreshToken });
      const { access } = response.data;

      api.defaults.headers.common.Authorization = `Bearer ${access}`;

      const authData = {
        ...JSON.parse(stored),
        accessToken: access,
      };
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(authData));

      return { ok: true };
    } catch {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setUser(null);
      return { ok: false };
    }
  }

  function logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    delete api.defaults.headers.common.Authorization;
    setUser(null);
    navigate("/login", { replace: true });
  }

  const value = {
    user,
    loading,
    login,
    refreshAccessToken,
    logout,
    isAuthenticated: !!user,
    isManager: user?.role === "MANAGER",
    isEmployee: user?.role === "EMPLOYEE",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
