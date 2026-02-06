import api from "../api/axios";

export const PAGE_SIZE = 20;

export const getChatRooms = async (userId) => {
  try {
    const response = await api.get("/api/v1/chats/rooms", {
      params: { userId },
    });
    return response.data.content; // The backend returns a Page object
  } catch (error) {
    console.error("Error fetching chat rooms:", error);
    throw error;
  }
};

export const createChatRoom = async (senderId, recipientId) => {
  try {
    const response = await api.post("/api/v1/chats/rooms", {
      //createdByUserId: senderId,   // who initiated chat
      user1Id: senderId,           // first participant
      user2Id: recipientId,        // second participant
      roomType: "PRIVATE"          // or "DIRECT" if backend enum uses that
    });

    return response.data;
  } catch (error) {
    console.error("Error creating chat room:", error);
    throw error;
  }
};

/**
 * Fetch paginated messages for a room.
 * - page: number (page=0 is the most recent page per backend contract)
 * - size: number
 * Returns the full Page object from backend so caller can inspect page metadata.
 */
export const getMessages = async (roomId, page = 0, size = PAGE_SIZE) => {
  try {
    const response = await api.get(
      `/api/v1/chats/rooms/${roomId}/messages`,
      { params: { page, size } },
    );
    return response.data; // full Page object
  } catch (error) {
    console.error(`Error fetching messages for room ${roomId}:`, error);
    throw error;
  }
};

// web socket does the send message part so this is uselless now and fallback
// Keep REST fallback if needed elsewhere, but ChatPage will use WebSocket for real-time sends
// export const sendMessage = async (roomId, message, userId) => {
//   try {
//     const response = await api.post(`/chats/rooms/${roomId}/messages`, { text: message, senderUserId: userId });
//     return response.data;
//   } catch (error) {
//     console.error(`Error sending message to room ${roomId}:`, error);
//     throw error;
//   }
// };
