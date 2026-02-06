// src/context/PostContext.js
// Manages posts (problems), comments, likes, and donations

import React, { createContext, useState, useContext } from "react";
import api from "../api/axios";

const PostContext = createContext();

export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error("usePost must be used within PostProvider");
  }
  return context;
};

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all posts (feed)
  const fetchPosts = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams(filters).toString();

      const response = await api.get(`/posts?${queryParams}`);

      setPosts(response.data.posts);
      setLoading(false);
      return response.data.posts;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch posts");
      setLoading(false);
      return [];
    }
  };

  // Create new post
  const createPost = async (postData) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", postData.title);
      formData.append("description", postData.description);
      formData.append("category", postData.category);
      formData.append("location", JSON.stringify(postData.location));

      if (postData.images) {
        postData.images.forEach((image) => {
          formData.append("images", image);
        });
      }

      const response = await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPosts([response.data.post, ...posts]);
      setLoading(false);
      return { success: true, post: response.data.post };
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to create post";
      setError(errorMsg);
      setLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  // Like/Unlike post
  const toggleLike = async (postId) => {
    try {
      const response = await api.post(`/posts/${postId}/like`);

      // Update post in state
      setPosts(
        posts.map((post) => (post._id === postId ? response.data.post : post))
      );

      return response.data;
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  // Add comment
  const addComment = async (postId, comment) => {
    try {
      const response = await api.post(`/posts/${postId}/comments`, { comment });

      // Update post with new comment
      setPosts(
        posts.map((post) => (post._id === postId ? response.data.post : post))
      );

      return { success: true, comment: response.data.comment };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to add comment",
      };
    }
  };

  // Update post status (for volunteers/NGOs)
  const updatePostStatus = async (postId, status, updateData) => {
    try {
      const response = await api.put(`/posts/${postId}/status`, {
        status,
        ...updateData,
      });

      setPosts(
        posts.map((post) => (post._id === postId ? response.data.post : post))
      );

      return { success: true, post: response.data.post };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to update status",
      };
    }
  };

  // Report post as spam
  const reportPost = async (postId, reason) => {
    try {
      const response = await api.post(`/posts/${postId}/report`, { reason });

      return { success: true, message: "Post reported successfully" };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to report post",
      };
    }
  };

  // Delete post
  const deletePost = async (postId) => {
    try {
      await api.delete(`/posts/${postId}`);

      setPosts(posts.filter((post) => post._id !== postId));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Failed to delete post",
      };
    }
  };

  // Donate to a post/problem
  const donateToPost = async (postId, amount, message) => {
    try {
      const response = await api.post("/donations", {
        postId,
        amount,
        message,
      });

      return { success: true, donation: response.data.donation };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Donation failed",
      };
    }
  };

  const value = {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    toggleLike,
    addComment,
    updatePostStatus,
    reportPost,
    deletePost,
    donateToPost,
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};

export default PostContext;
