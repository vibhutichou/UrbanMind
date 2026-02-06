// src/api/problemApi.js
import api from "./axios"; // use the configured gateway axios instance

// Base path AFTER gateway routing
const BASE = "/api/problems";

// Problems
export const getAllProblems = async () => {
  return api.get(BASE);
};

export const getMyProblems = async () => {
  return api.get(`${BASE}/my`);
};

export const createProblem = async (problemData) => {
  return api.post(BASE, problemData);
};

// Media
export const addProblemMedia = async (problemId, formData) => {
  return api.post(`${BASE}/${problemId}/media`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getProblemMedia = async (problemId) => {
  return api.get(`${BASE}/${problemId}/media`);
};

// Comments
export const getComments = async (problemId) => {
  return api.get(`${BASE}/${problemId}/comments`);
};

export const addComment = async (problemId, content) => {
  return api.post(`${BASE}/${problemId}/comments`, { content });
};

export const deleteComment = async (commentId) => {
  return api.delete(`${BASE}/comments/${commentId}`);
};

// Likes
export const likeProblem = async (problemId) => {
  return api.post(`${BASE}/${problemId}/like`);
};

export const unlikeProblem = async (problemId) => {
  return api.delete(`${BASE}/${problemId}/like`);
};

export const shareProblem = async (problemId) => {
  return api.post(`${BASE}/${problemId}/share`);
};

// Volunteer Actions
export const assignProblem = async (problemId) => {
  return api.post(`${BASE}/${problemId}/assign`);
};

export const resolveProblem = async (problemId) => {
  return api.post(`${BASE}/${problemId}/resolve`);
};

export const updateProblem = async (problemId, data) => {
  return api.patch(`${BASE}/${problemId}`, data);
};

export const getAssignedProblems = async () => {
  return api.get(`${BASE}/assigned`);
};

// Verification (Admin)
export const getPendingVerifications = async () => {
  return api.get(`/verification-requests?status=PENDING`);
};

export const updateVerificationStatus = async (id, status, adminComment = null) => {
  return api.patch(`/verification-requests/${id}/status`, {
    status,
    adminComment
  });
};