import React, { useEffect, useRef, useState } from "react";
import { colors } from "../../styles/colors";
import { CheckCheck } from "lucide-react";
import profileService from "../../services/profileService";
import { useAuth } from "../../context/AuthContext";

const ChatWindow = ({
  activeRoom,
  messages,
  input,
  setInput,
  onSend,
  roleColor,
  userId,
  onLoadMore,
  messagesContainerRef,
  loadingMore,
}) => {
  const localContainerRef = useRef(null);
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");

  // If parent didn't pass a ref, use the local one
  const containerRef = messagesContainerRef || localContainerRef;

  // Resolve Display Name
  useEffect(() => {
    if (!activeRoom) return;

    const originalName = activeRoom.name || "Chat";
    let formatted = originalName;

    // 1. Check for hard names
    if (activeRoom.otherUserName) {
      setDisplayName(activeRoom.otherUserName);
      return;
    }

    // 2. Format "Chat: A & B"
    let clean = originalName.replace(/^Chat:\s*/i, "");
    if (clean.includes("&")) {
      const parts = clean.split("&").map((s) => s.trim());
      const currentIdentifier =
        user?.name || user?.username || user?.email?.split("@")[0] || "";
      const otherPart = parts.find(
        (p) =>
          !currentIdentifier.toLowerCase().includes(p.toLowerCase()) &&
          !p.toLowerCase().includes(currentIdentifier.toLowerCase()),
      );
      formatted = otherPart || clean;
    } else {
      formatted = clean;
    }

    // 3. If generic "Chat", fetch
    if (formatted.trim().toLowerCase() === "chat") {
      const fetchName = async () => {
        let otherId = null;
        if (activeRoom.user1Id && activeRoom.user2Id && user) {
          otherId =
            activeRoom.user1Id === user.id
              ? activeRoom.user2Id
              : activeRoom.user1Id;
        }

        if (otherId) {
          try {
            const data = await profileService.getPublicProfile(otherId);
            if (data && data.user) {
              setDisplayName(data.user.fullName || data.user.username);
            } else {
              setDisplayName("Chat");
            }
          } catch (err) {
            console.error("Failed to fetch chat user name in window", err);
            setDisplayName("Chat");
          }
        } else {
          setDisplayName("Chat");
        }
      };
      fetchName();
    } else {
      setDisplayName(formatted);
    }
  }, [activeRoom, user]);

  /**
   * ✅ Hook MUST always run
   * Guard logic goes INSIDE the hook
   */
  useEffect(() => {
    if (!activeRoom) return;

    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      // when scrolled close to top, request older messages
      if (el.scrollTop <= 50 && !loadingMore) {
        onLoadMore?.();
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [activeRoom, containerRef, onLoadMore, loadingMore]);

  // ✅ EARLY RETURN AFTER ALL HOOKS
  if (!activeRoom) {
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: colors.text.secondary,
          fontSize: "1rem",
        }}
      >
        👋 Select a chat to start messaging
      </div>
    );
  }

  const roomRole = activeRoom.otherUserRole;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* ===== HEADER ===== */}
      <div
        style={{
          height: "64px",
          padding: "0 1rem",
          borderBottom: `1px solid ${colors.border.light}`,
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          backgroundColor: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 10,
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
          }}
        >
          {displayName.charAt(0)}
        </div>

        <div>
          <div style={{ fontWeight: "600", color: colors.text.primary }}>
            {displayName}
          </div>
          <div style={{ fontSize: "0.75rem", color: colors.text.secondary }}>
            {roomRole}
          </div>
        </div>
      </div>

      {/* ===== MESSAGES ===== */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          padding: "1rem",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {loadingMore && (
          <div style={{ textAlign: "center", color: colors.text.secondary }}>
            Loading older messages…
          </div>
        )}

        {(messages[activeRoom.id] || []).map((msg, idx, arr) => {
          const isMe = msg.senderUserId === userId;

          const getDate = (m) => {
            const d = m?.createdAt || m?.timestamp;
            if (!d) return null;
            const parsed = new Date(d);
            return isNaN(parsed.getTime()) ? null : parsed;
          };

          const isSameDay = (a, b) =>
            a &&
            b &&
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate();

          const date = getDate(msg);
          const prevDate = idx > 0 ? getDate(arr[idx - 1]) : null;
          const showDate = date && (!prevDate || !isSameDay(date, prevDate));

          const formatDate = (d) => {
            if (!d) return "";
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);
            if (isSameDay(d, today)) return "Today";
            if (isSameDay(d, yesterday)) return "Yesterday";
            return d.toLocaleDateString();
          };

          const formatTime = (d) => {
            if (!d) return "";
            return d.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          };

          return (
            <React.Fragment key={idx}>
              {showDate && (
                <div
                  style={{
                    textAlign: "center",
                    color: colors.text.secondary,
                    fontSize: "0.8rem",
                    margin: "1rem 0",
                  }}
                >
                  {formatDate(date)}
                </div>
              )}

              {/* 
                  ALIGNMENT:
                  Outgoing (Me)    -> Right (flex-end)
                  Incoming (Other) -> Left (flex-start)
              */}
              <div
                style={{
                  display: "flex",
                  justifyContent: isMe ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    padding: "0.6rem 0.9rem",
                    borderRadius: "12px",
                    backgroundColor: isMe ? roleColor : colors.gray[200],
                    color: isMe ? "white" : colors.text.primary,
                    fontSize: "0.9rem",
                    wordBreak: "break-word",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMe ? "flex-end" : "flex-start",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  <div>{msg.content}</div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      marginTop: "4px",
                      fontSize: "0.7rem",
                      opacity: 0.8,
                      alignSelf: "flex-end",
                    }}
                  >
                    {date && <span>{formatTime(date)}</span>}

                    {/* Read Receipt (Checkmarks) for Outgoing messages only */}
                    {isMe && (
                      <span style={{ display: "flex", alignItems: "center" }}>
                        {/* Logic for checks: 
                             If we had a real 'status' field:
                             - sent: <Check size={14} />
                             - read: <CheckCheck size={14} />
                             For now, defaulting to CheckCheck 
                         */}
                        <CheckCheck size={14} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* ===== INPUT ===== */}
      <div
        style={{
          padding: "0.75rem",
          borderTop: `1px solid ${colors.border.light}`,
          display: "flex",
          gap: "0.5rem",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          style={{
            flex: 1,
            padding: "0.5rem 0.75rem",
            borderRadius: "8px",
            border: `1px solid ${colors.border.light}`,
            outline: "none",
          }}
        />

        <button
          onClick={onSend}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: roleColor,
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
