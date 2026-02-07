package com.urbanmind.urbanmind_auth.dto.response;

import java.time.OffsetDateTime;

public class ProblemResponseDTO {

    private Long id;
    private String title;
    private String description;
    private String status;
    private boolean isAnonymous;

    private String authorName;
    private String authorUsername;
    private String authorAvatar;

    private String city;
    private String state;

    private Integer upvoteCount;
    private Integer commentCount;
    private Integer shareCount;

    public Integer getShareCount() { return shareCount; }
    public void setShareCount(Integer shareCount) { this.shareCount = shareCount; }

    private Boolean donationRequired;
    private java.math.BigDecimal requiredAmount;

    public Boolean getDonationRequired() { return donationRequired; }
    public void setDonationRequired(Boolean donationRequired) { this.donationRequired = donationRequired; }

    public java.math.BigDecimal getRequiredAmount() { return requiredAmount; }
    public void setRequiredAmount(java.math.BigDecimal requiredAmount) { this.requiredAmount = requiredAmount; }

    private java.util.List<String> tags;

    public java.util.List<String> getTags() { return tags; }
    public void setTags(java.util.List<String> tags) { this.tags = tags; }

    private OffsetDateTime createdAt;

    // getters & setters
    private String coverImageUrl;

    public String getCoverImageUrl() {
        return coverImageUrl;
    }
    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }
    private Boolean isLiked;

    @com.fasterxml.jackson.annotation.JsonProperty("isLiked")
    public Boolean getIsLiked() {
        return isLiked;
    }

    public void setIsLiked(Boolean isLiked) {
        this.isLiked = isLiked;
    }


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isAnonymous() { return isAnonymous; }
    public void setAnonymous(boolean isAnonymous) { this.isAnonymous = isAnonymous; }

    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }

    public String getAuthorUsername() { return authorUsername; }
    public void setAuthorUsername(String authorUsername) { this.authorUsername = authorUsername; }

    public String getAuthorAvatar() { return authorAvatar; }
    public void setAuthorAvatar(String authorAvatar) { this.authorAvatar = authorAvatar; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public Integer getUpvoteCount() { return upvoteCount; }
    public void setUpvoteCount(Integer upvoteCount) { this.upvoteCount = upvoteCount; }

    public Integer getCommentCount() { return commentCount; }
    public void setCommentCount(Integer commentCount) { this.commentCount = commentCount; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    private String category;
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    private java.math.BigDecimal amountRaised;
    private Integer progress;
    private Integer teamCount;
    private Long assignedToUserId;
    private String assignedToUserName;

    public java.math.BigDecimal getAmountRaised() { return amountRaised; }
    public void setAmountRaised(java.math.BigDecimal amountRaised) { this.amountRaised = amountRaised; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }

    public Integer getTeamCount() { return teamCount; }
    public void setTeamCount(Integer teamCount) { this.teamCount = teamCount; }

    public Long getAssignedToUserId() { return assignedToUserId; }
    public void setAssignedToUserId(Long assignedToUserId) { this.assignedToUserId = assignedToUserId; }

    public String getAssignedToUserName() { return assignedToUserName; }
    public void setAssignedToUserName(String assignedToUserName) { this.assignedToUserName = assignedToUserName; }
}