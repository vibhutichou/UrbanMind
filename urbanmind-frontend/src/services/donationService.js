import api from "../api/axios";

// Get user specific donations
export const getUserDonations = async (userId) => {
  return await api.get(`/donations/users/${userId}`);
};

export const verifyPayment = (donationId, payload) =>
  api.post(`/donations/${donationId}/verify-payment`, payload);

// Get all donations (for feed)
export const getAllDonations = async () => {
  return await api.get(`/donations`);
};

// Get specific donation details
export const getDonationById = async (id) => {
  return await api.get(`/donations/${id}`);
};

// Create a new donation (Initiate)
export const createDonation = async (donationData) => {
  // donationData: { userId, projectId, amount, ... }
  return await api.post(`/donations`, donationData);
};

// Process Payment
export const processPayment = async (donationId, paymentData) => {
  // paymentData: { paymentMethod, transactionId, ... }
  return await api.post(`/donations/${donationId}/pay`, paymentData);
};

// Mark Problem/Project as Donation Required (For NGO)
export const markProblemForDonation = async (problemId, donationData) => {
  // donationData: { donationRequired: true, targetAmount: 50000 }
  return await api.put(`/problems/${problemId}/mark-donation`, donationData);
};

// Get donations for a specific problem
export const getDonationsByProblemId = async (problemId) => {
  return await api.get(`/donations/problem/${problemId}`);
};

// Get problem details
export const getProblemDetails = async (problemId) => {
  return await api.get(`/problems/${problemId}`);
};
