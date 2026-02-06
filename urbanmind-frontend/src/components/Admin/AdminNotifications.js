import React, { useEffect, useState } from "react";
import { getAdminNotifications, markNotificationAsRead } from "../../services/notificationService";
import ResponsiveLayout from "../Common/ResponsiveLayout";
import { useAuth } from "../../context/AuthContext";
import { connectSocket, disconnectSocket } from "../../services/socketService";
import {
  CheckCircle, XCircle, Info, AlertTriangle, ShieldAlert,
  Coins, UserPlus, FileCheck, ServerCrash, Megaphone, Send
} from "lucide-react";
import api from "../../api/axios";

import NotificationCard from "../Common/NotificationCard";


// ... imports ...

const AdminNotification = () => {
  const { user } = useAuth();
  // ... state ...
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Announcement State
  const [announcement, setAnnouncement] = useState("");
  const [sending, setSending] = useState(false);

  const fetchNotifications = async () => {
    if (!user?.id) return;
    try {
      const res = await getAdminNotifications(user.id);
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // ... broadcast logic (sendAnnouncement) remains same ...

  const sendAnnouncement = async () => {
    if (!announcement.trim()) return;
    setSending(true);
    try {
      await api.post(`/api/v1/notifications/broadcast`, {
        title: "📢 Admin Announcement",
        message: announcement,
        type: "ANNOUNCEMENT",
        channel: "IN_APP",
        referenceType: "SYSTEM",
        referenceId: 0
      });
      setAnnouncement("");
      alert("Announcement sent to everyone!");
    } catch (err) {
      console.error("Broadcast failed", err);
      alert("Failed to send announcement");
    } finally {
      setSending(false);
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

  // Helper styles
  const getNotificationStyle = (title, message) => {
    const text = (title + " " + message).toLowerCase();

    // User Mgmt
    if (text.includes("registered")) return { icon: <UserPlus color="#2563eb" />, bg: "#eff6ff", border: "#2563eb" };
    if (text.includes("reported")) return { icon: <ShieldAlert color="#dc2626" />, bg: "#fee2e2", border: "#dc2626" };

    // Verifications
    if (text.includes("verification")) return { icon: <FileCheck color="#9333ea" />, bg: "#f3e8ff", border: "#9333ea" };

    // Payments
    if (text.includes("payment") || text.includes("transaction")) return { icon: <Coins color="#eab308" />, bg: "#fef9c3", border: "#eab308" };

    // System
    if (text.includes("error") || text.includes("failure") || text.includes("down")) return { icon: <ServerCrash color="#ef4444" />, bg: "#fee2e2", border: "#ef4444" };

    // Announcement
    if (text.includes("announcement")) return { icon: <Megaphone color="#d946ef" />, bg: "#fdf4ff", border: "#d946ef" };

    return { icon: <Info color="#4b5563" />, bg: "#f3f4f6", border: "#9ca3af" };
  };

  return (
    <ResponsiveLayout showRightSidebar={false}>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "20px" }}>🔔 Admin Notifications</h2>

        {/* --- Announcement Section --- */}
        <div style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          marginBottom: "30px",
          border: "1px solid #e5e7eb"
        }}>
          <h3 style={{ margin: "0 0 15px 0", display: "flex", alignItems: "center", gap: "10px", color: "#4b5563" }}>
            <Megaphone size={20} /> Create Announcement
          </h3>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Type a message for all users..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              style={{
                flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "16px"
              }}
            />
            <button
              onClick={sendAnnouncement}
              disabled={sending}
              style={{
                backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: "6px",
                padding: "0 20px", cursor: sending ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: "5px", fontWeight: "600"
              }}
            >
              {sending ? "Sending..." : <><Send size={16} /> Send</>}
            </button>
          </div>
          <small style={{ color: "#6b7280", marginTop: "8px", display: "block" }}>
            This will be sent to ALL Citizens, Volunteers, and NGOs instantly.
          </small>
        </div>

        {/* --- List Section --- */}
        {loading ? (
          <p>Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p>No notifications found.</p>
        ) : (
          notifications.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              styleResult={getNotificationStyle(n.title, n.message)}
              onMarkRead={handleMarkRead}
            />
          ))
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default AdminNotification;
