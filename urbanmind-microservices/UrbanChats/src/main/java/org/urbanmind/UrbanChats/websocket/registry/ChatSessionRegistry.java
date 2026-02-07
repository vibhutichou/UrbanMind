package org.urbanmind.UrbanChats.websocket.registry;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ChatSessionRegistry {

    // roomId -> active WebSocket sessions
    private final Map<Long, Set<WebSocketSession>> roomSessions =
            new ConcurrentHashMap<>();

    /**
     * Register a new session.
     * Expects roomId as a query param: ?roomId=123
     */
    public void register(WebSocketSession session) {

        Long roomId = extractRoomId(session);
        if (roomId == null) {
            return;
        }

        roomSessions
                .computeIfAbsent(roomId, id -> ConcurrentHashMap.newKeySet())
                .add(session);
    }

    /**
     * Remove a disconnected session
     */
    public void remove(WebSocketSession session) {

        Long roomId = extractRoomId(session);
        if (roomId == null) {
            return;
        }

        Set<WebSocketSession> sessions = roomSessions.get(roomId);
        if (sessions != null) {
            sessions.remove(session);

            // clean empty rooms
            if (sessions.isEmpty()) {
                roomSessions.remove(roomId);
            }
        }
    }

    /**
     * Broadcast message to all users in a room
     */
    public void broadcastToRoom(Long roomId, String payload) {

        Set<WebSocketSession> sessions = roomSessions.get(roomId);
        if (sessions == null) {
            return;
        }

        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                try {
                    session.sendMessage(new TextMessage(payload));
                } catch (IOException e) {
                    // silently remove broken session
                    remove(session);
                }
            }
        }
    }

    /**
     * Extract roomId from query string
     * Example: ws://host/ws/chat?roomId=42
     */
    private Long extractRoomId(WebSocketSession session) {

        String query = session.getUri().getQuery();
        if (query == null) {
            return null;
        }

        for (String param : query.split("&")) {
            String[] pair = param.split("=");
            if (pair.length == 2 && pair[0].equals("roomId")) {
                try {
                    return Long.parseLong(pair[1]);
                } catch (NumberFormatException ignored) {
                }
            }
        }
        return null;
    }
}
