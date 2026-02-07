package org.urbanmind.UrbanChats.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ChatRoomRequestDto {

    @NotBlank(message = "roomType is required")
    @Size(max = 30, message = "roomType cannot exceed 30 characters")
    private String roomType;

    @NotNull(message = "user1Id is required")
    private Long user1Id;

    @NotNull(message = "user2Id is required")
    private Long user2Id;

    @Size(max = 100, message = "name cannot exceed 100 characters")
    private String name;

    private Long problemId;

    @NotNull(message = "createdByUserId is required")
    private Long createdByUserId;

    // getters & setters

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
}
