import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import api from "../api/axios";
import { connectSocket, disconnectSocket } from "../services/socketService";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    try {
      const res = await api.get(`/api/v1/notifications/user/${user.id}`);
      const data = res.data.data || [];
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/api/v1/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    // Implement if backend supports it, or loop through unread
    // For now, let's just assume we might want this feature later
  };

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();

      connectSocket(user.id, (newNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    }

    return () => {
      if (user?.id) {
        disconnectSocket();
      }
    };
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, fetchNotifications, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
