package org.urbanmind.UrbanChats.websocket.handler;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.urbanmind.UrbanChats.Entity.ChatMessage;
import org.urbanmind.UrbanChats.Service.ChatMessageService;
import org.urbanmind.UrbanChats.websocket.model.ChatSocketMessage;
import org.urbanmind.UrbanChats.websocket.registry.ChatSessionRegistry;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.time.OffsetDateTime;

@SuppressWarnings("unused")
@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final ChatSessionRegistry sessionRegistry;
    private final ChatMessageService chatMessageService;
    private final org.urbanmind.UrbanChats.Repository.ChatRoomRepository chatRoomRepository;
    private final org.springframework.web.client.RestTemplate restTemplate;
    
    private final ObjectMapper objectMapper;

    public ChatWebSocketHandler(ChatSessionRegistry sessionRegistry,
                                ChatMessageService chatMessageService,
                                org.urbanmind.UrbanChats.Repository.ChatRoomRepository chatRoomRepository,
                                org.springframework.web.client.RestTemplate restTemplate,
                                ObjectMapper objectMapper) {
        this.sessionRegistry = sessionRegistry;
        this.chatMessageService = chatMessageService;
        this.chatRoomRepository = chatRoomRepository;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }


    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessionRegistry.register(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

        try {
            ChatSocketMessage socketMessage =
                    objectMapper.readValue(message.getPayload(), ChatSocketMessage.class);

            ChatMessage savedMessage = chatMessageService.saveFromWebSocket(
                    socketMessage.getRoomId(),
                    socketMessage.getSenderUserId(),
                    socketMessage.getContent()
            );

            socketMessage.setCreatedAt(savedMessage.getCreatedAt());

            String payload = objectMapper.writeValueAsString(socketMessage);
            sessionRegistry.broadcastToRoom(socketMessage.getRoomId(), payload);
            
            // --- NOTIFICATION LOGIC ---
            sendNotification(socketMessage);

        } catch (Exception ex) {
            ex.printStackTrace(); // IMPORTANT
            session.sendMessage(new TextMessage(
                    "{\"error\":\"Message processing failed\"}"
            ));
        }
    }
    
    // Helper to send notification
    private void sendNotification(ChatSocketMessage msg) {
        try {
            // 1. Find the room to know who is the OTHER user
            org.urbanmind.UrbanChats.Entity.ChatRooms room = 
                chatRoomRepository.findById(msg.getRoomId()).orElse(null);
            
            if (room != null) {
                Long recipientId = null;
                // If sender is user1, recipient is user2, and vice versa
                if (msg.getSenderUserId().equals(room.getUser1Id())) {
                    recipientId = room.getUser2Id();
                } else if (msg.getSenderUserId().equals(room.getUser2Id())) {
                    recipientId = room.getUser1Id();
                }
                
                if (recipientId != null) {
                    // 2. Prepare Notification Request
                    // Using a Map or inner class DTO to avoid importing from another project
                    java.util.Map<String, Object> notificationReq = new java.util.HashMap<>();
                    notificationReq.put("userId", recipientId);
                    notificationReq.put("title", "New Message");
                    notificationReq.put("message", "You have a new message from User " + msg.getSenderUserId()); // Could fetch name if needed
                    notificationReq.put("type", "CHAT_MESSAGE");
                    notificationReq.put("channel", "IN_APP");
                    notificationReq.put("referenceType", "CHAT_ROOM");
                    notificationReq.put("referenceId", msg.getRoomId());

                    // 3. Call Donation-Notification-Service
                    // Assuming service name is "DONATION-NOTIFICATION-SERVICE"
                    String url = "http://DONATION-NOTIFICATION-SERVICE/api/v1/notifications";
                    restTemplate.postForObject(url, notificationReq, Object.class);
                   // System.out.println("Notification sent to user " + recipientId);
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to trigger notification: " + e.getMessage());
            e.printStackTrace();
        }
    }


    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessionRegistry.remove(session);
    }
}
