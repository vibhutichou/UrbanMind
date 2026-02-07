package com.urbanmind.urbanmind_auth.entity;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

@Entity
@Table(name = "problems")
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_by_user_id")
    private Long createdByUserId;
    @OneToMany(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", referencedColumnName = "id")
    private List<ProblemMedia> media;

    public List<ProblemMedia> getMedia() {
        return media;
    }

	public void setMedia(List<ProblemMedia> media) {
		this.media = media;
	}

	@Column(name = "assigned_to_user_id")
    private Long assignedToUserId;

    private String title;
    private String description;
    private String category;

    @Column(nullable = false)
    private String status;

    private String severity;
    private String tags;

    @Column(name = "address_line")
    private String addressLine;

    private String city;
    private String state;
    private String country;
    private String pincode;

    @Column(precision = 18, scale = 8)
    private BigDecimal latitude;

    @Column(precision = 18, scale = 8)
    private BigDecimal longitude;

    @Column(name = "upvote_count")
    private Integer upvoteCount = 0;

    @Column(name = "comment_count")
    private Integer commentCount = 0;

    @Column(name = "view_count")
    private Integer viewCount = 0;

    @Column(name = "share_count")
    private Integer shareCount = 0;

    public Integer getShareCount() {
        return shareCount == null ? 0 : shareCount;
    }

    public void setShareCount(Integer shareCount) {
        this.shareCount = shareCount;
    }

    private Boolean isAnonymous = false;
    private Boolean isDonationEnabled = false;

    @Column(precision = 18, scale = 2)
    private BigDecimal targetAmount;

    @Column(name = "donation_required")
    private Boolean donationRequired = false;

    @Column(name = "required_amount", precision = 12, scale = 2)
    private BigDecimal requiredAmount;

    public Boolean getDonationRequired() {
        return donationRequired;
    }

    public void setDonationRequired(Boolean donationRequired) {
        this.donationRequired = donationRequired;
    }

    public BigDecimal getRequiredAmount() {
        return requiredAmount;
    }

    public void setRequiredAmount(BigDecimal requiredAmount) {
        this.requiredAmount = requiredAmount;
    }

    @Column(precision = 18, scale = 2)
    private BigDecimal amountRaised;

    @Column(name = "progress")
    private Integer progress = 0;

    @Column(name = "team_count")
    private Integer teamCount = 0;

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public Integer getTeamCount() {
        return teamCount;
    }

    public void setTeamCount(Integer teamCount) {
        this.teamCount = teamCount;
    }

    @Transient
    private Boolean isLiked = false;

    public Boolean getIsLiked() {
        return isLiked;
    }
    public void setIsLiked(Boolean isLiked) {
        this.isLiked = isLiked;
    }

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Column(name = "closed_at")
    private OffsetDateTime closedAt;

    // getters and setters (unchanged)

    // getters and setters
    
    
    
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Long getCreatedByUserId() {
		return createdByUserId;
	}
	public void setCreatedByUserId(Long createdByUserId) {
		this.createdByUserId = createdByUserId;
	}
	public Long getAssignedToUserId() {
		return assignedToUserId;
	}
	public void setAssignedToUserId(Long assignedToUserId) {
		this.assignedToUserId = assignedToUserId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getCategory() {
		return category;
	}
	public void setCategory(String category) {
		this.category = category;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getSeverity() {
		return severity;
	}
	public void setSeverity(String severity) {
		this.severity = severity;
	}
	public String getTags() {
		return tags;
	}
	public void setTags(String tags) {
		this.tags = tags;
	}
	public String getAddressLine() {
		return addressLine;
	}
	public void setAddressLine(String addressLine) {
		this.addressLine = addressLine;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getPincode() {
		return pincode;
	}
	public void setPincode(String pincode) {
		this.pincode = pincode;
	}
	public BigDecimal getLatitude() {
		return latitude;
	}
	public void setLatitude(BigDecimal latitude) {
		this.latitude = latitude;
	}
	public BigDecimal getLongitude() {
		return longitude;
	}
	public void setLongitude(BigDecimal longitude) {
		this.longitude = longitude;
	}
	    public Integer getUpvoteCount() {
        return upvoteCount == null ? 0 : upvoteCount;
    }
    public void setUpvoteCount(Integer upvoteCount) {
        this.upvoteCount = upvoteCount;
    }
    public Integer getCommentCount() {
        return commentCount == null ? 0 : commentCount;
    }
    public void setCommentCount(Integer commentCount) {
        this.commentCount = commentCount;
    }
	public Integer getViewCount() {
		return viewCount;
	}
	public void setViewCount(Integer viewCount) {
		this.viewCount = viewCount;
	}
	public Boolean getIsAnonymous() {
		return isAnonymous;
	}
	public void setIsAnonymous(Boolean isAnonymous) {
		this.isAnonymous = isAnonymous;
	}
	public Boolean getIsDonationEnabled() {
		return isDonationEnabled;
	}
	public void setIsDonationEnabled(Boolean isDonationEnabled) {
		this.isDonationEnabled = isDonationEnabled;
	}
	public BigDecimal getTargetAmount() {
		return targetAmount;
	}
	public void setTargetAmount(BigDecimal targetAmount) {
		this.targetAmount = targetAmount;
	}
	public BigDecimal getAmountRaised() {
		return amountRaised;
	}
	public void setAmountRaised(BigDecimal amountRaised) {
		this.amountRaised = amountRaised;
	}
	public OffsetDateTime getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(OffsetDateTime createdAt) {
		this.createdAt = createdAt;
	}
	public OffsetDateTime getUpdatedAt() {
		return updatedAt;
	}
	public void setUpdatedAt(OffsetDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
	public OffsetDateTime getClosedAt() {
		return closedAt;
	}
	public void setClosedAt(OffsetDateTime closedAt) {
		this.closedAt = closedAt;
	}

}