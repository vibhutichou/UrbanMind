package org.urbanmind.UrbanChats.DTO;

import java.time.OffsetDateTime;

public class ChatRoomResponseDto {

    private Long id;
    private String roomType;
    private Long user1Id;
    private Long user2Id;
    private String name;
    private Long problemId;
    private Long createdByUserId;
    private OffsetDateTime createdAt;

    // ✅ ADD THESE (UI-focused fields)
    private Long otherUserId;
    private String otherUserRole;   // NGO / VOLUNTEER / CITIZEN / ADMIN
    private String context;         // "Problem Discussion" / "Direct Chat"

    // getters & setters

    public Long getOtherUserId() {
        return otherUserId;
    }

    public void setOtherUserId(Long otherUserId) {
        this.otherUserId = otherUserId;
    }

    public String getOtherUserRole() {
        return otherUserRole;
    }

    public void setOtherUserRole(String otherUserRole) {
        this.otherUserRole = otherUserRole;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getRoomType() {
		return roomType;
	}

	public void setRoomType(String roomType) {
		this.roomType = roomType;
	}

	public Long getUser1Id() {
		return user1Id;
	}

	public void setUser1Id(Long user1Id) {
		this.user1Id = user1Id;
	}

	public Long getUser2Id() {
		return user2Id;
	}

	public void setUser2Id(Long user2Id) {
		this.user2Id = user2Id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getProblemId() {
		return problemId;
	}

	public void setProblemId(Long problemId) {
		this.problemId = problemId;
	}

	public Long getCreatedByUserId() {
		return createdByUserId;
	}

	public void setCreatedByUserId(Long createdByUserId) {
		this.createdByUserId = createdByUserId;
	}

	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(OffsetDateTime createdAt) {
		this.createdAt = createdAt;
	}

    // existing getters/setters stay unchanged
}
