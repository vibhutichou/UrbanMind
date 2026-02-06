import React, { useEffect, useState } from "react";
import ResponsiveLayout from "../Common/ResponsiveLayout";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import NotificationCard from "../Common/NotificationCard";
import {
  CheckCircle,
  XCircle,
  Info,
  HandHeart,
  AlertCircle,
  Trash2,
  Coins,
  CreditCard,
  Heart,
  MessageCircle,
  Share2,
  Flag,
  User,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Megaphone,
  Wrench,
  AlertTriangle,
  MapPin,
} from "lucide-react";

const CitizenNotification = () => {
  // const { user } = useAuth(); // logged-in citizen
  const { notifications, markAsRead, fetchNotifications } = useNotifications();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If notifications are empty, we might want to ensure they are fetched
    if (notifications.length === 0) {
      fetchNotifications().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [notifications.length, fetchNotifications]);

  // Helper to get Icon and Color based on content
  const getNotificationStyle = (title, message) => {
    const text = (title + " " + message).toLowerCase();

    // --- PROBLEM / POST ---
    if (text.includes("approved"))
      return {
        icon: <CheckCircle color="#16a34a" />,
        bg: "#dcfce7",
        border: "#16a34a",
      };
    if (
      text.includes("rejected") ||
      text.includes("deleted") ||
      text.includes("removed")
    )
      return {
        icon: <XCircle color="#dc2626" />,
        bg: "#fee2e2",
        border: "#dc2626",
      };
    if (text.includes("volunteer"))
      return {
        icon: <HandHeart color="#9333ea" />,
        bg: "#f3e8ff",
        border: "#9333ea",
      };
    if (text.includes("ngo"))
      return {
        icon: <HandHeart color="#ea580c" />,
        bg: "#ffedd5",
        border: "#ea580c",
      };
    if (text.includes("resolved"))
      return {
        icon: <CheckCircle color="#2563eb" />,
        bg: "#dbeafe",
        border: "#2563eb",
      };

    // --- DONATIONS ---
    if (
      text.includes("payment success") ||
      text.includes("received a donation")
    )
      return {
        icon: <Coins color="#eab308" />,
        bg: "#fef9c3",
        border: "#eab308",
      };
    if (text.includes("donation initiated") || text.includes("pending"))
      return {
        icon: <CreditCard color="#3b82f6" />,
        bg: "#eff6ff",
        border: "#3b82f6",
      };
    if (text.includes("payment failed") || text.includes("refunded"))
      return {
        icon: <AlertCircle color="#ef4444" />,
        bg: "#fee2e2",
        border: "#ef4444",
      };

    // --- INTERACTIONS ---
    if (text.includes("liked"))
      return {
        icon: <Heart color="#ec4899" />,
        bg: "#fce7f3",
        border: "#ec4899",
      };
    if (text.includes("comment"))
      return {
        icon: <MessageCircle color="#8b5cf6" />,
        bg: "#f3e8ff",
        border: "#8b5cf6",
      };
    if (text.includes("shared"))
      return {
        icon: <Share2 color="#06b6d4" />,
        bg: "#cffafe",
        border: "#06b6d4",
      };
    if (text.includes("reported"))
      return {
        icon: <Flag color="#f97316" />,
        bg: "#ffedd5",
        border: "#f97316",
      };

    // --- ACCOUNT ---
    if (text.includes("welcome") || text.includes("restored"))
      return {
        icon: <User color="#22c55e" />,
        bg: "#dcfce7",
        border: "#22c55e",
      };
    if (text.includes("suspended") || text.includes("password"))
      return {
        icon: <Lock color="#6b7280" />,
        bg: "#f3f4f6",
        border: "#6b7280",
      };
    if (text.includes("profile updated"))
      return {
        icon: <User color="#3b82f6" />,
        bg: "#eff6ff",
        border: "#3b82f6",
      };

    // --- ADMIN / SYSTEM ---
    if (text.includes("warning"))
      return {
        icon: <AlertTriangle color="#f59e0b" />,
        bg: "#fef3c7",
        border: "#f59e0b",
      };
    if (text.includes("policy violation"))
      return {
        icon: <ShieldAlert color="#dc2626" />,
        bg: "#fee2e2",
        border: "#dc2626",
      };
    if (text.includes("maintenance"))
      return {
        icon: <Wrench color="#64748b" />,
        bg: "#f1f5f9",
        border: "#64748b",
      };
    if (text.includes("announcement"))
      return {
        icon: <Megaphone color="#a855f7" />,
        bg: "#f3e8ff",
        border: "#a855f7",
      };

    // --- SPECIAL (Volunteer/NGO Mocks) ---
    if (text.includes("new problem available"))
      return {
        icon: <MapPin color="#2563eb" />,
        bg: "#eff6ff",
        border: "#2563eb",
      };

    // Default
    return { icon: <Info color="#4b5563" />, bg: "#f3f4f6", border: "#9ca3af" };
  };

  return (
    <ResponsiveLayout showRightSidebar={false}>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
        <h2
          style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          🔔 My Notifications ({notifications.length})
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

export default CitizenNotification;
