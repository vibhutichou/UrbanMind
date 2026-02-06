package org.urbanmind.UrbanChats.websocket.model;

import java.time.OffsetDateTime;

public class ChatSocketMessage {

    private Long roomId;
    private Long senderUserId;
    private String content;

    // optional, filled by server if needed
    private OffsetDateTime createdAt;

    
    public ChatSocketMessage() {
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public Long getSenderUserId() {
        return senderUserId;
    }

    public void setSenderUserId(Long senderUserId) {
        this.senderUserId = senderUserId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
