import React, { useEffect, useState } from "react";
import ResponsiveLayout from "../Common/ResponsiveLayout";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import NotificationCard from "../Common/NotificationCard";
import { connectSocket, disconnectSocket } from "../../services/socketService";
import {
  CheckCircle, XCircle, Info, HandHeart, AlertTriangle,
  MapPin, Coins, Users, UserMinus, ShieldCheck, ShieldAlert,
  FolderPlus, FolderCog, UserX, Briefcase
} from "lucide-react";



const NGONotification = () => {
  // ... logic remains same ...
  const { user } = useAuth(); // logged-in NGO user
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get(
        `/api/v1/notifications/user/${user?.id}`
      );
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("Error fetching NGO notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/api/v1/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
      connectSocket(user.id, (newNotification) => {
        setNotifications(prev => [newNotification, ...prev]);
      });
    }
    return () => disconnectSocket();
  }, [user]);

  // Helper to map content to styles
  const getNotificationStyle = (title, message) => {
    const text = (title + " " + message).toLowerCase();

    // --- PROBLEMS & PROJECTS ---
    if (text.includes("assigned")) return { icon: <Briefcase color="#ea580c" />, bg: "#ffedd5", border: "#ea580c" };
    if (text.includes("problem resolved")) return { icon: <CheckCircle color="#16a34a" />, bg: "#dcfce7", border: "#16a34a" };
    if (text.includes("project created")) return { icon: <FolderPlus color="#2563eb" />, bg: "#eff6ff", border: "#2563eb" };
    if (text.includes("project updated")) return { icon: <FolderCog color="#0891b2" />, bg: "#cffafe", border: "#0891b2" };

    // --- DONATIONS ---
    if (text.includes("donation") || text.includes("high-value")) return { icon: <Coins color="#eab308" />, bg: "#fef9c3", border: "#eab308" };
    if (text.includes("donation failed")) return { icon: <XCircle color="#ef4444" />, bg: "#fee2e2", border: "#ef4444" };

    // --- TEAM ---
    if (text.includes("member joined") || text.includes("added")) return { icon: <Users color="#9333ea" />, bg: "#f3e8ff", border: "#9333ea" };
    if (text.includes("member removed")) return { icon: <UserMinus color="#6b7280" />, bg: "#f3f4f6", border: "#6b7280" };

    // --- VERIFICATION ---
    if (text.includes("verification approved")) return { icon: <ShieldCheck color="#16a34a" />, bg: "#dcfce7", border: "#16a34a" };
    if (text.includes("verification rejected")) return { icon: <ShieldAlert color="#dc2626" />, bg: "#fee2e2", border: "#dc2626" };
    if (text.includes("verification submitted")) return { icon: <Info color="#3b82f6" />, bg: "#eff6ff", border: "#3b82f6" };

    // --- ADMIN / ALERTS ---
    if (text.includes("warning")) return { icon: <AlertTriangle color="#f97316" />, bg: "#ffedd5", border: "#f97316" };
    if (text.includes("suspended")) return { icon: <UserX color="#dc2626" />, bg: "#fee2e2", border: "#dc2626" };

    // Default
    return { icon: <Info color="#4b5563" />, bg: "#f3f4f6", border: "#9ca3af" };
  };

  return (
    <ResponsiveLayout showRightSidebar={false}>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          🔔 NGO Notifications
        </h2>

        {loading ? (
          <p>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            <Info size={48} style={{ marginBottom: "10px", opacity: 0.5 }} />
            <p>No notifications yet.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              styleResult={getNotificationStyle(n.title, n.message)}
              onMarkRead={markAsRead}
            />
          ))
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default NGONotification;
