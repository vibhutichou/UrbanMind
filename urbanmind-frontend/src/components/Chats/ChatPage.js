// ChatPage.js
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../styles/colors";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import {
  getChatRooms,
  getMessages,
  PAGE_SIZE,
} from "../../services/chatService";
import { createChatSocket } from "../../services/wsChatService";

const ChatPage = () => {
  const { user } = useAuth(); // ✅ safe

  // ✅ derive role color ONCE
  const roleColor =
    colors.roles[user?.role?.toLowerCase()] || colors.primary[500];

  const [chatRooms, setChatRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState({}); // { [roomId]: [msg,...] }
  const [pagination, setPagination] = useState({}); // { [roomId]: { page, totalPages, loadingMore, hasMore }}
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const wsRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Fetch chat rooms once
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        if (user && user.id) {
          const rooms = await getChatRooms(user.id);
          setChatRooms(rooms);
        }
      } catch (err) {
        setError("Failed to fetch chat rooms.");
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, [user]);

  const location = useLocation();

  // Select room if passed in state
  useEffect(() => {
    if (chatRooms.length > 0 && location.state?.roomId) {
      const targetRoom = chatRooms.find((r) => r.id === location.state.roomId);
      if (targetRoom) {
        setActiveRoom(targetRoom);
      }
    }
  }, [chatRooms, location.state]);

  // When active room changes: close existing WS, fetch page 0, then open WS
  useEffect(() => {
    let cleanedUp = false;

    const setupRoom = async () => {
      if (!activeRoom) return;

      // Close previous socket if any
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch (e) {
          /* ignore */
        }
        wsRef.current = null;
      }

      setError(null);

      try {
        // Fetch most recent page (page=0) history via REST
        const pageData = await getMessages(activeRoom.id, 0, PAGE_SIZE);
        // Backend returns a page where content is ordered newest->oldest within page.
        // To display chronologically oldest->newest, reverse page content
        const pageMsgs = Array.isArray(pageData.content)
          ? pageData.content.slice().reverse()
          : [];

        setMessages((prev) => ({ ...prev, [activeRoom.id]: pageMsgs }));
        setPagination((prev) => ({
          ...prev,
          [activeRoom.id]: {
            page: 0,
            totalPages: pageData.totalPages ?? 1,
            loadingMore: false,
            hasMore: pageData.number + 1 < (pageData.totalPages ?? 1),
          },
        }));

        // Scroll to bottom after initial load
        requestAnimationFrame(() => {
          const container = messagesContainerRef.current;
          if (container) {
            container.scrollTop = container.scrollHeight;
          }
        });

        // After loading history, establish WebSocket connection for real-time
        if (!cleanedUp) {
          const { ws, send } = createChatSocket(
            activeRoom.id,
            (eventData) => {
              // eventData is expected to match backend format { roomId, senderUserId, content }
              setMessages((prev) => {
                const next = {
                  ...prev,
                  [activeRoom.id]: [...(prev[activeRoom.id] || []), eventData],
                };

                // Smart-scroll: if user is near bottom, scroll to bottom when new message arrives
                requestAnimationFrame(() => {
                  const container = messagesContainerRef.current;
                  if (!container) return;
                  const distanceFromBottom =
                    container.scrollHeight -
                    container.scrollTop -
                    container.clientHeight;
                  if (distanceFromBottom < 150) {
                    container.scrollTop = container.scrollHeight;
                  }
                });

                return next;
              });
            },
            () => {
              // open
            },
            () => {
              // close
            },
            (err) => {
              console.error("WebSocket error", err);
            },
          );

          wsRef.current = ws;
          // store send function on ref for sending messages
          wsRef.current.sendJson = send;
        }
      } catch (err) {
        console.error(err);
        setError(`Failed to fetch messages for ${activeRoom.name}.`);
      }
    };

    setupRoom();

    return () => {
      cleanedUp = true;
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch (e) {
          /* ignore */
        }
        wsRef.current = null;
      }
    };
  }, [activeRoom]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch (e) {
          /* ignore */
        }
        wsRef.current = null;
      }
    };
  }, []);

  const loadOlderMessages = async () => {
    if (!activeRoom) return;
    const roomId = activeRoom.id;
    const meta = pagination[roomId] || {
      page: 0,
      totalPages: 1,
      loadingMore: false,
      hasMore: false,
    };
    if (meta.loadingMore || !meta.hasMore) return;

    const container = messagesContainerRef.current;
    const prevScrollHeight = container ? container.scrollHeight : 0;

    setPagination((prev) => ({
      ...prev,
      [roomId]: { ...meta, loadingMore: true },
    }));

    try {
      const nextPage = meta.page + 1;
      const pageData = await getMessages(roomId, nextPage, PAGE_SIZE);
      const pageMsgs = Array.isArray(pageData.content)
        ? pageData.content.slice().reverse()
        : [];

      setMessages((prev) => ({
        ...prev,
        [roomId]: [...pageMsgs, ...(prev[roomId] || [])],
      }));

      setPagination((prev) => ({
        ...prev,
        [roomId]: {
          page: nextPage,
          totalPages: pageData.totalPages ?? prev[roomId]?.totalPages ?? 1,
          loadingMore: false,
          hasMore: pageData.number + 1 < (pageData.totalPages ?? 1),
        },
      }));

      // Maintain scroll position after prepending messages
      requestAnimationFrame(() => {
        if (container) {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - prevScrollHeight;
        }
      });
    } catch (err) {
      console.error(err);
      setPagination((prev) => ({
        ...prev,
        [roomId]: { ...meta, loadingMore: false },
      }));
    }
  };

  const handleSend = () => {
    if (!input.trim() || !activeRoom) return;
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      setError("WebSocket is not connected. Please wait a moment.");
      return;
    }

    const payload = {
      roomId: activeRoom.id,
      senderUserId: user.id,
      content: input.trim(),
    };

    try {
      // Send over WebSocket only. Backend will persist then broadcast; we will append on receiving broadcast.
      wsRef.current.sendJson(payload);
      setInput("");
    } catch (err) {
      console.error("Failed to send over WebSocket", err);
      setError("Failed to send message.");
    }
  };

  if (loading) {
    return <div>Loading chats...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      style={{
        height: "calc(100vh - 64px)",
        display: "flex",
        backgroundColor: colors.background.secondary,
      }}
    >
      <ChatList
        rooms={chatRooms}
        activeRoom={activeRoom}
        onSelect={(room) => setActiveRoom(room)}
        roleColor={roleColor}
      />

      <ChatWindow
        activeRoom={activeRoom}
        messages={messages}
        input={input}
        setInput={setInput}
        onSend={handleSend}
        roleColor={roleColor}
        userId={user.id}
        onLoadMore={loadOlderMessages}
        messagesContainerRef={messagesContainerRef}
        loadingMore={
          activeRoom ? Boolean(pagination[activeRoom.id]?.loadingMore) : false
        }
      />
    </div>
  );
};

export default ChatPage;
