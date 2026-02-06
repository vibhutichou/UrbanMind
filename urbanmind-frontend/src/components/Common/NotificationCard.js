import React from "react";
import { formatRelativeTime } from "../../utils/dateUtils";
import { Check } from "lucide-react";

/**
 * Shared Notification Card Component
 * @param {Object} props
 * @param {Object} props.notification - The notification object
 * @param {Object} props.styleResult - The style object { icon, bg, border }
 * @param {Function} props.onMarkRead - Function to handle mark as read
 */
const NotificationCard = ({ notification, styleResult, onMarkRead }) => {
  const { title, message, createdAt, isRead } = notification;
  const { icon, bg, border } = styleResult;

  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        padding: "16px",
        marginBottom: "12px",
        borderRadius: "12px",
        backgroundColor: isRead ? "#ffffff" : bg,
        border: `1px solid ${isRead ? "#e5e7eb" : border}`,
        borderLeft: `5px solid ${isRead ? "#d1d5db" : border}`,
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        opacity: isRead ? 0.8 : 1,
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.05)";
      }}
    >
      {/* Icon Section */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: "4px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "50%",
            padding: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
      </div>

      {/* Content Section */}
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "4px",
          }}
        >
          <h4
            style={{
              margin: 0,
              fontSize: "1rem",
              fontWeight: isRead ? "500" : "700",
              color: "#1f2937",
            }}
          >
            {title}
          </h4>
          <span
            style={{
              fontSize: "0.75rem",
              color: "#6b7280",
              whiteSpace: "nowrap",
              marginLeft: "10px",
            }}
          >
            {formatRelativeTime(createdAt)}
          </span>
        </div>

        <p
          style={{
            margin: "0 0 12px 0",
            fontSize: "0.9rem",
            color: "#4b5563",
            lineHeight: "1.5",
          }}
        >
          {message}
        </p>

        {/* Action Section */}
        {!isRead && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => onMarkRead(notification.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 12px",
                backgroundColor: "#fff",
                color: border, // Dynamic emphasis color
                border: `1px solid ${border}`,
                borderRadius: "20px",
                fontSize: "0.8rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = border;
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.color = border;
              }}
            >
              <Check size={14} /> Mark as Read
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
