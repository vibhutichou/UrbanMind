
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";
import React, { createContext, useContext, useState, useEffect } from 'react';
//import api from '../api/axios';
//import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper to extract and normalize role
  const extractRole = (decodedToken) => {
    let role = decodedToken.primaryRole || decodedToken.role || "";
    if (typeof role === 'string') {
      role = role.trim().toUpperCase();
      if (role.startsWith('ROLE_')) {
        role = role.replace('ROLE_', '');
      }
      return role.toLowerCase();
    }
    return "";
  };

  // Restore user on refresh
  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Optional: token expiry check
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          setUser(null);
        } else {
          setUser({
            id: decoded.userId,
            role: extractRole(decoded) || decoded.primaryRole?.toLowerCase(),
            email: decoded.sub,
            name: decoded.fullName || decoded.name || decoded.sub?.split('@')[0],
            isVerified: decoded.isVerified || false
          });
        }
      } catch (err) {
        console.error("Token decoding failed", err);
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // Register
  const register = async (formData) => {
    try {
      setError(null);
      await api.post("/auth/register", {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role.toUpperCase(),
      });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // Login
  const login = async (email, password, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.post("/auth/login", {
        email,
        password,
        rememberMe,
      });

      const token = res.data.token;

      if (rememberMe) {
        localStorage.setItem("token", token);
      } else {
        sessionStorage.setItem("token", token);
      }

      const decoded = jwtDecode(token);

      const loggedUser = {
        id: decoded.userId,
        role: extractRole(decoded) || decoded.primaryRole?.toLowerCase(),
        email: decoded.sub,
        name: decoded.fullName || decoded.name || decoded.sub?.split('@')[0],
        isVerified: decoded.isVerified || false
      };

      setUser(loggedUser);
      scheduleAutoLogout(token);

      return { success: true, user: loggedUser };
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid email or password";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      // ignore errors on logout
    } finally {
      localStorage.removeItem("token");
      sessionStorage.clear();
      setUser(null);
      window.location.href = "/login";
    }
  };

  const scheduleAutoLogout = (token) => {
    try {
      const decoded = jwtDecode(token);
      if (!decoded.exp) return;

      const expiryTime = decoded.exp * 1000;
      const timeout = expiryTime - Date.now();

      if (timeout <= 0) {
        logout();
        return;
      }

      if (timeout < 2147483647) {
        setTimeout(() => {
          logout();
        }, timeout);
      }
    } catch (e) {
      console.error("Auto logout schedule failed", e);
    }
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const isVerified = () => {
    return user?.isVerified === true;
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    hasRole,
    isVerified,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
