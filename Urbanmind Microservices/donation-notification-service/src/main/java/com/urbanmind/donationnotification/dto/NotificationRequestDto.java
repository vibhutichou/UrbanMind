package com.urbanmind.donationnotification.dto;

import jakarta.validation.constraints.*;

public class NotificationRequestDto {
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;
    
    @NotBlank(message = "Message is required")
    private String message;
    
    @NotBlank(message = "Type is required")
    @Size(max = 50)
    private String type;
    
    @NotBlank(message = "Channel is required")
    @Size(max = 30)
    private String channel;
    
    @Size(max = 50)
    private String referenceType;
    
    private Long referenceId;
    
    // Constructors
    public NotificationRequestDto() {}
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public String getChannel() {
        return channel;
    }
    
    public void setChannel(String channel) {
        this.channel = channel;
    }
    
    public String getReferenceType() {
        return referenceType;
    }
    
    public void setReferenceType(String referenceType) {
        this.referenceType = referenceType;
    }
    
    public Long getReferenceId() {
        return referenceId;
    }
    
    public void setReferenceId(Long referenceId) {
        this.referenceId = referenceId;
    }
}
