"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore and validate existing login session from backend
  useEffect(() => {
    async function restoreSession() {
      try {
        const storedUser = localStorage.getItem("hms_user");
        const storedToken = localStorage.getItem("hms_token");

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          // Validate token with backend /api/auth/me
          try {
            const meRes = await authAPI.getMe();
            if (meRes.success && meRes.data) {
              setUser(meRes.data);
              localStorage.setItem("hms_user", JSON.stringify(meRes.data));
            } else {
              localStorage.removeItem("hms_token");
              localStorage.removeItem("hms_user");
              setUser(null);
              setToken(null);
            }
          } catch (_) {
            // Stale or expired token; clean up storage
            localStorage.removeItem("hms_token");
            localStorage.removeItem("hms_user");
            setUser(null);
            setToken(null);
          }
        }
      } catch (error) {
        console.error("Auth restore error:", error);
        localStorage.removeItem("hms_user");
        localStorage.removeItem("hms_token");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  // Login handler connected to backend
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });
      if (response.success && response.data) {
        const { token: accessToken, user: userData } = response.data;
        setUser(userData || { email });
        setToken(accessToken);

        if (userData) {
          localStorage.setItem("hms_user", JSON.stringify(userData));
        }
        if (accessToken) {
          localStorage.setItem("hms_token", accessToken);
        }
        return response;
      }
      throw new Error(response.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Register handler connected to backend
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authAPI.register(userData);
      return response;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("hms_user");
    localStorage.removeItem("hms_token");
  };

  const isAuthenticated = !!user || !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}