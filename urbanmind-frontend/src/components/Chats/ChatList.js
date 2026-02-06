import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, ArrowLeft, LogOut } from "lucide-react";
import { colors } from "../../styles/colors";
import { useAuth } from "../../context/AuthContext";
import profileService from "../../services/profileService";

// Helper to format/fetch chat name
const ChatListItem = ({
  chat,
  activeRoom,
  onSelect,
  roleColor,
  currentUser,
}) => {
  const [displayName, setDisplayName] = useState(chat.name);

  const isActive = activeRoom && chat.id === activeRoom.id;

  useEffect(() => {
    // Basic formatting first
    const formatName = (originalName) => {
      if (!originalName) return "Chat";
      let clean = originalName.replace(/^Chat:\s*/i, "");
      if (clean.includes("&")) {
        const parts = clean.split("&").map((s) => s.trim());
        const currentIdentifier =
          currentUser?.name ||
          currentUser?.username ||
          currentUser?.email?.split("@")[0] ||
          "";
        const otherPart = parts.find(
          (p) =>
            !currentIdentifier.toLowerCase().includes(p.toLowerCase()) &&
            !p.toLowerCase().includes(currentIdentifier.toLowerCase()),
        );
        return otherPart || clean;
      }
      return clean;
    };

    let formatted = formatName(chat.name);

    // If name is still generic "Chat" and we have IDs, fetch the name
    if (formatted.trim().toLowerCase() === "chat") {
      const fetchName = async () => {
        // Identify other user ID
        // Check fields: user1Id, user2Id, or participants
        let otherId = null;
        if (chat.user1Id && chat.user2Id && currentUser) {
          otherId =
            chat.user1Id === currentUser.id ? chat.user2Id : chat.user1Id;
        }

        if (otherId) {
          try {
            // We use public profile to get the name
            const data = await profileService.getPublicProfile(otherId);
            if (data && data.user) {
              setDisplayName(data.user.fullName || data.user.username);
            }
          } catch (err) {
            console.error("Failed to fetch chat user name", err);
          }
        }
      };
      fetchName();
    } else {
      setDisplayName(formatted);
    }
  }, [chat, currentUser]);

  return (
    <div
      onClick={() => onSelect(chat)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.9rem",
        padding: "0.85rem 1.2rem",
        marginBottom: "0.5rem",
        cursor: "pointer",
        borderRadius: "9999px",
        backgroundColor: isActive ? `${roleColor}20` : "transparent",
        transition: "background-color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = `${roleColor}15`;
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: `${roleColor}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: roleColor,
          flexShrink: 0,
        }}
      >
        <MessageCircle size={20} />
      </div>

      <div style={{ lineHeight: 1.25, overflow: "hidden" }}>
        <div
          style={{
            fontSize: "1rem",
            fontWeight: 700,
            color: colors.text.primary,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {displayName}
        </div>

        <div
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: colors.text.secondary,
            marginTop: "2px",
          }}
        >
          {chat.otherUserRole}
        </div>
      </div>
    </div>
  );
};

const ChatList = ({ rooms, activeRoom, onSelect, roleColor }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  const handleLogout = (e) => {
    e.stopPropagation();
    logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        width: "300px",
        backgroundColor: colors.background.primary,
        borderRight: `1px solid ${colors.border.light}`,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* UrbanMind LOGO */}
      <div
        style={{
          padding: "1.5rem",
          fontSize: "1.5rem",
          fontWeight: 800,
          color: roleColor,
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            color: colors.text.primary,
          }}
          title="Go Back"
        >
          <ArrowLeft size={24} />
        </button>
        <span>UrbanMind</span>
      </div>

      {/* CHAT LIST */}
      <div style={{ padding: "0.75rem", overflowY: "auto", flex: 1 }}>
        {rooms.map((chat) => (
          <ChatListItem
            key={chat.id}
            chat={chat}
            activeRoom={activeRoom}
            onSelect={onSelect}
            roleColor={roleColor}
            currentUser={user}
          />
        ))}
      </div>

      {/* USER PROFILE FOOTER */}
      <div
        style={{
          padding: "1rem",
          backgroundColor: colors.background.primary,
        }}
      >
        <div
          onMouseEnter={() => setIsProfileHovered(true)}
          onMouseLeave={() => setIsProfileHovered(false)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.5rem 0.75rem",
            borderRadius: "9999px",
            backgroundColor: isProfileHovered
              ? colors.gray?.[100] || "#f3f4f6"
              : "transparent",
            transition: "all 0.2s ease",
            cursor: "default",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: roleColor,
              color: "white",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              flexShrink: 0,
            }}
          >
            {user?.name?.charAt(0).toUpperCase() ||
              (user?.email || "?").charAt(0).toUpperCase()}
          </div>

          <div style={{ flex: 1, overflow: "hidden" }}>
            <div
              style={{
                fontWeight: "700",
                color: colors.text.primary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontSize: "0.95rem",
              }}
            >
              {user?.name || user?.email?.split("@")[0]}
            </div>
            <div
              style={{
                fontSize: "0.8rem",
                color: colors.text.secondary,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              @{user?.username || user?.email?.split("@")[0]}
            </div>
          </div>

          <button
            onClick={handleLogout}
            onMouseEnter={() => setIsLogoutHovered(true)}
            onMouseLeave={() => setIsLogoutHovered(false)}
            style={{
              background: isLogoutHovered ? "#fee2e2" : "transparent",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              color: isLogoutHovered
                ? colors.error || "#ef4444"
                : colors.text.secondary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: isLogoutHovered ? "rotate(180deg)" : "rotate(0deg)",
            }}
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
