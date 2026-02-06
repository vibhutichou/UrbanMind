import api from "../api/axios";

export const getAdminNotifications = async (userId) => {
  return api.get(`/api/v1/notifications/user/${userId}`);
};

export const markNotificationAsRead = async (id) => {
  return api.patch(`/api/v1/notifications/${id}/read`);
};

