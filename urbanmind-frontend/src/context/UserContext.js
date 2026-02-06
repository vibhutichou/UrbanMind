// src/context/UserContext.js
// Manages user-specific data like posts, profile, stats

import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [userStats, setUserStats] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user stats when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserStats();
      fetchUserPosts();
    }
  }, [isAuthenticated, user]);

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/stats");
      setUserStats(response.data);
    } catch (err) {
      console.error("Failed to fetch user stats:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's posts
  const fetchUserPosts = async () => {
    try {
      const response = await api.get("/posts/my-posts");
      setUserPosts(response.data.posts);
    } catch (err) {
      console.error("Failed to fetch user posts:", err);
    }
  };

  // Update user level/points (for volunteers)
  const updateLevel = async (points) => {
    try {
      const response = await api.post("/users/update-level", { points });
      setUserStats(response.data.stats);
      return response.data;
    } catch (err) {
      console.error("Failed to update level:", err);
    }
  };

  // Get user's verification status
  const getVerificationStatus = async () => {
    try {
      const response = await api.get("/users/verification-status");
      return response.data;
    } catch (err) {
      console.error("Failed to fetch verification status:", err);
      return null;
    }
  };

  // Submit verification documents
  const submitVerificationDocs = async (documents) => {
    try {
      const formData = new FormData();

      Object.keys(documents).forEach(key => {
        formData.append(key, documents[key]);
      });

      const response = await api.post(
        "/users/submit-verification",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return { success: true, data: response.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Verification submission failed'
      };
    }
  };

  const value = {
    userStats,
    userPosts,
    loading,
    fetchUserStats,
    fetchUserPosts,
    updateLevel,
    getVerificationStatus,
    submitVerificationDocs,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
