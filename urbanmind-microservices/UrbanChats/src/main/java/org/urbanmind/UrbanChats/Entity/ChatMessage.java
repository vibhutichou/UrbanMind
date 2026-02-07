package org.urbanmind.UrbanChats.Entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "sender_user_id", nullable = false)
    private Long senderUserId;

    @Column(name = "content", columnDefinition = "text")
    private String content;

    @Column(name = "media_url", length = 255)
    private String mediaUrl;

    @Column(name = "media_type", length = 30)
    private String mediaType;

    @Column(name = "is_read")
    private Boolean isRead;

    @Column(name = "read_at")
    private OffsetDateTime readAt;

    @Column(name = "created_at")
    private OffsetDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = OffsetDateTime.now();
        this.isRead = false;  
    }

    public ChatMessage(Long id, Long roomId, Long senderUserId, String content, String mediaUrl, String mediaType,
			Boolean isRead, OffsetDateTime readAt, OffsetDateTime createdAt) {
		super();
		this.id = id;
		this.roomId = roomId;
		this.senderUserId = senderUserId;
		this.content = content;
		this.mediaUrl = mediaUrl;
		this.mediaType = mediaType;
		this.isRead = isRead;
		this.readAt = readAt;
		this.createdAt = createdAt;
	}

	public ChatMessage() {
		super();
	}

	// -------- getters & setters --------

    public Long getId() {
        return id;
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

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public String getMediaType() {
        return mediaType;
    }

    public void setMediaType(String mediaType) {
        this.mediaType = mediaType;
    }

    public Boolean getIsRead() {
        return isRead;
    }

    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }

    public OffsetDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(OffsetDateTime readAt) {
        this.readAt = readAt;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

	@Override
	public String toString() {
		return "ChatMessage [id=" + id + ", roomId=" + roomId + ", senderUserId=" + senderUserId + ", content="
				+ content + ", mediaUrl=" + mediaUrl + ", mediaType=" + mediaType + ", isRead=" + isRead + ", readAt="
				+ readAt + ", createdAt=" + createdAt + "]";
	}
    
}

