import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadOwner = async () => {
    try {
      console.log("Loading owner from /auth/me...");
      const { data } = await api.get("/auth/me");
      console.log("Owner loaded:", data.owner);
      setOwner(data.owner);
    } catch (error) {
      console.log("Failed to load owner, trying refresh...");
      try {
        const { data } = await api.post("/auth/refresh");
        console.log("Token refreshed, owner:", data.owner);
        setOwner(data.owner);
      } catch (refreshError) {
        console.log("Refresh failed, user not logged in");
        setOwner(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwner();
  }, []);

  const login = async (payload) => {
    console.log("Attempting login with:", { email: payload.email, password: "***" });
    try {
      const response = await api.post("/auth/login", payload);
      console.log("Full login response:", response);
      console.log("Login data:", response.data);
      
      if (response.data && response.data.owner) {
        console.log("Setting owner:", response.data.owner);
        setOwner(response.data.owner);
      } else {
        console.error("No owner in response data:", response.data);
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
    setOwner(null);
  };

  const value = useMemo(
    () => ({ owner, loading, login, logout }),
    [owner, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
